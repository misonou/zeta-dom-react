import React from "react";
import { act, renderHook } from '@testing-library/react-hooks'
import { FormContextProvider, useFormContext, useFormField } from "src/form";
import { mockFn, verifyCalls } from "./testUtil";

function createFormContext(initialData) {
    const { result: { current: form } } = renderHook(() => useFormContext(initialData));
    return {
        form,
        wrapper: ({ children }) => (
            <FormContextProvider value={form}>{children}</FormContextProvider>
        )
    };
}

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

    it('should call onChange callback for controlled field', () => {
        const cb = mockFn();
        const { result } = renderHook(() => useFormField({ value: '', onChange: cb }, ''));
        act(() => result.current.setValue('foo'));
        verifyCalls(cb, [['foo']]);
    });
});

describe('FormContext#validate', () => {
    it('should trigger validation from form context', async () => {
        const cb = mockFn();
        const { form, wrapper } = createFormContext();
        renderHook(() => [
            useFormField({ name: 'foo', onValidate: cb }, 'foo_value'),
            useFormField({ name: 'bar', onValidate: cb }, 'bar_value'),
        ], { wrapper });

        await act(async () => void await form.validate());
        verifyCalls(cb, [
            ['foo_value', 'foo'],
            ['bar_value', 'bar'],
        ]);
    });

    it('should trigger validation of specified field from form context', async () => {
        const cb = mockFn();
        const { form, wrapper } = createFormContext();
        renderHook(() => [
            useFormField({ name: 'foo', onValidate: cb }, 'foo_value'),
            useFormField({ name: 'bar', onValidate: cb }, 'bar_value'),
        ], { wrapper });

        await act(async () => void await form.validate('foo'));
        verifyCalls(cb, [['foo_value', 'foo']]);
    });

    it('should return true if all validations passed', async () => {
        const cb = mockFn().mockResolvedValue('');
        const { form, wrapper } = createFormContext();
        renderHook(() => [
            useFormField({ name: 'foo', onValidate: cb }, 'foo_value'),
            useFormField({ name: 'bar', onValidate: cb }, 'bar_value'),
        ], { wrapper });

        let result;
        await act(async () => void (result = await form.validate()));
        expect(result).toBe(true);
    });

    it('should return false if one of the validation failed', async () => {
        const cb = mockFn().mockResolvedValueOnce('').mockResolvedValueOnce('error');
        const { form, wrapper } = createFormContext();
        renderHook(() => [
            useFormField({ name: 'foo', onValidate: cb }, 'foo_value'),
            useFormField({ name: 'bar', onValidate: cb }, 'bar_value'),
        ], { wrapper });

        let result;
        await act(async () => void (result = await form.validate()));
        expect(result).toBe(false);
    });

    it('should consider empty string resolved from onValidate being passed', async () => {
        const cb = mockFn().mockReturnValue('');
        const { form, wrapper } = createFormContext();
        renderHook(() => useFormField({ name: 'foo', onValidate: cb }, 'foo_value'), { wrapper });

        let result;
        await act(async () => void (result = await form.validate()));
        expect(result).toBe(true);
    });

    it('should consider undefined resolved from onValidate being passed', async () => {
        const cb = mockFn().mockReturnValue(undefined);
        const { form, wrapper } = createFormContext();
        renderHook(() => useFormField({ name: 'foo', onValidate: cb }, 'foo_value'), { wrapper });

        let result;
        await act(async () => void (result = await form.validate()));
        expect(result).toBe(true);
    });

    it('should consider null resolved from onValidate being passed', async () => {
        const cb = mockFn().mockReturnValue(null);
        const { form, wrapper } = createFormContext();
        renderHook(() => useFormField({ name: 'foo', onValidate: cb }, 'foo_value'), { wrapper });

        let result;
        await act(async () => void (result = await form.validate()));
        expect(result).toBe(true);
    });

    it('should fire validate event for each named field', async () => {
        const { form, wrapper } = createFormContext();
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
    });

    it('should fire validationChange event if error state of a named field changed', async () => {
        const { form, wrapper } = createFormContext();
        const { result } = renderHook(() => useFormField({ name: 'foo', onValidate: () => 'error' }, ''), { wrapper });

        const cb = mockFn();
        form.on('validationChange', cb);
        await act(async () => void await form.validate());
        verifyCalls(cb, [
            [expect.objectContaining({ type: 'validationChange', name: 'foo', isValid: false, message: 'error' }), form]
        ])
        expect(result.current.error).toBe('error');
    });
});

describe('FormContext#reset', () => {
    it('should reset named field to default value', async () => {
        const { form, wrapper } = createFormContext();
        const { result } = renderHook(() => useFormField({ name: 'foo' }, 'foo'), { wrapper });

        await act(() => {
            const promise = new Promise(resolve => {
                form.on('dataChange', resolve);
            });
            form.data.foo = 'bar';
            return promise;
        });
        expect(result.current.value).toBe('bar');

        await act(() => {
            const promise = new Promise(resolve => {
                form.on('reset', resolve);
            });
            form.reset();
            return promise;
        });
        expect(result.current.value).toBe('foo');
    });

    it('should reset named field to initial value', async () => {
        const { form, wrapper } = createFormContext({ foo: 'baz' });
        const { result } = renderHook(() => useFormField({ name: 'foo' }, 'foo'), { wrapper });

        await act(() => {
            const promise = new Promise(resolve => {
                form.on('dataChange', resolve);
            });
            form.data.foo = 'bar';
            return promise;
        });
        expect(result.current.value).toBe('bar');

        await act(() => {
            const promise = new Promise(resolve => {
                form.on('reset', resolve);
            });
            form.reset();
            return promise;
        });
        expect(result.current.value).toBe('baz');
    });
});