import React from "react";
import { jest } from "@jest/globals";
import { act, renderHook } from '@testing-library/react-hooks'
import { DataView, useDataView } from "src/dataView";
import { mockFn, verifyCalls } from "./testUtil";
import { async } from "regenerator-runtime";

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
