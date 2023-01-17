import React from "react";
import { jest } from "@jest/globals";
import { act, renderHook } from '@testing-library/react-hooks'
import { DataView, useDataView } from "src/dataView";
import { ViewStateProvider } from "src/viewState";
import { mockFn, verifyCalls, _ } from "@misonou/test-utils";

const { objectContaining } = expect;

Object.defineProperty(DataView, 'pageSize', {
    configurable: true,
    enumerable: true,
    get() {
        return 0;
    },
    set() { }
});

const defaultPageSize = jest.spyOn(DataView, 'pageSize', 'get');

function items(...arr) {
    return arr.map(foo => ({ foo }));
}

describe('useDataView', () => {
    it('should have correct default property values', () => {
        const { result, unmount } = renderHook(() => useDataView({}));
        expect(result.current.pageIndex).toEqual(0);
        expect(result.current.pageSize).toEqual(0);
        expect(result.current.itemCount).toEqual(0);
        expect(result.current.sortBy).toBeUndefined();
        expect(result.current.sortOrder).toBeUndefined();
        unmount();
    });

    it('should default order to asc when sortBy is not empty', () => {
        const { result, unmount } = renderHook(() => useDataView({}, 'foo'));
        expect(result.current.pageIndex).toEqual(0);
        expect(result.current.pageSize).toEqual(0);
        expect(result.current.itemCount).toEqual(0);
        expect(result.current.sortBy).toEqual('foo');
        expect(result.current.sortOrder).toEqual('asc');
        unmount();
    });

    it('should get default page size from DataView.pageSize if not specified', () => {
        const { unmount } = renderHook(() => useDataView({}));
        expect(defaultPageSize).toBeCalledTimes(1);
        unmount();
    });

    it('should not get default page size if pageSize is 0', () => {
        const { unmount } = renderHook(() => useDataView({}, '', undefined, 0));
        expect(defaultPageSize).not.toBeCalled();
        unmount();
    });

    it('should trigger component update when property of filter is updated', async () => {
        const { result, unmount, waitForNextUpdate } = renderHook(() => useDataView({ foo: 1 }));
        act(() => {
            result.current.filters.foo = 2;
        });
        await waitForNextUpdate();
        expect(result.all.length).toBeGreaterThan(1);
        unmount();
    });

    it('should trigger component update when pageIndex is updated', async () => {
        const { result, unmount, waitForNextUpdate } = renderHook(() => useDataView({}));
        act(() => {
            result.current.pageIndex = 1;
        });
        await waitForNextUpdate();
        expect(result.all.length).toBe(2);
        unmount();
    });

    it('should trigger component update when pageSize is updated', async () => {
        const { result, unmount, waitForNextUpdate } = renderHook(() => useDataView({}));
        act(() => {
            result.current.pageSize = 1;
        });
        await waitForNextUpdate();
        expect(result.all.length).toBe(2);
        unmount();
    });

    it('should trigger component update when sortBy is updated', async () => {
        const { result, unmount, waitForNextUpdate } = renderHook(() => useDataView({}));
        act(() => {
            result.current.sortBy = 'foo';
        });
        await waitForNextUpdate();
        expect(result.all.length).toBe(2);
        unmount();
    });

    it('should trigger component update when sortOrder is updated', async () => {
        const { result, unmount, waitForNextUpdate } = renderHook(() => useDataView({}));
        act(() => {
            result.current.sortOrder = 'desc';
        });
        await waitForNextUpdate();
        expect(result.all.length).toBe(2);
        unmount();
    });

    it('should cache filtered and sorted result', async () => {
        const { result, unmount } = renderHook(() => ({
            dataView: useDataView({ foo: 1 }, 'foo', 'asc'),
            forceUpdate: React.useState({})[1]
        }));
        const cb = mockFn();
        const items = [{}];

        result.current.dataView.getView(items, cb);
        act(() => result.current.forceUpdate({}));

        result.current.dataView.getView(items, cb);
        expect(cb).toBeCalledTimes(1);
        unmount();
    });

    it('should invoke callback with filter, and sorting field as parameter', () => {
        const { result, unmount } = renderHook(() => useDataView({ foo: 1 }, 'foo', 'asc'));
        const cb = mockFn();
        const items = [{}];
        result.current.getView(items, cb);
        expect(cb).toBeCalledWith(items, { foo: 1 }, 'foo', 'asc');
        unmount();
    });

    it('should invoke callback again when filter is changed', async () => {
        const { result, unmount, waitForNextUpdate } = renderHook(() => ({
            dataView: useDataView({ foo: 1 }, 'foo', 'asc'),
            forceUpdate: React.useState({})[1]
        }));
        const cb = mockFn();
        const items = [{}];

        result.current.dataView.getView(items, cb);
        result.current.dataView.filters.foo = 2;
        await waitForNextUpdate();

        result.current.dataView.getView(items, cb);
        expect(cb).toBeCalledTimes(2);
        unmount();
    });

    it('should not invoke callback when array is empty or undefined', () => {
        const { result, unmount } = renderHook(() => useDataView({ foo: 1 }, 'foo', 'asc'));
        const cb = mockFn();
        result.current.getView([], cb);
        result.current.getView(undefined, cb);
        expect(cb).not.toBeCalled();
        unmount();
    });

    it('should page items if pageSize is not 0', () => {
        const { result, unmount } = renderHook(() => useDataView({ foo: 1 }, 'foo', 'asc', 2));
        result.current.pageIndex = 1;
        expect(result.current.getView([1, 2, 3, 4, 5], v => v)[0]).toEqual([3, 4]);
        result.current.pageIndex = 2;
        expect(result.current.getView([1, 2, 3, 4, 5], v => v)[0]).toEqual([5]);
        result.current.pageIndex = 3;
        expect(result.current.getView([1, 2, 3, 4, 5], v => v)[0]).toEqual([]);
        unmount();
    });

    it('should initialize with persisted properties using default key', () => {
        const initProps = {
            filters: { foo: 2 },
            pageIndex: 1,
            pageSize: 20,
            sortBy: 'bar',
            sortOrder: 'desc'
        };
        const viewState = {
            get: mockFn().mockReturnValue(initProps),
            set: mockFn(),
        };
        const getState = mockFn().mockReturnValue(viewState);
        const { result, unmount } = renderHook(() => useDataView({ foo: 1 }, 'foo', 'asc'), {
            wrapper: ({ children }) => (
                <ViewStateProvider value={{ getState }}>{children}</ViewStateProvider>
            )
        });
        verifyCalls(getState, [[_, '__dataView']]);
        expect(viewState.get).toBeCalledTimes(1);
        expect(result.current).toEqual(expect.objectContaining(initProps));
        unmount();
    });

    it('should initialize with persisted properties using specified key', () => {
        const initProps = {
            filters: { foo: 2 },
            pageIndex: 1,
            pageSize: 20,
            sortBy: 'bar',
            sortOrder: 'desc'
        };
        const viewState = {
            get: mockFn().mockReturnValue(initProps),
            set: mockFn(),
        };
        const getState = mockFn().mockReturnValue(viewState);
        const { result, unmount } = renderHook(() => useDataView('persisted', { foo: 1 }, 'foo', 'asc'), {
            wrapper: ({ children }) => (
                <ViewStateProvider value={{ getState }}>{children}</ViewStateProvider>
            )
        });
        verifyCalls(getState, [[_, 'persisted']]);
        expect(viewState.get).toBeCalledTimes(1);
        expect(result.current).toEqual(expect.objectContaining(initProps));
        unmount();
    });

    it('should persist current and populate new properties in onPopState event', () => {
        const viewState = {
            get: mockFn(),
            set: mockFn(),
            onPopState: mockFn(),
        };
        const { result, unmount } = renderHook(() => useDataView({ foo: 1 }, 'foo', 'asc'), {
            wrapper: ({ children }) => (
                <ViewStateProvider value={{ getState: () => viewState }}>{children}</ViewStateProvider>
            )
        });
        expect(viewState.onPopState).toBeCalledTimes(1);

        const callback = viewState.onPopState.mock.calls[0][0];
        expect(callback).toBeInstanceOf(Function);

        const initProps = {
            filters: { foo: 1 },
            pageIndex: 0,
            pageSize: DataView.pageSize,
            sortBy: 'foo',
            sortOrder: 'asc'
        };
        const newProps = {
            filters: { foo: 2 },
            pageIndex: 1,
            pageSize: 20,
            sortBy: 'bar',
            sortOrder: 'desc'
        };
        callback(newProps);
        expect(result.current).toEqual(expect.objectContaining(newProps));
        verifyCalls(viewState.set, [[expect.objectContaining(initProps)]]);

        viewState.set.mockClear();
        callback();
        expect(result.current).toEqual(expect.objectContaining(initProps));
        verifyCalls(viewState.set, [[expect.objectContaining(newProps)]]);
        unmount();
    });
});

describe('DataView', () => {
    it('should trigger viewChange event when property of filter is updated', async () => {
        const cb = mockFn();
        const { result, unmount, waitForNextUpdate } = renderHook(() => useDataView({ foo: 1 }));
        result.current.on('viewChange', cb);
        act(() => {
            result.current.filters.foo = 2;
        });
        await waitForNextUpdate();
        verifyCalls(cb, [[objectContaining({ type: 'viewChange' }), result.current]]);
        unmount();
    });

    it('should trigger viewChange event when pageIndex is updated', async () => {
        const cb = mockFn();
        const { result, unmount, waitForNextUpdate } = renderHook(() => useDataView({}));
        result.current.on('viewChange', cb);
        act(() => {
            result.current.pageIndex = 1;
        });
        await waitForNextUpdate();
        verifyCalls(cb, [[objectContaining({ type: 'viewChange' }), result.current]]);
        unmount();
    });

    it('should trigger viewChange event when pageSize is updated', async () => {
        const cb = mockFn();
        const { result, unmount, waitForNextUpdate } = renderHook(() => useDataView({}));
        result.current.on('viewChange', cb);
        act(() => {
            result.current.pageSize = 1;
        });
        await waitForNextUpdate();
        verifyCalls(cb, [[objectContaining({ type: 'viewChange' }), result.current]]);
        unmount();
    });

    it('should trigger viewChange event when sortBy is updated', async () => {
        const cb = mockFn();
        const { result, unmount, waitForNextUpdate } = renderHook(() => useDataView({}));
        result.current.on('viewChange', cb);
        act(() => {
            result.current.sortBy = 'foo';
        });
        await waitForNextUpdate();
        verifyCalls(cb, [[objectContaining({ type: 'viewChange' }), result.current]]);
        unmount();
    });

    it('should trigger viewChange event when sortOrder is updated', async () => {
        const cb = mockFn();
        const { result, unmount, waitForNextUpdate } = renderHook(() => useDataView({}));
        result.current.on('viewChange', cb);
        act(() => {
            result.current.sortOrder = 'desc';
        });
        await waitForNextUpdate();
        verifyCalls(cb, [[objectContaining({ type: 'viewChange' }), result.current]]);
        unmount();
    });
});

describe('DataView#getView', () => {
    it('should sort items if callback is not supplied', () => {
        const items = [
            { foo: 4 },
            { foo: 3 },
            { foo: 2 },
            { foo: 1 },
        ]
        const { result, unmount } = renderHook(() => useDataView({ foo: 1 }, 'foo', 'asc'));
        expect(result.current.getView(items)[0]).toEqual(items.slice().reverse());
        unmount();
    });
});

describe('DataView#sort', () => {
    it('should sort items using property named by sortBy', () => {
        const items = [
            { foo: 4 },
            { foo: 3 },
            { foo: 2 },
            { foo: 1 },
        ]
        const { result, unmount } = renderHook(() => useDataView({ foo: 1 }, 'foo', 'asc'));
        expect(result.current.getView(items, v => result.current.sort(v))[0]).toEqual(items.slice().reverse());
        unmount();
    });

    it('should sort items using specified property', () => {
        const items = [
            { foo: 1, bar: 4 },
            { foo: 2, bar: 3 },
            { foo: 3, bar: 2 },
            { foo: 4, bar: 1 },
        ]
        const { result, unmount } = renderHook(() => useDataView({ foo: 1 }, 'foo', 'asc'));
        expect(result.current.getView(items, v => result.current.sort(v, 'bar'))[0]).toEqual(items.slice().reverse());
        unmount();
    });

    it('should sort items using returned value from callback for each items', () => {
        const items = [
            { foo: 1 },
            { foo: 2 },
            { foo: 3 },
            { foo: 4 },
        ]
        const { result, unmount } = renderHook(() => useDataView({ foo: 1 }));
        expect(result.current.getView(items, v => result.current.sort(v, v => 5 - v.foo))[0]).toEqual(items.slice().reverse());
        unmount();
    });

    it('should sort items using multiple returned values from callback for each items', () => {
        const items = [
            { foo: 1, bar: 1 },
            { foo: 0, bar: 0 },
            { foo: 1, bar: 0 },
            { foo: 0, bar: 1 },
        ]
        const { result, unmount } = renderHook(() => useDataView({ foo: 1 }));
        expect(result.current.getView(items, v => result.current.sort(v, v => [v.foo, v.bar]))[0]).toEqual([items[1], items[3], items[2], items[0]]);
        unmount();
    });

    it('should sort items in reversed order if sortOrder is desc', () => {
        const items = [
            { foo: 1 },
            { foo: 2 },
            { foo: 3 },
            { foo: 4 },
        ]
        const { result, unmount } = renderHook(() => useDataView({ foo: 1 }, 'foo', 'desc'));
        expect(result.current.getView(items, v => result.current.sort(v))[0]).toEqual(items.slice().reverse());
        unmount();
    });

    it('should maintain previous order for items that have equal order in current order', async () => {
        const items = [
            { foo: 0, bar: 1, baz: 0 },
            { foo: 1, bar: 1, baz: 0 },
            { foo: 1, bar: 0, baz: 0 },
            { foo: 0, bar: 0, baz: 0 },
        ]
        const { result, unmount, waitForNextUpdate } = renderHook(() => useDataView({ foo: 1 }, 'bar', 'asc'));
        expect(result.current.getView(items, v => result.current.sort(v))[0]).toEqual([items[2], items[3], items[0], items[1]]);

        act(() => {
            result.current.sortBy = 'foo';
            result.current.sortOrder = 'desc';
        });
        await waitForNextUpdate();
        expect(result.current.getView(items, v => result.current.sort(v))[0]).toEqual([items[2], items[1], items[3], items[0]]);

        act(() => {
            result.current.sortBy = 'baz';
        });
        await waitForNextUpdate();
        expect(result.current.getView(items, v => result.current.sort(v))[0]).toEqual([items[2], items[1], items[3], items[0]]);
        unmount();
    });

    it('should maintain current order if sortBy is empty', async () => {
        const { result, unmount } = renderHook(() => useDataView({}, '', 'asc'));
        expect(result.current.sort(items(4, 3, 2, 1))).toEqual(items(4, 3, 2, 1));
        unmount();
    });

    it('should sort undefined and null values first', () => {
        const { result, unmount } = renderHook(() => useDataView({}, 'foo', 'asc'));
        expect(result.current.sort(items(1, 2, undefined, null, 0))).toEqual(items(undefined, null, 0, 1, 2));
        unmount();
    });

    it('should sort string values case-insensitively', () => {
        const { result, unmount } = renderHook(() => useDataView({}, 'foo', 'asc'));
        expect(result.current.sort(items('aaa', 'Aaa', 'aAa'))).toEqual(items('Aaa', 'aAa', 'aaa'));
        unmount();
    });
});

describe('DataView#reset', () => {
    it('should reset properties to default values', () => {
        const { result, unmount } = renderHook(() => useDataView({ foo: 1 }, 'foo', 'asc'));
        Object.assign(result.current, {
            filters: { foo: 2 },
            pageIndex: 1,
            pageSize: 20,
            sortBy: 'bar',
            sortOrder: 'desc'
        });
        result.current.reset();
        expect(result.current).toEqual(expect.objectContaining({
            filters: { foo: 1 },
            pageIndex: 0,
            pageSize: DataView.pageSize,
            sortBy: 'foo',
            sortOrder: 'asc'
        }));
        unmount();
    });

    it('should reset properties to default values, not initial values', () => {
        const viewState = {
            get: mockFn().mockReturnValue({
                filters: { foo: 2 },
                pageIndex: 1,
                pageSize: 20,
                sortBy: 'bar',
                sortOrder: 'desc'
            }),
            set: mockFn()
        };
        const { result, unmount } = renderHook(() => useDataView({ foo: 1 }, 'foo', 'asc'), {
            wrapper: ({ children }) => (
                <ViewStateProvider value={{ getState: () => viewState }}>{children}</ViewStateProvider>
            )
        });
        result.current.reset();
        expect(result.current).toEqual(expect.objectContaining({
            filters: { foo: 1 },
            pageIndex: 0,
            pageSize: DataView.pageSize,
            sortBy: 'foo',
            sortOrder: 'asc'
        }));
        unmount();
    });
});
