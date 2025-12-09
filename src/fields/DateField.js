import { define, definePrototype, extend, hasOwnProperty, isFunction } from "zeta-dom/util";

const re = /^(\d{4}|[+-]\d{6})-\d{2}-\d{2}$/;
const fn = {
    y: function (d, n) { adjustMonth(d, d.getDate(), d.setFullYear(d.getFullYear() + n)) },
    m: function (d, n) { adjustMonth(d, d.getDate(), d.setMonth(d.getMonth() + n)) },
    d: function (d, n) { d.setDate(d.getDate() + n) },
    w: function (d, n) { fn.d(d, n * 7) }
};
const fn1 = {
    ys: function (d) { d.setMonth(0, 1) },
    ye: function (d) { d.setMonth(11, 31) },
    ms: function (d) { d.setDate(1) },
    me: function (d) { d.setMonth(d.getMonth() + 1, 0) },
    nb: function (d, k, n, b) { fn.d(d, -((7 - k + d.getDay()) % 7 || b || 0) - 7 * (n - 1)) },
    na: function (d, k, n, b) { fn.d(d, +((7 + k - d.getDay()) % 7 || b || 0) + 7 * (n - 1)) }
};
const fn2 = {
    "year-start": fn1.ys,
    "year-end": fn1.ye,
    "month-start": fn1.ms,
    "month-end": fn1.me,
    "week-start": function (d) { fn.d(d, -d.getDay()) },
    "week-end": function (d) { fn.d(d, -d.getDay() + 6) },
    "nth-after": function (d, n, k) { fn1.na(d, k, n, 7) },
    "nth-before": function (d, n, k) { fn1.nb(d, k, n, 7) },
    "nth-of-year": function (d, n, k) { fn1.ys(d), fn1.na(d, k, n) },
    "nth-of-month": function (d, n, k) { fn1.ms(d), fn1.na(d, k, n) },
    "nth-last-of-year": function (d, n, k) { fn1.ye(d), fn1.nb(d, k, n) },
    "nth-last-of-month": function (d, n, k) { fn1.me(d), fn1.nb(d, k, n) }
};

function adjustMonth(d, v, _) {
    if (v > 28 && d.getDate() !== v) {
        d.setDate(0);
    }
}

function parseRelativeDateSimple(str, date) {
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

function parseRelativeDate(str, date) {
    if (str.length < 8 || /^[0-9+-]/.test(str)) {
        return parseRelativeDateSimple(str, date);
    }
    var pos = str.indexOf('(');
    var d = pos < 0 ? str : str.slice(0, pos);
    if (!hasOwnProperty(fn2, d)) {
        return;
    }
    var r, n, k = 0;
    if (pos > 0) {
        r = str.slice(pos + 1, str.lastIndexOf(')'));
    }
    if (r && d[0] === 'n') {
        r = r.split(/\s*,\s*/);
        n = +r[0];
        k = ({ sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 })[r[1]];
        r = r[2];
    }
    if (r) {
        date = parseRelativeDateSimple(r, date);
    }
    if (date && k !== undefined) {
        fn2[d](date, n, k);
        return date;
    }
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
        var min = hook.memo(normalizeDate, [props.min]);
        var max = hook.memo(normalizeDate, [props.max]);
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
