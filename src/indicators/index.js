//==============================================================================
// Name:        indicators/index
// Description: indicators interfaces for simple numbers and OHLCV.
// History:     FUB, 2021iii23, created
//==============================================================================

//import { Indicators } from "../indicators"
//import { SMA as _sma } from "./sma"

export const IndicatorsNum = (sim, id0, promise0) => ({
    get data() {
        return promise0
    },
})

export const IndicatorsBar = (sim, id0, promise0) => ({
    get data() {
        return promise0
    },
    get close() {
        const id = `${id0}.close`

        return sim.cache(
            id, 
            () => IndicatorsNum(
                sim, id, 
                promise0
                    .then(data => ({
                        t: data.t,
                        x: data.c,
                    }))
            )
        )
    },
})

//==============================================================================
// end of file
