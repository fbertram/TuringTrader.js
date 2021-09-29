//==============================================================================
// Name:        tests/test-0705-fixed-alloc
// Project:     TuringTrader.js
// Description: test 0705: 60/40 portfolio w/ monthly rebalancing
// History:     FUB, 2021vii17, created
//==============================================================================

import { createSimulator, createReport } from "../src"

//------------------------------------------------------------------------------
const algo = {
    run: (sim) => {
        sim.startDate = new Date("2007-01-01T18:00:00.000-05:00") // 6pm in America/New York (winter)
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

//------------------------------------------------------------------------------
describe("test 0705: 60/40 w/ monthly rebal", () => {

    test("can calculate equity curve", () => {
        return createSimulator(algo)
            .run()
            .then((result) => createReport(result))
            .then((report) => {
                const metrics = report.metrics
                //console.log(metrics)
                expect(metrics.firstBar).toEqual(new Date("2006-12-29T21:00:00.000Z"))
                expect(metrics.lastBar).toEqual(new Date("2020-12-31T21:00:00.000Z"))
                expect(metrics.reportDays).toEqual(5116)
                expect(metrics.reportYears).toBeCloseTo(14.0068, 2)
                expect(metrics.startValue).toBeCloseTo(1000.0000, 1)
                expect(metrics.endValue).toBeCloseTo(2817.3723, 1)
                expect(metrics.cagr).toBeCloseTo(7.6753, 2)
                expect(metrics.stdev).toBeCloseTo(11.0633, 2)
                expect(metrics.mdd).toBeCloseTo(35.6885, 2)
                expect(metrics.mfd).toEqual(1164)
                expect(metrics.ulcer).toBeCloseTo(7.4806, 2)
                expect(metrics.sharpe).toBeCloseTo(0.6653, 2)
                expect(metrics.martin).toBeCloseTo(1.0260, 2)
            })
    })
})

//==============================================================================
// end of file
