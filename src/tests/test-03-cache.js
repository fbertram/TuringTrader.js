//==============================================================================
// Name:        tests/test-03-cache
// Project:     TuringTrader.js
// Description: test #03: cache simulator data
// History:     FUB, 2021v01, created
//==============================================================================

import { createSimulator } from "../simulator"

export const test_03_cache = () => {
    // this test shows how the simulator caches results
    // and avoids calculating them more then once

    const algo = {
        run: (sim) => {

            const toDo = () => {
                sim.info("working on my todos")
                return "here is the result"
            }

            const cacheId = "unique id here"

            // note how the second attempt to run
            // toDo is served from the cache

            const result1 = sim.cache(cacheId, toDo)
            sim.info(result1)

            const result2 = sim.cache(cacheId, toDo)
            sim.info(result2)
        },

        report: (sim) => {}
    }

    const sim = createSimulator(algo)
    sim.run()
    sim.report()
}

//==============================================================================
// end of file
