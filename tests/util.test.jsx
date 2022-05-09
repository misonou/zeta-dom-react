import React, { useState } from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import { partial } from "../src/util";
import { mockFn, verifyCalls } from "./testUtil";

const partialInitialState = {
    prop1: 'true',
    prop2: 'true',
    prop3: 'true',
};

describe('partial', () => {
    it('should update specified properties in the composite state', () => {
        const { result } = renderHook(() => useState({ ...partialInitialState }));
        act(() => partial(result.current[1])({ prop1: 'false', prop2: undefined }));
        expect(result.current[0]).toEqual({
            prop1: 'false',
            prop2: undefined,
            prop3: 'true'
        });
    });

    it('should update a particular property in the composite state', () => {
        const { result } = renderHook(() => useState({ ...partialInitialState }));
        act(() => partial(result.current[1])('prop1', 'false'));
        expect(result.current[0]).toEqual({
            prop1: 'false',
            prop2: 'true',
            prop3: 'true'
        });
        act(() => partial(result.current[1], 'prop2')('false'));
        expect(result.current[0]).toEqual({
            prop1: 'false',
            prop2: 'false',
            prop3: 'true'
        });
    });

    it('should update a particular property in the composite state with callback', () => {
        const cb = mockFn().mockReturnValue('false');
        const { result } = renderHook(() => useState({ ...partialInitialState }));
        act(() => partial(result.current[1])('prop1', cb));
        expect(result.current[0]).toEqual({
            prop1: 'false',
            prop2: 'true',
            prop3: 'true'
        });
        act(() => partial(result.current[1], 'prop2')(cb));
        expect(result.current[0]).toEqual({
            prop1: 'false',
            prop2: 'false',
            prop3: 'true'
        });
        verifyCalls(cb, [
            ['true', { ...partialInitialState }],
            ['true', { ...partialInitialState, prop1: 'false' }],
        ]);
    });
});
