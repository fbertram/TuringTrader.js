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
    const day = 24 * 60 * 60
    const period1 = Math.trunc(sim.startDate.getTime() / 1000) - 5 * day
    const period2 = Math.trunc(sim.endDate.getTime() / 1000) + 5 * day
    const url = `http://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&period1=${period1}&period2=${period2}`

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
            // deconstruct response from Yahoo!
            const meta = response.chart.result[0].meta
            const rawTimestamps = response.chart.result[0].timestamp
            const rawOpen = response.chart.result[0].indicators.quote[0].open
            const rawHigh = response.chart.result[0].indicators.quote[0].high
            const rawLow = response.chart.result[0].indicators.quote[0].low
            const rawClose = response.chart.result[0].indicators.quote[0].close
            const rawVolume =
                response.chart.result[0].indicators.quote[0].volume
            const adjustedClose =
                response.chart.result[0].indicators.adjclose[0].adjclose

            // calculate adjusted prices
            const adjustFactor = adjustedClose.map(
                (element, index) => element / rawClose[index]
            )
            const adjustedOpen = rawOpen.map(
                (element, index) => element * adjustFactor[index]
            )
            const adjustedHigh = rawHigh.map(
                (element, index) => element * adjustFactor[index]
            )
            const adjustedLow = rawLow.map(
                (element, index) => element * adjustFactor[index]
            )
            const adjustedVolume = rawVolume.map(
                (element, index) => element / adjustFactor[index]
            )

            // convert timestamps
            // NOTE: Yahoo! timestamps are at the open (9:30 am),
            // TuringTrader.js timestamps are at the close (4:00 pm)
            const timestamps = rawTimestamps.map(
                (element) => new Date(element * 1000)
            )

            return {
                meta: {
                    ticker,
                },
                t: timestamps,
                o: adjustedOpen,
                h: adjustedHigh,
                l: adjustedLow,
                c: adjustedClose,
                v: adjustedVolume,
            }
        })
        // FIXME: what are we doing here?
        .catch((err) => sim.info(err))

    return promise
}

//==============================================================================
// end of file
