//==============================================================================
// Name:        tests/test-0702-order-types
// Project:     TuringTrader.js
// Description: test 0702: execution of various order types
// History:     FUB, 2021xii03, created
//==============================================================================

import { createSimulator, createReport } from "../src"

//==============================================================================
const algo1 = {
    run: async (sim) => {
        sim.startDate = new Date("2020-12-31T18:00:00.000-05:00") // 6pm in America/New York (winter)
        sim.endDate = new Date("2020-12-31T18:00:00.000-05:00") // 6pm in America/New York (winter)

        sim.deposit(1000)

        return sim.loop(() => {
            if (sim.t(0).getMonth() !== sim.t(-1).getMonth()) {
                return [sim.asset("spy").alloc(1.0, sim.orderTypes.mktNextOpen)]
            }
        })
    },
}

//------------------------------------------------------------------------------
const algo2 = {
    run: async (sim) => {
        sim.startDate = new Date("2020-12-31T18:00:00.000-05:00") // 6pm in America/New York (winter)
        sim.endDate = new Date("2021-01-04T18:00:00.000-05:00") // 6pm in America/New York (winter)

        sim.deposit(1000)

        return sim.loop(() => {
            if (sim.t(0).getMonth() !== sim.t(-1).getMonth()) {
                return [sim.asset("spy").alloc(1.0, sim.orderTypes.mktNextOpen)]
            }
        })
    },
}

//------------------------------------------------------------------------------
const algo3 = {
    run: async (sim) => {
        sim.startDate = new Date("2020-12-31T18:00:00.000-05:00") // 6pm in America/New York (winter)
        sim.endDate = new Date("2021-01-04T18:00:00.000-05:00") // 6pm in America/New York (winter)

        sim.deposit(1000)

        return sim.loop(() => {
            if (sim.t(0).getMonth() !== sim.t(-1).getMonth()) {
                return [sim.asset("spy").alloc(1.0, sim.orderTypes.mktThisClose)]
            }
        })
    },
}

//==============================================================================
describe("test 0702: test order types", () => {
    test("mktNextOpen: executed on day of submission", () => {
        return createSimulator(algo1)
            .run()
            .then((result) => {
                //console.log(JSON.stringify(result))

                expect(result.o[0]).toBeCloseTo(1000, 3)
                expect(result.c[0]).toBeCloseTo(1000, 3)
                expect(result.oAlloc[0].ticker).toEqual([])
                expect(result.oAlloc[0].weight).toEqual([])
                expect(result.cAlloc[0].ticker[0]).toEqual('spy')
                expect(result.cAlloc[0].weight[0]).toBeCloseTo(1, 5)
            })
    })

    test("mktNextOpen: regular execution", () => {
        return createSimulator(algo2)
            .run()
            .then((result) => {
                console.log(JSON.stringify(result))

                expect(result.o[0]).toBeCloseTo(1000, 3)
                expect(result.c[0]).toBeCloseTo(1000, 3)
                expect(result.oAlloc[0].ticker).toEqual([])
                expect(result.oAlloc[0].weight).toEqual([])
                expect(result.cAlloc[0].ticker[0]).toEqual('spy')
                expect(result.cAlloc[0].weight[0]).toEqual(0)

                expect(result.o[1]).toBeCloseTo(1000, 3)
                expect(result.c[1]).toBeCloseTo(982.6277, 3)
                expect(result.oAlloc[1].ticker[0]).toEqual('spy')
                expect(result.oAlloc[1].weight[0]).toBeCloseTo(1, 5)
                expect(result.cAlloc[1].ticker[0]).toEqual('spy')
                expect(result.cAlloc[1].weight[0]).toBeCloseTo(1, 5)
            })
    })

    test("mktThisClose", () => {
        return createSimulator(algo3)
            .run()
            .then((result) => {
                //console.log(JSON.stringify(result))

                expect(result.o[0]).toBeCloseTo(1000, 3)
                expect(result.c[0]).toBeCloseTo(1000, 3)
                expect(result.oAlloc[0].ticker).toEqual([])
                expect(result.oAlloc[0].weight).toEqual([])
                expect(result.cAlloc[0].ticker[0]).toEqual('spy')
                expect(result.cAlloc[0].weight[0]).toBeCloseTo(1, 5)

                expect(result.o[1]).toBeCloseTo(1003.8247, 3)
                expect(result.c[1]).toBeCloseTo(986.3860, 3)
                expect(result.oAlloc[1].ticker[0]).toEqual('spy')
                expect(result.oAlloc[1].weight[0]).toBeCloseTo(1, 5)
                expect(result.cAlloc[1].ticker[0]).toEqual('spy')
                expect(result.cAlloc[1].weight[0]).toBeCloseTo(1, 5)
            })
    })
})

//==============================================================================
// end of file
