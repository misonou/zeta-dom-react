import { useEffect, useMemo } from "react";
import { useMemoizedFunction } from "../hooks.js";
import { definePrototype, either, extend, freeze, isArray, isUndefinedOrNull, makeArray, splice } from "zeta-dom/util";
import ChoiceField from "./ChoiceField.js";

export default function MultiChoiceField() { }

definePrototype(MultiChoiceField, {
    /** @type {any} */
    defaultValue: freeze([]),
    normalizeValue: function (newValue) {
        return isArray(newValue) || makeArray(newValue);
    },
    postHook: function (state, props) {
        var allowCustomValues = props.allowCustomValues || !props.items;
        var items = ChoiceField.normalizeItems(props.items);
        var isUnknown = function (value) {
            return !items.some(function (v) {
                return v.value === value;
            });
        };
        var toggleValue = useMemoizedFunction(function (value, selected) {
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
        var value = useMemo(function () {
            return makeArray(state.value);
        }, [state.version]);
        useEffect(() => {
            if (!allowCustomValues) {
                var cur = makeArray(value);
                var arr = splice(cur, isUnknown);
                if (arr.length) {
                    state.setValue(cur);
                }
            }
        });
        return extend(state, {
            value: value,
            items: items,
            toggleValue: toggleValue
        });
    }
});
