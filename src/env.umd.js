import { StrictMode, createElement } from "react";
import ReactDOM from "react-dom";

var extraRender = true;

ReactDOM.flushSync(function () {
    function TestComponent() {
        extraRender = !extraRender;
        return null;
    }
    var container = document.createElement('div');
    var element = createElement(StrictMode, null, createElement(TestComponent));
    if (ReactDOM.createRoot) {
        ReactDOM.createRoot(container).render(element);
    } else {
        ReactDOM.render(element, container);
    }
});

export const IS_DEV = extraRender;
