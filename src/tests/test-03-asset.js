//==============================================================================
// Name:        tests/test-03-asset
// Project:     TuringTrader.js
// Description: test #03: loading asset data
// History:     FUB, 2021v01, created
//==============================================================================

import { createSimulator } from "../simulator"

export const test_03_asset = () => {
    // this tests shows how assets are loaded into the simulator
    // and how the cache prevents loading data more than once

    const algo = {
        run: (sim) => {
            sim.startDate = new Date("01/01/2021")
            sim.endDate = new Date("05/01/2021")

            // note how the second attempt to load
            // the data is served from the cache

            const spy1 = sim.asset("spy")
            const spy2 = sim.asset("spy")

            // note how the data is truncated and padded
            // to match the simulator timestamps

            sim.info(spy1.allData)
        },
        report: (sim) => {}
    }

    const sim = createSimulator(algo)
    sim.run()
    sim.report()
}

//==============================================================================
// end of file
