//==============================================================================
// Name:        tests/test-01-hello
// Project:     TuringTrader.js
// Description: test #01: 'hello trader'
// History:     FUB, 2021iv30, created
//==============================================================================

import { createSimulator } from "../simulator"

export const test_01_hello = () => {
    // this test demonstrates simulator instantiation
    // and overloading of the run and report methods

    const algo = {
        // note how the simulator APIs are available
        // through the sim parameter

        run: (sim) => sim.info("hello trader"),
        report: (sim) => sim.info("here's your report"),
    }

    const sim = createSimulator(algo)
    sim.run()
    sim.report()
}

//==============================================================================
// end of file
