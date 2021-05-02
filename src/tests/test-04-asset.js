//==============================================================================
// Name:        tests/test-04-asset
// Project:     TuringTrader.js
// Description: test #04: load asset data
// History:     FUB, 2021v01, created
//==============================================================================

import { createSimulator } from "../simulator"

export const test_04_asset = () => {
    // this tests shows how assets are loaded into the simulator
    // and how they are aligned with the simulator timestamps

    const algo = {
        run: (sim) => {
            sim.startDate = new Date("01/01/2021")
            sim.endDate = new Date("05/01/2021")

            const spy = sim.asset("spy")

            // note how the data is truncated and padded
            // to match the simulator timestamps

            sim.info(spy.allData)
        },
        report: (sim) => {}
    }

    const sim = createSimulator(algo)
    sim.run()
    sim.report()
}

//==============================================================================
// end of file
