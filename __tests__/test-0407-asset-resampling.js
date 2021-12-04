//==============================================================================
// Name:        tests/test-0407-asset-resampling
// Project:     TuringTrader.js
// Description: test 0407: test asset resampling
// History:     FUB, 2021xii03, created
//==============================================================================

import { createSimulator } from "../src"

//==============================================================================

const createAlgo = (testData) => ({
    data: (sim, name) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(testData)
            }, 100)
        })
    },
    run: async (sim) => {
        sim.startDate = new Date("2021-01-04T18:00:00.000-05:00") // 6pm in America/New York (winter)
        sim.endDate = new Date("2021-01-08T18:00:00.000-05:00") // 6pm in America/New York (winter)

        const theAsset = sim.asset("custom")

        return await theAsset.data
    },
})

//==============================================================================
describe("test 0407: asset resampling", () => {
    test("can resample timestamps: source starts late", () => {
        const algo = createAlgo({
            meta: {},
            t: [new Date("2021-01-08T16:00:00.000-05:00")], // 4pm in America/New York (winter)
            o: [100],
            h: [200],
            l: [300],
            c: [400],
            v: [500],
        })

        return createSimulator(algo)
            .run()
            .then((data) => {
                expect(data.t.length).toEqual(5)
                expect(data.meta.firstT).toEqual(new Date("2021-01-08T21:00:00.000Z"))
                expect(data.meta.lastT).toEqual(new Date("2021-01-08T21:00:00.000Z"))

                expect(data.t[0]).toEqual(new Date("2021-01-04T21:00:00.000Z"))
                expect(data.o[0]).toEqual(100)
                expect(data.h[0]).toEqual(100)
                expect(data.l[0]).toEqual(100)
                expect(data.c[0]).toEqual(100)
                expect(data.v[0]).toEqual(0)

                expect(data.t[1]).toEqual(new Date("2021-01-05T21:00:00.000Z"))
                expect(data.o[1]).toEqual(100)
                expect(data.h[1]).toEqual(100)
                expect(data.l[1]).toEqual(100)
                expect(data.c[1]).toEqual(100)
                expect(data.v[1]).toEqual(0)

                expect(data.t[2]).toEqual(new Date("2021-01-06T21:00:00.000Z"))
                expect(data.o[2]).toEqual(100)
                expect(data.h[2]).toEqual(100)
                expect(data.l[2]).toEqual(100)
                expect(data.c[2]).toEqual(100)
                expect(data.v[2]).toEqual(0)

                expect(data.t[3]).toEqual(new Date("2021-01-07T21:00:00.000Z"))
                expect(data.o[3]).toEqual(100)
                expect(data.h[3]).toEqual(100)
                expect(data.l[3]).toEqual(100)
                expect(data.c[3]).toEqual(100)
                expect(data.v[3]).toEqual(0)

                expect(data.t[4]).toEqual(new Date("2021-01-08T21:00:00.000Z"))
                expect(data.o[4]).toEqual(100)
                expect(data.h[4]).toEqual(200)
                expect(data.l[4]).toEqual(300)
                expect(data.c[4]).toEqual(400)
                expect(data.v[4]).toEqual(500)
            })
    })

    test("can resample timestamps: source ends early", () => {
        const algo = createAlgo({
            meta: {},
            t: [new Date("2021-01-04T16:00:00.000-05:00")], // 4pm in America/New York (winter)
            o: [100],
            h: [200],
            l: [300],
            c: [400],
            v: [500],
        })

        return createSimulator(algo)
            .run()
            .then((data) => {
                expect(data.t.length).toEqual(5)
                expect(data.meta.firstT).toEqual(new Date("2021-01-04T21:00:00.000Z"))
                expect(data.meta.lastT).toEqual(new Date("2021-01-04T21:00:00.000Z"))

                expect(data.t[0]).toEqual(new Date("2021-01-04T21:00:00.000Z"))
                expect(data.o[0]).toEqual(100)
                expect(data.h[0]).toEqual(200)
                expect(data.l[0]).toEqual(300)
                expect(data.c[0]).toEqual(400)
                expect(data.v[0]).toEqual(500)

                expect(data.t[1]).toEqual(new Date("2021-01-05T21:00:00.000Z"))
                expect(data.o[1]).toEqual(400)
                expect(data.h[1]).toEqual(400)
                expect(data.l[1]).toEqual(400)
                expect(data.c[1]).toEqual(400)
                expect(data.v[1]).toEqual(0)

                expect(data.t[2]).toEqual(new Date("2021-01-06T21:00:00.000Z"))
                expect(data.o[2]).toEqual(400)
                expect(data.h[2]).toEqual(400)
                expect(data.l[2]).toEqual(400)
                expect(data.c[2]).toEqual(400)
                expect(data.v[2]).toEqual(0)

                expect(data.t[3]).toEqual(new Date("2021-01-07T21:00:00.000Z"))
                expect(data.o[3]).toEqual(400)
                expect(data.h[3]).toEqual(400)
                expect(data.l[3]).toEqual(400)
                expect(data.c[3]).toEqual(400)
                expect(data.v[3]).toEqual(0)

                expect(data.t[4]).toEqual(new Date("2021-01-08T21:00:00.000Z"))
                expect(data.o[4]).toEqual(400)
                expect(data.h[4]).toEqual(400)
                expect(data.l[4]).toEqual(400)
                expect(data.c[4]).toEqual(400)
                expect(data.v[4]).toEqual(0)
            })    
    })

    test("can resample timestamps: source missing bars", () => {
        const algo = createAlgo({
            meta: {},
            t: [
                new Date("2021-01-04T16:00:00.000-05:00"), // 4pm in America/New York (winter)
                new Date("2021-01-08T16:00:00.000-05:00"),
            ],
            o: [100, 600],
            h: [200, 700],
            l: [300, 800],
            c: [400, 900],
            v: [500, 1000],
        })

        return createSimulator(algo)
            .run()
            .then((data) => {
                expect(data.t.length).toEqual(5)
                expect(data.meta.firstT).toEqual(new Date("2021-01-04T21:00:00.000Z"))
                expect(data.meta.lastT).toEqual(new Date("2021-01-08T21:00:00.000Z"))

                expect(data.t[0]).toEqual(new Date("2021-01-04T21:00:00.000Z"))
                expect(data.o[0]).toEqual(100)
                expect(data.h[0]).toEqual(200)
                expect(data.l[0]).toEqual(300)
                expect(data.c[0]).toEqual(400)
                expect(data.v[0]).toEqual(500)

                expect(data.t[1]).toEqual(new Date("2021-01-05T21:00:00.000Z"))
                expect(data.o[1]).toEqual(400)
                expect(data.h[1]).toEqual(400)
                expect(data.l[1]).toEqual(400)
                expect(data.c[1]).toEqual(400)
                expect(data.v[1]).toEqual(0)

                expect(data.t[2]).toEqual(new Date("2021-01-06T21:00:00.000Z"))
                expect(data.o[2]).toEqual(400)
                expect(data.h[2]).toEqual(400)
                expect(data.l[2]).toEqual(400)
                expect(data.c[2]).toEqual(400)
                expect(data.v[2]).toEqual(0)

                expect(data.t[3]).toEqual(new Date("2021-01-07T21:00:00.000Z"))
                expect(data.o[3]).toEqual(400)
                expect(data.h[3]).toEqual(400)
                expect(data.l[3]).toEqual(400)
                expect(data.c[3]).toEqual(400)
                expect(data.v[3]).toEqual(0)

                expect(data.t[4]).toEqual(new Date("2021-01-08T21:00:00.000Z"))
                expect(data.o[4]).toEqual(600)
                expect(data.h[4]).toEqual(700)
                expect(data.l[4]).toEqual(800)
                expect(data.c[4]).toEqual(900)
                expect(data.v[4]).toEqual(1000)
            })    
    })

    test("can resample timestamps: source excess bars", () => {
        const algo = createAlgo({
            meta: {},
            t: [
                new Date("2021-01-04T16:00:00.000-05:00"), // 4pm in America/New York (winter)
                new Date("2021-01-05T03:00:00.000-05:00"), // 3am in America/New York (winter)
                new Date("2021-01-05T16:00:00.000-05:00"), // 4pm in America/New York (winter)
            ],
            o: [100, 600, 1100],
            h: [200, 700, 1200],
            l: [300, 800, 1300],
            c: [400, 900, 1400],
            v: [500, 1000, 1500],
        })

        return createSimulator(algo)
            .run()
            .then((data) => {
                expect(data.t.length).toEqual(5)
                expect(data.meta.firstT).toEqual(new Date("2021-01-04T21:00:00.000Z"))
                expect(data.meta.lastT).toEqual(new Date("2021-01-05T21:00:00.000Z"))

                expect(data.t[0]).toEqual(new Date("2021-01-04T21:00:00.000Z"))
                expect(data.o[0]).toEqual(100)
                expect(data.h[0]).toEqual(200)
                expect(data.l[0]).toEqual(300)
                expect(data.c[0]).toEqual(400)
                expect(data.v[0]).toEqual(500)

                expect(data.t[1]).toEqual(new Date("2021-01-05T21:00:00.000Z"))
                expect(data.o[1]).toEqual(1100)
                expect(data.h[1]).toEqual(1200)
                expect(data.l[1]).toEqual(1300)
                expect(data.c[1]).toEqual(1400)
                expect(data.v[1]).toEqual(1500)

                expect(data.t[2]).toEqual(new Date("2021-01-06T21:00:00.000Z"))
                expect(data.o[2]).toEqual(1400)
                expect(data.h[2]).toEqual(1400)
                expect(data.l[2]).toEqual(1400)
                expect(data.c[2]).toEqual(1400)
                expect(data.v[2]).toEqual(0)

                expect(data.t[3]).toEqual(new Date("2021-01-07T21:00:00.000Z"))
                expect(data.o[3]).toEqual(1400)
                expect(data.h[3]).toEqual(1400)
                expect(data.l[3]).toEqual(1400)
                expect(data.c[3]).toEqual(1400)
                expect(data.v[3]).toEqual(0)

                expect(data.t[4]).toEqual(new Date("2021-01-08T21:00:00.000Z"))
                expect(data.o[4]).toEqual(1400)
                expect(data.h[4]).toEqual(1400)
                expect(data.l[4]).toEqual(1400)
                expect(data.c[4]).toEqual(1400)
                expect(data.v[4]).toEqual(0)
            })    
    })
})

//==============================================================================
// end of file
