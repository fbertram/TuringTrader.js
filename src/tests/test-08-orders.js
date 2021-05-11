//==============================================================================
// Name:        tests/test-08-orders
// Project:     TuringTrader.js
// Description: test #08: test simple orders.
// History:     FUB, 2021v11, created
//==============================================================================

import { createSimulator } from "../simulator"

export const test_08_orders = async () => {
    // this tests shows how to submit
    // simple orders

    const algo = {
        run: async (sim) => {
            sim.startDate = new Date("01/01/2020")
            sim.endDate = new Date("12/31/2020")

            // note how we are depositing funds
            // prior to trading the account

            sim.deposit(1e6)

            sim.loop(async () => {
                const orders = []

                // note how we are rebalancing on a monthly
                // schedule by looking at the simulator's
                // next timestamp 

                if (sim.t(0).getMonth() !== sim.t(-1).getMonth()) {

                    // note how orders are first added to a basket
                    // and then returned to the simulator

                    orders.push(sim.asset("spy").alloc(0.6, sim.orderTypes.mktNextOpen))
                    orders.push(sim.asset("agg").alloc(0.4, sim.orderTypes.mktNextOpen))
                }

                return orders
            })
        },
        report: (sim) => { },
    }

    const sim = createSimulator(algo)
    await sim.run()
    await sim.report()
}

//==============================================================================
// end of file
