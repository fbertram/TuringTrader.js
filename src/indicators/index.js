//==============================================================================
// Name:        indicators/index
// Description: indicators interfaces for simple numbers and OHLCV.
// History:     FUB, 2021iii23, created
//==============================================================================

import { IndicatorsOHLCV } from "./ohlcv"
import { IndicatorsTrend } from "./trend"

export const IndicatorsNum = (sim, id0, promise0) => ({
    //---------- properties
    get id() {
        return id0
    },
    get data() {
        return promise0
    },

    //---------- methods
    t: (offset) => {
        // NOTE: an indicator's time series may have a different length
        // than the simulator's, e.g. monthly bars. Therefore, we need
        // to spend some effort here to find the correct index
        return promise0
            .then(data => {
                const simTime = sim.t(0)
                let idxNow = 0
                // TODO: need to optimize this
                for (let i = 0; i < data.t.length; i++) {
                    if (data.t[i] <= simTime)
                        idxNow = i
                    else
                        break
                }

                const idxOffset = Math.min(data.t.length - 1,
                    Math.max(0, idxNow - offset))

                return data.x[idxOffset]
            })
    },
    ...IndicatorsTrend(sim, id0, promise0),
})

//------------------------------------------------------------------------------
export const IndicatorsBar = (sim, id0, promise0) => ({
    get id() {
        return id0
    },
    get data() {
        return promise0
    },
    ...IndicatorsOHLCV(sim, id0, promise0),
})

//==============================================================================
// end of file
