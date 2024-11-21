import { define, definePrototype, extend, isFunction } from "zeta-dom/util";

const re = /^-?\d{4,}-\d{2}-\d{2}$/;

// method mapping for relative date units
const units = {
    y: ['getFullYear', 'setFullYear'],
    m: ['getMonth', 'setMonth'],
    d: ['getDate', 'setDate']
};
units.w = units.d;

function parseRelativeDate(str) {
    var date = new Date();
    var dir = str[0] === '-' ? -1 : 1;
    str.toLowerCase().replace(/([+-]?)(\d+)([dwmy])/g, function (v, a, b, c) {
        date[units[c][1]](date[units[c][0]]() + (b * (a === '-' ? -1 : a === '+' ? 1 : dir) * (c === 'w' ? 7 : 1)));
    });
    return date;
}

function normalizeDate(date) {
    if (typeof date === 'string') {
        if (re.test(date)) {
            return Date.parse(date + 'T00:00');
        }
        date = date[0] === '+' || date[0] === '-' ? parseRelativeDate(date) : Date.parse(date);
    }
    return new Date(date).setHours(0, 0, 0, 0);
}

function clampValue(date, min, max) {
    var ts = normalizeDate(date);
    return ts < min ? min : ts > max ? max : date;
}

function toDateObject(str) {
    var ts = normalizeDate(str);
    return isNaN(ts) ? null : new Date(ts);
}

function toDateString(date) {
    if (!isNaN(date)) {
        // counter UTC conversion due to toISOString
        var tz = new Date(date).getTimezoneOffset() * 60000;
        var str = new Date(date - tz).toISOString();
        return str.slice(0, str.indexOf('T', 10));
    }
    return '';
}

export default function DateField() { }

define(DateField, {
    toDateString: toDateString,
    toDateObject: toDateObject
});

definePrototype(DateField, {
    defaultValue: '',
    normalizeValue: function (value) {
        return toDateString(normalizeDate(value));
    },
    postHook: function (state, props, hook) {
        var setValue = state.setValue;
        var value = state.value;
        var min = normalizeDate(props.min);
        var max = normalizeDate(props.max);
        var displayText = hook.memo(function () {
            return value && props.formatDisplay ? props.formatDisplay(toDateObject(value)) : value;
        }, [value]);
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
