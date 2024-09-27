import { createContext, createElement, forwardRef, useContext, useEffect, useMemo, useRef, useState } from "react";
import { always, any, combineFn, createPrivateStore, define, defineGetterProperty, defineObservableProperty, definePrototype, each, equal, exclude, extend, grep, hasOwnProperty, is, isArray, isFunction, isPlainObject, isUndefinedOrNull, keys, makeArray, map, mapGet, mapRemove, noop, pick, pipe, randomId, resolve, resolveAll, sameValueZero, setImmediate, setImmediateOnce, single, throwNotFunction, throws, watch } from "zeta-dom/util";
import { ZetaEventContainer } from "zeta-dom/events";
import dom, { focus } from "zeta-dom/dom";
import { preventLeave } from "zeta-dom/domLock";
import { comparePosition, parentsAndSelf } from "zeta-dom/domUtil";
import { useObservableProperty, useUnloadEffect, useUpdateTrigger } from "./hooks.js";
import { combineRef } from "./util.js";
import { useViewState } from "./viewState.js";

const _ = createPrivateStore();
const emitter = new ZetaEventContainer();
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

function createHookHelper(effects) {
    var states = [];
    var push = function (callback, deps) {
        var i = effects.i++;
        states[i] = !deps || !states[i] || !equal(states[i][0], deps) ? [deps, callback()] : states[i];
        return states[i][1];
    };
    return {
        memo: push,
        callback: function (callback) {
            var ref = push(Object, []);
            ref.current = callback;
            return ref.cb || (ref.cb = function () {
                return ref.current.apply(this, arguments);
            });
        },
        effect: function (callback, deps) {
            push(function () {
                effects.push(throwNotFunction(callback));
            }, deps);
        }
    };
}

function isEmpty(value) {
    return isUndefinedOrNull(value) || value === '' || (isArray(value) && !value.length);
}

function hasImplicitError(field) {
    return field.props.required && field.isEmpty(field.value);
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
    var path = name ? [name] : [];
    for (var key = keyFor(obj); key = paths[key]; key = key.slice(0, 8)) {
        path.unshift(key.slice(9));
    }
    return resolvePathInfo(form, path)[name ? 'parent' : 'value'] === obj ? path.join('.') : '';
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
            return v.version && (v.props.validateOnChange + 1 || form.validateOnChange + 1) > 1;
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
                v.onChange(v.value, true);
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
    var onChange = function (p, field, oldValue) {
        var path = getPath(context, proxy, p);
        if (path) {
            if (field) {
                var value = field.normalizeValue(target[p]);
                if (!sameValueZero(value, target[p])) {
                    setValue(p, value);
                }
                if (!sameValueZero(field.value, value)) {
                    field.value = value;
                    field.version++;
                }
                if (value === oldValue) {
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
            if ((_(v) || '').state !== state) {
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
            if (typeof p === 'string' && (!sameValueZero(t[p], v) || !(p in t))) {
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
                    onChange(p, state.fields[uniqueId + '.' + p], prev);
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
        state,
        uniqueId,
        set: setValue,
        delete: deleteValue
    });
    for (var i in initialData) {
        setValue(i, initialData[i]);
    }
    return proxy;
}

function createFieldState(initialValue) {
    var field = {
        version: 0,
        initialValue: initialValue,
        error: '',
        preset: {},
        onChange: function (v, committed) {
            if (!field.controlled || committed) {
                field.version++;
            }
            if (field.props.onChange && (!field.controlled || !committed)) {
                field.props.onChange(cloneValue(v));
            }
        },
        setValue: function (v) {
            v = isFunction(v) ? v(field.value) : v;
            if (!field.controlled) {
                field.dict[field.name] = v;
            } else if (!sameValueZero(v, field.value)) {
                field.onChange(v);
            }
        },
        setError: function (v) {
            field.error = isFunction(v) ? v(field.error) : v;
            (field.form || {}).isValid = null;
        },
        validate: function () {
            return validateFields(field.form, [field]);
        },
        isEmpty: function (value) {
            return (field.props.isEmpty || (field.preset.isEmpty || isEmpty).bind(field.preset))(value);
        },
        normalizeValue: function (value) {
            return (field.preset.normalizeValue || pipe).call(field.preset, value, field.props);
        },
        elementRef: function (v) {
            field.element = v;
        }
    };
    watch(field, true);
    defineObservableProperty(field, 'error', '', function (v) {
        return isFunction(v) || is(v, ValidationError) ? wrapErrorResult(field, v) : v || '';
    });
    watch(field, 'error', function (v) {
        if (field.form) {
            emitter.emit('validationChange', field.form, {
                name: field.path,
                isValid: !v,
                message: String(v)
            });
        }
    });
    defineGetterProperty(field.elementRef, 'current', function () {
        return field.element || null;
    });
    return field;
}

function useFormFieldInternal(state, field, preset, props, controlled, dict, name) {
    var form = state.form === rootForm ? null : state.form;
    var key = name ? keyFor(dict) + '.' + name : state.paths[keyFor(dict)];
    var shouldReset = field.key !== key;
    extend(field, {
        form: form,
        props: props,
        preset: preset,
        controlled: controlled,
        dict: dict,
        key: key,
        name: name,
        path: form ? getPath(form, dict, name) : '',
        error: 'error' in props ? props.error : shouldReset ? '' : field.error,
        locks: shouldReset ? [] : field.locks
    });
    var setValid = form ? state.setValid : noop;
    state.fields[key] = field;
    useEffect(function () {
        state.fields[key] = field;
        return function () {
            if (state.fields[key] === field) {
                delete state.fields[key];
                if (field.props.clearWhenUnmount || !form) {
                    setImmediate(function () {
                        if (!state.fields[key]) {
                            delete dict[name];
                        }
                    });
                }
                setValid();
            }
        };
    }, [state, field, key]);
    useEffect(function () {
        setValid();
    }, [state, field.error, props.disabled, props.required]);
}

function validateFields(form, fields) {
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
        var state = _(form);
        if (state) {
            state.setValid();
        }
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
        form: self,
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
                return (v.error && (key & 1)) || (v.isEmpty(v.value) && (key & 2)) ? v.element : null;
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
        data = data || state.initialData;
        for (var i in data) {
            dict.set(i, data[i]);
        }
        each(state.fields, function (i, v) {
            var prop = resolvePathInfo(self, v.path);
            if (v.controlled) {
                v.onChange(prop.exists ? prop.value : v.initialValue);
            } else if (prop.exists) {
                v.value = prop.value;
                v.version = 0;
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
        return errorFields[0] ? errorFields.reduce(function (v, a) {
            v[a.path] = String(a.error);
            return v;
        }, {}) : null;
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
        if (!prefix.length) {
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
    useUnloadEffect(function () {
        (_(form).unlock || noop)();
        if (form.autoPersist) {
            formPersist(form);
        }
    });
    useEffect(function () {
        if (mapRemove(changedProps, form)) {
            forceUpdate();
        }
        return form.on({
            dataChange: forceUpdate,
            reset: forceUpdate
        });
    }, [form]);
    return form;
}

export function useFormField(type, props, defaultValue, prop) {
    if (typeof type === 'string') {
        type = fieldTypes[type];
    } else if (!isFunction(type)) {
        prop = defaultValue;
        defaultValue = props;
        props = type;
        type = '';
    }
    const uniqueId = useState(randomId)[0];
    const context = useContext(FormObjectContext);
    const effects = useState([])[0];
    const hook = useMemo(function () {
        return type ? [new type(), createHookHelper(effects)] : [{}];
    }, [type]);
    const preset = hook[0];
    prop = prop || preset.valueProperty || 'value';

    var dict = context;
    var name = props.name;
    if (!dict || !name) {
        dict = rootForm.data;
        name = uniqueId;
    }
    const existing = name in dict;
    const controlled = prop in props;
    const field = useState(function () {
        return createFieldState(controlled ? props[prop] : defaultValue !== undefined ? defaultValue : preset.defaultValue);
    })[0];
    const previousKey = field.key;
    useFormFieldInternal(_(dict).state, field, preset, props, controlled, dict, name);

    var value = controlled ? props[prop] : existing ? dict[name] : field.initialValue;
    if (previousKey !== field.key) {
        value = field.normalizeValue(value);
    }
    if (!existing && field.isEmpty(value)) {
        _(dict).set(name, value);
    } else {
        dict[name] = value;
    }
    field.value = dict[name];
    if (!existing) {
        field.version = 0;
    }
    effects.i = 0;
    effects.splice(0);
    useEffect(function () {
        combineFn(effects)();
    });
    useObservableProperty(field, 'error');
    useObservableProperty(field, 'version');
    return (preset.postHook || pipe).call(preset, {
        form: context && _(context).state.form,
        key: field.form ? field.key : '',
        path: field.path,
        value: field.value,
        error: String(field.error),
        version: field.version,
        setValue: field.setValue,
        setError: field.setError,
        validate: field.validate,
        elementRef: field.elementRef
    }, props, hook[1]);
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
    var value = props.value;
    if ((_(value) || '').state) {
        dict = value;
        name = '';
    } else if (name) {
        value = 'value' in props ? value : isPlainObject(dict[name]) || isArray(dict[name]) || props.defaultValue || {};
        value = _(dict).set(name, value);
    } else {
        throws('Value must be a data object or array');
    }
    // field state registered by useFormField has a higher priority
    // create own field state only when needed
    var state = _(dict).state;
    var field = state.fields[state.paths[keyFor(value)]];
    if (!field || field.controlled === 0) {
        field = fieldRef.current || (fieldRef.current = createFieldState(value));
        useFormFieldInternal(state, field, {}, props, 0, dict, name);
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

export function HiddenField(props) {
    useFormField(props, props.value);
    return null;
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
