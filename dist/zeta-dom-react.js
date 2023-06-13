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
  "DateField": () => (DateField),
  "Form": () => (Form),
  "FormArray": () => (FormArray),
  "FormContext": () => (FormContext),
  "FormContextProvider": () => (FormContextProvider),
  "FormObject": () => (FormObject),
  "MultiChoiceField": () => (MultiChoiceField),
  "NumericField": () => (NumericField),
  "TextField": () => (TextField),
  "ToggleField": () => (ToggleField),
  "ValidationError": () => (ValidationError),
  "ViewStateProvider": () => (ViewStateProvider),
  "classNames": () => (classNames),
  "combineRef": () => (combineRef),
  "combineValidators": () => (combineValidators),
  "createBreakpointContext": () => (createBreakpointContext),
  "domEventRef": () => (domEventRef),
  "innerTextOrHTML": () => (innerTextOrHTML),
  "isSingletonDisposed": () => (isSingletonDisposed),
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
  "useSingleton": () => (useSingleton),
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
    getSafeAreaInset = domUtil_zeta$util.getSafeAreaInset,
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

;// CONCATENATED MODULE: ./tmp/zeta-dom/dom.js

var _defaultExport = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom;
/* harmony default export */ const dom = (_defaultExport);
var _zeta$dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom,
    textInputAllowed = _zeta$dom.textInputAllowed,
    beginDrag = _zeta$dom.beginDrag,
    beginPinchZoom = _zeta$dom.beginPinchZoom,
    insertText = _zeta$dom.insertText,
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

;// CONCATENATED MODULE: ./tmp/zeta-dom/events.js

var ZetaEventContainer = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.EventContainer;

;// CONCATENATED MODULE: ./src/hooks.js





var container = new ZetaEventContainer();
var singletons = new WeakSet();
var AbortController = window.AbortController;
function useUpdateTrigger() {
  var setState = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)()[1];
  return (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useCallback)(function () {
    setState({});
  }, []);
}
function useMemoizedFunction(callback) {
  var ref = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useRef)();
  ref.current = isFunction(callback) || noop;
  return (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useCallback)(function () {
    return ref.current.apply(this, arguments);
  }, []);
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
function useAsync(init, deps, debounce) {
  var state = useSingleton(function () {
    var element;
    var currentController;
    var nextResult;
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
      refresh: function refresh(force) {
        if (debounce && !force) {
          nextResult = nextResult || deferrable();
          nextResult.waitFor(delay(debounce));
          return nextResult.d || (nextResult.d = nextResult.then(function () {
            nextResult = null;
            return state.refresh(true);
          }));
        }

        var controller = AbortController ? new AbortController() : {
          abort: noop
        };

        if (currentController) {
          currentController.abort();
        }

        extend(state, {
          loading: true,
          error: undefined
        });
        var result = makeAsync(init)(controller.signal);
        var promise = always(result, function (resolved, value) {
          if (currentController === controller) {
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
        currentController = controller;
        notifyAsync(element || zeta_dom_dom.root, promise);
        return result;
      },
      abort: function abort(reason) {
        if (currentController) {
          currentController.abort(reason);
          currentController = null;
        }

        state.loading = false;
      }
    };
  }, function () {
    state.abort();
  });
  deps = [deps !== false].concat(isArray(deps) || []);
  init = useMemoizedFunction(init);
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    if (deps[0]) {
      // keep call to refresh in useEffect to avoid double invocation
      // in strict mode in development environment
      setImmediateOnce(state.refresh);
    }
  }, deps);
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useMemo)(function () {
    if (deps[0] && !debounce) {
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
function isSingletonDisposed(target) {
  return !singletons.has(target);
}
function useSingleton(factory, onDispose) {
  var target = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(factory())[0];
  setAdd(singletons, target);
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    setAdd(singletons, target);
    return function () {
      singletons["delete"](target);
      setImmediate(function () {
        if (isSingletonDisposed(target)) {
          (onDispose || target.dispose || noop).call(target);
        }
      });
    };
  }, [target]);
  return target;
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
      emit: function emit(error) {
        return catchError(error) || reemitError(error) || resolve();
      },
      "catch": function _catch(filter, callback) {
        var isErrorOf;

        if (!callback) {
          callback = filter;
        } else if (!isArray(filter)) {
          isErrorOf = isFunction(filter) ? is : isErrorWithCode;
        } else {
          isErrorOf = function isErrorOf(error, filter) {
            return any(filter, function (filter) {
              return (isFunction(filter) ? is : isErrorWithCode)(error, filter);
            });
          };
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
      return v.onError(handler.emit);
    }));
  }, args);
  return handler;
}
;// CONCATENATED MODULE: ./src/css.js




function useMediaQuery(query) {
  var mq = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useMemo)(function () {
    return matchMedia(query);
  }, [query]);
  var state = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(mq.matches);
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    return bind(mq, 'change', function () {
      state[1](mq.matches);
    });
  }, [mq]);
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

    return combineFn(dataView.on('viewChange', function () {
      viewState.set(dataView.toJSON());
      forceUpdate();
    }), viewState.onPopState ? viewState.onPopState(function (newValue) {
      viewState.set(dataView.toJSON());
      extend(dataView, newValue || state.defaults);
    }) : noop);
  }, [dataView]);
  return dataView;
}
;// CONCATENATED MODULE: ./src/util.js



var boundEvents = new WeakMap();
function domEventRef(event, handler) {
  var arr;
  handler = isPlainObject(event) || kv(event, handler);
  return function (element) {
    if (element) {
      if (arr) {
        throw new Error('Callback can only be passed to single React element');
      }

      arr = mapGet(boundEvents, element, Array);

      if (arr.index === undefined) {
        arr.index = 0;
      }

      handler = each(handler, function (i, v) {
        var index = arr.index++;

        if (!arr[index]) {
          zeta_dom_dom.on(element, i, function () {
            return arr[index].apply(this, arguments);
          });
        }

        arr[index] = throwNotFunction(v);
      });
    } else {
      arr.index = 0;
    }
  };
}
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
;// CONCATENATED MODULE: ./src/fields/ChoiceField.js
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }



function ChoiceField() {}

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

util_define(ChoiceField, {
  normalizeItems: normalizeChoiceItems
});
definePrototype(ChoiceField, {
  defaultValue: '',
  postHook: function postHook(state, props) {
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
  }
});
;// CONCATENATED MODULE: ./src/fields/DateField.js



var re = /^-?\d{4,}-\d{2}-\d{2}$/; // method mapping for relative date units

var units = {
  y: ['getFullYear', 'setFullYear'],
  m: ['getMonth', 'setMonth'],
  d: ['getDate', 'setDate']
};
units.w = units.d;

function parseRelativeDate(str) {
  var date = new Date();
  var dir = str[0] === '-' ? -1 : 1;
  str.toLowerCase().replace(/([+-]?)(\d+)([dwmy])/g, function (v, a, b, c) {
    date[units[c][1]](date[units[c][0]]() + b * (a === '-' ? -1 : a === '+' ? 1 : dir) * (c === 'w' ? 7 : 1));
  });
  return date;
}

function normalizeDate(date) {
  if (typeof date === 'string') {
    if (re.test(date)) {
      return Date.parse(date + ' 00:00');
    }

    date = date[0] === '+' || date[0] === '-' ? parseRelativeDate(date) : Date.parse(date);
  }

  return new Date(date).setHours(0, 0, 0, 0);
}

function clampValue(date, min, max) {
  var ts = normalizeDate(date);
  return ts < min ? min : ts > max ? max : date;
}

function toDateObject(str) {
  var ts = normalizeDate(str);
  return isNaN(ts) ? null : new Date(ts);
}

function toDateString(date) {
  if (!isNaN(date)) {
    // counter UTC conversion due to toISOString
    var tz = new Date(date).getTimezoneOffset() * 60000;
    var str = new Date(date - tz).toISOString();
    return str.slice(0, str.indexOf('T', 10));
  }

  return '';
}

function DateField() {}
util_define(DateField, {
  toDateString: toDateString,
  toDateObject: toDateObject
});
definePrototype(DateField, {
  defaultValue: '',
  normalizeValue: function normalizeValue(value) {
    return toDateString(normalizeDate(value));
  },
  postHook: function postHook(state, props) {
    var setValue = state.setValue;
    var value = state.value;
    var min = normalizeDate(props.min);
    var max = normalizeDate(props.max);
    var displayText = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useMemo)(function () {
      return value && props.formatDisplay ? props.formatDisplay(toDateObject(value)) : value;
    }, [value]);
    (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
      var clamped = value && clampValue(value, min, max);

      if (clamped !== value) {
        setValue(clamped);
      }
    }, [value, min, max]);
    return extend(state, {
      min: toDateString(min),
      max: toDateString(max),
      displayText: displayText,
      setValue: useMemoizedFunction(function (v) {
        v = isFunction(v) ? v(state.value) : v;

        if (!v) {
          setValue('');
        } else if (/\d{4}/.test(v) && /[^\s\d]/.test(v)) {
          v = normalizeDate(v);

          if (!isNaN(v)) {
            setValue(clampValue(v, min, max));
          }
        }
      })
    });
  }
});
;// CONCATENATED MODULE: ./src/fields/MultiChoiceField.js




function MultiChoiceField() {}
definePrototype(MultiChoiceField, {
  /** @type {any} */
  defaultValue: freeze([]),
  normalizeValue: function normalizeValue(newValue) {
    return isArray(newValue) || makeArray(newValue);
  },
  postHook: function postHook(state, props) {
    var allowCustomValues = props.allowCustomValues || !props.items;
    var items = ChoiceField.normalizeItems(props.items);

    var isUnknown = function isUnknown(value) {
      return !items.some(function (v) {
        return v.value === value;
      });
    };

    var toggleValue = useMemoizedFunction(function (value, selected) {
      if (allowCustomValues || !isUnknown(value)) {
        state.setValue(function (arr) {
          var index = arr.indexOf(value);

          if (isUndefinedOrNull(selected) || either(index >= 0, selected)) {
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
  }
});
;// CONCATENATED MODULE: ./src/fields/NumericField.js


function NumericField() {}
definePrototype(NumericField, {
  normalizeValue: function normalizeValue(newValue) {
    newValue = +newValue;
    return isNaN(newValue) ? undefined : newValue;
  },
  postHook: function postHook(state, props) {
    var value = state.value;
    var min = props.min;
    var max = props.max;
    var step = props.step;
    var allowEmpty = props.allowEmpty;
    (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
      var rounded = step > 0 ? Math.round(value / step) * step : value;

      if (rounded < min || isNaN(rounded) && !allowEmpty) {
        rounded = min || 0;
      } else if (rounded > max) {
        rounded = max;
      }

      if (rounded !== value) {
        state.setValue(rounded);
      }
    }, [value, min, max, step, allowEmpty]);
    return state;
  }
});
;// CONCATENATED MODULE: ./src/fields/TextField.js

function TextField() {}
definePrototype(TextField, {
  defaultValue: '',
  postHook: function postHook(state, props) {
    var form = state.form;
    var inputProps = pick(props, ['type', 'disabled', 'autoComplete', 'maxLength', 'inputMode', 'placeholder', 'enterKeyHint']);

    if (props.type === 'password' && !inputProps.autoComplete) {
      inputProps.autoComplete = 'current-password';
    }

    inputProps.type = inputProps.type || 'text';
    inputProps.enterKeyHint = inputProps.enterKeyHint || form && form.enterKeyHint;
    return extend(state, {
      inputProps: inputProps
    });
  }
});
;// CONCATENATED MODULE: ./src/fields/ToggleField.js

function ToggleField() {}
definePrototype(ToggleField, {
  defaultValue: false,
  valueProperty: 'checked',
  normalizeValue: function normalizeValue(value) {
    return !!value;
  },
  isEmpty: function isEmpty(value) {
    return !value;
  },
  postHook: function postHook(state) {
    return state;
  }
});
;// CONCATENATED MODULE: ./src/form.js










var form_ = createPrivateStore();

var form_emitter = new ZetaEventContainer();
var presets = new WeakMap();
var instances = new WeakMap();
var changedProps = new Map();
var fieldTypes = {
  text: TextField,
  toggle: ToggleField,
  choice: ChoiceField
};
/** @type {React.Context<any>} */

var FormObjectContext = /*#__PURE__*/(0,external_commonjs_react_commonjs2_react_amd_react_root_React_.createContext)(null);
var FormObjectProvider = FormObjectContext.Provider;
function ValidationError(kind, message, args) {
  this.kind = kind;
  this.args = args;
  this.message = message;
}

function isEmpty(value) {
  return isUndefinedOrNull(value) || value === '' || isArray(value) && !value.length;
}

function hasImplicitError(field) {
  return field.props.required && (field.props.isEmpty || field.preset.isEmpty || isEmpty)(field.value);
}

function cloneValue(value) {
  return form_(value) ? extend(true, isArray(value) ? [] : {}, value) : value;
}

function keyFor(value) {
  return (form_(value) || '').uniqueId;
}

function resolvePathInfo(form, path) {
  var arr = isArray(path) || path.split('.');
  var value = form.data;
  var parent = value;

  for (var i = 0, len = arr.length; i < len; i++) {
    if (!util_hasOwnProperty(value, arr[i])) {
      return {
        name: arr[len - 1],
        parent: i === len - 1 ? value : null
      };
    }

    parent = value;
    value = value[arr[i]];
  }

  return {
    exists: true,
    name: arr[len - 1],
    value: value,
    parent: parent
  };
}

function getField(form, path) {
  var prop = resolvePathInfo(form, path);
  var key = keyFor(prop.parent);
  return key && form_(form).fields[key + '.' + prop.name];
}

function getPath(form, obj, name) {
  if (obj === form.data) {
    return name;
  }

  var paths = form_(form).paths;

  var path = [name];

  for (var key = keyFor(obj); key = paths[key]; key = key.slice(0, 8)) {
    path.unshift(key.slice(9));
  }

  return resolvePathInfo(form, path).parent === obj ? path.join('.') : '';
}

function emitDataChangeEvent() {
  each(changedProps, function (form) {
    var state = form_(form);

    var props = mapRemove(changedProps, form);

    for (var i in props) {
      while (i = i.replace(/(^|\.)[^.]+$/, '')) {
        props[i] = true;
      }
    }

    var element = state.ref || zeta_dom_dom.root;
    var updatedFields = grep(state.fields, function (v) {
      return props[v.path];
    });
    form_emitter.emit('dataChange', form, keys(props));
    validateFields(form, grep(updatedFields, function (v) {
      return (v.props.validateOnChange + 1 || form.validateOnChange + 1) > 1;
    }));

    if (form.preventLeave && !state.unlock && updatedFields[0] && zeta_dom_dom.getEventSource(element) !== 'script') {
      var promise = new Promise(function (resolve) {
        state.unlock = function () {
          state.unlock = null;
          resolve();
        };
      });
      preventLeave(element, promise, function () {
        return form_emitter.emit('beforeLeave', form) || resolve();
      });
    }
  });
}

function handleDataChange(callback) {
  var local;
  var map = handleDataChange.d || (handleDataChange.d = local = new Set());

  try {
    callback();
  } finally {
    if (map === local) {
      each(local, function (i, v) {
        v.onChange(v.value);
      });
      handleDataChange.d = null;
    }
  }
}

handleDataChange.d = null;

function createDataObject(context, initialData) {
  var state = form_(context);

  var target = isArray(initialData) ? [] : {};
  var uniqueId = randomId();

  var onChange = function onChange(p, field) {
    var path = getPath(context, proxy, p);

    if (path) {
      if (field) {
        field.value = target[p];

        if (field.value !== target[p]) {
          setValue(p, field.value);
          return;
        }

        handleDataChange.d.add(field);
      } // ensure field associated with parent data object got notified


      for (var key = uniqueId; key = state.paths[key]; key = key.slice(0, 8)) {
        if (state.fields[key]) {
          handleDataChange.d.add(state.fields[key]);
        }
      }

      mapGet(changedProps, context, Object)[path] = true;
      setImmediateOnce(emitDataChangeEvent);
      return true;
    }
  };

  var setValue = function setValue(p, v) {
    if (isPlainObject(v) || isArray(v)) {
      // ensure changes to nested data objects
      // emits data change event to correct form context
      if ((form_(v) || '').context !== context) {
        v = createDataObject(context, v);
      }

      state.paths[keyFor(v)] = uniqueId + '.' + p;
    }

    target[p] = v;
    return v;
  };

  var deleteValue = function deleteValue(p) {
    delete target[p];
  };

  var proxy = new Proxy(target, {
    set: function set(t, p, v) {
      if (typeof p === 'string' && (t[p] !== v || !(p in t))) {
        handleDataChange(function () {
          var prev = t[p];

          if (isArray(t)) {
            if (p === 'length') {
              // check for truncated indexes that would be deleted without calling the trap
              for (var index = prev - 1; index >= v; index--) {
                onChange(index);
              }

              t[p] = v;
              return true;
            }
          } else {
            if (form_(v)) {
              _throws("Cannot assign proxied data object");
            } // apply changes to existing object or array when assigning new object or array
            // so that fields of the same path can have consistent key and state


            if (isArray(v) && isArray(prev)) {
              prev.splice.apply(prev, [0, prev.length].concat(v));
              return true;
            }

            if (isPlainObject(v) && form_(prev)) {
              for (var i in exclude(prev, v)) {
                delete prev[i];
              }

              extend(prev, v);
              return true;
            }
          }

          setValue(p, v);
          onChange(p, state.fields[uniqueId + '.' + p]);
        });
      }

      return true;
    },
    deleteProperty: function deleteProperty(t, p) {
      if (typeof p === 'string' && p in t) {
        handleDataChange(function () {
          deleteValue(p);
          onChange(p);
        });
      }

      return true;
    }
  });

  form_(proxy, {
    context: context,
    uniqueId: uniqueId,
    set: setValue,
    "delete": deleteValue
  });

  each(initialData, function (i, v) {
    setValue(i, v);
  });
  return proxy;
}

function createFieldState(initialValue) {
  var field = {
    initialValue: initialValue,
    value: initialValue,
    error: '',
    preset: {},
    onChange: function onChange(v) {
      if (field.props.onChange) {
        field.props.onChange(cloneValue(v));
      }
    },
    setValue: function setValue(v) {
      v = isFunction(v) ? v(field.value) : v;

      if (!field.controlled) {
        field.value = v;
      } else if (v !== field.value) {
        field.onChange(v);
      }
    },
    setError: function setError(v) {
      field.error = isFunction(v) ? v(field.error) : v;
      (field.form || {}).isValid = null;
    },
    elementRef: function elementRef(v) {
      field.element = v;
    }
  };
  watch(field, true);
  defineObservableProperty(field, 'value', initialValue, function (newValue, oldValue) {
    newValue = (field.preset.normalizeValue || pipe)(newValue, field.props);

    if (newValue !== oldValue && form_(oldValue)) {
      field.dict[field.name] = newValue;
      return oldValue;
    }

    return newValue;
  });
  defineObservableProperty(field, 'error', '', function (v) {
    return isFunction(v) || is(v, ValidationError) ? wrapErrorResult(field, v) : v || '';
  });
  watch(field, 'value', function (v) {
    if (field.key) {
      field.dict[field.name] = v;
    } else if (!field.controlled) {
      field.onChange(v);
    }
  });
  watch(field, 'error', function (v) {
    if (field.key) {
      form_emitter.emit('validationChange', field.form, {
        name: field.path,
        isValid: !v,
        message: String(v)
      });
    }
  });
  return field;
}

function useFormFieldInternal(form, state, field, preset, props, controlled, dict, key) {
  var hasErrorProp = ('error' in props);
  var prevKey = field.key || key;
  extend(field, {
    form: form,
    props: props,
    preset: preset,
    controlled: controlled,
    dict: dict,
    key: key
  });

  if (form && key) {
    field.name = key.slice(9);
    field.path = getPath(form, dict, field.name);

    if (prevKey !== key) {
      field.locks = [];

      if (!hasErrorProp) {
        field.error = '';
      }
    }

    state.fields[key] = field;
  }

  if (hasErrorProp) {
    field.error = props.error;
  }

  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    if (form && key) {
      state.fields[key] = field;
    }

    return function () {
      if (state && state.fields[key] === field) {
        delete state.fields[key];

        if (field.props.clearWhenUnmount) {
          form_(dict)["delete"](key.slice(9));
        }

        state.setValid();
      }
    };
  }, [state, field, key]);
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    if (state) {
      state.setValid();
    }
  }, [state, field.error, props.disabled, props.required]);
}

function validateFields(form, fields) {
  var state = form_(form);

  var imlicitErrors = map(fields, hasImplicitError);

  var validate = function validate(field) {
    var name = field.path;
    var value = field.value;
    return form_emitter.emit('validate', form, {
      name: name,
      value: value
    }) || ((field.props || '').onValidate || noop)(value, name, form);
  };

  var promises = fields.map(function (v) {
    var locks = v.locks || (v.locks = []);
    var prev = locks[0];

    if (prev) {
      // debounce async validation
      return locks[1] || (locks[1] = always(locks[0], function () {
        var next = validate(v);
        always(next, function () {
          // dismiss effects of previous validation if later one resolves earlier
          // so that validity always reflects on latest data
          if (locks[0] === prev) {
            locks.shift();
          }
        });
        return next;
      }));
    }

    locks[0] = resolve(validate(v));
    return locks[0];
  });
  return resolveAll(promises).then(function (result) {
    fields.forEach(function (v, i) {
      // checks if current validation is of the latest
      if (v.locks[0] === promises[i]) {
        v.locks.shift();
        v.error = result[i];
      }

      result[i] = result[i] || imlicitErrors[i];
    });
    state.setValid();
    return !any(result);
  });
}

function wrapErrorResult(field, error) {
  return {
    toString: function toString() {
      if (is(error, ValidationError)) {
        return single([field.props, field.form || '', FormContext], function (v) {
          return (v.formatError || noop).call(v, error, field.path || null, field.props, field.form);
        }) || error.message;
      }

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

function formPersist(form) {
  form_(form).viewState.set(form.toJSON());
}

function FormContext(initialData, options, viewState) {
  var self = this;
  var fields = {};

  var state = form_(self, {
    fields: fields,
    viewState: viewState,
    paths: {},
    initialData: initialData,
    setValid: defineObservableProperty(this, 'isValid', true, function () {
      return !any(fields, function (v) {
        return !v.props.disabled && (v.error || hasImplicitError(v));
      });
    })
  });

  extend(self, normalizeOptions(options));

  self.ref = function (element) {
    state.ref = element;

    if (element) {
      instances.set(element, self);
    }
  };

  self.isValid = true;
  self.data = createDataObject(self, viewState.get() || state.initialData);
}
util_define(FormContext, {
  ERROR_FIELD: 1,
  EMPTY_FIELD: 2,
  get: function get(element) {
    return single(parentsAndSelf(element), instances.get.bind(instances)) || null;
  }
});
definePrototype(FormContext, {
  element: function element(key) {
    return key ? (getField(this, key) || '').element : form_(this).ref;
  },
  focus: function focus(key) {
    var element;

    if (typeof key === 'number') {
      element = map(form_(this).fields, function (v) {
        return v.error && key & 1 || isEmpty(v.value) && key & 2 ? v.element : null;
      }).sort(comparePosition)[0];
    } else {
      element = this.element(key);
    }

    return !!element && dom_focus(element);
  },
  on: function on(event, handler) {
    return form_emitter.add(this, event, handler);
  },
  persist: function persist() {
    formPersist(this);
    this.autoPersist = false;
  },
  restore: function restore() {
    var self = this;

    var data = form_(self).viewState.get();

    if (data) {
      self.reset(data);
    }

    return !!data;
  },
  clear: function clear() {
    this.reset({});
  },
  reset: function reset(data) {
    var self = this;

    var state = form_(self);

    var dict = form_(self.data);

    for (var i in self.data) {
      dict["delete"](i);
    }

    each(data || state.initialData, function (i, v) {
      dict.set(i, v);
    });
    each(state.fields, function (i, v) {
      var prop = resolvePathInfo(self, v.path);

      if (v.controlled) {
        v.onChange(prop.exists ? prop.value : v.initialValue);
      } else if (prop.exists) {
        v.value = prop.value;
      }

      v.error = null;
    });
    state.setValid();
    (state.unlock || noop)();
    form_emitter.emit('reset', self);
  },
  getValue: function getValue(key) {
    return cloneValue(resolvePathInfo(this, key).value);
  },
  setValue: function setValue(key, value) {
    var prop = resolvePathInfo(this, key);

    if (prop.parent) {
      prop.parent[prop.name] = cloneValue(value);
    }
  },
  getErrors: function getErrors() {
    var errorFields = grep(form_(this).fields, function (v) {
      return v.error;
    });
    return errorFields[0] ? Object.fromEntries(errorFields.map(function (v) {
      return [v.path, String(v.error)];
    })) : null;
  },
  getError: function getError(key) {
    return String((getField(this, key) || '').error || '');
  },
  setError: function setError(key, error) {
    (getField(this, key) || {}).error = error;
  },
  validate: function validate() {
    var self = this;

    var fields = form_(self).fields;

    var prefix = makeArray(arguments);

    if (!prefix[0]) {
      return validateFields(self, grep(fields, function (v) {
        return !v.props.disabled;
      }));
    }

    return validateFields(self, grep(fields, function (v) {
      return any(prefix, function (w) {
        var len = w.length;
        return v.path.slice(0, len) === w && (!v.path[len] || v.path[len] === '.');
      });
    }));
  },
  toJSON: function toJSON() {
    return extend(true, {}, this.data);
  }
});
defineObservableProperty(FormContext.prototype, 'preventLeave', false, function (value) {
  if (!value) {
    (form_(this).unlock || noop)();
  }

  return !!value;
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
    return combineFn(form.on('dataChange', forceUpdate), form.on('reset', forceUpdate), bind(window, 'pagehide', function () {
      if (form.autoPersist) {
        formPersist(form);
      }
    }), function () {
      (form_(form).unlock || noop)();

      if (form.autoPersist) {
        formPersist(form);
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
  var dict = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useContext)(FormObjectContext);

  var form = dict && form_(dict).context;

  var state = form && form_(form);

  var name = props.name || '';
  var key = form && name && keyFor(dict) + '.' + name;
  var controlled = (prop in props);
  var field = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    var initialValue = controlled ? props[prop] : (preset.normalizeValue || pipe)(defaultValue !== undefined ? defaultValue : preset.defaultValue);
    return createFieldState(initialValue);
  })[0];
  useFormFieldInternal(form, state, field, preset, props, controlled, dict, key);

  if (controlled) {
    field.value = props[prop];
  }

  if (form && key) {
    if (!(name in dict)) {
      field.value = form_(dict).set(name, field.initialValue);
    } else if (!controlled) {
      field.value = dict[name];
    }
  }

  var state1 = (preset.postHook || pipe)({
    form: form,
    key: key,
    path: field.path,
    value: field.value,
    error: String(field.error),
    setValue: field.setValue,
    setError: field.setError,
    elementRef: field.elementRef
  }, props);
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

  extend(form, pick(props, ['enterKeyHint', 'preventLeave', 'formatError']));
  return /*#__PURE__*/(0,external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement)(FormObjectProvider, {
    value: form.data
  }, /*#__PURE__*/(0,external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement)('form', extend(exclude(props, ['context', 'enterKeyHint', 'preventLeave', 'formatError']), {
    ref: combineRef(ref, form.ref),
    onSubmit: onSubmit,
    onReset: onReset
  })));
});
function FormContextProvider(props) {
  return /*#__PURE__*/(0,external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement)(FormObjectProvider, {
    value: props.value.data
  }, props.children);
}
function FormArray(props) {
  return FormObject(extend({}, props, {
    defaultValue: []
  }));
}
function FormObject(props) {
  var dict = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useContext)(FormObjectContext);

  if (!form_(dict)) {
    _throws('Missing form context');
  }

  var fieldRef = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useRef)();

  var form = form_(dict).context;

  var state = form_(form);

  var name = props.name;
  var value = props.value;

  if (name) {
    value = isPlainObject(dict[name]) || isArray(dict[name]) || props.defaultValue || {};
    value = form_(dict).set(name, value);
  } else if (!(form_(value) || '').context) {
    _throws('Value must be a data object or array');
  } // field state registered by useFormField has a higher priority
  // create own field state only when needed


  var key = state.paths[keyFor(value)];

  if (typeof (state.fields[key] || '').controlled !== 'boolean') {
    var field = fieldRef.current || (fieldRef.current = createFieldState(value));
    useFormFieldInternal(form, state, field, {}, props, 0, dict, key);
    field.value = value;
  } else {
    (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(noop, [null]);
    (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(noop, [null]);
  }

  var children = props.children;

  if (isFunction(children)) {
    children = children(value);
  }

  return /*#__PURE__*/(0,external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement)(FormObjectProvider, {
    value: value
  }, children);
}
util_define(FormObject, {
  keyFor: keyFor
});







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