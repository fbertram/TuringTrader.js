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
import { test_05_indicator_bar } from "./test-05-indicator-bar"
import { test_06_indicator_num } from "./test-06-indicator-num"
import { test_07_time_series } from "./test-07-time-series"
import { test_08_orders } from "./test-08-orders"

const allTests = [
    /*test_01_hello,
    test_02_calendar,
    test_03_cache,*/
    test_04_asset,
    /*test_05_indicator_bar,
    test_06_indicator_num,
    test_07_time_series,*/
    test_08_orders,
]

const runTests = () => {
    allTests.forEach((t) => {
        console.log(`========== ${t.name} ==============================`)
        t()
    })
}

runTests()

//==============================================================================
// end of file
