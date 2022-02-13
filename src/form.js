import { createContext, useContext, useEffect, useState } from "react";
import { any, combineFn, createPrivateStore, definePrototype, extend, grep, keys, makeArray, resolveAll, values } from "./include/zeta-dom/util.js";
import { ZetaEventContainer } from "./include/zeta-dom/events.js";
import { useMemoizedFunction } from "./hooks.js";

const _ = createPrivateStore();

/** @type {React.Context<import ("./form").FormContext>} */
// @ts-ignore: type inference issue
const _FormContext = createContext(null);

export const FormContextProvider = _FormContext.Provider;

function createDataObject(context, eventContainer, initialData) {
    return new Proxy(extend({}, initialData), {
        get: function (t, p) {
            if (typeof p === 'string') {
                return t[p];
            }
        },
        set: function (t, p, v) {
            if (typeof p === 'string' && t[p] !== v) {
                if (p in t) {
                    eventContainer.emitAsync('dataChange', context, [p], {}, function (v, a) {
                        return v.concat(a);
                    });
                }
                t[p] = v;
            }
            return true;
        }
    });
}

export function FormContext(initialData, validateOnChange) {
    var self = this;
    var state = _(self, {
        validateResult: {},
        validateOnChange: {},
        eventContainer: new ZetaEventContainer(),
        initialData: initialData || {},
    });
    self.isValid = true;
    self.validateOnChange = validateOnChange !== false;
    self.data = createDataObject(self, state.eventContainer, initialData);
    self.on('dataChange', function (e) {
        if (self.validateOnChange) {
            self.validate.apply(self, grep(e.data, function (v) {
                return state.validateOnChange[v] !== false;
            }));
        }
    });
}

definePrototype(FormContext, {
    on: function (event, handler) {
        var state = _(this);
        return state.eventContainer.add(this, event, handler);
    },
    reset: function () {
        var self = this;
        var state = _(self);
        for (var i in self.data) {
            delete self.data[i];
        }
        extend(self.data, state.initialData);
        self.isValid = true;
        state.eventContainer.emit('reset', self);
    },
    validate: function () {
        var self = this;
        var state = _(self);
        var validateResult = state.validateResult;
        var eventContainer = state.eventContainer;
        var props = makeArray(arguments);
        if (!props.length) {
            props = keys(self.data);
        }
        var prev = extend({}, validateResult);
        var promise = resolveAll(props.map(function (v) {
            return eventContainer.emit('validate', self, {
                name: v,
                value: self.data[v]
            });
        }));
        return promise.then(function (result) {
            props.forEach(function (v, i) {
                validateResult[v] = result[i];
                if ((result[i] || '') !== (prev[v] || '')) {
                    eventContainer.emit('validationChange', self, {
                        name: v,
                        isValid: !result[i],
                        message: result[i] || ''
                    });
                }
            });
            self.isValid = !any(values(validateResult), function (v) {
                return v;
            });
            return !any(result, function (v) {
                return v;
            });
        });
    }
});

export function useFormContext(initialData, validateOnChange) {
    const form = useState(function () {
        return new FormContext(initialData, validateOnChange);
    })[0];
    const forceUpdate = useState(0)[1];
    useEffect(function () {
        return form.on('dataChange', function () {
            forceUpdate(function (v) {
                return ++v;
            });
        });
    }, [form]);
    return form;
}

export function useFormField(props, defaultValue, prop) {
    const form = useContext(_FormContext);
    const key = props.name || '';
    const initialValue = useState(function () {
        return (form && form.data[key]) || defaultValue;
    })[0];
    const sValue = useState(initialValue);
    const sError = useState('');
    const onValidate = useMemoizedFunction(props.onValidate);
    const value = sValue[0], setValue = sValue[1];
    const error = sError[0], setError = sError[1];

    var setValueCallback = useMemoizedFunction(function (v) {
        if (!props.onChange) {
            console.warn('onChange not supplied');
        } else {
            props.onChange(typeof v === 'function' ? v(value) : v);
        }
    });

    // put internal states on props for un-controlled mode
    prop = prop || 'value';
    if (!(prop in props)) {
        setValueCallback = setValue;
        props = extend({}, props);
        props[prop] = value;
    }

    useEffect(function () {
        if (form && key) {
            if (key in form.data) {
                setValue(form.data[key]);
            }
            return combineFn(
                form.on('dataChange', function (e) {
                    if (e.data.includes(key)) {
                        setValue(form.data[key]);
                    }
                }),
                form.on('validationChange', function (e) {
                    if (e.name === key) {
                        setError(e.message);
                    }
                }),
                form.on('validate', function (e) {
                    if (e.name === key) {
                        return onValidate(e.value, e.name);
                    }
                }),
                form.on('reset', function () {
                    setValue(initialValue);
                    setError('');
                })
            );
        }
    }, [form, key, initialValue, onValidate]);

    useEffect(function () {
        if (form && key) {
            form.data[key] = value;
        }
    }, [form, key, value]);

    useEffect(function () {
        if (form && key) {
            _(form).validateOnChange[key] = props.validateOnChange;
        }
    }, [form, key, props.validateOnChange]);

    return {
        value: props[prop],
        error: props.error || error || '',
        setValue: setValueCallback,
        setError: setError,
    };
}
