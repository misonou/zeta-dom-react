import { createContext, useContext, useState } from "react";
import { noop, randomId } from "zeta-dom/util";
import { useSingleton } from "./hooks.js";

/** @type {React.Context<import("./viewState").ViewStateProvider | null>} */
const ViewStateProviderContext = createContext(null);

export const ViewStateProvider = ViewStateProviderContext.Provider;

export function useViewState(key) {
    var uniqueId = useState(randomId)[0];
    var provider = useContext(ViewStateProviderContext);
    return useSingleton(function () {
        return (provider && key && provider.getState(uniqueId, key)) || {
            get: noop,
            set: noop
        };
    }, [provider, key, uniqueId]);
}
