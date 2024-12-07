import { define, definePrototype, extend, isFunction } from "zeta-dom/util";

const re = /^(\d{4}|[+-]\d{6})-\d{2}-\d{2}$/;
const fn = {
    y: function (d, n) { d.setFullYear(d.getFullYear() + n) },
    m: function (d, n) { d.setMonth(d.getMonth() + n) },
    d: function (d, n) { d.setDate(d.getDate() + n) },
    w: function (d, n) { fn.d(d, n * 7) }
};

function parseRelativeDate(str, date) {
    var re = /([+-]?)(\d+)([dwmy])/g, m;
    var dir = str[0] === '-' ? -1 : 1;
    var pos = 0;
    while (m = re.exec(str)) {
        if (m.index !== pos) {
            break;
        }
        pos += m[0].length;
        fn[m[3]](date, m[2] * (m[1] === '-' ? -1 : m[1] === '+' ? 1 : dir));
    }
    return pos !== str.length ? undefined : date;
}

function normalizeDate(date, base) {
    if (typeof date === 'string') {
        if (!date) {
            return NaN;
        }
        if (re.test(date)) {
            return Date.parse(date + 'T00:00');
        }
        if (base !== false) {
            date = parseRelativeDate(date.toLowerCase(), base || new Date()) || date;
        }
    }
    return new Date(date).setHours(0, 0, 0, 0);
}

function clampValue(date, min, max) {
    var ts = normalizeDate(date, false);
    return ts < min ? min : ts > max ? max : date;
}

function toDateObject(str) {
    var ts = normalizeDate(str, false);
    return isNaN(ts) ? null : new Date(ts);
}

function toDateString(date) {
    function pad(v, d) {
        v = String(v);
        return v.length >= d ? v : ('00000' + v).slice(-d);
    }
    date = new Date(date);
    if (!isNaN(date)) {
        var y = date.getFullYear();
        return (y < 0 ? '-' + pad(Math.abs(y), 6) : y > 9999 ? '+' + pad(y, 6) : pad(y, 4)) + '-' + pad(date.getMonth() + 1, 2) + '-' + pad(date.getDate(), 2);
    }
    return '';
}

export default function DateField() { }

define(DateField, {
    toDateString: toDateString,
    toDateObject: toDateObject,
    getDate: function (input, base) {
        base = base !== undefined ? normalizeDate(base, false) : Date.now();
        return isNaN(base) ? '' : toDateString(normalizeDate(input, new Date(base)));
    }
});

definePrototype(DateField, {
    defaultValue: '',
    normalizeValue: function (value) {
        return toDateString(normalizeDate(value, false));
    },
    postHook: function (state, props, hook) {
        var setValue = state.setValue;
        var value = state.value;
        var min = normalizeDate(props.min);
        var max = normalizeDate(props.max);
        var formatDisplay = props.formatDisplay;
        var displayText = hook.memo(function () {
            return value && formatDisplay ? formatDisplay(toDateObject(value)) : value;
        }, [value, formatDisplay]);
        hook.memo(function () {
            var clamped = value && clampValue(value, min, max);
            if (clamped !== value) {
                setValue(clamped);
            }
        }, [value, min, max]);
        return extend(state, {
            min: toDateString(min),
            max: toDateString(max),
            displayText: displayText,
            setValue: hook.callback(function (v) {
                v = isFunction(v) ? v(value) : v;
                if (!v) {
                    setValue('');
                } else if (/\d{4}/.test(v) && /[^\s\d]/.test(v)) {
                    v = normalizeDate(v);
                    if (!isNaN(v)) {
                        setValue(clampValue(v, min, max));
                    }
                }
            })
        });
    }
});
