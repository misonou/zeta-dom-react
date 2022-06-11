export interface BreakpointContext<T> {
    /**
     * A dictionary which for each key returns whether the correspoding media query matches currently.
     */
    readonly breakpoints: { readonly [K in keyof T]: boolean; };
    /**
     * Triggers component rendering upon changes of conditions.
     * @returns A dictionary which for each key returns whether the correspoding media query matches currently.
     */
    useBreakpoint(): { readonly [K in keyof T]: boolean; };
}

/**
 * Triggers component rendering upon changes of condition on the specified media query.
 * @param query A valid media query.
 * @returns Whether the media query matches currently.
 */
export function useMediaQuery(query: string): boolean;

/**
 * Creates a React hook that triggers component rendering upon changes to multiple media queries.
 * @param breakpoints A dictionary which each key associates a media query.
 */
export function createBreakpointContext<T extends Zeta.Dictionary<string>>(breakpoints: T): BreakpointContext<T>;
