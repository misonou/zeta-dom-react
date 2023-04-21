import type { FieldType, FormFieldProps, FormFieldState } from "../form";

export interface NumericFieldProps extends FormFieldProps<number> {
    /**
     * Specifies the minimum value allowed.
     * Value will be automatically set to this value if a smaller value is entered.
     */
    min?: number;
    /**
     * Specifies the maximum value allowed.
     * Value will be automatically set to this value if a larger value is entered.
     */
    max?: number;
    /**
     * Specifies that the field value must be a multiple of such number.
     * If not specified or `0` is supplied, field value can have arbitary decimal places. Negative values will be ignored.
     */
    step?: number;
    /**
     * Specifies whether the field can be empty.
     */
    allowEmpty?: boolean;
}

export interface NumericFieldState extends FormFieldState<number> {
}

export default class NumericField implements FieldType<NumericFieldProps, NumericFieldState> {
    normalizeValue(value: any, props: NumericFieldProps): number;
    postHook(state: FormFieldState<number>, props: NumericFieldProps): NumericFieldState;
}
