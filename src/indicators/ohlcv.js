//==============================================================================
// Name:        indicators/ohlcv
// Description: Indicators on OHLCV bars.
// History:     FUB, 2021v07, created
//==============================================================================

import { IndicatorsNum } from ".";

export const IndicatorsOHLCV = (sim, id0, promise0) => ({

    get open() {
        const id = `${id0}.open`

        return sim.cache(
            id,
            () => IndicatorsNum(
                sim, id,
                promise0
                    .then(data => ({
                        t: data.t,
                        x: data.o,
                    }))
            )
        )
    },

    //----------------------------------------
    get high() {
        const id = `${id0}.high`

        return sim.cache(
            id,
            () => IndicatorsNum(
                sim, id,
                promise0
                    .then(data => ({
                        t: data.t,
                        x: data.h,
                    }))
            )
        )
    },

    //----------------------------------------
    get low() {
        const id = `${id0}.low`

        return sim.cache(
            id,
            () => IndicatorsNum(
                sim, id,
                promise0
                    .then(data => ({
                        t: data.t,
                        x: data.l,
                    }))
            )
        )
    },

    //----------------------------------------
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

    //----------------------------------------
    get volume() {
        const id = `${id0}.volume`

        return sim.cache(
            id,
            () => IndicatorsNum(
                sim, id,
                promise0
                    .then(data => ({
                        t: data.t,
                        x: data.v,
                    }))
            )
        )
    },
})

//==============================================================================
// end of file
