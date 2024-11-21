import { definePrototype, either, extend, freeze, isArray, isUndefinedOrNull, makeArray, splice } from "zeta-dom/util";
import ChoiceField from "./ChoiceField.js";

export default function MultiChoiceField() { }

definePrototype(MultiChoiceField, {
    /** @type {any} */
    defaultValue: freeze([]),
    normalizeValue: function (newValue) {
        return isArray(newValue) || makeArray(newValue);
    },
    postHook: function (state, props, hook) {
        var allowCustomValues = props.allowCustomValues || !props.items;
        var items = hook.memo(function () {
            return ChoiceField.normalizeItems(props.items);
        }, [props.items]);
        var isUnknown = function (value) {
            return !items.some(function (v) {
                return v.value === value;
            });
        };
        var toggleValue = hook.callback(function (value, selected) {
            if (allowCustomValues || !isUnknown(value)) {
                state.setValue(function (arr) {
                    var index = arr.indexOf(value);
                    if (isUndefinedOrNull(selected) || either(index >= 0, selected)) {
                        arr = makeArray(arr);
                        if (index < 0) {
                            arr.push(value);
                        } else {
                            arr.splice(index, 1);
                        }
                    }
                    return arr;
                });
            }
        });
        var value = hook.memo(function () {
            return makeArray(state.value);
        }, [state.version]);
        hook.memo(function () {
            if (!allowCustomValues) {
                var cur = makeArray(value);
                var arr = splice(cur, isUnknown);
                if (arr.length) {
                    state.setValue(cur);
                }
            }
        }, [value, items, allowCustomValues]);
        return extend(state, {
            value: value,
            items: items,
            toggleValue: toggleValue
        });
    }
});
