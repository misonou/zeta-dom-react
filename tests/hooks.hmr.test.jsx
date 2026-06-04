import React from "react";
import { createReloadableComponent } from "@misonou/test-utils/react/hmr";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { useAsync } from "src/hooks";

describe('useAsync', () => {
    it('should refresh on hot reload', async () => {
        const Hello = createReloadableComponent(function Hello() {
            const [value] = useAsync(() => Promise.resolve('hello'), []);
            return <div>{value}</div>;
        });
        const { unmount } = render(<Hello />, { wrapper: React.StrictMode });
        await screen.findByText('hello');

        Hello.patch(function Hello() {
            const [value] = useAsync(() => Promise.resolve('hello world'), []);
            return <div>{value}</div>;
        });
        await screen.findByText('hello world');
        unmount();
    });
});
