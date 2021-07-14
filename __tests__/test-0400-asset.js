//==============================================================================
// Name:        tests/test-0400-asset
// Project:     TuringTrader.js
// Description: test 0400: load asset quotes
// History:     FUB, 2021vii13, created
//==============================================================================

import { createSimulator } from "../src"

//==============================================================================
const algo = {
    run: async (sim) => {
        sim.startDate = new Date("01/01/2021")
        sim.endDate = new Date("05/01/2021")

        // note that assets are asynchronous.
        // to access the data, we need to await them

        const spy = sim.asset("spy")

        return {
            id: spy.id,
            data: await spy.data
        }
    },
    report: (sim) => { },
}

//==============================================================================
describe("test 0400: asset", () => {

    test("can download asset quotes", () => {
        return createSimulator(algo).run()
            .then((result) => {
                expect(result.id).toMatch(/^loadAsset\(spy,[0-9]+,[0-9]+\)$/)
                expect(result.data.meta.ticker).toEqual("spy")
                expect(result.data.t.length).toEqual(83)
                expect(result.data.o.length).toEqual(83)
                expect(result.data.h.length).toEqual(83)
                expect(result.data.l.length).toEqual(83)
                expect(result.data.c.length).toEqual(83)
                expect(result.data.v.length).toEqual(83)
                // TODO: verify some key data points
            })
    })
})

//==============================================================================
// end of file
