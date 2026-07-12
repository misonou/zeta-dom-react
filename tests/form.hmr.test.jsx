import React, { useEffect } from "react";
import { createReloadableComponent } from "@misonou/test-utils/react/hmr";
import { render, screen } from "@testing-library/react";
import { useFormField } from "src/form";

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
