//==============================================================================
// Name:        indicators/trend
// Description: trend indicators.
// History:     FUB, 2021v07, created
//==============================================================================

import { IndicatorsNum } from "."

export const IndicatorsTrend = (sim, id0, promise0) => ({
    sma: (length) => {
        const id = `${id0}.sma(${length})`

        return sim.cache(id, () =>
            IndicatorsNum(
                sim,
                id,
                promise0.then((data) => {
                    const b = []
                    let s = 0.0
                    return {
                        t: data.t,
                        x: data.x.map((v) => {
                            s += v
                            b.push(v)
                            while (b.length > length) {
                                s -= b[0]
                                b.shift()
                            }
                            return s / b.length
                        }),
                    }
                })
                // FIXME: catch here
            )
        )
    },

    //----------------------------------------
    ema: (length) => {
        const id = `${id0}.ema(${length})`

        return sim.cache(id, () =>
            IndicatorsNum(
                sim,
                id,
                promise0.then((data) => {
                    const a = 2.0 / (length + 1.0)
                    let x = data.x[0]
                    return {
                        t: data.t,
                        x: data.x.map((v) => a * (v - x) + x),
                    }
                })
                // FIXME: catch here
            )
        )
    },

    //----------------------------------------
    // dema
    // tema
    // zlema
    // kama
    // macd
})

//==============================================================================
// end of file
