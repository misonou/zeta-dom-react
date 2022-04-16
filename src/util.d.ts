export type PrimitiveClassName = undefined | string | Record<string, string | number | boolean | undefined>;
export type ClassName = PrimitiveClassName | ClassNameProvider;

export interface ClassNameProvider {
    getClassNames(): ClassName | ClassName[];
}

export interface SetPartialCallback<T> {
    /**
     * Updates specified properties in the composite state. Properties not specified are untouched.
     * @param values Properties to update.
     */
    (values: Partial<T>): void;
    /**
     * Updates a particular property in the composite state. Other properties are untouched.
     * @param key Property to update.
     * @param value New value to be set.
     */
    <P extends keyof T>(key: P, value: T[P]): void;
    /**
     * Updates a particular property in the composite state. Other properties are untouched.
     * @param key Property to update.
     * @param callback A callback that receives the previous value and returns new value to be set.
     */
    <P extends keyof T>(key: P, callback: (prevValue: T[P], prevState: T) => T[P]): void;
}

export function classNames(...args: ClassName[]): string;

/**
 * Returns a callback that set only part of a composite state.
 * @param setState A state updating callback returned from {@link React.useState}.
 */
export function partial<T extends Zeta.Dictionary<any>>(setState: React.Dispatch<React.SetStateAction<T>>): SetPartialCallback<T>;

/**
 * Combines multiple mutable ref objects or ref callbacks into a single ref callback.
 * @param ref List of refs.
 */
export function combineRef<T>(...ref: React.Ref<T>[]): React.RefCallback<T>;

/**
 * Converts a mutable ref object into ref callback. If input object is already a ref callback, the same callback is returned.
 * @param ref A ref.
 */
export function toRefCallback<T>(ref: React.Ref<T>): React.RefCallback<T>;
