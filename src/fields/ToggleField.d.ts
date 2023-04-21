import type { FieldType, FormFieldProps, FormFieldState } from "../form";

export interface ToggleFieldProps<T = string> extends FormFieldProps<T, boolean> {
    /**
     * Whether the field is checked.
     */
    checked?: boolean;
}

export interface ToggleFieldState extends FormFieldState<boolean> {
}

export default class ToggleField implements FieldType<ToggleFieldProps, ToggleFieldState> {
    readonly defaultValue: boolean;
    readonly valueProperty: string;

    normalizeValue(value: any, props: ToggleFieldProps<string>): boolean;
    isEmpty(value: boolean): boolean;
    postHook(state: FormFieldState<boolean>, props: ToggleFieldProps<string>): ToggleFieldState;
}
