//==============================================================================
// Name:        tests/test-0600-ma-metrics
// Project:     TuringTrader.js
// Description: test 0600: simple test of metrics
// History:     FUB, 2021vii13, created
//==============================================================================

import { createSimulator, createReport } from "../src"

//==============================================================================

const algo = {
    run: (sim) => {
        sim.startDate = new Date("2020-01-01T18:00:00.000-05:00") // 6pm in America/New York (winter)
        sim.endDate = new Date("2020-12-31T18:00:00.000-05:00") // 6pm in America/New York (winter)

        return sim.asset("^gspc").data // S&P 500 index
    },
}

const report = {}

//==============================================================================
describe("test 5000: simple report", () => {
    test("can calculate basic metrics", () => {
        return createSimulator(algo)
            .run()
            .then((result) => createReport(result))
            .then((report) => {
                const metrics = report.metrics
                expect(metrics.firstBar).toEqual(new Date("2019-12-31T21:00:00.000Z"))
                expect(metrics.lastBar).toEqual(new Date("2020-12-31T21:00:00.000Z"))
                expect(metrics.reportDays).toEqual(366)
                expect(metrics.reportYears).toBeCloseTo(0.99931, 2)
                expect(metrics.startValue).toBeCloseTo(3215.1799, 1)
                expect(metrics.endValue).toBeCloseTo(3756.0700, 1)
                expect(metrics.cagr).toBeCloseTo(16.7858, 2)
                expect(metrics.mdd).toBeCloseTo(33.9250, 2)
            })
    })
})

//==============================================================================
// end of file
