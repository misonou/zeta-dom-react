export type ValidateCallback<T = any> = (value: T, name: string) => Promise<string | Stringifiable | null | undefined> | string | Stringifiable | null | undefined;

export interface Stringifiable {
    toString(): string;
    [Symbol.toPrimitive](): string;
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

export const FormContextProvider: React.Provider<FormContext>;

interface FormEventMap {
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

export class FormContext<T extends object = Zeta.Dictionary<any>> {
    readonly isValid: boolean;
    readonly data: Partial<T>;

    constructor(initialData: Partial<T> = {}, validateOnChange: boolean = true);

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
     * Resets all fields and clear all validation errors.
     */
    reset(): void;

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
 */
export function useFormContext<T extends object = Zeta.Dictionary<any>>(initialData: Partial<T> = {}, validateOnChange: boolean = true): FormContext<T>;

export interface FormFieldState<T> {
    readonly value: T;
    readonly error: string;
    setValue: React.Dispatch<React.SetStateAction<T>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
    elementRef: React.RefCallback<HTMLElement>;
}

export function useFormField<T extends FormFieldProps<any, V>, K extends keyof T, V>(props: T, defaultValue: V, prop: K = 'value'): FormFieldState<V>;
