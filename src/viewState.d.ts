export interface ViewState {
    /**
     * Gets the value persisted by {@link ViewState.set} previously.
     */
    get(): any;
    /**
     * Persists the value in view state.
     * @param data Any serializable data.
     */
    set(data: any): void;
}

export interface ViewStateProvider {
    /**
     * Returns an object that can persist and restore view state uniquely identified by the key.
     *
     * View state consumers will request the {@link ViewState} object every time its host component re-renders.
     * The same consumer, by logical mean, should be able to persist and restore the same view state while user traverses back and forth in history,
     * unmounting and re-creating the host component.
     *
     * @param uniqueId A random string which represents a unique consumer.
     * @param key Key of the state.
     */
    getState(uniqueId: string, key: string): ViewState;
}

export const ViewStateProvider: React.Provider<ViewStateProvider>;

/**
 * Gets an interface to persist and restore view state across history states in a single-page application.
 * @param key A unique key. If provider provides scoping, the same key may be used simultaneously across components.
 * @returns An object that provide the interface. If there is no provider or provider did not return, an object with no-op `get` and `set` is returned.
 */
export function useViewState(key: string): ViewState;
