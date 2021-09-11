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

            //----- compound annual growth rate
            const startValue = simResult.o[0]
            const endValue = simResult.c[simResult.c.length - 1]
            const cagr =
                100 * (Math.pow(endValue / startValue, 1 / reportYears) - 1)

            //----- month-to-month returns
            const calcMonthlyRets = (simResult) => {
                const monthlyRets = []
                let prevTime = simResult.t[0]
                let prevNav = null

                for (let i = 0; i < simResult.t.length; i++) {
                    const curTime = simResult.t[i]
                    const curNav = simResult.c[i]

                    if (curTime.getMonth() !== prevTime.getMonth()) {
                        if (prevNav !== null)
                            monthlyRets.push(Math.log(curNav / prevNav))

                        prevTime = curTime
                        prevNav = curNav
                    }
                }

                return monthlyRets
            }
            const monthlyRets = calcMonthlyRets(simResult)

            //----- standard deviation of returns
            const avgMonthlyRet = monthlyRets.reduce((sum, ret) => sum + ret, 0.0) / monthlyRets.length
            const stdevMonthly = Math.sqrt(monthlyRets.reduce((sum2, ret) => sum2 + Math.pow(ret - avgMonthlyRet, 2), 0.0) / monthlyRets.length)
            const stdev = 100.0 * Math.sqrt(12.0) * stdevMonthly

            //----- maximum drawdown
            const calcMdd = (simResult) => {
                let maxClose = 0
                return simResult.c.reduce((prevMdd, newClose) => {
                    maxClose = Math.max(maxClose, newClose)
                    return Math.max(prevMdd, 100 * (1 - newClose / maxClose))
                }, 0.0)    
            }
            const mdd = calcMdd(simResult)

            //----- maximum flat days
            const calcMaxFlat = (simResult) => {
                let maxFlat = 0
                let maxIdx = 0

                for (const idx in simResult.t) {
                    const t = simResult.t[idx]
                    const nav = simResult.c[idx]

                    if (nav >= simResult.c[maxIdx]) {
                        maxFlat = Math.max(maxFlat, (t.getTime() - simResult.t[maxIdx].getTime()) / dayInMs)
                        maxIdx = idx
                    }
                }

                return maxFlat
            }
            const maxFlat = calcMaxFlat(simResult)

            //----- ulcer index
            const calcUlcer = (simResult) => {
                let maxNav = 0
                let sumDd2 = 0
                for (const nav of simResult.c) {
                    maxNav = Math.max(maxNav, nav)
                    const dd = 1.0 - nav / maxNav
                    sumDd2 += dd * dd
                }

                return Math.sqrt(sumDd2 / simResult.c.length)
            }
            const ulcer = 100.0 * calcUlcer(simResult)

            //----- sharpe ratio
            const sharpe = cagr / stdev

            //----- martin ratio (ulcer performance index)
            const martin = cagr / ulcer

            return {
                firstBar,
                lastBar,
                reportDays,
                reportYears,
                startValue,
                endValue,
                cagr,
                stdev,
                mdd,
                ulcer,
                mfd: maxFlat,
                sharpe,
                martin,
            }
        },
        get chartData() {
            return simResult
        },
    }
}

//==============================================================================
// end of file
