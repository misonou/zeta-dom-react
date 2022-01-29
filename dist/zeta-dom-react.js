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
    setTimeoutOnce = _zeta$util.setTimeoutOnce,
    setImmediate = _zeta$util.setImmediate,
    setImmediateOnce = _zeta$util.setImmediateOnce,
    throwNotFunction = _zeta$util.throwNotFunction,
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

;// CONCATENATED MODULE: ./src/hooks.js


var fnWeakMap = new WeakMap();
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
    return {
      loading: true,
      refresh: function refresh() {
        extend(state, {
          loading: true,
          error: undefined
        });
        always(resolve().then(init), function (resolved, value) {
          if (!state.disposed) {
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
            }
          }
        });
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


var _FormContext = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.createContext)(null);

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

function FormContext(initialData, validateOnChange) {
  var self = this;

  var state = _(self, {
    validateCallback: {},
    validateResult: {},
    validateOnChange: {},
    eventContainer: new ZetaEventContainer(),
    initialData: initialData || {}
  });

  self.isValid = true;
  self.validateOnChange = validateOnChange !== false;
  self.data = createDataObject(self, state.eventContainer, initialData);
  self.on('dataChange', function (e) {
    if (self.validateOnChange) {
      self.validate.apply(self, grep(e.data, function (v) {
        return state.validateOnChange[v] !== false;
      }));
    }
  });
}
definePrototype(FormContext, {
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

    var validateResult = state.validateResult;
    var eventContainer = state.eventContainer;
    var props = makeArray(arguments);

    if (!props.length) {
      props = keys(state.validateCallback);
    }

    var prev = extend({}, validateResult);
    var promise = resolveAll(props.map(function (v) {
      return eventContainer.emit('validate', self, {
        name: v,
        value: self.data[v]
      });
    }));
    return promise.then(function (result) {
      props.forEach(function (v, i) {
        validateResult[v] = result[i];

        if ((result[i] || '') !== (prev[v] || '')) {
          eventContainer.emit('validationChange', self, {
            name: v,
            isValid: !!result[i],
            message: result[i] || ''
          });
        }
      });
      self.isValid = !any(values(validateResult), function (v) {
        return v;
      });
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
      props.onChange(typeof v === 'function' ? v(value) : v);
    }
  }); // put internal states on props for un-controlled mode

  prop = prop || 'value';

  if (!(prop in props)) {
    setValueCallback = setValue;
    props = extend({}, props);
    props[prop] = value;
  }

  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    if (form && key) {
      if (key in form.data) {
        setValue(form.data[key]);
      }

      return combineFn(form.on('dataChange', function (e) {
        if (e.data.includes(key)) {
          setValue(form.data[key]);
        }
      }), form.on('validationChange', function (e) {
        if (e.name === key) {
          setError(e.message);
        }
      }), form.on('validate', function (e) {
        if (e.name === key) {
          return onValidate(e.value, e.name);
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
      _(form).validateOnChange[key] = props.validateOnChange;
    }
  }, [form, key, props.validateOnChange]);
  return {
    value: props[prop],
    error: props.error || error || '',
    setValue: setValueCallback,
    setError: setError
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