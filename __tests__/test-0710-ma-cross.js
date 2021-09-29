//==============================================================================
// Name:        tests/test-0710-ma-cross
// Project:     TuringTrader.js
// Description: test 0610: simple moving-average crossover strategy
// History:     FUB, 2021vii13, created
//==============================================================================

import { createSimulator, createReport } from "../src"

//==============================================================================

const algo = {
    run: async (sim) => {
        sim.startDate = new Date("2007-01-01T18:00:00.000-05:00") // 6pm in America/New York (winter)
        sim.endDate = new Date("2020-12-31T18:00:00.000-05:00") // 6pm in America/New York (winter)

        sim.deposit(1000)

        const spy = sim.asset("spy")
        const agg = sim.asset("agg")

        return sim.loop(async () => {

            if (sim.t(0).getMonth() !== sim.t(-1).getMonth()) {

                // note how we await the indicator results
                // so that we can compare them

                const wSpy = await spy.close.ema(50).t(0) > await spy.close.ema(200).t(0) ?
                    1.0 :
                    0.0
                const wAgg = 1.0 - wSpy

                return [
                    spy.alloc(wSpy, sim.orderTypes.mktNextOpen),
                    agg.alloc(wAgg, sim.orderTypes.mktNextOpen),
                ]
            }
        })
    },
}

//==============================================================================
describe("test 0600: simple orders", () => {

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
                expect(metrics.endValue).toBeCloseTo(3160.4366, 1)
                expect(metrics.cagr).toBeCloseTo(8.5622, 2)
                expect(metrics.stdev).toBeCloseTo(13.6347, 2)
                expect(metrics.mdd).toBeCloseTo(32.0490, 2)
                expect(metrics.mfd).toEqual(1927)
                expect(metrics.ulcer).toBeCloseTo(8.6189, 2)
                expect(metrics.sharpe).toBeCloseTo(0.5941, 2)
                expect(metrics.martin).toBeCloseTo(0.9934, 2)
            })
    })
})

//==============================================================================
// end of file
