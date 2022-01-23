export type ValidateCallback<T = any> = (value: T, name: string) => Promise<string | null | undefined> | string | null | undefined;

export interface FormFieldProps<T = any, V = T> {
    name?: string;
    value?: T;
    disabled?: boolean;
    error?: string;
    showErrorMessage?: boolean;
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

export class FormContext {
    readonly isValid: boolean;
    readonly data: Record<string, any>;

    constructor(initialData: Record<string, any> = {}, validateOnChange: boolean = true);

    /**
     * Registers event handlers.
     * @param event Name of the event.
     * @param handler A callback function to be fired when the specified event is triggered.
     * @returns A function that will unregister the handlers when called.
     * @see {@link FormEventMap}
     */
    on<T extends keyof FormEventMap>(event: T, handler: Zeta.ZetaEventHandler<T, FormEventMap, FormContext>): Zeta.UnregisterCallback;

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
export function useFormContext(...args: ConstructorParameters<typeof FormContext>): FormContext;

export interface FormFieldState<T> {
    readonly value: T;
    readonly error: string;
    setValue: React.Dispatch<React.SetStateAction<T>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
}

export function useFormField<T extends FormFieldProps<any, V>, K extends keyof T, V>(props: T, defaultValue: V, prop: K = 'value'): FormFieldState<V>;
