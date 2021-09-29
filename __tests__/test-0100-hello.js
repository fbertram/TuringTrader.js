//==============================================================================
// Name:        tests/test-0100-hello
// Project:     TuringTrader.js
// Description: test 0100: 'hello trader'
// History:     FUB, 2021vii13, created
//==============================================================================

import { createSimulator } from "../src"

//===============================================================================
const hello = "hello trader"

const algo = {
    run: () => hello,
}

//==============================================================================
describe("test 0100: hello", () => {
    const sim = createSimulator(algo)

    test("has run method", () => {
        expect(typeof sim.run).toEqual("function")
    })

    test("can say hello", () => {
        sim
            .run()
            .then(result => {
                expect(result).toEqual(hello)
            })
    })
})

//==============================================================================
// end of file
