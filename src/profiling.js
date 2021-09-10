//==============================================================================
// Name:        profiling
// Project:     TuringTrader.js
// Description: simple portfolio for profiling purposes
// History:     FUB, 2021viiii10, created
//==============================================================================

// see https://nodejs.org/en/docs/guides/simple-profiling/
// see https://nodejs.org/en/docs/guides/diagnostics-flamegraph/

import { createSimulator, createReport } from "."

//------------------------------------------------------------------------------
const algo = {
    run: (sim) => {
        sim.startDate = new Date("2007-01-01T18:00:00.000-05:00") // 6pm in America/New York (winter)
        sim.endDate = new Date("2020-12-31T18:00:00.000-05:00") // 6pm in America/New York (winter)
        sim.deposit(1000)

        return sim.loop(async () => {
            const orders = []

            if (sim.t(0).getMonth() !== sim.t(-1).getMonth()) {
                orders.push(sim.asset("spy").alloc(0.25, sim.orderTypes.mktNextOpen))
                orders.push(sim.asset("tlt").alloc(0.25, sim.orderTypes.mktNextOpen))
                orders.push(sim.asset("shy").alloc(0.25, sim.orderTypes.mktNextOpen))
                orders.push(sim.asset("gld").alloc(0.25, sim.orderTypes.mktNextOpen))
            }

            return orders
        })
    },
}

//------------------------------------------------------------------------------
const profilingBacktest = async () => {
    const profiler0 = Date.now()

    const result = await createSimulator(algo)
        .run()

    const profiler1 = Date.now()

    const report = await createReport(result)

    const profiler2 = Date.now()

    console.log(`simulation run: ${profiler1 - profiler0}ms`)
    console.log(`simulation report: ${profiler2 - profiler1}ms`)
}

profilingBacktest()

//==============================================================================
// end of file
