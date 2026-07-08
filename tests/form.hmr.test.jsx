import React, { useEffect } from "react";
import { createReloadableComponent } from "@misonou/test-utils/react/hmr";
import { render, screen } from "@testing-library/react";
import { useFormContext, useFormField } from "src/form";

describe('useFormContext', () => {
    it('should not reset form context on hot reload', async () => {
        const Foo = createReloadableComponent(function Foo() {
            const form = useFormContext({ foo: 1 });
            useEffect(() => {
                form.data.foo = 2;
            }, []);
            return <div>{form.data.foo}</div>;
        });
        const { unmount } = render(<Foo />, { wrapper: React.StrictMode });
        await screen.findByText('2');

        Foo.patch(function Foo() {
            const form = useFormContext({ foo: 1 });
            useEffect(() => { }, []);
            return <div>{form.data.foo}</div>;
        });
        expect(screen.queryByText('2')).toBeTruthy();
        unmount();
    });
});

describe('useFormField', () => {
    it('should retain value on hot reload', async () => {
        const Foo = createReloadableComponent(function Foo() {
            const { value, setValue } = useFormField({}, '');
            useEffect(() => {
                setValue('foo');
            }, []);
            return <div>{value}</div>;
        });
        const { unmount } = render(<Foo />, { wrapper: React.StrictMode });
        await screen.findByText('foo');

        Foo.patch(function Foo() {
            const { value } = useFormField({}, '');
            useEffect(() => {}, []);
            return <div>{value}</div>;
        });
        expect(screen.queryByText('foo')).toBeTruthy();
        unmount();
    });
});
