//==============================================================================
// Name:        tests/test-02-calendar
// Project:     TuringTrader.js
// Description: test #02: trading calendar
// History:     FUB, 2021iv30, created
//==============================================================================

import { createSimulator } from "../simulator"

export const test_02_calendar = () => {
    // this test shows how the trading calendar generates
    // simulation time stamps from the start and end dates

    const algo = {
        run: (sim) => {

            // note that all dates are specified in the
            // user's local time zone, even though the
            // trading calendar reflects times and dates
            // in New York

            sim.startDate = new Date("01/01/2021")
            sim.endDate = new Date("05/01/2021")

            // note that we have simulation time stamps even
            // though we did not load any quotations

            const format = {
                weekday: 'long',
                year: 'numeric', month: 'long', day: 'numeric',
                hour: 'numeric', minute: 'numeric',
            }

            sim.tradingDays.forEach((simTime) => {
                sim.info(new Intl.DateTimeFormat('en', format).format(simTime))
            })
        },

        report: (sim) => { }
    }

    const sim = createSimulator(algo)
    sim.run()
    sim.report()
}

//==============================================================================
// end of file
