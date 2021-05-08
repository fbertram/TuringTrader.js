//==============================================================================
// Name:        tests/test-05-indicator-bar
// Project:     TuringTrader.js
// Description: test #05: calculate indicators on bars
// History:     FUB, 2021v07, created
//==============================================================================

import { createSimulator } from "../simulator"

export const test_05_indicator_bar = async () => {
    // this tests shows how indicators are
    // calculated on bars

    const algo = {
        run: async (sim) => {
            sim.startDate = new Date("01/01/2021")
            sim.endDate = new Date("01/31/2021")

            // note that indicators are asynchronous.
            // before we can use the data, we need to
            // await them

            const c = sim.asset("spy").close
            const data = await c.data
            sim.info(data)
        },
        report: (sim) => { },
    }

    const sim = createSimulator(algo)
    sim.run()
    sim.report()
}

//==============================================================================
// end of file
