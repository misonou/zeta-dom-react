import { definePrototype } from "../include/zeta-dom/util.js";

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
        return state;
    }
});
