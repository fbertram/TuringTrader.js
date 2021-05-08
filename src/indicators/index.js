//==============================================================================
// Name:        indicators/index
// Description: indicators interfaces for simple numbers and OHLCV.
// History:     FUB, 2021iii23, created
//==============================================================================

import { IndicatorsOHLCV } from "./ohlcv"
import { IndicatorsTrend } from "./trend"

export const IndicatorsNum = (sim, id0, promise0) => ({
    get id() {
        return id0
    },
    get data() {
        return promise0
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
