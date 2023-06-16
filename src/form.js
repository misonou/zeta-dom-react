import { createContext, createElement, forwardRef, useContext, useEffect, useRef, useState } from "react";
import { always, any, combineFn, createPrivateStore, define, defineObservableProperty, definePrototype, each, exclude, extend, grep, hasOwnProperty, is, isArray, isFunction, isPlainObject, isUndefinedOrNull, keys, makeArray, map, mapGet, mapRemove, noop, pick, pipe, randomId, resolve, resolveAll, setImmediateOnce, single, throws, watch } from "./include/zeta-dom/util.js";
import { ZetaEventContainer } from "./include/zeta-dom/events.js";
import dom, { focus } from "./include/zeta-dom/dom.js";
import { preventLeave } from "./include/zeta-dom/domLock.js";
import { bind, comparePosition, parentsAndSelf } from "./include/zeta-dom/domUtil.js";
import { useObservableProperty, useUpdateTrigger } from "./hooks.js";
import { combineRef } from "./util.js";
import { useViewState } from "./viewState.js";

const _ = createPrivateStore();
const emitter = new ZetaEventContainer();
const presets = new WeakMap();
const instances = new WeakMap();
const changedProps = new Map();
const rootForm = new FormContext({}, {}, { get: noop });
const fieldTypes = {
    text: TextField,
    toggle: ToggleField,
    choice: ChoiceField
};

/** @type {React.Context<any>} */
const FormObjectContext = createContext(null);
const FormObjectProvider = FormObjectContext.Provider;

export function ValidationError(kind, message, args) {
    this.kind = kind;
    this.args = args;
    this.message = message;
}

function isEmpty(value) {
    return isUndefinedOrNull(value) || value === '' || (isArray(value) && !value.length);
}

function hasImplicitError(field) {
    return field.props.required && (field.props.isEmpty || field.preset.isEmpty || isEmpty)(field.value);
}

function cloneValue(value) {
    return _(value) ? extend(true, isArray(value) ? [] : {}, value) : value;
}

function keyFor(value) {
    return (_(value) || '').uniqueId;
}

function resolvePathInfo(form, path) {
    var arr = isArray(path) || path.split('.');
    var value = form.data;
    var parent = value;
    for (var i = 0, len = arr.length; i < len; i++) {
        if (!hasOwnProperty(value, arr[i])) {
            return {
                name: arr[len - 1],
                parent: i === len - 1 ? value : null
            };
        }
        parent = value;
        value = value[arr[i]];
    }
    return {
        exists: true,
        name: arr[len - 1],
        value: value,
        parent: parent
    };
}

function getField(form, path) {
    var prop = resolvePathInfo(form, path);
    var key = keyFor(prop.parent);
    return key && _(form).fields[key + '.' + prop.name];
}

function getPath(form, obj, name) {
    if (obj === form.data) {
        return name;
    }
    var paths = _(form).paths;
    var path = [name];
    for (var key = keyFor(obj); key = paths[key]; key = key.slice(0, 8)) {
        path.unshift(key.slice(9));
    }
    return resolvePathInfo(form, path).parent === obj ? path.join('.') : '';
}

function emitDataChangeEvent() {
    each(changedProps, function (form) {
        var state = _(form);
        var props = mapRemove(changedProps, form);
        for (var i in props) {
            while (i = i.replace(/(^|\.)[^.]+$/, '')) {
                props[i] = true;
            }
        }
        var element = state.ref || dom.root;
        var updatedFields = grep(state.fields, function (v) {
            return props[v.path];
        });
        emitter.emit('dataChange', form, keys(props));
        validateFields(form, grep(updatedFields, function (v) {
            return (v.props.validateOnChange + 1 || form.validateOnChange + 1) > 1;
        }));
        if (form.preventLeave && !state.unlock && updatedFields[0] && dom.getEventSource(element) !== 'script') {
            var promise = new Promise(function (resolve) {
                state.unlock = function () {
                    state.unlock = null;
                    resolve();
                };
            });
            preventLeave(element, promise, function () {
                return emitter.emit('beforeLeave', form) || resolve();
            });
        }
    });
}

function handleDataChange(callback) {
    var local;
    var map = handleDataChange.d || (handleDataChange.d = local = new Set());
    try {
        callback();
    } finally {
        if (map === local) {
            each(local, function (i, v) {
                v.onChange(v.value);
            });
            handleDataChange.d = null;
        }
    }
}
handleDataChange.d = null;

function createDataObject(context, initialData) {
    var state = _(context);
    var target = isArray(initialData) ? [] : {};
    var uniqueId = randomId();
    var onChange = function (p, field) {
        var path = getPath(context, proxy, p);
        if (path) {
            if (field) {
                field.value = target[p];
                if (field.value !== target[p]) {
                    setValue(p, field.value);
                    return;
                }
                handleDataChange.d.add(field);
            }
            // ensure field associated with parent data object got notified
            for (var key = uniqueId; key = state.paths[key]; key = key.slice(0, 8)) {
                if (state.fields[key]) {
                    handleDataChange.d.add(state.fields[key]);
                }
            }
            if (context !== rootForm) {
                mapGet(changedProps, context, Object)[path] = true;
                setImmediateOnce(emitDataChangeEvent);
            }
            return true;
        }
    };
    var setValue = function (p, v) {
        if (isPlainObject(v) || isArray(v)) {
            // ensure changes to nested data objects
            // emits data change event to correct form context
            if ((_(v) || '').context !== context) {
                v = createDataObject(context, v);
            }
            state.paths[keyFor(v)] = uniqueId + '.' + p;
        }
        target[p] = v;
        return v;
    };
    var deleteValue = function (p) {
        delete target[p];
    };
    var proxy = new Proxy(target, {
        set: function (t, p, v) {
            if (typeof p === 'string' && (t[p] !== v || !(p in t))) {
                handleDataChange(function () {
                    var prev = t[p];
                    if (isArray(t)) {
                        if (p === 'length') {
                            // check for truncated indexes that would be deleted without calling the trap
                            for (var index = prev - 1; index >= v; index--) {
                                onChange(index);
                            }
                            t[p] = v;
                            return true;
                        }
                    } else {
                        if (_(v)) {
                            throws("Cannot assign proxied data object");
                        }
                        // apply changes to existing object or array when assigning new object or array
                        // so that fields of the same path can have consistent key and state
                        if (isArray(v) && isArray(prev)) {
                            prev.splice.apply(prev, [0, prev.length].concat(v));
                            return true;
                        }
                        if (isPlainObject(v) && _(prev)) {
                            for (var i in exclude(prev, v)) {
                                delete prev[i];
                            }
                            extend(prev, v);
                            return true;
                        }
                    }
                    setValue(p, v);
                    onChange(p, state.fields[uniqueId + '.' + p]);
                });
            }
            return true;
        },
        deleteProperty: function (t, p) {
            if (typeof p === 'string' && p in t) {
                handleDataChange(function () {
                    deleteValue(p);
                    onChange(p);
                });
            }
            return true;
        }
    });
    _(proxy, {
        context,
        uniqueId,
        set: setValue,
        delete: deleteValue
    });
    each(initialData, function (i, v) {
        setValue(i, v);
    });
    return proxy;
}

function createFieldState(initialValue) {
    var field = {
        initialValue: initialValue,
        value: initialValue,
        error: '',
        preset: {},
        onChange: function (v) {
            if (field.props.onChange) {
                field.props.onChange(cloneValue(v));
            }
        },
        setValue: function (v) {
            v = isFunction(v) ? v(field.value) : v;
            if (!field.controlled) {
                field.value = v;
            } else if (v !== field.value) {
                field.onChange(v);
            }
        },
        setError: function (v) {
            field.error = isFunction(v) ? v(field.error) : v;
            (field.form || {}).isValid = null;
        },
        elementRef: function (v) {
            field.element = v;
        }
    };
    watch(field, true);
    defineObservableProperty(field, 'value', initialValue, function (newValue, oldValue) {
        newValue = (field.preset.normalizeValue || pipe)(newValue, field.props);
        if (newValue !== oldValue && _(oldValue)) {
            field.dict[field.name] = newValue;
            return oldValue;
        }
        return newValue;
    });
    defineObservableProperty(field, 'error', '', function (v) {
        return isFunction(v) || is(v, ValidationError) ? wrapErrorResult(field, v) : v || '';
    });
    watch(field, 'value', function (v) {
        if (field.key) {
            field.dict[field.name] = v;
        } else if (!field.controlled) {
            field.onChange(v);
        }
    });
    watch(field, 'error', function (v) {
        if (field.key) {
            emitter.emit('validationChange', field.form, {
                name: field.path,
                isValid: !v,
                message: String(v)
            });
        }
    });
    return field;
}

function useFormFieldInternal(form, state, field, preset, props, controlled, dict, key) {
    var hasErrorProp = 'error' in props;
    var prevKey = field.key || key;
    extend(field, { form, props, preset, controlled, dict, key });
    if (form && key) {
        field.name = key.slice(9);
        field.path = getPath(form, dict, field.name);
        if (prevKey !== key) {
            field.locks = [];
            if (!hasErrorProp) {
                field.error = '';
            }
        }
        state.fields[key] = field;
    }
    if (hasErrorProp) {
        field.error = props.error;
    }
    useEffect(function () {
        if (form && key) {
            state.fields[key] = field;
        }
        return function () {
            if (state && state.fields[key] === field) {
                delete state.fields[key];
                if (field.props.clearWhenUnmount || field.form === rootForm) {
                    _(dict).delete(key.slice(9));
                }
                state.setValid();
            }
        };
    }, [state, field, key]);
    useEffect(function () {
        if (state) {
            state.setValid();
        }
    }, [state, field.error, props.disabled, props.required]);
}

function validateFields(form, fields) {
    var state = _(form);
    var validate = function (field) {
        var name = field.path;
        var value = field.value;
        var result = emitter.emit('validate', form, { name, value });
        if (result || !field.props) {
            return result;
        }
        return (field.props.onValidate || noop)(value, name, form) || (hasImplicitError(field) && new ValidationError('required', 'Required'));
    };
    var promises = fields.map(function (v) {
        var locks = v.locks || (v.locks = []);
        var prev = locks[0];
        if (prev) {
            // debounce async validation
            return locks[1] || (locks[1] = always(locks[0], function () {
                var next = validate(v);
                always(next, function () {
                    // dismiss effects of previous validation if later one resolves earlier
                    // so that validity always reflects on latest data
                    if (locks[0] === prev) {
                        locks.shift();
                    }
                });
                return next;
            }));
        }
        locks[0] = resolve(validate(v));
        return locks[0];
    });
    return resolveAll(promises).then(function (result) {
        fields.forEach(function (v, i) {
            // checks if current validation is of the latest
            if (v.locks[0] === promises[i]) {
                v.locks.shift();
                v.error = result[i];
            }
        });
        state.setValid();
        return !any(result);
    });
}

function wrapErrorResult(field, error) {
    return {
        toString: function () {
            if (is(error, ValidationError)) {
                return single([field.props, field.form || '', FormContext], function (v) {
                    return (v.formatError || noop).call(v, error, field.path || null, field.props, field.form);
                }) || error.message;
            }
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

function formPersist(form) {
    _(form).viewState.set(form.toJSON());
}

export function FormContext(initialData, options, viewState) {
    if (isFunction(initialData)) {
        initialData = initialData();
    }
    var self = this;
    var fields = {};
    var state = _(self, {
        fields: fields,
        viewState: viewState,
        paths: {},
        initialData: initialData,
        setValid: defineObservableProperty(this, 'isValid', true, function () {
            return !any(fields, function (v) {
                return !v.props.disabled && (v.error || hasImplicitError(v));
            });
        })
    });
    extend(self, normalizeOptions(options));
    self.ref = function (element) {
        state.ref = element;
        if (element) {
            instances.set(element, self);
        }
    };
    self.isValid = true;
    self.data = createDataObject(self, viewState.get() || state.initialData);
}

define(FormContext, {
    ERROR_FIELD: 1,
    EMPTY_FIELD: 2,
    get: function (element) {
        return single(parentsAndSelf(element), instances.get.bind(instances)) || null;
    }
});

definePrototype(FormContext, {
    element: function (key) {
        return key ? (getField(this, key) || '').element : _(this).ref;
    },
    focus: function (key) {
        var element;
        if (typeof key === 'number') {
            element = map(_(this).fields, function (v) {
                return (v.error && (key & 1)) || (isEmpty(v.value) && (key & 2)) ? v.element : null;
            }).sort(comparePosition)[0];
        } else {
            element = this.element(key);
        }
        return !!element && focus(element);
    },
    on: function (event, handler) {
        return emitter.add(this, event, handler);
    },
    persist: function () {
        formPersist(this);
        this.autoPersist = false;
    },
    restore: function () {
        var self = this;
        var data = _(self).viewState.get();
        if (data) {
            self.reset(data);
        }
        return !!data;
    },
    clear: function () {
        this.reset({});
    },
    reset: function (data) {
        var self = this;
        var state = _(self);
        var dict = _(self.data);
        for (var i in self.data) {
            dict.delete(i);
        }
        each(data || state.initialData, function (i, v) {
            dict.set(i, v);
        });
        each(state.fields, function (i, v) {
            var prop = resolvePathInfo(self, v.path);
            if (v.controlled) {
                v.onChange(prop.exists ? prop.value : v.initialValue);
            } else if (prop.exists) {
                v.value = prop.value;
            }
            v.error = null;
        });
        state.setValid();
        (state.unlock || noop)();
        emitter.emit('reset', self);
    },
    getValue: function (key) {
        return cloneValue(resolvePathInfo(this, key).value);
    },
    setValue: function (key, value) {
        var prop = resolvePathInfo(this, key);
        if (prop.parent) {
            prop.parent[prop.name] = cloneValue(value);
        }
    },
    getErrors: function () {
        var errorFields = grep(_(this).fields, function (v) {
            return v.error;
        });
        return errorFields[0] ? Object.fromEntries(errorFields.map(function (v) {
            return [v.path, String(v.error)];
        })) : null;
    },
    getError: function (key) {
        return String((getField(this, key) || '').error || '');
    },
    setError: function (key, error) {
        (getField(this, key) || {}).error = error;
    },
    validate: function () {
        var self = this;
        var fields = _(self).fields;
        var prefix = makeArray(arguments);
        if (!prefix[0]) {
            return validateFields(self, grep(fields, function (v) {
                return !v.props.disabled;
            }));
        }
        return validateFields(self, grep(fields, function (v) {
            return any(prefix, function (w) {
                var len = w.length;
                return v.path.slice(0, len) === w && (!v.path[len] || v.path[len] === '.');
            });
        }));
    },
    toJSON: function () {
        return extend(true, {}, this.data);
    }
});

defineObservableProperty(FormContext.prototype, 'preventLeave', false, function (value) {
    if (!value) {
        (_(this).unlock || noop)();
    }
    return !!value;
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
            bind(window, 'pagehide', function () {
                if (form.autoPersist) {
                    formPersist(form);
                }
            }),
            function () {
                (_(form).unlock || noop)();
                if (form.autoPersist) {
                    formPersist(form);
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

    const dict = useContext(FormObjectContext);
    const form = dict && _(dict).context;
    const state = form && _(form);
    const name = props.name || '';
    const key = form && name && (keyFor(dict) + '.' + name);
    const controlled = prop in props;

    const field = useState(function () {
        var initialValue = controlled ? props[prop] : (preset.normalizeValue || pipe)(defaultValue !== undefined ? defaultValue : preset.defaultValue);
        return createFieldState(initialValue);
    })[0];
    useFormFieldInternal(form, state, field, preset, props, controlled, dict, key);
    if (controlled) {
        field.value = props[prop];
    }
    if (form && key) {
        if (!(name in dict)) {
            field.value = _(dict).set(name, field.initialValue);
        } else if (!controlled) {
            field.value = dict[name];
        }
    }
    const state1 = (preset.postHook || pipe)({
        form: form,
        key: key,
        path: field.path,
        value: field.value,
        error: String(field.error),
        setValue: field.setValue,
        setError: field.setError,
        elementRef: field.elementRef
    }, props);
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
    extend(form, pick(props, ['enterKeyHint', 'preventLeave', 'formatError']));
    return createElement(FormObjectProvider, { value: form.data },
        createElement('form', extend(exclude(props, ['context', 'enterKeyHint', 'preventLeave', 'formatError']), { ref: combineRef(ref, form.ref), onSubmit, onReset })));
});

export function FormContextProvider(props) {
    return createElement(FormObjectProvider, { value: props.value.data }, props.children);
}

export function FormArray(props) {
    return FormObject(extend({}, props, { defaultValue: [] }));
}

export function FormObject(props) {
    var uniqueId = useState(randomId)[0];
    var name = props.name;
    var dict = useContext(FormObjectContext);
    if (!dict) {
        dict = rootForm.data;
        name = uniqueId;
    }
    var fieldRef = useRef();
    var form = _(dict).context;
    var state = _(form);
    var value = props.value;
    if (name) {
        value = 'value' in props ? value : isPlainObject(dict[name]) || isArray(dict[name]) || props.defaultValue || {};
        value = _(dict).set(name, value);
    } else if (!(_(value) || '').context) {
        throws('Value must be a data object or array');
    }
    // field state registered by useFormField has a higher priority
    // create own field state only when needed
    var key = state.paths[keyFor(value)];
    if (typeof (state.fields[key] || '').controlled !== 'boolean') {
        var field = fieldRef.current || (fieldRef.current = createFieldState(value));
        useFormFieldInternal(form, state, field, {}, props, 0, dict, key);
        field.value = value;
    } else {
        useEffect(noop, [null]);
        useEffect(noop, [null]);
    }
    var children = props.children;
    if (isFunction(children)) {
        children = children(value);
    }
    return createElement(FormObjectProvider, { value }, children);
}

define(FormObject, { keyFor });

import ChoiceField from "./fields/ChoiceField.js";
import DateField from "./fields/DateField.js";
import MultiChoiceField from "./fields/MultiChoiceField.js";
import NumericField from "./fields/NumericField.js";
import TextField from "./fields/TextField.js";
import ToggleField from "./fields/ToggleField.js";

export {
    ChoiceField,
    DateField,
    MultiChoiceField,
    NumericField,
    TextField,
    ToggleField
}
