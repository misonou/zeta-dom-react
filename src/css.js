import { useEffect, useMemo } from "react";
import { combineFn, defineObservableProperty, map, watch } from "zeta-dom/util";
import { bind } from "zeta-dom/domUtil";
import { useEventTrigger, useUpdateTrigger } from "./hooks.js";

export function useMediaQuery(query) {
    var mq = useMemo(function () {
        return matchMedia(query);
    }, [query]);
    useEventTrigger(mq, 'change');
    return mq.matches;
}

/**
 * @param {Zeta.Dictionary<string>} breakpoints
 */
export function createBreakpointContext(breakpoints) {
    var values = {};
    var handleChanges = watch(values, true);
    var updateAll = combineFn(map(breakpoints, function (v, i) {
        var mq = matchMedia(v);
        var setValue = defineObservableProperty(values, i, mq.matches, true);
        bind(mq, 'change', function () {
            if (mq.matches !== values[i]) {
                handleChanges(updateAll);
            }
        });
        return function () {
            return setValue(mq.matches);
        };
    }));
    return {
        breakpoints: Object.freeze(values),
        useBreakpoint: function () {
            var forceUpdate = useUpdateTrigger();
            useEffect(function () {
                return watch(values, forceUpdate);
            }, []);
            return values;
        }
    };
}
