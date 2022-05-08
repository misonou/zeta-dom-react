import { useState } from "react";
import { createPrivateStore, define, defineObservableProperty, definePrototype, extend, watch } from "./include/zeta-dom/util.js";

const _ = createPrivateStore();
const proto = DataView.prototype;

export function DataView(filters, sortBy, sortOrder, pageSize) {
    _(this, {});
    filters = extend({}, filters);
    for (let i in filters) {
        defineObservableProperty(filters, i);
    }
    extend(this, {
        filters: Object.freeze(filters),
        sortBy: sortBy,
        sortOrder: sortOrder,
        pageSize: pageSize || DataView.pageSize
    });
}

define(DataView, {
    pageSize: 0
});

definePrototype(DataView, {
    pageIndex: 0,
    pageSize: 0,
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
    }
});

defineObservableProperty(proto, 'sortBy');
defineObservableProperty(proto, 'sortOrder');
defineObservableProperty(proto, 'pageIndex');
defineObservableProperty(proto, 'pageSize');

export function useDataView(filters, sortBy, sortOrder, pageSize) {
    var forceUpdate = useState(false)[1];
    var dataView = useState(function () {
        var view = new DataView(filters, sortBy, sortOrder, pageSize);
        var state = _(view);
        var onUpdated = function () {
            state.filteredItems = state.items.length ? undefined : [];
            forceUpdate(function (v) {
                return !v;
            });
        };
        watch(view, onUpdated);
        watch(view.filters, onUpdated);
        return view;
    })[0];
    return dataView;
}
