//==============================================================================
// Name:        indicators/sma
// Description: simple moving average indicator.
// History:     FUB, 2021iii23, created
//==============================================================================

import { Indicators } from "."

export const SMA = (sim) => {
    const data = sim.cacheData(
        sim.args.src.cacheId,
        `SMA(${sim.args.length})`,
        async (cacheId) => {
            sim.info(`waiting for ${sim.args.src.cacheId}`)
            const src = await sim.args.src.data
            sim.info(`processing ${cacheId}`)
            return {
                cacheId,
                data: new Promise(resolve => {
                    //const src = await sim.args.src.data
                    setTimeout(() => {
                        sim.info(`finished ${cacheId}`)
                        resolve("hello!")
                    }, 3000)
                })
            }
        }
    )

    return {
        data,
        ...Indicators(sim, data),
    }
}

//==============================================================================
// end of file
