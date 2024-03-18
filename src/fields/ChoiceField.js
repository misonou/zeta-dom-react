import { useEffect, useMemo } from "react";
import { define, definePrototype, extend } from "zeta-dom/util";

export default function ChoiceField() { }

function normalizeChoiceItems(items) {
    return useMemo(function () {
        return (items || []).map(function (v) {
            return typeof v === 'object' ? v : { label: String(v), value: v };
        });
    }, [items]);
}

define(ChoiceField, {
    normalizeItems: normalizeChoiceItems
});

definePrototype(ChoiceField, {
    defaultValue: '',
    postHook: function (state, props) {
        var items = normalizeChoiceItems(props.items);
        var selectedIndex = items.findIndex(function (v) {
            return v.value === state.value;
        });
        useEffect(() => {
            if (selectedIndex < 0) {
                selectedIndex = props.allowUnselect || !items[0] ? -1 : 0;
                state.setValue(selectedIndex < 0 ? '' : items[0].value);
            }
        });
        return extend(state, {
            items: items,
            selectedIndex: selectedIndex,
            selectedItem: items[selectedIndex]
        });
    }
});
