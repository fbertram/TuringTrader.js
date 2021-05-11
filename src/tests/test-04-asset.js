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

            // note that assets are asynchronous.
            // to access the data, we need to await them

            const spy = sim.asset("spy")
            const data = await spy.data
            sim.info(spy.id)
            sim.info(data)
        },
        report: (sim) => { },
    }

    const sim = createSimulator(algo)
    await sim.run()
    await sim.report()
}

//==============================================================================
// end of file
