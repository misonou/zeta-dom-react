declare const θexport: null;
export default θexport;

declare const SYM_DependencyConsumer: unique symbol;
declare const SYM_DependencyProvider: unique symbol;

export interface θDependencyConsumer<T> {
    readonly [SYM_DependencyConsumer]: T;
}

export interface θDependencyProvider<T> {
    readonly [SYM_DependencyProvider]: (value: T) => void;
}
