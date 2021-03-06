import React, { useEffect, useRef } from "react";
import { act as reactAct, render } from "@testing-library/react";
import { act, renderHook } from '@testing-library/react-hooks'
import { catchAsync } from "src/include/zeta-dom/util";
import dom from "src/include/zeta-dom/dom";
import { combineRef } from "src/util";
import { useAsync, useDispose, useMemoizedFunction, useObservableProperty, useRefInitCallback } from "src/hooks";
import { delay, mockFn, verifyCalls, _ } from "./testUtil";

describe('useMemoizedFunction', () => {
    it('should return the same callback every cycle', () => {
        const { result, rerender } = renderHook(() => useMemoizedFunction(() => { }));
        expect(typeof result.current).toBe('function');
        rerender();
        expect(result.all[0]).toBe(result.all[1]);
    });

    it('should invoke supplied callback in the last cycle', () => {
        const { result, rerender } = renderHook(({ value }) => useMemoizedFunction(() => value), {
            initialProps: { value: 0 }
        });
        expect(result.current()).toBe(0);
        rerender({ value: 1 });
        expect(result.current()).toBe(1);
    });
});

describe('useObservableProperty', () => {
    it('should cause render when observed property is changed', async () => {
        const obj = { prop: 'foo' };
        const { result, waitForNextUpdate } = renderHook(() => useObservableProperty(obj, 'prop'));
        expect(result.current).toBe('foo');
        expect(result.all.length).toBe(1);

        obj.prop = 'bar';
        await waitForNextUpdate();
        expect(result.current).toBe('bar');
    });

    it('should cause render when observed property is changed before useEffect hooks', async () => {
        const obj = { prop: 'foo' };
        const { result } = renderHook(() => {
            let prop = useObservableProperty(obj, 'prop');
            if (obj.prop === 'foo') {
                obj.prop = 'bar';
            }
            return prop;
        });
        expect(result.all).toEqual(['foo', 'bar']);
    });

    it('should cause component to render once when used multiple times', async () => {
        const obj = { prop1: 'foo', prop2: 'bar' };
        const { result, waitForNextUpdate } = renderHook(() => {
            let prop1 = useObservableProperty(obj, 'prop1');
            let prop2 = useObservableProperty(obj, 'prop2');
            return { prop1, prop2 };
        });
        obj.prop1 = 'foo1';
        obj.prop2 = 'bar1';
        await waitForNextUpdate();
        expect(result.current).toEqual({ prop1: 'foo1', prop2: 'bar1' });
        expect(result.all.length).toBe(2);
    });
});

describe('useAsync', () => {
    it('should be initially in loading state and value is undefined', async () => {
        const { result, waitForNextUpdate } = renderHook(() => useAsync(() => Promise.resolve(true)));
        expect(result.current[0]).toBeUndefined();
        expect(result.current[1]).toMatchObject({
            loading: true,
            error: undefined
        });
        await waitForNextUpdate();
    });

    it('should update value and set loading state to false when promise is fulfilled', async () => {
        const obj = {};
        const promise = Promise.resolve(obj);
        const { result } = renderHook(() => useAsync(() => promise));
        await act(async () => void await promise);

        expect(result.current[0]).toBe(obj);
        expect(result.current[1]).toMatchObject({
            loading: false,
            error: undefined
        });
    });

    it('should set error state to the rejected value when promise is rejected', async () => {
        const error = new Error();
        const promise = Promise.reject(error);
        const { result } = renderHook(() => useAsync(() => promise));
        catchAsync(result.current[1].promise);

        await act(async () => void await catchAsync(promise));
        expect(result.current[0]).toBe(undefined);
        expect(result.current[1]).toMatchObject({
            loading: false,
            error: error
        });
    });

    it('should invoke callback when calling refresh and set value to the latest value', async () => {
        const cb = mockFn().mockResolvedValueOnce('foo').mockResolvedValueOnce('bar');
        const { result } = renderHook(() => useAsync(cb));

        await act(async () => delay());
        expect(result.current[0]).toBe('foo');

        await act(async () => result.current[1].refresh());
        await act(async () => delay());
        expect(result.current[0]).toBe('bar');
    });

    it('should return result from latest call', async () => {
        const promise1 = delay(100).then(() => 'foo');
        const promise2 = delay(500).then(() => 'bar');
        const cb = mockFn().mockReturnValueOnce(promise1).mockReturnValueOnce(promise2);
        const { result } = renderHook(() => useAsync(cb));

        await act(async () => delay());
        result.current[1].refresh();

        await act(async () => void await promise2);
        expect(cb).toBeCalledTimes(2);
        expect(result.current[0]).toBe('bar');
    });

    it('should invoke onError handler when promise is rejected', async () => {
        const cb = mockFn();
        const error = new Error();
        const promise = Promise.reject(error);
        const { result } = renderHook(() => useAsync(() => promise));
        result.current[1].onError(cb);
        catchAsync(result.current[1].promise);

        await act(async () => void await catchAsync(promise));
        verifyCalls(cb, [[error]]);
    });

    it('should not emit error event when promise is rejected', async () => {
        const cb = mockFn();
        const error = new Error();
        const promise = Promise.reject(error);
        const Component = function () {
            const ref = useRef();
            const [, state] = useAsync(() => promise);
            useEffect(() => {
                return dom.on(ref.current, 'error', cb);
            }, []);
            return (<div ref={combineRef(ref, state.elementRef)}></div>);
        };
        render(<Component />);

        await reactAct(async () => void await catchAsync(promise));
        expect(cb).not.toBeCalled();
    });

    it('should not emit error event when error is handled by onError handler', async () => {
        const cb = mockFn().mockReturnValue(true);
        const error = new Error();
        const promise = Promise.reject(error);
        const Component = function () {
            const ref = useRef();
            const [, state] = useAsync(() => promise);
            useEffect(() => {
                return state.onError(() => true);
            }, [state]);
            useEffect(() => {
                return dom.on(ref.current, 'error', cb);
            }, []);
            return (<div ref={combineRef(ref, state.elementRef)}></div>);
        };
        render(<Component />);

        await reactAct(async () => void await catchAsync(promise));
        expect(cb).not.toBeCalled();
    });
});

describe('useRefInitCallback', () => {
    it('should invoke callback on the same element exactly once', () => {
        const init = mockFn();
        const Component = function ({ value }) {
            return (<div ref={useRefInitCallback(init)}></div>);
        };
        const { rerender } = render(<Component value="foo" />);
        expect(init).toBeCalledTimes(1);

        rerender(<Component value="bar" />);
        expect(init).toBeCalledTimes(1);
    });
});

describe('useDispose', () => {
    it('should invoke pushed callbacks when component is unmounted', () => {
        const cb = mockFn();
        const { result, unmount } = renderHook(() => useDispose());
        result.current.push(cb);
        unmount();
        expect(cb).toBeCalledTimes(1);
    });

    it('should invoke pushed callbacks when function is called', () => {
        const cb = mockFn();
        const { result } = renderHook(() => useDispose());
        result.current.push(cb);
        result.current();
        expect(cb).toBeCalledTimes(1);
    });

    it('should invoke pushed callbacks exactly once', () => {
        const cb = mockFn();
        const { result } = renderHook(() => useDispose());
        result.current.push(cb);
        result.current();
        result.current();
        expect(cb).toBeCalledTimes(1);
    });
});
