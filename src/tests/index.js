//==============================================================================
// Name:        tests/index
// Project:     TuringTrader.js
// Description: run all tests
// History:     FUB, 2021v01, created
//==============================================================================

import { test_01_hello } from "./test-01-hello"
import { test_02_calendar } from "./test-02-calendar"
import { test_03_cache } from "./test-03-cache"
import { test_04_asset } from "./test-04-asset"

const allTests = [
    test_01_hello,
    test_02_calendar,
    test_03_cache,
    test_04_asset,
]

const runTests = () => {
    allTests.forEach(t => {
        console.log(`========== ${t.name} ==============================`)
        t()
    })
}

runTests()

//==============================================================================
// end of file
