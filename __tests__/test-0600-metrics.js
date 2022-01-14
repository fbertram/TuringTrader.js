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

const algo2 = {
    run: (sim) => {
        sim.startDate = new Date("2007-01-01T18:00:00.000-05:00") // 6pm in America/New York (winter)
        sim.endDate = new Date("2020-12-31T18:00:00.000-05:00") // 6pm in America/New York (winter)

        return sim.asset("^ixic").data // NASDAQ Composite index
    },
    extra: {
        benchmark: "^gspc", // S&P 500 index
        riskFree: "^irx", // 13-week US T-bill
    }
}

const report = {}

//==============================================================================
describe("test 0600: simple report", () => {
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
                expect(metrics.cagrPeriod(252)).toBeCloseTo(15.2929, 2)
                expect(metrics.stdev).toBeCloseTo(18.6480, 2)
                expect(metrics.mdd).toBeCloseTo(56.7754, 2)
                expect(metrics.mfd).toEqual(1997)
                expect(metrics.ulcer).toBeCloseTo(16.3702, 2)
                expect(metrics.sharpe).toBeCloseTo(0.3660, 2)
                expect(metrics.martin).toBeCloseTo(0.4378, 2)
            })
    })

    test("can calculate benchmarked metrics", () => {
        return createSimulator(algo2)
            .run()
            .then((result) => createReport(result))
            .then((report) => {
                const metrics = report.metrics
                expect(metrics.firstBar).toEqual(new Date("2006-12-29T21:00:00.000Z"))
                expect(metrics.lastBar).toEqual(new Date("2020-12-31T21:00:00.000Z"))
                expect(metrics.reportDays).toEqual(5116)
                expect(metrics.reportYears).toBeCloseTo(14.0068, 2)

                expect(metrics.startValue[0]).toBeCloseTo(2423.0300, 1)
                expect(metrics.startValue[1]).toBeCloseTo(1418.3000, 1)

                expect(metrics.endValue[0]).toBeCloseTo(12888.2803, 1)
                expect(metrics.endValue[1]).toBeCloseTo(3756.0701, 1)

                expect(metrics.cagr[0]).toBeCloseTo(12.6731, 2)
                expect(metrics.cagr[1]).toBeCloseTo(7.2006, 2)

                expect(metrics.stdev[0]).toBeCloseTo(20.5863, 2)
                expect(metrics.stdev[1]).toBeCloseTo(18.6480, 2)

                expect(metrics.mdd[0]).toBeCloseTo(55.6283, 2)
                expect(metrics.mdd[1]).toBeCloseTo(56.7754, 2)

                expect(metrics.mfd[0]).toEqual(1274)
                expect(metrics.mfd[1]).toEqual(1997)

                expect(metrics.ulcer[0]).toBeCloseTo(14.1068, 2)
                expect(metrics.ulcer[1]).toBeCloseTo(16.3702, 2)

                expect(metrics.sharpe[0]).toBeCloseTo(0.5263, 2)
                expect(metrics.sharpe[1]).toBeCloseTo(0.3198, 2)

                expect(metrics.martin[0]).toBeCloseTo(0.8984, 2)
                expect(metrics.martin[1]).toBeCloseTo(0.4399, 2)

                expect(metrics.beta).toBeCloseTo(1.0190, 2)
            })
    })
})

//==============================================================================
// end of file
