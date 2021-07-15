# TuringTrader.js

A next-generation backtesting engine for Node.js with the following goals:

-   optimizied for calculating indices of trading strategies
-   intuitive and easy-to-use indicator APIs
-   powerful features for data management/ backfills
-   advanced features for simulating portfolios of strategies

This project is work in progress and in a very early stage. Here is what's currently working:
* [determine trading days at U.S. stock exchanges](https://github.com/fbertram/TuringTrader.js/blob/main/__tests__/test-0200-calendar.js)
* [load data from Yahoo!](https://github.com/fbertram/TuringTrader.js/blob/main/__tests__/test-0400-asset.js)
* [load data from custom sources and resample to trading calendar](https://github.com/fbertram/TuringTrader.js/blob/main/__tests__/test-0405-custom-asset.js)
* [calculate simple indicators, including EMA and SMA](https://github.com/fbertram/TuringTrader.js/blob/main/__tests__/test-0505-indicator-num.js)
* [simulate simple buy-and-hold portfolios](https://github.com/fbertram/TuringTrader.js/blob/main/__tests__/test-0600-buy-and-hold.js)
* [calculate rudimentary reports](https://github.com/fbertram/TuringTrader.js/blob/main/__tests__/test-5000-metrics.js)

## Installation

The fastest way to add TuringTrader.js to your Node.js project is using our [npm package](https://www.npmjs.com/package/turingtrader.js).

## Documentation

We will have full documentation, but we are just not there, yet. Please check out the [test cases](https://github.com/fbertram/TuringTrader.js/tree/main/__tests__) to see how to run your own backtests.

## Contact

If you have any questions or suggestions, [please reach out](mailto:felix@turingtrader.org).
