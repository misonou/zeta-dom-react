export const FormContextProvider: React.Provider<FormContext>;
export const Form: <T>(props: FormProps<T>) => JSX.Element;

export type ValidateResult = null | undefined | string | Stringifiable | ValidationError | ((props: FormFieldProps<any>) => string);
export type ValidateCallback<T = any> = (value: T, name: string, form: FormContext) => ValidateResult | Promise<ValidateResult>;
export type FormatErrorCallback = (err: ValidationError, name: string | null, props: FormFieldProps & Zeta.Dictionary, form: FormContext | null) => string | undefined;

type WithFallback<T, U> = [T] extends [never] ? U : T;
type FieldValueType<T> = T extends FormFieldProps<any, infer V> ? V extends any[] ? V : Partial<V> : any;
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

export class ValidationError {
    /**
     * Creates an object representing the invalid condition.
     * @param kind Unique name identifying the kind of validation.
     * @param message Default error message. The message can be overriden by `formatError` callback in field, form or global level.
     * @param args Arguments passed to the validator, usually an object containing dynamic constraints.
     */
    constructor(kind: string, message: string, args?: any);

    /**
     * Gets the kind of validation.
     */
    readonly kind: string;
    /**
     * Gets the default error message.
     */
    readonly message: string;
    /**
     * Gets the arguments passed to the validator, usually an object containing dynamic constraints.
     */
    readonly args: any;
}

interface FormObjectHelper {
    /**
     * Returns a unique key for the form data object.
     * The returned value can be used as the key for React nodes genereated from array items.
     * @param obj A data object.
     *
     * @example
     * ```jsx
     * <FormArray name="children">
     *   {arr => arr.map(v => (
     *     <FormObject key={FormObject.keyFor(v)} value={v}>{...}</FormObject>)
     *   )}
     * </FormArray>
     * ```
     */
    keyFor(obj: object): string | undefined;
}

export type FormObjectProps<V> = Pick<FormFieldProps, 'clearWhenUnmount' | 'disabled' | 'isEmpty' | 'required' | 'onChange' | 'onValidate' | 'validateOnChange'> & ({
    /**
     * Specifies the name of property of which the data object is accessible in parent data object.
     */
    name: string;
    children?: React.ReactNode | ((data: WithFallback<V, any>) => React.ReactNode);
} | {
    /**
     * Specifies the data item contained in parent data array.
     */
    value: V;
    children?: React.ReactNode | ((data: WithFallback<V, any>) => React.ReactNode);
});

/**
 * Represents a nested data object.
 */
export const FormObject: React.FC<FormObjectProps<any>> & FormObjectHelper;

/**
 * Represents a nested data array.
 *
 * @example
 * ```jsx
 * <FormArray name="children">
 *   {arr => arr.map(v => (
 *     <FormObject key={FormObject.keyFor(v)} value={v}>{...}</FormObject>)
 *   )}
 * </FormArray>
 * ```
 */
export const FormArray: React.FC<FormObjectProps<any[]>>;

export interface HiddenFieldProps extends FormFieldProps<any> {
    /**
     * Specifies field name.
     */
    name: string;
    /**
     * Specifies field value to be reflected on {@link FormContext.data},
     * or current data object if the component is under {@link FormObject} or {@link FormArray} element.
     */
    value: any;
}

/**
 * Sets value on data object without rendering DOM element.
 */
export const HiddenField: React.FC<HiddenFieldProps>;

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
     * Specifies default value when there initial value has not been passed or set.
     */
    readonly defaultValue?: FieldValueType<P>;
    /**
     * Specifies the name of prop that will control {@link FormFieldState.value} when specified.
     * Default is `value`.
     */
    readonly valueProperty?: string;
    /**
     * Overrides default behavior of empty field checking.
     * The field is invalid when it is required and the `isEmpty` callback return `true`.
     * @param value Current field value.
     */
    isEmpty?(value: FieldValueType<P>): boolean;
    /**
     * Normalizes value when being updated.
     * @param value Field value being set to.
     * @param props Props passed to {@link useFormField}.
     */
    normalizeValue?(value: any, props: P): FieldValueType<P>;
    /**
     * Applies additional logic and modification to field state.
     * @param state Untouched field state returned from hook.
     * @param props Props passed to {@link useFormField}.
     */
    postHook(state: FormFieldState<FieldValueType<P>>, props: P): S;
}

export interface FormFieldProps<T = any, V = T> {
    /**
     * Specifies field name.
     * When specified, and if there exists a form context, the field value
     * will be reflected on {@link FormContext.data}.
     */
    name?: string;
    /**
     * Specifies field label.
     */
    label?: string;
    /**
     * Specifies field value explicitly.
     * The supplied value will be reflected on {@link FormContext.data} if there is a parent form context
     * and field name is specified.
     */
    value?: T;
    /**
     * Specifies whether the field is required.
     * A required field will be invalid if the field is empty.
     *
     * By default, the field is considered empty when the field value is `null`, `undefined`,
     * an empty string, or an empty array (for multi-valued field). The default behavior can be either
     * overriden by specifying callback through the {@link FormFieldProps.isEmpty} option;
     * or the field type being passed to {@link useFormField} has a custom {@link FieldType.isEmpty} callback.
     */
    required?: boolean;
    /**
     * Specifies whether the field is disabled.
     * A disabled field will not be validated against and is always valid.
     *
     * Component using the {@link useFormField} hook should handle the
     * visual clues and responsiveness to users on whether the field is disabled.
     */
    disabled?: boolean;
    /**
     * Specifies validation error explicitly.
     * Falsy values like `null`, `undefined` or empty string indicates the field is valid.
     */
    error?: null | undefined | string | Stringifiable;
    /**
     * Specifies whether the error message should be shown if the field is in invalid state.
     *
     * Component using the {@link useFormField} hook should handle this flag.
     */
    showErrorMessage?: boolean;
    /**
     * Specifies whether the value should be validated upon value changes.
     */
    validateOnChange?: boolean;
    /**
     * Specifies whether the associated value on form data object will be deleted
     * when the field component is unmounted.
     */
    clearWhenUnmount?: boolean;
    /**
     * Specifies a custom handler to determine if the field is empty.
     * @param value Current value of the field.
     */
    isEmpty?: (value: V) => boolean;
    /**
     * Specifies validation handler.
     */
    onValidate?: ValidateCallback<V>;
    /**
     * Specifies a callback to be invoked with the current value upon changes.
     * @param value Current value of the field.
     */
    onChange?: (value: V) => void;
    /**
     * Specifies a callback to generate custom error message for this particular field.
     *
     * The first argument will be the {@link ValidationError} instance returned from validation callback.
     * Note that the callback will not be invoked for values other than {@link ValidationError}.
     */
    formatError?: FormatErrorCallback;
}

export interface FormFieldState<T = any> {
    /**
     * Gets the parent form context if exists.
     */
    readonly form: FormContext | undefined;
    /**
     * Gets a unique key identifying the field.
     * If there is no parent form context, an empty string will be returned.
     */
    readonly key: string;
    /**
     * Gets the current data path to the associated value on the data object.
     * If there is no parent form context, an empty string will be returned.
     */
    readonly path: string;
    /**
     * Gets current field value.
     */
    readonly value: T;
    /**
     * Gets current validation error.
     * An empty string indicates the field is valid.
     * If an object was set, it is always coerced to the stringified result.
     */
    readonly error: string;
    /**
     * Sets field value.
     */
    readonly setValue: React.Dispatch<React.SetStateAction<T>>;
    /**
     * Sets validation error.
     * Falsy values like `null`, `undefined` or empty string indicates the field is valid.
     */
    readonly setError: React.Dispatch<React.SetStateAction<null | undefined | string | Stringifiable | ValidationError>>;
    /**
     * A callback to be passed to `ref` attribute to capture the rendered DOM element.
     * The element can be retrieved by {@link FormContext.element}.
     */
    readonly elementRef: React.RefCallback<HTMLElement>;
    /**
     * A callback to trigger validation of the field.
     * @returns A promise that resolves to `true if validation is passed and `false` otherwise.
     */
    readonly validate: () => Promise<boolean>;
}

export interface FormProps<T = any> extends React.ComponentPropsWithRef<'form'>, Pick<FormContextOptions, 'enterKeyHint' | 'preventLeave' | 'formatError'> {
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
    /**
     * Specifies a callback to generate custom error message for fields associated with this form context.
     *
     * The first argument will be the {@link ValidationError} instance returned from validation callback.
     * Note that the callback will not be invoked for values other than {@link ValidationError}.
     */
    formatError?: FormatErrorCallback;
}

export class FormContext<T extends object = Zeta.Dictionary<any>> {
    static readonly ERROR_FIELD = 1;
    static readonly EMPTY_FIELD = 2;

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
     * Specifies a callback to generate custom error message for fields associated with this form context.
     *
     * The first argument will be the {@link ValidationError} instance returned from validation callback.
     * Note that the callback will not be invoked for values other than {@link ValidationError}.
     */
    formatError?: FormatErrorCallback;

    /**
     * Specifies a callback to generate custom error message globally.
     *
     * The first argument will be the {@link ValidationError} instance returned from validation callback.
     * Note that the callback will not be invoked for values other than {@link ValidationError}.
     */
    static formatError?: FormatErrorCallback;

    /**
     * Gets the associated {@link FormContext} instance for the given element.
     * @param element A DOM element.
     */
    static get(element: Element): FormContext | null;

    /**
     * Gets the form element.
     * This method only works when {@link FormContext.ref} is passed to HTML elements.
     */
    element(): HTMLElement | undefined;

    /**
     * Gets the input element for the specified field.
     * This method only works when {@link FormFieldState.elementRef} is passed to HTML elements.
     * @param path A string containing dot-separated property names or an array containing property names.
     */
    element(path: string | string[]): HTMLElement | undefined;

    /**
     * Focus the form element.
     * This method only works when {@link FormContext.ref} is passed to HTML elements.
     * @returns Whether the given element is set focused.
     */
    focus(): boolean;

    /**
     * Focus the first field of the specified kind.
     * @param kind Bitwise combination of {@link FormContext.ERROR_FIELD} or {@link FormContext.EMPTY_FIELD}.
     * @returns Whether the given element is set focused.
     */
    focus(kind: number): boolean;

    /**
     * Focus the input element for the specified field.
     * This method only works when {@link FormFieldState.elementRef} is passed to HTML elements.
     * @param path A string containing dot-separated property names or an array containing property names.
     * @returns Whether the given element is set focused.
     */
    focus(path: string | string[]): boolean;

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
     * Clears all fields and validation errors.
     */
    clear(): void;

    /**
     * Resets all fields to initial values and clear all validation errors.
     */
    reset(): void;

    /**
     * Gets the value accessible by the specified path.
     * @param path A string containing dot-separated property names or an array containing property names.
     */
    getValue(path: string | string[]): any;

    /**
     * Sets the value to the specified path.
     * @param path A string containing dot-separated property names or an array containing property names.
     * @param value Any value.
     */
    setValue(path: string | string[], value: any): void;

    /**
     * Gets all validation errors.
     * @returns An object which each key is the name of an invalid field, and value is the corresponding error; or `null` if there is no error.
     */
    getErrors(): Zeta.Dictionary<string> | null;

    /**
     * Gets validation error for a specific field.
     * If there is no error, an empty string is returned.
     * @param path A string containing dot-separated property names or an array containing property names.
     */
    getError(path: string | string[]): string;

    /**
     * Updates validation error for a specific field.
     * The error will be cleared when validation is called, or when field value is modified when `validateOnChange` is `true`.
     * @param path A string containing dot-separated property names or an array containing property names.
     * @param error A non-empty string or stringifiable object indicating error; or a falsy value to clear previous error.
     */
    setError(path: string | string[], error: ValidateResult): void;

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
 * @param initialData Initial form data, or a callback that returns initial form data.
 * @param options If boolean is given, it sets the {@link FormContextOptions.validateOnChange} flag. Default is `true`.
 */
export function useFormContext<T extends object = Zeta.Dictionary<any>>(initialData: Partial<T> | (() => Partial<T>) = {}, options: boolean | FormContextOptions = true): FormContext<T>;

/**
 * Creates a memoized {@link FormContext} object.
 * @param persistKey A unique key for enabling the persisting of form data in view state.
 * @param initialData Initial form data, or a callback that returns initial form data.
 * @param options If boolean is given, it sets the {@link FormContextOptions.validateOnChange} flag. Default is `true`.
 */
export function useFormContext<T extends object = Zeta.Dictionary<any>>(persistKey: string, initialData: Partial<T> | (() => Partial<T>) = {}, options: boolean | FormContextOptions = true): FormContext<T>;

/**
 * @deprecated Use overload where first argument is the field type constructor instead.
 */
export function useFormField<K extends keyof Zeta.ReactFieldTypes, T extends Parameters<Zeta.ReactFieldTypes[K]>[0]>(type: K, props: T, defaultValue: FieldValueType<T>, prop?: keyof T): ReturnType<Zeta.ReactFieldTypes<T>[K]>;

export function useFormField<K extends FieldTypeConstructor<any, any>, T extends (K extends FieldTypeConstructor<infer T, any> ? T : any)>(type: K, props: T, defaultValue?: FieldValueType<T>): FieldStateType<K, T>;

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
            θ4: ReactFieldType<typeof MultiChoiceField, MultiChoiceFieldState<Props extends MultiChoiceFieldProps<infer V> ? V : ChoiceItem>>;
            θ5: ReactFieldType<typeof NumericField, NumericFieldState>;
            θ6: ReactFieldType<typeof DateField, DateFieldState>;
        }
    }
}

import ChoiceField, { ChoiceFieldState, ChoiceFieldProps, ChoiceItem } from "./fields/ChoiceField";
import DateField, { DateFieldState } from "./fields/DateField";
import MultiChoiceField, { MultiChoiceFieldProps, MultiChoiceFieldState } from "./fields/MultiChoiceField";
import NumericField, { NumericFieldState } from "./fields/NumericField";
import TextField, { TextFieldState } from "./fields/TextField";
import ToggleField, { ToggleFieldState } from "./fields/ToggleField";

export type * from "./fields/ChoiceField";
export type * from "./fields/DateField";
export type * from "./fields/MultiChoiceField";
export type * from "./fields/NumericField";
export type * from "./fields/TextField";
export type * from "./fields/ToggleField";

export {
    ChoiceField,
    DateField,
    MultiChoiceField,
    NumericField,
    TextField,
    ToggleField
}
