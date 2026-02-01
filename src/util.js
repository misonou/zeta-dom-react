import { createElement, Fragment, lazy, Suspense } from "react";
import { combineFn, each, extend, isFunction, isPlainObject, kv, makeArray, mapGet, noop, sameValue, single, throwNotFunction } from "zeta-dom/util";
import dom from "zeta-dom/dom";

const boundEvents = new WeakMap();

export function domEventRef(event, handler) {
    var arr;
    handler = isPlainObject(event) || kv(event, handler);
    return function (element) {
        if (element) {
            if (arr && arr.ref) {
                throw new Error('Callback can only be passed to single React element');
            }
            arr = mapGet(boundEvents, element, Array);
            if (arr.index === undefined) {
                arr.index = 0;
            }
            var index = arr.index++;
            var state = arr[index] || (arr[index] = { keys: {} });
            each(handler, function (i, v) {
                throwNotFunction(v);
                state.keys[i] = state.keys[i] || dom.on(element, i, function () {
                    return (state.handler[i] || noop).apply(this, arguments);
                });
            });
            state.handler = handler;
        } else {
            arr.index = 0;
        }
        arr.ref = element;
    };
}

export function classNames() {
    var className = [];
    (function process(args) {
        each(args, function (j, v) {
            if (v) {
                if (typeof v === 'string') {
                    className.push(v);
                } else if (typeof v.getClassNames === 'function') {
                    process(makeArray(v.getClassNames()));
                } else {
                    for (var i in v) {
                        var value = v[i];
                        if (value || value === 0) {
                            className.push(value === true ? i : i + '-' + value);
                        }
                    }
                }
            }
        });
    })(makeArray(arguments));
    return className.join(' ');
}

export function innerTextOrHTML(text) {
    return isPlainObject(text) ? { dangerouslySetInnerHTML: text } : { children: text };
}

export function partial(setState, key) {
    var fn = function (key, value) {
        setState(function (current) {
            if (typeof key === 'string') {
                key = kv(key, isFunction(value) ? value(current[key], current) : value);
            }
            return single(key, function (v, i) {
                return !sameValue(v, current[i]) && extend({}, current, key);
            }) || current;
        });
    };
    return key ? fn.bind(0, key) : fn;
}

export function combineRef() {
    return combineFn(makeArray(arguments).map(toRefCallback));
}

export function toRefCallback(ref) {
    if (ref && !isFunction(ref)) {
        return function (v) {
            return ref.current = v;
        };
    }
    return ref || noop;
}

export function withSuspense(factory, fallback) {
    fallback = fallback || Fragment;
    if (isFunction(fallback)) {
        fallback = createElement(fallback);
    }
    const Component = lazy(factory);
    return function (props) {
        return createElement(Suspense, { fallback }, createElement(Component, props));
    };
}
