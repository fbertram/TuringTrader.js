//==============================================================================
// Name:        tests/test-0710-ma-cross
// Project:     TuringTrader.js
// Description: test 0610: simple moving-average crossover strategy
// History:     FUB, 2021vii13, created
//==============================================================================

/*
import { createSimulator } from "../src"

//==============================================================================

const algo = {
    run: async (sim) => {
        sim.startDate = new Date("01/01/2020")
        sim.endDate = new Date("12/31/2020")

        sim.deposit(1e6)

        const spy = sim.asset("spy")
        const agg = sim.asset("agg")

        return sim.loop(async () => {

            if (sim.t(0).getMonth() !== sim.t(-1).getMonth()) {

                // note how we await the indicator results
                // so that we can compare them

                const wSpy = await spy.close.ema(50).t(0) > await spy.close.ema(200).t(0) ?
                    1.0 :
                    0.0
                const wAgg = 1.0 - wSpy

                return [
                    spy.alloc(wSpy, sim.orderTypes.mktNextOpen),
                    agg.alloc(wAgg, sim.orderTypes.mktNextOpen),
                ]
            }
        })
    },
}

//==============================================================================
describe("test 0600: simple orders", () => {

    test("can calculate equity curve", () => {
        return createSimulator(algo).run()
            .then((result) => {
                console.log(result)
                //expect(result.id).toMatch(/^loadAsset\(spy,[0-9]+,[0-9]+\).close.sma\(5\).ema\(10\)$/)
                expect(result.data.x.length).toEqual(83)
            })
    })
})
*/

test("dummy test", () => expect(true).toEqual(true))

//==============================================================================
// end of file
