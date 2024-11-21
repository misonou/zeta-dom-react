import { define, definePrototype, extend } from "zeta-dom/util";

export default function ChoiceField() { }

function normalizeChoiceItems(items) {
    return (items || []).map(function (v) {
        return typeof v === 'object' ? v : { label: String(v), value: v };
    });
}

define(ChoiceField, {
    normalizeItems: normalizeChoiceItems
});

definePrototype(ChoiceField, {
    defaultValue: '',
    postHook: function (state, props, hook) {
        var items = hook.memo(function () {
            return normalizeChoiceItems(props.items);
        }, [props.items]);
        var allowUnselect = props.allowUnselect || !items[0];
        var selectedIndex = items.findIndex(function (v) {
            return v.value === state.value;
        });
        hook.memo(function () {
            if (selectedIndex < 0) {
                state.setValue(allowUnselect ? '' : items[0].value);
            }
        }, [state.version, selectedIndex, allowUnselect]);
        return extend(state, {
            items: items,
            selectedIndex: selectedIndex,
            selectedItem: items[selectedIndex]
        });
    }
});
