//==============================================================================
// Name:        data/index
// Project:     TuringTrader.js
// Description: data source wrapper.
// History:     FUB, 2021iv30, created
//==============================================================================

import { Indicators } from "../indicators"
import sampleData from "./spy.json"

export const getAsset = (sim, name) => {
    const id = `loadAsset(${name}, ${sim.startDate}, ${sim.endDate})`

    const loadAsset = (name, startDate, endDate) => {
        sim.info(id)
        return {
            allData: "hello from loadAsset",
        }    
    }

    return sim.cache(id, () => loadAsset())
}

    /*const data = sim.cacheData(null, `loadData(${args.symbol})`, (cacheId) => {
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
    }*/

//==============================================================================
// end of file
