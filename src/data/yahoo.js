//==============================================================================
// Name:        data/yahoo
// Project:     TuringTrader.js
// Description: data source for Yahoo! finance.
// History:     FUB, 2021v02, created
//==============================================================================

import fetch from "node-fetch"

export const loadAssetFromYahoo = (sim, name) => {
    // TODO: we might need to do some mapping here
    const ticker = name

    // NOTE: JS has epochs in milliseconds, Yahoo expects seconds
    const period1 = Math.trunc(sim.startDate.getTime() / 1000)
    const period2 = Math.trunc(sim.endDate.getTime() / 1000)
    const url = `http://l1-query.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&period1=${period1}&period2=${period2}`

    // see https://developers.google.com/web/updates/2015/03/introduction-to-fetch
    const status = (response) => {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    }

    const json = (response) => {
        return response.json()
    }

    const promise = fetch(url)
        .then(status)
        .then(json)
        .then((response) => {
            // simulator timestamps
            const st = sim.tradingDays

            // raw data from Yahoo
            // timestamp is at exchange open (9:30 am, New York)
            const ym = response.chart.result[0].meta
            const yt = response.chart.result[0].timestamp
            const yo = response.chart.result[0].indicators.quote[0].open
            const yh = response.chart.result[0].indicators.quote[0].high
            const yl = response.chart.result[0].indicators.quote[0].low
            const yc = response.chart.result[0].indicators.quote[0].close
            const yv = response.chart.result[0].indicators.quote[0].volume
            const yac = response.chart.result[0].indicators.adjclose[0].adjclose

            const o = []
            const h = []
            const l = []
            const c = []
            const v = []
            let yi = 0

            // BUGBUG: this code will fail, if there are no data
            // within the requested range

            st.forEach((tt) => {
                const t = Math.trunc(tt.getTime() / 1000)

                if (t < yt[yi]) {
                    // simulator timestamp before yahoo
                    // => fill OHLCV w/ next open
                    const f = yac[yi] / yc[yi]
                    o.push(f * yo[yi])
                    h.push(f * yo[yi])
                    l.push(f * yo[yi])
                    c.push(yac[yi])
                    v.push(0.0)
                } else if (t >= yt[yi]) {
                    // simulator timestamp ahead of yahoo
                    // => advance as far as possible
                    let advancedSource = false
                    while (yi < yt.length - 1 && t >= yt[yi + 1]) {
                        yi++
                        advancedSource = true
                    }

                    // now yi should point to the last bar *before* and
                    // yi+1 to the first bar *after* the simulator timestamp

                    if (advancedSource === true || yi === 0) {
                        // did not reach end of yahoo data, yet
                        // => fill OHLCV w/ most-recent bar
                        const f = yac[yi] / yc[yi]
                        o.push(f * yo[yi])
                        h.push(f * yh[yi])
                        l.push(f * yl[yi])
                        c.push(yac[yi])
                        v.push(yv[yi] / f)
                    } else {
                        // reached end of yahoo data
                        // => fill OHLCV w/ last close
                        const f = yac[yi] / yc[yi]
                        o.push(yac[yi])
                        h.push(yac[yi])
                        l.push(yac[yi])
                        c.push(yac[yi])
                        v.push(0.0)
                    }
                }
            })

            return Promise.resolve({
                meta: {
                    ticker,
                },
                t: st,
                o: o,
                h: h,
                l: l,
                c: c,
                v: v,
            })
        })
        // FIXME: what are we doing here?
        .catch(err => sim.info(err))

    return promise
}

//==============================================================================
// end of file
