import React from "react";
import { render } from "@testing-library/react";
import { act, renderHook } from '@testing-library/react-hooks'
import { FormContextProvider, useFormContext, useFormField } from "src/form";
import { delay, mockFn, verifyCalls } from "./testUtil";

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

describe('useFormContext', () => {
    it('should cause re-render when data has changed', async () => {
        let form;
        const Field = function () {
            useFormField({ name: 'foo' }, '');
            return <></>;
        };
        const Component = function () {
            form = useFormContext({ foo: 'bar' });
            return (
                <FormContextProvider value={form}>
                    <Field />
                    <div>{form.data.foo}</div>
                </FormContextProvider>
            );
        };
        const { getByText, findByText } = render(<Component />);
        getByText('bar');

        form.data.foo = 'baz';
        await findByText('baz');
    });

    it('should cause re-render when isValid state has changed', async () => {
        let form;
        const Field = function () {
            useFormField({ name: 'foo', onValidate: () => 'error' }, '');
            return <></>;
        };
        const Component = function () {
            form = useFormContext();
            return (
                <FormContextProvider value={form}>
                    <Field />
                    <div>{form.isValid ? 'valid' : 'invalid'}</div>
                </FormContextProvider>
            );
        };
        const { getByText, findByText } = render(<Component />);
        getByText('valid');

        form.data.foo = 'bar';
        await findByText('invalid');
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

        await act(() => {
            const promise = new Promise(resolve => {
                form.on('dataChange', resolve);
            });
            form.data.foo = 'bar';
            return promise;
        });
        expect(result.current.value).toBe('bar');
    });

    it('should call setValue callback with current value for controlled field', () => {
        const cb = mockFn();
        const { result } = renderHook(() => useFormField({ value: 'foo', onChange: () => { } }, ''));
        act(() => result.current.setValue(cb));
        verifyCalls(cb, [['foo']]);
    });

    it('should call onChange callback for controlled field', () => {
        const cb = mockFn();
        const { result } = renderHook(() => useFormField({ value: '', onChange: cb }, ''));
        act(() => result.current.setValue('foo'));
        verifyCalls(cb, [['foo']]);
    });

    it('should call onChange callback with value returned from setValue callback for controlled field', () => {
        const cb = mockFn();
        const { result } = renderHook(() => useFormField({ value: 'foo', onChange: cb }, ''));
        act(() => result.current.setValue(() => 'bar'));
        verifyCalls(cb, [['bar']]);
    });

    it('should not overwrite changes through data object', async () => {
        const { form, wrapper, unmount } = createFormContext();
        const { result, waitForValueToChange } = renderHook(() => useFormField({ name: 'foo' }, ''), { wrapper });
        act(() => {
            result.current.setValue('bar')
            form.data.foo = 'baz';
        });
        expect(form.data.foo).toBe('baz');
        await waitForValueToChange(() => result.current);
        unmount();
    });
});

describe('FormContext', () => {
    it('should fire dataChange event after reset for field not declared in initial data', async () => {
        const { form, wrapper, unmount } = createFormContext();
        const { result, waitForValueToChange } = renderHook(() => useFormField({ name: 'foo' }, 'foo'), { wrapper });
        const cb = mockFn();
        form.on('dataChange', cb);
        form.reset();
        form.data.foo = 'bar';

        await waitForValueToChange(() => result.current);
        expect(cb).toBeCalledTimes(1);
        unmount();
    });

    it('should not throw error when updating field with no rendered component', async () => {
        const { form, wrapper, unmount } = createFormContext({ foo: 'foo1', bar: 'bar1' });
        const { result, waitForValueToChange } = renderHook(() => useFormField({ name: 'foo' }, ''), { wrapper });
        form.data.foo = 'foo2';
        form.data.bar = 'bar2';

        await waitForValueToChange(() => result.current);
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

        form.data.bar = '1';
        const p1 = form.validate();
        form.data.bar = '2';
        const p2 = form.validate();

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
});

describe('FormContext#reset', () => {
    it('should reset named field to default value', async () => {
        const { form, wrapper, unmount } = createFormContext();
        const { result, waitForValueToChange } = renderHook(() => useFormField({ name: 'foo' }, 'foo'), { wrapper });

        form.data.foo = 'bar';
        await waitForValueToChange(() => result.current);
        expect(result.current.value).toBe('bar');

        act(() => form.reset());
        expect(result.current.value).toBe('foo');
        unmount();
    });

    it('should reset named field to initial value', async () => {
        const { form, wrapper, unmount } = createFormContext({ foo: 'baz' });
        const { result, waitForValueToChange } = renderHook(() => useFormField({ name: 'foo' }, 'foo'), { wrapper });

        form.data.foo = 'bar';
        await waitForValueToChange(() => result.current);
        expect(result.current.value).toBe('bar');

        act(() => form.reset());
        expect(result.current.value).toBe('baz');
        unmount();
    });
});
