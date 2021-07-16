//==============================================================================
// Name:        tests/test-0600-buy-and-hold
// Project:     TuringTrader.js
// Description: test 0600: buy and hold of single asset
// History:     FUB, 2021vii14, created
//==============================================================================

import { createSimulator } from "../src"

//==============================================================================

const algo = {
    run: async (sim) => {
        sim.startDate = new Date("01/01/2020")
        sim.endDate = new Date("12/31/2020")

        // note how we are depositing funds
        // prior to trading the account

        sim.deposit(1e6)

        // note how returning the result from sim.loop
        // returns the simulation result

        return sim.loop(() => {
            // note how we return the target allocation
            // from inside the sim.loop as an array

            return [sim.asset("spy").alloc(0.6, sim.orderTypes.mktNextOpen)]
        })
    },
}

//==============================================================================
describe("test 0600: buy and hold", () => {
    test("can calculate equity curve", () => {
        return createSimulator(algo)
            .run()
            .then((result) => {
                // TODO: add proper tests here
                //console.log(result)
                //expect(result.id).toMatch(/^loadAsset\(spy,[0-9]+,[0-9]+\).close.sma\(5\).ema\(10\)$/)
                //expect(result.data.x.length).toEqual(83)
                expect(true).toEqual(true)
            })
    })
})

//==============================================================================
// end of file
