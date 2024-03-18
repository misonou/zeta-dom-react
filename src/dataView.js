import { useEffect, useState } from "react";
import { ZetaEventContainer } from "zeta-dom/events";
import { combineFn, createPrivateStore, define, defineObservableProperty, definePrototype, each, extend, isArray, isFunction, isUndefinedOrNull, keys, makeArray, noop, pick, setImmediateOnce, single, watch } from "zeta-dom/util";
import { useUpdateTrigger } from "./hooks.js";
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
    var state = _(self, {
        filters: Object.freeze(filters),
        defaults: defaults,
        items: [],
    });
    var emitViewChange = function () {
        emitter.emit('viewChange', self);
    };
    var onUpdated = function () {
        state.sorted = state.items.length ? undefined : [];
        if (this !== self) {
            state.filtered = state.sorted;
        }
        setImmediateOnce(emitViewChange);
    };
    extend(this, defaults);
    watch(self, onUpdated);
    watch(self.filters, onUpdated);
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
            state.filtered = state.items.length ? undefined : [];
            state.sorted = state.filtered;
        }
        callback = callback || function (items) {
            return self.sort(items);
        };
        var filteredItems = state.sorted || (state.sorted = callback.call(self, state.filtered || state.items, self.filters, self.sortBy, self.sortOrder) || []);
        state.filtered = filteredItems;
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
    toggleSort: function (sortBy, sortOrder) {
        var self = this;
        if (self.sortBy === sortBy) {
            self.sortOrder = self.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            self.sortBy = sortBy;
            self.sortOrder = sortOrder || 'asc';
        }
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
    var forceUpdate = useUpdateTrigger();
    var dataView = useState(function () {
        return extend(new DataView(filters, sortBy, sortOrder, pageSize), viewState.get());
    })[0];
    useEffect(function () {
        var state = _(dataView);
        return combineFn(
            dataView.on('viewChange', function () {
                viewState.set(dataView.toJSON());
                forceUpdate();
            }),
            viewState.onPopState ? viewState.onPopState(function (newValue) {
                viewState.set(dataView.toJSON());
                extend(dataView, newValue || state.defaults);
            }) : noop
        );
    }, [dataView]);
    return dataView;
}
