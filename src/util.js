import { each, extend, isFunction, kv, makeArray, noop } from "./include/zeta-dom/util.js";

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

export function partial(setState) {
    return function (key, value) {
        setState(function (v) {
            if (typeof key === 'string') {
                key = kv(key, isFunction(value) ? value(v[key], v) : value);
            }
            return extend({}, v, key);
        });
    };
}

export function toRefCallback(ref) {
    if (ref && !isFunction(ref)) {
        return function (v) {
            return ref.current = v;
        };
    }
    return ref || noop;
}
