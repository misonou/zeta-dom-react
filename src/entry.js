import { defineGetterProperty } from "zeta-dom/util";

defineGetterProperty(window, 'zeta-dom-react', function () {
    console.warn('window["zeta-dom-react"] is deprecated, access zeta.react instead.');
    return zeta.react;
});

export * from "./index.js";
