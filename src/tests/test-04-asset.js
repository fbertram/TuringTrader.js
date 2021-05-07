//==============================================================================
// Name:        tests/test-04-asset
// Project:     TuringTrader.js
// Description: test #04: load asset data
// History:     FUB, 2021v01, created
//==============================================================================

import { createSimulator } from "../simulator"

export const test_04_asset = async () => {
    // this tests shows how assets are loaded into the simulator
    // and how they are aligned with the simulator timestamps

    const algo = {
        run: async (sim) => {
            sim.startDate = new Date("01/01/2021")
            sim.endDate = new Date("01/31/2021")

            const spy = sim.asset("spy")

            // note how the data is truncated and padded
            // to match the simulator timestamps

            sim.info("asyncData")
            sim.info(await spy.allData)
        },
        report: (sim) => { }
    }

    const sim = createSimulator(algo)
    sim.run()
    sim.report()
}

//==============================================================================
// end of file
