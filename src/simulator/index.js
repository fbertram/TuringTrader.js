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
        positions: {}
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
        get nav() {
        },
        get result() {
            return getProperty("result")
        },
        //----- methods
        info: (...args) => console.log("INFO: ", args),
        asset: (name) => loadAsset(internalInterface, name, algo.data),
        cache: (id, fn) => data.cache[id] ?? (data.cache[id] = fn()),

        loop: async (fn) => {
            state.tradingDays = internalInterface.tradingCalendar.tradingDays

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
                oAlloc: [],
                cAlloc: [],
            }

            for (let i = 0; i < state.tradingDays.length; i++) {

                // NOTE: this loop is processed strictly
                // in order to avoid any issues w/ the
                // simulator's state

                state.tradingDayIndex = i
                const orders = await fn()

                // make sure we have a position for each
                // asset affected by the order basket
                for (const oi in orders) {
                    const o = orders[oi]
                    if (!(o.id in state.positions)) {
                        state.positions[o.id] = {
                            qty: 0.0,
                            data: o.data,
                        }
                    }
                }

                // FIXME: if this is the last bar, switch mktNextOpen orders
                // to mktThisClose. This is to make sure the final target 
                // asset allocation matches the orders as close as possible

                // process the orders in the sequence of execution.
                // note that we don't know the sequence of limit 
                // and stop orders
                for (let ti = 0; ti < internalInterface.orderTypes.length; ti++) {

                    // find the relevant asset prices
                    const prices = {}
                    for (const p in state.positions) {
                        // all order types except mktThisClose
                        // use the prices at open of next bar
                        prices[p] = ti === internalInterface.orderTypes.mktThisClose ?
                            (await state.positions[p].data.close.t(0)) :
                            (await state.positions[p].data.open.t(-1))
                    }

                    // calculate and save nav
                    const nav = Object.keys(state.positions).reduce(
                        (acc, p) => acc + state.positions[p].qty * prices[p],
                        state.cash)

                    // process orders
                    for (const oi in orders) {
                        const o = orders[oi]
                        if (o.type !== ti)
                            continue

                        const qtyCurrent = state.positions[o.id].qty
                        const qtyNew = o.alloc * nav / prices[o.id]

                        const cashFlow = (qtyNew - qtyCurrent) * prices[o.id]

                        // ignore orders smaller than 0.1% of NAV
                        if (Math.abs(cashFlow / nav) > 1e-3) {
                            // TODO: consider commissions here
                            state.cash -= cashFlow
                            state.positions[o.id].qty = qtyNew    
                        }
                    }

                    // save nav & allocations
                    if (ti === internalInterface.orderTypes.mktThisClose) {
                        result.t.push(internalInterface.t(0))
                        result.c.push(nav)

                        const alloc = []
                        for (const p in state.positions) {
                            alloc.push({sym: p, alloc: state.positions[p].qty * prices[p] / nav})
                        }
                        result.cAlloc.push(alloc)
                    } else if (ti === internalInterface.orderTypes.mktNextOpen) {
                        // simData.t added while processing mktThisClose
                        result.o.push(nav)

                        const alloc = []
                        for (const p in state.positions) {
                            alloc.push({sym: p, alloc: state.positions[p].qty * prices[p] / nav})
                        }
                        result.oAlloc.push(alloc)
                    }

                    //internalInterface.info(`${internalInterface.t(0)}: ${nav}`)
                }
            }

            // save simulation result
            data.result = result
        },

        t: (offset) => {
            // TODO: it would be helpful to look further than the sim range
            // use case: we want to know the next trading date, so that
            // we can determine the last trading day of the month
            // it should be possible to do this, by using a larger range for
            // the sim time range
            const i = Math.min(state.tradingDays.length - 1,
                Math.max(0, state.tradingDayIndex - offset))
            return state.tradingDays[i]
        },

        deposit: (amount) => {
            state.cash += amount
        }
    }

    //========== external interface: methods called on the simulator instance

    const externalInterface = {
        run: () => algo.run(internalInterface),
        report: () => algo.report(internalInterface)
    }

    return externalInterface
}

//==============================================================================
// end of file
