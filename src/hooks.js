import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dom from "./include/zeta-dom/dom.js";
import { notifyAsync } from "./include/zeta-dom/domLock.js";
import { ZetaEventContainer } from "./include/zeta-dom/events.js";
import { always, combineFn, deferrable, delay, extend, is, isArray, isErrorWithCode, isFunction, makeArray, makeAsync, map, pipe, resolve, setAdd, watch } from "./include/zeta-dom/util.js";

const fnWeakMap = new WeakMap();
const container = new ZetaEventContainer();

export function useUpdateTrigger() {
    const setState = useState()[1];
    return useCallback(function () {
        setState({});
    }, []);
}

export function useMemoizedFunction(callback) {
    const fn = useCallback(function fn() {
        const cb = fnWeakMap.get(fn);
        return cb && cb.apply(this, arguments);
    }, []);
    fnWeakMap.set(fn, callback);
    return fn;
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
    const state = useState(function () {
        var element;
        var currentPromise;
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
                extend(state, { loading: true, error: undefined });
                var result = makeAsync(init)();
                var promise = always(result, function (resolved, value) {
                    if (!state.disposed && currentPromise === promise) {
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
                currentPromise = promise;
                notifyAsync(element || dom.root, promise);
                return result;
            }
        };
    })[0];
    deps = [deps !== false].concat(isArray(deps) || []);
    init = useMemoizedFunction(init);
    useEffect(function () {
        state.disposed = false;
        return function () {
            state.disposed = true;
        };
    }, [state]);
    useEffect(function () {
        if (deps[0]) {
            // keep call to refresh in useEffect to avoid double invocation
            // in strict mode in development environment
            state.refresh();
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
            catch: function (filter, callback) {
                var isErrorOf;
                if (callback) {
                    isErrorOf = isFunction(filter) ? is : isErrorWithCode;
                } else {
                    callback = filter;
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
            return v.onError(function (error) {
                return catchError(error) || reemitError(error) || resolve();
            });
        }));
    }, args);
    return handler;
}
