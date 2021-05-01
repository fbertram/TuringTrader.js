//==============================================================================
// Name:        tests/a02-calendar
// Project:     TuringTrader.js
// Description: demo #02: trading calendar
// History:     FUB, 2021iv30, created
//==============================================================================

import { createSimulator } from "../simulator"

const algo = {
    run: (sim) => {
        sim.startDate = new Date("01/01/2021")
        sim.endDate = new Date("05/01/2021")

        sim.tradingDays.forEach((simTime) => {
            sim.info(simTime)
        })
    },
    report: (sim) => {}
}

const sim = createSimulator(algo)
sim.run()
sim.report()

//==============================================================================
// end of file
