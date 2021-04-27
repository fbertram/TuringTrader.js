//==============================================================================
// Name:        indicators/index
// Description: indicators interfaces for simple numbers and OHLCV.
// History:     FUB, 2021iii23, created
//==============================================================================

import { SMA as _sma } from "./sma"

export const Indicators = (sim, src) => ({
    SMA: (length) => _sma({ ...sim, args: { src, length } }),
})

export const IndicatorsOHLCV = (sim) => ({
    // TODO!
})

//==============================================================================
// end of file
