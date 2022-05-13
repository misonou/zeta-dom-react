/**
 * Represents a filterable, sortable and paged context of list of items.
 */
export class DataView<P extends object> {
    /**
     * Gets the filter object.
     * Updating its property will trigger a component update.
     */
    readonly filters: P;
    /**
     * Gets or sets the total number of items.
     * The value is automatically updated by {@link DataView.getView}.
     */
    itemCount: number;
    /**
     * Gets or sets the sorting field.
     * Updating the value will trigger a component update.
     */
    sortBy: string | undefined;
    /**
     * Gets or sets the sorting order, whether by ascending or descending of the specified field.
     * Updating the value will trigger a component update.
     */
    sortOrder: 'asc' | 'desc' | undefined;
    /**
     * Gets or sets the page index.
     * Updating the value will trigger a component update.
     */
    pageIndex: number;
    /**
     * Gets or sets the page size.
     * Updating the value will trigger a component update.
     */
    pageSize: number;
    /**
     * Sets the default page size.
     * Setting to `0` or negative numbers will disable paging. Default is `0`.
     */
    static pageSize: number;

    /**
     * Performs filtering and sorting of items.
     * The callback is only called initially, or when the reference to the item array has changed, or filter values or sorting has changed.
     * @param callback A handler that returns a filtered and sorted array of items.
     * @returns An array containing a list of filtered and sorted items in the current page, and the total number of filtered items.
     */
    getView<T>(items: T[] | undefined, callback: (items: T[], filters: P, sortBy: string) => T[]): [items: T[], totalCount: number];
}

/**
 * Creates a data view context with the items and filter values.
 * @param items An array of items. Changes of array reference will trigger component update.
 * @param filters Initial filter.
 * @param sortBy Initial sorting field if any.
 * @param sortOrder Initial sorting direction.
 * @param pageSize Initial page size. If not given, the default page size will be used.
 */
export function useDataView<P extends object = {}>(filters: P, sortBy?: string, sortOrder?: string, pageSize?: number): DataView<P>;