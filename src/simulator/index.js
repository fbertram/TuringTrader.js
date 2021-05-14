//==============================================================================
// Name:        simulator/index
// Project:     TuringTrader.js
// Description: simulator core.
// History:     FUB, 2021iv30, created
//==============================================================================

import { createTradingCalendarUS } from "./trading-calendar-us"
import { getAsset } from "../data"
import { cacheResult } from "./cache"

export const createSimulator = (algo) => {
    const data = {
        tradingCalendar: createTradingCalendarUS(),
    }

    const state = {
        cash: 0.0,
        positions: {}
    }

    //========== internal interface: methods called inside algorithms

    const internalInterface = {
        //----- properties
        get startDate() {
            return getProperty("startDate")
        },
        set startDate(d) {
            setProperty("startDate", d)
        },
        get endDate() {
            return getProperty("endDate")
        },
        set endDate(d) {
            setProperty("endDate", d)
        },
        get tradingDays() {
            // FIXME: we should probably remove this method
            const c = getProperty("tradingCalendar")
            c.startDate = getProperty("startDate")
            c.endDate = getProperty("endDate")
            return c.tradingDays
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
        // TODO: can we move all methods up here?
        getProperty: (name) => getProperty(name),
        setProperty: (name, value) => setProperty(name, value),
        info: (...args) => info(args),
        asset: (name) => asset(name),
        cache: (id, fn) => cache(id, fn),

        loop: async (fn) => {
            const r = internalInterface.tradingDays
            setProperty("simTimeRange", r)

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

            for (let i = 0; i < r.length; i++) {

                // NOTE: this loop is processed strictly
                // in order to avoid any issues w/ the
                // simulator's state

                setProperty("simTimeIndex", i)
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

                // process the orders in the sequence of execution.
                // note that we don't know the sequence of limit 
                // and stop orders
                for (let ti = 0; ti < 4; ti++) {

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
            setProperty("result", result)
        },

        t: (offset) => {
            // TODO: it would be helpful to look further than the sim range
            // use case: we want to know the next trading date, so that
            // we can determine the last trading day of the month
            // it should be possible to do this, by using a larger range for
            // the sim time range
            const r = getProperty("simTimeRange")
            const i = Math.min(r.length - 1,
                Math.max(0, getProperty("simTimeIndex") - offset))
            return r[i]
        },

        deposit: (amount) => {
            state.cash += amount
        }
    }

    const setProperty = (name, value) => (data[name] = value)
    const getProperty = (name) => data[name]
    const info = (args) => console.log("INFO: ", args)
    const asset = (name) => getAsset(internalInterface, name)
    const cache = (id, fn) => cacheResult(internalInterface, id, fn)

    //========== external interface: methods called on simulator instance

    const externalInterface = {
        run: (sim) => run(sim),
        report: (sim) => report(sim),
    }

    const run = async (sim) => { 
        await algo.run(internalInterface)
        return getProperty("result")
    }
    const report = (sim) => algo.report(internalInterface)

    return externalInterface
}

//==============================================================================
// end of file
