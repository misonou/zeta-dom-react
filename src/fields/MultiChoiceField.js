import { definePrototype, each, either, extend, freeze, grep, isArray, isUndefinedOrNull, makeArray, splice } from "zeta-dom/util";
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
            state.setValue(function (arr) {
                var newArr = makeArray(arr);
                var updated = grep(makeArray(value), function (v) {
                    var index = newArr.indexOf(v);
                    if (isUndefinedOrNull(selected) || either(index >= 0, selected)) {
                        if (index >= 0) {
                            return newArr.splice(index, 1);
                        } else if (allowCustomValues || !isUnknown(v)) {
                            return newArr.push(v);
                        }
                    }
                });
                return updated.length ? newArr : arr;
            });
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
