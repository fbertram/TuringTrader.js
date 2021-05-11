//==============================================================================
// Name:        tests/test-07-time-series
// Project:     TuringTrader.js
// Description: test #07: access time series data.
// History:     FUB, 2021v08, created
//==============================================================================

import { createSimulator } from "../simulator"

export const test_07_time_series = async () => {
    // this tests shows how to access
    // time series data

    const algo = {
        run: async (sim) => {
            sim.startDate = new Date("01/01/2021")
            sim.endDate = new Date("01/31/2021")

            const i = sim.asset("spy").close

            sim.loop(async () => {
                sim.info(`${sim.t(0)} = ${await i.t(0)}`)
            })
        },
        report: (sim) => { },
    }

    const sim = createSimulator(algo)
    await sim.run()
    await sim.report()
}

//==============================================================================
// end of file
