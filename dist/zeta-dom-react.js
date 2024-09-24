/*! zeta-dom-react v0.5.11 | (c) misonou | https://misonou.github.io */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("zeta-dom"), require("react"), require("react-dom"));
	else if(typeof define === 'function' && define.amd)
		define("zeta-dom-react", ["zeta-dom", "react", "react-dom"], factory);
	else if(typeof exports === 'object')
		exports["zeta-dom-react"] = factory(require("zeta-dom"), require("react"), require("react-dom"));
	else
		root["zeta"] = root["zeta"] || {}, root["zeta"]["react"] = factory(root["zeta"], root["React"], root["ReactDOM"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__231__, __WEBPACK_EXTERNAL_MODULE__12__, __WEBPACK_EXTERNAL_MODULE__33__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 12:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__12__;

/***/ }),

/***/ 33:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__33__;

/***/ }),

/***/ 231:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__231__;

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
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  ChoiceField: () => (/* reexport */ ChoiceField),
  DataView: () => (/* reexport */ DataView),
  DateField: () => (/* reexport */ DateField),
  Form: () => (/* reexport */ Form),
  FormArray: () => (/* reexport */ FormArray),
  FormContext: () => (/* reexport */ FormContext),
  FormContextProvider: () => (/* reexport */ FormContextProvider),
  FormObject: () => (/* reexport */ FormObject),
  HiddenField: () => (/* reexport */ HiddenField),
  MultiChoiceField: () => (/* reexport */ MultiChoiceField),
  NumericField: () => (/* reexport */ NumericField),
  TextField: () => (/* reexport */ TextField),
  ToggleField: () => (/* reexport */ ToggleField),
  ValidationError: () => (/* reexport */ ValidationError),
  ViewStateProvider: () => (/* reexport */ ViewStateProvider),
  classNames: () => (/* reexport */ classNames),
  combineRef: () => (/* reexport */ combineRef),
  combineValidators: () => (/* reexport */ combineValidators),
  createAsyncScope: () => (/* reexport */ createAsyncScope),
  createBreakpointContext: () => (/* reexport */ createBreakpointContext),
  createDependency: () => (/* reexport */ createDependency),
  createErrorHandler: () => (/* reexport */ createErrorHandler),
  domEventRef: () => (/* reexport */ domEventRef),
  innerTextOrHTML: () => (/* reexport */ innerTextOrHTML),
  isSingletonDisposed: () => (/* reexport */ isSingletonDisposed),
  partial: () => (/* reexport */ partial),
  registerFieldType: () => (/* reexport */ registerFieldType),
  toRefCallback: () => (/* reexport */ toRefCallback),
  useAsync: () => (/* reexport */ useAsync),
  useAutoSetRef: () => (/* reexport */ useAutoSetRef),
  useDataView: () => (/* reexport */ useDataView),
  useDependency: () => (/* reexport */ useDependency),
  useDispose: () => (/* reexport */ useDispose),
  useEagerReducer: () => (/* reexport */ useEagerReducer),
  useEagerState: () => (/* reexport */ useEagerState),
  useErrorHandler: () => (/* reexport */ useErrorHandler),
  useErrorHandlerRef: () => (/* reexport */ useErrorHandlerRef),
  useEventTrigger: () => (/* reexport */ useEventTrigger),
  useFormContext: () => (/* reexport */ useFormContext),
  useFormField: () => (/* reexport */ useFormField),
  useMediaQuery: () => (/* reexport */ useMediaQuery),
  useMemoizedFunction: () => (/* reexport */ useMemoizedFunction),
  useObservableProperty: () => (/* reexport */ useObservableProperty),
  useRefInitCallback: () => (/* reexport */ useRefInitCallback),
  useSingleton: () => (/* reexport */ useSingleton),
  useUnloadEffect: () => (/* reexport */ useUnloadEffect),
  useUpdateTrigger: () => (/* reexport */ useUpdateTrigger),
  useValueTrigger: () => (/* reexport */ useValueTrigger),
  useViewState: () => (/* reexport */ useViewState),
  withSuspense: () => (/* reexport */ withSuspense)
});

// EXTERNAL MODULE: external {"commonjs":"zeta-dom","commonjs2":"zeta-dom","amd":"zeta-dom","root":"zeta"}
var external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_ = __webpack_require__(231);
;// CONCATENATED MODULE: ./|umd|/zeta-dom/util.js

var _lib$util = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.util,
  always = _lib$util.always,
  any = _lib$util.any,
  arrRemove = _lib$util.arrRemove,
  catchAsync = _lib$util.catchAsync,
  clearImmediateOnce = _lib$util.clearImmediateOnce,
  combineFn = _lib$util.combineFn,
  createPrivateStore = _lib$util.createPrivateStore,
  util_define = _lib$util.define,
  defineGetterProperty = _lib$util.defineGetterProperty,
  defineObservableProperty = _lib$util.defineObservableProperty,
  defineOwnProperty = _lib$util.defineOwnProperty,
  definePrototype = _lib$util.definePrototype,
  delay = _lib$util.delay,
  each = _lib$util.each,
  either = _lib$util.either,
  equal = _lib$util.equal,
  errorWithCode = _lib$util.errorWithCode,
  exclude = _lib$util.exclude,
  extend = _lib$util.extend,
  fill = _lib$util.fill,
  freeze = _lib$util.freeze,
  grep = _lib$util.grep,
  util_hasOwnProperty = _lib$util.hasOwnProperty,
  is = _lib$util.is,
  isArray = _lib$util.isArray,
  isErrorWithCode = _lib$util.isErrorWithCode,
  isFunction = _lib$util.isFunction,
  isPlainObject = _lib$util.isPlainObject,
  isUndefinedOrNull = _lib$util.isUndefinedOrNull,
  keys = _lib$util.keys,
  kv = _lib$util.kv,
  makeArray = _lib$util.makeArray,
  makeAsync = _lib$util.makeAsync,
  map = _lib$util.map,
  mapGet = _lib$util.mapGet,
  mapRemove = _lib$util.mapRemove,
  noop = _lib$util.noop,
  pick = _lib$util.pick,
  pipe = _lib$util.pipe,
  randomId = _lib$util.randomId,
  resolve = _lib$util.resolve,
  resolveAll = _lib$util.resolveAll,
  sameValueZero = _lib$util.sameValueZero,
  setAdd = _lib$util.setAdd,
  setImmediate = _lib$util.setImmediate,
  setImmediateOnce = _lib$util.setImmediateOnce,
  single = _lib$util.single,
  splice = _lib$util.splice,
  throwNotFunction = _lib$util.throwNotFunction,
  _throws = _lib$util["throws"],
  watch = _lib$util.watch;

// EXTERNAL MODULE: external {"commonjs":"react","commonjs2":"react","amd":"react","root":"React"}
var external_commonjs_react_commonjs2_react_amd_react_root_React_ = __webpack_require__(12);
;// CONCATENATED MODULE: ./|umd|/react.js

var Fragment = external_commonjs_react_commonjs2_react_amd_react_root_React_.Fragment,
  StrictMode = external_commonjs_react_commonjs2_react_amd_react_root_React_.StrictMode,
  Suspense = external_commonjs_react_commonjs2_react_amd_react_root_React_.Suspense,
  createContext = external_commonjs_react_commonjs2_react_amd_react_root_React_.createContext,
  createElement = external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement,
  forwardRef = external_commonjs_react_commonjs2_react_amd_react_root_React_.forwardRef,
  lazy = external_commonjs_react_commonjs2_react_amd_react_root_React_.lazy,
  useCallback = external_commonjs_react_commonjs2_react_amd_react_root_React_.useCallback,
  useContext = external_commonjs_react_commonjs2_react_amd_react_root_React_.useContext,
  useEffect = external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect,
  useMemo = external_commonjs_react_commonjs2_react_amd_react_root_React_.useMemo,
  useReducer = external_commonjs_react_commonjs2_react_amd_react_root_React_.useReducer,
  useRef = external_commonjs_react_commonjs2_react_amd_react_root_React_.useRef,
  useState = external_commonjs_react_commonjs2_react_amd_react_root_React_.useState;

;// CONCATENATED MODULE: ./|umd|/zeta-dom/domUtil.js

var domUtil_lib$util = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.util,
  bind = domUtil_lib$util.bind,
  comparePosition = domUtil_lib$util.comparePosition,
  parentsAndSelf = domUtil_lib$util.parentsAndSelf;

;// CONCATENATED MODULE: ./|umd|/zeta-dom/dom.js

var dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom;
/* harmony default export */ const zeta_dom_dom = (dom);
var dom_focus = dom.focus,
  reportError = dom.reportError;

;// CONCATENATED MODULE: ./|umd|/zeta-dom/domLock.js

var _lib$dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom,
  notifyAsync = _lib$dom.notifyAsync,
  preventLeave = _lib$dom.preventLeave;

;// CONCATENATED MODULE: ./|umd|/zeta-dom/events.js

var EventContainer = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.EventContainer;

;// CONCATENATED MODULE: ./|umd|/zeta-dom/errorCode.js

var errorCode = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.ErrorCode;
var cancelled = errorCode.cancelled;

// EXTERNAL MODULE: external {"commonjs":"react-dom","commonjs2":"react-dom","amd":"react-dom","root":"ReactDOM"}
var external_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_root_ReactDOM_ = __webpack_require__(33);
;// CONCATENATED MODULE: ./src/env.umd.js


var extraRender = true;
external_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_root_ReactDOM_.flushSync(function () {
  function TestComponent() {
    extraRender = !extraRender;
    return null;
  }
  var container = document.createElement('div');
  var element = /*#__PURE__*/createElement(StrictMode, null, /*#__PURE__*/createElement(TestComponent));
  if (external_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_root_ReactDOM_.createRoot) {
    external_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_root_ReactDOM_.createRoot(container).render(element);
  } else {
    external_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_root_ReactDOM_.render(element, container);
  }
});
var IS_DEV = extraRender;
;// CONCATENATED MODULE: ./src/hooks.js








var _ = /*#__PURE__*/createPrivateStore();
var container = new EventContainer();
var singletons = new Map();
var disposedSingletons = new WeakSet();
var unloadCallbacks = new Set();
var AsyncScopeContext = /*#__PURE__*/createContext(null);
var AbortController = window.AbortController;
var useSingletonEffect = IS_DEV ? useSingletonEffectImplDev : useSingletonEffectImpl;
var sameValue = Object.is || function (a, b) {
  return sameValueZero(a, b) && (a !== 0 || 1 / a === 1 / b);
};
bind(window, 'pagehide', function (e) {
  combineFn(makeArray(unloadCallbacks))(e.persisted);
});
function muteRejection(promise) {
  catchAsync(promise);
  return promise;
}
function clearUnusedSingletons() {
  each(singletons, function (i, v) {
    if (clearUnusedSingletons.d & (v.d || 1)) {
      disposedSingletons.add(i);
      mapRemove(singletons, i).call(i, i, v.d === 2);
    }
  });
  clearUnusedSingletons.d = 0;
}
function useSingletonEffectImpl(factory, dispose, deps) {
  var target = useMemo(factory, deps);
  useEffect(function () {
    return function () {
      disposedSingletons.add(target);
      dispose.call(target, target, true);
    };
  }, [target]);
  return target;
}
function useSingletonEffectImplDev(factory, dispose, deps) {
  var target = useMemo(function () {
    var target = factory();
    if (!singletons.has(target)) {
      singletons.set(target, dispose);
      clearUnusedSingletons.d = 0;
      clearImmediateOnce(clearUnusedSingletons);
    }
    return target;
  }, deps);
  useEffect(function () {
    var cb = function cb(flag) {
      singletons.get(target).d = flag ? 4 : 2;
      clearUnusedSingletons.d |= flag ? 1 : 2;
      setImmediateOnce(clearUnusedSingletons);
    };
    cb(true);
    return cb;
  }, [target]);
  return target;
}
function createRefInitCallback(set, init, args) {
  return function (v) {
    if (v && setAdd(set, v)) {
      args[0] = v;
      init.apply(null, args);
    }
  };
}
function createAsyncScope(element) {
  return {
    errorHandler: createErrorHandler(element),
    Provider: function Provider(props) {
      return /*#__PURE__*/createElement(AsyncScopeContext.Provider, {
        value: element
      }, props.children);
    }
  };
}
function useAutoSetRef(value) {
  var ref = useRef();
  ref.current = value;
  return ref;
}
function useEagerReducer(reducer, init) {
  var state = useState(function () {
    var value = isFunction(init) ? init() : init;
    var fn = function fn(newValue) {
      newValue = reducer(value, newValue);
      if (!sameValue(newValue, value)) {
        value = newValue;
        state[1]([value, fn]);
      }
    };
    return [value, fn];
  });
  return state[0];
}
function useEagerState(init) {
  return useEagerReducer(function (prevState, state) {
    return isFunction(state) ? state(prevState) : state;
  }, init);
}
function useUpdateTrigger() {
  return useReducer(function () {
    return {};
  })[1];
}
function useValueTrigger(value, comparer) {
  var state = useEagerReducer(function (ref, value) {
    return (comparer || sameValue)(ref.current, value) ? ref : {
      current: value
    };
  }, {});
  state[0].current = value;
  return state[1];
}
function useEventTrigger(obj, event, selector, initialState) {
  var state = useEagerState(initialState);
  useEffect(function () {
    var callback = function callback(e) {
      state[1](selector ? selector.bind(this, e) : {});
    };
    return obj.addEventListener ? bind(obj, event, callback) : obj.on(fill(event, callback));
  }, [obj, event]);
  return selector ? state[0] : undefined;
}
function useMemoizedFunction(callback) {
  var ref = useAutoSetRef(callback);
  return useCallback(function () {
    return (isFunction(ref.current) || noop).apply(this, arguments);
  }, []);
}
function useObservableProperty(obj, key) {
  var value = obj[key];
  var notifyChange = useValueTrigger(value);
  useEffect(function () {
    notifyChange(obj[key]);
    return watch(obj, key, notifyChange);
  }, [obj, key]);
  return value;
}
function useAsync(init, deps, debounce) {
  var scopeElement = useContext(AsyncScopeContext);
  var state = useSingleton(function () {
    var lastTime = 0;
    var element;
    var currentController;
    var nextResult;
    var _reset = function reset(loading, value, error, reason) {
      if (currentController) {
        currentController.abort(reason);
        currentController = null;
      }
      nextResult = null;
      extend(state, {
        loading: loading,
        value: value,
        error: error
      });
      notifyChange([loading, value, error]);
    };
    var _refresh = function refresh() {
      var controller = AbortController ? new AbortController() : {
        abort: noop
      };
      var result = makeAsync(init)(controller.signal);
      var promise = always(result, function (resolved, value) {
        if (currentController === controller) {
          currentController = null;
          if (resolved) {
            _reset(false, value);
            container.emit('load', state, {
              data: value
            });
          } else {
            _reset(false, undefined, value);
            if (!container.emit('error', state, {
              error: value
            })) {
              throw value;
            }
          }
        }
      });
      _reset(true, state.value);
      lastTime = Date.now();
      currentController = controller;
      notifyAsync(element || scopeElement || zeta_dom_dom.root, promise);
      return result;
    };
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
        return nextResult || (nextResult = muteRejection(new Promise(function (resolve, reject) {
          var previousController = currentController || {
            abort: noop
          };
          currentController = {
            abort: function abort(reason) {
              previousController.abort(reason);
              reject(reason || errorWithCode(cancelled));
            }
          };
          (Date.now() - lastTime < debounce ? delay(debounce) : Promise.resolve()).then(resolve);
        }).then(_refresh)));
      },
      abort: function abort(reason) {
        _reset(false, state.value, state.error, reason);
      },
      reset: function reset() {
        _reset(false);
        lastTime = 0;
      }
    };
  }, [], function () {
    state.abort();
  });
  deps = [deps !== false].concat(isArray(deps) || []);
  init = useMemoizedFunction(init);
  useEffect(function () {
    if (deps[0]) {
      // keep call to refresh in useEffect to avoid double invocation
      // in strict mode in development environment
      state.refresh();
    }
  }, deps);
  useMemo(function () {
    if (deps[0] && !debounce) {
      state.loading = true;
    }
  }, deps);
  var notifyChange = useValueTrigger([state.loading, state.value, state.error], equal);
  return [state.value, state];
}
function useRefInitCallback() {
  var args = makeArray(arguments);
  var set = useState(new WeakSet())[0];
  return createRefInitCallback(set, args[0], args);
}
function useDispose() {
  var dispose = useState(function () {
    var callbacks = [function () {
      callbacks.splice(0, callbacks.length - 1);
    }];
    return extend(combineFn(callbacks), {
      push: callbacks.splice.bind(callbacks, -1, 0)
    });
  })[0];
  useEffect(function () {
    return dispose;
  }, [dispose]);
  return dispose;
}
function isSingletonDisposed(target) {
  return disposedSingletons.has(target);
}
function useSingleton(factory, deps, onDispose) {
  if (isFunction(deps)) {
    onDispose = deps;
    deps = [];
  }
  onDispose = onDispose || function (target) {
    (target.dispose || noop).call(target);
  };
  return isFunction(factory) ? useSingletonEffect(factory, onDispose, deps || []) : useSingletonEffect(pipe.bind(0, factory), onDispose, [factory]);
}
function useErrorHandlerRef() {
  return useErrorHandler.apply(this, arguments).ref;
}
function createErrorHandler(element) {
  var reemitting;
  var reemitError = function reemitError(error) {
    try {
      reemitting = true;
      return reportError(error, element);
    } finally {
      reemitting = false;
    }
  };
  var catchError = function catchError(error) {
    return container.emit('error', handler, {
      error: error
    }) || container.emit('default', handler, {
      error: error
    });
  };
  var initElement = function initElement(current) {
    element = current;
    return zeta_dom_dom.on(current, 'error', function (e) {
      return reemitting ? undefined : catchError(e.error);
    });
  };
  var handler = {
    emit: function emit(error) {
      return catchError(error) || reemitError(error) || resolve();
    },
    "catch": function _catch(filter, callback) {
      var isErrorOf = pipe;
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
      return container.add(handler, isErrorOf === pipe ? 'default' : 'error', function (e) {
        if (isErrorOf(e.error, filter)) {
          return callback(e.error);
        }
      });
    }
  };
  if (element) {
    initElement(element);
  } else {
    handler.ref = createRefInitCallback(new WeakSet(), initElement, []);
  }
  return handler;
}
function useErrorHandler() {
  var args = makeArray(arguments);
  var handler = useState(createErrorHandler)[0];
  useEffect(function () {
    return combineFn(map(args, function (v) {
      return v.onError(handler.emit);
    }));
  }, args);
  return handler;
}
function useUnloadEffect(callback) {
  callback = useMemoizedFunction(callback);
  unloadCallbacks.add(callback);
  useSingletonEffect(pipe.bind(0, callback), function (target, used) {
    unloadCallbacks["delete"](callback);
    return used && callback(false);
  }, []);
}
function createDependency(defaultValue) {
  var Provider = freeze({});
  var Consumer = freeze({});
  var dependency = {
    Provider: Provider,
    Consumer: Consumer
  };
  var values = _(dependency, extend([], dependency));
  defineObservableProperty(values, 'current', defaultValue, function () {
    return values[0] ? values[0].value : defaultValue;
  });
  _(Provider, values);
  _(Consumer, values);
  return freeze(dependency);
}
function useDependency(dependency, value, deps) {
  var values = _(dependency);
  if (dependency === values.Provider) {
    var wrapper = useSingleton(function () {
      var obj = {};
      return values.push(obj) && obj;
    }, [values], function () {
      arrRemove(values, wrapper);
      values.current = null;
    });
    useMemo(function () {
      value = isFunction(value) ? value() : value;
      if (wrapper.value !== value || !util_hasOwnProperty(wrapper, 'value')) {
        defineOwnProperty(wrapper, 'value', value, true);
        values.current = null;
      }
    }, [wrapper].concat(deps || [value]));
    return wrapper;
  } else {
    return useObservableProperty(values, 'current');
  }
}
;// CONCATENATED MODULE: ./src/css.js




function useMediaQuery(query) {
  var mq = useMemo(function () {
    return matchMedia(query);
  }, [query]);
  useEventTrigger(mq, 'change');
  return mq.matches;
}

/**
 * @param {Zeta.Dictionary<string>} breakpoints
 */
function createBreakpointContext(breakpoints) {
  var values = {};
  var handleChanges = watch(values, true);
  var updateAll = combineFn(map(breakpoints, function (v, i) {
    var mq = matchMedia(v);
    var setValue = defineObservableProperty(values, i, mq.matches, true);
    bind(mq, 'change', function () {
      if (mq.matches !== values[i]) {
        handleChanges(updateAll);
      }
    });
    return function () {
      return setValue(mq.matches);
    };
  }));
  return {
    breakpoints: Object.freeze(values),
    useBreakpoint: function useBreakpoint() {
      var deps = makeArray(arguments);
      var forceUpdate = useUpdateTrigger();
      useEffect(function () {
        return watch(values, function (e) {
          if (!deps.length || single(deps, util_hasOwnProperty.bind(0, e.newValues))) {
            forceUpdate();
          }
        });
      }, deps);
      return values;
    }
  };
}
;// CONCATENATED MODULE: ./src/viewState.js




/** @type {React.Context<import("./viewState").ViewStateProvider | null>} */
var ViewStateProviderContext = /*#__PURE__*/createContext(null);
var ViewStateProvider = ViewStateProviderContext.Provider;
function useViewState(key) {
  var uniqueId = useState(randomId)[0];
  var provider = useContext(ViewStateProviderContext);
  return useSingleton(function () {
    return provider && key && provider.getState(uniqueId, key) || {
      get: noop,
      set: noop
    };
  }, [provider, key, uniqueId]);
}
;// CONCATENATED MODULE: ./src/dataView.js





var dataView_ = createPrivateStore();
var proto = DataView.prototype;
var emitter = new EventContainer();
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
function setPageCount(dataView, pageSize, itemCount) {
  dataView_(dataView).setPageCount(Math.ceil(itemCount / (pageSize || itemCount || 1)));
}
function DataView(filters, sortBy, sortOrder, pageSize) {
  var self = this;
  var defaults = {
    filters: extend({}, filters),
    sortBy: sortBy,
    sortOrder: sortOrder || sortBy && 'asc',
    itemCount: null,
    pageIndex: 0,
    pageSize: pageSize === undefined ? DataView.pageSize : pageSize
  };
  var state = dataView_(self, {
    setPageCount: defineObservableProperty(self, 'pageCount', 0, true),
    defaults: defaults,
    items: []
  });
  var emitViewChange = function emitViewChange() {
    emitter.emit('viewChange', self);
  };
  var onUpdated = function onUpdated(e) {
    var isFilter = this !== self;
    var emitEvent = isFilter || single(e.newValues, function (v, i) {
      return i !== 'pageCount' && i !== 'itemCount';
    });
    state.sorted = state.items.length ? undefined : [];
    if (isFilter) {
      state.filtered = state.sorted;
    }
    self.pageIndex = isFilter || !util_hasOwnProperty(e.newValues, 'pageIndex') ? 0 : self.pageIndex;
    if (emitEvent) {
      setImmediateOnce(emitViewChange);
    }
  };
  var filters = extend(self, defaults).filters;
  state.callback = watch(filters, false);
  watch(self, onUpdated);
  watch(self.filters, onUpdated);
  for (var i in filters) {
    defineObservableProperty(filters, i);
  }
  freeze(filters);
}
util_define(DataView, {
  pageSize: 0
});
definePrototype(DataView, {
  get hasPreviousPage() {
    return this.pageIndex > 0;
  },
  get hasNextPage() {
    return this.pageIndex < this.pageCount - 1;
  },
  on: function on(event, handler) {
    return emitter.add(this, event, handler);
  },
  getView: function getView(items, callback) {
    var self = this;
    var state = dataView_(self);
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
  toggleSort: function toggleSort(sortBy, sortOrder) {
    var self = this;
    if (self.sortBy === sortBy) {
      self.sortOrder = self.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      self.sortBy = sortBy;
      self.sortOrder = sortOrder || 'asc';
    }
  },
  toJSON: function toJSON() {
    var self = this;
    return extend(pick(self, keys(dataView_(self).defaults)), {
      filters: extend({}, self.filters),
      itemCount: self.itemCount
    });
  },
  reset: function reset(values) {
    var self = this;
    var state = dataView_(self);
    delete state.itemCount;
    values = values || state.defaults;
    state.callback(function () {
      extend(self.filters, values.filters);
    });
    return extend(self, values);
  }
});
defineObservableProperty(proto, 'sortBy');
defineObservableProperty(proto, 'sortOrder');
defineObservableProperty(proto, 'itemCount', 0, function (newValue) {
  dataView_(this).itemCount = newValue;
  setPageCount(this, this.pageSize, newValue);
  return newValue || 0;
});
defineObservableProperty(proto, 'pageSize', 0, function (newValue) {
  setPageCount(this, newValue, this.itemCount);
  return newValue;
});
defineObservableProperty(proto, 'pageIndex', 0, function (newValue) {
  return Math.max(0, isUndefinedOrNull(dataView_(this).itemCount) ? newValue : Math.min(newValue, this.pageCount - 1));
});
defineObservableProperty(proto, 'filters', {}, function (newValue, oldValue) {
  return extend(oldValue || {}, newValue);
});
function useDataView(persistKey, filters, sortBy, sortOrder, pageSize) {
  if (typeof persistKey !== 'string') {
    return useDataView('__dataView', persistKey, filters, sortBy, sortOrder);
  }
  var viewState = useViewState(persistKey);
  var forceUpdate = useUpdateTrigger();
  var dataView = useState(function () {
    return new DataView(filters, sortBy, sortOrder, pageSize).reset(viewState.get());
  })[0];
  useEffect(function () {
    return combineFn(dataView.on('viewChange', function () {
      viewState.set(dataView.toJSON());
      forceUpdate();
    }), viewState.onPopState ? viewState.onPopState(function (newValue) {
      viewState.set(dataView.toJSON());
      dataView.reset(newValue);
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
      if (arr && arr.ref) {
        throw new Error('Callback can only be passed to single React element');
      }
      arr = mapGet(boundEvents, element, Array);
      if (arr.index === undefined) {
        arr.index = 0;
      }
      var index = arr.index++;
      var state = arr[index] || (arr[index] = {
        keys: {}
      });
      each(handler, function (i, v) {
        throwNotFunction(v);
        state.keys[i] = state.keys[i] || zeta_dom_dom.on(element, i, function () {
          return (state.handler[i] || noop).apply(this, arguments);
        });
      });
      state.handler = handler;
    } else {
      arr.index = 0;
    }
    arr.ref = element;
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
            if (value || value === 0) {
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
    setState(function (current) {
      if (typeof key === 'string') {
        key = kv(key, isFunction(value) ? value(current[key], current) : value);
      }
      return single(key, function (v, i) {
        return v !== current[i] && extend({}, current, key);
      }) || current;
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
  fallback = fallback || Fragment;
  if (isFunction(fallback)) {
    fallback = /*#__PURE__*/createElement(fallback);
  }
  var Component = /*#__PURE__*/lazy(factory);
  return function (props) {
    return /*#__PURE__*/createElement(Suspense, {
      fallback: fallback
    }, /*#__PURE__*/createElement(Component, props));
  };
}
;// CONCATENATED MODULE: ./src/fields/ChoiceField.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }

function ChoiceField() {}
function normalizeChoiceItems(items) {
  return (items || []).map(function (v) {
    return _typeof(v) === 'object' ? v : {
      label: String(v),
      value: v
    };
  });
}
util_define(ChoiceField, {
  normalizeItems: normalizeChoiceItems
});
definePrototype(ChoiceField, {
  defaultValue: '',
  postHook: function postHook(state, props, hook) {
    var items = hook.memo(function () {
      return normalizeChoiceItems(props.items);
    }, [props.items]);
    var selectedIndex = items.findIndex(function (v) {
      return v.value === state.value;
    });
    hook.effect(function () {
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

var re = /^-?\d{4,}-\d{2}-\d{2}$/;

// method mapping for relative date units
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
      return Date.parse(date + 'T00:00');
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
  postHook: function postHook(state, props, hook) {
    var setValue = state.setValue;
    var value = state.value;
    var min = normalizeDate(props.min);
    var max = normalizeDate(props.max);
    var displayText = hook.memo(function () {
      return value && props.formatDisplay ? props.formatDisplay(toDateObject(value)) : value;
    }, [value]);
    hook.effect(function () {
      var clamped = value && clampValue(value, min, max);
      if (clamped !== value) {
        setValue(clamped);
      }
    }, [value, min, max]);
    return extend(state, {
      min: toDateString(min),
      max: toDateString(max),
      displayText: displayText,
      setValue: hook.callback(function (v) {
        v = isFunction(v) ? v(value) : v;
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
  postHook: function postHook(state, props, hook) {
    var allowCustomValues = props.allowCustomValues || !props.items;
    var items = hook.memo(function () {
      return ChoiceField.normalizeItems(props.items);
    }, [props.items]);
    var isUnknown = function isUnknown(value) {
      return !items.some(function (v) {
        return v.value === value;
      });
    };
    var toggleValue = hook.callback(function (value, selected) {
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
    var value = hook.memo(function () {
      return makeArray(state.value);
    }, [state.version]);
    hook.effect(function () {
      if (!allowCustomValues) {
        var cur = makeArray(value);
        var arr = splice(cur, isUnknown);
        if (arr.length) {
          state.setValue(cur);
        }
      }
    });
    return extend(state, {
      value: value,
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
  postHook: function postHook(state, props, hook) {
    var value = state.value;
    var min = props.min;
    var max = props.max;
    var step = props.step;
    var allowEmpty = props.allowEmpty;
    hook.effect(function () {
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
  normalizeValue: function normalizeValue(value) {
    return isUndefinedOrNull(value) ? '' : String(value);
  },
  postHook: function postHook(state, props) {
    var form = state.form;
    var inputProps = pick(props, ['type', 'disabled', 'autoComplete', 'maxLength', 'inputMode', 'placeholder', 'enterKeyHint', 'readOnly']);
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
  postHook: function postHook(state, props, hook) {
    return extend(state, {
      toggleValue: hook.callback(function () {
        state.setValue(function (v) {
          return !v;
        });
      })
    });
  }
});
;// CONCATENATED MODULE: ./src/form.js









var form_ = createPrivateStore();
var form_emitter = new EventContainer();
var instances = new WeakMap();
var changedProps = new Map();
var rootForm = new FormContext({}, {}, {
  get: noop
});
var fieldTypes = {
  text: TextField,
  toggle: ToggleField,
  choice: ChoiceField
};

/** @type {React.Context<any>} */
var FormObjectContext = /*#__PURE__*/createContext(null);
var FormObjectProvider = FormObjectContext.Provider;
function ValidationError(kind, message, args) {
  this.kind = kind;
  this.args = args;
  this.message = message;
}
function createHookHelper(effects) {
  var states = [];
  var push = function push(callback, deps) {
    var i = effects.i++;
    states[i] = !deps || !states[i] || !equal(states[i][0], deps) ? [deps, callback()] : states[i];
    return states[i][1];
  };
  return {
    memo: push,
    callback: function callback(_callback) {
      var ref = push(Object, []);
      ref.current = _callback;
      return ref.cb || (ref.cb = function () {
        return ref.current.apply(this, arguments);
      });
    },
    effect: function effect(callback, deps) {
      push(function () {
        effects.push(throwNotFunction(callback));
      }, deps);
    }
  };
}
function _isEmpty(value) {
  return isUndefinedOrNull(value) || value === '' || isArray(value) && !value.length;
}
function hasImplicitError(field) {
  return field.props.required && field.isEmpty(field.value);
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
  var path = name ? [name] : [];
  for (var key = keyFor(obj); key = paths[key]; key = key.slice(0, 8)) {
    path.unshift(key.slice(9));
  }
  return resolvePathInfo(form, path)[name ? 'parent' : 'value'] === obj ? path.join('.') : '';
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
      return v.version && (v.props.validateOnChange + 1 || form.validateOnChange + 1) > 1;
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
  var onChange = function onChange(p, field, oldValue) {
    var path = getPath(context, proxy, p);
    if (path) {
      if (field) {
        var value = field.normalizeValue(target[p]);
        if (!sameValueZero(value, target[p])) {
          setValue(p, value);
        }
        if (!sameValueZero(field.value, value)) {
          field.value = value;
          field.version++;
        }
        if (value === oldValue) {
          return;
        }
        handleDataChange.d.add(field);
      }
      // ensure field associated with parent data object got notified
      for (var key = uniqueId; key = state.paths[key]; key = key.slice(0, 8)) {
        if (state.fields[key]) {
          handleDataChange.d.add(state.fields[key]);
        }
      }
      if (context !== rootForm) {
        mapGet(changedProps, context, Object)[path] = true;
        setImmediateOnce(emitDataChangeEvent);
      }
      return true;
    }
  };
  var setValue = function setValue(p, v) {
    if (isPlainObject(v) || isArray(v)) {
      // ensure changes to nested data objects
      // emits data change event to correct form context
      if ((form_(v) || '').state !== state) {
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
      if (typeof p === 'string' && (!sameValueZero(t[p], v) || !(p in t))) {
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
            }
            // apply changes to existing object or array when assigning new object or array
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
          onChange(p, state.fields[uniqueId + '.' + p], prev);
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
    state: state,
    uniqueId: uniqueId,
    set: setValue,
    "delete": deleteValue
  });
  for (var i in initialData) {
    setValue(i, initialData[i]);
  }
  return proxy;
}
function createFieldState(initialValue) {
  var field = {
    version: 0,
    initialValue: initialValue,
    error: '',
    preset: {},
    onChange: function onChange(v) {
      if (!field.controlled) {
        field.version++;
      }
      if (field.props.onChange) {
        field.props.onChange(cloneValue(v));
      }
    },
    setValue: function setValue(v) {
      v = isFunction(v) ? v(field.value) : v;
      if (!field.controlled) {
        field.dict[field.name] = v;
      } else if (!sameValueZero(v, field.value)) {
        field.onChange(v);
      }
    },
    setError: function setError(v) {
      field.error = isFunction(v) ? v(field.error) : v;
      (field.form || {}).isValid = null;
    },
    validate: function validate() {
      return validateFields(field.form, [field]);
    },
    isEmpty: function isEmpty(value) {
      return (field.props.isEmpty || (field.preset.isEmpty || _isEmpty).bind(field.preset))(value);
    },
    normalizeValue: function normalizeValue(value) {
      return (field.preset.normalizeValue || pipe).call(field.preset, value, field.props);
    },
    elementRef: function elementRef(v) {
      field.element = v;
    }
  };
  watch(field, true);
  defineObservableProperty(field, 'error', '', function (v) {
    return isFunction(v) || is(v, ValidationError) ? wrapErrorResult(field, v) : v || '';
  });
  watch(field, 'error', function (v) {
    if (field.form) {
      form_emitter.emit('validationChange', field.form, {
        name: field.path,
        isValid: !v,
        message: String(v)
      });
    }
  });
  defineGetterProperty(field.elementRef, 'current', function () {
    return field.element || null;
  });
  return field;
}
function useFormFieldInternal(state, field, preset, props, controlled, dict, name) {
  var form = state.form === rootForm ? null : state.form;
  var key = name ? keyFor(dict) + '.' + name : state.paths[keyFor(dict)];
  var shouldReset = field.key !== key;
  extend(field, {
    form: form,
    props: props,
    preset: preset,
    controlled: controlled,
    dict: dict,
    key: key,
    name: name,
    path: form ? getPath(form, dict, name) : '',
    error: 'error' in props ? props.error : shouldReset ? '' : field.error,
    locks: shouldReset ? [] : field.locks
  });
  var setValid = form ? state.setValid : noop;
  state.fields[key] = field;
  useEffect(function () {
    state.fields[key] = field;
    return function () {
      if (state.fields[key] === field) {
        delete state.fields[key];
        if (field.props.clearWhenUnmount || !form) {
          setImmediate(function () {
            if (!state.fields[key]) {
              delete dict[name];
            }
          });
        }
        setValid();
      }
    };
  }, [state, field, key]);
  useEffect(function () {
    setValid();
  }, [state, field.error, props.disabled, props.required]);
}
function validateFields(form, fields) {
  var validate = function validate(field) {
    var name = field.path;
    var value = field.value;
    var result = form_emitter.emit('validate', form, {
      name: name,
      value: value
    });
    if (result || !field.props) {
      return result;
    }
    return (field.props.onValidate || noop)(value, name, form) || hasImplicitError(field) && new ValidationError('required', 'Required');
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
    });
    var state = form_(form);
    if (state) {
      state.setValid();
    }
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
  if (isFunction(initialData)) {
    initialData = initialData();
  }
  var self = this;
  var fields = {};
  var state = form_(self, {
    form: self,
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
        return v.error && key & 1 || v.isEmpty(v.value) && key & 2 ? v.element : null;
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
    data = data || state.initialData;
    for (var i in data) {
      dict.set(i, data[i]);
    }
    each(state.fields, function (i, v) {
      var prop = resolvePathInfo(self, v.path);
      if (v.controlled) {
        v.onChange(prop.exists ? prop.value : v.initialValue);
      } else if (prop.exists) {
        v.value = prop.value;
        v.version = 0;
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
    return errorFields[0] ? errorFields.reduce(function (v, a) {
      v[a.path] = String(a.error);
      return v;
    }, {}) : null;
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
    if (!prefix.length) {
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
  var form = useState(function () {
    return new FormContext(initialData, options, viewState);
  })[0];
  var forceUpdate = useUpdateTrigger();
  useObservableProperty(form, 'isValid');
  useUnloadEffect(function () {
    (form_(form).unlock || noop)();
    if (form.autoPersist) {
      formPersist(form);
    }
  });
  useEffect(function () {
    if (mapRemove(changedProps, form)) {
      forceUpdate();
    }
    return form.on({
      dataChange: forceUpdate,
      reset: forceUpdate
    });
  }, [form]);
  return form;
}
function useFormField(type, props, defaultValue, prop) {
  if (typeof type === 'string') {
    type = fieldTypes[type];
  } else if (!isFunction(type)) {
    prop = defaultValue;
    defaultValue = props;
    props = type;
    type = '';
  }
  var uniqueId = useState(randomId)[0];
  var context = useContext(FormObjectContext);
  var effects = useState([])[0];
  var hook = useMemo(function () {
    return type ? [new type(), createHookHelper(effects)] : [{}];
  }, [type]);
  var preset = hook[0];
  prop = prop || preset.valueProperty || 'value';
  var dict = context;
  var name = props.name;
  if (!dict || !name) {
    dict = rootForm.data;
    name = uniqueId;
  }
  var existing = (name in dict);
  var controlled = (prop in props);
  var field = useState(function () {
    return createFieldState(controlled ? props[prop] : defaultValue !== undefined ? defaultValue : preset.defaultValue);
  })[0];
  var previousKey = field.key;
  useFormFieldInternal(form_(dict).state, field, preset, props, controlled, dict, name);
  var value = controlled ? props[prop] : existing ? dict[name] : field.initialValue;
  if (previousKey !== field.key) {
    value = field.normalizeValue(value);
  }
  if (!field.form || !existing && field.isEmpty(value)) {
    form_(dict).set(name, value);
  } else {
    dict[name] = value;
  }
  field.value = dict[name];
  if (!existing) {
    field.version = 0;
  }
  effects.i = 0;
  effects.splice(0);
  useEffect(function () {
    combineFn(effects)();
  });
  useObservableProperty(field, 'error');
  useObservableProperty(field, 'version');
  return (preset.postHook || pipe).call(preset, {
    form: context && form_(context).state.form,
    key: field.form ? field.key : '',
    path: field.path,
    value: field.value,
    error: String(field.error),
    version: field.version,
    setValue: field.setValue,
    setError: field.setError,
    validate: field.validate,
    elementRef: field.elementRef
  }, props, hook[1]);
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
var Form = /*#__PURE__*/forwardRef(function (props, ref) {
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
  return /*#__PURE__*/createElement(FormObjectProvider, {
    value: form.data
  }, /*#__PURE__*/createElement('form', extend(exclude(props, ['context', 'enterKeyHint', 'preventLeave', 'formatError']), {
    ref: combineRef(ref, form.ref),
    onSubmit: onSubmit,
    onReset: onReset
  })));
});
function FormContextProvider(props) {
  return /*#__PURE__*/createElement(FormObjectProvider, {
    value: props.value.data
  }, props.children);
}
function FormArray(props) {
  return FormObject(extend({}, props, {
    defaultValue: []
  }));
}
function FormObject(props) {
  var uniqueId = useState(randomId)[0];
  var name = props.name;
  var dict = useContext(FormObjectContext);
  if (!dict) {
    dict = rootForm.data;
    name = uniqueId;
  }
  var fieldRef = useRef();
  var value = props.value;
  if ((form_(value) || '').state) {
    dict = value;
    name = '';
  } else if (name) {
    value = 'value' in props ? value : isPlainObject(dict[name]) || isArray(dict[name]) || props.defaultValue || {};
    value = form_(dict).set(name, value);
  } else {
    _throws('Value must be a data object or array');
  }
  // field state registered by useFormField has a higher priority
  // create own field state only when needed
  var state = form_(dict).state;
  var field = state.fields[state.paths[keyFor(value)]];
  if (!field || field.controlled === 0) {
    field = fieldRef.current || (fieldRef.current = createFieldState(value));
    useFormFieldInternal(state, field, {}, props, 0, dict, name);
    field.value = value;
  } else {
    useEffect(noop, [null]);
    useEffect(noop, [null]);
  }
  var children = props.children;
  if (isFunction(children)) {
    children = children(value);
  }
  return /*#__PURE__*/createElement(FormObjectProvider, {
    value: value
  }, children);
}
function HiddenField(props) {
  useFormField(props, props.value);
  return null;
}
util_define(FormObject, {
  keyFor: keyFor
});







;// CONCATENATED MODULE: ./src/index.js






;// CONCATENATED MODULE: ./src/entry.js

defineGetterProperty(window, 'zeta-dom-react', function () {
  console.warn('window["zeta-dom-react"] is deprecated, access zeta.react instead.');
  return zeta.react;
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=zeta-dom-react.js.map