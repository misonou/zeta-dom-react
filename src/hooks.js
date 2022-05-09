import { useEffect, useRef, useState } from "react";
import dom from "./include/zeta-dom/dom.js";
import { lock } from "./include/zeta-dom/domLock.js";
import { ZetaEventContainer } from "./include/zeta-dom/events.js";
import { always, catchAsync, combineFn, extend, isArray, makeArray, map, resolve, setAdd, watch } from "./include/zeta-dom/util.js";

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
    const sValue = useState(obj[key]);
    const value = sValue[0], setValue = sValue[1];
    useEffect(function () {
        setValue(obj[key]);
        return watch(obj, key, function (v) {
            setValue(function () {
                return v;
            });
        });
    }, [obj, key]);
    return value;
}

export function useAsync(init, autoload) {
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
                return container.add(state, 'error', handler);
            },
            refresh: function () {
                var promise;
                var shouldNotify = function () {
                    return !state.disposed && state.promise === promise;
                };
                promise = always(resolve().then(init), function (resolved, value) {
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
                extend(state, { promise: promise, loading: true, error: undefined });
                if (element) {
                    catchAsync(lock(element, promise));
                }
            }
        };
    })[0];
    const deps = isArray(autoload);
    init = useMemoizedFunction(init);
    autoload = autoload !== false;

    useObservableProperty(state, 'loading');
    useEffect(function () {
        return function () {
            state.disposed = true;
        };
    }, [state]);
    useEffect(function () {
        if (autoload) {
            state.refresh();
        }
    }, [state, autoload].concat(deps));
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
