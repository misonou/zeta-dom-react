import type { FieldType, FormFieldProps, FormFieldState } from "../form";

export interface DateFieldProps extends FormFieldProps<string> {
    /**
     * Specifies the earliest date allowed.
     * It accepts `Date` object, timestamp in milliseconds, any parsable date string, or relative date from today.
     * @see {@link DateField.getDate} for relative date format.
     */
    min?: string | number | Date;
    /**
     * Specifies the latest date allowed.
     * It accepts `Date` object, timestamp in milliseconds, any parsable date string, or relative date from today.
     * @see {@link DateField.getDate} for relative dates format.
     */
    max?: string | number | Date;
    /**
     * Formats display text for a given date.
     * @param date Current date value.
     */
    formatDisplay?: (date: Date) => string;
}

export interface DateFieldState extends FormFieldState<string> {
    /**
     * Earliest allowed date in the standard format (YYYY-MM-DD),
     * or an empty string if {@link DateFieldProps.min} is not specified or is invalid.
     */
    readonly min: string;
    /**
     * Latest allowed date in the standard format (YYYY-MM-DD),
     * or an empty string if {@link DateFieldProps.max} is not specified or is invalid.
     */
    readonly max: string;
    /**
     * Formatted text returned by {@link DateFieldProps.formatDisplay} or the standard format (YYYY-MM-DD) by default.
     */
    readonly displayText: string;
}

export default class DateField implements FieldType<DateFieldProps, DateFieldState> {
    /**
     * Converts a given date to its string representation.
     * @param date A `Date` object.
     * @returns A string in standard format (YYYY-MM-DD), or an empty string if the date is invalid.
     */
    static toDateString(date: Date): string;
    /**
     * Converts a given string to its representated date, truncating time component to midnight in local time.
     *
     * If the string is in standard format (YYYY-MM-DD), the resulting date object will always have the represented date in local time.
     * Otherwise it is up to browser to determine the original timezone and perform timezone conversion if necessary.
     * @param str Any string representation for a date.
     * @returns A `Date` object or `null` if the input string was invalid.
     */
    static toDateObject(str: string): Date | null;
    /**
     * Returns a date relative to another date.
     * @param str A string specifying the relative date.
     * @param base An optional base date which calculation is based on. Default to today.
     * @returns A string in standard format (YYYY-MM-DD), or an empty string if the base date is invalid.
     *
     * @description
     * Supports relative dates in the following format:
     * - A `+` or `-` sign, then number and unit (`y`, `m`, `w` and `d` for years, months, weeks and days), e.g. `+1d` or `-1y`.
     * - Multiple number and unit pairs can be specified, e.g. `+1y1d` or `-1y1d` which is evaluated from left to right
     * (order matters because the months unit may result in different date due to various days in different month).
     * - Different signs can also be specified for each number and unit pair, e.g. `+1y-1d`.
     *
     * Also supports the following functions:
     * - `year-start`
     * - `year-end`
     * - `month-start`
     * - `month-end`
     * - `week-start`
     * - `week-end`
     * - `nth-after(n, day)`
     * - `nth-before(n, day)`
     * - `nth-of-year(n, day)`
     * - `nth-of-month(n, day)`
     * - `nth-last-of-year(n, day)`
     * - `nth-last-of-month(n, day)`
     *
     * where
     * - `n` is an integer (1 means first, 2 means second etc) and
     * - `day` is weekday in three letters e.g. `sun`.
     *
     * In addition all functions accept an extra argument, e.g. `month-start(-1m)` or `nth-of-month(1, sun, -1m)`.
     */
    static getDate(str: string, base?: string | number | Date): string;

    readonly defaultValue: string;

    normalizeValue(value: any, props: DateFieldProps): string;
    postHook(state: FormFieldState<string>, props: DateFieldProps): DateFieldState;
}
