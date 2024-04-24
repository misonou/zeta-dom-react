import React, { useEffect, useReducer, useRef, useState } from "react";
import { act as reactAct, render, screen } from "@testing-library/react";
import { act, renderHook } from '@testing-library/react-hooks'
import { catchAsync, errorWithCode } from "zeta-dom/util";
import { ZetaEventContainer } from "zeta-dom/events";
import dom from "zeta-dom/dom";
import { combineRef } from "src/util";
import { isSingletonDisposed, useAsync, useDispose, useEagerReducer, useEagerState, useErrorHandler, useEventTrigger, useMemoizedFunction, useObservableProperty, useRefInitCallback, useSingleton, useUnloadEffect, useUpdateTrigger, useValueTrigger } from "src/hooks";
import { delay, mockFn, verifyCalls, _, after } from "@misonou/test-utils";

describe('useEagerReducer', () => {
    it('should act like useReducer', () => {
        const cb = mockFn().mockReturnValue(3);
        const { result, unmount } = renderHook(() => useEagerReducer(cb, 1));
        expect(result.current[0]).toBe(1);
        expect(result.current[1]).toBeInstanceOf(Function);

        act(() => result.current[1](2));
        expect(result.current[0]).toBe(3);
        expect(cb).toBeCalledWith(1, 2);
        unmount();
    });

    it('should accept callback to initialize state', () => {
        const { result, unmount } = renderHook(() => useEagerReducer(() => 2, () => 1));
        expect(result.current[0]).toBe(1);
        unmount();
    });

    it('should invoke reducer and bail out eagerly', () => {
        const run = (useReducerCallback, expected) => {
            const { result, unmount } = renderHook(() => useReducerCallback((v, a) => v + a, 1));
            const updateState = result.current[1];
            act(() => updateState(1));
            act(() => updateState(0));
            expect(result.all.length).toBe(expected);
            unmount();
        };
        run(useReducer, 3);
        run(useEagerReducer, 2);
    });
});

describe('useEagerState', () => {
    it('should act like useState', () => {
        const { result, unmount } = renderHook(() => useEagerState(1));
        expect(result.current[0]).toBe(1);
        expect(result.current[1]).toBeInstanceOf(Function);

        act(() => result.current[1](2));
        expect(result.current[0]).toBe(2);
        unmount();
    });

    it('should accept callback to initialize state', () => {
        const { result, unmount } = renderHook(() => useEagerState(() => 1));
        expect(result.current[0]).toBe(1);
        unmount();
    });

    it('should initialize state to undefined if not specified', () => {
        const { result, unmount } = renderHook(() => useEagerState());
        expect(result.current[0]).toBeUndefined();
        unmount();
    });

    it('should accept callback for set state action', () => {
        const { result, unmount } = renderHook(() => useEagerState(1));
        expect(result.current[0]).toBe(1);

        const cb = mockFn().mockReturnValue(2);
        act(() => result.current[1](cb));
        expect(result.current[0]).toBe(2);
        expect(cb).toBeCalledWith(1);
        unmount();
    });

    it('should invoke callback and bail out eagerly', () => {
        const run = (useStateCallback, expected) => {
            const { result, unmount } = renderHook(() => useStateCallback(1));
            const setState = result.current[1];
            act(() => setState(v => ++v));
            act(() => setState(v => v));
            expect(result.all.length).toBe(expected);
            unmount();
        };
        run(useState, 3);
        run(useEagerState, 2);
    });
});

describe('useUpdateTrigger', () => {
    it('should invoke effect with callback that triggers re-render', () => {
        const { result, unmount } = renderHook(() => useUpdateTrigger());
        expect(result.current).toBeInstanceOf(Function);
        act(() => result.current());
        expect(result.all.length).toBe(2);
        unmount();
    });
});

describe('useValueTrigger', () => {
    it('should invoke effect with callback that triggers re-render when states differ', () => {
        const { result, unmount } = renderHook(() => useValueTrigger(1));
        act(() => result.current(1));
        expect(result.all.length).toBe(1);
        act(() => result.current(2));
        expect(result.all.length).toBe(2);
        unmount();
    });

    it('should trigger re-render when current and previous value is 0 and -0', () => {
        const { result, unmount } = renderHook(() => useValueTrigger(0));
        act(() => result.current(-0));
        expect(result.all.length).toBe(2);
        unmount();
    });

    it('should not trigger re-render when current and previous value is both NaN', () => {
        const { result, unmount } = renderHook(() => useValueTrigger(NaN));
        act(() => result.current(NaN));
        expect(result.all.length).toBe(1);
        unmount();
    });
});

describe('useEventTrigger', () => {
    it('should trigger component update when event is fired from DOM object', () => {
        const { result, unmount } = renderHook(() => useEventTrigger(window, 'test'));
        expect(result.current).toBeUndefined();

        act(() => window.dispatchEvent(new CustomEvent('test')));
        expect(result.all.length).toBe(2);
        expect(result.current).toBeUndefined();
        unmount();
    });

    it('should trigger component update when event is fired from custom object', () => {
        const emitter = new ZetaEventContainer();
        const obj = {
            on(handlers) {
                return emitter.add(this, handlers);
            }
        };
        const { result, unmount } = renderHook(() => useEventTrigger(obj, 'test'));
        expect(result.current).toBeUndefined();

        act(() => emitter.emit('test', obj));
        expect(result.all.length).toBe(2);
        expect(result.current).toBeUndefined();
        unmount();
    });

    it('should trigger component update when any event is fired from DOM object', () => {
        const { result, unmount } = renderHook(() => useEventTrigger(window, 'test1 test2'));
        expect(result.current).toBeUndefined();

        act(() => window.dispatchEvent(new CustomEvent('test1')));
        expect(result.all.length).toBe(2);
        expect(result.current).toBeUndefined();

        act(() => window.dispatchEvent(new CustomEvent('test2')));
        expect(result.all.length).toBe(3);
        expect(result.current).toBeUndefined();
        unmount();
    });

    it('should trigger component update when any event is fired from custom object', () => {
        const emitter = new ZetaEventContainer();
        const obj = {
            on(handlers) {
                return emitter.add(this, handlers);
            }
        };
        const { result, unmount } = renderHook(() => useEventTrigger(obj, 'test1 test2'));
        expect(result.current).toBeUndefined();

        act(() => emitter.emit('test1', obj));
        expect(result.all.length).toBe(2);
        expect(result.current).toBeUndefined();

        act(() => emitter.emit('test2', obj));
        expect(result.all.length).toBe(3);
        expect(result.current).toBeUndefined();
        unmount();
    });

    it('should invoke callback and update state to returned value', () => {
        const emitter = new ZetaEventContainer();
        const obj = {
            on(handlers) {
                return emitter.add(this, handlers);
            }
        };
        const cb = mockFn(e => e.data);
        const { result, unmount } = renderHook(() => useEventTrigger(obj, 'test', cb));
        expect(result.current).toBeUndefined();

        act(() => emitter.emit('test', obj, 'foo'));
        expect(result.all.length).toBe(2);
        expect(result.current).toBe('foo');

        act(() => emitter.emit('test', obj, 'bar'));
        expect(result.all.length).toBe(3);
        expect(result.current).toBe('bar');

        verifyCalls(cb, [
            [expect.objectContaining({ type: 'test', data: 'foo' }), undefined],
            [expect.objectContaining({ type: 'test', data: 'bar' }), 'foo']
        ]);
        unmount();
    });

    it('should set initial state', () => {
        const { result, unmount } = renderHook(() => useEventTrigger(window, 'test', () => 'bar', 'foo'));
        expect(result.current).toBe('foo');
        unmount();
    });
});

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

    it('should not throw if argument is not function', () => {
        const { result, rerender } = renderHook(({ cb }) => useMemoizedFunction(cb), {
            initialProps: { cb: undefined }
        });
        expect(result.current()).toBeUndefined();
        rerender({ cb: null });
        expect(result.current()).toBeUndefined();
        rerender({ cb: true });
        expect(result.current()).toBeUndefined();
        rerender({ cb: 'true' });
        expect(result.current()).toBeUndefined();
        rerender({ cb: 1 });
        expect(result.current()).toBeUndefined();
        rerender({ cb: {} });
        expect(result.current()).toBeUndefined();
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

    it('should be initially not in loading state and value is undefined if second argument is false', async () => {
        const { result } = renderHook(() => useAsync(() => Promise.resolve(true), false));
        expect(result.current[0]).toBeUndefined();
        expect(result.current[1]).toMatchObject({
            loading: false,
            error: undefined
        });
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

    it('should trigger component updates at the start and end of loading', async () => {
        const promise1 = delay(100).then(() => 'foo');
        const promise2 = delay(500).then(() => 'bar');
        const cb = mockFn().mockReturnValueOnce(promise1).mockReturnValueOnce(promise2);
        const { result, waitForNextUpdate } = renderHook(() => useAsync(cb));
        await waitForNextUpdate();

        const state = result.current[1];
        expect(result.all.length).toBe(2);
        expect(state.loading).toBe(false);

        state.refresh();
        await waitForNextUpdate();
        expect(result.all.length).toBe(3);
        expect(state.loading).toBe(true);

        await act(async () => void await promise2);
        expect(result.all.length).toBe(4);
        expect(state.loading).toBe(false);
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

    it('should invoke callback only once after consecutive re-render', async () => {
        const cb = mockFn();
        const { rerender } = renderHook(({ value }) => useAsync(() => cb(value), [value]), {
            initialProps: { value: 1 }
        });
        rerender({ value: 2 });
        await 0;
        verifyCalls(cb, [[2]]);
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

    it('should emit load event when promise is resolved', async () => {
        const cb = mockFn();
        const promise = Promise.resolve(42);
        const { result } = renderHook(() => useAsync(() => promise));
        result.current[1].on('load', cb);

        await act(async () => void await promise);
        verifyCalls(cb, [
            [expect.objectContaining({ data: 42 }), expect.sameObject(result.current[1])]
        ]);
    });

    it('should emit error event when promise is rejected', async () => {
        const cb = mockFn();
        const error = new Error();
        const promise = Promise.reject(error);
        const { result } = renderHook(() => useAsync(() => promise));
        result.current[1].on('error', cb);

        await act(async () => void await catchAsync(promise));
        verifyCalls(cb, [
            [expect.objectContaining({ error }), expect.sameObject(result.current[1])]
        ]);
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

    it('should emit unhandled error event when promise is rejected', async () => {
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
        expect(cb).toBeCalledTimes(1);
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

    it('should delay callback invocation and return same result when debounce interval is specified', async () => {
        const cb = mockFn().mockImplementation(() => Promise.resolve(Date.now()));
        const { result } = renderHook(() => useAsync(cb, false, 500));

        const t1 = Date.now();
        const promise = result.current[1].refresh();
        expect(result.current[1].loading).toBe(false);
        expect(cb).not.toBeCalled();

        await delay(100);
        expect(result.current[1].refresh()).toBe(promise);
        expect(result.current[1].loading).toBe(false);
        expect(cb).not.toBeCalled();

        const t2 = await promise;
        expect(cb).toBeCalledTimes(1);
        expect(t2 - t1).toBeGreaterThan(500);
    });

    it('should send abort signal and keep current value', async () => {
        const cb = mockFn()
            .mockResolvedValueOnce(42)
            .mockResolvedValueOnce(43)
        const { result } = renderHook(() => useAsync(cb, []));

        await delay();
        expect(result.current[0]).toBe(42);

        result.current[1].refresh();
        const signal1 = cb.mock.calls[1][0];

        result.current[1].abort('reason');
        expect(signal1.aborted).toBe(true);
        expect(result.current[1].loading).toBe(false);
        expect(result.current[1].value).toBe(42);
        expect(result.current[0]).toBe(42);
        expect(cb).toBeCalledTimes(2);
    });

    it('should send abort signal when refresh is called again before previous returned', async () => {
        const onabort = mockFn();
        const cb = mockFn((signal) => {
            signal.onabort = onabort;
            return delay(500);
        });
        const { result } = renderHook(() => useAsync(cb, false));

        result.current[1].refresh();
        const signal1 = cb.mock.calls[0][0];

        result.current[1].refresh();
        const signal2 = cb.mock.calls[1][0];

        expect(signal1.aborted).toBe(true);
        expect(signal2.aborted).toBe(false);
        expect(onabort).toBeCalledTimes(1);
    });

    it('should send abort signal when unmount', async () => {
        const onabort = mockFn();
        const cb = mockFn((signal) => {
            signal.onabort = onabort;
            return delay(500);
        });
        const { result, unmount } = renderHook(() => useAsync(cb, false));

        result.current[1].refresh();
        const signal1 = cb.mock.calls[0][0];
        unmount();

        await delay();
        expect(signal1.aborted).toBe(true);
        expect(cb).toBeCalledTimes(1);
        expect(onabort).toBeCalledTimes(1);
    });

    it('should not cause unhandledrejection event when error is handled', async () => {
        const cb = mockFn(() => Promise.reject(new Error()));
        const { result, rerender } = renderHook(({ deps }) => useAsync(cb, deps, 100), {
            initialProps: { deps: [1] }
        });
        result.current[1].on('error', e => e.handled());
        rerender({ deps: [2] });
        await delay(200);
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

describe('useSingleton', () => {
    it('should dispose object exactly once in non-strict mode', async () => {
        const dispose = mockFn();
        const getSingleton = mockFn(() => ({ dispose }));
        const Component = () => {
            useSingleton(getSingleton);
            return null;
        };
        const { unmount } = render(<Component />);
        unmount();
        expect(getSingleton).toBeCalledTimes(1);
        await delay();
        expect(dispose).toBeCalledTimes(1);
    });

    it('should dispose object exactly once in strict mode', async () => {
        const dispose = mockFn();
        const getSingleton = mockFn(() => ({ dispose }));
        const Component = () => {
            useSingleton(getSingleton);
            return null;
        };
        const { unmount } = render(<Component />, { wrapper: React.StrictMode });
        const times = process.env.NODE_ENV === 'production' ? 1 : 2;
        unmount();
        expect(getSingleton).toBeCalledTimes(times);
        await delay();
        expect(dispose).toBeCalledTimes(times);
    });
});

describe('isSingletonDisposed', () => {
    it('should return true if the component is unmounted', async () => {
        const obj = {};
        const Component = () => {
            useSingleton(obj);
            return null;
        };
        const { unmount } = render(<Component />, { wrapper: React.StrictMode });
        expect(isSingletonDisposed(obj)).toBe(false);
        await delay();
        expect(isSingletonDisposed(obj)).toBe(false);
        await after(async () => unmount());
        expect(isSingletonDisposed(obj)).toBe(true);
    });
});

describe('useErrorHandler', () => {
    it('should catch error directly emitted from the instance', async () => {
        const error = new Error();
        const cb = mockFn();
        const Component = function () {
            let errorHandler = useErrorHandler();
            useEffect(() => {
                errorHandler.catch(cb);
            }, [errorHandler]);
            useEffect(() => {
                errorHandler.emit(error);
            });
            return (
                <div ref={errorHandler.ref}></div>
            );
        };
        const { unmount } = render(<Component />);
        verifyCalls(cb, [
            [expect.sameObject(error)]
        ]);
        unmount();
    });

    it('should catch error from child elements', async () => {
        const cb = mockFn();
        const Component = function () {
            let errorHandler = useErrorHandler();
            useEffect(() => {
                errorHandler.catch(cb);
            }, [errorHandler]);
            return (
                <div ref={errorHandler.ref}>
                    <button>button</button>
                </div>
            );
        };
        const { unmount } = render(<Component />);
        const error = new Error();
        dom.emit('error', screen.getByRole('button'), { error }, true);
        verifyCalls(cb, [
            [expect.sameObject(error)]
        ]);
        unmount();
    });

    it('should handle error from child elements', async () => {
        const cb = mockFn().mockReturnValue(true);
        const Component = function () {
            let errorHandler = useErrorHandler();
            useEffect(() => {
                errorHandler.catch(cb);
            }, [errorHandler]);
            return (
                <div ref={errorHandler.ref}>
                    <button>button</button>
                </div>
            );
        };
        const { unmount } = render(<Component />);
        const error = new Error();
        const result = dom.emit('error', screen.getByRole('button'), { error }, true);
        await expect(result).resolves.toBe(true);
        unmount();
    });

    it('should catch error with specific error code', () => {
        const cb = mockFn();
        const Component = function () {
            let errorHandler = useErrorHandler();
            useEffect(() => {
                errorHandler.catch('test', cb);
            }, [errorHandler]);
            return (
                <div ref={errorHandler.ref}>
                    <button>button</button>
                </div>
            );
        };
        const { unmount } = render(<Component />);
        const error = errorWithCode('test');
        dom.emit('error', screen.getByRole('button'), { error }, true);
        dom.emit('error', screen.getByRole('button'), { error: new Error() }, true);
        expect(cb).toBeCalledTimes(1);
        unmount();
    });

    it('should catch error with any specific error code', () => {
        const cb = mockFn();
        const Component = function () {
            let errorHandler = useErrorHandler();
            useEffect(() => {
                errorHandler.catch(['test', 'test2'], cb);
            }, [errorHandler]);
            return (
                <div ref={errorHandler.ref}>
                    <button>button</button>
                </div>
            );
        };
        const { unmount } = render(<Component />);
        dom.emit('error', screen.getByRole('button'), { error: errorWithCode('test') }, true);
        dom.emit('error', screen.getByRole('button'), { error: errorWithCode('test2') }, true);
        dom.emit('error', screen.getByRole('button'), { error: new Error() }, true);
        expect(cb).toBeCalledTimes(2);
        unmount();
    });

    it('should catch error with specific type', () => {
        class CustomError extends Error { }
        const cb = mockFn();
        const Component = function () {
            let errorHandler = useErrorHandler();
            useEffect(() => {
                errorHandler.catch(CustomError, cb);
            }, [errorHandler]);
            return (
                <div ref={errorHandler.ref}>
                    <button>button</button>
                </div>
            );
        };
        const { unmount } = render(<Component />);
        const error = new CustomError();
        dom.emit('error', screen.getByRole('button'), { error }, true);
        dom.emit('error', screen.getByRole('button'), { error: new Error() }, true);
        expect(cb).toBeCalledTimes(1);
        unmount();
    });

    it('should catch error with any specific type', () => {
        class CustomError extends Error { }
        class CustomError2 extends Error { }
        const cb = mockFn();
        const Component = function () {
            let errorHandler = useErrorHandler();
            useEffect(() => {
                errorHandler.catch([CustomError, CustomError2], cb);
            }, [errorHandler]);
            return (
                <div ref={errorHandler.ref}>
                    <button>button</button>
                </div>
            );
        };
        const { unmount } = render(<Component />);
        dom.emit('error', screen.getByRole('button'), { error: new CustomError() }, true);
        dom.emit('error', screen.getByRole('button'), { error: new CustomError2() }, true);
        dom.emit('error', screen.getByRole('button'), { error: new Error() }, true);
        expect(cb).toBeCalledTimes(2);
        unmount();
    });

    it('should catch error from error source', () => {
        const source = {
            callback: null,
            onError(callback) {
                this.callback = callback;
                return () => { };
            }
        };
        const cb = mockFn();
        const Component = function () {
            let errorHandler = useErrorHandler(source);
            useEffect(() => {
                errorHandler.catch(cb);
            }, [errorHandler]);
            return (
                <div ref={errorHandler.ref} />
            );
        };
        const { unmount } = render(<Component />);
        const error = new Error();
        expect(source.callback).toBeInstanceOf(Function);

        source.callback(error);
        verifyCalls(cb, [
            [expect.sameObject(error)]
        ]);
        unmount();
    });

    it('should re-emit unhandled error from error source', () => {
        const source = {
            callback: null,
            onError(callback) {
                this.callback = callback;
                return () => { };
            }
        };
        const cb = mockFn();
        const Component = function () {
            let errorHandler = useErrorHandler(source);
            return (
                <div ref={errorHandler.ref} />
            );
        };
        const { container, unmount } = render(<Component />);
        const error = new Error();
        const unbind = dom.on(container, 'error', cb);

        source.callback(error);
        verifyCalls(cb, [
            [expect.objectContaining({ error }), container]
        ]);
        unmount();
        unbind();
    });

    it('should re-emit unhandled error from error source to root element if ref is not assigned', () => {
        const source = {
            callback: null,
            onError(callback) {
                this.callback = callback;
                return () => { };
            }
        };
        const cb = mockFn();
        const { unmount } = renderHook(() => useErrorHandler(source));
        const unbind = dom.on('error', cb);

        source.callback(new Error());
        expect(cb).toBeCalledTimes(1);
        unmount();
        unbind();
    });
});

describe('useUnloadEffect', () => {
    it('should invoke callback with false when component is being unmounted', async () => {
        const cb = mockFn();
        const Outer = function () {
            useEffect(() => cb('outer'), []);
            useUnloadEffect(v => cb('outer unload', v));
            return <Inner />;
        };
        const Inner = function () {
            useEffect(() => cb('inner'), []);
            useUnloadEffect(v => cb('inner unload', v));
            return <></>;
        };
        const { unmount } = render(<Outer />);

        unmount();
        await 0;
        verifyCalls(cb, [
            ['inner'],
            ['outer'],
            ['outer unload', false],
            ['inner unload', false],
        ]);
    });

    it('should invoke callback with persisted flag on pagehide event', () => {
        const cb = mockFn();
        const Outer = function () {
            useUnloadEffect(v => cb('outer unload', v));
            return <Inner />;
        };
        const Inner = function () {
            useUnloadEffect(v => cb('inner unload', v));
            return <></>;
        };
        const { unmount } = render(<Outer />);

        window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: false }));
        verifyCalls(cb, [
            ['outer unload', false],
            ['inner unload', false],
        ]);

        cb.mockClear();
        window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
        verifyCalls(cb, [
            ['outer unload', true],
            ['inner unload', true],
        ]);
        unmount();
    });

    it('should not invoke callback registered in unmounted component on pagehide event', async () => {
        const cb = mockFn();
        const Outer = function ({ inner }) {
            useUnloadEffect(v => cb('outer unload', v));
            return inner ? <Inner /> : null;
        };
        const Inner = function () {
            useUnloadEffect(v => cb('inner unload', v));
            return <></>;
        };
        const { rerender, unmount } = render(<Outer inner={true} />);
        rerender(<Outer inner={false} />);
        await 0;
        verifyCalls(cb, [['inner unload', false]]);

        cb.mockClear();
        window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
        verifyCalls(cb, [['outer unload', true]]);
        unmount();
    });

    it('should register as multiple instances for the same callback', () => {
        const cb = mockFn();
        const Outer = function () {
            useUnloadEffect(cb);
            return null;
        };
        const { unmount } = render(<><Outer /><Outer /></>);
        window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
        expect(cb).toBeCalledTimes(2);
        unmount();
    });
});
