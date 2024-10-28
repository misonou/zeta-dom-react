import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import dom, { reportError } from "zeta-dom/dom";
import { notifyAsync } from "zeta-dom/domLock";
import { bind } from "zeta-dom/domUtil";
import { ZetaEventContainer } from "zeta-dom/events";
import { always, any, arrRemove, catchAsync, clearImmediateOnce, combineFn, createPrivateStore, defineObservableProperty, defineOwnProperty, delay, each, equal, errorWithCode, extend, fill, freeze, hasOwnProperty, is, isArray, isErrorWithCode, isFunction, makeArray, makeAsync, map, mapRemove, noop, pick, pipe, resolve, sameValue, sameValueZero, setAdd, setImmediateOnce, watch } from "zeta-dom/util";
import * as ErrorCode from "zeta-dom/errorCode";
import { IS_DEV } from "./env.js";

const _ = /*#__PURE__*/ createPrivateStore();
const container = new ZetaEventContainer();
const singletons = new Map();
const disposedSingletons = new WeakSet();
const unloadCallbacks = new Set();
const AsyncScopeContext = createContext(null);
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
        if (clearUnusedSingletons.d & (v.d || 1)) {
            disposedSingletons.add(i);
            mapRemove(singletons, i).call(i, i, v.d === 2);
        }
    });
    clearUnusedSingletons.d = 0;
}

function useSingletonEffectImpl(factory, dispose, deps) {
    var target = useMemo(factory, deps);
    useEffect(function () {
        return function () {
            disposedSingletons.add(target);
            dispose.call(target, target, true);
        };
    }, [target]);
    return target;
}

function useSingletonEffectImplDev(factory, dispose, deps) {
    var target = useMemo(function () {
        var target = factory();
        if (!singletons.has(target)) {
            singletons.set(target, dispose);
            clearUnusedSingletons.d = 0;
            clearImmediateOnce(clearUnusedSingletons);
        }
        return target;
    }, deps);
    useEffect(function () {
        var cb = function (flag) {
            singletons.get(target).d = flag ? 4 : 2;
            clearUnusedSingletons.d |= flag ? 1 : 2;
            setImmediateOnce(clearUnusedSingletons);
        };
        cb(true);
        return cb;
    }, [target]);
    return target;
}

function createRefInitCallback(set, init, args) {
    return function (v) {
        if (v && setAdd(set, v)) {
            args[0] = v;
            init.apply(null, args);
        }
    };
}

export function createAsyncScope(element) {
    return {
        errorHandler: createErrorHandler(element),
        Provider: function (props) {
            return createElement(AsyncScopeContext.Provider, { value: element }, props.children);
        }
    };
}

export function useAutoSetRef(value) {
    const ref = useRef();
    ref.current = value;
    return ref;
}

export function useEagerReducer(reducer, init) {
    var state = useState(function () {
        var value = isFunction(init) ? init() : init;
        var fn = function (newValue) {
            newValue = reducer(value, newValue);
            if (!sameValue(newValue, value)) {
                value = newValue;
                state[1]([value, fn]);
            }
        };
        return [value, fn];
    });
    return state[0];
}

export function useEagerState(init) {
    return useEagerReducer(function (prevState, state) {
        return isFunction(state) ? state(prevState) : state;
    }, init);
}

export function useUpdateTrigger() {
    return useReducer(function () {
        return {};
    })[1];
}

export function useValueTrigger(value, comparer) {
    var state = useEagerReducer(function (ref, value) {
        return (comparer || sameValue)(ref.current, value) ? ref : { current: value };
    }, {});
    state[0].current = value;
    return state[1];
}

export function useEventTrigger(obj, event, selector, initialState) {
    const state = useEagerState(initialState);
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
    const scopeElement = useContext(AsyncScopeContext);
    const state = useSingleton(function () {
        var lastTime = 0;
        var element;
        var currentController;
        var nextResult;
        var reset = function (loading, value, error, reason) {
            if (currentController) {
                currentController.abort(reason);
                currentController = null;
            }
            nextResult = null;
            extend(state, { loading, value, error });
            notifyChange([loading, value, error]);
        };
        var refresh = function () {
            var controller = AbortController ? new AbortController() : { abort: noop };
            var result = makeAsync(init)(controller.signal);
            var promise = always(result, function (resolved, value) {
                if (currentController === controller) {
                    currentController = null;
                    if (resolved) {
                        reset(false, value);
                        container.emit('load', state, { data: value });
                    } else {
                        reset(false, undefined, value);
                        if (!container.emit('error', state, { error: value })) {
                            throw value;
                        }
                    }
                }
            });
            reset(true, state.value);
            lastTime = Date.now();
            currentController = controller;
            notifyAsync(element || scopeElement || dom.root, promise);
            return result;
        };
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
            refresh: function () {
                return nextResult || (nextResult = muteRejection(new Promise(function (resolve, reject) {
                    var previousController = currentController || { abort: noop };
                    currentController = {
                        abort: function (reason) {
                            previousController.abort(reason);
                            reject(reason || errorWithCode(ErrorCode.cancelled));
                        }
                    };
                    (Date.now() - lastTime < debounce ? delay(debounce) : Promise.resolve()).then(resolve);
                }).then(refresh)));
            },
            abort: function (reason) {
                reset(false, state.value, state.error, reason);
            },
            reset: function () {
                reset(false);
                lastTime = 0;
            }
        };
    }, [], function () {
        state.abort();
    });
    deps = [deps !== false].concat(isArray(deps) || []);
    init = useMemoizedFunction(init);
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
    var notifyChange = useValueTrigger([state.loading, state.value, state.error], equal);
    return [state.value, state];
}

export function useRefInitCallback() {
    const args = makeArray(arguments);
    const set = useState(new WeakSet())[0];
    return createRefInitCallback(set, args[0], args);
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

export function useSingleton(factory, deps, onDispose) {
    if (isFunction(deps)) {
        onDispose = deps;
        deps = [];
    }
    onDispose = onDispose || function (target) {
        (target.dispose || noop).call(target);
    };
    return isFunction(factory) ? useSingletonEffect(factory, onDispose, deps || []) : useSingletonEffect(pipe.bind(0, factory), onDispose, [factory]);
}

export function useErrorHandlerRef() {
    return useErrorHandler.apply(this, arguments).ref;
}

export function createErrorHandler(element) {
    var reemitting;
    var reemitError = function (error) {
        try {
            reemitting = true;
            return reportError(error, element);
        } finally {
            reemitting = false;
        }
    };
    var catchError = function (error, source) {
        var data = {
            error: error,
            sourceElement: source ? source.target : null
        };
        return container.emit('error', handler, data, { source }) || container.emit('default', handler, data, { source });
    };
    var initElement = function (current) {
        element = current;
        return dom.on(current, 'error', function (e) {
            return reemitting ? undefined : catchError(e.error, e);
        });
    };
    var handler = {
        emit: function (error) {
            return catchError(error) || reemitError(error) || resolve();
        },
        catch: function (filter, callback) {
            var isErrorOf = pipe;
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
            return container.add(handler, isErrorOf === pipe ? 'default' : 'error', function (e) {
                if (isErrorOf(e.error, filter)) {
                    return callback(e.error, pick(e, ['source', 'sourceKeyName', 'sourceElement']));
                }
            });
        }
    };
    if (element) {
        initElement(element);
    } else {
        handler.ref = createRefInitCallback(new WeakSet(), initElement, []);
    }
    return handler;
}

export function useErrorHandler() {
    const args = makeArray(arguments);
    const handler = useState(createErrorHandler)[0];
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
    useSingletonEffect(pipe.bind(0, callback), function (target, used) {
        unloadCallbacks.delete(callback);
        return used && callback(false);
    }, []);
}

export function createDependency(defaultValue) {
    var Provider = freeze({});
    var Consumer = freeze({});
    var dependency = { Provider, Consumer };
    var values = _(dependency, extend([], dependency));
    defineObservableProperty(values, 'current', defaultValue, function () {
        return values[0] ? values[0].value : defaultValue;
    });
    _(Provider, values);
    _(Consumer, values);
    return freeze(dependency);
}

export function useDependency(dependency, value, deps) {
    var values = _(dependency);
    if (dependency === values.Provider) {
        var wrapper = useSingleton(function () {
            var obj = {};
            return values.push(obj) && obj;
        }, [values], function () {
            arrRemove(values, wrapper);
            values.current = null;
        });
        useMemo(function () {
            value = isFunction(value) ? value() : value;
            if (wrapper.value !== value || !hasOwnProperty(wrapper, 'value')) {
                defineOwnProperty(wrapper, 'value', value, true);
                values.current = null;
            }
        }, [wrapper].concat(deps || [value]));
        return wrapper;
    } else {
        return useObservableProperty(values, 'current');
    }
}
