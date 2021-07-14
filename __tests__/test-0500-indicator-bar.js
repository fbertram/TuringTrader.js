//==============================================================================
// Name:        tests/test-0500-indicator-bar
// Project:     TuringTrader.js
// Description: test 0500: calculate indicators on bars
// History:     FUB, 2021vii13, created
//==============================================================================

import { createSimulator } from "../src"

//==============================================================================
const algo = {
    run: async (sim) => {
        sim.startDate = new Date("01/01/2021")
        sim.endDate = new Date("05/01/2021")

        // note that indicators are asynchronous.
        // before we can use the data, we need to
        // await them

        const c = sim.asset("spy").close

        return {
            id: c.id,
            data: await c.data
        }
    },
}

//==============================================================================
describe("test 0500: indicator on bar", () => {

    test("can use close indicator", () => {
        return createSimulator(algo).run()
            .then((result) => {
                expect(result.id).toMatch(/^loadAsset\(spy,[0-9]+,[0-9]+\).close$/)
                expect(result.data.x.length).toEqual(83)
                // TODO: add more verification here
            })
    })
})

//==============================================================================
// end of file
