import { createContext, createElement, forwardRef, useContext, useEffect, useMemo, useState } from "react";
import { always, any, combineFn, createPrivateStore, defineObservableProperty, definePrototype, each, either, exclude, extend, grep, isArray, isFunction, isUndefinedOrNull, keys, makeArray, mapGet, mapRemove, noop, pick, pipe, reject, resolve, resolveAll, setImmediateOnce, splice, watch } from "./include/zeta-dom/util.js";
import { ZetaEventContainer } from "./include/zeta-dom/events.js";
import dom, { focus } from "./include/zeta-dom/dom.js";
import { preventLeave } from "./include/zeta-dom/domLock.js";
import { useMemoizedFunction, useObservableProperty, useUpdateTrigger } from "./hooks.js";
import { combineRef } from "./util.js";
import { useViewState } from "./viewState.js";

const _ = createPrivateStore();
const emitter = new ZetaEventContainer();
const presets = new WeakMap();
const changedProps = new Map();
const fieldTypes = {
    text: TextField,
    toggle: ToggleField,
    choice: ChoiceField
};

/** @type {React.Context<import ("./form").FormContext>} */
// @ts-ignore: type inference issue
const _FormContext = createContext(null);

export const FormContextProvider = _FormContext.Provider;

function isEmpty(value) {
    return isUndefinedOrNull(value) || value === '' || (isArray(value) && !value.length);
}

function emitDataChangeEvent() {
    each(changedProps, function (i) {
        emitter.emit('dataChange', i, Object.keys(mapRemove(changedProps, i)));
    });
}

function createDataObject(context, initialData) {
    var state = _(context);
    var target = extend({}, initialData);
    var onChange = function (p) {
        mapGet(changedProps, context, Object)[p] = true;
        setImmediateOnce(emitDataChangeEvent);
    };
    var proxy = new Proxy(target, {
        set: function (t, p, v) {
            if (typeof p === 'string' && (t[p] !== v || !(p in t))) {
                var field = state.fields[p];
                onChange(p);
                t[p] = v;
                if (field) {
                    field.value = v;
                    field.onChange(v);
                }
            }
            return true;
        },
        deleteProperty: function (t, p) {
            if (p in t) {
                onChange(p);
                delete t[p];
            }
            return true;
        }
    });
    _(proxy, target);
    return proxy;
}

function wrapErrorResult(field, error) {
    return {
        toString: function () {
            return error(field.props || {});
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
        preventLeave: false,
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
                return !props.disabled && (v.error || (props.required && (props.isEmpty || v.preset.isEmpty || isEmpty)(v.value)));
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
        if (self.preventLeave && !state.unlock) {
            var promise = new Promise(function (resolve) {
                state.unlock = function () {
                    state.unlock = null;
                    resolve();
                };
            });
            preventLeave(state.ref || dom.root, promise, function () {
                return emitter.emit('beforeLeave', self) || reject();
            });
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
        _(self).viewState.set(self.toJSON());
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
        var dict = _(self.data);
        for (var i in dict) {
            delete dict[i];
        }
        extend(dict, data || state.initialData);
        each(state.fields, function (i, v) {
            if (v.controlled) {
                v.onChange(i in dict ? dict[i] : v.initialValue);
            } else if (i in dict) {
                v.value = dict[i];
            }
            v.error = null;
        });
        state.setValid();
        (state.unlock || noop)();
        emitter.emit('reset', self);
    },
    getError: function (key) {
        return String((_(this).fields[key] || '').error || '');
    },
    setError: function (key, error) {
        (_(this).fields[key] || {}).error = error;
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
            form.on('reset', forceUpdate),
            function () {
                (_(form).unlock || noop)();
                if (form.autoPersist) {
                    form.persist();
                }
            }
        );
    }, [form]);
    return form;
}

export function useFormField(type, props, defaultValue, prop) {
    if (typeof type === 'string') {
        type = fieldTypes[type];
    }
    if (!isFunction(type)) {
        prop = defaultValue;
        defaultValue = props;
        props = type;
        type = '';
    }
    const preset = type ? mapGet(presets, type, type) : {};
    prop = prop || preset.valueProperty || 'value';

    const form = useContext(_FormContext);
    const dict = form && form.data;
    const state = form && _(form);
    const key = props.name || '';
    const controlled = prop in props;

    const field = useState(function () {
        var initialValue = controlled ? props[prop] : (preset.normalizeValue || pipe)(form && key in dict ? dict[key] : defaultValue !== undefined ? defaultValue : preset.defaultValue);
        var field = {
            initialValue: initialValue,
            value: initialValue,
            error: '',
            onChange: function (v) {
                (field.props.onChange || noop)(v);
            },
            setValue: function (v) {
                v = isFunction(v) ? v(field.value) : v;
                if (field.controlled) {
                    field.onChange(v);
                } else {
                    field.value = v;
                }
            },
            setError: function (v) {
                field.error = isFunction(v) ? v(field.error) : v;
            },
            elementRef: function (v) {
                field.element = v;
            }
        };
        watch(field, true);
        defineObservableProperty(field, 'value', initialValue, function (v) {
            return (field.preset.normalizeValue || pipe)(v, field.props);
        });
        defineObservableProperty(field, 'error', '', function (v) {
            return isFunction(v) ? wrapErrorResult(field, v) : v || '';
        });
        watch(field, 'value', function (v) {
            if (field.dict) {
                field.dict[field.name] = v;
            } else if (!field.controlled) {
                field.onChange(v);
            }
        });
        watch(field, 'error', function (v) {
            if (field.dict && field.name) {
                emitter.emit('validationChange', field.form, {
                    name: field.name,
                    isValid: !v,
                    message: String(v)
                });
            }
        });
        return field;
    })[0];
    const hasErrorProp = 'error' in props;
    const prevKey = field.name || key;
    extend(field, { form, preset, props, controlled, dict, name: key });
    if (controlled) {
        field.value = props[prop];
    }
    if (hasErrorProp) {
        field.error = props.error;
    }
    if (form && key) {
        state.fields[key] = field;
        if (!hasErrorProp && key !== prevKey) {
            field.error = '';
        }
        if (!(key in dict)) {
            _(dict)[key] = field.initialValue;
            field.value = dict[key];
        } else if (!controlled && key !== prevKey) {
            field.value = dict[key];
        }
    }
    const state1 = (preset.postHook || pipe)({
        form: form,
        value: field.value,
        error: String(field.error),
        setValue: field.setValue,
        setError: field.setError,
        elementRef: field.elementRef
    }, props);

    useEffect(function () {
        return function () {
            if (state && state.fields[key] === field) {
                delete state.fields[key];
                if (field.props.clearWhenUnmount) {
                    delete _(field.dict)[key];
                }
                state.setValid();
            }
        };
    }, [state, key]);

    useEffect(function () {
        if (state) {
            state.setValid();
        }
    }, [state, field.error, props.disabled, props.required]);

    state1.value = useObservableProperty(field, 'value');
    state1.error = String(useObservableProperty(field, 'error'));
    return state1;
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
    fieldTypes[type] = function () {
        return options;
    };
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
    extend(form, pick(props, ['enterKeyHint', 'preventLeave']));
    return createElement(FormContextProvider, { value: form },
        createElement('form', extend(exclude(props, ['context', 'enterKeyHint', 'preventLeave']), { ref: combineRef(ref, form.ref), onSubmit, onReset })));
});

function normalizeChoiceItems(items) {
    return useMemo(function () {
        return (items || []).map(function (v) {
            return typeof v === 'object' ? v : { label: String(v), value: v };
        });
    }, [items]);
}

export function TextField() {
    this.defaultValue = '';
    this.postHook = function (state, props) {
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
    };
}

export function ChoiceField() {
    this.defaultValue = '';
    this.postHook = function (state, props) {
        var items = normalizeChoiceItems(props.items);
        var selectedIndex = items.findIndex(function (v) {
            return v.value === state.value;
        });
        useEffect(() => {
            if (selectedIndex < 0) {
                selectedIndex = props.allowUnselect || !items[0] ? -1 : 0;
                state.setValue(selectedIndex < 0 ? '' : items[0].value);
            }
        });
        return extend(state, {
            items: items,
            selectedIndex: selectedIndex,
            selectedItem: items[selectedIndex]
        });
    };
}

export function MultiChoiceField() {
    this.defaultValue = [];
    this.normalizeValue = function (newValue) {
        return isArray(newValue) || makeArray(newValue);
    };
    this.postHook = function (state, props) {
        var allowCustomValues = props.allowCustomValues || !props.items;
        var items = normalizeChoiceItems(props.items);
        var isUnknown = function (value) {
            return !items.some(function (v) {
                return v.value === value;
            });
        };
        var toggleValue = useMemoizedFunction(function (value, selected) {
            if (allowCustomValues || !isUnknown(value)) {
                state.setValue(function (arr) {
                    var index = arr.indexOf(value);
                    if (isUndefinedOrNull(selected) || either(index < 0, selected)) {
                        arr = makeArray(arr);
                        if (index < 0) {
                            arr.push(value);
                        } else {
                            arr.splice(index, 1);
                        }
                    }
                    return arr;
                });
            }
        });
        useEffect(() => {
            if (!allowCustomValues) {
                var cur = makeArray(state.value);
                var arr = splice(cur, isUnknown);
                if (arr.length) {
                    state.setValue(cur);
                }
            }
        });
        return extend(state, {
            items: items,
            toggleValue: toggleValue
        });
    };
}

export function ToggleField() {
    this.defaultValue = false;
    this.valueProperty = 'checked';
    this.isEmpty = function (value) {
        return !value;
    };
}
