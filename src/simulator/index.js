//==============================================================================
// Name:        simulator/index
// Description: simulator core.
//==============================================================================

import { loadData as _loadData } from "../data"
import { clearCache, cacheData as _cacheData } from "./cache"

export const create = (fn) => {
    const data = {}

    //========== internal interface: methods called inside algorithms
    const internalInterface = {
        // hoisting functions to provide access from everywhere
        setProperty: (name, value) => setProperty(name, value),
        getProperty: (name) => getProperty(name),
        info: (...args) => info(args),
        loadData: (symbol) => loadData(symbol),
        cacheData: (parent, child, fn) => cacheData(parent, child, fn),
        loop: (fn) => loop(fn),
    }

    const setProperty = (name, value) => (data[name] = value)
    const getProperty = (name) => data[name]

    const info = (args) => console.log("INFO: ", args)

    const loadData = (symbol) => _loadData(internalInterface, { symbol })

    const cacheData = (parent, child, fn) =>
        _cacheData(internalInterface, { parent, child, fn })

    const loop = (fn) => {
        // TODO: implement this!
        fn()
        fn()
        fn()
    }

    //========== external interface: methods called on simulator instance
    const run = (settings) => {
        const sim = {
            ...internalInterface,
            ...settings,
        }
        clearCache(sim)
        return fn(sim)
    }

    return {
        run,
    }
}

export const Simulator = {
    create,
}

//==============================================================================
// end of file
