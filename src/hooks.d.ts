import { θDependencyConsumer, θDependencyProvider } from "./types";

type EventsOf<T> = T extends Zeta.ZetaEventDispatcher<infer M, unknown> ? keyof M : string;
type EventType<T, E extends string> =
    T extends Zeta.ZetaEventDispatcher<infer M, infer T> ? Zeta.ZetaEventType<E, M, T> :
    T extends EventTarget ? Zeta.DOMEventType<T, E> : any;
type EventHandlerThis<T> = T extends Zeta.ZetaEventDispatcher<any, infer T> ? T : T;
type EventStateSelector<T, E extends string, V> = (this: EventHandlerThis<T>, e: EventType<T, E>, previousState: V) => V;

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

export interface ErrorContext {
    /**
     * Gets the type of user interaction that triggers the event.
     */
    readonly source: Zeta.ZetaEventSourceName;
    /**
     * Gets the keystroke that triggers the event, or `null` if the event is not triggered by keyboard.
     */
    readonly sourceKeyName: Zeta.KeyNameSingleCharacter | Zeta.KeyNameSpecial | null;
    /**
     * Gets the element that has error dispatched on.
     */
    readonly sourceElement: Element | null;
}

export interface ErrorHandler {
    /**
     * Emits error to handlers registered by {@link ErrorHandler.catch}.
     * If the error is not marked as handled, the error will propagate up the DOM tree.
     * @param error Error to handle.
     * @returns A promise that resolves to possible output returned from handlers.
     */
    emit(error: Error): Promise<any>;

    /**
     * Catches errors from promises registered to descandant elements by {@link dom.lock}.
     * Unfiltered handlers are called after filtered handlers, registered by other overloads, regardless of order.
     *
     * If handler returns a value other than `undefined`, including promises resolving to whatever values,
     * the error is marked as handled and no further handlers are called nor will be propagated up the DOM tree.
     * @param handler Callback to be invoked.
     */
    catch(handler: (e: any, context: ErrorContext) => any): Zeta.UnregisterCallback;

    /**
     * Catches errors with property `code` matching the specified code, from promises registered to descandant elements by {@link dom.lock}.
     *
     * If handler returns a value other than `undefined`, including promises resolving to whatever values,
     * the error is marked as handled and no further handlers are called nor will be propagated up the DOM tree.
     * @param code Value to be matched against.
     * @param handler Callback to be invoked when the criteria matches.
     */
    catch(code: string, handler: (e: Error, context: ErrorContext) => any): Zeta.UnregisterCallback;

    /**
     * Catches errors that are instances of the specified error type, from promises registered to descandant elements by {@link dom.lock}.
     *
     * If handler returns a value other than `undefined`, including promises resolving to whatever values,
     * the error is marked as handled and no further handlers are called nor will be propagated up the DOM tree.
     * @param type Constructor of a specific error type.
     * @param handler Callback to be invoked when the criteria matches.
     */
    catch<T extends Zeta.AnyConstructorOrClass>(type: T, handler: (e: InstanceType<T>, context: ErrorContext) => any): Zeta.UnregisterCallback;

    /**
     * Catches errors with property `code` matching any of the specified codes, or are instances of one of the specified error types, from promises registered to descandant elements by {@link dom.lock}.
     *
     * If handler returns a value other than `undefined`, including promises resolving to whatever values,
     * the error is marked as handled and no further handlers are called nor will be propagated up the DOM tree.
     * @param type A list of constructor of specific error types.
     * @param handler Callback to be invoked when the criteria matches.
     */
    catch(type: readonly (string | Function)[], handler: (e: Error, context: ErrorContext) => any): Zeta.UnregisterCallback;
}

export interface ErrorHandlerWithRef<T = Element> extends ErrorHandler {
    readonly ref: React.RefCallback<T>;
}

export interface AsyncScope {
    /**
     * A provider component that when rendered, {@link useAsync} in descendant components
     * will notify loading state and emit unhandled error to the associated element by default.
     */
    Provider: React.FC<React.PropsWithChildren<{}>>;
    /**
     * A handler that catches errors emitted from descendant elements.
     */
    errorHandler: ErrorHandler;
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
    onError(handler: (this: this, error: any) => any): Zeta.UnregisterCallback;
    /**
     * Aborts the async operation.
     * The loading state will be set back to `false`, whereas the {@link AsyncContentState.value} is unchanged.
     */
    abort(reason?: any): void;
    /**
     * Resets value, as well as loading and error state to initial state.
     */
    reset(): void;
}

export interface Dependency<T> {
    /**
     * Gets the consumer object to be passed to {@link useDependency} for receiving data from producer.
     */
    readonly Consumer: DependencyConsumer<T>;
    /**
     * Gets the provider object to be passed to {@link useDependency} for sending data to consumer.
     */
    readonly Provider: DependencyProvider<T>;
}

export interface DependencyConsumer<T> extends θDependencyConsumer<T> {
}

export interface DependencyProvider<T> extends θDependencyProvider<T> {
}

export interface DependencyProviderContext<T> {
    /**
     * Gets the data passed in.
     */
    readonly value: T;
}

/**
 * Creates utilities that handles asynchronous operations in descendant components and associated DOM elements.
 * @param element A DOM element.
 */
export function createAsyncScope(element: Element): AsyncScope;

/**
 * Similar to but unlike {@link React.useRef}, the given value is automatically set on each render.
 * @param value Value to be set on `current` property of the ref object.
 */
export function useAutoSetRef<T>(value: T): React.MutableRefObject<T>;

/**
 * Similar to but unlike {@link React.useState}, it guarantees that callback supplied to updating function is called synchronously,
 * and it will not cause component to re-render when state did not change.
 * @param initialState Initial state, or a function that returns the initial state.
 */
export function useEagerState<T>(initialState: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>];

/**
 * Similar to but unlike {@link React.useState}, it guarantees that callback supplied to updating function is called synchronously,
 * and it will not cause component to re-render when state did not change.
 */
export function useEagerState<T = undefined>(): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>];

/**
 * Similar to but unlike {@link React.useReducer}, it guarantees that reducer is called synchronously,
 * and it will not cause component to re-render when state did not change.
 * @param reducer A callback computes the new state.
 * @param initialState Initial state, or a function that returns the initial state.
 */
export function useEagerReducer<T>(reducer: React.ReducerWithoutAction<T>, initialState: T | (() => T)): [T, React.DispatchWithoutAction];

/**
 * Similar to but unlike {@link React.useReducer}, it guarantees that reducer is called synchronously,
 * and it will not cause component to re-render when state did not change.
 * @param reducer A callback that receives value passed to updating function and computes the new state.
 * @param initialState Initial state, or a function that returns the initial state.
 */
export function useEagerReducer<T, V = T>(reducer: React.Reducer<T, V>, initialState: T | (() => T)): [T, React.Dispatch<V>];

/**
 * Creates a callback that forcibly triggers re-render of a component.
 */
export function useUpdateTrigger(): () => void;

/**
 * Creates a callback that forcibly triggers re-render of a component
 * when it is called with a value different from that passed to the hook in last render.
 * @param value Value which returned callback will compare to.
 * @param comparer An optional callback that compares if two values are equal. Component will be updated only when it returns `false`. Default is `Object.is`.
 */
export function useValueTrigger<T>(value: T, comparer?: (currentValue: T, value: T) => boolean): React.Dispatch<T>;

/**
 * Triggers re-render when specific event is emitted.
 * @param obj An event target.
 * @param event A whitespace separated list of event types.
 */
export function useEventTrigger<T extends EventTarget, E extends Zeta.HintedString<Zeta.DOMEventsOf<T>>>(obj: T, event: E): void;

/**
 * Triggers re-render when derived state from specific event is changed.
 * @param obj An event target.
 * @param event A whitespace separated list of event types.
 * @param selector A callback that derives state.
 * @returns Derived state from the callback, or `undefined` if the event has never been fired.
 */
export function useEventTrigger<T extends EventTarget, E extends Zeta.HintedString<Zeta.DOMEventsOf<T>>, V>(obj: T, event: E, selector: EventStateSelector<T, Zeta.WhitespaceDelimited<E>, V | undefined>): V | undefined;

/**
 * Triggers re-render when derived state from specific event is changed.
 * @param obj An event target.
 * @param event A whitespace separated list of event types.
 * @param selector A callback that derives state.
 * @param initialState Initial state, or a function that returns the initial state.
 * @returns Derived state from the callback, or the initial state if the event has never been fired.
 */
export function useEventTrigger<T extends EventTarget, E extends Zeta.HintedString<Zeta.DOMEventsOf<T>>, V>(obj: T, event: E, selector: EventStateSelector<T, Zeta.WhitespaceDelimited<E>, V>, initialState: V | (() => V)): V;

/**
 * Triggers re-render when specific event is emitted.
 * @param obj An event target.
 * @param event A whitespace separated list of event types.
 */
export function useEventTrigger<T extends Zeta.ZetaEventDispatcher<any, any>, E extends Zeta.HintedString<EventsOf<T>>>(obj: T, event: E): void;

/**
 * Triggers re-render when derived state from specific event is changed.
 * @param obj An event target.
 * @param event A whitespace separated list of event types.
 * @param selector A callback that derives state.
 * @returns Derived state from the callback, or `undefined` if the event has never been fired.
 */
export function useEventTrigger<T extends Zeta.ZetaEventDispatcher<any, any>, E extends Zeta.HintedString<EventsOf<T>>, V>(obj: T, event: E, selector: EventStateSelector<T, Zeta.WhitespaceDelimited<E>, V | undefined>): V | undefined;

/**
 * Triggers re-render when derived state from specific event is changed.
 * @param obj An event target.
 * @param event A whitespace separated list of event types.
 * @param selector A callback that derives state.
 * @param initialState Initial state, or a function that returns the initial state.
 * @returns Derived state from the callback, or the initial state if the event has never been fired.
 */
export function useEventTrigger<T extends Zeta.ZetaEventDispatcher<any, any>, E extends Zeta.HintedString<EventsOf<T>>, V>(obj: T, event: E, selector: EventStateSelector<T, Zeta.WhitespaceDelimited<E>, V>, initialState: V | (() => V)): V;

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
 * @param comparer An optional callback that compares if two values are equal. Component will be updated only when it returns `false`. Default is `Object.is`.
 */
export function useObservableProperty<T extends object, P extends keyof T>(obj: T, key: P, comparer?: (currentValue: T[P], value: T[P]) => boolean): T[P];

/**
 * Gets asynchronous data and refreshes the components once data is ready or error has occurred.
 * The value in the first element of the returned array is initially `undefined`.
 * @param init A callback that returns data asynchronously.
 * @param autoload Whether to autoload the data once the component is mounted, defaults to `true`.
 * @param debounce Debounce interval in milliseconds.
 * @returns An array containing the data when available, and a state object, see {@link AsyncContentState}.
 */
export function useAsync<T>(init: (signal: AbortSignal) => T | Promise<T>, autoload?: boolean, debounce?: number): [value: T | undefined, state: AsyncContentState<T>];

/**
 * Gets asynchronous data and refreshes the components once data is ready or error has occurred.
 * The value in the first element of the returned array is initially `undefined`.
 * @param init A callback that returns data asynchronously.
 * @param deps Triggers reload if the values in the list change.
 * @param debounce Debounce interval in milliseconds.
 * @returns An array containing the data when available, and a state object, see {@link AsyncContentState}.
 */
export function useAsync<T>(init: (signal: AbortSignal) => T | Promise<T>, deps: React.DependencyList, debounce?: number): [value: T | undefined, state: AsyncContentState<T>];

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
export function useRefInitCallback<T = any, U extends any[] = any[]>(init: (instance: T, ...args: U) => void, ...args: U): React.RefCallback<T>;

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
 * Returns whether the singleton instance returned by {@link useSingleton} has been disposed or not.
 * @deprecated
 */
export function isSingletonDisposed(target: any): boolean;

/**
 * Makes sure side effects from object creation are properly cleaned up.
 *
 * In React development strict mode, additional diagnotics are done by executing component and hook repeatedly,
 * meaning that 1) `useState` or `useMemo` will create two copies of objects while one being discarded in each run,
 * and 2) cleanup function returned to `useEffect` will be invoked once before actual use.
 *
 * This can cause issues when 1) there are side effects from object creation, and 2) cleaning up using `useEffect`.
 * This hook gurantees that, cleanup functions are always executed after object is replaced or parent component is unmounted,
 * and any discarded objects are also disposed.
 *
 * @param factory A callback that return an object.
 * @param deps Construct a new object when any values in the list changes.
 * @param onDispose Callback to be invoked when target object is being disposed.
 * The callback will receive the target object and a flag indicating whether it is actually consumed by the component.
 * If unspecified, the `dispose` method on the target object will be invoked if there exists such method.
 *
 * @example
 * ```tsx
 * // factory will be called twice in development strict mode
 * // where the first singleton instance returned is discarded after second execution
 * const singleton = useState(factory)[0];
 * useEffect(() => {
 *     return () => {
 *         // the `dispose` method will actually be called
 *         // when component is being first mounted in development strict mode,
 *         // so the internal state will be invalid when component is rerendered.
 *         singleton.dispose();
 *     };
 * }, [singleton]);
 *
 * // instead this will be safe
 * const singleton = useSingleton(factory, []);
 * ```
 */
export function useSingleton<T>(factory: () => T, deps: React.DependencyList, onDispose?: (this: T, target: T, flag: boolean) => void): T;

/**
 * Makes sure side effects from object creation are properly cleaned up.
 * @param factory An object, or a callback that return an object.
 * @param onDispose Callback to be invoked when target object is being disposed.
 * The callback will receive the target object and a flag indicating whether it is actually consumed by the component.
 * If unspecified, the `dispose` method on the target object will be invoked if there exists such method.
 * @deprecated Use overload with factory callback and dependency list.
 */
export function useSingleton<T>(factory: T | (() => T), onDispose?: (this: T, target: T, flag: boolean) => void): T;

/**
 * Creates an {@link ErrorHandler} object that allows capturing errors from descendant elements
 * or emitting errors to parent elements of a specified container element.
 * @param element A DOM element.
 */
export function createErrorHandler(element: Element): ErrorHandler;

/**
 * Returns a ref callback which when given to a React element, error caught from specified sources will be emitted through `error` event and be bubbled up through DOM.
 * @param args A list of error sources. Error source must implement an `onError` method.
 * @deprecated Use {@link useErrorHandler} for richer functionalities.
 */
export function useErrorHandlerRef<T extends Element = HTMLElement>(...args: ErrorSource[]): React.RefCallback<T>;

/**
 * Returns an error handler which provides an event-based mechanism to handle errors from the given error sources,
 * as well as errors from child elements, in contrast to error boundaries.
 *
 * When {@link ErrorHandlerWithRef.ref} is assigned to React element,
 * errors from child elements can be handled by callbacks added to the ErrorHandler instance.
 * On the other hand, unhandled errors raised by error sources will be re-emitted to parent elements.
 *
 * @param args A list of error sources. Error source must implement an `onError` method.
 */
export function useErrorHandler<T extends Element = HTMLElement>(...args: ErrorSource[]): ErrorHandlerWithRef<T>;

/**
 * Registers a cleanup callback to be invoked when the component is being unmounted, or the document is being unloaded.
 * @param callback Callback to be invoked, receiving a boolean indicating if the page is still cached. The flag is always `false` if the component is being unmounted.
 */
export function useUnloadEffect(callback: (persisted: boolean) => void): void;

/**
 * Creates a dependency that components can provide to and read data from.
 */
export function createDependency<T>(): Dependency<T | undefined>;

/**
 * Creates a dependency that components can provide to and read data from.
 * @param defaultValue Default value to return when there is no component providing data.
 */
export function createDependency<T>(defaultValue: T): Dependency<T>;

/**
 * Gets data sent from producer.
 * @param dependency A dependency consumer object returned from {@link Dependency.Consumer}, or dependency object returned from {@link createDependency}.
 */
export function useDependency<T>(dependency: DependencyConsumer<T> | Dependency<T>): T;

/**
 * Provides data to consumer.
 * @param dependency A dependency provider object returned from {@link Dependency.Provider}.
 * @param value Data to be sent to consumer.
 * @param deps If present, new data is only sent to consumer if the values in the list change.
 */
export function useDependency<T>(dependency: DependencyProvider<T>, value: T, deps?: React.DependencyList): DependencyProviderContext<T>;

/**
 * Provides data to consumer.
 * @param dependency A dependency provider object returned from {@link Dependency.Provider}.
 * @param factory A callback that computes data to be sent to consumer.
 * @param deps If present, new data is only sent to consumer if the values in the list change.
 */
export function useDependency<T>(dependency: DependencyProvider<T>, factory: () => T, deps?: React.DependencyList): DependencyProviderContext<T>;
