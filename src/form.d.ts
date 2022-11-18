export const FormContextProvider: React.Provider<FormContext>;
export const Form: <T>(props: FormProps<T>) => JSX.Element;

export type ValidateResult = null | undefined | string | Stringifiable | ((props: any) => string);
export type ValidateCallback<T = any> = (value: T, name: string, form: FormContext) => ValidateResult | Promise<ValidateResult>;

type WithFallback<T, U> = [T] extends [never] ? U : T;
type FieldValueType<T> = T extends FormFieldProps<any, infer V> ? V : any;
type FieldStateType<K, T> = WithFallback<{
    [P in keyof Zeta.ReactFieldTypeMap]: Zeta.ReactFieldTypeMap[P] extends Zeta.ReactFieldType<K, any> ? ReturnType<Zeta.ReactFieldTypeMap<T>[P]> : never;
}[keyof Zeta.ReactFieldTypeMap],
    ReturnType<InstanceType<K>['postHook']>>;
/** @deprecated */
type FieldPostHookCallback = <S extends FormFieldState, P extends FormFieldProps>(state: S, props: P) => S;

export interface Stringifiable {
    toString(): string;
    [Symbol.toPrimitive](): string;
}

/**
 * Represent internal working of a custom field type.
 * @deprecated Custom field type is now implemented by writing a class implementing the {@link FieldType} inferface and pass it as the first argument to {@link useFormField} instead.
 */
export interface FieldTypeOptions {
    valueProperty?: string;
    isEmpty?: (value: any) => boolean;
    postHook?: FieldPostHookCallback;
}

export interface FieldTypeConstructor<P extends FormFieldProps, S extends FormFieldState> {
    new(): FieldType<P, S>;
}

export interface FieldType<P extends FormFieldProps, S extends FormFieldState> {
    /**
     * Specifies the name of prop that will control {@link FormFieldState.value} when specified.
     * Default is `value`.
     */
    valueProperty?: string;
    /**
     * Overrides default behavior of empty field checking.
     * The field is invalid when it is required and the `isEmpty` callback return `true`.
     * @param value Current field value.
     */
    isEmpty?(value: FieldValueType<P>): boolean;
    /**
     * Applies additional logic and modification to field state.
     * @param state Untouched field state returned from hook.
     * @param props Props passed to {@link useFormField}.
     */
    postHook(state: FormFieldState<FieldValueType<P>>, props: P): S;
}

export interface FormFieldProps<T = any, V = T> {
    name?: string;
    label?: string;
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

export interface FormFieldState<T = any> {
    readonly form: FormContext | undefined;
    readonly value: T;
    readonly error: string;
    setValue: React.Dispatch<React.SetStateAction<T>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
    elementRef: React.RefCallback<HTMLElement>;
}

export interface FormProps<T = any> extends React.ComponentPropsWithRef<'form'>, Pick<FormContextOptions, 'enterKeyHint' | 'preventLeave'> {
    context: FormContext<T>;
}

export interface FormEventMap {
    reset: Zeta.ZetaEventBase;
    dataChange: DataChangeEvent;
    validate: FormValidateEvent;
    validationChange: FormValidationChangeEvent;
    beforeLeave: Zeta.ZetaAsyncHandleableEvent;
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
     * Whether it should prompt user before leaving the page when form data has been entered.
     */
    preventLeave?: boolean;
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
    readonly ref: React.RefCallback<HTMLFormElement>;

    /**
     * Whether form data will be persisted in view state when component is unmounted.
     * Default is `true`.
     */
    autoPersist: boolean;
    /**
     * Whether it should prompt user before leaving the page when form data has been entered.
     */
    preventLeave: boolean;
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

    /**
     * Returns a raw value object.
     */
    toJSON(): T;
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

/**
 * @deprecated Use overload where first argument is the field type constructor instead.
 */
export function useFormField<K extends keyof Zeta.ReactFieldTypes, T extends Parameters<Zeta.ReactFieldTypes[K]>[0]>(type: K, props: T, defaultValue: FieldValueType<T>, prop?: keyof T): ReturnType<Zeta.ReactFieldTypes<T>[K]>;

export function useFormField<K extends FieldTypeConstructor, T extends (K extends FieldTypeConstructor<infer T> ? T : any)>(type: K, props: T, defaultValue: FieldValueType<T>): FieldStateType<K, T>;

export function useFormField<T extends FormFieldProps>(props: T, defaultValue: FieldValueType<T>, prop: keyof T = 'value'): FormFieldState<FieldValueType<T>>;

/**
 * Combines one or more validator callbacks.
 * Supplied callbacks are called sequentially after the previous one have resolved.
 * A non-falsy value resolved from a callback is considered a validation failure and successing callbacks will **not** be called.
 * @param validators A list of validators. Non-function items are ignored.
 */
export function combineValidators<T>(...validators: (ValidateCallback<T> | false | '' | 0 | undefined | null)[]): ValidateCallback<T>;

/**
 * Register a custom field type.
 * @param type A unique name that the field type can be referred to when calling {@link useFormField}.
 * @param postHook A callback that returns customized field state.
 * @deprecated Custom field type is now implemented by writing a class implementing the {@link FieldType} inferface and pass it as the first argument to {@link useFormField} instead.
 */
export function registerFieldType(type: string, postHook: FieldPostHookCallback): void;

/**
 * Register a custom field type.
 * @param type A unique name that the field type can be referred to when calling {@link useFormField}.
 * @param options An object specifiying customizations. See {@link FieldTypeOptions}.
 * @deprecated Custom field type is now implemented by writing a class implementing the {@link FieldType} inferface and pass it as the first argument to {@link useFormField} instead.
 */
export function registerFieldType(type: string, options: FieldTypeOptions): void;

/*
 * Type declaration in global namespace for extensibility
 */
declare global {
    namespace Zeta {
        type ReactFieldType<P, S> = (props: P) => S;
        type ReactFieldValueType<T> = FieldValueType<T>;

        /**
         * @deprecated Use {@link ReactFieldTypeMap} instead.
         */
        interface ReactFieldTypes<T = any> {
            text: ReactFieldType<TextFieldProps, TextFieldState<FieldValueType<T>>>;
            toggle: ReactFieldType<ToggleFieldProps, ToggleFieldState>;
            choice: ReactFieldType<ChoiceFieldProps, ChoiceFieldState<T extends ChoiceFieldProps<infer V> ? V : ChoiceItem>>;
        }

        /**
         * Provides type hint to {@link useFormField} when the return type cannot be correctly inferred from the {@link FieldType.postHook} method.
         */
        interface ReactFieldTypeMap<Props = any> {
            θ1: ReactFieldType<typeof TextField, TextFieldState<FieldValueType<Props>>>;
            θ2: ReactFieldType<typeof ToggleField, ToggleFieldState>;
            θ3: ReactFieldType<typeof ChoiceField, ChoiceFieldState<Props extends ChoiceFieldProps<infer V> ? V : ChoiceItem>>;
        }
    }
}

export const TextField: FieldTypeConstructor<TextFieldProps, TextFieldState<string>>
export const ToggleField: FieldTypeConstructor<ToggleFieldProps, ToggleFieldState>;
export const ChoiceField: FieldTypeConstructor<ChoiceFieldProps, ChoiceFieldState>;

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
