import type { ChoiceItem, ChoiceItemValueType, FieldType, FormFieldProps, FormFieldState } from "../form";

export interface MultiChoiceFieldProps<T extends ChoiceItem = ChoiceItem> extends FormFieldProps<ChoiceItemValueType<T>[]> {
    /**
     * A list of items as choices.
     * Primitive values in the list will be normalized as {@link ChoiceItem}.
     * If not specified, `allowCustomValues` will be set to `true`.
     */
    items?: readonly (T | Extract<T['value'], number | string | boolean>)[];
    /**
     * Whether values not in the list of items are allowed.
     */
    allowCustomValues?: boolean;
}

export interface MultiChoiceFieldState<T extends ChoiceItem = ChoiceItem> extends FormFieldState<readonly ChoiceItemValueType<T>[]> {
    /**
     * Returns a list of choices as normalized items.
     */
    readonly items: T[];
    /**
     * Toggles the presence of the specified item in the value array associated with the field.
     * If the item is already present, the item will be removed; otherwise the item will be added.
     * @param value Item value.
     */
    toggleValue(value: ChoiceItemValueType<T>): void;
    /**
     * Adds or removes the specified item to/from the value array associated with the field.
     * @param value Item value.
     * @param selected If true, the item is added to the array if it is not present; otherwise the item is removed from the array if it is present.
     */
    toggleValue(value: ChoiceItemValueType<T>, selected: boolean): void;
}

export default class MultiChoiceField implements FieldType<MultiChoiceFieldProps, MultiChoiceFieldState> {
    readonly defaultValue?: any[];

    normalizeValue(value: any, props: MultiChoiceFieldProps<ChoiceItem>): any[];
    postHook(state: FormFieldState<any[]>, props: MultiChoiceFieldProps<ChoiceItem>): MultiChoiceFieldState<ChoiceItem>;
}
