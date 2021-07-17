//==============================================================================
// Name:        tests/test-0705-fixed-alloc
// Project:     TuringTrader.js
// Description: test 0705: fixed allocation w/ monthly rebalancing
// History:     FUB, 2021vii17, created
//==============================================================================

import { createSimulator, createReport } from "../src"

//==============================================================================

const algo = {
    run: async (sim) => {
        sim.startDate = new Date("2020-01-01T18:00:00.000-05:00") // 6pm in America/New York (winter)
        sim.endDate = new Date("2020-12-31T18:00:00.000-05:00") // 6pm in America/New York (winter)

        // note how we are depositing funds
        // prior to trading the account

        sim.deposit(1000)

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
describe("test 0705: 60/40 buy-and-hold", () => {

    test("can calculate equity curve", () => {
        return createSimulator(algo)
            .run()
            .then((result) => createReport(result))
            .then((report) => {
                const metrics = report.metrics
                expect(metrics.firstBar).toEqual(new Date("2019-12-31T21:00:00.000Z"))
                expect(metrics.lastBar).toEqual(new Date("2020-12-31T21:00:00.000Z"))
                expect(metrics.reportDays).toEqual(366)
                expect(metrics.reportYears).toBeCloseTo(0.99931, 2)
                expect(metrics.startValue).toBeCloseTo(1000.0000, 2)
                expect(metrics.endValue).toBeCloseTo(1140.5224, 2)
                expect(metrics.cagr).toBeCloseTo(14.0215, 2)
                expect(metrics.mdd).toBeCloseTo(21.4371, 2)
            })
    })
})

//==============================================================================
// end of file
