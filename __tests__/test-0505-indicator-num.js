//==============================================================================
// Name:        tests/test-0505-indicator-num
// Project:     TuringTrader.js
// Description: test 0505: calculate indicators on number series
// History:     FUB, 2021vii13, created
//==============================================================================

import { createSimulator } from "../src"

//==============================================================================
const algo = {
    run: async (sim) => {
        // BUGBUG: test may fail in non-US timezones,
        // if a date rollover is involved
        // FIXME: specify timezone offset to remedy

        sim.startDate = new Date("01/01/2021")
        sim.endDate = new Date("05/01/2021")

        // note how we can seamlessly calculate
        // indicators on indicators

        const i = sim.asset("spy").close.sma(5).ema(10)

        return {
            id: i.id,
            data: await i.data,
        }
    },
}

//==============================================================================
describe("test 0505: numberical indicators", () => {
    test("can calculate sma and ema", () => {
        return createSimulator(algo)
            .run()
            .then((result) => {
                expect(result.id).toMatch(/^loadAsset\(spy,[0-9]+,[0-9]+\).close.sma\(5\).ema\(10\)$/)
                expect(result.data.x.length).toEqual(83)
                // TODO: add more verification here
            })
    })
})

//==============================================================================
// end of file
