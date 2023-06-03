import React, { useEffect, useRef } from "react";
import { act as reactAct, render, screen } from "@testing-library/react";
import { act, renderHook } from '@testing-library/react-hooks'
import { catchAsync, errorWithCode, watch } from "src/include/zeta-dom/util";
import dom from "src/include/zeta-dom/dom";
import { combineRef } from "src/util";
import { useAsync, useDispose, useErrorHandler, useMemoizedFunction, useObservableProperty, useRefInitCallback } from "src/hooks";
import { delay, mockFn, verifyCalls, _ } from "@misonou/test-utils";

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
