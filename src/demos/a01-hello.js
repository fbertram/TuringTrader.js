//==============================================================================
// Name:        demos/a01-hello
// Project:     TuringTrader.js
// Description: demo #01: 'hello trader'
// History:     FUB, 2021iv30, created
//==============================================================================

import { createSimulator } from "../simulator"

const algo = {
    run: (sim) => {
        sim.info("hello trader")
    },
    report: (sim) => {
        sim.info("here's your report")
    }
}

const sim = createSimulator(algo)
sim.run()
sim.report()

//==============================================================================
// end of file
