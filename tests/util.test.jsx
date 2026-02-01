import React, { forwardRef, useState } from "react";
import { act as renderAct, screen, render } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { classNames, combineRef, domEventRef, innerTextOrHTML, partial, toRefCallback, withSuspense } from "../src/util";
import { _, mockFn, verifyCalls } from "@misonou/test-utils";
import dom from "zeta-dom/dom";

const partialInitialState = {
    prop1: 'true',
    prop2: 'true',
    prop3: 'true',
};

describe('domEventRef', () => {
    it('should attach event listener', async () => {
        const cb = mockFn();
        function Component() {
            return (
                <div ref={domEventRef('custom', cb)}>foo</div>
            );
        }
        render(<Component />);

        const element = await screen.findByText('foo');
        dom.emit('custom', element);
        verifyCalls(cb, [[expect.objectContaining({ type: 'custom' }), _]]);
    });

    it('should attach event listener exactly once', async () => {
        const cb = mockFn();
        function Component({ value }) {
            return (
                <div ref={domEventRef({ custom: cb })}>foo</div>
            );
        }
        const { rerender } = render(<Component value={1} />);
        rerender(<Component value={2} />);
        rerender(<Component value={3} />);

        const element = await screen.findByText('foo');
        dom.emit('custom', element);
        verifyCalls(cb, [[expect.objectContaining({ type: 'custom' }), _]]);
    });

    it('should attach event listeners of different types', async () => {
        const cb = mockFn();
        function Component() {
            return (
                <div ref={domEventRef({ custom: cb, custom2: cb })}>foo</div>
            );
        }
        render(<Component />);

        const element = await screen.findByText('foo');
        dom.emit('custom', element);
        dom.emit('custom2', element)
        verifyCalls(cb, [
            [expect.objectContaining({ type: 'custom' }), _],
            [expect.objectContaining({ type: 'custom2' }), _],
        ]);
    });

    it('should invoke correct event listener after component refresh', async () => {
        function Component({ value }) {
            return (
                <div ref={domEventRef({ custom: () => value })}>foo</div>
            );
        }
        const { rerender } = render(<Component value="foo" />);
        const element = await screen.findByText('foo');
        await expect(dom.emit('custom', element)).resolves.toBe('foo');

        rerender(<Component value="bar" />);
        await expect(dom.emit('custom', element)).resolves.toBe('bar');
    });

    it('should invoke correct event listener after child component refresh', async () => {
        const cb1 = mockFn();
        const cb2 = mockFn();
        function Component() {
            return (
                <Inner ref={domEventRef({ custom: cb1 })} />
            );
        }
        let setState;
        const Inner = forwardRef((props, ref) => {
            [, setState] = useState(0);
            return (
                <div ref={combineRef(toRefCallback(ref), domEventRef({ custom: cb2 }))}>foo</div>
            );
        });
        render(<Component />);

        const element = await screen.findByText('foo');
        dom.emit('custom', element);
        verifyCalls(cb1, [[expect.objectContaining({ type: 'custom' }), element]]);
        verifyCalls(cb2, [[expect.objectContaining({ type: 'custom' }), element]]);

        renderAct(() => setState(1));
        cb1.mockClear();
        cb2.mockClear();
        dom.emit('custom', element);
        verifyCalls(cb1, [[expect.objectContaining({ type: 'custom' }), element]]);
        verifyCalls(cb2, [[expect.objectContaining({ type: 'custom' }), element]]);
    });

    it('should invoke correct event listener after different event name is supplied', async () => {
        function Component({ eventName }) {
            return (
                <div ref={domEventRef({ [eventName]: () => 'foo' })}>foo</div>
            );
        }
        const { rerender } = render(<Component eventName="custom" />);
        const element = await screen.findByText('foo');
        await expect(dom.emit('custom', element)).resolves.toBe('foo');

        rerender(<Component eventName="custom2" />);
        expect(dom.emit('custom', element)).toBeUndefined();
        await expect(dom.emit('custom2', element)).resolves.toBe('foo');
    });

    it('should allow the callback to be forwarded', async () => {
        const cb = mockFn();
        function Component() {
            return (
                <Inner ref={domEventRef({ custom: cb })} />
            );
        }
        let setState;
        const Inner = forwardRef((props, ref) => {
            [, setState] = useState(0);
            return (
                <div ref={ref}>foo</div>
            );
        });
        render(<Component />);
        renderAct(() => setState(1));

        const element = await screen.findByText('foo');
        dom.emit('custom', element);
        verifyCalls(cb, [[expect.objectContaining({ type: 'custom' }), _]]);
    });

    it('should allow multiple callbacks to be passed to same element', async () => {
        const cb = mockFn();
        function Component() {
            return (
                <Inner ref={domEventRef({ custom: cb })} />
            );
        }
        const Inner = forwardRef((props, ref) => {
            return (
                <div ref={combineRef(toRefCallback(ref), domEventRef({ custom: cb }))}>foo</div>
            );
        });
        render(<Component />);

        const element = await screen.findByText('foo');
        dom.emit('custom', element);
        verifyCalls(cb, [
            [expect.objectContaining({ type: 'custom' }), element],
            [expect.objectContaining({ type: 'custom' }), element],
        ]);
    });

    it('should throw when the same callback is passed to multiple elements', async () => {
        function Component() {
            const ref = domEventRef({ custom: () => {} })
            return (
                <div>
                    <div ref={ref}>foo</div>
                    <div ref={ref}>foo</div>
                </div>
            );
        }
        expect(() => render(<Component />)).toThrow();
    });

    it('should not throw when child component re-renders', async () => {
        const cb = mockFn();
        function Component() {
            return (
                <Inner ref={domEventRef({ custom: cb })} />
            );
        }
        let setState;
        const Inner = forwardRef((props, ref) => {
            [, setState] = useState(0);
            return (
                <div ref={combineRef(() => { }, ref)}>foo</div>
            );
        });
        render(<Component />);
        expect(() => {
            renderAct(() => setState(1));
        }).not.toThrow();
    });
});

describe('classNames', () => {
    it('should concatenate strings with whitespace', () => {
        expect(classNames('foo', 'bar', 'baz')).toBe('foo bar baz');
    });

    it('should concatenate with keys of object where values is truthy or zero', () => {
        expect(classNames({
            foo: true,
            bar: '',
            baz: 'baz',
            num: 0,
        })).toBe('foo baz-baz num-0');
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

    it('should return same object when no property has changed', () => {
        const { result } = renderHook(() => useState({ ...partialInitialState }));
        act(() => partial(result.current[1])(partialInitialState));
        expect(result.all.length).toBe(1);

        act(() => partial(result.current[1])('prop1', partialInitialState.prop1));
        act(() => partial(result.current[1], 'prop1')(partialInitialState.prop1));
        expect(result.all.length).toBe(1);

        act(() => partial(result.current[1])('prop1', () => partialInitialState.prop1));
        act(() => partial(result.current[1], 'prop1')(() => partialInitialState.prop1));
        expect(result.all.length).toBe(1);
    });

    it('should perform same value comparison', () => {
        const { result } = renderHook(() => useState({ NaN: NaN, zero: 0 }));
        act(() => partial(result.current[1])('NaN', NaN));
        expect(result.all.length).toBe(1);

        act(() => partial(result.current[1])('zero', -0));
        expect(result.all.length).toBe(2);
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
