import { useEffect } from "react";
import { definePrototype } from "zeta-dom/util";

export default function NumericField() { }

definePrototype(NumericField, {
    normalizeValue: function (newValue) {
        newValue = +newValue;
        return isNaN(newValue) ? undefined : newValue;
    },
    postHook: function (state, props) {
        var value = state.value;
        var min = props.min;
        var max = props.max;
        var step = props.step;
        var allowEmpty = props.allowEmpty;
        useEffect(function () {
            var rounded = step > 0 ? Math.round(value / step) * step : value;
            if (rounded < min || (isNaN(rounded) && !allowEmpty)) {
                rounded = min || 0;
            } else if (rounded > max) {
                rounded = max;
            }
            if (rounded !== value) {
                state.setValue(rounded);
            }
        }, [value, min, max, step, allowEmpty]);
        return state;
    }
});
