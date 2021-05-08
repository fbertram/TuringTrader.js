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
            const c = getProperty("tradingCalendar")
            c.startDate = getProperty("startDate")
            c.endDate = getProperty("endDate")
            return c.tradingDays
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
            for (let i = 0; i < r.length; i++) {
                setProperty("simTimeIndex", i)
                await fn()
            }
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

    const run = (sim) => algo.run(internalInterface)
    const report = (sim) => algo.report(internalInterface)

    return externalInterface
}

//==============================================================================
// end of file
