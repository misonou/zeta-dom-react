import React, { useState } from "react";
import { render } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { classNames, innerTextOrHTML, partial, toRefCallback, withSuspense } from "../src/util";
import { mockFn, verifyCalls } from "@misonou/test-utils";

const partialInitialState = {
    prop1: 'true',
    prop2: 'true',
    prop3: 'true',
};

describe('classNames', () => {
    it('should concatenate strings with whitespace', () => {
        expect(classNames('foo', 'bar', 'baz')).toBe('foo bar baz');
    });

    it('should concatenate with keys of object where values is truthy', () => {
        expect(classNames({
            foo: true,
            bar: '',
            baz: 'baz'
        })).toBe('foo baz-baz');
    });

    it('should call getClassNames method and process recursively', () => {
        const getClassNames = mockFn().mockReturnValue(['foo', 'bar', 'baz']);
        expect(classNames({ getClassNames })).toBe('foo bar baz');
        expect(getClassNames).toBeCalledTimes(1);
    });

    it('should ignore null or undefined values', () => {
        expect(classNames(undefined, null)).toBe('');
    });
});

describe('innerTextOrHTML', () => {
    it('should return correct result', () => {
        expect(innerTextOrHTML('')).toEqual({ children: '' });
        expect(innerTextOrHTML(null)).toEqual({ children: null });
        expect(innerTextOrHTML({ __html: '' })).toEqual({ dangerouslySetInnerHTML: { __html: '' } });
        expect(innerTextOrHTML({})).toEqual({ dangerouslySetInnerHTML: {} });
    });
});

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

describe('toRefCallback', () => {
    it('should always return callback', () => {
        expect(toRefCallback()).toBeInstanceOf(Function);
        expect(toRefCallback(null)).toBeInstanceOf(Function);
        expect(toRefCallback(false)).toBeInstanceOf(Function);
        expect(toRefCallback(undefined)).toBeInstanceOf(Function);
    });
});

describe('withSuspense', () => {
    it('should create lazy component with suspense content', async () => {
        let resolve;
        const promise = new Promise(resolve_ => resolve = resolve_);
        const Component = withSuspense(() => promise, <div>loading</div>);
        const { getByText, findByText } = render(<Component text="complete" />);
        getByText('loading');

        resolve({ default: ({ text }) => <div>{text}</div> });
        await findByText('complete');
    });

    it('should accept component as suspense content', () => {
        const promise = new Promise(() => { });
        const Component = withSuspense(() => promise, () => <div>loading</div>);
        const { getByText } = render(<Component />);
        getByText('loading');
    });

    it('should take second argument as optional', () => {
        const promise = new Promise(() => { });
        expect(() => {
            const Component = withSuspense(() => promise);
            render(<Component />);
        }).not.toThrow();
    });
});
