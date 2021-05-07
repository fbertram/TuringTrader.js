//==============================================================================
// Name:        data/index
// Project:     TuringTrader.js
// Description: data source wrapper.
// History:     FUB, 2021iv30, created
//==============================================================================

import { IndicatorsBar } from "../indicators"
import { loadAssetFromYahoo } from "./yahoo"

export const getAsset = (sim, name) => {
    const id = `loadAsset(${name}, ${sim.startDate.getTime()}, ${sim.endDate.getTime()})`

    return sim.cache(
        id, 
        () => IndicatorsBar(
            sim,
            id,
            loadAssetFromYahoo(sim, name)
        )
    )
}

//==============================================================================
// end of file
