//==============================================================================
// Name:        tests/test-0200-calendar
// Project:     TuringTrader.js
// Description: test 0200: trading calendar
// History:     FUB, 2021vii13, created
//==============================================================================

import { createSimulator } from "../src/simulator"

//==============================================================================

// this test shows how the trading calendar generates
// simulation time stamps from the start and end dates

const algo = {
    run: async (sim) => {
        // note that all dates are specified in the
        // user's local time zone, even though the
        // trading calendar reflects times and dates
        // in New York

        // BUGBUG: test may fail in non-US timezones,
        // if a date rollover is involved

        sim.startDate = new Date("01/01/2021")
        sim.endDate = new Date("05/01/2021")

        // note that we have simulation time stamps even
        // though we did not load any quotations

        const format = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        }

        let timestamps = []
        await sim.loop(() => {
            timestamps.push(sim.t(0))
        })

        return timestamps
    },
}

//==============================================================================
describe("test 0200: trading calendar", () => {

    // see https://jestjs.io/docs/asynchronous

    test("correct number of trading days", () => {
        return createSimulator(algo).run()
            .then((timestamps) => {
                expect(timestamps.length).toEqual(83)
            })
    })
})

//==============================================================================
// end of file
