import type { FieldType, FormFieldProps, FormFieldState } from "../form";

export type TextInputAttributes = Pick<React.InputHTMLAttributes<HTMLInputElement>, 'autoComplete' | 'enterKeyHint' | 'inputMode' | 'maxLength' | 'placeholder' | 'type'>;

export interface TextFieldProps<T = string, V = T> extends FormFieldProps<T, V>, TextInputAttributes {
    /**
     * Specifies the text input type.
     */
    type?: 'color' | 'date' | 'datetime-local' | 'email' | 'month' | 'number' | 'password' | 'tel' | 'text' | 'time' | 'url' | 'week' | string & {};
}

export interface TextFieldState<T> extends FormFieldState<T> {
    /**
     * Returns HTML attributes to be applied to an input element.
     */
    readonly inputProps: TextInputAttributes;
}

export default class TextField implements FieldType<TextFieldProps, TextFieldState<string>> {
    readonly defaultValue: string;

    postHook(state: FormFieldState<string>, props: TextFieldProps<string, string>): TextFieldState<string>;
}
