//==============================================================================
// Name:        tests/test-0410-extra-asset
// Project:     TuringTrader.js
// Description: test 0410: load additional asset quotes
// History:     FUB, 2021viiii28, created
//==============================================================================

import { createSimulator } from "../src"

//==============================================================================
const algo = {
    run: async (sim) => {
        sim.startDate = new Date("01/01/2021")
        sim.endDate = new Date("05/01/2021")

        return {
            note: "this is a simulation result",
        }
    },
    report: (sim) => {},
    extra: {
        bench: "^gspc",
        rf: "^irx",
    }
}

//==============================================================================
describe("test 0410: asset", () => {
    test("can download extra quotes", () => {
        return createSimulator(algo)
            .run()
            .then((result) => {
                expect(result.bench?.meta.ticker).toEqual("^gspc")
                expect(result.bench.c.length).toEqual(83)

                expect(result.rf.meta.ticker).toEqual("^irx")
                expect(result.rf.c.length).toEqual(83)
            })
    })
})

//==============================================================================
// end of file
