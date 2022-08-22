import { jest } from "@jest/globals";
import { } from 'regenerator-runtime/runtime';

var cleanup = [];

export const root = document.documentElement;
export const body = document.body;
export const mockFn = jest.fn;
export const _ = expect.anything();

export function delay(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds || 10);
    });
}

export function defunctAfterTest(callback) {
    var enabled = true;
    cleanup.push(() => {
        enabled = false;
    });
    return function (...args) {
        if (enabled) {
            return callback(...args);
        }
    };
}

export function verifyCalls(cb, args) {
    expect(cb).toBeCalledTimes(args.length);
    args.forEach((v, i) => {
        expect(cb).toHaveBeenNthCalledWith(i + 1, ...v);
    });
}

afterEach(() => {
    jest.clearAllMocks();
    cleanup.splice(0).forEach(v => v());
});

expect.extend({
    sameObject(received, actual) {
        if (typeof actual !== 'object' || actual === null) {
            throw new Error('actual must be object');
        }
        const pass = actual === received;
        return { pass, message: () => '' };
    }
});
