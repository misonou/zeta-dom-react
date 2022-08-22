export type DisposeCallback = Zeta.UnregisterCallback & {
    /**
     * Pushes cleanup callbacks into the queue.
     * Callbacks will be called when the component is unmounted or
     * manually by calling the {@link DisposeCallback}.
     * Once the callbacks are executed, they are removed from the queue.
     */
    push: (...args: Zeta.UnregisterCallback[]) => void;
};

export interface ErrorSource {
    onError(handler: (error: any) => any): Zeta.UnregisterCallback;
}

export interface AsyncContentEventMap<T> {
    load: AsyncContentLoadEvent<T>;
    error: Zeta.ZetaErrorEvent;
}

export interface AsyncContentLoadEvent<T> extends Zeta.ZetaEventBase {
    data: T;
}

export interface AsyncContentState<T = any> extends Zeta.ZetaEventDispatcher<AsyncContentEventMap<T>, AsyncContentState<T>> {
    /**
     * Gets the value returned by the init callback.
     * The value is identical to the first element of the returned array from {@link useAsync},
     * and is `undefined` in initial state or when {@link AsyncContentState.error} is truthy.
     */
    readonly value: T | undefined;
    /**
     * Gets whether the promise returned from init callback is still pending.
     */
    readonly loading: boolean;
    /**
     * Gets the error if the init callback has thrown error or returned a rejected promise.
     */
    readonly error: any;
    /**
     * When suppied to the `ref` property of a React element, an `error` event is emitted from the rendered element,
     * if the error is not handled by handlers registered by {@link AsyncContentState.onError}.
     */
    readonly elementRef: React.RefCallback<HTMLElement>;
    /**
     * Sets loading state to `true` and loads the data again.
     */
    refresh(): Promise<T>;
    /**
     * Registers a handler to handle errors thrown from the data init callback.
     */
    onError(handler: (error: any, this: this) => any): Zeta.UnregisterCallback;
}

/**
 * Creates a memoized callback that invokes the supplied callback when called.
 * This reduces unnecessary useEffect cycles but at the same time
 * the correct callback supplied in the last component cycle,
 * which associates to the latest component state, can be called.
 * @param callback A callback.
 * @returns A memoized callback that is unchanged throughout rendering cycles.
 */
export function useMemoizedFunction<T extends Zeta.AnyFunction>(callback: T | undefined): T;

/**
 * Listens and gets the value of a property of an object.
 * The component is refreshed when the property has been updated.
 * @param obj An object which its property will be listened.
 * @param key Property name.
 */
export function useObservableProperty<T extends object, P extends keyof T>(obj: T, key: P): T[P];

/**
 * Gets asynchronous data and refreshes the components once data is ready or error has occurred.
 * The value in the first element of the returned array is initially `undefined`.
 * @param init A callback that returns data asynchronously.
 * @param autoload Whether to autoload the data once the component is mounted, defaults to `true`.
 * @returns An array containing the data when available, and a state object, see {@link AsyncContentState}.
 */
export function useAsync<T>(init: () => T | Promise<T>, autoload: boolean = true): [value: T | undefined, state: AsyncContentState<T>];

/**
 * Gets asynchronous data and refreshes the components once data is ready or error has occurred.
 * The value in the first element of the returned array is initially `undefined`.
 * @param init A callback that returns data asynchronously.
 * @param deps Triggers reload if the values in the list change.
 * @returns An array containing the data when available, and a state object, see {@link AsyncContentState}.
 */
export function useAsync<T>(init: () => T | Promise<T>, deps: React.DependencyList): [value: T | undefined, state: AsyncContentState<T>];

/**
 * Creates a React ref callback, that will invoke the supplied callback only once for each a new DOM element created.
 *
 * Since the callback is only called once for a DOM element in the component's lifetime,
 * any variables referenced in the callback must be unchanged throughout the lifetime, such as created from {@link React.useRef}.
 * For functions, it can be wrapped by {@link useMemoizedFunction}.
 *
 * @param init A callback that is invoked for new DOM elements or objects.
 * @param args Extra arguments to be passed to the init callback.
 */
export function useRefInitCallback<T extends object, F extends (instance: T) => void>(init: F, ...args: F extends (instance: T, ...args: infer P) => void ? P : never): React.RefCallback<T>;

/**
 * Creates a cleanup callback collector.
 * Callbacks pushed into the queue will be called when the component is unmounted.
 *
 * @example
 * ```tsx
 * const dispose = useDispose();
 * return <button onClick={() => dispose.push(() => console.log('Component unmounted'))}></button>
 * ```
 *
 * Callbacks can also be called manually by calling the `DisposeCallback`.
 * Executed callbacks are removed from the queue so that they will not be called twice.
 *
 * @example
 * ```tsx
 * const dispose = useDispose();
 * return <button onClick={() => dispose()}></button>;
 * ```
 */
export function useDispose(): DisposeCallback;

/**
 * Returns a ref callback which when given to a React element, error caught from specified sources will be emitted through `error` event and be bubbled up through DOM.
 * @param args A list of error sources. Error source must implement an `onError` method.
 */
export function useErrorHandlerRef<T extends Element = HTMLElement>(...args: ErrorSource[]): React.RefCallback<T>;
