//==============================================================================
// Name:        simulator/cache
// Description: simulator cache: used for 'automagic' indicators
// History:     FUB, 2021iii23, created
//==============================================================================

TODO: 
* rename clearCache to cacheClear
* rename cacheData to cacheAsync
* make cacheAsync return a Promise
* await the parent
* possibly run fn asynchronously


export const clearCache = (sim) => {
    sim.setProperty("cache", {})
}

export const cacheData = (sim, args) => {
    const cacheId = args.parent
        ? `${args.parent}|${args.child}`
        : `${args.child}`

    const cache = sim.getProperty("cache")

    if (!(cacheId in cache)) cache[cacheId] = args.fn(cacheId)

    return cache[cacheId]
}

//==============================================================================
// end of file
