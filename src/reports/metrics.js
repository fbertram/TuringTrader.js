//==============================================================================
// Name:        reports/metrics
// Project:     TuringTrader.js
// Description: Calculate metrics.
// History:     FUB, 2021vii13, created
//==============================================================================

const dayInMs = 24 * 60 * 60 * 1000
const yearInMs = 365.25 * dayInMs

export const createReport = (simResult) => {
    const data = {
        // cache cpu-hungry results here
    }

    const getMain = () => simResult
    const getBench = () => simResult.benchmark ? {t: simResult.t, c: simResult.benchmark.c} : null
    const getRfRate = () => simResult.riskFree ? {t: simResult.t, c: simResult.riskFree.c} : null

    const getMonthlyNavs = (series) => {
        const monthlyNavs = {
            t: [],
            c: [],
        }

        let prevTime = null
        let prevNav = null

        for (let i = 0; i < series.t.length; i++) {
            const curTime = series.t[i]
            const curNav = series.c[i]

            if (prevTime && curTime.getMonth() !== prevTime.getMonth()) {
                // capture nav on first day of month
                monthlyNavs.t.push(curTime)
                monthlyNavs.c.push(curNav)
                // FIXME: we want to capture nav on the last day of the month
                // however, to keep numbers consistent w/ previous releases,
                // we did not enable this code, yet
                //monthlyNavs.t.push(prevTime)
                //monthlyNavs.c.push(prevNav)
            }

            prevTime = curTime
            prevNav = curNav
        }

        return monthlyNavs
    }

    const getMonthlyRets = (series) => {
        const monthlyNavs = getMonthlyNavs(series)
        const r = monthlyNavs.c
            .map((nav, idx) => idx > 0 ? Math.log(nav / monthlyNavs.c[idx - 1]) : null)
            .slice(1)
        return {
            t: monthlyNavs.t.slice(1),
            r,
        }
    }

    const metricsInterface = {
        //----- trading range
        get firstBar() {
            return getMain().t[0]
        },
        get lastBar() {
            return getMain().t[simResult.t.length - 1]
        },
        get reportDays() {
            return (metricsInterface.lastBar.getTime() - metricsInterface.firstBar.getTime()) / dayInMs
        },
        get reportYears() {
            return (metricsInterface.lastBar.getTime() - metricsInterface.firstBar.getTime()) / yearInMs
        },
        get startValue() {
            const bench = getBench()
            return bench ? 
                [getMain().o[0], getBench().c[0]] : 
                getMain().o[0]
        },
        get endValue() {
            const bench = getBench()
            return bench ? 
                [getMain().c[getMain().c.length - 1], getBench().c[getBench().c.length - 1]] : 
                getMain().c[getMain().c.length - 1]
        },
        //----- statistical measures (cagr, stdev)
        get cagr() {
            const start = metricsInterface.startValue
            const end = metricsInterface.endValue
            const calcCagr = (start, end) => 100 * (Math.pow(end / start, 1 / metricsInterface.reportYears) - 1)
            return Array.isArray(start) ? 
                [calcCagr(start[0], end[0]), calcCagr(start[1], end[1])] : 
                calcCagr(start, end)
        },
        cagrPeriod(tradingDays) {
            const bench = getBench()
            return bench ?
                [
                    100 * (getMain().c[getMain().c.length - 1] / getMain().c[getMain().c.length - tradingDays - 1] - 1),
                    100 * (getBench().c[getBench().c.length - 1] / getBench().c[getBench().c.length - tradingDays - 1] - 1)
                ] :
                100 * (getMain().c[getMain().c.length - 1] / getMain().c[getMain().c.length - tradingDays - 1] - 1)
        },
        get stdev() {
            const calcStdev = (series) => {
                const returns = getMonthlyRets(series)
                const average = returns.r.reduce((sum, ret) => sum + ret, 0.0) / returns.r.length
                const stdevMonthly = Math.sqrt(returns.r.reduce((sum2, ret) => sum2 + Math.pow(ret - average, 2), 0.0) / returns.r.length)
                const stdevAnnualized = Math.sqrt(12.0) * stdevMonthly
                return 100 * stdevAnnualized
            }

            const main = getMain()
            const bench = getBench()
            return bench ?
                [calcStdev(main), calcStdev(bench)] :
                calcStdev(main)
        },
        //----- drawdown measures (mdd, ulcer, mfd)
        get mdd() {
            const calcMdd = (series) => {
                let maxClose = 0
                return series.c.reduce((prevMdd, newClose) => {
                    maxClose = Math.max(maxClose, newClose)
                    return Math.max(prevMdd, 100 * (1 - newClose / maxClose))
                }, 0.0)    
            }

            const main = getMain()
            const bench = getBench()
            return bench ? 
                [calcMdd(main), calcMdd(bench)] :
                calcMdd(main)
        },
        get ulcer() {
            const calcUlcer = (series) => {
                let maxNav = 0
                let sumDd2 = 0
                for (const nav of series.c) {
                    maxNav = Math.max(maxNav, nav)
                    const dd = 1.0 - nav / maxNav
                    sumDd2 += dd * dd
                }

                const ulcer = Math.sqrt(sumDd2 / series.c.length)
                return 100 * ulcer
            }
            const main = getMain()
            const bench = getBench()
            return bench ? 
                [calcUlcer(main), calcUlcer(bench)] :
                calcUlcer(main)
        },
        get mfd() {
            const calcMfd = (series) => {
                let maxFlat = 0
                let maxIdx = 0

                for (const idx in series.t) {
                    const t = series.t[idx]
                    const nav = series.c[idx]

                    if (nav >= series.c[maxIdx]) {
                        maxFlat = Math.max(maxFlat, 
                            Math.round((t.getTime() - series.t[maxIdx].getTime()) / dayInMs))
                        maxIdx = idx
                    }
                }

                return maxFlat
            }
            const main = getMain()
            const bench = getBench()
            return bench ? 
                [calcMfd(main), calcMfd(bench)] :
                calcMfd(main)
        },
        //----- risk-adjusted returns (sharpe, martin)
        get sharpe() {
            const calcSharpe = (series) => {
                // FIXME: consider risk-free rate here
                const assetReturns = getMonthlyRets(series)
                const rfRate = getRfRate()
                const riskFreeReturns = rfRate ? 
                    getMonthlyNavs(rfRate) : 
                    null
                const excessReturns = rfRate ? {
                        t: assetReturns.t,
                        r: assetReturns.r.map((ret, idx) => ret - riskFreeReturns.c[idx] / 12 / 100),
                    } :
                    assetReturns
                const average = excessReturns.r.reduce((sum, ret) => sum + ret, 0.0) / excessReturns.r.length
                const stdev = Math.sqrt(excessReturns.r.reduce((sum2, ret) => sum2 + Math.pow(ret - average, 2), 0.0) / excessReturns.r.length)
                const sharpeMonthly = average / stdev
                const sharpeAnnualized = Math.sqrt(12) * sharpeMonthly
                return sharpeAnnualized
            }
            const main = getMain()
            const bench = getBench()
            return bench ? 
                [calcSharpe(main), calcSharpe(bench)] :
                calcSharpe(main)
        },
        get martin() {
            const cagr = metricsInterface.cagr
            const ulcer = metricsInterface.ulcer

            return Array.isArray(cagr) ?
                [cagr[0] / ulcer[0], cagr[1] / ulcer[1]] :
                cagr / ulcer
        },
        //----- benchmarked measures (beta)
        get beta() {
            const calcBeta = (asset, bench) => {
                const assetRet = getMonthlyRets(asset)
                const assetAvg = assetRet.r.reduce((sum, ret) => sum + ret, 0) / assetRet.r.length
                const benchRet = getMonthlyRets(bench)
                const benchAvg = benchRet.r.reduce((sum, ret) => sum + ret, 0.0) / benchRet.r.length
                const benchVar = benchRet.r.reduce((sum, ret) => sum + Math.pow(ret - benchAvg, 2)) / (benchRet.r.length - 1)
                const covar = assetRet.r
                    .map((ret, idx) => (ret - assetAvg) * (benchRet.r[idx] - benchAvg))
                    .reduce((sum, val) => sum + val, 0.0) / (assetRet.r.length - 1)

                const beta = covar / benchVar
                return beta
            }

            const main = getMain()
            const bench = getBench()
            const beta = calcBeta(main, bench)
            return beta
        },
    }

    return {
        metrics: metricsInterface,
        chartData: simResult,
    }
}

//==============================================================================
// end of file
