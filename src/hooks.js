import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dom from "./include/zeta-dom/dom.js";
import { notifyAsync } from "./include/zeta-dom/domLock.js";
import { ZetaEventContainer } from "./include/zeta-dom/events.js";
import { always, any, combineFn, deferrable, delay, extend, is, isArray, isErrorWithCode, isFunction, makeArray, makeAsync, map, noop, pipe, resolve, setAdd, setImmediate, setImmediateOnce, watch } from "./include/zeta-dom/util.js";

const container = new ZetaEventContainer();
const singletons = new WeakSet();
const AbortController = window.AbortController;

export function useUpdateTrigger() {
    const setState = useState()[1];
    return useCallback(function () {
        setState({});
    }, []);
}

export function useMemoizedFunction(callback) {
    const ref = useRef();
    ref.current = isFunction(callback) || noop;
    return useCallback(function () {
        return ref.current.apply(this, arguments);
    }, []);
}

export function useObservableProperty(obj, key) {
    const forceUpdate = useUpdateTrigger();
    const value = obj[key];
    const ref = useRef();
    ref.current = value;
    useEffect(function () {
        var cb = function (v) {
            if (v !== ref.current) {
                forceUpdate();
            }
        };
        cb(obj[key]);
        return watch(obj, key, cb);
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
                    return nextResult.d || (nextResult.d = nextResult.then(function () {
                        nextResult = null;
                        return state.refresh(true);
                    }));
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
    return !singletons.has(target);
}

export function useSingleton(factory, onDispose) {
    const target = useState(factory())[0];
    setAdd(singletons, target);
    useEffect(function () {
        setAdd(singletons, target);
        return function () {
            singletons.delete(target);
            setImmediate(function () {
                if (isSingletonDisposed(target)) {
                    (onDispose || target.dispose || noop).call(target);
                }
            });
        };
    }, [target]);
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
            return dom.emit('error', ref.current || dom.root, { error }, true);
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
