//==============================================================================
// Name:        simulator/cache
// Project:     TuringTrader.js
// Description: simulator cache for asset quotes and 'automagic' indicators.
// History:     FUB, 2021v01, created
//==============================================================================

export const cacheClear = (sim) => sim.setProperty("cache", {})

export const cacheResult = (sim, id, fn) => {
    const cache = sim.getProperty("cache") ?? cacheClear(sim)

    const result = cache[id] ?? (cache[id] = fn())

    return result
}

//==============================================================================
// end of file
