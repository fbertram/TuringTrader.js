//==============================================================================
// Name:        demos/demo-100
// Description: demo #100: load data, calculate indicators.
// History:     FUB, 2021iii23, created
//==============================================================================

import { Simulator } from "../simulator"

var sim = Simulator.create((sim) => {
    sim.info(`running simulation. start=${sim.start}, end=${sim.end}`)

    const msft = sim.loadData("MSFT")

    sim.loop(() => {
        const sma = msft.SMA(20).SMA(50)
    })

    return {
        name: "demo-100",
        time: Date.now(),
    }
})

var report = sim.run({
    start: Date.parse("01/01/2007"),
    end: Date.now(),
})

console.log(report)

//==============================================================================
// end of file
