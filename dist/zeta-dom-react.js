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
  "FormContext": () => (FormContext),
  "FormContextProvider": () => (FormContextProvider),
  "classNames": () => (classNames),
  "combineRef": () => (combineRef),
  "combineValidators": () => (combineValidators),
  "partial": () => (partial),
  "toRefCallback": () => (toRefCallback),
  "useAsync": () => (useAsync),
  "useDispose": () => (useDispose),
  "useFormContext": () => (useFormContext),
  "useFormField": () => (useFormField),
  "useMemoizedFunction": () => (useMemoizedFunction),
  "useObservableProperty": () => (useObservableProperty),
  "useRefInitCallback": () => (useRefInitCallback)
});

// EXTERNAL MODULE: external {"commonjs":"react","commonjs2":"react","amd":"react","root":"React"}
var external_commonjs_react_commonjs2_react_amd_react_root_React_ = __webpack_require__(359);
// EXTERNAL MODULE: external {"commonjs":"zeta-dom","commonjs2":"zeta-dom","amd":"zeta-dom","root":"zeta"}
var external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_ = __webpack_require__(654);
;// CONCATENATED MODULE: ./tmp/zeta-dom/util.js

var _zeta$util = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.util,
    noop = _zeta$util.noop,
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
    pick = _zeta$util.pick,
    exclude = _zeta$util.exclude,
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
    setPromiseTimeout = _zeta$util.setPromiseTimeout;

;// CONCATENATED MODULE: ./src/include/zeta-dom/util.js

;// CONCATENATED MODULE: ./tmp/zeta-dom/events.js

var ZetaEventContainer = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.EventContainer;

;// CONCATENATED MODULE: ./src/include/zeta-dom/events.js

;// CONCATENATED MODULE: ./tmp/zeta-dom/dom.js

var _defaultExport = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom;
/* harmony default export */ const zeta_dom_dom = ((/* unused pure expression or super */ null && (_defaultExport)));
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


/* harmony default export */ const include_zeta_dom_dom = ((/* unused pure expression or super */ null && (dom)));
;// CONCATENATED MODULE: ./tmp/zeta-dom/domLock.js

var domLock_zeta$dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom,
    lock = domLock_zeta$dom.lock,
    locked = domLock_zeta$dom.locked,
    cancelLock = domLock_zeta$dom.cancelLock;

;// CONCATENATED MODULE: ./src/include/zeta-dom/domLock.js

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
  var sValue = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(obj[key]);
  var value = sValue[0],
      setValue = sValue[1];
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    setValue(obj[key]);
    return watch(obj, key, function (v) {
      setValue(function () {
        return v;
      });
    });
  }, [obj, key]);
  return value;
}
function useAsync(init, autoload) {
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
        return container.add(state, 'error', handler);
      },
      refresh: function refresh() {
        var promise;

        var shouldNotify = function shouldNotify() {
          return !state.disposed && state.promise === promise;
        };

        promise = always(resolve().then(init), function (resolved, value) {
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

        if (element) {
          catchAsync(lock(element, promise));
        }
      }
    };
  })[0];
  var deps = isArray(autoload);
  init = useMemoizedFunction(init);
  autoload = autoload !== false;
  useObservableProperty(state, 'loading');
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    return function () {
      state.disposed = true;
    };
  }, [state]);
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    if (autoload) {
      state.refresh();
    }
  }, [state, autoload].concat(deps));
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
;// CONCATENATED MODULE: ./src/form.js






var _ = createPrivateStore();
/** @type {React.Context<import ("./form").FormContext>} */
// @ts-ignore: type inference issue


var _FormContext = /*#__PURE__*/(0,external_commonjs_react_commonjs2_react_amd_react_root_React_.createContext)(null);

var FormContextProvider = _FormContext.Provider;

function createDataObject(context, eventContainer, initialData) {
  return new Proxy(extend({}, initialData), {
    get: function get(t, p) {
      if (typeof p === 'string') {
        return t[p];
      }
    },
    set: function set(t, p, v) {
      if (typeof p === 'string' && t[p] !== v) {
        if (p in t) {
          eventContainer.emitAsync('dataChange', context, [p], {}, function (v, a) {
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

function FormContext(initialData, validateOnChange) {
  var self = this;
  var fields = {};
  var errors = {};
  var eventContainer = new ZetaEventContainer();

  var state = _(self, {
    fields: fields,
    errors: errors,
    eventContainer: eventContainer,
    refs: {},
    initialData: initialData || {},
    setValid: defineObservableProperty(this, 'isValid', true, function () {
      return !any(fields, function (v, i) {
        return !v.disabled && (errors[i] || v.required && (v.isEmpty ? v.isEmpty(self.data[i]) : !self.data[i]));
      });
    })
  });

  self.isValid = true;
  self.validateOnChange = validateOnChange !== false;
  self.data = createDataObject(self, eventContainer, initialData);
  self.on('dataChange', function (e) {
    if (self.validateOnChange) {
      var fieldsToValidate = grep(e.data, function (v) {
        return fields[v].validateOnChange !== false;
      });

      if (fieldsToValidate[0]) {
        self.validate.apply(self, fieldsToValidate);
      }
    }
  });
}
definePrototype(FormContext, {
  element: function element(key) {
    var ref = _(this).refs[key];

    return ref && ref.current;
  },
  focus: function focus(key) {
    var element = this.element(key);

    if (element) {
      dom_focus(element);
    }
  },
  on: function on(event, handler) {
    var state = _(this);

    return state.eventContainer.add(this, event, handler);
  },
  reset: function reset() {
    var self = this;

    var state = _(self);

    for (var i in self.data) {
      delete self.data[i];
    }

    extend(self.data, state.initialData);
    self.isValid = true;
    state.eventContainer.emit('reset', self);
  },
  validate: function validate() {
    var self = this;

    var state = _(self);

    var errors = state.errors;
    var eventContainer = state.eventContainer;
    var props = makeArray(arguments);

    if (!props.length) {
      props = keys(state.fields);
    }

    var prev = extend({}, errors);
    var promise = resolveAll(props.map(function (v) {
      return eventContainer.emit('validate', self, {
        name: v,
        value: self.data[v]
      });
    }));
    return promise.then(function (result) {
      props.forEach(function (v, i) {
        if (isFunction(result[i])) {
          result[i] = wrapErrorResult(state, v, result[i]);
        }

        errors[v] = result[i];

        if ((result[i] || '') !== (prev[v] || '')) {
          eventContainer.emit('validationChange', self, {
            name: v,
            isValid: !result[i],
            message: String(result[i] || '')
          });
        }
      });
      state.setValid();
      return !any(result, function (v) {
        return v;
      });
    });
  }
});
function useFormContext(initialData, validateOnChange) {
  var form = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    return new FormContext(initialData, validateOnChange);
  })[0];
  var forceUpdate = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(0)[1];
  useObservableProperty(form, 'isValid');
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    return form.on('dataChange', function () {
      forceUpdate(function (v) {
        return ++v;
      });
    });
  }, [form]);
  return form;
}
function useFormField(props, defaultValue, prop) {
  var form = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useContext)(_FormContext);
  var ref = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useRef)();
  var key = props.name || '';
  var initialValue = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    return form && form.data[key] || defaultValue;
  })[0];
  var sValue = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(initialValue);
  var sError = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)('');
  var onValidate = useMemoizedFunction(props.onValidate);
  var value = sValue[0],
      setValue = sValue[1];
  var error = sError[0],
      setError = sError[1];
  var setValueCallback = useMemoizedFunction(function (v) {
    if (!props.onChange) {
      console.warn('onChange not supplied');
    } else {
      props.onChange(typeof v === 'function' ? v(props[prop]) : v);
    }
  }); // put internal states on props for un-controlled mode

  prop = prop || 'value';

  if (!(prop in props)) {
    setValueCallback = setValue;
    props = extend({}, props);
    props[prop] = value;
  }

  if (form && key) {
    _(form).fields[key] = props;
  }

  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    if (form && key) {
      var state = _(form);

      state.refs[key] = ref;

      if (key in form.data) {
        setValue(form.data[key]);
      }

      return combineFn(function () {
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
    if (form && key) {
      form.data[key] = value;
    }
  }, [form, key, value]);
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    if (form && key) {
      _(form).setValid();
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
function partial(setState) {
  return function (key, value) {
    setState(function (v) {
      if (typeof key === 'string') {
        key = kv(key, isFunction(value) ? value(v[key], v) : value);
      }

      return extend({}, v, key);
    });
  };
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