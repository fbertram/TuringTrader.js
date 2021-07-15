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
        sim.startDate = new Date("01/01/2020")
        sim.endDate = new Date("12/31/2020")

        return sim.asset("spy").data
    },
}

const report = {

}

//==============================================================================
describe("test 5000: simple report", () => {

    test("can calculate equity curve", () => {
        return createSimulator(algo).run()
            .then((result) => createReport(result))
            .then((report) => {
                const metrics = report.metrics
                console.log(metrics)
            })
    })
})

//==============================================================================
// end of file
