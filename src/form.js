import { createContext, createElement, forwardRef, useContext, useEffect, useMemo, useRef, useState } from "react";
import { always, any, combineFn, createPrivateStore, define, defineObservableProperty, definePrototype, each, either, exclude, extend, grep, hasOwnProperty, isArray, isFunction, isPlainObject, isUndefinedOrNull, keys, makeArray, map, mapGet, mapRemove, noop, pick, pipe, randomId, reject, resolve, resolveAll, setImmediateOnce, splice, throws, values, watch } from "./include/zeta-dom/util.js";
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

/** @type {React.Context<any>} */
const FormObjectContext = createContext(null);
const FormObjectProvider = FormObjectContext.Provider;

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
        emitter.emit('dataChange', form, keys(props));
        if (form.validateOnChange) {
            validateFields(form, grep(state.fields, function (v) {
                return props[v.path] && v.props.validateOnChange !== false;
            }));
        }
        if (form.preventLeave && !state.unlock) {
            var promise = new Promise(function (resolve) {
                state.unlock = function () {
                    state.unlock = null;
                    resolve();
                };
            });
            preventLeave(state.ref || dom.root, promise, function () {
                return emitter.emit('beforeLeave', form) || reject();
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
    var onChange = function (p) {
        var path = getPath(context, proxy, p);
        if (path) {
            // ensure field associated with parent data object got notified
            for (var key = uniqueId; key = state.paths[key]; key = key.slice(0, 8)) {
                if (state.fields[key]) {
                    handleDataChange.d.add(state.fields[key]);
                }
            }
            mapGet(changedProps, context, Object)[path] = true;
            setImmediateOnce(emitDataChangeEvent);
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
                    var field = state.fields[uniqueId + '.' + p];
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
                    v = setValue(p, v);
                    if (onChange(p) && field) {
                        field.value = v;
                        handleDataChange.d.add(field);
                    }
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
            if (field.controlled) {
                field.onChange(v);
            } else {
                field.value = v;
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
        return function () {
            if (state && state.fields[key] === field) {
                delete state.fields[key];
                if (field.props.clearWhenUnmount) {
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
    var imlicitErrors = map(fields, hasImplicitError);
    var validate = function (field) {
        var name = field.path;
        var value = field.value;
        return emitter.emit('validate', form, { name, value }) || ((field.props || '').onValidate || noop)(value, name, form);
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
            result[i] = result[i] || imlicitErrors[i];
        });
        state.setValid();
        return !any(result);
    });
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
    };
    self.isValid = true;
    self.data = createDataObject(self, viewState.get() || state.initialData);
}

definePrototype(FormContext, {
    element: function (key) {
        return (getField(this, key) || '').element;
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

    const dict = useContext(FormObjectContext);
    const form = dict && _(dict).context;
    const state = form && _(form);
    const name = props.name || '';
    const key = form && name && (keyFor(dict) + '.' + name);
    const controlled = prop in props;

    const field = useState(function () {
        var initialValue = controlled ? props[prop] : (preset.normalizeValue || pipe)(form && name in dict ? dict[name] : defaultValue !== undefined ? defaultValue : preset.defaultValue);
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
    extend(form, pick(props, ['enterKeyHint', 'preventLeave']));
    return createElement(FormObjectProvider, { value: form.data },
        createElement('form', extend(exclude(props, ['context', 'enterKeyHint', 'preventLeave']), { ref: combineRef(ref, form.ref), onSubmit, onReset })));
});

export function FormContextProvider(props) {
    return createElement(FormObjectProvider, { value: props.value.data }, props.children);
}

export function FormArray(props) {
    return FormObject(extend({}, props, { defaultValue: [] }));
}

export function FormObject(props) {
    var dict = useContext(FormObjectContext);
    if (!_(dict)) {
        throws('Missing form context');
    }
    var fieldRef = useRef();
    var form = _(dict).context;
    var state = _(form);
    var name = props.name;
    var value = props.value;
    if (name) {
        value = isPlainObject(dict[name]) || isArray(dict[name]) || props.defaultValue || {};
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
