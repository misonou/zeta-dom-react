import { useEffect, useState } from "react";
import { combineFn, createPrivateStore, define, defineObservableProperty, defineOwnProperty, definePrototype, extend, keys, pick, watch } from "./include/zeta-dom/util.js";

const _ = createPrivateStore();
const proto = DataView.prototype;

export function DataView(filters, sortBy, sortOrder, pageSize) {
    var self = this;
    var defaults = {
        filters: extend({}, filters),
        sortBy: sortBy,
        sortOrder: sortOrder,
        pageIndex: 0,
        pageSize: pageSize === undefined ? DataView.pageSize : pageSize
    }
    filters = extend({}, filters);
    for (let i in filters) {
        defineObservableProperty(filters, i);
    }
    _(self, {
        filters: Object.freeze(filters),
        defaults: defaults,
        items: [],
    });
    extend(this, defaults);
}

define(DataView, {
    pageSize: 0
});

definePrototype(DataView, {
    itemCount: 0,
    getView: function (items, callback) {
        var self = this;
        var state = _(self);
        var pageIndex = self.pageIndex || 0;
        var pageSize = self.pageSize || 0;
        items = items || [];
        if (items !== state.items) {
            state.items = items;
            state.filteredItems = items.length ? undefined : [];
        }
        var filteredItems = state.filteredItems || (state.filteredItems = (callback(state.items, self.filters, self.sortBy) || [])[self.sortOrder === 'desc' ? 'reverse' : 'slice']());
        self.itemCount = filteredItems.length;
        return [filteredItems.slice(pageIndex * pageSize, pageSize ? (pageIndex + 1) * pageSize : undefined), filteredItems.length];
    },
    toJSON: function () {
        var self = this;
        return extend(pick(self, keys(_(self).defaults)), {
            filters: extend({}, self.filters)
        });
    },
    reset: function () {
        extend(this, _(this).defaults);
    }
});

defineObservableProperty(proto, 'sortBy');
defineObservableProperty(proto, 'sortOrder');
defineObservableProperty(proto, 'pageIndex');
defineObservableProperty(proto, 'pageSize');
defineObservableProperty(proto, 'filters', {}, function (newValue) {
    return extend(_(this).filters, newValue);
});

export function useDataView(filters, sortBy, sortOrder, pageSize) {
    var forceUpdate = useState(false)[1];
    var dataView = useState(function () {
        return new DataView(filters, sortBy, sortOrder, pageSize);
    })[0];
    useEffect(() => {
        var state = _(dataView);
        var onUpdated = function () {
            state.filteredItems = state.items.length ? undefined : [];
            forceUpdate(function (v) {
                return !v;
            });
        };
        return combineFn(
            watch(dataView, onUpdated),
            watch(dataView.filters, onUpdated)
        );
    }, [dataView]);
    return dataView;
}
