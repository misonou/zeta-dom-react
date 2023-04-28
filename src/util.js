import { createElement, Fragment, lazy, Suspense } from "react";
import { combineFn, each, extend, isFunction, isPlainObject, kv, makeArray, mapGet, noop, setImmediate, throwNotFunction } from "./include/zeta-dom/util.js";
import dom from "./include/zeta-dom/dom.js";

const boundEvents = new WeakMap();

export function domEventRef(event, handler) {
    var arr;
    handler = isPlainObject(event) || kv(event, handler);
    return function (element) {
        if (element) {
            if (arr) {
                throw new Error('Callback can only be passed to single React element');
            }
            arr = mapGet(boundEvents, element, Array);
            if (arr.index === undefined) {
                arr.index = 0;
            }
            handler = each(handler, function (i, v) {
                var index = arr.index++;
                if (!arr[index]) {
                    dom.on(element, i, function () {
                        return arr[index].apply(this, arguments);
                    });
                }
                arr[index] = throwNotFunction(v);
            });
        } else {
            arr.index = 0;
        }
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
                        if (value) {
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
        setState(function (v) {
            if (typeof key === 'string') {
                key = kv(key, isFunction(value) ? value(v[key], v) : value);
            }
            return extend({}, v, key);
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
