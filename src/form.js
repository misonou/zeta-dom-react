import { createContext, createElement, forwardRef, useContext, useEffect, useMemo, useState } from "react";
import { always, any, combineFn, createPrivateStore, defineObservableProperty, definePrototype, exclude, extend, grep, inherit, isArray, isFunction, isUndefinedOrNull, keys, makeArray, noop, pick, pipe, resolve, resolveAll } from "./include/zeta-dom/util.js";
import { ZetaEventContainer } from "./include/zeta-dom/events.js";
import { focus } from "./include/zeta-dom/dom.js";
import { useMemoizedFunction, useObservableProperty, useUpdateTrigger } from "./hooks.js";
import { combineRef } from "./util.js";
import { useViewState } from "./viewState.js";

const _ = createPrivateStore();
const emitter = new ZetaEventContainer();
const fieldTypes = {};

/** @type {React.Context<import ("./form").FormContext>} */
// @ts-ignore: type inference issue
const _FormContext = createContext(null);

export const FormContextProvider = _FormContext.Provider;

function isEmpty(value) {
    return isUndefinedOrNull(value) || value === '' || (isArray(value) && !value.length);
}

function createDataObject(context, initialData) {
    var state = _(context);
    return new Proxy(extend({}, initialData), {
        get: function (t, p) {
            if (typeof p === 'string') {
                return t[p];
            }
        },
        set: function (t, p, v) {
            if (typeof p === 'string' && t[p] !== v) {
                if (p in t) {
                    (state.fields[p] || {}).dirty = true;
                    emitter.emitAsync('dataChange', context, [p], {}, function (v, a) {
                        return v.concat(a);
                    });
                }
                t[p] = v;
            }
            return true;
        }
    });
}

function wrapErrorResult(state, key, error) {
    return {
        toString: function () {
            return error((state.fields[key] || '').props || {});
        }
    };
}

function normalizeOptions(options) {
    if (typeof options === 'boolean') {
        options = {
            validateOnChange: options
        };
    }
    return extend({
        autoPersist: true,
        validateOnChange: true
    }, options);
}

export function FormContext(initialData, options, viewState) {
    var self = this;
    var fields = {};
    var state = _(self, {
        fields: fields,
        viewState: viewState,
        vlocks: {},
        initialData: initialData,
        setValid: defineObservableProperty(this, 'isValid', true, function () {
            return !any(fields, function (v, i) {
                var props = v.props;
                return !props.disabled && (v.error || (props.required && (props.isEmpty || v.preset.isEmpty || isEmpty)(self.data[i])));
            });
        })
    });
    extend(self, normalizeOptions(options));
    self.ref = function (element) {
        state.ref = element;
    };
    self.isValid = true;
    self.data = createDataObject(self, viewState.get() || state.initialData);
    self.on('dataChange', function (e) {
        if (self.validateOnChange) {
            var fieldsToValidate = grep(e.data, function (v) {
                return fields[v] && fields[v].props.validateOnChange !== false;
            });
            if (fieldsToValidate[0]) {
                self.validate.apply(self, fieldsToValidate);
            }
        }
    });
}

definePrototype(FormContext, {
    element: function (key) {
        var field = _(this).fields[key];
        return field && field.element;
    },
    focus: function (key) {
        var element = this.element(key);
        if (element) {
            focus(element);
        }
    },
    on: function (event, handler) {
        return emitter.add(this, event, handler);
    },
    persist: function () {
        var self = this;
        _(self).viewState.set(extend({}, self.data));
        self.autoPersist = false;
    },
    restore: function () {
        var self = this;
        var data = _(self).viewState.get();
        if (data) {
            self.reset(data);
        }
        return !!data;
    },
    reset: function (data) {
        var self = this;
        var state = _(self);
        for (var i in self.data) {
            delete self.data[i];
        }
        extend(self.data, data || state.initialData);
        self.isValid = true;
        emitter.emit('reset', self);
    },
    setError: function (key, error) {
        var self = this;
        var state = _(self);
        var field = state.fields[key] || {};
        var prev = field.error || '';
        if (isFunction(error)) {
            error = wrapErrorResult(state, key, error);
        }
        field.error = error;
        if ((error || '') !== prev) {
            emitter.emit('validationChange', self, {
                name: key,
                isValid: !error,
                message: String(error || '')
            });
            state.setValid();
        }
    },
    validate: function () {
        var self = this;
        var state = _(self);
        var vlocks = state.vlocks;
        var props = makeArray(arguments);
        if (!props.length) {
            props = keys(state.fields);
        }
        var validate = function (name) {
            var field = state.fields[name];
            var value = self.data[name];
            var result = emitter.emit('validate', self, { name, value });
            if (!result && field) {
                result = (field.props.onValidate || noop)(value, name, self);
            }
            return result;
        };
        var promises = props.map(function (v) {
            var arr = vlocks[v] = (vlocks[v] || []);
            var prev = arr[0];
            if (prev) {
                // debounce async validation
                return arr[1] || (arr[1] = always(arr[0], function () {
                    var next = validate(v);
                    always(next, function () {
                        // dismiss effects of previous validation if later one resolves earlier
                        // so that validity always reflects on latest data
                        if (arr[0] === prev) {
                            arr.shift();
                        }
                    });
                    return next;
                }));
            }
            arr[0] = resolve(validate(v));
            return arr[0];
        });
        return resolveAll(promises).then(function (result) {
            props.forEach(function (v, i) {
                // checks if current validation is of the latest
                if (vlocks[v][0] === promises[i]) {
                    vlocks[v].shift();
                    self.setError(v, result[i]);
                }
            });
            state.setValid();
            return !any(result, function (v) {
                return v;
            });
        });
    },
    toJSON: function () {
        return extend(true, {}, this.data);
    }
});

export function useFormContext(persistKey, initialData, options) {
    if (typeof persistKey !== 'string') {
        return useFormContext('', persistKey, initialData);
    }
    const viewState = useViewState(persistKey);
    const form = useState(function () {
        return new FormContext(initialData, options, viewState);
    })[0];
    const forceUpdate = useUpdateTrigger();
    useObservableProperty(form, 'isValid');
    useEffect(function () {
        return combineFn(
            form.on('dataChange', forceUpdate),
            function () {
                if (form.autoPersist) {
                    form.persist();
                }
            }
        );
    }, [form]);
    return form;
}

export function useFormField(type, props, defaultValue, prop) {
    if (typeof type !== 'string') {
        prop = defaultValue;
        defaultValue = props;
        props = type;
        type = '';
    }
    const preset = fieldTypes[type] || {};
    prop = prop || preset.valueProperty || 'value';

    const field = extend(useState({})[0], { preset, props });
    const form = useContext(_FormContext);
    const dict = form && form.data;
    const state = form && _(form);
    const key = props.name || '';

    const initialValue = useState(function () {
        return form && key in dict ? dict[key] : defaultValue;
    })[0];
    const sValue = useState(initialValue);
    const sError = useState('');
    const controlled = prop in props;
    const value = controlled ? props[prop] : sValue[0];
    const setValue = controlled ? noop : sValue[1];
    const error = sError[0], setError = sError[1];

    var setValueCallback = useMemoizedFunction(function (v) {
        v = typeof v === 'function' ? v(value) : v;
        setValue(v);
        if (form && !field.dirty) {
            dict[key] = v;
            field.dirty = false;
        }
        if (controlled && !props.onChange) {
            console.warn('onChange not supplied');
        }
        (props.onChange || noop)(v);
    });

    if (form && key) {
        state.fields[key] = field;
        if (controlled || !(key in dict)) {
            dict[key] = value;
        }
    }

    useEffect(function () {
        if (form && key) {
            return combineFn(
                function () {
                    if (state.fields[key] === field) {
                        delete state.fields[key];
                        state.setValid();
                    }
                },
                form.on('dataChange', function (e) {
                    if (e.data.includes(key)) {
                        field.dirty = false;
                        setValue(dict[key]);
                    }
                }),
                form.on('validationChange', function (e) {
                    if (e.name === key) {
                        setError(field.error);
                    }
                }),
                form.on('reset', function () {
                    dict[key] = initialValue;
                    setValue(initialValue);
                    setError('');
                })
            );
        }
    }, [form, key, dict, initialValue]);

    useEffect(function () {
        if (state) {
            state.setValid();
        }
    }, [state, props.disabled, props.required]);

    return (preset.postHook || pipe)({
        form: form,
        value: value,
        error: String(props.error || error || ''),
        setValue: setValueCallback,
        setError: setError,
        elementRef: function (v) {
            field.element = v;
        }
    }, props);
}

export function combineValidators() {
    var validators = grep(makeArray(arguments), isFunction);
    return function (value, name) {
        return validators.reduce(function (prev, next) {
            return prev.then(function (result) {
                return result || next(value, name);
            });
        }, resolve());
    };
}

export function registerFieldType(type, options) {
    if (isFunction(options)) {
        options = {
            postHook: options
        };
    }
    fieldTypes[type] = options;
}

export const Form = forwardRef(function (props, ref) {
    const form = props.context;
    const onSubmit = function (e) {
        if (!props.action) {
            e.preventDefault();
        }
        (props.onSubmit || noop).call(this, e);
    };
    const onReset = function (e) {
        e.preventDefault();
        form.reset();
        (props.onReset || noop).call(this, e);
    };
    extend(form, pick(props, ['enterKeyHint']));
    return createElement(FormContextProvider, { value: form },
        createElement('form', extend(exclude(props, ['context', 'enterKeyHint']), { ref: combineRef(ref, form.ref), onSubmit, onReset })));
});

registerFieldType('text', function (state, props) {
    var form = state.form;
    var inputProps = pick(props, ['type', 'autoComplete', 'maxLength', 'inputMode', 'placeholder', 'enterKeyHint']);
    if (props.type === 'password' && !inputProps.autoComplete) {
        inputProps.autoComplete = 'current-password';
    }
    inputProps.type = inputProps.type || 'text';
    inputProps.enterKeyHint = inputProps.enterKeyHint || (form && form.enterKeyHint);
    return extend(state, {
        inputProps: inputProps
    });
});

registerFieldType('choice', function (state, props) {
    var items = useMemo(function () {
        return props.items.map(function (v) {
            return typeof v === 'object' ? v : { label: String(v), value: v };
        });
    }, [props.items]);
    var selectedIndex = items.findIndex(function (v) {
        return v.value === state.value;
    });
    useEffect(function () {
        if (selectedIndex < 0) {
            var newValue = props.allowUnselect || !items[0] ? '' : items[0].value;
            if (newValue !== state.value) {
                state.setValue(newValue);
            }
        }
    });
    return extend(state, {
        items: items,
        selectedIndex: selectedIndex,
        selectedItem: items[selectedIndex]
    });
});

registerFieldType('toggle', {
    valueProperty: 'checked',
    isEmpty: function (value) {
        return !value;
    }
});
