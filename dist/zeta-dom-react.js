(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("zeta-dom"));
	else if(typeof define === 'function' && define.amd)
		define("zeta-dom-react", ["react", "zeta-dom"], factory);
	else if(typeof exports === 'object')
		exports["zeta-dom-react"] = factory(require("react"), require("zeta-dom"));
	else
		root["zeta-dom-react"] = factory(root["React"], root["zeta"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE__359__, __WEBPACK_EXTERNAL_MODULE__654__) {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 359:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__359__;

/***/ }),

/***/ 654:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__654__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ entry)
});

// NAMESPACE OBJECT: ./src/index.js
var src_namespaceObject = {};
__webpack_require__.r(src_namespaceObject);
__webpack_require__.d(src_namespaceObject, {
  "DataView": () => (DataView),
  "FormContext": () => (FormContext),
  "FormContextProvider": () => (FormContextProvider),
  "ViewStateProvider": () => (ViewStateProvider),
  "classNames": () => (classNames),
  "combineRef": () => (combineRef),
  "combineValidators": () => (combineValidators),
  "createBreakpointContext": () => (createBreakpointContext),
  "innerTextOrHTML": () => (innerTextOrHTML),
  "partial": () => (partial),
  "toRefCallback": () => (toRefCallback),
  "useAsync": () => (useAsync),
  "useDataView": () => (useDataView),
  "useDispose": () => (useDispose),
  "useErrorHandlerRef": () => (useErrorHandlerRef),
  "useFormContext": () => (useFormContext),
  "useFormField": () => (useFormField),
  "useMediaQuery": () => (useMediaQuery),
  "useMemoizedFunction": () => (useMemoizedFunction),
  "useObservableProperty": () => (useObservableProperty),
  "useRefInitCallback": () => (useRefInitCallback),
  "useViewState": () => (useViewState),
  "withSuspense": () => (withSuspense)
});

// EXTERNAL MODULE: external {"commonjs":"react","commonjs2":"react","amd":"react","root":"React"}
var external_commonjs_react_commonjs2_react_amd_react_root_React_ = __webpack_require__(359);
// EXTERNAL MODULE: external {"commonjs":"zeta-dom","commonjs2":"zeta-dom","amd":"zeta-dom","root":"zeta"}
var external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_ = __webpack_require__(654);
;// CONCATENATED MODULE: ./tmp/zeta-dom/util.js

var _zeta$util = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.util,
    noop = _zeta$util.noop,
    pipe = _zeta$util.pipe,
    either = _zeta$util.either,
    is = _zeta$util.is,
    isUndefinedOrNull = _zeta$util.isUndefinedOrNull,
    isArray = _zeta$util.isArray,
    isFunction = _zeta$util.isFunction,
    isThenable = _zeta$util.isThenable,
    isPlainObject = _zeta$util.isPlainObject,
    isArrayLike = _zeta$util.isArrayLike,
    makeArray = _zeta$util.makeArray,
    extend = _zeta$util.extend,
    each = _zeta$util.each,
    map = _zeta$util.map,
    grep = _zeta$util.grep,
    splice = _zeta$util.splice,
    any = _zeta$util.any,
    single = _zeta$util.single,
    kv = _zeta$util.kv,
    fill = _zeta$util.fill,
    pick = _zeta$util.pick,
    exclude = _zeta$util.exclude,
    mapObject = _zeta$util.mapObject,
    mapGet = _zeta$util.mapGet,
    mapRemove = _zeta$util.mapRemove,
    arrRemove = _zeta$util.arrRemove,
    setAdd = _zeta$util.setAdd,
    equal = _zeta$util.equal,
    combineFn = _zeta$util.combineFn,
    executeOnce = _zeta$util.executeOnce,
    createPrivateStore = _zeta$util.createPrivateStore,
    util_setTimeout = _zeta$util.setTimeout,
    setTimeoutOnce = _zeta$util.setTimeoutOnce,
    util_setInterval = _zeta$util.setInterval,
    setIntervalSafe = _zeta$util.setIntervalSafe,
    setImmediate = _zeta$util.setImmediate,
    setImmediateOnce = _zeta$util.setImmediateOnce,
    throwNotFunction = _zeta$util.throwNotFunction,
    errorWithCode = _zeta$util.errorWithCode,
    isErrorWithCode = _zeta$util.isErrorWithCode,
    keys = _zeta$util.keys,
    values = _zeta$util.values,
    util_hasOwnProperty = _zeta$util.hasOwnProperty,
    getOwnPropertyDescriptors = _zeta$util.getOwnPropertyDescriptors,
    util_define = _zeta$util.define,
    definePrototype = _zeta$util.definePrototype,
    defineOwnProperty = _zeta$util.defineOwnProperty,
    defineGetterProperty = _zeta$util.defineGetterProperty,
    defineHiddenProperty = _zeta$util.defineHiddenProperty,
    defineAliasProperty = _zeta$util.defineAliasProperty,
    defineObservableProperty = _zeta$util.defineObservableProperty,
    watch = _zeta$util.watch,
    watchOnce = _zeta$util.watchOnce,
    watchable = _zeta$util.watchable,
    inherit = _zeta$util.inherit,
    freeze = _zeta$util.freeze,
    deepFreeze = _zeta$util.deepFreeze,
    iequal = _zeta$util.iequal,
    randomId = _zeta$util.randomId,
    repeat = _zeta$util.repeat,
    camel = _zeta$util.camel,
    hyphenate = _zeta$util.hyphenate,
    ucfirst = _zeta$util.ucfirst,
    lcfirst = _zeta$util.lcfirst,
    trim = _zeta$util.trim,
    matchWord = _zeta$util.matchWord,
    htmlDecode = _zeta$util.htmlDecode,
    resolve = _zeta$util.resolve,
    reject = _zeta$util.reject,
    always = _zeta$util.always,
    resolveAll = _zeta$util.resolveAll,
    catchAsync = _zeta$util.catchAsync,
    setPromiseTimeout = _zeta$util.setPromiseTimeout,
    delay = _zeta$util.delay,
    makeAsync = _zeta$util.makeAsync;

;// CONCATENATED MODULE: ./src/include/zeta-dom/util.js

;// CONCATENATED MODULE: ./tmp/zeta-dom/domUtil.js

var domUtil_zeta$util = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.util,
    domReady = domUtil_zeta$util.domReady,
    tagName = domUtil_zeta$util.tagName,
    isVisible = domUtil_zeta$util.isVisible,
    matchSelector = domUtil_zeta$util.matchSelector,
    comparePosition = domUtil_zeta$util.comparePosition,
    connected = domUtil_zeta$util.connected,
    containsOrEquals = domUtil_zeta$util.containsOrEquals,
    acceptNode = domUtil_zeta$util.acceptNode,
    combineNodeFilters = domUtil_zeta$util.combineNodeFilters,
    iterateNode = domUtil_zeta$util.iterateNode,
    iterateNodeToArray = domUtil_zeta$util.iterateNodeToArray,
    getCommonAncestor = domUtil_zeta$util.getCommonAncestor,
    parentsAndSelf = domUtil_zeta$util.parentsAndSelf,
    selectIncludeSelf = domUtil_zeta$util.selectIncludeSelf,
    selectClosestRelative = domUtil_zeta$util.selectClosestRelative,
    createNodeIterator = domUtil_zeta$util.createNodeIterator,
    createTreeWalker = domUtil_zeta$util.createTreeWalker,
    bind = domUtil_zeta$util.bind,
    bindUntil = domUtil_zeta$util.bindUntil,
    dispatchDOMMouseEvent = domUtil_zeta$util.dispatchDOMMouseEvent,
    removeNode = domUtil_zeta$util.removeNode,
    getClass = domUtil_zeta$util.getClass,
    setClass = domUtil_zeta$util.setClass,
    getScrollOffset = domUtil_zeta$util.getScrollOffset,
    getScrollParent = domUtil_zeta$util.getScrollParent,
    getContentRect = domUtil_zeta$util.getContentRect,
    scrollBy = domUtil_zeta$util.scrollBy,
    scrollIntoView = domUtil_zeta$util.scrollIntoView,
    makeSelection = domUtil_zeta$util.makeSelection,
    getRect = domUtil_zeta$util.getRect,
    getRects = domUtil_zeta$util.getRects,
    toPlainRect = domUtil_zeta$util.toPlainRect,
    rectEquals = domUtil_zeta$util.rectEquals,
    rectCovers = domUtil_zeta$util.rectCovers,
    rectIntersects = domUtil_zeta$util.rectIntersects,
    pointInRect = domUtil_zeta$util.pointInRect,
    mergeRect = domUtil_zeta$util.mergeRect,
    elementFromPoint = domUtil_zeta$util.elementFromPoint;

;// CONCATENATED MODULE: ./src/include/zeta-dom/domUtil.js

;// CONCATENATED MODULE: ./tmp/zeta-dom/dom.js

var _defaultExport = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom;
/* harmony default export */ const dom = (_defaultExport);
var _zeta$dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom,
    textInputAllowed = _zeta$dom.textInputAllowed,
    beginDrag = _zeta$dom.beginDrag,
    beginPinchZoom = _zeta$dom.beginPinchZoom,
    getShortcut = _zeta$dom.getShortcut,
    setShortcut = _zeta$dom.setShortcut,
    focusable = _zeta$dom.focusable,
    focused = _zeta$dom.focused,
    setModal = _zeta$dom.setModal,
    releaseModal = _zeta$dom.releaseModal,
    retainFocus = _zeta$dom.retainFocus,
    releaseFocus = _zeta$dom.releaseFocus,
    iterateFocusPath = _zeta$dom.iterateFocusPath,
    dom_focus = _zeta$dom.focus;

;// CONCATENATED MODULE: ./src/include/zeta-dom/dom.js


/* harmony default export */ const zeta_dom_dom = (dom);
;// CONCATENATED MODULE: ./tmp/zeta-dom/domLock.js

var domLock_zeta$dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom,
    lock = domLock_zeta$dom.lock,
    locked = domLock_zeta$dom.locked,
    cancelLock = domLock_zeta$dom.cancelLock,
    notifyAsync = domLock_zeta$dom.notifyAsync,
    preventLeave = domLock_zeta$dom.preventLeave;

;// CONCATENATED MODULE: ./src/include/zeta-dom/domLock.js

;// CONCATENATED MODULE: ./tmp/zeta-dom/events.js

var ZetaEventContainer = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.EventContainer;

;// CONCATENATED MODULE: ./src/include/zeta-dom/events.js

;// CONCATENATED MODULE: ./src/hooks.js





var fnWeakMap = new WeakMap();
var container = new ZetaEventContainer();
function useMemoizedFunction(callback) {
  var fn = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    return function fn() {
      var cb = fnWeakMap.get(fn);
      return cb && cb.apply(this, arguments);
    };
  })[0];
  fnWeakMap.set(fn, callback);
  return fn;
}
function useObservableProperty(obj, key) {
  var forceUpdate = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)()[1];
  var value = obj[key];
  var ref = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useRef)();
  ref.current = value;
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    var cb = function cb(v) {
      if (v !== ref.current) {
        forceUpdate({});
      }
    };

    cb(obj[key]);
    return watch(obj, key, cb);
  }, [obj, key]);
  return value;
}
function useAsync(init, deps) {
  var state = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    var element;

    var emitErrorEvent = function emitErrorEvent(error) {
      return container.emit('error', state, {
        error: error
      }, true);
    };

    return {
      loading: true,
      elementRef: function elementRef(current) {
        element = current;
      },
      onError: function onError(handler) {
        return container.add(state, 'error', function (e) {
          return handler.call(state, e.error);
        });
      },
      refresh: function refresh() {
        var result = makeAsync(init)();
        var promise;

        var shouldNotify = function shouldNotify() {
          return !state.disposed && state.promise === promise;
        };

        promise = always(result, function (resolved, value) {
          if (shouldNotify()) {
            if (resolved) {
              extend(state, {
                loading: false,
                value: value
              });
            } else {
              extend(state, {
                loading: false,
                value: undefined,
                error: value
              });

              if (!emitErrorEvent(value)) {
                throw value;
              }
            }
          }
        });
        extend(state, {
          promise: promise,
          loading: true,
          error: undefined
        });
        notifyAsync(element || zeta_dom_dom.root, catchAsync(promise));
        return result;
      }
    };
  })[0];
  deps = [deps !== false].concat(isArray(deps) || []);
  init = useMemoizedFunction(init);
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    return function () {
      state.disposed = true;
    };
  }, [state]);
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    if (deps[0]) {
      // keep call to refresh in useEffect to avoid double invocation
      // in strict mode in development environment
      state.refresh();
    }
  }, deps);
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useMemo)(function () {
    if (deps[0]) {
      state.loading = true;
    }
  }, deps);
  useObservableProperty(state, 'loading');
  return [state.value, state];
}
function useRefInitCallback(init) {
  var args = makeArray(arguments);
  var set = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(new WeakSet())[0];
  return function (v) {
    if (v && setAdd(set, v)) {
      args[0] = v;
      init.apply(null, args);
    }
  };
}
function useDispose() {
  var dispose = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    var callbacks = [function () {
      callbacks.splice(0, callbacks.length - 1);
    }];
    return extend(combineFn(callbacks), {
      push: callbacks.splice.bind(callbacks, -1, 0)
    });
  })[0];
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    return dispose;
  }, [dispose]);
  return dispose;
}
function useErrorHandlerRef() {
  var ref = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useRef)(null);
  var args = makeArray(arguments);
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    return combineFn(map(args, function (v) {
      return v.onError(function (error) {
        if (ref.current) {
          return zeta_dom_dom.emit('error', ref.current, {
            error: error
          }, true);
        }
      });
    }));
  }, [ref].concat(args));
  return ref;
}
;// CONCATENATED MODULE: ./src/css.js




function useMediaQuery(query) {
  var onDispose = useDispose();
  var state = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    var mq = matchMedia(query);
    onDispose.push(bind(mq, 'change', function () {
      state[1](mq.matches);
    }));
    return mq.matches;
  });
  return state[0];
}
/**
 * @param {Zeta.Dictionary<string>} breakpoints
 */

function createBreakpointContext(breakpoints) {
  var values = {};
  watch(values, true);
  each(breakpoints, function (i, v) {
    var mq = matchMedia(v);
    var setValue = defineObservableProperty(values, i, mq.matches, true);
    bind(mq, 'change', function () {
      setValue(mq.matches);
    });
  });
  return {
    breakpoints: Object.freeze(values),
    useBreakpoint: function useBreakpoint() {
      var forceUpdate = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)()[1];
      (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
        return watch(values, function () {
          forceUpdate({});
        });
      });
      return values;
    }
  };
}
;// CONCATENATED MODULE: ./src/viewState.js


/** @type {React.Context<import("./viewState").ViewStateProvider | null>} */
// @ts-ignore: type inference issue

var ViewStateProviderContext = /*#__PURE__*/(0,external_commonjs_react_commonjs2_react_amd_react_root_React_.createContext)(null);
var noopStorage = Object.freeze({
  get: noop,
  set: noop
});
var ViewStateProvider = ViewStateProviderContext.Provider;
function useViewState(key) {
  var uniqueId = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(randomId)[0];
  var provider = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useContext)(ViewStateProviderContext);
  var state = provider && key && provider.getState(uniqueId, key) || noopStorage;
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    return state.dispose && state.dispose.bind(state);
  }, [state]);
  return state;
}
;// CONCATENATED MODULE: ./src/dataView.js





var _ = createPrivateStore();

var proto = DataView.prototype;
var emitter = new ZetaEventContainer();

function compare(a, b) {
  var x = isUndefinedOrNull(a) && -1;
  var y = isUndefinedOrNull(b) && 1;

  if (x || y) {
    return x + y;
  }

  if (typeof a === 'string' || typeof b === 'string') {
    return String(a).localeCompare(b, undefined, {
      caseFirst: 'upper'
    });
  }

  return a - b;
}

function DataView(filters, sortBy, sortOrder, pageSize) {
  var self = this;
  var defaults = {
    filters: extend({}, filters),
    sortBy: sortBy,
    sortOrder: sortOrder || sortBy && 'asc',
    pageIndex: 0,
    pageSize: pageSize === undefined ? DataView.pageSize : pageSize
  };
  filters = extend({}, filters);

  for (var i in filters) {
    defineObservableProperty(filters, i);
  }

  var state = _(self, {
    filters: Object.freeze(filters),
    defaults: defaults,
    items: []
  });

  var onUpdated = function onUpdated() {
    state.sorted = state.items.length ? undefined : [];

    if (this !== self) {
      state.filtered = state.sorted;
    }

    emitter.emitAsync('viewChange', self);
  };

  extend(this, defaults);
  watch(self, onUpdated);
  watch(self.filters, onUpdated);
}
util_define(DataView, {
  pageSize: 0
});
definePrototype(DataView, {
  itemCount: 0,
  on: function on(event, handler) {
    return emitter.add(this, event, handler);
  },
  getView: function getView(items, callback) {
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
  sort: function sort(items, callback) {
    var self = this;
    items = makeArray(items);

    if (!isFunction(callback)) {
      var prop = callback || self.sortBy;

      if (!prop) {
        return items;
      }

      callback = function callback(item) {
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
  toJSON: function toJSON() {
    var self = this;
    return extend(pick(self, keys(_(self).defaults)), {
      filters: extend({}, self.filters),
      itemCount: self.itemCount
    });
  },
  reset: function reset() {
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
function useDataView(persistKey, filters, sortBy, sortOrder, pageSize) {
  if (typeof persistKey !== 'string') {
    return useDataView('__dataView', persistKey, filters, sortBy, sortOrder);
  }

  var viewState = useViewState(persistKey);
  var forceUpdate = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)()[1];
  var dataView = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    return extend(new DataView(filters, sortBy, sortOrder, pageSize), viewState.get());
  })[0];
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    var state = _(dataView);

    return combineFn(dataView.on('viewChange', function () {
      forceUpdate({});
    }), viewState.onPopState ? viewState.onPopState(function (newValue) {
      viewState.set(dataView.toJSON());
      extend(dataView, newValue || state.defaults);
    }) : noop, function () {
      viewState.set(dataView.toJSON());
    });
  }, [dataView]);
  return dataView;
}
;// CONCATENATED MODULE: ./src/form.js







var form_ = createPrivateStore();

var form_emitter = new ZetaEventContainer();
/** @type {React.Context<import ("./form").FormContext>} */
// @ts-ignore: type inference issue

var _FormContext = /*#__PURE__*/(0,external_commonjs_react_commonjs2_react_amd_react_root_React_.createContext)(null);

var FormContextProvider = _FormContext.Provider;

function createDataObject(context, initialData) {
  return new Proxy(extend({}, initialData), {
    get: function get(t, p) {
      if (typeof p === 'string') {
        return t[p];
      }
    },
    set: function set(t, p, v) {
      if (typeof p === 'string' && t[p] !== v) {
        if (p in t) {
          form_(context).pending[p] = true;
          form_emitter.emitAsync('dataChange', context, [p], {}, function (v, a) {
            return v.concat(a);
          });
        }

        t[p] = v;
      }

      return true;
    }
  });
}

function wrapErrorResult(state, key, error) {
  return {
    toString: function toString() {
      return error(extend({}, state.fields[key]));
    }
  };
}

function FormContext(initialData, validateOnChange, viewState) {
  var self = this;
  var fields = {};
  var errors = {};
  var defaults = {};

  var state = form_(self, {
    fields: fields,
    errors: errors,
    viewState: viewState,
    vlocks: {},
    refs: {},
    pending: {},
    defaults: defaults,
    initialData: inherit(defaults, initialData),
    setValid: defineObservableProperty(this, 'isValid', true, function () {
      return !any(fields, function (v, i) {
        return !v.disabled && (errors[i] || v.required && (v.isEmpty ? v.isEmpty(self.data[i]) : !self.data[i]));
      });
    })
  });

  self.isValid = true;
  self.autoPersist = true;
  self.validateOnChange = validateOnChange !== false;
  self.data = createDataObject(self, viewState.get() || state.initialData);
  self.on('dataChange', function (e) {
    state.pending = {};

    if (self.validateOnChange) {
      var fieldsToValidate = grep(e.data, function (v) {
        return fields[v] && fields[v].validateOnChange !== false;
      });

      if (fieldsToValidate[0]) {
        self.validate.apply(self, fieldsToValidate);
      }
    }
  });
}
definePrototype(FormContext, {
  element: function element(key) {
    var ref = form_(this).refs[key];

    return ref && ref.current;
  },
  focus: function focus(key) {
    var element = this.element(key);

    if (element) {
      dom_focus(element);
    }
  },
  on: function on(event, handler) {
    return form_emitter.add(this, event, handler);
  },
  persist: function persist() {
    var self = this;

    form_(self).viewState.set(extend({}, self.data));

    self.autoPersist = false;
  },
  restore: function restore() {
    var self = this;

    var data = form_(self).viewState.get();

    if (data) {
      self.reset(data);
    }

    return !!data;
  },
  reset: function reset(data) {
    var self = this;

    var state = form_(self);

    for (var i in self.data) {
      delete self.data[i];
    }

    extend(self.data, data || state.initialData);
    self.isValid = true;
    form_emitter.emit('reset', self);
  },
  setError: function setError(key, error) {
    var self = this;

    var state = form_(self);

    var errors = state.errors;
    var prev = errors[key] || '';

    if (isFunction(error)) {
      error = wrapErrorResult(state, key, error);
    }

    errors[key] = error;

    if ((error || '') !== prev) {
      form_emitter.emit('validationChange', self, {
        name: key,
        isValid: !error,
        message: String(error || '')
      });
      state.setValid();
    }
  },
  validate: function validate() {
    var self = this;

    var state = form_(self);

    var vlocks = state.vlocks;
    var props = makeArray(arguments);

    if (!props.length) {
      props = keys(state.fields);
    }

    var validate = function validate(v) {
      return form_emitter.emit('validate', self, {
        name: v,
        value: self.data[v]
      });
    };

    var promises = props.map(function (v) {
      var arr = vlocks[v] = vlocks[v] || [];
      var prev = arr[0];

      if (prev) {
        // debounce async validation
        return arr[1] || (arr[1] = always(arr[0], function () {
          var next = validate(v);
          always(next, function () {
            // dismiss effects of previous validation if later one resolves earlier
            // so that validity always reflects on latest data
            if (arr[0] === prev) {
              arr.shift();
            }
          });
          return next;
        }));
      }

      arr[0] = resolve(validate(v));
      return arr[0];
    });
    return resolveAll(promises).then(function (result) {
      props.forEach(function (v, i) {
        // checks if current validation is of the latest
        if (vlocks[v][0] === promises[i]) {
          vlocks[v].shift();
          self.setError(v, result[i]);
        }
      });
      state.setValid();
      return !any(result, function (v) {
        return v;
      });
    });
  }
});
function useFormContext(persistKey, initialData, validateOnChange) {
  if (typeof persistKey !== 'string') {
    return useFormContext('', persistKey, initialData);
  }

  var viewState = useViewState(persistKey);
  var form = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    return new FormContext(initialData, validateOnChange, viewState);
  })[0];
  var forceUpdate = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)()[1];
  useObservableProperty(form, 'isValid');
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    return combineFn(form.on('dataChange', function () {
      forceUpdate({});
    }), function () {
      if (form.autoPersist) {
        form.persist();
      }
    });
  }, [form]);
  return form;
}
function useFormField(props, defaultValue, prop) {
  prop = prop || 'value';
  var form = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useContext)(_FormContext);
  var ref = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useRef)();
  var key = props.name || '';
  var initialValue = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    return form && form.data[key] || defaultValue;
  })[0];
  var sValue = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(initialValue);
  var sError = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)('');
  var onValidate = useMemoizedFunction(props.onValidate);
  var controlled = (prop in props);
  var value = sValue[0],
      setValue = sValue[1];
  var error = sError[0],
      setError = sError[1];
  var setValueCallback = useMemoizedFunction(function (v) {
    var value = typeof v === 'function' ? v(props[prop]) : v;

    if (!controlled) {
      setValue(value);
    } else if (!props.onChange) {
      console.warn('onChange not supplied');
    }

    (props.onChange || noop)(value);
  }); // put internal states on props for un-controlled mode

  if (!controlled) {
    props = extend({}, props);
    props[prop] = value;
  }

  if (form && key) {
    form_(form).fields[key] = props;
  }

  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    if (form && key) {
      var state = form_(form);

      state.refs[key] = ref;
      state.defaults[key] = defaultValue;

      if (key in form.data) {
        setValue(form.data[key]);
      }

      return combineFn(function () {
        delete state.defaults[key];
        delete state.fields[key];
        delete state.refs[key];
        state.setValid();
      }, form.on('dataChange', function (e) {
        if (e.data.includes(key)) {
          setValue(form.data[key]);
        }
      }), form.on('validationChange', function (e) {
        if (e.name === key) {
          setError(state.errors[key]);
        }
      }), form.on('validate', function (e) {
        if (e.name === key) {
          return onValidate(e.value, e.name, form);
        }
      }), form.on('reset', function () {
        setValue(initialValue);
        setError('');
      }));
    }
  }, [form, key, initialValue, onValidate]);
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    var pending = form && key && form_(form).pending;

    if (pending && !pending[key]) {
      form.data[key] = value;
      pending[key] = false;
    }
  }, [form, key, value]);
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    if (form && key) {
      form_(form).setValid();
    }
  }, [form, key, props.validateOnChange, props.disabled, props.required]);
  return {
    value: props[prop],
    error: String(props.error || error || ''),
    setValue: setValueCallback,
    setError: setError,
    elementRef: function elementRef(v) {
      ref.current = v;
    }
  };
}
function combineValidators() {
  var validators = grep(makeArray(arguments), isFunction);
  return function (value, name) {
    return validators.reduce(function (prev, next) {
      return prev.then(function (result) {
        return result || next(value, name);
      });
    }, resolve());
  };
}
;// CONCATENATED MODULE: ./src/util.js


function classNames() {
  var className = [];

  (function process(args) {
    each(args, function (j, v) {
      if (v) {
        if (typeof v === 'string') {
          className.push(v);
        } else if (typeof v.getClassNames === 'function') {
          process(makeArray(v.getClassNames()));
        } else {
          for (var i in v) {
            var value = v[i];

            if (value) {
              className.push(value === true ? i : i + '-' + value);
            }
          }
        }
      }
    });
  })(makeArray(arguments));

  return className.join(' ');
}
function innerTextOrHTML(text) {
  return isPlainObject(text) ? {
    dangerouslySetInnerHTML: text
  } : {
    children: text
  };
}
function partial(setState, key) {
  var fn = function fn(key, value) {
    setState(function (v) {
      if (typeof key === 'string') {
        key = kv(key, isFunction(value) ? value(v[key], v) : value);
      }

      return extend({}, v, key);
    });
  };

  return key ? fn.bind(0, key) : fn;
}
function combineRef() {
  return combineFn(makeArray(arguments).map(toRefCallback));
}
function toRefCallback(ref) {
  if (ref && !isFunction(ref)) {
    return function (v) {
      return ref.current = v;
    };
  }

  return ref || noop;
}
function withSuspense(factory, fallback) {
  fallback = fallback || external_commonjs_react_commonjs2_react_amd_react_root_React_.Fragment;

  if (isFunction(fallback)) {
    fallback = /*#__PURE__*/(0,external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement)(fallback);
  }

  var Component = /*#__PURE__*/(0,external_commonjs_react_commonjs2_react_amd_react_root_React_.lazy)(factory);
  return function (props) {
    return /*#__PURE__*/(0,external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement)(external_commonjs_react_commonjs2_react_amd_react_root_React_.Suspense, {
      fallback: fallback
    }, /*#__PURE__*/(0,external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement)(Component, props));
  };
}
;// CONCATENATED MODULE: ./src/index.js






;// CONCATENATED MODULE: ./src/entry.js

/* harmony default export */ const entry = (src_namespaceObject);
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=zeta-dom-react.js.map