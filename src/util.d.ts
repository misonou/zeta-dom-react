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

/**
 * Registers event handlers to the rendered DOM element.
 * The callback in the latest component update cycle will be invoked.
 * @param event Name of the event.
 * @param handler A callback function to be fired when the specified event is triggered.
 * @returns A ref callback to be specified to the `ref` prop of a React element.
 */
export function domEventRef<E extends Zeta.HintedString<Zeta.ZetaDOMEventName>, T extends Element>(event: E, handler: Zeta.ZetaDOMEventHandler<E, T>): React.RefCallback<T>;

/**
 * Registers event handlers to the rendered DOM element.
 * The callback in the latest component update cycle will be invoked.
 * @param handlers An object which each entry represent the handler to be registered on the event.
 * @returns A ref callback to be specified to the `ref` prop of a React element.
 */
export function domEventRef<T extends Element>(handlers: Zeta.ZetaDOMEventHandlers<T>): React.RefCallback<T>;

export function classNames(...args: ClassName[]): string;

/**
 * Returns an object with either `children` or `dangerouslySetInnerHTML` property depending on the input.
 * @param text A string or an object with `__html` property as content of a React element.
 */
export function innerTextOrHTML(text: string | { __html: string }): { children?: string; dangerouslySetInnerHTML?: { __html: string } };

/**
 * Returns a callback that set only part of a composite state.
 * @param setState A state updating callback returned from {@link React.useState}.
 */
export function partial<T extends Zeta.Dictionary<any>>(setState: React.Dispatch<React.SetStateAction<T>>): SetPartialCallback<T>;

/**
 * Returns a callback that set the specific property of a composite state.
 * @param setState A state updating callback returned from {@link React.useState}.
 * @param key Property to update.
 */
export function partial<T extends Zeta.Dictionary<any>, P extends keyof T>(setState: React.Dispatch<React.SetStateAction<T>>, key: P): React.Dispatch<React.SetStateAction<T[P]>>;

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

/**
 * Creates a lazy exotic component wrapped in a `Suspense` component.
 * @param factory Callback to import the component.
 * @param fallback Fallback content before the component is ready.
 */
export function withSuspense<T = any>(factory: () => Promise<{ default: React.ComponentType<T>; }>, fallback?: React.ComponentType | JSX.Element): React.FC<T>;
