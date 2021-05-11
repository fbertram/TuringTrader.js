//==============================================================================
// Name:        tests/test-06-indicator-num
// Project:     TuringTrader.js
// Description: test #06: calculate indicators on number series
// History:     FUB, 2021v07, created
//==============================================================================

import { createSimulator } from "../simulator"

export const test_06_indicator_num = async () => {
    // this tests shows how indicators are
    // calculated on number series

    const algo = {
        run: async (sim) => {
            sim.startDate = new Date("01/01/2021")
            sim.endDate = new Date("01/31/2021")

            // note how we can seamlessly calculate
            // indicators on indicators

            const i = sim.asset("spy").close.sma(5).ema(10)
            sim.info(i.id)
            sim.info(await i.data)
        },
        report: (sim) => { },
    }

    const sim = createSimulator(algo)
    await sim.run()
    await sim.report()
}

//==============================================================================
// end of file
