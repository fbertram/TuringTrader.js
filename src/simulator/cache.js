//==============================================================================
// Name:        simulator/cache
// Project:     TuringTrader.js
// Description: simulator cache for asset quotes and 'automagic' indicators.
// History:     FUB, 2021v01, created
//==============================================================================

export const cacheResult = (sim, id, fn) => {
    const result = sim.cache[id] ?? (sim.cache[id] = fn())
    return result
}

//==============================================================================
// end of file
