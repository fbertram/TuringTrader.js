//==============================================================================
// Name:        data/index
// Description: data source wrapper.
// History:     FUB, 2021iii23, created
//==============================================================================

import { Indicators } from "../indicators"
import sampleData from "./spy.json"

export const loadData = (sim, args) => {
    const data = sim.cacheData(null, `loadData(${args.symbol})`, (cacheId) => {
        sim.info(`processing ${cacheId}`)

        return {
            cacheId,
            data: new Promise(resolve => {
                setTimeout(() => {
                    sim.info(`finished ${cacheId}`)
                    resolve(sampleData)
                }, 3000)
            })
        }
    })

    return {
        data,
        ...Indicators(sim, data),
    }
}

//==============================================================================
// end of file
