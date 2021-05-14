//==============================================================================
// Name:        tests/test-09-child-strategy
// Project:     TuringTrader.js
// Description: test #09: test child strategies.
// History:     FUB, 2021v14, created
//==============================================================================

import { createSimulator } from "../simulator"

export const test_09_child_strategy = async () => {
    // this tests shows how to run
    // a child strategy

    const childSpy = {
        run: async (sim) => {
            // note that we are typically not
            // specifying startDate and endDate

            sim.deposit(1e6)

            await sim.loop(async () => {
                return [sim.asset("spy").alloc(1.0, sim.orderTypes.mktNextOpen)]
            })
        },
        report: () => {}
    }

    const childAgg = {
        run: async (sim) => {
            // note that we are typically not
            // specifying startDate and endDate

            sim.deposit(1e6)

            await sim.loop(async () => {
                return [sim.asset("agg").alloc(1.0, sim.orderTypes.mktNextOpen)]
            })
        },
        report: () => {}
    }

    const algo = {
        run: async (sim) => {
            sim.startDate = new Date("01/01/2020")
            sim.endDate = new Date("12/31/2020")
            sim.deposit(1e6)

            // note how we are creating child algorithms
            // and use them as assets later on

            const spy = createSimulator(childSpy)
            const agg = createSimulator(childAgg)

            await sim.loop(async () => {
                const orders = []

                // note how we are rebalancing on a monthly
                // schedule by looking at the simulator's
                // next timestamp 

                if (sim.t(0).getMonth() !== sim.t(-1).getMonth()) {

                    // note how orders are first added to a basket
                    // and then returned to the simulator

                    orders.push(sim.asset(spy).alloc(0.6, sim.orderTypes.mktNextOpen))
                    orders.push(sim.asset(agg).alloc(0.4, sim.orderTypes.mktNextOpen))
                }

                return orders
            })

            // BUGBUG: this should really go into report.
            // we need to add some more awaits to make sure
            // report is not called before the simulation
            // loop finished

            sim.info(sim.getProperty("result"))
        },
        report: (sim) => { },
    }

    const sim = createSimulator(algo)
    await sim.run()
    await sim.report()
}

//==============================================================================
// end of file
