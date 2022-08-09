import { useEffect, useMemo, useRef, useState } from "react";
import dom from "./include/zeta-dom/dom.js";
import { notifyAsync } from "./include/zeta-dom/domLock.js";
import { ZetaEventContainer } from "./include/zeta-dom/events.js";
import { always, catchAsync, combineFn, extend, isArray, makeArray, makeAsync, map, setAdd, watch } from "./include/zeta-dom/util.js";

const fnWeakMap = new WeakMap();
const container = new ZetaEventContainer();

export function useMemoizedFunction(callback) {
    const fn = useState(function () {
        return function fn() {
            const cb = fnWeakMap.get(fn);
            return cb && cb.apply(this, arguments);
        };
    })[0];
    fnWeakMap.set(fn, callback);
    return fn;
}

export function useObservableProperty(obj, key) {
    const forceUpdate = useState()[1];
    const value = obj[key];
    const ref = useRef();
    ref.current = value;
    useEffect(function () {
        var cb = function (v) {
            if (v !== ref.current) {
                forceUpdate({});
            }
        };
        cb(obj[key]);
        return watch(obj, key, cb);
    }, [obj, key]);
    return value;
}

export function useAsync(init, deps) {
    const state = useState(function () {
        var element;
        var emitErrorEvent = function (error) {
            return container.emit('error', state, { error }, true);
        };
        return {
            loading: true,
            elementRef: function (current) {
                element = current;
            },
            onError: function (handler) {
                return container.add(state, 'error', function (e) {
                    return handler.call(state, e.error);
                });
            },
            refresh: function () {
                extend(state, { loading: true, error: undefined });
                var result = makeAsync(init)();
                var promise;
                var shouldNotify = function () {
                    return !state.disposed && state.promise === promise;
                };
                promise = always(result, function (resolved, value) {
                    if (shouldNotify()) {
                        if (resolved) {
                            extend(state, { loading: false, value: value });
                        } else {
                            extend(state, { loading: false, value: undefined, error: value });
                            if (!emitErrorEvent(value)) {
                                throw value;
                            }
                        }
                    }
                });
                state.promise = promise;
                notifyAsync(element || dom.root, catchAsync(promise));
                return result;
            }
        };
    })[0];
    deps = [deps !== false].concat(isArray(deps) || []);
    init = useMemoizedFunction(init);
    useEffect(function () {
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
        if (deps[0]) {
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
    const ref = useRef(null);
    const args = makeArray(arguments);
    useEffect(function () {
        return combineFn(map(args, function (v) {
            return v.onError(function (error) {
                if (ref.current) {
                    return dom.emit('error', ref.current, { error }, true);
                }
            });
        }));
    }, [ref].concat(args));
    return ref;
}
