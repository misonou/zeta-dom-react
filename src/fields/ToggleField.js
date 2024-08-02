import { definePrototype, extend } from "zeta-dom/util";

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
    postHook: function (state, props, hook) {
        return extend(state, {
            toggleValue: hook.callback(function () {
                state.setValue(function (v) {
                    return !v;
                });
            })
        });
    }
});
