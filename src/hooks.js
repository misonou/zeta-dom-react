import { useEffect, useState } from "react";
import { always, combineFn, extend, isArray, makeArray, resolve, setAdd, watch } from "./include/zeta-dom/util.js";

const fnWeakMap = new WeakMap();

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
        return {
            loading: true,
            refresh: function () {
                var promise = resolve().then(init);
                extend(state, { promise: promise, loading: true, error: undefined });
                always(promise, function (resolved, value) {
                    if (!state.disposed && state.promise === promise) {
                        if (resolved) {
                            extend(state, { loading: false, value: value });
                        } else {
                            extend(state, { loading: false, value: undefined, error: value });
                        }
                    }
                });
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
