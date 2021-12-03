//==============================================================================
// Name:        simulator/index
// Project:     TuringTrader.js
// Description: simulator core.
// History:     FUB, 2021iv30, created
//==============================================================================

import { createTradingCalendarUS } from "./trading-calendar-us"
import { loadAsset } from "../data"

export const createSimulator = (algo) => {
    const data = {
        tradingCalendar: algo.calendar ?? createTradingCalendarUS(),
        cache: {},
    }

    const state = {
        tradingDays: null,
        tradingDayIndex: null,
        cash: 0.0,
        positions: {},
    }

    //========== internal interface: methods available to algorithms

    const internalInterface = {
        //----- properties
        get startDate() {
            return data.tradingCalendar.startDate
        },
        set startDate(d) {
            data.tradingCalendar.startDate = d
        },
        get endDate() {
            return data.tradingCalendar.endDate
        },
        set endDate(d) {
            data.tradingCalendar.endDate = d
        },
        get tradingCalendar() {
            return data.tradingCalendar
        },
        get cache() {
            return data.cache
        },
        orderTypes: {
            // NOTE: the values correspond to the
            // sequence of order execution
            mktThisClose: 0,
            mktNextOpen: 1,
            limNextBar: 2,
            stpNextBar: 3,
        },
        get nav() {},
        get result() {
            return getProperty("result")
        },
        //----- methods
        info: (...args) => console.log("INFO: ", args),
        asset: (name) => loadAsset(internalInterface, name, algo.data),
        cache: (id, fn) => data.cache[id] ?? (data.cache[id] = fn()),

        loop: async (fn) => {
            state.tradingDays = internalInterface.tradingCalendar.tradingDays
            state.nextTradingDay = internalInterface.tradingCalendar.nextTradingDay

            const result = {
                t: [],
                // we populate the next bar's open on this bar's close
                // therefore, we never get to populate the first bar's open
                o: [state.cash],
                // we can't produce meaningful high and low values.
                // therefore, we just skip them.
                c: [],
                // these are the asset allocations on open and close
                // limit and stop orders are reflected in the close
                oAlloc: [{ticker: [], weight: []}],
                cAlloc: [],
                // this flag indicates rebalancing dates. mktNextOpen
                // orders are reflected on the previous close because
                // that's when they've been submitted
                fAlloc: [],
            }

            for (const i in state.tradingDays) {
                // NOTE: this loop is processed strictly
                // in order to avoid any issues w/ the
                // simulator's state

                state.tradingDayIndex = i
                const isLastTradingDay = Number(i) === (state.tradingDays.length - 1)
                const orders = await fn()

                // set flag to indicate rebalancing dates
                result.fAlloc.push(orders?.length > 0 ? 1 : 0)

                // make sure we have a position for each
                // asset affected by the order basket
                for (const oi in orders) {
                    const o = orders[oi]
                    const ticker = await o.ticker
                    if (!(ticker in state.positions)) {
                        state.positions[ticker] = {
                            qty: 0.0,
                            data: o.data,
                        }
                    }
                }

                // process the orders in the sequence of execution.
                // note that we don't know the sequence of limit
                // and stop orders
                for (const ti in internalInterface.orderTypes) {
                    // find the relevant asset prices
                    const prices = {}
                    for (const ticker in state.positions) {
                        // all order types except mktThisClose
                        // use the prices at open of next bar
                        prices[ticker] =
                            internalInterface.orderTypes[ti] === internalInterface.orderTypes.mktThisClose
                                ? await state.positions[ticker].data.close.t(0)
                                : await state.positions[ticker].data.open.t(-1)
                    }

                    // calculate NAV
                    const nav = Object.keys(state.positions).reduce(
                        (acc, ticker) => acc + state.positions[ticker].qty * prices[ticker],
                        state.cash
                    )

                    // process orders
                    for (const oi in orders) {
                        const o = {...orders[oi]}

                        // on last bar, we execute mktNextOpen as mktThisClose
                        if (isLastTradingDay === true && 
                            o.type === internalInterface.orderTypes.mktNextOpen
                        ) {
                            o.type = internalInterface.orderTypes.mktThisClose
                        }

                        // only execute orders of type we are currently processing
                        if (o.type !== internalInterface.orderTypes[ti])
                            continue

                        const ticker = await o.ticker
                        const qtyCurrent = state.positions[ticker].qty
                        const qtyNew = (o.alloc * nav) / prices[ticker]

                        const cashFlow = (qtyNew - qtyCurrent) * prices[ticker]

                        // ignore orders smaller than 0.1% of NAV
                        if (Math.abs(cashFlow / nav) > 1e-3) {
                            // TODO: consider commissions here
                            state.cash -= cashFlow
                            state.positions[ticker].qty = qtyNew
                        }
                    }

                    // TODO: remove positions < 0.1% of NAV

                    // save NAV & allocations
                    if (
                        internalInterface.orderTypes[ti] ===
                        internalInterface.orderTypes.mktThisClose
                    ) {
                        result.t.push(internalInterface.t(0))
                        result.c.push(nav)

                        const alloc = { ticker: [], weight: []}
                        for (const ticker in state.positions) {
                            alloc.ticker.push(ticker)
                            alloc.weight.push(state.positions[ticker].qty * prices[ticker] / nav)
                        }
                        result.cAlloc.push(alloc)
                    } else if (
                        isLastTradingDay !== true && 
                        internalInterface.orderTypes[ti] ===
                        internalInterface.orderTypes.mktNextOpen
                    ) {
                        // simData.t added while processing mktThisClose
                        result.o.push(nav)

                        const alloc = { ticker: [], weight: []}
                        for (const ticker in state.positions) {
                            alloc.ticker.push(ticker)
                            alloc.weight.push(state.positions[ticker].qty * prices[ticker] / nav)
                        }
                        result.oAlloc.push(alloc)
                    }

                    //internalInterface.info(`${internalInterface.t(0)}: ${nav}`)
                }
            }

            return result
        },

        t: (offset) => {
            // this is the raw index into the tradingDays array
            const rawIndex = state.tradingDayIndex - offset

            // if the index is -1, we return the 
            // next trading day *after* the sim range
            if (rawIndex === state.tradingDays.length)
                return state.nextTradingDay

            const index = Math.min(
                state.tradingDays.length - 1,
                Math.max(0, rawIndex)
            )
            return state.tradingDays[index]
        },

        deposit: (amount) => {
            state.cash += amount
        },
    }

    //========== external interface: methods called on the simulator instance

    const externalInterface = {
        run: async () => {
            const result = await algo.run(internalInterface)

            // optional: load additional assets (benchmark, risk-free rate)
            for (const key in algo.extra) {
                const ticker = algo.extra[key]
                const data = await loadAsset(internalInterface, ticker, algo.data)
                    .data
                result[key] = {
                    meta: {
                        ticker: data.meta.ticker,
                    },
                    c: data.c,
                }
            }

            return result
        },
        report: () => algo.report(internalInterface),
    }

    return externalInterface
}

//==============================================================================
// end of file
