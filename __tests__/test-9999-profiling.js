//==============================================================================
// Name:        tests/test-9999-profiling
// Project:     TuringTrader.js
// Description: test 9999: 60/40 portfolio w/ monthly rebalancing
// History:     FUB, 2021viiii10, created
//==============================================================================

import { createSimulator, createReport } from "../src"

//------------------------------------------------------------------------------
const algo = {
    run: (sim) => {
        sim.startDate = new Date("2007-01-01T18:00:00.000-05:00") // 6pm in America/New York (winter)
        sim.endDate = new Date("2020-12-31T18:00:00.000-05:00") // 6pm in America/New York (winter)
        sim.deposit(1000)

        return sim.loop(async () => {
            const orders = []

            if (sim.t(0).getMonth() !== sim.t(-1).getMonth()) {
                orders.push(sim.asset("spy").alloc(0.6, sim.orderTypes.mktNextOpen))
                orders.push(sim.asset("agg").alloc(0.4, sim.orderTypes.mktNextOpen))
            }

            return orders
        })
    },
}

//------------------------------------------------------------------------------
describe("test 9999: profiling portfolio", () => {

    test("can calculate equity curve", () => {

        const profiler0 = Date.now()
        let profiler1 = 0
        let profiler2 = 0

        return createSimulator(algo)
            .run()
            .then((result) => {
                profiler1 = Date.now()
                return createReport(result)
            })
            .then((report) => {
                profiler2 = Date.now()

                const profilerRun = profiler1 - profiler0
                const profilerReport = profiler2 - profiler1

                expect(profilerRun).toBeLessThan(10000)
            })
    })
})

//==============================================================================
// end of file
