export const FormContextProvider: React.Provider<FormContext>;

export type ValidateResult = null | undefined | string | Stringifiable | ((props: any) => string);
export type ValidateCallback<T = any> = (value: T, name: string, form: FormContext) => ValidateResult | Promise<ValidateResult>;

type FieldValueType<T> = T extends FormFieldProps<any, infer V> ? V : any;
type FieldPostHookCallback = <S extends FormFieldState, P extends FormFieldProps>(state: S, props: P) => S;

export interface Stringifiable {
    toString(): string;
    [Symbol.toPrimitive](): string;
}

export interface FieldTypeOptions {
    valueProperty?: string;
    postHook?: FieldPostHookCallback;
}

export interface FormFieldProps<T = any, V = T> {
    name?: string;
    value?: T;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    showErrorMessage?: boolean;
    validateOnChange?: boolean;
    isEmpty?: (value: V) => boolean;
    onValidate?: ValidateCallback<V>;
    onChange?: (value: V) => void;
}

export interface FormFieldState<T> {
    readonly form: FormContext | undefined;
    readonly value: T;
    readonly error: string;
    setValue: React.Dispatch<React.SetStateAction<T>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
    elementRef: React.RefCallback<HTMLElement>;
}

export interface FormEventMap {
    reset: Zeta.ZetaEventBase;
    dataChange: DataChangeEvent;
    validate: FormValidateEvent;
    validationChange: FormValidationChangeEvent;
}

export interface DataChangeEvent extends Zeta.ZetaEventBase {
    readonly data: string[];
}

export interface FormValidateEvent extends Zeta.ZetaAsyncHandleableEvent {
    readonly name: string;
    readonly value: any;
}

export interface FormValidationChangeEvent extends Zeta.ZetaEventBase {
    readonly name: string;
    readonly isValid: boolean;
    readonly message: string;
}

export interface FormContextOptions {
    /**
     * Whether form data will be persisted in view state when component is unmounted.
     * Default is `true`.
     */
    autoPersist?: boolean;
    /**
     * Whether validation will be triggered upon changes to form data.
     * Default is `true`.
     */
    validateOnChange?: boolean;
    /**
     * Sets the default action label (or icon) to present for the enter key on virtual keyboards.
     */
    enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
}

export class FormContext<T extends object = Zeta.Dictionary<any>> {
    readonly isValid: boolean;
    readonly data: Partial<T>;

    /**
     * Whether form data will be persisted in view state when component is unmounted.
     * Default is `true`.
     */
    autoPersist: boolean;
    /**
     * Whether validation will be triggered upon changes to form data.
     * Default is `true`.
     */
    validateOnChange: boolean;
    /**
     * Sets the default action label (or icon) to present for the enter key on virtual keyboards.
     */
    enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';

    /**
     * Gets the input element for the specified field.
     * This method only works when {@link FormFieldState.elementRef} is passed to HTML elements.
     * @param name Name of the field.
     */
    element(name: keyof T): HTMLElement | undefined;

    /**
     * Focus the input element for the specified field.
     * This method only works when {@link FormFieldState.elementRef} is passed to HTML elements.
     * @param name Name of the field.
     */
    focus(name: keyof T): void;

    /**
     * Registers event handlers.
     * @param event Name of the event.
     * @param handler A callback function to be fired when the specified event is triggered.
     * @returns A function that will unregister the handlers when called.
     * @see {@link FormEventMap}
     */
    on<E extends keyof FormEventMap>(event: E, handler: Zeta.ZetaEventHandler<E, FormEventMap, FormContext<T>>): Zeta.UnregisterCallback;

    /**
     * Persists form data to view state.
     * Calling to this method will set {@link FormContext.autoPersist} to `false`.
     */
    persist(): void;

    /**
     * Restores form data from view state if any.
     * @returns Whether there was persisted data restored.
     */
    restore(): boolean;

    /**
     * Resets all fields to initial values and clear all validation errors.
     */
    reset(): void;

    /**
     * Updates validation error for a specific field.
     * The error will be cleared when validation is called, or when field value is modified when `validateOnChange` is `true`.
     * @param name Name of the field.
     * @param error A non-empty string or stringifiable object indicating error; or a falsy value to clear previous error.
     */
    setError(name: keyof T, error: ValidateResult): void;

    /**
     * Validates all fields.
     */
    async validate(): Promise<boolean>;

    /**
     * Validates specific fields.
     * @param props Fields to be validated.
     */
    async validate(...props: string[]): Promise<boolean>;
}

/**
 * Creates a memoized {@link FormContext} object.
 * @param initialData Initial form data.
 * @param options If boolean is given, it sets the {@link FormContextOptions.validateOnChange} flag. Default is `true`.
 */
export function useFormContext<T extends object = Zeta.Dictionary<any>>(initialData: Partial<T> = {}, options: boolean | FormContextOptions = true): FormContext<T>;

/**
 * Creates a memoized {@link FormContext} object.
 * @param persistKey A unique key for enabling the persisting of form data in view state.
 * @param initialData Initial form data.
 * @param options If boolean is given, it sets the {@link FormContextOptions.validateOnChange} flag. Default is `true`.
 */
export function useFormContext<T extends object = Zeta.Dictionary<any>>(persistKey: string, initialData: Partial<T> = {}, options: boolean | FormContextOptions = true): FormContext<T>;

export function useFormField<T extends FormFieldProps>(props: T, defaultValue: FieldValueType<T>, prop: keyof T = 'value'): FormFieldState<FieldValueType<T>>;

export function useFormField<K extends keyof Zeta.ReactFieldTypes, T extends Parameters<Zeta.ReactFieldTypes[K]>[0]>(type: K, props: T, defaultValue: FieldValueType<T>, prop?: keyof T): ReturnType<Zeta.ReactFieldTypes<T>[K]>;

/**
 * Combines one or more validator callbacks.
 * Supplied callbacks are called sequentially after the previous one have resolved.
 * A non-falsy value resolved from a callback is considered a validation failure and successing callbacks will **not** be called.
 * @param validators A list of validators. Non-function items are ignored.
 */
export function combineValidators<T>(...validators: (ValidateCallback<T> | false | '' | 0 | undefined | null)[]): ValidateCallback<T>;

export function registerFieldType(type: string, postHook: FieldPostHookCallback): void;

export function registerFieldType(type: string, options: FieldTypeOptions): void;

/*
 * Type declaration in global namespace for extensibility
 */
declare global {
    namespace Zeta {
        type ReactFieldType<P, S> = (props: P) => S;
        type ReactFieldValueType<T> = FieldValueType<T>;

        interface ReactFieldTypes<T = any> {
            text: ReactFieldType<TextFieldProps, TextFieldState<FieldValueType<T>>>;
            toggle: ReactFieldType<ToggleFieldProps, ToggleFieldState>;
            choice: ReactFieldType<ChoiceFieldProps, ChoiceFieldState<T extends ChoiceFieldProps<infer V> ? V : ChoiceItem>>;
        }
    }
}

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

export interface ToggleFieldProps<T = string> extends FormFieldProps<T, boolean> {
    checked?: boolean;
}

export interface ToggleFieldState extends FormFieldState<boolean> {
}

type ChoiceItemValueType<T extends ChoiceItem> = T extends ChoiceItem<infer U> ? U : any;

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
