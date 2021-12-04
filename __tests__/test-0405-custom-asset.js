//==============================================================================
// Name:        tests/test-0405-custom-asset
// Project:     TuringTrader.js
// Description: test 0405: custom data source
// History:     FUB, 2021vii13, created
//==============================================================================

import { createSimulator } from "../src"

//==============================================================================

const algo = {
    data: (sim, name) => {
        const start = sim.startDate
        const end = sim.endDate

        return new Promise((resolve, reject) => {
            // typically this would be a fetch. we simulate
            // a finite response time using a timer.
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
            }, 100)
        })
    },
    run: async (sim) => {
        // BUGBUG: test may fail in non-US timezones,
        // if a date rollover is involved
        // FIXME: specify timezone offset to remedy

        sim.startDate = new Date("01/01/2021")
        sim.endDate = new Date("05/01/2021")

        // note that assets are loaded asynchronously.
        // to access the data, we need to await them

        const theAsset = sim.asset("custom")

        return {
            id: theAsset.id,
            data: await theAsset.data,
        }
    },
}

//==============================================================================
describe("test 0405: custom asset", () => {
    test("can use custom data source", () => {
        return createSimulator(algo)
            .run()
            .then((result) => {
                expect(result.id).toMatch(/^loadAsset\(custom,[0-9]+,[0-9]+\)$/)
                expect(result.data.meta.ticker).toEqual("custom")
                expect(result.data.t.length).toEqual(83)
                expect(result.data.o.length).toEqual(83)
                expect(result.data.h.length).toEqual(83)
                expect(result.data.l.length).toEqual(83)
                expect(result.data.c.length).toEqual(83)
                expect(result.data.v.length).toEqual(83)
            })
    })
})

//==============================================================================
// end of file
