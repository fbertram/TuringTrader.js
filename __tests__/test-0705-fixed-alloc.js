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
            .then((result) => {
                const minWeights = {}
                const maxWeights = {}
                result.cAlloc.forEach((alloc) => {
                    for (const i in alloc.ticker) {
                        const ticker = alloc.ticker[i]
                        const weight = alloc.weight[i]

                        if (weight != 0.0) {
                            if (!(ticker in minWeights))
                                minWeights[ticker] = 999

                            if (!(ticker in maxWeights))
                                maxWeights[ticker] = -999

                            minWeights[ticker] = Math.min(weight, minWeights[ticker])
                            maxWeights[ticker] = Math.max(weight, maxWeights[ticker])
                        }
                    }
                })
                expect(minWeights['spy']).toBeCloseTo(0.53156, 3)
                expect(minWeights['agg']).toBeCloseTo(0.36448, 3)
                expect(maxWeights['spy']).toBeCloseTo(0.63552, 3)
                expect(maxWeights['agg']).toBeCloseTo(0.46844, 3)

                const numRebal = result.fAlloc.reduce((prev, curr) => prev + curr, 0)
                expect(numRebal).toEqual(169) // 14 years @ 12/year

                return createReport(result)
            })
            .then((report) => {
                const metrics = report.metrics
                //console.log(metrics)
                expect(metrics.firstBar).toEqual(new Date("2006-12-29T21:00:00.000Z"))
                expect(metrics.lastBar).toEqual(new Date("2020-12-31T21:00:00.000Z"))
                expect(metrics.reportDays).toEqual(5116)
                expect(metrics.reportYears).toBeCloseTo(14.0068, 2)
                expect(metrics.startValue).toBeCloseTo(1000.0000, 2)
                expect(metrics.endValue).toBeCloseTo(2827.0861, 2)
                expect(metrics.cagr).toBeCloseTo(7.7017, 2)
                expect(metrics.stdev).toBeCloseTo(11.1534, 2)
                expect(metrics.mdd).toBeCloseTo(35.6885, 2)
                expect(metrics.mfd).toEqual(1165)
                expect(metrics.ulcer).toBeCloseTo(7.4370, 2)
                expect(metrics.sharpe).toBeCloseTo(0.6653, 2)
                expect(metrics.martin).toBeCloseTo(1.0356, 2)
            })
    })
})

//==============================================================================
// end of file
