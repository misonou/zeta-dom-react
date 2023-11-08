import React from "react";
import { jest } from "@jest/globals";
import { renderHook } from '@testing-library/react-hooks'
import { after, mockFn } from "@misonou/test-utils";
import { useViewState, ViewStateProvider } from "src/viewState";

describe('useViewState', () => {
    it('should call dispose on previous state object when a different state object is returned', async () => {
        const getState = mockFn();
        const state1 = {
            get() { },
            set() { },
            dispose: mockFn()
        };
        getState.mockReturnValueOnce(state1);

        const { rerender } = renderHook(() => useViewState('test'), {
            wrapper: ({ children }) => (
                <ViewStateProvider value={{ getState }}>{children}</ViewStateProvider>
            )
        });
        getState.mockReturnValueOnce({
            get() { },
            set() { }
        });
        await after(async () => rerender());
        expect(state1.dispose).toBeCalledTimes(1);
    });

    it('should call dispose on current state object when unmount', async () => {
        const getState = mockFn();
        const state1 = {
            get() { },
            set() { },
            dispose: mockFn()
        };
        getState.mockReturnValueOnce(state1);

        const { unmount } = renderHook(() => useViewState('test'), {
            wrapper: ({ children }) => (
                <ViewStateProvider value={{ getState }}>{children}</ViewStateProvider>
            )
        });
        await after(async () => unmount());
        expect(state1.dispose).toBeCalledTimes(1);
    });
});
