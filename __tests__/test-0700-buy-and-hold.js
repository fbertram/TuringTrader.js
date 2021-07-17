//==============================================================================
// Name:        tests/test-0700-buy-and-hold
// Project:     TuringTrader.js
// Description: test 0700: buy and hold of single asset
// History:     FUB, 2021vii17, created
//==============================================================================

import { createSimulator, createReport } from "../src"

//------------------------------------------------------------------------------
const algo = {
    run: async (sim) => {
        sim.startDate = new Date("2020-01-01T18:00:00.000-05:00") // 6pm in America/New York (winter)
        sim.endDate = new Date("2020-12-31T18:00:00.000-05:00") // 6pm in America/New York (winter)

        // note how we are depositing funds
        // prior to trading the account

        sim.deposit(1000)

        // note how returning the result from sim.loop
        // returns the simulation result

        return sim.loop(() => {
            // note how we return the target allocation
            // from inside the sim.loop as an array

            return [sim.asset("spy").alloc(1.0, sim.orderTypes.mktNextOpen)]
        })
    },
}

//------------------------------------------------------------------------------
describe("test 0700: single-asset buy and hold", () => {
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
                expect(metrics.endValue).toBeCloseTo(1170.5597, 2)
                expect(metrics.cagr).toBeCloseTo(17.0182, 2)
                expect(metrics.mdd).toBeCloseTo(32.0490, 2)
            })
    })
})

//==============================================================================
// end of file
