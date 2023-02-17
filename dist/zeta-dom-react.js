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
  "ChoiceField": () => (ChoiceField),
  "DataView": () => (DataView),
  "Form": () => (Form),
  "FormContext": () => (FormContext),
  "FormContextProvider": () => (FormContextProvider),
  "MultiChoiceField": () => (MultiChoiceField),
  "TextField": () => (TextField),
  "ToggleField": () => (ToggleField),
  "ViewStateProvider": () => (ViewStateProvider),
  "classNames": () => (classNames),
  "combineRef": () => (combineRef),
  "combineValidators": () => (combineValidators),
  "createBreakpointContext": () => (createBreakpointContext),
  "innerTextOrHTML": () => (innerTextOrHTML),
  "partial": () => (partial),
  "registerFieldType": () => (registerFieldType),
  "toRefCallback": () => (toRefCallback),
  "useAsync": () => (useAsync),
  "useDataView": () => (useDataView),
  "useDispose": () => (useDispose),
  "useErrorHandler": () => (useErrorHandler),
  "useErrorHandlerRef": () => (useErrorHandlerRef),
  "useFormContext": () => (useFormContext),
  "useFormField": () => (useFormField),
  "useMediaQuery": () => (useMediaQuery),
  "useMemoizedFunction": () => (useMemoizedFunction),
  "useObservableProperty": () => (useObservableProperty),
  "useRefInitCallback": () => (useRefInitCallback),
  "useUpdateTrigger": () => (useUpdateTrigger),
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
    _throws = _zeta$util["throws"],
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
    retryable = _zeta$util.retryable,
    deferrable = _zeta$util.deferrable,
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
    subscribeAsync = domLock_zeta$dom.subscribeAsync,
    notifyAsync = domLock_zeta$dom.notifyAsync,
    preventLeave = domLock_zeta$dom.preventLeave;

;// CONCATENATED MODULE: ./src/include/zeta-dom/domLock.js

;// CONCATENATED MODULE: ./tmp/zeta-dom/events.js

var ZetaEventContainer = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.EventContainer;

;// CONCATENATED MODULE: ./src/include/zeta-dom/events.js

;// CONCATENATED MODULE: ./src/hooks.js





var fnWeakMap = new WeakMap();
var container = new ZetaEventContainer();
function useUpdateTrigger() {
  var setState = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)()[1];
  return (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useCallback)(function () {
    setState({});
  }, []);
}
function useMemoizedFunction(callback) {
  var fn = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useCallback)(function fn() {
    var cb = fnWeakMap.get(fn);
    return cb && cb.apply(this, arguments);
  }, []);
  fnWeakMap.set(fn, callback);
  return fn;
}
function useObservableProperty(obj, key) {
  var forceUpdate = useUpdateTrigger();
  var value = obj[key];
  var ref = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useRef)();
  ref.current = value;
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    var cb = function cb(v) {
      if (v !== ref.current) {
        forceUpdate();
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
    var currentPromise;
    return {
      loading: false,
      value: undefined,
      error: undefined,
      elementRef: function elementRef(current) {
        element = current;
      },
      on: function on(event, handler) {
        return container.add(state, event, handler);
      },
      onError: function onError(handler) {
        return state.on('error', function (e) {
          return handler.call(state, e.error);
        });
      },
      refresh: function refresh() {
        extend(state, {
          loading: true,
          error: undefined
        });
        var result = makeAsync(init)();
        var promise = always(result, function (resolved, value) {
          if (!state.disposed && currentPromise === promise) {
            if (resolved) {
              extend(state, {
                loading: false,
                value: value
              });
              container.emit('load', state, {
                data: value
              });
            } else {
              extend(state, {
                loading: false,
                value: undefined,
                error: value
              });

              if (!container.emit('error', state, {
                error: value
              })) {
                throw value;
              }
            }
          }
        });
        currentPromise = promise;
        notifyAsync(element || zeta_dom_dom.root, promise);
        return result;
      }
    };
  })[0];
  deps = [deps !== false].concat(isArray(deps) || []);
  init = useMemoizedFunction(init);
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    state.disposed = false;
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
  return useErrorHandler.apply(this, arguments).ref;
}
function useErrorHandler() {
  var reemitting = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useRef)(false);

  var _ref = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useRef)(null);

  var args = makeArray(arguments);
  var handler = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    return {
      ref: function ref(element) {
        _ref.current = element;
        init(element);
      },
      "catch": function _catch(filter, callback) {
        var isErrorOf;

        if (callback) {
          isErrorOf = isFunction(filter) ? is : isErrorWithCode;
        } else {
          callback = filter;
        }

        return container.add(handler, isErrorOf ? 'error' : 'default', function (e) {
          if ((isErrorOf || pipe)(e.error, filter)) {
            return callback(e.error);
          }
        });
      }
    };
  })[0];
  var reemitError = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useCallback)(function (error) {
    try {
      reemitting.current = true;
      return zeta_dom_dom.emit('error', _ref.current || zeta_dom_dom.root, {
        error: error
      }, true);
    } finally {
      reemitting.current = false;
    }
  }, []);
  var catchError = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useCallback)(function (error) {
    return container.emit('error', handler, {
      error: error
    }) || container.emit('default', handler, {
      error: error
    });
  }, []);
  var init = useRefInitCallback(function (element) {
    zeta_dom_dom.on(element, 'error', function (e) {
      if (!reemitting.current) {
        return catchError(e.error);
      }
    });
  });
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    return combineFn(map(args, function (v) {
      return v.onError(function (error) {
        return catchError(error) || reemitError(error) || resolve();
      });
    }));
  }, args);
  return handler;
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
      var forceUpdate = useUpdateTrigger();
      (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
        return watch(values, forceUpdate);
      }, []);
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
  var forceUpdate = useUpdateTrigger();
  var dataView = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    return extend(new DataView(filters, sortBy, sortOrder, pageSize), viewState.get());
  })[0];
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    var state = _(dataView);

    return combineFn(dataView.on('viewChange', forceUpdate), viewState.onPopState ? viewState.onPopState(function (newValue) {
      viewState.set(dataView.toJSON());
      extend(dataView, newValue || state.defaults);
    }) : noop, function () {
      viewState.set(dataView.toJSON());
    });
  }, [dataView]);
  return dataView;
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
;// CONCATENATED MODULE: ./src/form.js
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }










var form_ = createPrivateStore();

var form_emitter = new ZetaEventContainer();
var presets = new WeakMap();
var changedProps = new Map();
var fieldTypes = {
  text: TextField,
  toggle: ToggleField,
  choice: ChoiceField
};
/** @type {React.Context<import ("./form").FormContext>} */
// @ts-ignore: type inference issue

var _FormContext = /*#__PURE__*/(0,external_commonjs_react_commonjs2_react_amd_react_root_React_.createContext)(null);

var FormContextProvider = _FormContext.Provider;

function isEmpty(value) {
  return isUndefinedOrNull(value) || value === '' || isArray(value) && !value.length;
}

function emitDataChangeEvent() {
  each(changedProps, function (i) {
    form_emitter.emit('dataChange', i, Object.keys(mapRemove(changedProps, i)));
  });
}

function createDataObject(context, initialData) {
  var state = form_(context);

  var target = extend({}, initialData);

  var onChange = function onChange(p) {
    mapGet(changedProps, context, Object)[p] = true;
    setImmediateOnce(emitDataChangeEvent);
  };

  var proxy = new Proxy(target, {
    set: function set(t, p, v) {
      if (typeof p === 'string' && (t[p] !== v || !(p in t))) {
        var field = state.fields[p];
        onChange(p);
        t[p] = v;

        if (field) {
          field.value = v;
          field.onChange(v);
        }
      }

      return true;
    },
    deleteProperty: function deleteProperty(t, p) {
      if (p in t) {
        onChange(p);
        delete t[p];
      }

      return true;
    }
  });

  form_(proxy, target);

  return proxy;
}

function wrapErrorResult(field, error) {
  return {
    toString: function toString() {
      return error(field.props || {});
    }
  };
}

function normalizeOptions(options) {
  if (typeof options === 'boolean') {
    options = {
      validateOnChange: options
    };
  }

  return extend({
    autoPersist: true,
    preventLeave: false,
    validateOnChange: true
  }, options);
}

function FormContext(initialData, options, viewState) {
  var self = this;
  var fields = {};

  var state = form_(self, {
    fields: fields,
    viewState: viewState,
    vlocks: {},
    initialData: initialData,
    setValid: defineObservableProperty(this, 'isValid', true, function () {
      return !any(fields, function (v, i) {
        var props = v.props;
        return !props.disabled && (v.error || props.required && (props.isEmpty || v.preset.isEmpty || isEmpty)(v.value));
      });
    })
  });

  extend(self, normalizeOptions(options));

  self.ref = function (element) {
    state.ref = element;
  };

  self.isValid = true;
  self.data = createDataObject(self, viewState.get() || state.initialData);
  self.on('dataChange', function (e) {
    if (self.validateOnChange) {
      var fieldsToValidate = grep(e.data, function (v) {
        return fields[v] && fields[v].props.validateOnChange !== false;
      });

      if (fieldsToValidate[0]) {
        self.validate.apply(self, fieldsToValidate);
      }
    }

    if (self.preventLeave && !state.unlock) {
      var promise = new Promise(function (resolve) {
        state.unlock = function () {
          state.unlock = null;
          resolve();
        };
      });
      preventLeave(state.ref || zeta_dom_dom.root, promise, function () {
        return form_emitter.emit('beforeLeave', self) || reject();
      });
    }
  });
}
definePrototype(FormContext, {
  element: function element(key) {
    var field = form_(this).fields[key];

    return field && field.element;
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

    form_(self).viewState.set(self.toJSON());

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

    var dict = form_(self.data);

    for (var i in dict) {
      delete dict[i];
    }

    extend(dict, data || state.initialData);
    each(state.fields, function (i, v) {
      if (v.controlled) {
        v.onChange(i in dict ? dict[i] : v.initialValue);
      } else if (i in dict) {
        v.value = dict[i];
      }

      v.error = null;
    });
    state.setValid();
    (state.unlock || noop)();
    form_emitter.emit('reset', self);
  },
  getError: function getError(key) {
    return String((form_(this).fields[key] || '').error || '');
  },
  setError: function setError(key, error) {
    (form_(this).fields[key] || {}).error = error;
  },
  validate: function validate() {
    var self = this;

    var state = form_(self);

    var vlocks = state.vlocks;
    var props = makeArray(arguments);

    if (!props.length) {
      props = keys(state.fields);
    }

    var validate = function validate(name) {
      var field = state.fields[name];
      var value = self.data[name];
      var result = form_emitter.emit('validate', self, {
        name: name,
        value: value
      });

      if (!result && field) {
        result = (field.props.onValidate || noop)(value, name, self);
      }

      return result;
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
  },
  toJSON: function toJSON() {
    return extend(true, {}, this.data);
  }
});
function useFormContext(persistKey, initialData, options) {
  if (typeof persistKey !== 'string') {
    return useFormContext('', persistKey, initialData);
  }

  var viewState = useViewState(persistKey);
  var form = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    return new FormContext(initialData, options, viewState);
  })[0];
  var forceUpdate = useUpdateTrigger();
  useObservableProperty(form, 'isValid');
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    return combineFn(form.on('dataChange', forceUpdate), form.on('reset', forceUpdate), function () {
      (form_(form).unlock || noop)();

      if (form.autoPersist) {
        form.persist();
      }
    });
  }, [form]);
  return form;
}
function useFormField(type, props, defaultValue, prop) {
  if (typeof type === 'string') {
    type = fieldTypes[type];
  }

  if (!isFunction(type)) {
    prop = defaultValue;
    defaultValue = props;
    props = type;
    type = '';
  }

  var preset = type ? mapGet(presets, type, type) : {};
  prop = prop || preset.valueProperty || 'value';
  var form = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useContext)(_FormContext);
  var dict = form && form.data;

  var state = form && form_(form);

  var key = props.name || '';
  var controlled = (prop in props);
  var field = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    var initialValue = controlled ? props[prop] : (preset.normalizeValue || pipe)(form && key in dict ? dict[key] : defaultValue !== undefined ? defaultValue : preset.defaultValue);
    var field = {
      initialValue: initialValue,
      value: initialValue,
      error: '',
      onChange: function onChange(v) {
        (field.props.onChange || noop)(v);
      },
      setValue: function setValue(v) {
        v = isFunction(v) ? v(field.value) : v;

        if (field.controlled) {
          field.onChange(v);
        } else {
          field.value = v;
        }
      },
      setError: function setError(v) {
        field.error = isFunction(v) ? v(field.error) : v;
      },
      elementRef: function elementRef(v) {
        field.element = v;
      }
    };
    watch(field, true);
    defineObservableProperty(field, 'value', initialValue, function (v) {
      return (field.preset.normalizeValue || pipe)(v, field.props);
    });
    defineObservableProperty(field, 'error', '', function (v) {
      return isFunction(v) ? wrapErrorResult(field, v) : v || '';
    });
    watch(field, 'value', function (v) {
      if (field.dict) {
        field.dict[field.name] = v;
      } else if (!field.controlled) {
        field.onChange(v);
      }
    });
    watch(field, 'error', function (v) {
      if (field.dict && field.name) {
        form_emitter.emit('validationChange', field.form, {
          name: field.name,
          isValid: !v,
          message: String(v)
        });
      }
    });
    return field;
  })[0];
  var hasErrorProp = ('error' in props);
  var prevKey = field.name || key;
  extend(field, {
    form: form,
    preset: preset,
    props: props,
    controlled: controlled,
    dict: dict,
    name: key
  });

  if (controlled) {
    field.value = props[prop];
  }

  if (hasErrorProp) {
    field.error = props.error;
  }

  if (form && key) {
    state.fields[key] = field;

    if (!hasErrorProp && key !== prevKey) {
      field.error = '';
    }

    if (!(key in dict)) {
      form_(dict)[key] = field.initialValue;
      field.value = dict[key];
    } else if (!controlled && key !== prevKey) {
      field.value = dict[key];
    }
  }

  var state1 = (preset.postHook || pipe)({
    form: form,
    value: field.value,
    error: String(field.error),
    setValue: field.setValue,
    setError: field.setError,
    elementRef: field.elementRef
  }, props);
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    return function () {
      if (state && state.fields[key] === field) {
        delete state.fields[key];

        if (field.props.clearWhenUnmount) {
          delete form_(field.dict)[key];
        }

        state.setValid();
      }
    };
  }, [state, key]);
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    if (state) {
      state.setValid();
    }
  }, [state, field.error, props.disabled, props.required]);
  state1.value = useObservableProperty(field, 'value');
  state1.error = String(useObservableProperty(field, 'error'));
  return state1;
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
function registerFieldType(type, options) {
  if (isFunction(options)) {
    options = {
      postHook: options
    };
  }

  fieldTypes[type] = function () {
    return options;
  };
}
var Form = /*#__PURE__*/(0,external_commonjs_react_commonjs2_react_amd_react_root_React_.forwardRef)(function (props, ref) {
  var form = props.context;

  var onSubmit = function onSubmit(e) {
    if (!props.action) {
      e.preventDefault();
    }

    (props.onSubmit || noop).call(this, e);
  };

  var onReset = function onReset(e) {
    e.preventDefault();
    form.reset();
    (props.onReset || noop).call(this, e);
  };

  extend(form, pick(props, ['enterKeyHint', 'preventLeave']));
  return /*#__PURE__*/(0,external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement)(FormContextProvider, {
    value: form
  }, /*#__PURE__*/(0,external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement)('form', extend(exclude(props, ['context', 'enterKeyHint', 'preventLeave']), {
    ref: combineRef(ref, form.ref),
    onSubmit: onSubmit,
    onReset: onReset
  })));
});

function normalizeChoiceItems(items) {
  return (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useMemo)(function () {
    return (items || []).map(function (v) {
      return _typeof(v) === 'object' ? v : {
        label: String(v),
        value: v
      };
    });
  }, [items]);
}

function TextField() {
  this.defaultValue = '';

  this.postHook = function (state, props) {
    var form = state.form;
    var inputProps = pick(props, ['type', 'autoComplete', 'maxLength', 'inputMode', 'placeholder', 'enterKeyHint']);

    if (props.type === 'password' && !inputProps.autoComplete) {
      inputProps.autoComplete = 'current-password';
    }

    inputProps.type = inputProps.type || 'text';
    inputProps.enterKeyHint = inputProps.enterKeyHint || form && form.enterKeyHint;
    return extend(state, {
      inputProps: inputProps
    });
  };
}
function ChoiceField() {
  this.defaultValue = '';

  this.postHook = function (state, props) {
    var items = normalizeChoiceItems(props.items);
    var selectedIndex = items.findIndex(function (v) {
      return v.value === state.value;
    });
    (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
      if (selectedIndex < 0) {
        selectedIndex = props.allowUnselect || !items[0] ? -1 : 0;
        state.setValue(selectedIndex < 0 ? '' : items[0].value);
      }
    });
    return extend(state, {
      items: items,
      selectedIndex: selectedIndex,
      selectedItem: items[selectedIndex]
    });
  };
}
function MultiChoiceField() {
  this.defaultValue = [];

  this.normalizeValue = function (newValue) {
    return isArray(newValue) || makeArray(newValue);
  };

  this.postHook = function (state, props) {
    var allowCustomValues = props.allowCustomValues || !props.items;
    var items = normalizeChoiceItems(props.items);

    var isUnknown = function isUnknown(value) {
      return !items.some(function (v) {
        return v.value === value;
      });
    };

    var toggleValue = useMemoizedFunction(function (value, selected) {
      if (allowCustomValues || !isUnknown(value)) {
        state.setValue(function (arr) {
          var index = arr.indexOf(value);

          if (isUndefinedOrNull(selected) || either(index < 0, selected)) {
            arr = makeArray(arr);

            if (index < 0) {
              arr.push(value);
            } else {
              arr.splice(index, 1);
            }
          }

          return arr;
        });
      }
    });
    (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
      if (!allowCustomValues) {
        var cur = makeArray(state.value);
        var arr = splice(cur, isUnknown);

        if (arr.length) {
          state.setValue(cur);
        }
      }
    });
    return extend(state, {
      items: items,
      toggleValue: toggleValue
    });
  };
}
function ToggleField() {
  this.defaultValue = false;
  this.valueProperty = 'checked';

  this.isEmpty = function (value) {
    return !value;
  };
}
;// CONCATENATED MODULE: ./src/index.js






;// CONCATENATED MODULE: ./tmp/zeta-dom/index.js

var zeta_dom_defaultExport = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_;
/* harmony default export */ const zeta_dom = (zeta_dom_defaultExport);
;// CONCATENATED MODULE: ./src/include/zeta-dom/index.js

/* harmony default export */ const include_zeta_dom = (zeta_dom);
;// CONCATENATED MODULE: ./src/entry.js

/* harmony default export */ const entry = (src_namespaceObject);

include_zeta_dom.react = src_namespaceObject;
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=zeta-dom-react.js.map