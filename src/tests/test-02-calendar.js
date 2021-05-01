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
            sim.startDate = new Date("01/01/2021")
            sim.endDate = new Date("05/01/2021")

            // note that we have simulation time stamps even
            // though we did not load any quotations

            sim.tradingDays.forEach((simTime) => {
                sim.info(simTime)
            })
        },
        report: (sim) => {}
    }

    const sim = createSimulator(algo)
    sim.run()
    sim.report()
}

//==============================================================================
// end of file
