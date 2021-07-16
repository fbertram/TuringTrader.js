//==============================================================================
// Name:        tests/test-0300-cache
// Project:     TuringTrader.js
// Description: test 0300: cache simulator data
// History:     FUB, 2021vii13, created
//==============================================================================

import { createSimulator } from "../src"

//==============================================================================

const data = "the data"

const algo = {
    run: (sim) => {
        let toDoCounter = 0
        const toDo = () => {
            toDoCounter++
            return data
        }

        const cacheId = "unique id here"

        // note how the second request for
        // toDo is served from the cache

        const result1 = sim.cache(cacheId, toDo)
        const result2 = sim.cache(cacheId, toDo)

        return {
            toDoCounter,
            result1,
            result2,
        }
    },
}

//==============================================================================
describe("test 0300: cache", () => {
    const sim = createSimulator(algo)

    test("can read results from cache", () => {
        const result = createSimulator(algo).run()

        expect(result.toDoCounter).toEqual(1)
        expect(result.result1).toEqual(data)
        expect(result.result2).toEqual(data)
    })
})

//==============================================================================
// end of file
