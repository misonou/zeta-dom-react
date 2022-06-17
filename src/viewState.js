import { createContext, useContext, useEffect, useState } from "react";
import { noop, randomId } from "./include/zeta-dom/util.js";

/** @type {React.Context<import("./viewState").ViewStateProvider | null>} */
// @ts-ignore: type inference issue
const ViewStateProviderContext = createContext(null);
const noopStorage = Object.freeze({
    get: noop,
    set: noop
});

export const ViewStateProvider = ViewStateProviderContext.Provider;

export function useViewState(key) {
    var uniqueId = useState(randomId)[0];
    var provider = useContext(ViewStateProviderContext);
    var state = (provider && key && provider.getState(uniqueId, key)) || noopStorage;
    useEffect(function () {
        return state.dispose && state.dispose.bind(state);
    }, [state]);
    return state;
}
