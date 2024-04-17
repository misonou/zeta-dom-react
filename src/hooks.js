import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dom, { reportError } from "zeta-dom/dom";
import { notifyAsync } from "zeta-dom/domLock";
import { bind } from "zeta-dom/domUtil";
import { ZetaEventContainer } from "zeta-dom/events";
import { always, any, catchAsync, clearImmediateOnce, combineFn, deferrable, delay, each, extend, fill, is, isArray, isErrorWithCode, isFunction, makeArray, makeAsync, map, mapRemove, noop, pipe, resolve, setAdd, setImmediateOnce, watch } from "zeta-dom/util";
import { IS_DEV } from "./env.js";

const container = new ZetaEventContainer();
const singletons = new Map();
const disposedSingletons = new WeakSet();
const unloadCallbacks = new Set();
const AbortController = window.AbortController;
const useSingletonEffect = IS_DEV ? useSingletonEffectImplDev : useSingletonEffectImpl;

bind(window, 'pagehide', function (e) {
    combineFn(makeArray(unloadCallbacks))(e.persisted);
});

function muteRejection(promise) {
    catchAsync(promise);
    return promise;
}

function clearUnusedSingletons() {
    each(singletons, function (i, v) {
        if (!v.d) {
            disposedSingletons.add(i);
            mapRemove(singletons, i)(v.d === false);
        }
    });
}

function useSingletonEffectImpl(target, dispose) {
    useEffect(function () {
        return function () {
            disposedSingletons.add(target);
            dispose(true);
        };
    }, [target]);
}

function useSingletonEffectImplDev(target, dispose) {
    if (!singletons.has(target)) {
        singletons.set(target, dispose);
        clearImmediateOnce(clearUnusedSingletons);
    }
    useEffect(function () {
        var cb = function (flag) {
            singletons.get(target).d = !!flag;
            setImmediateOnce(clearUnusedSingletons);
        };
        cb(true);
        return cb;
    }, [target]);
}

export function useAutoSetRef(value) {
    const ref = useRef();
    ref.current = value;
    return ref;
}

export function useUpdateTrigger() {
    return useValueTrigger({});
}

export function useValueTrigger(value) {
    const ref = useAutoSetRef(value);
    const state = useState(function () {
        var fn = function (value) {
            if (value !== ref.current) {
                state[1]({ fn });
            }
        };
        return { fn };
    });
    return state[0].fn;
}

export function useEventTrigger(obj, event, selector, initialState) {
    const state = useState(initialState);
    useEffect(function () {
        var callback = function (e) {
            state[1](selector ? selector.bind(this, e) : {});
        };
        return obj.addEventListener ? bind(obj, event, callback) : obj.on(fill(event, callback));
    }, [obj, event]);
    return selector ? state[0] : undefined;
}

export function useMemoizedFunction(callback) {
    const ref = useAutoSetRef(callback);
    return useCallback(function () {
        return (isFunction(ref.current) || noop).apply(this, arguments);
    }, []);
}

export function useObservableProperty(obj, key) {
    const value = obj[key];
    const notifyChange = useValueTrigger(value);
    useEffect(function () {
        notifyChange(obj[key]);
        return watch(obj, key, notifyChange);
    }, [obj, key]);
    return value;
}

export function useAsync(init, deps, debounce) {
    const state = useSingleton(function () {
        var element;
        var currentController;
        var nextResult;
        return {
            loading: false,
            value: undefined,
            error: undefined,
            elementRef: function (current) {
                element = current;
            },
            on: function (event, handler) {
                return container.add(state, event, handler);
            },
            onError: function (handler) {
                return state.on('error', function (e) {
                    return handler.call(state, e.error);
                });
            },
            refresh: function (force) {
                if (debounce && !force) {
                    nextResult = nextResult || deferrable();
                    nextResult.waitFor(delay(debounce));
                    return nextResult.d || (nextResult.d = muteRejection(nextResult.then(function () {
                        nextResult = null;
                        return state.refresh(true);
                    })));
                }
                var controller = AbortController ? new AbortController() : { abort: noop };
                if (currentController) {
                    currentController.abort();
                }
                extend(state, { loading: true, error: undefined });
                var result = makeAsync(init)(controller.signal);
                var promise = always(result, function (resolved, value) {
                    if (currentController === controller) {
                        if (resolved) {
                            extend(state, { loading: false, value: value });
                            container.emit('load', state, { data: value });
                        } else {
                            extend(state, { loading: false, value: undefined, error: value });
                            if (!container.emit('error', state, { error: value })) {
                                throw value;
                            }
                        }
                    }
                });
                currentController = controller;
                notifyAsync(element || dom.root, promise);
                return result;
            },
            abort: function (reason) {
                if (currentController) {
                    currentController.abort(reason);
                    currentController = null;
                }
                state.loading = false;
            }
        };
    }, function () {
        state.abort();
    });
    deps = [deps !== false].concat(isArray(deps) || []);
    init = useMemoizedFunction(init);
    useEffect(function () {
        if (deps[0]) {
            // keep call to refresh in useEffect to avoid double invocation
            // in strict mode in development environment
            setImmediateOnce(state.refresh);
        }
    }, deps);
    useMemo(function () {
        if (deps[0] && !debounce) {
            state.loading = true;
        }
    }, deps);
    useObservableProperty(state, 'loading');
    return [state.value, state];
}

export function useRefInitCallback(init) {
    const args = makeArray(arguments);
    const set = useState(new WeakSet())[0];
    return function (v) {
        if (v && setAdd(set, v)) {
            args[0] = v;
            init.apply(null, args);
        }
    };
}

export function useDispose() {
    const dispose = useState(function () {
        const callbacks = [
            function () {
                callbacks.splice(0, callbacks.length - 1);
            }
        ];
        return extend(combineFn(callbacks), { push: callbacks.splice.bind(callbacks, -1, 0) });
    })[0];
    useEffect(function () {
        return dispose;
    }, [dispose]);
    return dispose;
}

export function isSingletonDisposed(target) {
    return disposedSingletons.has(target);
}

export function useSingleton(factory, onDispose) {
    const target = isFunction(factory) ? useMemo(factory, []) : useMemo(pipe.bind(0, factory), [factory]);
    useSingletonEffect(target, function () {
        (onDispose || target.dispose || noop).call(target);
    });
    return target;
}

export function useErrorHandlerRef() {
    return useErrorHandler.apply(this, arguments).ref;
}

export function useErrorHandler() {
    const reemitting = useRef(false);
    const ref = useRef(null);
    const args = makeArray(arguments);
    const handler = useState(function () {
        return {
            ref: function (element) {
                ref.current = element;
                init(element);
            },
            emit: function (error) {
                return catchError(error) || reemitError(error) || resolve();
            },
            catch: function (filter, callback) {
                var isErrorOf;
                if (!callback) {
                    callback = filter;
                } else if (!isArray(filter)) {
                    isErrorOf = isFunction(filter) ? is : isErrorWithCode;
                } else {
                    isErrorOf = function (error, filter) {
                        return any(filter, function (filter) {
                            return (isFunction(filter) ? is : isErrorWithCode)(error, filter);
                        });
                    };
                }
                return container.add(handler, isErrorOf ? 'error' : 'default', function (e) {
                    if ((isErrorOf || pipe)(e.error, filter)) {
                        return callback(e.error);
                    }
                });
            }
        };
    })[0];
    const reemitError = useCallback(function (error) {
        try {
            reemitting.current = true;
            return reportError(error, ref.current);
        } finally {
            reemitting.current = false;
        }
    }, []);
    const catchError = useCallback(function (error) {
        return container.emit('error', handler, { error }) || container.emit('default', handler, { error });
    }, []);
    const init = useRefInitCallback(function (element) {
        dom.on(element, 'error', function (e) {
            if (!reemitting.current) {
                return catchError(e.error);
            }
        });
    });
    useEffect(function () {
        return combineFn(map(args, function (v) {
            return v.onError(handler.emit);
        }));
    }, args);
    return handler;
}

export function useUnloadEffect(callback) {
    callback = useMemoizedFunction(callback);
    unloadCallbacks.add(callback);
    useSingletonEffect(callback, function (used) {
        unloadCallbacks.delete(callback);
        return used && callback(false);
    });
}
