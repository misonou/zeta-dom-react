import { useCallback } from "react";
import { definePrototype, extend } from "../include/zeta-dom/util.js";

export default function ToggleField() { }

definePrototype(ToggleField, {
    defaultValue: false,
    valueProperty: 'checked',
    normalizeValue: function (value) {
        return !!value;
    },
    isEmpty: function (value) {
        return !value;
    },
    postHook: function (state) {
        const toggleValue = useCallback(function () {
            state.setValue(function (v) {
                return !v;
            });
        }, []);
        return extend(state, {
            toggleValue: toggleValue
        });
    }
});
