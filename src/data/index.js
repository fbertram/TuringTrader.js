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

            let ri = 0
            st.forEach((t) => {
                if (t < rawData.t[ri]) {
                    // simulator timestamp earlier than raw data
                    // => fill OHLCV w/ next open
                    data.o.push(rawData.o[ri])
                    data.h.push(rawData.o[ri])
                    data.l.push(rawData.o[ri])
                    data.c.push(rawData.o[ri])
                    data.v.push(0.0)
                } else {
                    // simulator timestamp ahead of raw data
                    // => advance raw data to catch up
                    const riBefore = ri
                    while (ri < rawData.t.length - 1 && t >= rawData.t[ri + 1])
                        ri++
                    const advancedSource = ri != riBefore

                    // now ri should point to the last bar *before* and
                    // ri+1 to the first bar *after* the simulator timestamp

                    if (advancedSource === true || ri === 0) {
                        // did not reach end of raw data, yet
                        // => fill OHLCV w/ most-recent bar
                        data.o.push(rawData.o[ri])
                        data.h.push(rawData.h[ri])
                        data.l.push(rawData.l[ri])
                        data.c.push(rawData.c[ri])
                        data.v.push(rawData.v[ri])
                    } else {
                        // reached end of raw data
                        // => fill OHLCV w/ last close
                        data.o.push(rawData.c[ri])
                        data.h.push(rawData.c[ri])
                        data.l.push(rawData.c[ri])
                        data.c.push(rawData.c[ri])
                        data.v.push(0.0)
                    }
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
