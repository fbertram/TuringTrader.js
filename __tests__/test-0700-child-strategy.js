//==============================================================================
// Name:        tests/test-08---child-strategy
// Project:     TuringTrader.js
// Description: test 0700: child strategies
// History:     FUB, 2021vii14, created
//==============================================================================

/*
import { createSimulator } from "turingtrader.js/src/simulator"

export const test_09_child_strategy = async () => {
    // this tests shows how to run
    // a simulation with child strategies

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

    const simSpy = createSimulator(childSpy)

    const childAgg = {
        run: async (sim) => {
            sim.deposit(1e6)

            await sim.loop(async () => {
                return [sim.asset("agg").alloc(1.0, sim.orderTypes.mktNextOpen)]
            })
        },
        report: () => {}
    }

    const simAgg = createSimulator(childAgg)

    const algo = {
        run: async (sim) => {
            sim.startDate = new Date("01/01/2020")
            sim.endDate = new Date("12/31/2020")
            sim.deposit(1e6)

            await sim.loop(async () => {
                const orders = []

                if (sim.t(0).getMonth() !== sim.t(-1).getMonth()) {

                    // note how we are using a child simulator 
                    // just like any other asset

                    orders.push(sim.asset(simSpy).alloc(0.6, sim.orderTypes.mktNextOpen))
                    orders.push(sim.asset(simAgg).alloc(0.4, sim.orderTypes.mktNextOpen))
                }

                return orders
            })

            // note how this simulator shows an asset allocation
            // with the child simulators resolved to the underlying
            // basic assets

            sim.info(sim.getProperty("result"))
        },
        report: (sim) => { },
    }

    const sim = createSimulator(algo)
    await sim.run()
    await sim.report()
}
*/

//==============================================================================
// end of file
