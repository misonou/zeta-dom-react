import React from "react";
import { jest } from "@jest/globals";
import { act, renderHook } from '@testing-library/react-hooks'
import { createBreakpointContext, useMediaQuery } from "src/css";
import { verifyCalls, _ } from "@misonou/test-utils";

function assertMatchMediaResult() {
    const mq = matchMedia.mock.results[0].value;
    expect(mq.addEventListener).toBeCalledTimes(1);
    expect(mq.addEventListener.mock.calls[0][0]).toBe('change');

    const callback = mq.addEventListener.mock.calls[0][1];
    return { mq, callback };
}

describe('useMediaQuery', () => {
    it('should listen change event of MediaQueryList', () => {
        const { result, unmount } = renderHook(() => useMediaQuery('(max-width: 700px)'));
        verifyCalls(matchMedia, [['(max-width: 700px)']]);
        expect(result.current).toBe(false);

        const { mq, callback } = assertMatchMediaResult();
        mq.matches = true;
        act(() => callback.call(this, { /* callback does not access Event object */ }));
        expect(result.current).toBe(true);
        unmount();
    });
});

describe('createBreakpointContext', () => {
    it('should return and object reflecting current match state', () => {
        const { breakpoints } = createBreakpointContext({
            foo: '(max-width: 700px)',
            bar: '(min-width: 500px)'
        });
        verifyCalls(matchMedia, [
            ['(max-width: 700px)'],
            ['(min-width: 500px)'],
        ]);
        expect(breakpoints).toEqual({
            foo: false,
            bar: false
        });

        const { mq, callback } = assertMatchMediaResult();
        mq.matches = true;
        act(() => callback.call(this, { /* callback does not access Event object */ }));
        expect(breakpoints).toEqual({
            foo: true,
            bar: false
        });
    });

    it('should return hook that trigger component update when any state has changed', () => {
        const { useBreakpoint } = createBreakpointContext({
            foo: '(max-width: 700px)',
            bar: '(min-width: 500px)'
        });
        const { result, unmount } = renderHook(() => useBreakpoint());
        expect(result.current).toEqual({
            foo: false,
            bar: false
        });

        const { mq, callback } = assertMatchMediaResult();
        mq.matches = true;
        act(() => callback.call(this, { /* callback does not access Event object */ }));
        expect(result.all.length).toBe(2);
        expect(result.current).toEqual({
            foo: true,
            bar: false
        });
        unmount();
    });
});
