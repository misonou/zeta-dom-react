import { useEffect, useState } from "react";
import { defineObservableProperty, each, watch } from "./include/zeta-dom/util.js";
import { bind } from "./include/zeta-dom/domUtil.js";
import { useDispose, useUpdateTrigger } from "./hooks.js";

export function useMediaQuery(query) {
    var onDispose = useDispose();
    var state = useState(function () {
        var mq = matchMedia(query);
        onDispose.push(bind(mq, 'change', () => {
            state[1](mq.matches);
        }));
        return mq.matches;
    });
    return state[0];
}

/**
 * @param {Zeta.Dictionary<string>} breakpoints
 */
export function createBreakpointContext(breakpoints) {
    var values = {};
    watch(values, true);
    each(breakpoints, function (i, v) {
        var mq = matchMedia(v);
        var setValue = defineObservableProperty(values, i, mq.matches, true);
        bind(mq, 'change', function () {
            setValue(mq.matches);
        });
    });
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
