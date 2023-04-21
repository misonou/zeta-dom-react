import type { FieldType, FormFieldProps, FormFieldState } from "../form";

export type ChoiceItemValueType<T extends ChoiceItem> = T extends ChoiceItem<infer U> ? U : any;

export interface ChoiceItem<T = any> {
    value: T;
    label: string;
    hidden?: boolean;
    disabled?: boolean;
}

export interface ChoiceFieldProps<T extends ChoiceItem = ChoiceItem> extends FormFieldProps<ChoiceItemValueType<T> | ''> {
    /**
     * A list of items as choices.
     * Primitive values in the list will be normalized as {@link ChoiceItem}.
     */
    items: readonly (T | Extract<T['value'], number | string | boolean>)[];
    /**
     * Whether the field can be empty, i.e. none of the choices are selected.
     */
    allowUnselect?: boolean;
}

export interface ChoiceFieldState<T extends ChoiceItem = ChoiceItem> extends FormFieldState<ChoiceItemValueType<T> | ''> {
    /**
     * Returns a list of choices as normalized items.
     */
    readonly items: T[];
    /**
     * Returns the index of selected item, `-1` if there's none.
     */
    readonly selectedIndex: number;
    /**
     * Returns the selected item.
     */
    readonly selectedItem: T | undefined;
}

export default class ChoiceField implements FieldType<ChoiceFieldProps, ChoiceFieldState> {
    readonly defaultValue: any;

    postHook(state: FormFieldState<any>, props: ChoiceFieldProps<ChoiceItem<any>>): ChoiceFieldState<ChoiceItem<any>>;
}
