//==============================================================================
// Name:        tests/test-0605-fixed-alloc
// Project:     TuringTrader.js
// Description: test 0605: fixed allocation w/ monthly rebalancing
// History:     FUB, 2021vii13, created
//==============================================================================

import { createSimulator } from "../src/simulator"

//==============================================================================

const algo = {
    run: async (sim) => {
        sim.startDate = new Date("01/01/2020")
        sim.endDate = new Date("12/31/2020")

        // note how we are depositing funds
        // prior to trading the account

        sim.deposit(1e6)

        return sim.loop(async () => {
            const orders = []

            // note how we are rebalancing on a monthly
            // schedule by looking at the simulator's
            // next (future) timestamp 

            if (sim.t(0).getMonth() !== sim.t(-1).getMonth()) {

                // note how orders are first added to a basket
                // and then returned to the simulator

                orders.push(sim.asset("spy").alloc(0.6, sim.orderTypes.mktNextOpen))
                orders.push(sim.asset("agg").alloc(0.4, sim.orderTypes.mktNextOpen))
            }

            return orders
        })
    },
}

//==============================================================================
describe("test 0600: simple orders", () => {

    test("can calculate equity curve", () => {
        return createSimulator(algo).run()
            .then((result) => {
                console.log(result)
                //expect(result.id).toMatch(/^loadAsset\(spy,[0-9]+,[0-9]+\).close.sma\(5\).ema\(10\)$/)
                expect(result.data.x.length).toEqual(83)
            })
    })
})

//==============================================================================
// end of file
