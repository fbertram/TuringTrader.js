//==============================================================================
// Name:        tests/test-0610-ma-cross
// Project:     TuringTrader.js
// Description: test 0610: simple moving-average crossover strategy
// History:     FUB, 2021vii13, created
//==============================================================================

import { createSimulator, createReport } from "../src"

//==============================================================================

const algo = {
    run: (sim) => {
        sim.startDate = new Date("2020-01-01T18:00:00.000+08:00") // 6pm in America/New York
        sim.endDate = new Date("2020-12-31T18:00:00.000+08:00") // 6pm in America/New York

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
                // TODO: add proper tests here
                const metrics = report.metrics
                expect(metrics.firstBar).toEqual(new Date("2019-12-31T21:00:00.000Z"))
                expect(metrics.lastBar).toEqual(new Date("2020-12-30T21:00:00.000Z"))
                expect(metrics.reportDays).toEqual(365)
                expect(metrics.reportYears).toBeCloseTo(0.99931, 2)
                expect(metrics.startValue).toBeCloseTo(3215.1799, 1)
                expect(metrics.endValue).toBeCloseTo(3732.0400, 1)
                expect(metrics.cagr).toBeCloseTo(16.0875, 2)
                expect(metrics.mdd).toBeCloseTo(33.9250, 2)
            })
    })
})

//==============================================================================
// end of file
