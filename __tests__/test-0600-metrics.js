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
        sim.startDate = new Date("2007-01-01T18:00:00.000-05:00") // 6pm in America/New York (winter)
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
                expect(metrics.firstBar).toEqual(new Date("2006-12-29T21:00:00.000Z"))
                expect(metrics.lastBar).toEqual(new Date("2020-12-31T21:00:00.000Z"))
                expect(metrics.reportDays).toEqual(5116)
                expect(metrics.reportYears).toBeCloseTo(14.0068, 2)
                expect(metrics.startValue).toBeCloseTo(1424.7099, 1)
                expect(metrics.endValue).toBeCloseTo(3756.0700, 1)
                expect(metrics.cagr).toBeCloseTo(7.1661, 2)
                expect(metrics.stdev).toBeCloseTo(18.6480, 2)
                expect(metrics.mdd).toBeCloseTo(56.7754, 2)
                expect(metrics.mfd).toEqual(1997)
                expect(metrics.ulcer).toBeCloseTo(16.3702, 2)
                expect(metrics.sharpe).toBeCloseTo(0.3843, 2)
                expect(metrics.martin).toBeCloseTo(0.4378, 2)
            })
    })
})

//==============================================================================
// end of file
