//==============================================================================
// Name:        data/index
// Project:     TuringTrader.js
// Description: data source wrapper.
// History:     FUB, 2021iv30, created
//==============================================================================

import { Indicators } from "../indicators"
import sampleData from "./spy.json"
import { loadAssetFromYahoo } from "./yahoo"

export const getAsset = (sim, name) => {
    const id = `loadAsset(${name}, ${sim.startDate.getTime()}, ${sim.endDate.getTime()})`

    const loadAsset = (sim, name) => {
        const promise = loadAssetFromYahoo(sim, name)

        return {
            id,
            get allData() {
                return promise
            },

            /*get allData() {
                // see https://medium.com/trabe/async-getters-and-setters-is-it-possible-c18759b6f7e4
                return (async () => {
                    try {
                        //sim.info("waiting")
                        const x = await promise
                        sim.info(`got ${x}`)
                        return x
                        return await promise
                    } catch(e) {
                        return null
                    }
                })()
            },*/
        }
    }

    return sim.cache(id, () => loadAsset(sim, name))
}

//==============================================================================
// end of file
