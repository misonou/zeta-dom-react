import { useEffect, useState } from "react";
import { ZetaEventContainer } from "./include/zeta-dom/events.js";
import { combineFn, createPrivateStore, define, defineObservableProperty, definePrototype, each, extend, isArray, isFunction, isUndefinedOrNull, keys, makeArray, noop, pick, pipe, single, watch } from "./include/zeta-dom/util.js";
import { useViewState } from "./viewState.js";

const _ = createPrivateStore();
const proto = DataView.prototype;
const emitter = new ZetaEventContainer();

function compare(a, b) {
    var x = isUndefinedOrNull(a) && -1;
    var y = isUndefinedOrNull(b) && 1;
    if (x || y) {
        return x + y;
    }
    if (typeof a === 'string' || typeof b === 'string') {
        return String(a).localeCompare(b, undefined, { caseFirst: 'upper' });
    }
    return a - b;
}

export function DataView(filters, sortBy, sortOrder, pageSize) {
    var self = this;
    var defaults = {
        filters: extend({}, filters),
        sortBy: sortBy,
        sortOrder: sortOrder || (sortBy && 'asc'),
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
    on: function (event, handler) {
        return emitter.add(this, event, handler);
    },
    getView: function (items, callback) {
        var self = this;
        var state = _(self);
        var pageIndex = self.pageIndex || 0;
        var pageSize = self.pageSize || 0;
        if (items !== state.items) {
            state.items = items || [];
            state.filteredItems = state.items.length ? undefined : [];
        }
        var filteredItems = state.filteredItems || (state.filteredItems = (callback || pipe).call(self, state.items, self.filters, self.sortBy, self.sortOrder) || []);
        if (items) {
            self.itemCount = filteredItems.length;
        }
        return [filteredItems.slice(pageIndex * pageSize, pageSize ? (pageIndex + 1) * pageSize : undefined), filteredItems.length];
    },
    sort: function (items, callback) {
        var self = this;
        items = makeArray(items);
        if (!isFunction(callback)) {
            var prop = callback || self.sortBy;
            if (!prop) {
                return items;
            }
            callback = function (item) {
                return item[prop];
            };
        }
        var dir = self.sortOrder === 'desc' ? -1 : 1;
        var values = new Map();
        each(items, function (i, v) {
            values.set(v, callback(v));
        });
        return items.sort(function (a, b) {
            var x = values.get(a);
            var y = values.get(b);
            return dir * (isArray(x) ? single(x, function (v, i) {
                return compare(v, y[i]);
            }) : compare(x, y));
        });
    },
    toJSON: function () {
        var self = this;
        return extend(pick(self, keys(_(self).defaults)), {
            filters: extend({}, self.filters),
            itemCount: self.itemCount
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

export function useDataView(persistKey, filters, sortBy, sortOrder, pageSize) {
    if (typeof persistKey !== 'string') {
        return useDataView('__dataView', persistKey, filters, sortBy, sortOrder);
    }
    var viewState = useViewState(persistKey);
    var forceUpdate = useState()[1];
    var dataView = useState(function () {
        return extend(new DataView(filters, sortBy, sortOrder, pageSize), viewState.get());
    })[0];
    useEffect(function () {
        var state = _(dataView);
        var onUpdated = function () {
            state.filteredItems = state.items.length ? undefined : [];
            forceUpdate({});
            emitter.emit('viewChange', dataView);
        };
        return combineFn(
            watch(dataView, onUpdated),
            watch(dataView.filters, onUpdated),
            viewState.onPopState ? viewState.onPopState(function (newValue) {
                viewState.set(dataView.toJSON());
                extend(dataView, newValue || state.defaults);
            }) : noop,
            function () {
                viewState.set(dataView.toJSON());
            }
        );
    }, [dataView]);
    return dataView;
}
