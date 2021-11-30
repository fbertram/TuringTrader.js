//==============================================================================
// Name:        tests/test-0200-calendar
// Project:     TuringTrader.js
// Description: test 0200: trading calendar
// History:     FUB, 2021vii13, created
//==============================================================================

import { createSimulator } from "../src"

//==============================================================================

// this test shows how the trading calendar generates
// simulation time stamps from the start and end dates

const algo1 = {
    run: async (sim) => {
        // note that all dates are specified in the
        // user's local time zone, even though the
        // trading calendar reflects times and dates
        // in New York

        // BUGBUG: test may fail in non-US timezones,
        // if a date rollover is involved
        // FIXME: specify timezone offset to remedy

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

//------------------------------------------------------------------------------
const algo2 = {
    run: async (sim) => {
        // BUGBUG: test may fail in non-US timezones,
        // if a date rollover is involved

        sim.startDate = new Date("2020-01-02T18:00:00.000-05:00") // 6pm in America/New York (winter)
        sim.endDate = new Date("2020-12-31T18:00:00.000-05:00") // 6pm in America/New York (winter)

        // note that we have simulation time stamps even
        // though we did not load any quotations

        let timestamps = []
        await sim.loop(() => {
            if (sim.t(0).getMonth() !== sim.t(-1).getMonth()) {
                timestamps.push(sim.t(0))
            }
        })

        return timestamps
    },
}

//==============================================================================
describe("test 0200: trading calendar", () => {
    // see https://jestjs.io/docs/asynchronous

    test("correct number of trading days", () => {
        return createSimulator(algo1)
            .run()
            .then((timestamps) => {
                expect(timestamps.length).toEqual(83)
            })
    })

    test("correct number of monthly triggers", () => {
        return createSimulator(algo2)
            .run()
            .then((timestamps) => {
                expect(timestamps.length).toEqual(12)
                expect(timestamps[0].getTime() === 1580504400000)  // Friday, January 31, 2020 9:00:00 PM, GMT
                expect(timestamps[11].getTime() === 1609448400000) // Thursday, December 31, 2020 9:00:00 PM, GMT
            })
    })
})

//==============================================================================
// end of file
