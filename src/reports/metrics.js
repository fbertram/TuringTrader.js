//==============================================================================
// Name:        reports/metrics
// Project:     TuringTrader.js
// Description: Calculate metrics.
// History:     FUB, 2021vii13, created
//==============================================================================

const dayInMs = 24 * 60 * 60 * 1000
const yearInMs = 365.25 * dayInMs

export const createReport = (simResult) => {
    return {
        get metrics() {
            //----- trading range
            const firstBar = simResult.t[0]
            const lastBar = simResult.t[simResult.t.length - 1]
            const reportDays =
                (lastBar.getTime() - firstBar.getTime()) / dayInMs
            const reportYears =
                (lastBar.getTime() - firstBar.getTime()) / yearInMs

            //----- CAGR
            const startValue = simResult.o[0]
            const endValue = simResult.c[simResult.c.length - 1]
            const cagr =
                100 * (Math.pow(endValue / startValue, 1 / reportYears) - 1)

            //----- drawdown
            let maxClose = 0
            const mdd = simResult.c.reduce((prevMdd, newClose) => {
                maxClose = Math.max(maxClose, newClose)
                return Math.max(prevMdd, 100 * (1 - newClose / maxClose))
            }, 0.0)

            return {
                firstBar,
                lastBar,
                reportDays,
                reportYears,

                startValue,
                endValue,
                cagr,
                mdd,
            }
        },
        get chartData() {
            return {}
        },
    }
}

//==============================================================================
// end of file
