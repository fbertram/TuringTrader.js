//==============================================================================
// Name:        data/index
// Project:     TuringTrader.js
// Description: data source wrapper.
// History:     FUB, 2021iv30, created
//==============================================================================

import { Indicators } from "../indicators"
import sampleData from "./spy.json"

export const loadAsset = (sim, name) => {
    sim.info(`loadData(${name})`)

    return {
        allData: "hello from loadAsset",
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
}

//==============================================================================
// end of file
