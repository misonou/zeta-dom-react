import { definePrototype, extend, isUndefinedOrNull, pick } from "../include/zeta-dom/util.js";

export default function TextField() { }

definePrototype(TextField, {
    defaultValue: '',
    normalizeValue: function (value) {
        return isUndefinedOrNull(value) ? '' : String(value);
    },
    postHook: function (state, props) {
        var form = state.form;
        var inputProps = pick(props, ['type', 'disabled', 'autoComplete', 'maxLength', 'inputMode', 'placeholder', 'enterKeyHint', 'readOnly']);
        if (props.type === 'password' && !inputProps.autoComplete) {
            inputProps.autoComplete = 'current-password';
        }
        inputProps.type = inputProps.type || 'text';
        inputProps.enterKeyHint = inputProps.enterKeyHint || (form && form.enterKeyHint);
        return extend(state, {
            inputProps: inputProps
        });
    }
});
