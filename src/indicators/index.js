//==============================================================================
// Name:        indicators/index
// Description: indicators interfaces for simple numbers and OHLCV.
// History:     FUB, 2021iii23, created
//==============================================================================

import { IndicatorsOHLCV } from "./ohlcv"
import { IndicatorsTrend } from "./trend"

export const IndicatorsNum = (sim, id0, promise0) => {

    let lookup = null

    return {
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

            return promise0.then((data) => {
                const simTime = sim.t(0).getTime()
                if (!lookup) {
                    lookup = {}
                    data.t.forEach((t, idx) => lookup[t.getTime()] = idx)
                }
                const idxNow = lookup[simTime]
                //const idxNow = data.t.findIndex((t) => t.getTime() === simTime)

                const idxOffset = Math.min(
                    data.t.length - 1,
                    Math.max(0, idxNow - offset)
                )

                return data.x[idxOffset]
            })
        },
        ...IndicatorsTrend(sim, id0, promise0),
    }
}

//------------------------------------------------------------------------------
export const IndicatorsBar = (sim, id0, promise0) => ({
    get id() {
        return id0
    },
    get data() {
        return promise0
    },
    alloc: (alloc, type, price) => ({
        time: sim.t(0),
        id: id0,
        data: IndicatorsOHLCV(sim, id0, promise0),
        alloc,
        type,
        price,
    }),
    ...IndicatorsOHLCV(sim, id0, promise0),
})

//==============================================================================
// end of file
