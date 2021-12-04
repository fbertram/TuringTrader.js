//==============================================================================
// Name:        data/index
// Project:     TuringTrader.js
// Description: data source wrapper.
// History:     FUB, 2021iv30, created
//==============================================================================

import { IndicatorsBar } from "../indicators"
import { loadAssetFromYahoo } from "./yahoo"

export const loadAsset = (sim, name, customLoaderFn) => {
    const id = `loadAsset(${name},${sim.startDate.getTime()},${sim.endDate.getTime()})`

    const loadData = () => {
        const dataLoaderFn = customLoaderFn ?? loadAssetFromYahoo
        const data = dataLoaderFn(sim, name).then((rawData) => {
            // simulator timestamps
            const st = sim.tradingCalendar.tradingDays

            // setup resampled data
            const data = {
                meta: rawData.meta,
                t: st,
                o: [],
                h: [],
                l: [],
                c: [],
                v: [],
            }

            // BUGBUG: this code will fail, if there are no data
            // within the requested range

            let ri = -1 // ri is the index of the last *consumed* bar
            st.forEach((t) => {
                // advance raw data to catch up with simulator
                const ri0 = ri
                while (ri < rawData.t.length - 1 && rawData.t[ri + 1] <= t)
                    ri++
                const consumedData = ri0 !== ri

                if (t < rawData.t[0]) {
                    // simulator timestamp before start of raw data
                    // => fill OHLCV w/ first open
                    data.o.push(rawData.o[0])
                    data.h.push(rawData.o[0])
                    data.l.push(rawData.o[0])
                    data.c.push(rawData.o[0])
                    data.v.push(0.0)
                } else if (consumedData === true) {
                    // consumed data
                    // => fill OHLCV w/ resampled bar
                    data.o.push(rawData.o[ri])
                    data.h.push(rawData.h[ri])
                    data.l.push(rawData.l[ri])
                    data.c.push(rawData.c[ri])
                    data.v.push(rawData.v[ri])

                    if (ri === 0) data.meta.firstT = t
                    if (ri === rawData.t.length - 1) data.meta.lastT = t
                } else {
                    // consumed no data
                    // => fill OHLCV w/ previous close
                    data.o.push(rawData.c[ri])
                    data.h.push(rawData.c[ri])
                    data.l.push(rawData.c[ri])
                    data.c.push(rawData.c[ri])
                    data.v.push(0.0)
                }
            })

            return data
        })

        return data
    }

    return sim.cache(id, () => IndicatorsBar(sim, id, loadData()))
}

//==============================================================================
// end of file
