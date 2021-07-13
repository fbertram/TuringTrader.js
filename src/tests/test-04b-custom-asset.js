//==============================================================================
// Name:        tests/test-04b-custom-asset
// Project:     TuringTrader.js
// Description: test #04b: custom data source
// History:     FUB, 2021vii12, created
//==============================================================================

import { createSimulator } from "../simulator"

export const test_04b_custom_asset = async () => {
    // this tests shows how to load data from 
    // a custom data source

    const algo = {
        data: (sim, name) => {
            const start = sim.startDate
            const end = sim.endDate
            
            return new Promise((resolve, reject) => {
                // typically this would be a fetch. we simulate
                // some response time using a timer.
                setTimeout(() => {
                    let data = {
                        meta: {
                            ticker: name,
                        },
                        t: [],
                        o: [],
                        h: [],
                        l: [],
                        c: [],
                        v: [],
                    }

                    // simulate data. note how the data
                    // are not aligned to the simulator
                    // timestamps.

                    let t = start
                    const hour = 60 * 60 * 1000
                    const day = 24 * hour
                    while (t < end) {
                        const base = (t.getTime() - start.getTime()) / day
                        data.t.push(t)
                        data.o.push(base)
                        data.h.push(base + 0.5)
                        data.l.push(base - 0.5)
                        data.c.push(base + 0.25)
                        data.v.push(base * 10)
                        t = new Date(t.getTime() + 8 * hour)
                    }
                    resolve(data)
                })
            })
        },
        run: async (sim) => {
            sim.startDate = new Date("01/01/2021")
            sim.endDate = new Date("01/31/2021")

            // note that assets are loaded asynchronously.
            // to access the data, we need to await them

            const theAsset = sim.asset("custom")
            const theData = await theAsset.data
            sim.info(theAsset.id)
            sim.info(theData)
        },
        report: (sim) => { },
    }

    const sim = createSimulator(algo)
    await sim.run()
    await sim.report()
}

//==============================================================================
// end of file
