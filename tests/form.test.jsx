import React, { createRef, useEffect, useRef, useState } from "react";
import { act as renderAct, render } from "@testing-library/react";
import { act, renderHook } from '@testing-library/react-hooks'
import { ViewStateProvider } from "src/viewState";
import { ChoiceField, combineValidators, Form, FormContext, FormContextProvider, MultiChoiceField, TextField, ToggleField, useFormContext, useFormField } from "src/form";
import { delay, mockFn, verifyCalls } from "@misonou/test-utils";
import dom from "zeta-dom/dom";
import { cancelLock, locked } from "zeta-dom/domLock";
import { catchAsync, combineFn, setImmediate } from "zeta-dom/util";

function createFormContext(initialData, validateOnChange) {
    const { result: { current: form }, unmount } = renderHook(() => useFormContext(initialData, validateOnChange));
    return {
        form,
        unmount,
        wrapper: ({ children }) => (
            <FormContextProvider value={form}>{children}</FormContextProvider>
        )
    };
}

function createFormComponent(children) {
    /** @type FormContext */
    let form;
    let dataChange = mockFn();
    let beforeLeave = mockFn();
    let Component = React.forwardRef(function ({ initialData, options }, ref) {
        form = useFormContext(initialData, options);
        useEffect(() => {
            return combineFn(
                form.on('dataChange', dataChange),
                form.on('beforeLeave', beforeLeave),
            );
        }, []);
        return (
            <Form ref={ref} context={form} {...options.__formAttributes}>
                {children && children(form)}
            </Form>
        );
    });
    return function (initialData, options) {
        const ref = React.createRef();
        const result = render(<Component ref={ref} initialData={initialData} options={options || {}} />);
        return { ...result, form, dataChange, beforeLeave, formElement: ref.current };
    };
}

function Field(props) {
    useFormField(props, '');
    return <></>;
}

describe('useFormContext', () => {
    it('should cause re-render when data has changed', async () => {
        const renderForm = createFormComponent((form) => (
            <div>{form.data.foo}</div>
        ));
        const { form, getByText, findByText } = renderForm({ foo: 'bar' });
        getByText('bar');

        await renderAct(async () => {
            form.data.foo = 'baz';
        });
        await findByText('baz');
    });

    it('should cause re-render when isValid state has changed', async () => {
        const renderForm = createFormComponent((form) => (
            <div>
                <Field name="foo" onValidate={() => 'error'} />
                <div>{form.isValid ? 'valid' : 'invalid'}</div>
            </div>
        ));
        const { form, getByText, findByText } = renderForm();
        getByText('valid');

        await renderAct(async () => {
            form.data.foo = 'bar';
        });
        await findByText('invalid');
    });

    it('should cause re-render when reset', async () => {
        const renderForm = createFormComponent((form) => (
            <div>
                <Field name="foo" />
                <div>{form.data.foo}</div>
            </div>
        ));
        const { form, findByText } = renderForm({ foo: 'bar' });
        await renderAct(async () => {
            form.data.foo = 'baz';
        });
        await findByText('baz');

        renderAct(() => form.reset());
        await findByText('bar');
    });

    it('should trigger validation for updated fields if validateOnChange is set to true', async () => {
        const cb = mockFn();
        const { form, wrapper, unmount } = createFormContext();
        renderHook(() => [
            useFormField({ name: 'foo', onValidate: cb }, 'foo'),
            useFormField({ name: 'baz', onValidate: cb }, 'baz'),
        ], { wrapper });

        expect(form.validateOnChange).toBe(true);
        await act(async () => {
            form.data.foo = 'bar';
        });
        verifyCalls(cb, [
            ['bar', 'foo', form],
        ]);
        unmount();
    });

    it('should not trigger validation for updated fields if the field has validateOnChange set to false', async () => {
        const cb = mockFn();
        const { form, wrapper, unmount } = createFormContext();
        renderHook(() => [
            useFormField({ name: 'foo', onValidate: cb, validateOnChange: false }, 'foo'),
            useFormField({ name: 'baz', onValidate: cb }, 'baz'),
        ], { wrapper });

        expect(form.validateOnChange).toBe(true);
        await act(async () => {
            form.data.foo = 'bar';
        });
        expect(cb).not.toBeCalled();
        unmount();
    });

    it('should not trigger validation for updated fields if validateOnChange is set to false', async () => {
        const cb = mockFn();
        const { form, wrapper, unmount } = createFormContext({}, false);
        renderHook(() => [
            useFormField({ name: 'foo', onValidate: cb }, 'foo'),
            useFormField({ name: 'baz', onValidate: cb }, 'baz'),
        ], { wrapper });

        expect(form.validateOnChange).toBe(false);
        await act(async () => {
            form.data.foo = 'bar';
        });
        expect(cb).not.toBeCalled();
        unmount();
    });

    it('should initiate form with persisted data from view state provider', async () => {
        const getState = mockFn().mockReturnValue({
            get() { return { foo: 2, baz: 'baz' } },
            set() { }
        });
        const { result, unmount } = renderHook(() => useFormContext('persist', { foo: 1, bar: 0 }), {
            wrapper: ({ children }) => (
                <ViewStateProvider value={{ getState }}>{children}</ViewStateProvider>
            )
        });
        expect(result.current.data).toEqual({ foo: 2, baz: 'baz' });
        expect(getState).toBeCalledTimes(1);
        expect(getState.mock.calls[0][1]).toBe('persist');
        unmount();
    });

    it('should persist form data when unmount when autoPersist is true', async () => {
        const viewState = {
            get: mockFn(),
            set: mockFn(),
        };
        const { result, unmount } = renderHook(() => useFormContext('persist', { foo: 1 }), {
            wrapper: ({ children }) => (
                <ViewStateProvider value={{ getState: () => viewState }}>{children}</ViewStateProvider>
            )
        });
        await act(async () => {
            Object.assign(result.current.data, { foo: 2, baz: 'baz' });
        });
        unmount();
        expect(viewState.set).toBeCalledTimes(1);
        expect(viewState.set.mock.calls[0][0]).toEqual({ foo: 2, baz: 'baz' });
        expect(viewState.set.mock.calls[0][0]).not.toBe(result.current.data);
    });

    it('should not persist form data when unmount when autoPersist is false', async () => {
        const viewState = {
            get: mockFn(),
            set: mockFn(),
        };
        const { unmount } = renderHook(() => useFormContext('persist', { foo: 1 }, { autoPersist: false }), {
            wrapper: ({ children }) => (
                <ViewStateProvider value={{ getState: () => viewState }}>{children}</ViewStateProvider>
            )
        });
        unmount();
        expect(viewState.set).not.toBeCalled();
    });
});

describe('useFormField', () => {
    it('should set initial value to default value if value is not provided', () => {
        const { result } = renderHook(() => useFormField({}, 'foo'));
        expect(result.current.value).toBe('foo');
    });

    it('should set initial value if value property exists in props', () => {
        const { result } = renderHook(() => useFormField({ value: 'foo' }, ''));
        expect(result.current.value).toBe('foo');
    });

    it('should set initial value if specified property exists in props', () => {
        const { result } = renderHook(() => useFormField({ checked: true }, false, 'checked'));
        expect(result.current.value).toBe(true);
    });

    it('should set initial value from form context for named field', () => {
        const { result } = renderHook(() => useFormField({ name: 'foo' }, ''), {
            wrapper: ({ children }) => (
                <FormContextProvider value={useFormContext({ foo: 'bar' })}>{children}</FormContextProvider>
            )
        });
        expect(result.current.value).toBe('bar');
    });

    it('should set initial error to empty string', () => {
        const { result } = renderHook(() => useFormField({}, ''));
        expect(result.current.error).toBe('');
    });

    it('should set initial error if error property exists in props', () => {
        const { result } = renderHook(() => useFormField({ error: 'foo' }, ''));
        expect(result.current.error).toBe('foo');
    });

    it('should return setValue and setError callback', () => {
        const { result } = renderHook(() => useFormField({}, ''));
        expect(typeof result.current.setValue).toBe('function');
        expect(typeof result.current.setError).toBe('function');
    });

    it('should update value by setValue', () => {
        const { result } = renderHook(() => useFormField({}, ''));
        expect(result.current.value).toBe('');
        act(() => result.current.setValue('foo'));
        expect(result.current.value).toBe('foo');
    });

    it('should update error by setError', () => {
        const { result } = renderHook(() => useFormField({}, ''));
        expect(result.current.error).toBe('');
        act(() => result.current.setError('foo'));
        expect(result.current.error).toBe('foo');
    });

    it('should update value when value in form.data changed for named field', async () => {
        const { form, wrapper } = createFormContext();
        const { result } = renderHook(() => useFormField({ name: 'foo' }, ''), { wrapper });

        await act(async () => {
            form.data.foo = 'bar';
        });
        expect(result.current.value).toBe('bar');
    });

    it('should reset to initial value when value in form.data is deleted for named field', async () => {
        const { form, wrapper } = createFormContext();
        const { result } = renderHook(() => useFormField({ name: 'foo' }, ''), { wrapper });

        await act(async () => {
            form.data.foo = 'bar';
            delete form.data.foo;
        });
        expect(result.current.value).toBe('');
        expect(form.data.foo).toBe('');
    });

    it('should reset error state when it associates to another data path', async () => {
        const { wrapper, unmount } = createFormContext({});
        const { result, rerender } = renderHook(({ name }) => useFormField({ name }, ''), { wrapper, initialProps: { name: 'foo' } });
        act(() => result.current.setError('error'));
        expect(result.current.error).toBe('error');

        rerender({ name: 'bar' });
        expect(result.current.error).toBe('');
        unmount();
    });

    it('should call setValue callback with current value for controlled field', () => {
        const cb = mockFn();
        const { result } = renderHook(() => useFormField({ value: 'foo', onChange: () => { } }, ''));
        act(() => result.current.setValue(cb));
        verifyCalls(cb, [['foo']]);
    });

    it('should call onChange callback for controlled field', () => {
        let value = '';
        const cb = mockFn(v => (value = v));
        const { result } = renderHook(() => useFormField({ value, onChange: cb }, ''));
        act(() => result.current.setValue('foo'));
        verifyCalls(cb, [['foo']]);
    });

    it('should call onChange callback with value returned from setValue callback for controlled field', () => {
        let value = 'foo';
        const cb = mockFn(v => (value = v));
        const { result } = renderHook(() => useFormField({ value, onChange: cb }, ''));
        act(() => result.current.setValue(() => 'bar'));
        verifyCalls(cb, [['bar']]);
    });

    it('should call onChange callback for uncontrolled field', async () => {
        const cb = mockFn();
        const { wrapper, unmount } = createFormContext();
        const { result } = renderHook(() => useFormField({ name: 'foo', onChange: cb }, ''), { wrapper });
        await act(async () => result.current.setValue('foo'));
        verifyCalls(cb, [['foo']]);
        unmount();
    });

    it('should call onChange callback for uncontrolled field without form context', async () => {
        const cb = mockFn();
        const { result } = renderHook(() => useFormField({ name: 'foo', onChange: cb }, ''));
        await act(async () => result.current.setValue('foo'));
        verifyCalls(cb, [['foo']]);
    });

    it('should not overwrite changes through data object', async () => {
        const { form, wrapper, unmount } = createFormContext();
        const { result } = renderHook(() => useFormField({ name: 'foo' }, ''), { wrapper });
        await act(async () => {
            result.current.setValue('bar')
            form.data.foo = 'baz';
        });
        expect(form.data.foo).toBe('baz');
        unmount();
    });

    it('should not discard committed value due to rerender with hooks in controlled field', async () => {
        const cb = mockFn();
        const Field = function (props) {
            const { value, setValue } = useFormField(props, '');
            const [, setState] = useState(false);
            cb.mockImplementation(() => {
                setState(true);
                setValue('foo');
            });
            return (<div>{value}</div>);
        };
        const Component = function () {
            const value = useRef('');
            const [, setState] = useState(false);
            const onChange = (v) => {
                value.current = v;
                setImmediate(() => setState(true));
            };
            return (<Field value={value.current} onChange={onChange} />);
        }
        const { asFragment } = render(<Component />);
        await renderAct(async () => cb());
        expect(asFragment()).toMatchSnapshot();
    });

    it('should consider empty when value is undefined', async () => {
        const { form, wrapper, unmount } = createFormContext();
        renderHook(() => useFormField({ name: 'foo', required: true }, undefined), { wrapper });
        expect(form.isValid).toBe(false);
        unmount();
    });

    it('should consider empty when value is null', async () => {
        const { form, wrapper, unmount } = createFormContext();
        renderHook(() => useFormField({ name: 'foo', required: true }, null), { wrapper });
        expect(form.isValid).toBe(false);
        unmount();
    });

    it('should consider empty when value is an empty string', async () => {
        const { form, wrapper, unmount } = createFormContext();
        renderHook(() => useFormField({ name: 'foo', required: true }, ''), { wrapper });
        expect(form.isValid).toBe(false);
        unmount();
    });

    it('should consider empty when value is an empty array', async () => {
        const { form, wrapper, unmount } = createFormContext();
        renderHook(() => useFormField({ name: 'foo', required: true }, []), { wrapper });
        expect(form.isValid).toBe(false);
        unmount();
    });

    it('should not consider empty when value is false', async () => {
        const { form, wrapper, unmount } = createFormContext();
        renderHook(() => useFormField({ name: 'foo', required: true }, false), { wrapper });
        expect(form.isValid).toBe(true);
        unmount();
    });

    it('should not consider empty when value is 0', async () => {
        const { form, wrapper, unmount } = createFormContext();
        renderHook(() => useFormField({ name: 'foo', required: true }, 0), { wrapper });
        expect(form.isValid).toBe(true);
        unmount();
    });

    it('should invoke isEmpty callback with current value', async () => {
        const isEmpty = mockFn().mockReturnValueOnce(false);
        const { form, wrapper, unmount } = createFormContext();
        const { result } = renderHook(() => useFormField({ name: 'foo', required: true, isEmpty }, 0), { wrapper });
        expect(form.isValid).toBe(true);
        expect(isEmpty).toBeCalledWith(0);

        await act(async () => {
            isEmpty.mockReturnValue(true);
            form.data.foo = 'bar'
        });
        expect(form.isValid).toBe(false);
        expect(isEmpty).toBeCalledWith('bar');
        unmount();
    });

    it('should mark form as invalid when error is specified in props', async () => {
        const { form, wrapper, unmount } = createFormContext();
        const { rerender } = renderHook(({ error }) => useFormField({ name: 'foo', error }, 0), { wrapper });
        expect(form.isValid).toBe(true);

        rerender({ error: 'Error' });
        expect(form.isValid).toBe(false);

        rerender({ error: '' });
        expect(form.isValid).toBe(true);
        unmount();
    });

    it('should mark form as invalid when error is set by setError callback', async () => {
        const { form, wrapper, unmount } = createFormContext();
        const { result } = renderHook(() => useFormField({ name: 'foo' }, 0), { wrapper });
        expect(form.isValid).toBe(true);

        act(() => result.current.setError('Error'));
        expect(form.isValid).toBe(false);

        act(() => result.current.setError(''));
        expect(form.isValid).toBe(true);
        unmount();
    });

    it('should update form validity when unmounted', async () => {
        const { form, wrapper, unmount } = createFormContext();
        const { unmount: unmountField } = renderHook(() => useFormField({ name: 'foo', required: true }, ''), { wrapper });
        expect(form.isValid).toBe(false);

        unmountField();
        expect(form.isValid).toBe(true);
        unmount();
    });

    it('should delete form data when unmounted if clearWhenUnmount is true', async () => {
        const { form, wrapper, unmount } = createFormContext();
        const { unmount: unmountField } = renderHook(() => useFormField({ name: 'foo', clearWhenUnmount: true }, 'bar'), { wrapper });
        expect(form.data).toEqual({ foo: 'bar' });

        unmountField();
        expect(form.data).toEqual({});
        unmount();
    });

    it('should handle name change correctly', async () => {
        const { form, wrapper, unmount } = createFormContext({ foo: 'foo', bar: 'bar' });
        const { result, rerender } = renderHook(({ name }) => useFormField({ name }, 0), { wrapper, initialProps: { name: 'foo' } });
        expect(result.current.value).toBe('foo');

        rerender({ name: 'bar' });
        expect(result.current.value).toBe('bar');
        expect(form.data).toEqual({ foo: 'foo', bar: 'bar' });
        unmount();
    });
});

describe('useFormField - text', () => {
    it('should pass text input attributes as inputProps', () => {
        /** @type {import("src/form").TextInputAttributes} */
        const inputProps = {
            autoComplete: 'username',
            enterKeyHint: 'go',
            inputMode: 'email',
            maxLength: 10,
            placeholder: 'foo',
            type: 'email'
        };
        const { result } = renderHook(() => useFormField('text', { ...inputProps }, ''));
        expect(result.current.inputProps).toEqual(inputProps);
    });

    it('should get enterKeyHint value from form context', () => {
        const { wrapper, unmount } = createFormContext({}, { enterKeyHint: 'go' });
        const { result } = renderHook(() => useFormField('text', {}, ''), { wrapper });
        expect(result.current.inputProps.enterKeyHint).toBe('go');
        unmount();
    });

    it('should default autoComplete to current-password for password field', () => {
        const { result } = renderHook(() => useFormField('text', { type: 'password' }, ''));
        expect(result.current.inputProps.autoComplete).toBe('current-password');
    });

    it('should default value to empty string if not supplied', () => {
        const { result } = renderHook(() => useFormField(TextField, {}));
        expect(result.current.value).toBe('');
    });
});

describe('useFormField - choice', () => {
    it('should return normalized items', () => {
        const items = [
            'foo',
            { value: 'bar', label: 'bar' }
        ];
        const { result } = renderHook(() => useFormField('choice', { items }, ''));
        expect(result.current.items).toEqual([
            { value: 'foo', label: 'foo' },
            { value: 'bar', label: 'bar' },
        ]);
    });

    it('should default value to first item if allowUnselected is false', () => {
        const { result } = renderHook(() => useFormField('choice', { items: ['foo', 'bar'] }, ''));
        expect(result.current.value).toBe('foo');
        expect(result.current.selectedIndex).toBe(0);

        act(() => result.current.setValue('baz'));
        expect(result.current.value).toBe('foo');
    });

    it('should default value to empty string if allowUnselected is true', () => {
        const { result } = renderHook(() => useFormField('choice', { items: ['foo', 'bar'], allowUnselect: true }, 'baz'));
        expect(result.current.value).toBe('');
        expect(result.current.selectedIndex).toBe(-1);

        act(() => result.current.setValue('baz'));
        expect(result.current.value).toBe('');
    });

    it('should return newly selected item and index after update', () => {
        const { result } = renderHook(() => useFormField('choice', { items: ['foo', 'bar'] }, ''));
        act(() => result.current.setValue('bar'));
        expect(result.current.selectedItem.value).toBe('bar');
        expect(result.current.selectedIndex).toBe(1);
    });

    it('should default value to empty string if not supplied', () => {
        const { result } = renderHook(() => useFormField(ChoiceField, {}));
        expect(result.current.value).toBe('');
    });
});

describe('useFormField - toggle', () => {
    it('should take value from checked prop', () => {
        const { result } = renderHook(() => useFormField('toggle', { checked: true }, false));
        expect(result.current.value).toBe(true);
    });

    it('should consider empty when value is false', () => {
        const { form, wrapper, unmount } = createFormContext();
        renderHook(() => useFormField('toggle', { name: 'foo', required: true }, false), { wrapper });
        expect(form.isValid).toBe(false);
        unmount();
    });

    it('should default value to false if not supplied', () => {
        const { result } = renderHook(() => useFormField(ToggleField, {}));
        expect(result.current.value).toBe(false);
    });
});

describe('useFormField - multiChoice', () => {
    it('should toggle existence of value in array', () => {
        const { result } = renderHook(() => useFormField(MultiChoiceField, { items: ['foo', 'bar'] }, []));
        expect(result.current.value).toEqual([]);

        act(() => result.current.toggleValue('foo'));
        expect(result.current.value).toEqual(['foo']);

        act(() => result.current.toggleValue('bar'));
        expect(result.current.value).toEqual(['foo', 'bar']);

        act(() => result.current.toggleValue('foo'));
        expect(result.current.value).toEqual(['bar']);

        act(() => result.current.toggleValue('bar'));
        expect(result.current.value).toEqual([]);
    });

    it('should not touch the previous array', () => {
        const { result } = renderHook(() => useFormField(MultiChoiceField, { items: ['foo', 'bar'] }, []));
        const prevValue = result.current.value;
        expect(result.current.value).toEqual([]);

        act(() => result.current.toggleValue('foo'));
        expect(result.current.value).not.toBe(prevValue);
        expect(prevValue).toEqual([]);
    });

    it('should filter unknown items if allowCustomValues is falsy', () => {
        const { result, rerender } = renderHook((props) => useFormField(MultiChoiceField, { items: props?.items || ['foo', 'bar'] }, []));
        act(() => result.current.toggleValue('baz'));
        expect(result.current.value).toEqual([]);

        act(() => result.current.setValue(['foo', 'baz']));
        expect(result.current.value).toEqual(['foo']);

        rerender({ items: ['bar'] });
        expect(result.current.value).toEqual([]);
    });

    it('should not filter unknown items if allowCustomValues is truthy', () => {
        const { result } = renderHook(() => useFormField(MultiChoiceField, { items: ['foo', 'bar'], allowCustomValues: true }, []));
        act(() => result.current.toggleValue('baz'));
        expect(result.current.value).toEqual(['baz']);

        act(() => result.current.setValue(['foo', 'baz']));
        expect(result.current.value).toEqual(['foo', 'baz']);
    });

    it('should set allowCustomValues to true if items is not specified', () => {
        const { result } = renderHook(() => useFormField(MultiChoiceField, {}, []));
        act(() => result.current.toggleValue('baz'));
        expect(result.current.value).toEqual(['baz']);
    });

    it('should not trigger dataChange when toggling unknown value', async () => {
        const { form, wrapper, unmount } = createFormContext();
        const { result } = renderHook(() => useFormField(MultiChoiceField, { name: 'foo', items: ['foo', 'bar'] }, []), { wrapper });
        const cb = mockFn();
        form.on('dataChange', cb);

        await act(async () => result.current.toggleValue('baz'));
        expect(cb).not.toBeCalled();
        unmount();
    });

    it('should not trigger dataChange when toggleValue has no effect', async () => {
        const { form, wrapper, unmount } = createFormContext();
        const { result } = renderHook(() => useFormField(MultiChoiceField, { name: 'foo', items: ['foo', 'bar'] }, []), { wrapper });
        const cb = mockFn();
        form.on('dataChange', cb);

        await act(async () => result.current.toggleValue('foo', true));
        expect(cb).not.toBeCalled();

        await act(async () => result.current.toggleValue('baz', false));
        expect(cb).not.toBeCalled();
        unmount();
    });

    it('should default value to empty array if not supplied', () => {
        const { result } = renderHook(() => useFormField(MultiChoiceField, {}));
        expect(result.current.value).toEqual([]);
    });

    it('should normalize value as array', () => {
        const { result } = renderHook(() => useFormField(MultiChoiceField, { items: ['foo', 'bar'] }, 'bar'));
        expect(result.current.value).toEqual(['bar']);

        act(() => result.current.setValue('foo'));
        expect(result.current.value).toEqual(['foo']);

        act(() => result.current.setValue(null));
        expect(result.current.value).toEqual([]);
    });
});

describe('FormContext', () => {
    it('should fire dataChange event when property is added manually', async () => {
        const { form, wrapper, unmount } = createFormContext({});
        const { result } = renderHook(() => useFormField({ name: 'foo' }, 'foo'), { wrapper });
        const cb = mockFn();
        form.on('dataChange', cb);
        await act(async () => {
            form.data.bar = 'bar';
        });
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0][0].data).toEqual(['bar']);
        unmount();
    });

    it('should fire dataChange event when property is updated manually', async () => {
        const { form, wrapper, unmount } = createFormContext({ bar: '' });
        const { result } = renderHook(() => useFormField({ name: 'foo' }, 'foo'), { wrapper });
        const cb = mockFn();
        form.on('dataChange', cb);
        await act(async () => {
            form.data.foo = 'bar';
            form.data.bar = 'bar';
        });
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0][0].data).toEqual(['foo', 'bar']);
        unmount();
    });

    it('should fire dataChange event when property is deleted manually', async () => {
        const { form, wrapper, unmount } = createFormContext();
        const { result } = renderHook(() => useFormField({ name: 'foo' }, 'foo'), { wrapper });
        const cb = mockFn();
        form.on('dataChange', cb);
        await act(async () => {
            form.data.foo = 'bar';
            form.data.bar = 'bar';
        });
        cb.mockClear();

        await act(async () => {
            delete form.data.foo;
            delete form.data.bar;
            delete form.data.baz;
        });
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0][0].data).toEqual(['foo', 'bar']);
        unmount();
    });

    it('should fire dataChange event with unique field keys', async () => {
        const { form, wrapper, unmount } = createFormContext();
        const { result } = renderHook(() => useFormField({ name: 'foo' }, 'foo'), { wrapper });
        const cb = mockFn();
        form.on('dataChange', cb);
        await act(async () => {
            form.data.foo = 'bar';
            form.data.foo = 'baz';
        });
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0][0].data).toEqual(['foo']);
        unmount();
    });

    it('should fire dataChange event after reset for field not declared in initial data', async () => {
        const { form, wrapper, unmount } = createFormContext();
        const { result } = renderHook(() => useFormField({ name: 'foo' }, 'foo'), { wrapper });
        const cb = mockFn();
        form.on('dataChange', cb);
        await act(async () => {
            form.reset();
            form.data.foo = 'bar';
        });
        expect(cb).toBeCalledTimes(1);
        unmount();
    });

    it('should be able to create new property with undefined value', async () => {
        const { form, unmount } = createFormContext();
        const cb = mockFn();
        form.on('dataChange', cb);
        await act(async () => {
            form.data.foo = undefined;
        });
        expect(form.data).toHaveProperty('foo');
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0][0].data).toEqual(['foo']);
        unmount();
    });

    it('should not throw error when updating field with no rendered component', async () => {
        const { form, wrapper, unmount } = createFormContext({ foo: 'foo1', bar: 'bar1' });
        const { result } = renderHook(() => useFormField({ name: 'foo' }, ''), { wrapper });
        await act(async () => {
            form.data.foo = 'foo2';
            form.data.bar = 'bar2';
        });
        unmount();
    });

    it('should not create property if field is not rendered after being deleted', async () => {
        let renderField = true;
        const renderForm = createFormComponent(() => (
            renderField && <Field name="foo" />
        ));
        const { form, unmount } = renderForm();
        expect(form.data).toHaveProperty('foo');

        renderField = false;
        await renderAct(async () => {
            delete form.data.foo;
        });
        expect(form.data).not.toHaveProperty('foo');
        unmount();
    });

    it('should not cause rerender after unmount', async () => {
        const renderForm = createFormComponent((form) => (
            <div>
                <Field name="foo" />
                <div>{form.data.foo}</div>
            </div>
        ));
        const { unmount, form, dataChange } = renderForm({ foo: 'bar' });
        expect(dataChange).not.toBeCalled();
        dataChange.mockClear();

        renderAct(() => {
            form.data.foo = 'baz';
        });
        unmount();
        await delay();
        expect(dataChange).not.toBeCalled();
    });

    it('should fire beforeLeave event when unlocking form element', async () => {
        const renderForm = createFormComponent();
        const { unmount, form, formElement, beforeLeave } = renderForm({}, { preventLeave: true });

        await renderAct(async () => {
            form.data.foo = 1;
        });
        expect(locked(formElement)).toBe(true);

        await renderAct(async () => {
            catchAsync(cancelLock());
        });
        expect(beforeLeave).toBeCalledTimes(1);
        unmount();
    });

    it('should unlock form element if promise returned beforeLeave is fulfilled', async () => {
        const renderForm = createFormComponent();
        const { unmount, form, formElement, beforeLeave } = renderForm({}, { preventLeave: true });
        beforeLeave.mockResolvedValue('');

        await renderAct(async () => {
            form.data.foo = 1;
        });
        expect(locked(formElement)).toBe(true);

        await expect(cancelLock()).resolves.toBeUndefined();
        expect(beforeLeave).toBeCalledTimes(1);
        expect(locked(formElement)).toBe(false);
        unmount();
    });

    it('should not unlock form element if promise returned beforeLeave is rejected', async () => {
        const renderForm = createFormComponent();
        const { unmount, form, formElement, beforeLeave } = renderForm({}, { preventLeave: true });
        beforeLeave.mockRejectedValue('');

        await renderAct(async () => {
            form.data.foo = 1;
        });
        expect(locked(formElement)).toBe(true);

        await expect(cancelLock()).rejects.toBeErrorWithCode('zeta/cancellation-rejected');
        expect(beforeLeave).toBeCalledTimes(1);
        expect(locked(formElement)).toBe(true);
        unmount();
    });

    it('should not unlock form element if beforeLeave event is not handled', async () => {
        const renderForm = createFormComponent();
        const { unmount, form, formElement, beforeLeave } = renderForm({}, { preventLeave: true });

        await renderAct(async () => {
            form.data.foo = 1;
        });
        expect(locked(formElement)).toBe(true);

        await expect(cancelLock()).rejects.toBeErrorWithCode('zeta/cancellation-rejected');
        expect(beforeLeave).toBeCalledTimes(1);
        expect(locked(formElement)).toBe(true);
        unmount();
    });
});

describe('FormContext#isValid', () => {
    it('should return false for required field being empty before validate has ever been called', () => {
        const { form, wrapper, unmount } = createFormContext();
        renderHook(() => useFormField({ name: 'foo', required: true }, ''), { wrapper });
        expect(form.isValid).toBe(false);
        unmount();
    });

    it('should be updated when required field has been filled or cleared', async () => {
        const { form, wrapper, unmount } = createFormContext();
        const { result } = renderHook(() => useFormField({ name: 'foo', required: true }, ''), { wrapper });
        expect(form.isValid).toBe(false);

        await act(async () => result.current.setValue('foo'));
        expect(form.isValid).toBe(true);

        await act(async () => result.current.setValue(''));
        expect(form.isValid).toBe(false);
        unmount();
    });

    it('should invoke isEmpty callback supplied to useFormField hook for checking emptiness of a field', () => {
        const value = {};
        const cb = mockFn().mockReturnValue(true);
        const { form, wrapper, unmount } = createFormContext();
        renderHook(() => useFormField({ name: 'foo', required: true, isEmpty: cb }, value), { wrapper });
        expect(form.isValid).toBe(false);
        expect(cb).toBeCalled();
        expect(cb.mock.calls[0]).toEqual([value]);
        unmount();
    });

    it('should ignore errors for disabled field', async () => {
        const cb = mockFn().mockReturnValue('error');
        const { form, wrapper, unmount } = createFormContext();
        const { rerender } = renderHook(({ disabled }) => useFormField({ name: 'foo', onValidate: cb, disabled }, ''), {
            initialProps: { disabled: false },
            wrapper
        });

        await act(async () => void await form.validate());
        expect(form.isValid).toBe(false);

        rerender({ disabled: true });
        expect(form.isValid).toBe(true);
        unmount();
    });

    it('should return initial status after reset', async () => {
        const { form, wrapper, unmount } = createFormContext();
        renderHook(() => useFormField({ name: 'foo' }, ''), { wrapper });
        expect(form.isValid).toBe(true);

        act(() => form.setError('foo', 'Error'));
        expect(form.isValid).toBe(false);

        act(() => form.reset());
        expect(form.isValid).toBe(true);
        unmount();
    });
});

describe('FormContext#element', () => {
    it('should return element of specified field', async () => {
        const cb = mockFn();
        const Field = function (props) {
            const { elementRef } = useFormField(props, '');
            cb.mockImplementation(elementRef);
            return (<input ref={cb} />);
        };
        const renderForm = createFormComponent(() => (
            <Field name="foo" />
        ));
        const { form, unmount } = renderForm();
        expect(form.element('foo')).toBe(cb.mock.calls[0][0]);
        unmount();
    });

    it('should return undefined for field not sending ref to HTML element', async () => {
        const renderForm = createFormComponent(() => (
            <Field name="foo" />
        ));
        const { form, unmount } = renderForm();
        expect(form.element('foo')).toBeUndefined();
        unmount();
    });

    it('should return undefined for inexist field', async () => {
        const { form, unmount } = createFormContext();
        expect(form.element('foo')).toBeUndefined();
        unmount();
    });
});

describe('FormContext#focus', () => {
    it('should set focus to element of specified field', async () => {
        const cb = mockFn();
        const Field = function (props) {
            const { elementRef } = useFormField(props, '');
            cb.mockImplementation(elementRef);
            return (<input ref={cb} />);
        };
        const renderForm = createFormComponent(() => (
            <Field name="foo" />
        ));
        const { form, unmount } = renderForm();
        form.focus('foo');
        expect(dom.activeElement).toBe(cb.mock.calls[0][0]);
        unmount();
    });
});

describe('FormContext#getError', () => {
    it('should return empty string when no error', () => {
        const renderForm = createFormComponent(() => (
            <Field name="foo" />
        ));
        const { form, unmount } = renderForm();
        expect(form.getError('foo')).toBe('');
        expect(form.getError('bar')).toBe('');
        unmount();
    });

    it('should return error message coerced as string', async () => {
        const renderForm = createFormComponent(() => (<>
            <Field name="foo" onValidate={() => 'error'} />
            <Field name="bar" onValidate={() => ({ toString() { return 'error' } })} />
            <Field name="baz" onValidate={() => (() => 'error')} />
        </>));
        const { form, unmount } = renderForm();
        await renderAct(async () => {
            await form.validate();
        });
        expect(form.getError('foo')).toBe('error');
        expect(form.getError('bar')).toBe('error');
        expect(form.getError('baz')).toBe('error');
        unmount();
    });
});

describe('FormContext#setError', () => {
    it('should update isValid property', () => {
        const { form, wrapper, unmount } = createFormContext();
        renderHook(() => useFormField({ name: 'foo' }, ''), { wrapper });
        expect(form.isValid).toBe(true);

        act(() => form.setError('foo', 'Error'));
        expect(form.isValid).toBe(false);

        act(() => form.setError('foo', ''));
        expect(form.isValid).toBe(true);
        unmount();
    });
});

describe('FormContext#validate', () => {
    it('should trigger validation from form context', async () => {
        const cb = mockFn();
        const { form, wrapper, unmount } = createFormContext();
        renderHook(() => [
            useFormField({ name: 'foo', onValidate: cb }, 'foo_value'),
            useFormField({ name: 'bar', onValidate: cb }, 'bar_value'),
        ], { wrapper });

        await act(async () => void await form.validate());
        verifyCalls(cb, [
            ['foo_value', 'foo', form],
            ['bar_value', 'bar', form],
        ]);
        unmount();
    });

    it('should trigger validation of specified field from form context', async () => {
        const cb = mockFn();
        const { form, wrapper, unmount } = createFormContext();
        renderHook(() => [
            useFormField({ name: 'foo', onValidate: cb }, 'foo_value'),
            useFormField({ name: 'bar', onValidate: cb }, 'bar_value'),
        ], { wrapper });

        await act(async () => void await form.validate('foo'));
        verifyCalls(cb, [['foo_value', 'foo', form]]);
        unmount();
    });

    it('should return true if all validations passed', async () => {
        const cb = mockFn().mockResolvedValue('');
        const { form, wrapper, unmount } = createFormContext();
        renderHook(() => [
            useFormField({ name: 'foo', onValidate: cb }, 'foo_value'),
            useFormField({ name: 'bar', onValidate: cb }, 'bar_value'),
        ], { wrapper });

        let result;
        await act(async () => void (result = await form.validate()));
        expect(result).toBe(true);
        unmount();
    });

    it('should return false if one of the validation failed', async () => {
        const cb = mockFn().mockResolvedValueOnce('').mockResolvedValueOnce('error');
        const { form, wrapper, unmount } = createFormContext();
        renderHook(() => [
            useFormField({ name: 'foo', onValidate: cb }, 'foo_value'),
            useFormField({ name: 'bar', onValidate: cb }, 'bar_value'),
        ], { wrapper });

        let result;
        await act(async () => void (result = await form.validate()));
        expect(result).toBe(false);
        unmount();
    });

    it('should accept string-coercible object as failed result', async () => {
        const obj = { message: 'error1' };
        const cb = mockFn().mockReturnValue({
            toString() { return obj.message; },
            [Symbol.toPrimitive]() { return obj.message; }
        });
        const { form, wrapper, unmount } = createFormContext();
        const { result, rerender } = renderHook(() => useFormField({ name: 'foo', onValidate: cb }, 'foo_value'), { wrapper });

        let isValid;
        await act(async () => void (isValid = await form.validate()));
        expect(isValid).toBe(false);
        expect(result.current.error).toBe('error1');

        obj.message = 'error2';
        rerender();
        expect(result.current.error).toBe('error2');
        unmount();
    });

    it('should accept a callback as failed result', async () => {
        const cb = mockFn().mockReturnValue('error')
        const { form, wrapper, unmount } = createFormContext();
        const { result, rerender } = renderHook(({ foo }) => useFormField({ name: 'foo', foo, onValidate: () => cb }, 'foo_value'), {
            wrapper,
            initialProps: { foo: 'bar' }
        });

        let isValid;
        await act(async () => void (isValid = await form.validate()));
        expect(isValid).toBe(false);
        expect(result.current.error).toBe('error');
        expect(cb).lastCalledWith(expect.objectContaining({ foo: 'bar' }));

        rerender({ foo: 'baz' });
        expect(result.current.error).toBe('error');
        expect(cb).lastCalledWith(expect.objectContaining({ foo: 'baz' }));
        unmount();
    });

    it('should consider empty string resolved from onValidate being passed', async () => {
        const cb = mockFn().mockReturnValue('');
        const { form, wrapper, unmount } = createFormContext();
        renderHook(() => useFormField({ name: 'foo', onValidate: cb }, 'foo_value'), { wrapper });

        let result;
        await act(async () => void (result = await form.validate()));
        expect(result).toBe(true);
        unmount();
    });

    it('should consider undefined resolved from onValidate being passed', async () => {
        const cb = mockFn().mockReturnValue(undefined);
        const { form, wrapper, unmount } = createFormContext();
        renderHook(() => useFormField({ name: 'foo', onValidate: cb }, 'foo_value'), { wrapper });

        let result;
        await act(async () => void (result = await form.validate()));
        expect(result).toBe(true);
        unmount();
    });

    it('should consider null resolved from onValidate being passed', async () => {
        const cb = mockFn().mockReturnValue(null);
        const { form, wrapper, unmount } = createFormContext();
        renderHook(() => useFormField({ name: 'foo', onValidate: cb }, 'foo_value'), { wrapper });

        let result;
        await act(async () => void (result = await form.validate()));
        expect(result).toBe(true);
        unmount();
    });

    it('should fire validate event for each named field', async () => {
        const { form, wrapper, unmount } = createFormContext();
        renderHook(() => [
            useFormField({ name: 'foo', onValidate: mockFn() }, 'foo_value'),
            useFormField({ name: 'bar', onValidate: mockFn() }, 'bar_value'),
        ], { wrapper });

        const cb = mockFn();
        form.on('validate', cb);
        await act(async () => void await form.validate());
        verifyCalls(cb, [
            [expect.objectContaining({ type: 'validate', name: 'foo', value: 'foo_value' }), form],
            [expect.objectContaining({ type: 'validate', name: 'bar', value: 'bar_value' }), form],
        ])
        unmount();
    });

    it('should fire validationChange event if error state of a named field changed', async () => {
        const { form, wrapper, unmount } = createFormContext();
        const { result } = renderHook(() => useFormField({ name: 'foo', onValidate: () => 'error' }, ''), { wrapper });

        const cb = mockFn();
        form.on('validationChange', cb);
        await act(async () => void await form.validate());
        verifyCalls(cb, [
            [expect.objectContaining({ type: 'validationChange', name: 'foo', isValid: false, message: 'error' }), form]
        ])
        expect(result.current.error).toBe('error');
        unmount();
    });

    it('should fire validationChange event if error state of a named field changed through error property', async () => {
        const { form, wrapper, unmount } = createFormContext();
        const { result, rerender } = renderHook(({ error }) => useFormField({ name: 'foo', error }, ''), { wrapper });
        const cb = mockFn();
        form.on('validationChange', cb);

        rerender({ error: 'error' });
        verifyCalls(cb, [
            [expect.objectContaining({ type: 'validationChange', name: 'foo', isValid: false, message: 'error' }), form]
        ]);
        expect(result.current.error).toBe('error');
        unmount();
    });

    it('should fire validationChange event if error state of a named field changed through setError callback', async () => {
        const { form, wrapper, unmount } = createFormContext();
        const { result } = renderHook(() => useFormField({ name: 'foo' }, ''), { wrapper });
        const cb = mockFn();
        form.on('validationChange', cb);

        act(() => result.current.setError('error'));
        verifyCalls(cb, [
            [expect.objectContaining({ type: 'validationChange', name: 'foo', isValid: false, message: 'error' }), form]
        ])
        expect(result.current.error).toBe('error');
        unmount();
    });

    it('should debounce validation of the same field', async () => {
        const cb = mockFn().mockImplementation(() => delay(200));
        const { form, wrapper, unmount } = createFormContext();
        renderHook(() => useFormField({ name: 'foo', onValidate: cb }, ''), { wrapper });

        form.validate('foo');
        expect(cb).toBeCalledTimes(1);

        form.validate('foo');
        form.validate('foo');
        await act(async () => void await form.validate());
        expect(cb).toBeCalledTimes(2);
        unmount();
    });

    it('should always reflects the latest validation result', async () => {
        const cbFoo = mockFn().mockReturnValueOnce(delay(200));
        const cbBar = mockFn().mockImplementation(() => String(form.data.bar));
        const { form, wrapper, unmount } = createFormContext({}, false);
        renderHook(() => [
            useFormField({ name: 'foo', onValidate: cbFoo }, 'foo_value'),
            useFormField({ name: 'bar', onValidate: cbBar }, 'bar_value'),
        ], { wrapper });

        const cb = mockFn();
        form.on('validationChange', cb);

        let p1, p2;
        await act(async () => {
            form.data.bar = '1';
            p1 = form.validate();
            form.data.bar = '2';
            p2 = form.validate();
        });

        await act(async () => void await p2);
        verifyCalls(cb, [
            [expect.objectContaining({ type: 'validationChange', name: 'bar', isValid: false, message: '2' }), form]
        ]);

        await act(async () => void await p1);
        verifyCalls(cb, [
            [expect.objectContaining({ type: 'validationChange', name: 'bar', isValid: false, message: '2' }), form]
        ]);
        verifyCalls(cbBar, [
            ['1', 'bar', form],
            ['2', 'bar', form],
        ]);
        unmount();
    });

    it('should not update error state of a named field after it associates with another data path', async () => {
        const cb = mockFn().mockReturnValue('error');
        const { form, wrapper, unmount } = createFormContext();
        const { result, rerender } = renderHook(({ name }) => useFormField({ name, onValidate: cb }, ''), { wrapper, initialProps: { name: 'foo' } });

        const promise = form.validate('foo');
        rerender({ name: 'bar' });

        await expect(promise).resolves.toBe(false);
        expect(result.current.error).toBe('');
        unmount();
    });
});

describe('FormContext#reset', () => {
    it('should reset named field to default value', async () => {
        const { form, wrapper, unmount } = createFormContext();
        const { result, rerender } = renderHook(() => useFormField({ name: 'foo' }, 'foo'), { wrapper });

        await act(async () => {
            form.data.foo = 'bar';
        });
        expect(result.current.value).toBe('bar');

        act(() => form.reset());
        rerender();
        expect(result.current.value).toBe('foo');
        expect(form.data.foo).toBe('foo');
        unmount();
    });

    it('should reset named field to initial value', async () => {
        const { form, wrapper, unmount } = createFormContext({ foo: 'baz' });
        const { result } = renderHook(() => useFormField({ name: 'foo' }, 'foo'), { wrapper });

        await act(async () => {
            form.data.foo = 'bar';
        });
        expect(result.current.value).toBe('bar');

        act(() => form.reset());
        expect(result.current.value).toBe('baz');
        unmount();
    });

    it('should not create property if field is not rendered after reset', async () => {
        let renderField = true;
        const renderForm = createFormComponent(() => (
            renderField && <Field name="foo" />
        ));
        const { form, unmount } = renderForm();
        expect(form.data).toHaveProperty('foo');

        renderField = false;
        await renderAct(async () => {
            form.reset();
        });
        expect(form.data).not.toHaveProperty('foo');
        unmount();
    });

    it('should call onChange callback with initial value for controlled field', () => {
        let value = 'foo';
        const onChange = mockFn(v => (value = v));
        const { form, wrapper, unmount } = createFormContext();
        const { rerender } = renderHook(() => useFormField({ name: 'foo', value, onChange }, ''), { wrapper });

        value = 'bar';
        rerender();
        onChange.mockClear();

        act(() => form.reset());
        verifyCalls(onChange, [['foo']]);
        unmount();
    });

    it('should call onChange callback with current value for controlled field if property exists', () => {
        let value = 'foo';
        const onChange = mockFn(v => (value = v));
        const { form, wrapper, unmount } = createFormContext({ foo: 'baz' });
        const { rerender } = renderHook(() => useFormField({ name: 'foo', value, onChange }, ''), { wrapper });

        value = 'bar';
        rerender();
        onChange.mockClear();

        act(() => form.reset());
        verifyCalls(onChange, [['baz']]);
        unmount();
    });
});

describe('FormContext#persist', () => {
    it('should save current data to view state', async () => {
        const viewState = {
            get: mockFn(),
            set: mockFn(),
        };
        const { result, unmount } = renderHook(() => useFormContext('persist', { foo: 1 }), {
            wrapper: ({ children }) => (
                <ViewStateProvider value={{ getState: () => viewState }}>{children}</ViewStateProvider>
            )
        });
        act(() => {
            result.current.data.foo = 2;
        });
        result.current.persist();
        expect(viewState.set).toBeCalledTimes(1);
        expect(viewState.set.mock.calls[0][0]).toEqual({ foo: 2 });
        unmount();
    });

    it('should set autoPersist to false when called', async () => {
        const { form, unmount } = createFormContext();
        expect(form.autoPersist).toBe(true);
        form.persist();
        expect(form.autoPersist).toBe(false);
        unmount();
    });
});

describe('FormContext#restore', () => {
    it('should reset form with persisted data', async () => {
        let persistedData;
        const getState = mockFn().mockReturnValue({
            get() { return persistedData },
            set() { }
        });
        const { result, unmount } = renderHook(() => useFormContext('persist', { foo: 1 }), {
            wrapper: ({ children }) => (
                <ViewStateProvider value={{ getState }}>{children}</ViewStateProvider>
            )
        });
        expect(result.current.data).toEqual({ foo: 1 });
        expect(getState).toBeCalledTimes(1);
        expect(getState.mock.calls[0][1]).toBe('persist');

        persistedData = { foo: 2 };
        act(() => void result.current.restore());
        expect(result.current.data).toEqual({ foo: 2 });
        unmount();
    });
});

describe('Form component', () => {
    it('should handle native submit event', async () => {
        const cb1 = mockFn();
        const ref = createRef();
        const { form, unmount } = createFormContext();

        render(<Form ref={ref} context={form} onSubmit={cb1} />);
        act(() => ref.current.submit());
        expect(cb1).toBeCalledTimes(1);
        unmount();
    });

    it('should handle native reset event', async () => {
        const cb1 = mockFn();
        const cb2 = mockFn();
        const ref = createRef();
        const { form, unmount } = createFormContext();
        form.on('reset', cb1)

        render(<Form ref={ref} context={form} onReset={cb2} />);
        act(() => ref.current.reset());
        expect(cb1).toBeCalledTimes(1);
        expect(cb2).toBeCalledTimes(1);
        unmount();
    });

    it('should lock form element after data change when preventLeave is true', async () => {
        const renderForm = createFormComponent(() => (
            <Field name="foo" />
        ));
        const { unmount, form, formElement } = renderForm({}, { __formAttributes: { preventLeave: true } });
        expect(locked(formElement)).toBe(false);

        await renderAct(async () => {
            form.data.foo = 'bar';
        });
        expect(locked(formElement)).toBe(true);

        await renderAct(async () => {
            form.reset()
        });
        expect(locked(formElement)).toBe(false);
        unmount();
    });

    it('should unlock form element after unmount', async () => {
        const renderForm = createFormComponent(() => (
            <Field name="foo" />
        ));
        const { unmount, form, formElement } = renderForm({}, { __formAttributes: { preventLeave: true } });
        expect(locked(formElement)).toBe(false);

        await renderAct(async () => {
            form.data.foo = 'bar';
        });
        expect(locked(formElement)).toBe(true);

        unmount();
        await delay();
        expect(locked(formElement)).toBe(false);
    });

    it('should not lock form element when preventLeave is false', async () => {
        const renderForm = createFormComponent(() => (
            <Field name="foo" />
        ));
        const { unmount, form, formElement } = renderForm();
        expect(locked(formElement)).toBe(false);

        await renderAct(async () => {
            form.data.foo = 'bar';
        });
        expect(locked(formElement)).toBe(false);
        unmount();
    });
});

describe('combineValidators', () => {
    it('should execute validators sequentially', async () => {
        let resolve;
        const promise = new Promise(resolve_ => resolve = resolve_);
        const cb1 = mockFn().mockReturnValue(promise);
        const cb2 = mockFn();

        combineValidators(cb1, cb2)('', 'foo', null);
        await delay();
        expect(cb1).toBeCalledTimes(1);
        expect(cb2).not.toBeCalled();

        resolve();
        await promise;
        expect(cb1).toBeCalledTimes(1);
    });

    it('should return falsy value if all validators return falsy values', async () => {
        const cb = mockFn().mockResolvedValue('');
        const validate = combineValidators(
            () => false,
            () => undefined,
            () => null,
            () => 0,
            cb,
        );
        await expect(validate('', 'foo', null)).resolves.toBeFalsy();
        expect(cb).toBeCalledTimes(1);
    });

    it('should return first truthy value from validators', async () => {
        const cb = mockFn().mockResolvedValue('');
        const validate = combineValidators(
            () => false,
            () => undefined,
            () => null,
            () => 1,
            cb,
        );
        await expect(validate('', 'foo', null)).resolves.toBe(1);
        expect(cb).not.toBeCalled();
    });

    it('should not throw when given non-function arguments', async () => {
        let promise;
        expect(() => {
            promise = combineValidators(0, false, "", null, undefined)('', 'foo', null);
        }).not.toThrow();
        await expect(promise).resolves.toBeUndefined();
    });
});
