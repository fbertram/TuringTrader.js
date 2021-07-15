//==============================================================================
// Name:        index
// Project:     TuringTrader.js
// Description: Module main entrypoint.
// History:     FUB, 2021vii13, created
//==============================================================================

// FIXME: this is required because of using Babel?
// without it, we see an error 'ReferenceError: regeneratorRuntime is not defined',
// which seems to be tied to usage of async/ await
// see here https://babeljs.io/docs/en/usage#polyfill
//import "core-js/stable";
import "regenerator-runtime/runtime";

export { createSimulator } from "./simulator/sim-core"
export { createReport } from "./reports/metrics"

//==============================================================================
// end of file
