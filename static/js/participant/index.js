(function (Vue$1) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Vue__default = /*#__PURE__*/_interopDefaultLegacy(Vue$1);

  var e=function(){return (e=Object.assign||function(e){for(var t,r=1,s=arguments.length;r<s;r++)for(var a in t=arguments[r])Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e}).apply(this,arguments)},t={kebab:/-(\w)/g,styleProp:/:(.*)/,styleList:/;(?![^(]*\))/g};function r(e,t){return t?t.toUpperCase():""}function s(e){for(var s,a={},c=0,o=e.split(t.styleList);c<o.length;c++){var n=o[c].split(t.styleProp),i=n[0],l=n[1];(i=i.trim())&&("string"==typeof l&&(l=l.trim()),a[(s=i,s.replace(t.kebab,r))]=l);}return a}function a(){for(var t,r,a={},c=arguments.length;c--;)for(var o=0,n=Object.keys(arguments[c]);o<n.length;o++)switch(t=n[o]){case"class":case"style":case"directives":if(Array.isArray(a[t])||(a[t]=[]),"style"===t){var i=void 0;i=Array.isArray(arguments[c].style)?arguments[c].style:[arguments[c].style];for(var l=0;l<i.length;l++){var y=i[l];"string"==typeof y&&(i[l]=s(y));}arguments[c].style=i;}a[t]=a[t].concat(arguments[c][t]);break;case"staticClass":if(!arguments[c][t])break;void 0===a[t]&&(a[t]=""),a[t]&&(a[t]+=" "),a[t]+=arguments[c][t].trim();break;case"on":case"nativeOn":a[t]||(a[t]={});for(var p=0,f=Object.keys(arguments[c][t]||{});p<f.length;p++)r=f[p],a[t][r]?a[t][r]=[].concat(a[t][r],arguments[c][t][r]):a[t][r]=arguments[c][t][r];break;case"attrs":case"props":case"domProps":case"scopedSlots":case"staticStyle":case"hook":case"transition":a[t]||(a[t]={}),a[t]=e({},arguments[c][t],a[t]);break;case"slot":case"key":case"ref":case"tag":case"show":case"keepAlive":default:a[t]||(a[t]=arguments[c][t]);}return a}

  var HAS_WINDOW_SUPPORT = typeof window !== 'undefined';
  var HAS_DOCUMENT_SUPPORT = typeof document !== 'undefined';
  var HAS_NAVIGATOR_SUPPORT = typeof navigator !== 'undefined';
  var IS_BROWSER = HAS_WINDOW_SUPPORT && HAS_DOCUMENT_SUPPORT && HAS_NAVIGATOR_SUPPORT;
  var WINDOW = HAS_WINDOW_SUPPORT ? window : {};
  var DOCUMENT = HAS_DOCUMENT_SUPPORT ? document : {};
  var NAVIGATOR = HAS_NAVIGATOR_SUPPORT ? navigator : {};
  var USER_AGENT = (NAVIGATOR.userAgent || '').toLowerCase();
  USER_AGENT.indexOf('jsdom') > 0;
  /msie|trident/.test(USER_AGENT); // Determine if the browser supports the option passive for events

  (function () {
    var passiveEventSupported = false;

    if (IS_BROWSER) {
      try {
        var options = {
          // This function will be called when the browser
          // attempts to access the passive property
          get passive() {
            /* istanbul ignore next: will never be called in JSDOM */
            passiveEventSupported = true;
          }

        };
        WINDOW.addEventListener('test', options, options);
        WINDOW.removeEventListener('test', options, options);
      } catch (_unused) {
        /* istanbul ignore next: will never be called in JSDOM */
        passiveEventSupported = false;
      }
    }

    return passiveEventSupported;
  })();
  IS_BROWSER && ('ontouchstart' in DOCUMENT.documentElement || NAVIGATOR.maxTouchPoints > 0);
  IS_BROWSER && Boolean(WINDOW.PointerEvent || WINDOW.MSPointerEvent);
  /* istanbul ignore next: JSDOM only checks for 'IntersectionObserver' */

  IS_BROWSER && 'IntersectionObserver' in WINDOW && 'IntersectionObserverEntry' in WINDOW && // Edge 15 and UC Browser lack support for `isIntersecting`
  // but we an use `intersectionRatio > 0` instead
  // 'isIntersecting' in window.IntersectionObserverEntry.prototype &&
  'intersectionRatio' in WINDOW.IntersectionObserverEntry.prototype;

  var PROP_NAME = '$bvConfig';
  var DEFAULT_BREAKPOINT = ['xs', 'sm', 'md', 'lg', 'xl'];

  // --- General ---
  var RX_BV_PREFIX = /^(BV?)/;
  var RX_HYPHENATE = /\B([A-Z])/g;
  var RX_ENCODED_COMMA = /%2C/g;
  var RX_ENCODE_REVERSE = /[!'()*]/g;

  function _typeof$1(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }

  function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof$1(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

  function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
  /* istanbul ignore next */

  var Element = HAS_WINDOW_SUPPORT ? WINDOW.Element : /*#__PURE__*/function (_Object) {
    _inherits(Element, _Object);

    var _super = _createSuper(Element);

    function Element() {
      _classCallCheck$1(this, Element);

      return _super.apply(this, arguments);
    }

    return Element;
  }( /*#__PURE__*/_wrapNativeSuper(Object));
  /* istanbul ignore next */

  HAS_WINDOW_SUPPORT ? WINDOW.HTMLElement : /*#__PURE__*/function (_Element) {
    _inherits(HTMLElement, _Element);

    var _super2 = _createSuper(HTMLElement);

    function HTMLElement() {
      _classCallCheck$1(this, HTMLElement);

      return _super2.apply(this, arguments);
    }

    return HTMLElement;
  }(Element);
  /* istanbul ignore next */

  HAS_WINDOW_SUPPORT ? WINDOW.SVGElement : /*#__PURE__*/function (_Element2) {
    _inherits(SVGElement, _Element2);

    var _super3 = _createSuper(SVGElement);

    function SVGElement() {
      _classCallCheck$1(this, SVGElement);

      return _super3.apply(this, arguments);
    }

    return SVGElement;
  }(Element);
  /* istanbul ignore next */

  HAS_WINDOW_SUPPORT ? WINDOW.File : /*#__PURE__*/function (_Object2) {
    _inherits(File, _Object2);

    var _super4 = _createSuper(File);

    function File() {
      _classCallCheck$1(this, File);

      return _super4.apply(this, arguments);
    }

    return File;
  }( /*#__PURE__*/_wrapNativeSuper(Object));

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var toType = function toType(value) {
    return _typeof(value);
  };
  var isUndefined = function isUndefined(value) {
    return value === undefined;
  };
  var isNull = function isNull(value) {
    return value === null;
  };
  var isUndefinedOrNull = function isUndefinedOrNull(value) {
    return isUndefined(value) || isNull(value);
  };
  var isFunction = function isFunction(value) {
    return toType(value) === 'function';
  };
  var isBoolean = function isBoolean(value) {
    return toType(value) === 'boolean';
  };
  var isString = function isString(value) {
    return toType(value) === 'string';
  };
  var isArray = function isArray(value) {
    return Array.isArray(value);
  }; // Quick object check
  // This is primarily used to tell Objects from primitive values
  // when we know the value is a JSON-compliant type
  // Note object could be a complex type like array, Date, etc.

  var isObject = function isObject(obj) {
    return obj !== null && _typeof(obj) === 'object';
  }; // Strict object type check
  // Only returns true for plain JavaScript objects

  var isPlainObject = function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  };
  var isDate = function isDate(value) {
    return value instanceof Date;
  };
  var isEvent = function isEvent(value) {
    return value instanceof Event;
  };

  function ownKeys$a(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$a(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$a(Object(source), true).forEach(function (key) { _defineProperty$c(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$a(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty$c(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var assign = function assign() {
    return Object.assign.apply(Object, arguments);
  };
  var create = function create(proto, optionalProps) {
    return Object.create(proto, optionalProps);
  };
  var defineProperties = function defineProperties(obj, props) {
    return Object.defineProperties(obj, props);
  };
  var defineProperty = function defineProperty(obj, prop, descriptor) {
    return Object.defineProperty(obj, prop, descriptor);
  };
  var keys = function keys(obj) {
    return Object.keys(obj);
  }; // --- "Instance" ---

  var hasOwnProperty = function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
  // Shallow copy an object

  var clone = function clone(obj) {
    return _objectSpread$a({}, obj);
  }; // Return a shallow copy of object with the specified properties only
  // See: https://gist.github.com/bisubus/2da8af7e801ffd813fab7ac221aa7afc

  var pick = function pick(obj, props) {
    return keys(obj).filter(function (key) {
      return props.indexOf(key) !== -1;
    }).reduce(function (result, key) {
      return _objectSpread$a(_objectSpread$a({}, result), {}, _defineProperty$c({}, key, obj[key]));
    }, {});
  }; // Return a shallow copy of object with the specified properties omitted

  var sortKeys = function sortKeys(obj) {
    return keys(obj).sort().reduce(function (result, key) {
      return _objectSpread$a(_objectSpread$a({}, result), {}, _defineProperty$c({}, key, obj[key]));
    }, {});
  }; // Convenience method to create a read-only descriptor

  var readonlyDescriptor = function readonlyDescriptor() {
    return {
      enumerable: true,
      configurable: false,
      writable: false
    };
  };

  function ownKeys$9(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$9(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$9(Object(source), true).forEach(function (key) { _defineProperty$b(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$9(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty$b(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _toConsumableArray$1(arr) { return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread$1(); }

  function _nonIterableSpread$1() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

  function _iterableToArray$1(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithoutHoles$1(arr) { if (Array.isArray(arr)) return _arrayLikeToArray$1(arr); }

  function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  var cloneDeep = function cloneDeep(obj) {
    var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : obj;

    if (isArray(obj)) {
      return obj.reduce(function (result, val) {
        return [].concat(_toConsumableArray$1(result), [cloneDeep(val, val)]);
      }, []);
    }

    if (isPlainObject(obj)) {
      return keys(obj).reduce(function (result, key) {
        return _objectSpread$9(_objectSpread$9({}, result), {}, _defineProperty$b({}, key, cloneDeep(obj[key], obj[key])));
      }, {});
    }

    return defaultValue;
  };

  var identity = function identity(x) {
    return x;
  };

  /**
   * Utilities to get information about the current environment
   */
  var getEnv = function getEnv(key) {
    var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var env = typeof process !== 'undefined' && process ? process.env || {} : {};

    if (!key) {
      /* istanbul ignore next */
      return env;
    }

    return env[key] || fallback;
  };
  var getNoWarn = function getNoWarn() {
    return getEnv('BOOTSTRAP_VUE_NO_WARN') || getEnv('NODE_ENV') === 'production';
  };

  /**
   * Log a warning message to the console with BootstrapVue formatting
   * @param {string} message
   */

  var warn = function warn(message)
  /* istanbul ignore next */
  {
    var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (!getNoWarn()) {
      console.warn("[BootstrapVue warn]: ".concat(source ? "".concat(source, " - ") : '').concat(message));
    }
  };

  // Component names
  var NAME_CARD = 'BCard';
  var NAME_CARD_BODY = 'BCardBody';
  var NAME_CARD_FOOTER = 'BCardFooter';
  var NAME_CARD_GROUP = 'BCardGroup';
  var NAME_CARD_HEADER = 'BCardHeader';
  var NAME_CARD_IMG = 'BCardImg';
  var NAME_CARD_SUB_TITLE = 'BCardSubTitle';
  var NAME_CARD_TITLE = 'BCardTitle';
  var NAME_IMG = 'BImg';
  var NAME_LINK = 'BLink';
  var NAME_PAGINATION = 'BPagination';

  var EVENT_NAME_CHANGE = 'change';
  var EVENT_NAME_CLICK = 'click';
  var EVENT_NAME_INPUT = 'input';
  var EVENT_NAME_PAGE_CLICK = 'page-click';
  var HOOK_EVENT_NAME_BEFORE_DESTROY = 'hook:beforeDestroy';
  var ROOT_EVENT_NAME_PREFIX = 'bv';
  var ROOT_EVENT_NAME_SEPARATOR = '::';

  // General types
  var PROP_TYPE_ANY = undefined;
  var PROP_TYPE_ARRAY = Array;
  var PROP_TYPE_BOOLEAN = Boolean;
  var PROP_TYPE_FUNCTION = Function;
  var PROP_TYPE_NUMBER = Number;
  var PROP_TYPE_OBJECT = Object;
  var PROP_TYPE_STRING = String; // Multiple types
  var PROP_TYPE_ARRAY_OBJECT_STRING = [PROP_TYPE_ARRAY, PROP_TYPE_OBJECT, PROP_TYPE_STRING];
  var PROP_TYPE_ARRAY_STRING = [PROP_TYPE_ARRAY, PROP_TYPE_STRING];
  var PROP_TYPE_BOOLEAN_NUMBER_STRING = [PROP_TYPE_BOOLEAN, PROP_TYPE_NUMBER, PROP_TYPE_STRING];
  var PROP_TYPE_BOOLEAN_STRING = [PROP_TYPE_BOOLEAN, PROP_TYPE_STRING];
  var PROP_TYPE_FUNCTION_STRING = [PROP_TYPE_FUNCTION, PROP_TYPE_STRING];
  var PROP_TYPE_NUMBER_STRING = [PROP_TYPE_NUMBER, PROP_TYPE_STRING];
  var PROP_TYPE_OBJECT_STRING = [PROP_TYPE_OBJECT, PROP_TYPE_STRING];

  var SLOT_NAME_DEFAULT = 'default';
  var SLOT_NAME_ELLIPSIS_TEXT = 'ellipsis-text';
  var SLOT_NAME_FIRST_TEXT = 'first-text';
  var SLOT_NAME_FOOTER = 'footer';
  var SLOT_NAME_HEADER = 'header';
  var SLOT_NAME_LAST_TEXT = 'last-text';
  var SLOT_NAME_NEXT_TEXT = 'next-text';
  var SLOT_NAME_PAGE = 'page';
  var SLOT_NAME_PREV_TEXT = 'prev-text';

  var from = function from() {
    return Array.from.apply(Array, arguments);
  }; // --- Instance ---
  var concat = function concat() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return Array.prototype.concat.apply([], args);
  }; // --- Utilities ---

  var createArray = function createArray(length, fillFn) {
    var mapFn = isFunction(fillFn) ? fillFn : function () {
      return fillFn;
    };
    return Array.apply(null, {
      length: length
    }).map(mapFn);
  };

  // Number utilities
  // Converts a value (string, number, etc.) to an integer number
  // Assumes radix base 10
  var toInteger = function toInteger(value) {
    var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : NaN;
    var integer = parseInt(value, 10);
    return isNaN(integer) ? defaultValue : integer;
  }; // Converts a value (string, number, etc.) to a number

  // String utilities
  // Converts PascalCase or camelCase to kebab-case

  var kebabCase = function kebabCase(str) {
    return str.replace(RX_HYPHENATE, '-$1').toLowerCase();
  }; // Converts a kebab-case or camelCase string to PascalCase

  var lowerFirst = function lowerFirst(str) {
    str = isString(str) ? str.trim() : String(str);
    return str.charAt(0).toLowerCase() + str.slice(1);
  }; // Uppercases the first letter of a string and returns a new string

  var upperFirst = function upperFirst(str) {
    str = isString(str) ? str.trim() : String(str);
    return str.charAt(0).toUpperCase() + str.slice(1);
  }; // Escape characters to be used in building a regular expression
  // `undefined`/`null` will be converted to `''`
  // Plain objects and arrays will be JSON stringified

  var toString = function toString(val) {
    var spaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    return isUndefinedOrNull(val) ? '' : isArray(val) || isPlainObject(val) && val.toString === Object.prototype.toString ? JSON.stringify(val, null, spaces) : String(val);
  }; // Remove leading white space from a string

  var ELEMENT_PROTO = Element.prototype;
  // See: https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill

  /* istanbul ignore next */

  var matchesEl = ELEMENT_PROTO.matches || ELEMENT_PROTO.msMatchesSelector || ELEMENT_PROTO.webkitMatchesSelector; // See: https://developer.mozilla.org/en-US/docs/Web/API/Element/closest

  /* istanbul ignore next */

  ELEMENT_PROTO.closest || function (sel) {
    var el = this;

    do {
      // Use our "patched" matches function
      if (matches(el, sel)) {
        return el;
      }

      el = el.parentElement || el.parentNode;
    } while (!isNull(el) && el.nodeType === Node.ELEMENT_NODE);

    return null;
  }; // `requestAnimationFrame()` convenience method

  /* istanbul ignore next: JSDOM always returns the first option */

  WINDOW.requestAnimationFrame || WINDOW.webkitRequestAnimationFrame || WINDOW.mozRequestAnimationFrame || WINDOW.msRequestAnimationFrame || WINDOW.oRequestAnimationFrame || // Fallback, but not a true polyfill
  // Only needed for Opera Mini

  /* istanbul ignore next */
  function (cb) {
    return setTimeout(cb, 16);
  };
  WINDOW.MutationObserver || WINDOW.WebKitMutationObserver || WINDOW.MozMutationObserver || null; // --- Utils ---

  var isElement = function isElement(el) {
    return !!(el && el.nodeType === Node.ELEMENT_NODE);
  }; // Get the currently active HTML element

  var getActiveElement = function getActiveElement() {
    var excludes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var activeElement = DOCUMENT.activeElement;
    return activeElement && !excludes.some(function (el) {
      return el === activeElement;
    }) ? activeElement : null;
  }; // Returns `true` if a tag's name equals `name`

  var isTag = function isTag(tag, name) {
    return toString(tag).toLowerCase() === toString(name).toLowerCase();
  }; // Determine if an HTML element is the currently active element

  var isActiveElement = function isActiveElement(el) {
    return isElement(el) && el === getActiveElement();
  }; // Determine if an HTML element is visible - Faster than CSS check

  var isVisible = function isVisible(el) {
    if (!isElement(el) || !el.parentNode || !contains(DOCUMENT.body, el)) {
      // Note this can fail for shadow dom elements since they
      // are not a direct descendant of document.body
      return false;
    }

    if (getStyle(el, 'display') === 'none') {
      // We do this check to help with vue-test-utils when using v-show

      /* istanbul ignore next */
      return false;
    } // All browsers support getBoundingClientRect(), except JSDOM as it returns all 0's for values :(
    // So any tests that need isVisible will fail in JSDOM
    // Except when we override the getBCR prototype in some tests


    var bcr = getBCR(el);
    return !!(bcr && bcr.height > 0 && bcr.width > 0);
  }; // Determine if an element is disabled

  var isDisabled = function isDisabled(el) {
    return !isElement(el) || el.disabled || hasAttr(el, 'disabled') || hasClass(el, 'disabled');
  }; // Cause/wait-for an element to reflow its content (adjusting its height/width)

  var selectAll = function selectAll(selector, root) {
    return from((isElement(root) ? root : DOCUMENT).querySelectorAll(selector));
  }; // Select a single element, returns `null` if not found

  var matches = function matches(el, selector) {
    return isElement(el) ? matchesEl.call(el, selector) : false;
  }; // Finds closest element matching selector. Returns `null` if not found

  var contains = function contains(parent, child) {
    return parent && isFunction(parent.contains) ? parent.contains(child) : false;
  }; // Get an element given an ID

  var hasClass = function hasClass(el, className) {
    // We are checking for `el.classList` existence here since IE 11
    // returns `undefined` for some elements (e.g. SVG elements)
    // See https://github.com/bootstrap-vue/bootstrap-vue/issues/2713
    if (className && isElement(el) && el.classList) {
      return el.classList.contains(className);
    }

    return false;
  }; // Set an attribute on an element
  // Returns `null` if not found

  var getAttr = function getAttr(el, attr) {
    return attr && isElement(el) ? el.getAttribute(attr) : null;
  }; // Determine if an attribute exists on an element
  // Returns `true` or `false`, or `null` if element not found

  var hasAttr = function hasAttr(el, attr) {
    return attr && isElement(el) ? el.hasAttribute(attr) : null;
  }; // Set an style property on an element
  // Returns `null` if not found

  var getStyle = function getStyle(el, prop) {
    return prop && isElement(el) ? el.style[prop] || null : null;
  }; // Return the Bounding Client Rect of an element
  // Returns `null` if not an element

  /* istanbul ignore next: getBoundingClientRect() doesn't work in JSDOM */

  var getBCR = function getBCR(el) {
    return isElement(el) ? el.getBoundingClientRect() : null;
  }; // Get computed style object for an element

  var attemptFocus = function attemptFocus(el) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    try {
      el.focus(options);
    } catch (_unused) {}

    return isActiveElement(el);
  }; // Attempt to blur an element, and return `true` if successful

  var attemptBlur = function attemptBlur(el) {
    try {
      el.blur();
    } catch (_unused2) {}

    return !isActiveElement(el);
  };

  var memoize = function memoize(fn) {
    var cache = create(null);
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var argsKey = JSON.stringify(args);
      return cache[argsKey] = cache[argsKey] || fn.apply(null, args);
    };
  };

  var VueProto = Vue__default["default"].prototype; // --- Getter methods ---

  var getConfigValue = function getConfigValue(key) {
    var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    var bvConfig = VueProto[PROP_NAME];
    return bvConfig ? bvConfig.getConfigValue(key, defaultValue) : cloneDeep(defaultValue);
  }; // Method to grab a config value for a particular component

  var getComponentConfig = function getComponentConfig(key) {
    var propKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
    // Return the particular config value for key if specified,
    // otherwise we return the full config (or an empty object if not found)
    return propKey ? getConfigValue("".concat(key, ".").concat(propKey), defaultValue) : getConfigValue(key, {});
  }; // Get all breakpoint names

  var getBreakpoints = function getBreakpoints() {
    return getConfigValue('breakpoints', DEFAULT_BREAKPOINT);
  }; // Private method for caching breakpoint names

  var _getBreakpointsCached = memoize(function () {
    return getBreakpoints();
  }); // Get all breakpoint names (cached)


  var getBreakpointsCached = function getBreakpointsCached() {
    return cloneDeep(_getBreakpointsCached());
  }; // Get breakpoints with the smallest breakpoint set as ''
  // Useful for components that create breakpoint specific props

  memoize(function () {
    var breakpoints = getBreakpointsCached();
    breakpoints[0] = '';
    return breakpoints;
  }); // Get breakpoints with the largest breakpoint set as ''

  function ownKeys$8(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$8(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$8(Object(source), true).forEach(function (key) { _defineProperty$a(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$8(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty$a(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var prefixPropName = function prefixPropName(prefix, value) {
    return prefix + upperFirst(value);
  }; // Remove a prefix from a property

  var unprefixPropName = function unprefixPropName(prefix, value) {
    return lowerFirst(value.replace(prefix, ''));
  }; // Suffix can be a falsey value so nothing is appended to string

  var makeProp = function makeProp() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : PROP_TYPE_ANY;
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    var requiredOrValidator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
    var validator = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
    var required = requiredOrValidator === true;
    validator = required ? validator : requiredOrValidator;
    return _objectSpread$8(_objectSpread$8(_objectSpread$8({}, type ? {
      type: type
    } : {}), required ? {
      required: required
    } : isUndefined(value) ? {} : {
      default: isObject(value) ? function () {
        return value;
      } : value
    }), isUndefined(validator) ? {} : {
      validator: validator
    });
  }; // Copies props from one array/object to a new array/object
  // Prop values are also cloned as new references to prevent possible
  // mutation of original prop object values
  // Optionally accepts a function to transform the prop name

  var copyProps = function copyProps(props) {
    var transformFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : identity;

    if (isArray(props)) {
      return props.map(transformFn);
    }

    var copied = {};

    for (var prop in props) {
      /* istanbul ignore else */
      if (hasOwnProperty(props, prop)) {
        // If the prop value is an object, do a shallow clone
        // to prevent potential mutations to the original object
        copied[transformFn(prop)] = isObject(props[prop]) ? clone(props[prop]) : props[prop];
      }
    }

    return copied;
  }; // Given an array of properties or an object of property keys,
  // plucks all the values off the target object, returning a new object
  // that has props that reference the original prop values

  var pluckProps = function pluckProps(keysToPluck, objToPluck) {
    var transformFn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : identity;
    return (isArray(keysToPluck) ? keysToPluck.slice() : keys(keysToPluck)).reduce(function (memo, prop) {
      memo[transformFn(prop)] = objToPluck[prop];
      return memo;
    }, {});
  }; // Make a prop object configurable by global configuration
  // Replaces the current `default` key of each prop with a `getComponentConfig()`
  // call that falls back to the current default value of the prop

  var makePropConfigurable = function makePropConfigurable(prop, key, componentKey) {
    return _objectSpread$8(_objectSpread$8({}, cloneDeep(prop)), {}, {
      default: function bvConfigurablePropDefault() {
        var value = getComponentConfig(componentKey, key, prop.default);
        return isFunction(value) ? value() : value;
      }
    });
  }; // Make a props object configurable by global configuration
  // Replaces the current `default` key of each prop with a `getComponentConfig()`
  // call that falls back to the current default value of the prop

  var makePropsConfigurable = function makePropsConfigurable(props, componentKey) {
    return keys(props).reduce(function (result, key) {
      return _objectSpread$8(_objectSpread$8({}, result), {}, _defineProperty$a({}, key, makePropConfigurable(props[key], key, componentKey)));
    }, {});
  }; // Get function name we use in `makePropConfigurable()`
  // for the prop default value override to compare
  // against in `hasPropFunction()`

  var configurablePropDefaultFnName = makePropConfigurable({}, '', '').default.name; // Detect wether the given value is currently a function
  // and isn't the props default function

  var hasPropFunction = function hasPropFunction(fn) {
    return isFunction(fn) && fn.name !== configurablePropDefaultFnName;
  };

  function _defineProperty$9(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  var makeModelMixin = function makeModelMixin(prop) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$type = _ref.type,
        type = _ref$type === void 0 ? PROP_TYPE_ANY : _ref$type,
        _ref$defaultValue = _ref.defaultValue,
        defaultValue = _ref$defaultValue === void 0 ? undefined : _ref$defaultValue,
        _ref$validator = _ref.validator,
        validator = _ref$validator === void 0 ? undefined : _ref$validator,
        _ref$event = _ref.event,
        event = _ref$event === void 0 ? EVENT_NAME_INPUT : _ref$event;

    var props = _defineProperty$9({}, prop, makeProp(type, defaultValue, validator)); // @vue/component


    var mixin = Vue__default["default"].extend({
      model: {
        prop: prop,
        event: event
      },
      props: props
    });
    return {
      mixin: mixin,
      props: props,
      prop: prop,
      event: event
    };
  };

  // In functional components, `slots` is a function so it must be called
  // first before passing to the below methods. `scopedSlots` is always an
  // object and may be undefined (for Vue < 2.6.x)

  /**
   * Returns true if either scoped or unscoped named slot exists
   *
   * @param {String, Array} name or name[]
   * @param {Object} scopedSlots
   * @param {Object} slots
   * @returns {Array|undefined} VNodes
   */

  var hasNormalizedSlot = function hasNormalizedSlot(names) {
    var $scopedSlots = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var $slots = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    // Ensure names is an array
    names = concat(names).filter(identity); // Returns true if the either a $scopedSlot or $slot exists with the specified name

    return names.some(function (name) {
      return $scopedSlots[name] || $slots[name];
    });
  };
  /**
   * Returns VNodes for named slot either scoped or unscoped
   *
   * @param {String, Array} name or name[]
   * @param {String} scope
   * @param {Object} scopedSlots
   * @param {Object} slots
   * @returns {Array|undefined} VNodes
   */

  var normalizeSlot = function normalizeSlot(names) {
    var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var $scopedSlots = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var $slots = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    // Ensure names is an array
    names = concat(names).filter(identity);
    var slot;

    for (var i = 0; i < names.length && !slot; i++) {
      var name = names[i];
      slot = $scopedSlots[name] || $slots[name];
    } // Note: in Vue 2.6.x, all named slots are also scoped slots


    return isFunction(slot) ? slot(scope) : slot;
  };

  var normalizeSlotMixin = Vue__default["default"].extend({
    methods: {
      // Returns `true` if the either a `$scopedSlot` or `$slot` exists with the specified name
      // `name` can be a string name or an array of names
      hasNormalizedSlot: function hasNormalizedSlot$1() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : SLOT_NAME_DEFAULT;
        var scopedSlots = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.$scopedSlots;
        var slots = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.$slots;
        return hasNormalizedSlot(name, scopedSlots, slots);
      },
      // Returns an array of rendered VNodes if slot found, otherwise `undefined`
      // `name` can be a string name or an array of names
      normalizeSlot: function normalizeSlot$1() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : SLOT_NAME_DEFAULT;
        var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var scopedSlots = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.$scopedSlots;
        var slots = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.$slots;

        var vNodes = normalizeSlot(name, scope, scopedSlots, slots);

        return vNodes ? concat(vNodes) : vNodes;
      }
    }
  });

  var stopEvent = function stopEvent(event) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$preventDefault = _ref.preventDefault,
        preventDefault = _ref$preventDefault === void 0 ? true : _ref$preventDefault,
        _ref$propagation = _ref.propagation,
        propagation = _ref$propagation === void 0 ? true : _ref$propagation,
        _ref$immediatePropaga = _ref.immediatePropagation,
        immediatePropagation = _ref$immediatePropaga === void 0 ? false : _ref$immediatePropaga;

    if (preventDefault) {
      event.preventDefault();
    }

    if (propagation) {
      event.stopPropagation();
    }

    if (immediatePropagation) {
      event.stopImmediatePropagation();
    }
  }; // Helper method to convert a component/directive name to a base event name
  // `getBaseEventName('BNavigationItem')` => 'navigation-item'
  // `getBaseEventName('BVToggle')` => 'toggle'

  var getBaseEventName = function getBaseEventName(value) {
    return kebabCase(value.replace(RX_BV_PREFIX, ''));
  }; // Get a root event name by component/directive and event name
  // `getBaseEventName('BModal', 'show')` => 'bv::modal::show'


  var getRootEventName = function getRootEventName(name, eventName) {
    return [ROOT_EVENT_NAME_PREFIX, getBaseEventName(name), eventName].join(ROOT_EVENT_NAME_SEPARATOR);
  }; // Get a root action event name by component/directive and action name

  // Math utilty functions
  var mathMin = Math.min;
  var mathMax = Math.max;
  var mathCeil = Math.ceil;
  var mathFloor = Math.floor;

  var ANCHOR_TAG = 'a'; // Method to replace reserved chars

  var encodeReserveReplacer = function encodeReserveReplacer(c) {
    return '%' + c.charCodeAt(0).toString(16);
  }; // Fixed encodeURIComponent which is more conformant to RFC3986:
  // - escapes [!'()*]
  // - preserve commas


  var encode = function encode(str) {
    return encodeURIComponent(toString(str)).replace(RX_ENCODE_REVERSE, encodeReserveReplacer).replace(RX_ENCODED_COMMA, ',');
  };
  // See: https://github.com/vuejs/vue-router/blob/dev/src/util/query.js

  var stringifyQueryObj = function stringifyQueryObj(obj) {
    if (!isPlainObject(obj)) {
      return '';
    }

    var query = keys(obj).map(function (key) {
      var value = obj[key];

      if (isUndefined(value)) {
        return '';
      } else if (isNull(value)) {
        return encode(key);
      } else if (isArray(value)) {
        return value.reduce(function (results, value2) {
          if (isNull(value2)) {
            results.push(encode(key));
          } else if (!isUndefined(value2)) {
            // Faster than string interpolation
            results.push(encode(key) + '=' + encode(value2));
          }

          return results;
        }, []).join('&');
      } // Faster than string interpolation


      return encode(key) + '=' + encode(value);
    })
    /* must check for length, as we only want to filter empty strings, not things that look falsey! */
    .filter(function (x) {
      return x.length > 0;
    }).join('&');
    return query ? "?".concat(query) : '';
  };
  var isRouterLink = function isRouterLink(tag) {
    return !!(tag && !isTag(tag, 'a'));
  };
  var computeTag = function computeTag(_ref, thisOrParent) {
    var to = _ref.to,
        disabled = _ref.disabled,
        routerComponentName = _ref.routerComponentName;
    var hasRouter = !!thisOrParent.$router;

    if (!hasRouter || hasRouter && (disabled || !to)) {
      return ANCHOR_TAG;
    } // TODO:
    //   Check registered components for existence of user supplied router link component name
    //   We would need to check PascalCase, kebab-case, and camelCase versions of name:
    //   const name = routerComponentName
    //   const names = [name, PascalCase(name), KebabCase(name), CamelCase(name)]
    //   exists = names.some(name => !!thisOrParent.$options.components[name])
    //   And may want to cache the result for performance or we just let the render fail
    //   if the component is not registered


    return routerComponentName || (thisOrParent.$nuxt ? 'nuxt-link' : 'router-link');
  };
  var computeRel = function computeRel() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        target = _ref2.target,
        rel = _ref2.rel;

    return target === '_blank' && isNull(rel) ? 'noopener' : rel || null;
  };
  var computeHref = function computeHref() {
    var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        href = _ref3.href,
        to = _ref3.to;

    var tag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ANCHOR_TAG;
    var fallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '#';
    var toFallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '/';

    // Return `href` when explicitly provided
    if (href) {
      return href;
    } // We've checked for `$router` in `computeTag()`, so `isRouterLink()` indicates a live router
    // When deferring to Vue Router's `<router-link>`, don't use the `href` attribute at all
    // We return `null`, and then remove `href` from the attributes passed to `<router-link>`


    if (isRouterLink(tag)) {
      return null;
    } // Fallback to `to` prop (if `to` is a string)


    if (isString(to)) {
      return to || toFallback;
    } // Fallback to `to.path' + `to.query` + `to.hash` prop (if `to` is an object)


    if (isPlainObject(to) && (to.path || to.query || to.hash)) {
      var path = toString(to.path);
      var query = stringifyQueryObj(to.query);
      var hash = toString(to.hash);
      hash = !hash || hash.charAt(0) === '#' ? hash : "#".concat(hash);
      return "".concat(path).concat(query).concat(hash) || toFallback;
    } // If nothing is provided return the fallback


    return fallback;
  };

  var CODE_DOWN = 40;
  var CODE_LEFT = 37;
  var CODE_RIGHT = 39;
  var CODE_SPACE = 32;
  var CODE_UP = 38;

  // Handles when arrays are "sparse" (array.every(...) doesn't handle sparse)

  var compareArrays = function compareArrays(a, b) {
    if (a.length !== b.length) {
      return false;
    }

    var equal = true;

    for (var i = 0; equal && i < a.length; i++) {
      equal = looseEqual(a[i], b[i]);
    }

    return equal;
  };
  /**
   * Check if two values are loosely equal - that is,
   * if they are plain objects, do they have the same shape?
   * Returns boolean true or false
   */


  var looseEqual = function looseEqual(a, b) {
    if (a === b) {
      return true;
    }

    var aValidType = isDate(a);
    var bValidType = isDate(b);

    if (aValidType || bValidType) {
      return aValidType && bValidType ? a.getTime() === b.getTime() : false;
    }

    aValidType = isArray(a);
    bValidType = isArray(b);

    if (aValidType || bValidType) {
      return aValidType && bValidType ? compareArrays(a, b) : false;
    }

    aValidType = isObject(a);
    bValidType = isObject(b);

    if (aValidType || bValidType) {
      /* istanbul ignore if: this if will probably never be called */
      if (!aValidType || !bValidType) {
        return false;
      }

      var aKeysCount = keys(a).length;
      var bKeysCount = keys(b).length;

      if (aKeysCount !== bKeysCount) {
        return false;
      }

      for (var key in a) {
        var aHasKey = hasOwnProperty(a, key);
        var bHasKey = hasOwnProperty(b, key);

        if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
          return false;
        }
      }
    }

    return String(a) === String(b);
  };

  function _defineProperty$8(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var isEmpty = function isEmpty(value) {
    return !value || keys(value).length === 0;
  };

  var makePropWatcher = function makePropWatcher(propName) {
    return {
      handler: function handler(newValue, oldValue) {
        if (looseEqual(newValue, oldValue)) {
          return;
        }

        if (isEmpty(newValue) || isEmpty(oldValue)) {
          this[propName] = cloneDeep(newValue);
          return;
        }

        for (var key in oldValue) {
          if (!hasOwnProperty(newValue, key)) {
            this.$delete(this.$data[propName], key);
          }
        }

        for (var _key in newValue) {
          this.$set(this.$data[propName], _key, newValue[_key]);
        }
      }
    };
  };
  var makePropCacheMixin = function makePropCacheMixin(propName, proxyPropName) {
    return Vue__default["default"].extend({
      data: function data() {
        return _defineProperty$8({}, proxyPropName, cloneDeep(this[propName]));
      },
      watch: _defineProperty$8({}, propName, makePropWatcher(proxyPropName))
    });
  };

  var attrsMixin = makePropCacheMixin('$attrs', 'bvAttrs');

  var listenOnRootMixin = Vue__default["default"].extend({
    methods: {
      /**
       * Safely register event listeners on the root Vue node
       * While Vue automatically removes listeners for individual components,
       * when a component registers a listener on root and is destroyed,
       * this orphans a callback because the node is gone,
       * but the root does not clear the callback
       *
       * When registering a `$root` listener, it also registers a listener on
       * the component's `beforeDestroy()` hook to automatically remove the
       * event listener from the `$root` instance
       *
       * @param {string} event
       * @param {function} callback
       */
      listenOnRoot: function listenOnRoot(event, callback) {
        var _this = this;

        this.$root.$on(event, callback);
        this.$on(HOOK_EVENT_NAME_BEFORE_DESTROY, function () {
          _this.$root.$off(event, callback);
        });
      },

      /**
       * Safely register a `$once()` event listener on the root Vue node
       * While Vue automatically removes listeners for individual components,
       * when a component registers a listener on root and is destroyed,
       * this orphans a callback because the node is gone,
       * but the root does not clear the callback
       *
       * When registering a $root listener, it also registers a listener on
       * the component's `beforeDestroy` hook to automatically remove the
       * event listener from the $root instance.
       *
       * @param {string} event
       * @param {function} callback
       */
      listenOnRootOnce: function listenOnRootOnce(event, callback) {
        var _this2 = this;

        this.$root.$once(event, callback);
        this.$on(HOOK_EVENT_NAME_BEFORE_DESTROY, function () {
          _this2.$root.$off(event, callback);
        });
      },

      /**
       * Convenience method for calling `vm.$emit()` on `vm.$root`
       *
       * @param {string} event
       * @param {*} args
       */
      emitOnRoot: function emitOnRoot(event) {
        var _this$$root;

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        (_this$$root = this.$root).$emit.apply(_this$$root, [event].concat(args));
      }
    }
  });

  var listenersMixin = makePropCacheMixin('$listeners', 'bvListeners');

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function ownKeys$7(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$7(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$7(Object(source), true).forEach(function (key) { _defineProperty$7(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$7(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty$7(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var ROOT_EVENT_NAME_CLICKED = getRootEventName(NAME_LINK, 'clicked'); // --- Props ---
  // `<router-link>` specific props

  var routerLinkProps = {
    activeClass: makeProp(PROP_TYPE_STRING),
    append: makeProp(PROP_TYPE_BOOLEAN, false),
    event: makeProp(PROP_TYPE_ARRAY_STRING, EVENT_NAME_CLICK),
    exact: makeProp(PROP_TYPE_BOOLEAN, false),
    exactActiveClass: makeProp(PROP_TYPE_STRING),
    replace: makeProp(PROP_TYPE_BOOLEAN, false),
    routerTag: makeProp(PROP_TYPE_STRING, 'a'),
    to: makeProp(PROP_TYPE_OBJECT_STRING)
  }; // `<nuxt-link>` specific props

  var nuxtLinkProps = {
    noPrefetch: makeProp(PROP_TYPE_BOOLEAN, false),
    // Must be `null` to fall back to the value defined in the
    // `nuxt.config.js` configuration file for `router.prefetchLinks`
    // We convert `null` to `undefined`, so that Nuxt.js will use the
    // compiled default
    // Vue treats `undefined` as default of `false` for Boolean props,
    // so we must set it as `null` here to be a true tri-state prop
    prefetch: makeProp(PROP_TYPE_BOOLEAN, null)
  }; // All `<b-link>` props

  var props$c = makePropsConfigurable(sortKeys(_objectSpread$7(_objectSpread$7(_objectSpread$7({}, nuxtLinkProps), routerLinkProps), {}, {
    active: makeProp(PROP_TYPE_BOOLEAN, false),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
    href: makeProp(PROP_TYPE_STRING),
    // Must be `null` if no value provided
    rel: makeProp(PROP_TYPE_STRING, null),
    // To support 3rd party router links based on `<router-link>` (i.e. `g-link` for Gridsome)
    // Default is to auto choose between `<router-link>` and `<nuxt-link>`
    // Gridsome doesn't provide a mechanism to auto detect and has caveats
    // such as not supporting FQDN URLs or hash only URLs
    routerComponentName: makeProp(PROP_TYPE_STRING),
    target: makeProp(PROP_TYPE_STRING, '_self')
  })), NAME_LINK); // --- Main component ---
  // @vue/component

  var BLink = /*#__PURE__*/Vue__default["default"].extend({
    name: NAME_LINK,
    // Mixin order is important!
    mixins: [attrsMixin, listenersMixin, listenOnRootMixin, normalizeSlotMixin],
    inheritAttrs: false,
    props: props$c,
    computed: {
      computedTag: function computedTag() {
        // We don't pass `this` as the first arg as we need reactivity of the props
        var to = this.to,
            disabled = this.disabled,
            routerComponentName = this.routerComponentName;
        return computeTag({
          to: to,
          disabled: disabled,
          routerComponentName: routerComponentName
        }, this);
      },
      isRouterLink: function isRouterLink$1() {
        return isRouterLink(this.computedTag);
      },
      computedRel: function computedRel() {
        // We don't pass `this` as the first arg as we need reactivity of the props
        var target = this.target,
            rel = this.rel;
        return computeRel({
          target: target,
          rel: rel
        });
      },
      computedHref: function computedHref() {
        // We don't pass `this` as the first arg as we need reactivity of the props
        var to = this.to,
            href = this.href;
        return computeHref({
          to: to,
          href: href
        }, this.computedTag);
      },
      computedProps: function computedProps() {
        var prefetch = this.prefetch;
        return this.isRouterLink ? _objectSpread$7(_objectSpread$7({}, pluckProps(_objectSpread$7(_objectSpread$7({}, routerLinkProps), nuxtLinkProps), this)), {}, {
          // Coerce `prefetch` value `null` to be `undefined`
          prefetch: isBoolean(prefetch) ? prefetch : undefined,
          // Pass `router-tag` as `tag` prop
          tag: this.routerTag
        }) : {};
      },
      computedAttrs: function computedAttrs() {
        var bvAttrs = this.bvAttrs,
            href = this.computedHref,
            rel = this.computedRel,
            disabled = this.disabled,
            target = this.target,
            routerTag = this.routerTag,
            isRouterLink = this.isRouterLink;
        return _objectSpread$7(_objectSpread$7(_objectSpread$7(_objectSpread$7({}, bvAttrs), href ? {
          href: href
        } : {}), isRouterLink && !isTag(routerTag, 'a') ? {} : {
          rel: rel,
          target: target
        }), {}, {
          tabindex: disabled ? '-1' : isUndefined(bvAttrs.tabindex) ? null : bvAttrs.tabindex,
          'aria-disabled': disabled ? 'true' : null
        });
      },
      computedListeners: function computedListeners() {
        return _objectSpread$7(_objectSpread$7({}, this.bvListeners), {}, {
          // We want to overwrite any click handler since our callback
          // will invoke the user supplied handler(s) if `!this.disabled`
          click: this.onClick
        });
      }
    },
    methods: {
      onClick: function onClick(event) {
        var _arguments = arguments;
        var eventIsEvent = isEvent(event);
        var isRouterLink = this.isRouterLink;
        var suppliedHandler = this.bvListeners.click;

        if (eventIsEvent && this.disabled) {
          // Stop event from bubbling up
          // Kill the event loop attached to this specific `EventTarget`
          // Needed to prevent `vue-router` for doing its thing
          stopEvent(event, {
            immediatePropagation: true
          });
        } else {
          /* istanbul ignore next: difficult to test, but we know it works */
          if (isRouterLink && event.currentTarget.__vue__) {
            // Router links do not emit instance `click` events, so we
            // add in an `$emit('click', event)` on its Vue instance
            event.currentTarget.__vue__.$emit(EVENT_NAME_CLICK, event);
          } // Call the suppliedHandler(s), if any provided


          concat(suppliedHandler).filter(function (h) {
            return isFunction(h);
          }).forEach(function (handler) {
            handler.apply(void 0, _toConsumableArray(_arguments));
          }); // Emit the global `$root` click event

          this.emitOnRoot(ROOT_EVENT_NAME_CLICKED, event); // TODO: Remove deprecated 'clicked::link' event with next major release

          this.emitOnRoot('clicked::link', event);
        } // Stop scroll-to-top behavior or navigation on
        // regular links when href is just '#'


        if (eventIsEvent && !isRouterLink && this.computedHref === '#') {
          stopEvent(event, {
            propagation: false
          });
        }
      },
      focus: function focus() {
        attemptFocus(this.$el);
      },
      blur: function blur() {
        attemptBlur(this.$el);
      }
    },
    render: function render(h) {
      var active = this.active,
          disabled = this.disabled;
      return h(this.computedTag, _defineProperty$7({
        class: {
          active: active,
          disabled: disabled
        },
        attrs: this.computedAttrs,
        props: this.computedProps
      }, this.isRouterLink ? 'nativeOn' : 'on', this.computedListeners), this.normalizeSlot());
    }
  });

  var htmlOrText = function htmlOrText(innerHTML, textContent) {
    return innerHTML ? {
      innerHTML: innerHTML
    } : textContent ? {
      textContent: textContent
    } : {};
  };

  var props$b = makePropsConfigurable({
    bgVariant: makeProp(PROP_TYPE_STRING),
    borderVariant: makeProp(PROP_TYPE_STRING),
    tag: makeProp(PROP_TYPE_STRING, 'div'),
    textVariant: makeProp(PROP_TYPE_STRING)
  }, NAME_CARD); // --- Mixin ---
  // @vue/component

  Vue__default["default"].extend({
    props: props$b
  });

  var props$a = makePropsConfigurable({
    title: makeProp(PROP_TYPE_STRING),
    titleTag: makeProp(PROP_TYPE_STRING, 'h4')
  }, NAME_CARD_TITLE); // --- Main component ---
  // @vue/component

  var BCardTitle = /*#__PURE__*/Vue__default["default"].extend({
    name: NAME_CARD_TITLE,
    functional: true,
    props: props$a,
    render: function render(h, _ref) {
      var props = _ref.props,
          data = _ref.data,
          children = _ref.children;
      return h(props.titleTag, a(data, {
        staticClass: 'card-title'
      }), children || toString(props.title));
    }
  });

  var props$9 = makePropsConfigurable({
    subTitle: makeProp(PROP_TYPE_STRING),
    subTitleTag: makeProp(PROP_TYPE_STRING, 'h6'),
    subTitleTextVariant: makeProp(PROP_TYPE_STRING, 'muted')
  }, NAME_CARD_SUB_TITLE); // --- Main component ---
  // @vue/component

  var BCardSubTitle = /*#__PURE__*/Vue__default["default"].extend({
    name: NAME_CARD_SUB_TITLE,
    functional: true,
    props: props$9,
    render: function render(h, _ref) {
      var props = _ref.props,
          data = _ref.data,
          children = _ref.children;
      return h(props.subTitleTag, a(data, {
        staticClass: 'card-subtitle',
        class: [props.subTitleTextVariant ? "text-".concat(props.subTitleTextVariant) : null]
      }), children || toString(props.subTitle));
    }
  });

  function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$6(Object(source), true).forEach(function (key) { _defineProperty$6(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$6(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty$6(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var props$8 = makePropsConfigurable(sortKeys(_objectSpread$6(_objectSpread$6(_objectSpread$6(_objectSpread$6({}, props$a), props$9), copyProps(props$b, prefixPropName.bind(null, 'body'))), {}, {
    bodyClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
    overlay: makeProp(PROP_TYPE_BOOLEAN, false)
  })), NAME_CARD_BODY); // --- Main component ---
  // @vue/component

  var BCardBody = /*#__PURE__*/Vue__default["default"].extend({
    name: NAME_CARD_BODY,
    functional: true,
    props: props$8,
    render: function render(h, _ref) {
      var _ref2;

      var props = _ref.props,
          data = _ref.data,
          children = _ref.children;
      var bodyBgVariant = props.bodyBgVariant,
          bodyBorderVariant = props.bodyBorderVariant,
          bodyTextVariant = props.bodyTextVariant;
      var $title = h();

      if (props.title) {
        $title = h(BCardTitle, {
          props: pluckProps(props$a, props)
        });
      }

      var $subTitle = h();

      if (props.subTitle) {
        $subTitle = h(BCardSubTitle, {
          props: pluckProps(props$9, props),
          class: ['mb-2']
        });
      }

      return h(props.bodyTag, a(data, {
        staticClass: 'card-body',
        class: [(_ref2 = {
          'card-img-overlay': props.overlay
        }, _defineProperty$6(_ref2, "bg-".concat(bodyBgVariant), bodyBgVariant), _defineProperty$6(_ref2, "border-".concat(bodyBorderVariant), bodyBorderVariant), _defineProperty$6(_ref2, "text-".concat(bodyTextVariant), bodyTextVariant), _ref2), props.bodyClass]
      }), [$title, $subTitle, children]);
    }
  });

  function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$5(Object(source), true).forEach(function (key) { _defineProperty$5(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty$5(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var props$7 = makePropsConfigurable(sortKeys(_objectSpread$5(_objectSpread$5({}, copyProps(props$b, prefixPropName.bind(null, 'header'))), {}, {
    header: makeProp(PROP_TYPE_STRING),
    headerClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
    headerHtml: makeProp(PROP_TYPE_STRING)
  })), NAME_CARD_HEADER); // --- Main component ---
  // @vue/component

  var BCardHeader = /*#__PURE__*/Vue__default["default"].extend({
    name: NAME_CARD_HEADER,
    functional: true,
    props: props$7,
    render: function render(h, _ref) {
      var _ref2;

      var props = _ref.props,
          data = _ref.data,
          children = _ref.children;
      var headerBgVariant = props.headerBgVariant,
          headerBorderVariant = props.headerBorderVariant,
          headerTextVariant = props.headerTextVariant;
      return h(props.headerTag, a(data, {
        staticClass: 'card-header',
        class: [props.headerClass, (_ref2 = {}, _defineProperty$5(_ref2, "bg-".concat(headerBgVariant), headerBgVariant), _defineProperty$5(_ref2, "border-".concat(headerBorderVariant), headerBorderVariant), _defineProperty$5(_ref2, "text-".concat(headerTextVariant), headerTextVariant), _ref2)],
        domProps: children ? {} : htmlOrText(props.headerHtml, props.header)
      }), children);
    }
  });

  function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$4(Object(source), true).forEach(function (key) { _defineProperty$4(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty$4(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var props$6 = makePropsConfigurable(sortKeys(_objectSpread$4(_objectSpread$4({}, copyProps(props$b, prefixPropName.bind(null, 'footer'))), {}, {
    footer: makeProp(PROP_TYPE_STRING),
    footerClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
    footerHtml: makeProp(PROP_TYPE_STRING)
  })), NAME_CARD_FOOTER); // --- Main component ---
  // @vue/component

  var BCardFooter = /*#__PURE__*/Vue__default["default"].extend({
    name: NAME_CARD_FOOTER,
    functional: true,
    props: props$6,
    render: function render(h, _ref) {
      var _ref2;

      var props = _ref.props,
          data = _ref.data,
          children = _ref.children;
      var footerBgVariant = props.footerBgVariant,
          footerBorderVariant = props.footerBorderVariant,
          footerTextVariant = props.footerTextVariant;
      return h(props.footerTag, a(data, {
        staticClass: 'card-footer',
        class: [props.footerClass, (_ref2 = {}, _defineProperty$4(_ref2, "bg-".concat(footerBgVariant), footerBgVariant), _defineProperty$4(_ref2, "border-".concat(footerBorderVariant), footerBorderVariant), _defineProperty$4(_ref2, "text-".concat(footerTextVariant), footerTextVariant), _ref2)],
        domProps: children ? {} : htmlOrText(props.footerHtml, props.footer)
      }), children);
    }
  });

  var props$5 = makePropsConfigurable({
    alt: makeProp(PROP_TYPE_STRING),
    blank: makeProp(PROP_TYPE_BOOLEAN, false),
    blankColor: makeProp(PROP_TYPE_STRING, 'transparent'),
    block: makeProp(PROP_TYPE_BOOLEAN, false),
    center: makeProp(PROP_TYPE_BOOLEAN, false),
    fluid: makeProp(PROP_TYPE_BOOLEAN, false),
    // Gives fluid images class `w-100` to make them grow to fit container
    fluidGrow: makeProp(PROP_TYPE_BOOLEAN, false),
    height: makeProp(PROP_TYPE_NUMBER_STRING),
    left: makeProp(PROP_TYPE_BOOLEAN, false),
    right: makeProp(PROP_TYPE_BOOLEAN, false),
    // Possible values:
    //   `false`: no rounding of corners
    //   `true`: slightly rounded corners
    //   'top': top corners rounded
    //   'right': right corners rounded
    //   'bottom': bottom corners rounded
    //   'left': left corners rounded
    //   'circle': circle/oval
    //   '0': force rounding off
    rounded: makeProp(PROP_TYPE_BOOLEAN_STRING, false),
    sizes: makeProp(PROP_TYPE_ARRAY_STRING),
    src: makeProp(PROP_TYPE_STRING),
    srcset: makeProp(PROP_TYPE_ARRAY_STRING),
    thumbnail: makeProp(PROP_TYPE_BOOLEAN, false),
    width: makeProp(PROP_TYPE_NUMBER_STRING)
  }, NAME_IMG); // --- Main component ---

  function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { _defineProperty$3(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty$3(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var props$4 = makePropsConfigurable(sortKeys(_objectSpread$3(_objectSpread$3({}, pick(props$5, ['src', 'alt', 'width', 'height', 'left', 'right'])), {}, {
    bottom: makeProp(PROP_TYPE_BOOLEAN, false),
    end: makeProp(PROP_TYPE_BOOLEAN, false),
    start: makeProp(PROP_TYPE_BOOLEAN, false),
    top: makeProp(PROP_TYPE_BOOLEAN, false)
  })), NAME_CARD_IMG); // --- Main component ---
  // @vue/component

  var BCardImg = /*#__PURE__*/Vue__default["default"].extend({
    name: NAME_CARD_IMG,
    functional: true,
    props: props$4,
    render: function render(h, _ref) {
      var props = _ref.props,
          data = _ref.data;
      var src = props.src,
          alt = props.alt,
          width = props.width,
          height = props.height;
      var baseClass = 'card-img';

      if (props.top) {
        baseClass += '-top';
      } else if (props.right || props.end) {
        baseClass += '-right';
      } else if (props.bottom) {
        baseClass += '-bottom';
      } else if (props.left || props.start) {
        baseClass += '-left';
      }

      return h('img', a(data, {
        class: baseClass,
        attrs: {
          src: src,
          alt: alt,
          width: width,
          height: height
        }
      }));
    }
  });

  function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty$2(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var cardImgProps = copyProps(props$4, prefixPropName.bind(null, 'img'));
  cardImgProps.imgSrc.required = false;
  var props$3 = makePropsConfigurable(sortKeys(_objectSpread$2(_objectSpread$2(_objectSpread$2(_objectSpread$2(_objectSpread$2(_objectSpread$2({}, props$8), props$7), props$6), cardImgProps), props$b), {}, {
    align: makeProp(PROP_TYPE_STRING),
    noBody: makeProp(PROP_TYPE_BOOLEAN, false)
  })), NAME_CARD); // --- Main component ---
  // @vue/component

  var BCard = /*#__PURE__*/Vue__default["default"].extend({
    name: NAME_CARD,
    functional: true,
    props: props$3,
    render: function render(h, _ref) {
      var _class;

      var props = _ref.props,
          data = _ref.data,
          slots = _ref.slots,
          scopedSlots = _ref.scopedSlots;
      var imgSrc = props.imgSrc,
          imgLeft = props.imgLeft,
          imgRight = props.imgRight,
          imgStart = props.imgStart,
          imgEnd = props.imgEnd,
          imgBottom = props.imgBottom,
          header = props.header,
          headerHtml = props.headerHtml,
          footer = props.footer,
          footerHtml = props.footerHtml,
          align = props.align,
          textVariant = props.textVariant,
          bgVariant = props.bgVariant,
          borderVariant = props.borderVariant;
      var $scopedSlots = scopedSlots || {};
      var $slots = slots();
      var slotScope = {};
      var $imgFirst = h();
      var $imgLast = h();

      if (imgSrc) {
        var $img = h(BCardImg, {
          props: pluckProps(cardImgProps, props, unprefixPropName.bind(null, 'img'))
        });

        if (imgBottom) {
          $imgLast = $img;
        } else {
          $imgFirst = $img;
        }
      }

      var $header = h();
      var hasHeaderSlot = hasNormalizedSlot(SLOT_NAME_HEADER, $scopedSlots, $slots);

      if (hasHeaderSlot || header || headerHtml) {
        $header = h(BCardHeader, {
          props: pluckProps(props$7, props),
          domProps: hasHeaderSlot ? {} : htmlOrText(headerHtml, header)
        }, normalizeSlot(SLOT_NAME_HEADER, slotScope, $scopedSlots, $slots));
      }

      var $content = normalizeSlot(SLOT_NAME_DEFAULT, slotScope, $scopedSlots, $slots); // Wrap content in `<card-body>` when `noBody` prop set

      if (!props.noBody) {
        $content = h(BCardBody, {
          props: pluckProps(props$8, props)
        }, $content); // When the `overlap` prop is set we need to wrap the `<b-card-img>` and `<b-card-body>`
        // into a relative positioned wrapper to don't distract a potential header or footer

        if (props.overlay && imgSrc) {
          $content = h('div', {
            staticClass: 'position-relative'
          }, [$imgFirst, $content, $imgLast]); // Reset image variables since they are already in the wrapper

          $imgFirst = h();
          $imgLast = h();
        }
      }

      var $footer = h();
      var hasFooterSlot = hasNormalizedSlot(SLOT_NAME_FOOTER, $scopedSlots, $slots);

      if (hasFooterSlot || footer || footerHtml) {
        $footer = h(BCardFooter, {
          props: pluckProps(props$6, props),
          domProps: hasHeaderSlot ? {} : htmlOrText(footerHtml, footer)
        }, normalizeSlot(SLOT_NAME_FOOTER, slotScope, $scopedSlots, $slots));
      }

      return h(props.tag, a(data, {
        staticClass: 'card',
        class: (_class = {
          'flex-row': imgLeft || imgStart,
          'flex-row-reverse': (imgRight || imgEnd) && !(imgLeft || imgStart)
        }, _defineProperty$2(_class, "text-".concat(align), align), _defineProperty$2(_class, "bg-".concat(bgVariant), bgVariant), _defineProperty$2(_class, "border-".concat(borderVariant), borderVariant), _defineProperty$2(_class, "text-".concat(textVariant), textVariant), _class)
      }), [$imgFirst, $header, $content, $footer, $imgLast]);
    }
  });

  var props$2 = makePropsConfigurable({
    columns: makeProp(PROP_TYPE_BOOLEAN, false),
    deck: makeProp(PROP_TYPE_BOOLEAN, false),
    tag: makeProp(PROP_TYPE_STRING, 'div')
  }, NAME_CARD_GROUP); // --- Main component ---
  // @vue/component

  var BCardGroup = /*#__PURE__*/Vue__default["default"].extend({
    name: NAME_CARD_GROUP,
    functional: true,
    props: props$2,
    render: function render(h, _ref) {
      var props = _ref.props,
          data = _ref.data,
          children = _ref.children;
      return h(props.tag, a(data, {
        class: props.deck ? 'card-deck' : props.columns ? 'card-columns' : 'card-group'
      }), children);
    }
  });

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
  var BvEvent = /*#__PURE__*/function () {
    function BvEvent(type) {
      var eventInit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, BvEvent);

      // Start by emulating native Event constructor
      if (!type) {
        /* istanbul ignore next */
        throw new TypeError("Failed to construct '".concat(this.constructor.name, "'. 1 argument required, ").concat(arguments.length, " given."));
      } // Merge defaults first, the eventInit, and the type last
      // so it can't be overwritten


      assign(this, BvEvent.Defaults, this.constructor.Defaults, eventInit, {
        type: type
      }); // Freeze some props as readonly, but leave them enumerable

      defineProperties(this, {
        type: readonlyDescriptor(),
        cancelable: readonlyDescriptor(),
        nativeEvent: readonlyDescriptor(),
        target: readonlyDescriptor(),
        relatedTarget: readonlyDescriptor(),
        vueTarget: readonlyDescriptor(),
        componentId: readonlyDescriptor()
      }); // Create a private variable using closure scoping

      var defaultPrevented = false; // Recreate preventDefault method. One way setter

      this.preventDefault = function preventDefault() {
        if (this.cancelable) {
          defaultPrevented = true;
        }
      }; // Create `defaultPrevented` publicly accessible prop that
      // can only be altered by the preventDefault method


      defineProperty(this, 'defaultPrevented', {
        enumerable: true,
        get: function get() {
          return defaultPrevented;
        }
      });
    }

    _createClass(BvEvent, null, [{
      key: "Defaults",
      get: function get() {
        return {
          type: '',
          cancelable: true,
          nativeEvent: null,
          target: null,
          relatedTarget: null,
          vueTarget: null,
          componentId: null
        };
      }
    }]);

    return BvEvent;
  }();

  var _watch;

  function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  // for `<b-pagination>` and `<b-pagination-nav>`
  // --- Constants ---

  var _makeModelMixin = makeModelMixin('value', {
    type: PROP_TYPE_BOOLEAN_NUMBER_STRING,
    defaultValue: null,

    /* istanbul ignore next */
    validator: function validator(value) {
      if (!isNull(value) && toInteger(value, 0) < 1) {
        warn('"v-model" value must be a number greater than "0"', NAME_PAGINATION);
        return false;
      }

      return true;
    }
  }),
      modelMixin = _makeModelMixin.mixin,
      modelProps = _makeModelMixin.props,
      MODEL_PROP_NAME = _makeModelMixin.prop,
      MODEL_EVENT_NAME = _makeModelMixin.event;

  var ELLIPSIS_THRESHOLD = 3; // Default # of buttons limit

  var DEFAULT_LIMIT = 5; // --- Helper methods ---
  // Make an array of N to N+X

  var makePageArray = function makePageArray(startNumber, numberOfPages) {
    return createArray(numberOfPages, function (_, i) {
      return {
        number: startNumber + i,
        classes: null
      };
    });
  }; // Sanitize the provided limit value (converting to a number)


  var sanitizeLimit = function sanitizeLimit(value) {
    var limit = toInteger(value) || 1;
    return limit < 1 ? DEFAULT_LIMIT : limit;
  }; // Sanitize the provided current page number (converting to a number)


  var sanitizeCurrentPage = function sanitizeCurrentPage(val, numberOfPages) {
    var page = toInteger(val) || 1;
    return page > numberOfPages ? numberOfPages : page < 1 ? 1 : page;
  }; // Links don't normally respond to SPACE, so we add that
  // functionality via this handler


  var onSpaceKey = function onSpaceKey(event) {
    if (event.keyCode === CODE_SPACE) {
      // Stop page from scrolling
      stopEvent(event, {
        immediatePropagation: true
      }); // Trigger the click event on the link

      event.currentTarget.click();
      return false;
    }
  }; // --- Props ---


  var props$1 = makePropsConfigurable(sortKeys(_objectSpread$1(_objectSpread$1({}, modelProps), {}, {
    align: makeProp(PROP_TYPE_STRING, 'left'),
    ariaLabel: makeProp(PROP_TYPE_STRING, 'Pagination'),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
    ellipsisClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
    ellipsisText: makeProp(PROP_TYPE_STRING, "\u2026"),
    // '…'
    firstClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
    firstNumber: makeProp(PROP_TYPE_BOOLEAN, false),
    firstText: makeProp(PROP_TYPE_STRING, "\xAB"),
    // '«'
    hideEllipsis: makeProp(PROP_TYPE_BOOLEAN, false),
    hideGotoEndButtons: makeProp(PROP_TYPE_BOOLEAN, false),
    labelFirstPage: makeProp(PROP_TYPE_STRING, 'Go to first page'),
    labelLastPage: makeProp(PROP_TYPE_STRING, 'Go to last page'),
    labelNextPage: makeProp(PROP_TYPE_STRING, 'Go to next page'),
    labelPage: makeProp(PROP_TYPE_FUNCTION_STRING, 'Go to page'),
    labelPrevPage: makeProp(PROP_TYPE_STRING, 'Go to previous page'),
    lastClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
    lastNumber: makeProp(PROP_TYPE_BOOLEAN, false),
    lastText: makeProp(PROP_TYPE_STRING, "\xBB"),
    // '»'
    limit: makeProp(PROP_TYPE_NUMBER_STRING, DEFAULT_LIMIT,
    /* istanbul ignore next */
    function (value) {
      if (toInteger(value, 0) < 1) {
        warn('Prop "limit" must be a number greater than "0"', NAME_PAGINATION);
        return false;
      }

      return true;
    }),
    nextClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
    nextText: makeProp(PROP_TYPE_STRING, "\u203A"),
    // '›'
    pageClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
    pills: makeProp(PROP_TYPE_BOOLEAN, false),
    prevClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
    prevText: makeProp(PROP_TYPE_STRING, "\u2039"),
    // '‹'
    size: makeProp(PROP_TYPE_STRING)
  })), 'pagination'); // --- Mixin ---
  // @vue/component

  var paginationMixin = Vue__default["default"].extend({
    mixins: [modelMixin, normalizeSlotMixin],
    props: props$1,
    data: function data() {
      // `-1` signifies no page initially selected
      var currentPage = toInteger(this[MODEL_PROP_NAME], 0);
      currentPage = currentPage > 0 ? currentPage : -1;
      return {
        currentPage: currentPage,
        localNumberOfPages: 1,
        localLimit: DEFAULT_LIMIT
      };
    },
    computed: {
      btnSize: function btnSize() {
        var size = this.size;
        return size ? "pagination-".concat(size) : '';
      },
      alignment: function alignment() {
        var align = this.align;

        if (align === 'center') {
          return 'justify-content-center';
        } else if (align === 'end' || align === 'right') {
          return 'justify-content-end';
        } else if (align === 'fill') {
          // The page-items will also have 'flex-fill' added
          // We add text centering to make the button appearance better in fill mode
          return 'text-center';
        }

        return '';
      },
      styleClass: function styleClass() {
        return this.pills ? 'b-pagination-pills' : '';
      },
      computedCurrentPage: function computedCurrentPage() {
        return sanitizeCurrentPage(this.currentPage, this.localNumberOfPages);
      },
      paginationParams: function paginationParams() {
        // Determine if we should show the the ellipsis
        var limit = this.localLimit,
            numberOfPages = this.localNumberOfPages,
            currentPage = this.computedCurrentPage,
            hideEllipsis = this.hideEllipsis,
            firstNumber = this.firstNumber,
            lastNumber = this.lastNumber;
        var showFirstDots = false;
        var showLastDots = false;
        var numberOfLinks = limit;
        var startNumber = 1;

        if (numberOfPages <= limit) {
          // Special case: Less pages available than the limit of displayed pages
          numberOfLinks = numberOfPages;
        } else if (currentPage < limit - 1 && limit > ELLIPSIS_THRESHOLD) {
          if (!hideEllipsis || lastNumber) {
            showLastDots = true;
            numberOfLinks = limit - (firstNumber ? 0 : 1);
          }

          numberOfLinks = mathMin(numberOfLinks, limit);
        } else if (numberOfPages - currentPage + 2 < limit && limit > ELLIPSIS_THRESHOLD) {
          if (!hideEllipsis || firstNumber) {
            showFirstDots = true;
            numberOfLinks = limit - (lastNumber ? 0 : 1);
          }

          startNumber = numberOfPages - numberOfLinks + 1;
        } else {
          // We are somewhere in the middle of the page list
          if (limit > ELLIPSIS_THRESHOLD) {
            numberOfLinks = limit - (hideEllipsis ? 0 : 2);
            showFirstDots = !!(!hideEllipsis || firstNumber);
            showLastDots = !!(!hideEllipsis || lastNumber);
          }

          startNumber = currentPage - mathFloor(numberOfLinks / 2);
        } // Sanity checks

        /* istanbul ignore if */


        if (startNumber < 1) {
          startNumber = 1;
          showFirstDots = false;
        } else if (startNumber > numberOfPages - numberOfLinks) {
          startNumber = numberOfPages - numberOfLinks + 1;
          showLastDots = false;
        }

        if (showFirstDots && firstNumber && startNumber < 4) {
          numberOfLinks = numberOfLinks + 2;
          startNumber = 1;
          showFirstDots = false;
        }

        var lastPageNumber = startNumber + numberOfLinks - 1;

        if (showLastDots && lastNumber && lastPageNumber > numberOfPages - 3) {
          numberOfLinks = numberOfLinks + (lastPageNumber === numberOfPages - 2 ? 2 : 3);
          showLastDots = false;
        } // Special handling for lower limits (where ellipsis are never shown)


        if (limit <= ELLIPSIS_THRESHOLD) {
          if (firstNumber && startNumber === 1) {
            numberOfLinks = mathMin(numberOfLinks + 1, numberOfPages, limit + 1);
          } else if (lastNumber && numberOfPages === startNumber + numberOfLinks - 1) {
            startNumber = mathMax(startNumber - 1, 1);
            numberOfLinks = mathMin(numberOfPages - startNumber + 1, numberOfPages, limit + 1);
          }
        }

        numberOfLinks = mathMin(numberOfLinks, numberOfPages - startNumber + 1);
        return {
          showFirstDots: showFirstDots,
          showLastDots: showLastDots,
          numberOfLinks: numberOfLinks,
          startNumber: startNumber
        };
      },
      pageList: function pageList() {
        // Generates the pageList array
        var _this$paginationParam = this.paginationParams,
            numberOfLinks = _this$paginationParam.numberOfLinks,
            startNumber = _this$paginationParam.startNumber;
        var currentPage = this.computedCurrentPage; // Generate list of page numbers

        var pages = makePageArray(startNumber, numberOfLinks); // We limit to a total of 3 page buttons on XS screens
        // So add classes to page links to hide them for XS breakpoint
        // Note: Ellipsis will also be hidden on XS screens
        // TODO: Make this visual limit configurable based on breakpoint(s)

        if (pages.length > 3) {
          var idx = currentPage - startNumber; // THe following is a bootstrap-vue custom utility class

          var classes = 'bv-d-xs-down-none';

          if (idx === 0) {
            // Keep leftmost 3 buttons visible when current page is first page
            for (var i = 3; i < pages.length; i++) {
              pages[i].classes = classes;
            }
          } else if (idx === pages.length - 1) {
            // Keep rightmost 3 buttons visible when current page is last page
            for (var _i = 0; _i < pages.length - 3; _i++) {
              pages[_i].classes = classes;
            }
          } else {
            // Hide all except current page, current page - 1 and current page + 1
            for (var _i2 = 0; _i2 < idx - 1; _i2++) {
              // hide some left button(s)
              pages[_i2].classes = classes;
            }

            for (var _i3 = pages.length - 1; _i3 > idx + 1; _i3--) {
              // hide some right button(s)
              pages[_i3].classes = classes;
            }
          }
        }

        return pages;
      }
    },
    watch: (_watch = {}, _defineProperty$1(_watch, MODEL_PROP_NAME, function (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.currentPage = sanitizeCurrentPage(newValue, this.localNumberOfPages);
      }
    }), _defineProperty$1(_watch, "currentPage", function currentPage(newValue, oldValue) {
      if (newValue !== oldValue) {
        // Emit `null` if no page selected
        this.$emit(MODEL_EVENT_NAME, newValue > 0 ? newValue : null);
      }
    }), _defineProperty$1(_watch, "limit", function limit(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.localLimit = sanitizeLimit(newValue);
      }
    }), _watch),
    created: function created() {
      var _this = this;

      // Set our default values in data
      this.localLimit = sanitizeLimit(this.limit);
      this.$nextTick(function () {
        // Sanity check
        _this.currentPage = _this.currentPage > _this.localNumberOfPages ? _this.localNumberOfPages : _this.currentPage;
      });
    },
    methods: {
      handleKeyNav: function handleKeyNav(event) {
        var keyCode = event.keyCode,
            shiftKey = event.shiftKey;
        /* istanbul ignore if */

        if (this.isNav) {
          // We disable left/right keyboard navigation in `<b-pagination-nav>`
          return;
        }

        if (keyCode === CODE_LEFT || keyCode === CODE_UP) {
          stopEvent(event, {
            propagation: false
          });
          shiftKey ? this.focusFirst() : this.focusPrev();
        } else if (keyCode === CODE_RIGHT || keyCode === CODE_DOWN) {
          stopEvent(event, {
            propagation: false
          });
          shiftKey ? this.focusLast() : this.focusNext();
        }
      },
      getButtons: function getButtons() {
        // Return only buttons that are visible
        return selectAll('button.page-link, a.page-link', this.$el).filter(function (btn) {
          return isVisible(btn);
        });
      },
      focusCurrent: function focusCurrent() {
        var _this2 = this;

        // We do this in `$nextTick()` to ensure buttons have finished rendering
        this.$nextTick(function () {
          var btn = _this2.getButtons().find(function (el) {
            return toInteger(getAttr(el, 'aria-posinset'), 0) === _this2.computedCurrentPage;
          });

          if (!attemptFocus(btn)) {
            // Fallback if current page is not in button list
            _this2.focusFirst();
          }
        });
      },
      focusFirst: function focusFirst() {
        var _this3 = this;

        // We do this in `$nextTick()` to ensure buttons have finished rendering
        this.$nextTick(function () {
          var btn = _this3.getButtons().find(function (el) {
            return !isDisabled(el);
          });

          attemptFocus(btn);
        });
      },
      focusLast: function focusLast() {
        var _this4 = this;

        // We do this in `$nextTick()` to ensure buttons have finished rendering
        this.$nextTick(function () {
          var btn = _this4.getButtons().reverse().find(function (el) {
            return !isDisabled(el);
          });

          attemptFocus(btn);
        });
      },
      focusPrev: function focusPrev() {
        var _this5 = this;

        // We do this in `$nextTick()` to ensure buttons have finished rendering
        this.$nextTick(function () {
          var buttons = _this5.getButtons();

          var index = buttons.indexOf(getActiveElement());

          if (index > 0 && !isDisabled(buttons[index - 1])) {
            attemptFocus(buttons[index - 1]);
          }
        });
      },
      focusNext: function focusNext() {
        var _this6 = this;

        // We do this in `$nextTick()` to ensure buttons have finished rendering
        this.$nextTick(function () {
          var buttons = _this6.getButtons();

          var index = buttons.indexOf(getActiveElement());

          if (index < buttons.length - 1 && !isDisabled(buttons[index + 1])) {
            attemptFocus(buttons[index + 1]);
          }
        });
      }
    },
    render: function render(h) {
      var _this7 = this;

      var disabled = this.disabled,
          labelPage = this.labelPage,
          ariaLabel = this.ariaLabel,
          isNav = this.isNav,
          numberOfPages = this.localNumberOfPages,
          currentPage = this.computedCurrentPage;
      var pageNumbers = this.pageList.map(function (p) {
        return p.number;
      });
      var _this$paginationParam2 = this.paginationParams,
          showFirstDots = _this$paginationParam2.showFirstDots,
          showLastDots = _this$paginationParam2.showLastDots;
      var fill = this.align === 'fill';
      var $buttons = []; // Helper function and flag

      var isActivePage = function isActivePage(pageNumber) {
        return pageNumber === currentPage;
      };

      var noCurrentPage = this.currentPage < 1; // Factory function for prev/next/first/last buttons

      var makeEndBtn = function makeEndBtn(linkTo, ariaLabel, btnSlot, btnText, btnClass, pageTest, key) {
        var isDisabled = disabled || isActivePage(pageTest) || noCurrentPage || linkTo < 1 || linkTo > numberOfPages;
        var pageNumber = linkTo < 1 ? 1 : linkTo > numberOfPages ? numberOfPages : linkTo;
        var scope = {
          disabled: isDisabled,
          page: pageNumber,
          index: pageNumber - 1
        };
        var $btnContent = _this7.normalizeSlot(btnSlot, scope) || toString(btnText) || h();
        var $inner = h(isDisabled ? 'span' : isNav ? BLink : 'button', {
          staticClass: 'page-link',
          class: {
            'flex-grow-1': !isNav && !isDisabled && fill
          },
          props: isDisabled || !isNav ? {} : _this7.linkProps(linkTo),
          attrs: {
            role: isNav ? null : 'menuitem',
            type: isNav || isDisabled ? null : 'button',
            tabindex: isDisabled || isNav ? null : '-1',
            'aria-label': ariaLabel,
            'aria-controls': _this7.ariaControls || null,
            'aria-disabled': isDisabled ? 'true' : null
          },
          on: isDisabled ? {} : {
            '!click': function click(event) {
              _this7.onClick(event, linkTo);
            },
            keydown: onSpaceKey
          }
        }, [$btnContent]);
        return h('li', {
          key: key,
          staticClass: 'page-item',
          class: [{
            disabled: isDisabled,
            'flex-fill': fill,
            'd-flex': fill && !isNav && !isDisabled
          }, btnClass],
          attrs: {
            role: isNav ? null : 'presentation',
            'aria-hidden': isDisabled ? 'true' : null
          }
        }, [$inner]);
      }; // Ellipsis factory


      var makeEllipsis = function makeEllipsis(isLast) {
        return h('li', {
          staticClass: 'page-item',
          class: ['disabled', 'bv-d-xs-down-none', fill ? 'flex-fill' : '', _this7.ellipsisClass],
          attrs: {
            role: 'separator'
          },
          key: "ellipsis-".concat(isLast ? 'last' : 'first')
        }, [h('span', {
          staticClass: 'page-link'
        }, [_this7.normalizeSlot(SLOT_NAME_ELLIPSIS_TEXT) || toString(_this7.ellipsisText) || h()])]);
      }; // Page button factory


      var makePageButton = function makePageButton(page, idx) {
        var pageNumber = page.number;
        var active = isActivePage(pageNumber) && !noCurrentPage; // Active page will have tabindex of 0, or if no current page and first page button

        var tabIndex = disabled ? null : active || noCurrentPage && idx === 0 ? '0' : '-1';
        var attrs = {
          role: isNav ? null : 'menuitemradio',
          type: isNav || disabled ? null : 'button',
          'aria-disabled': disabled ? 'true' : null,
          'aria-controls': _this7.ariaControls || null,
          'aria-label': hasPropFunction(labelPage) ?
          /* istanbul ignore next */
          labelPage(pageNumber) : "".concat(isFunction(labelPage) ? labelPage() : labelPage, " ").concat(pageNumber),
          'aria-checked': isNav ? null : active ? 'true' : 'false',
          'aria-current': isNav && active ? 'page' : null,
          'aria-posinset': isNav ? null : pageNumber,
          'aria-setsize': isNav ? null : numberOfPages,
          // ARIA "roving tabindex" method (except in `isNav` mode)
          tabindex: isNav ? null : tabIndex
        };
        var btnContent = toString(_this7.makePage(pageNumber));
        var scope = {
          page: pageNumber,
          index: pageNumber - 1,
          content: btnContent,
          active: active,
          disabled: disabled
        };
        var $inner = h(disabled ? 'span' : isNav ? BLink : 'button', {
          props: disabled || !isNav ? {} : _this7.linkProps(pageNumber),
          staticClass: 'page-link',
          class: {
            'flex-grow-1': !isNav && !disabled && fill
          },
          attrs: attrs,
          on: disabled ? {} : {
            '!click': function click(event) {
              _this7.onClick(event, pageNumber);
            },
            keydown: onSpaceKey
          }
        }, [_this7.normalizeSlot(SLOT_NAME_PAGE, scope) || btnContent]);
        return h('li', {
          staticClass: 'page-item',
          class: [{
            disabled: disabled,
            active: active,
            'flex-fill': fill,
            'd-flex': fill && !isNav && !disabled
          }, page.classes, _this7.pageClass],
          attrs: {
            role: isNav ? null : 'presentation'
          },
          key: "page-".concat(pageNumber)
        }, [$inner]);
      }; // Goto first page button
      // Don't render button when `hideGotoEndButtons` or `firstNumber` is set


      var $firstPageBtn = h();

      if (!this.firstNumber && !this.hideGotoEndButtons) {
        $firstPageBtn = makeEndBtn(1, this.labelFirstPage, SLOT_NAME_FIRST_TEXT, this.firstText, this.firstClass, 1, 'pagination-goto-first');
      }

      $buttons.push($firstPageBtn); // Goto previous page button

      $buttons.push(makeEndBtn(currentPage - 1, this.labelPrevPage, SLOT_NAME_PREV_TEXT, this.prevText, this.prevClass, 1, 'pagination-goto-prev')); // Show first (1) button?

      $buttons.push(this.firstNumber && pageNumbers[0] !== 1 ? makePageButton({
        number: 1
      }, 0) : h()); // First ellipsis

      $buttons.push(showFirstDots ? makeEllipsis(false) : h()); // Individual page links

      this.pageList.forEach(function (page, idx) {
        var offset = showFirstDots && _this7.firstNumber && pageNumbers[0] !== 1 ? 1 : 0;
        $buttons.push(makePageButton(page, idx + offset));
      }); // Last ellipsis

      $buttons.push(showLastDots ? makeEllipsis(true) : h()); // Show last page button?

      $buttons.push(this.lastNumber && pageNumbers[pageNumbers.length - 1] !== numberOfPages ? makePageButton({
        number: numberOfPages
      }, -1) : h()); // Goto next page button

      $buttons.push(makeEndBtn(currentPage + 1, this.labelNextPage, SLOT_NAME_NEXT_TEXT, this.nextText, this.nextClass, numberOfPages, 'pagination-goto-next')); // Goto last page button
      // Don't render button when `hideGotoEndButtons` or `lastNumber` is set

      var $lastPageBtn = h();

      if (!this.lastNumber && !this.hideGotoEndButtons) {
        $lastPageBtn = makeEndBtn(numberOfPages, this.labelLastPage, SLOT_NAME_LAST_TEXT, this.lastText, this.lastClass, numberOfPages, 'pagination-goto-last');
      }

      $buttons.push($lastPageBtn); // Assemble the pagination buttons

      var $pagination = h('ul', {
        staticClass: 'pagination',
        class: ['b-pagination', this.btnSize, this.alignment, this.styleClass],
        attrs: {
          role: isNav ? null : 'menubar',
          'aria-disabled': disabled ? 'true' : 'false',
          'aria-label': isNav ? null : ariaLabel || null
        },
        // We disable keyboard left/right nav when `<b-pagination-nav>`
        on: isNav ? {} : {
          keydown: this.handleKeyNav
        },
        ref: 'ul'
      }, $buttons); // If we are `<b-pagination-nav>`, wrap in `<nav>` wrapper

      if (isNav) {
        return h('nav', {
          attrs: {
            'aria-disabled': disabled ? 'true' : null,
            'aria-hidden': disabled ? 'true' : 'false',
            'aria-label': isNav ? ariaLabel || null : null
          }
        }, [$pagination]);
      }

      return $pagination;
    }
  });

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var DEFAULT_PER_PAGE = 20;
  var DEFAULT_TOTAL_ROWS = 0; // --- Helper methods ---
  // Sanitize the provided per page number (converting to a number)

  var sanitizePerPage = function sanitizePerPage(value) {
    return mathMax(toInteger(value) || DEFAULT_PER_PAGE, 1);
  }; // Sanitize the provided total rows number (converting to a number)


  var sanitizeTotalRows = function sanitizeTotalRows(value) {
    return mathMax(toInteger(value) || DEFAULT_TOTAL_ROWS, 0);
  }; // --- Props ---


  var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread({}, props$1), {}, {
    ariaControls: makeProp(PROP_TYPE_STRING),
    perPage: makeProp(PROP_TYPE_NUMBER_STRING, DEFAULT_PER_PAGE),
    totalRows: makeProp(PROP_TYPE_NUMBER_STRING, DEFAULT_TOTAL_ROWS)
  })), NAME_PAGINATION); // --- Main component ---
  // @vue/component

  var BPagination = /*#__PURE__*/Vue__default["default"].extend({
    name: NAME_PAGINATION,
    // The render function is brought in via the `paginationMixin`
    mixins: [paginationMixin],
    props: props,
    computed: {
      numberOfPages: function numberOfPages() {
        var result = mathCeil(sanitizeTotalRows(this.totalRows) / sanitizePerPage(this.perPage));
        return result < 1 ? 1 : result;
      },
      // Used for watching changes to `perPage` and `numberOfPages`
      pageSizeNumberOfPages: function pageSizeNumberOfPages() {
        return {
          perPage: sanitizePerPage(this.perPage),
          totalRows: sanitizeTotalRows(this.totalRows),
          numberOfPages: this.numberOfPages
        };
      }
    },
    watch: {
      pageSizeNumberOfPages: function pageSizeNumberOfPages(newValue, oldValue) {
        if (!isUndefinedOrNull(oldValue)) {
          if (newValue.perPage !== oldValue.perPage && newValue.totalRows === oldValue.totalRows) {
            // If the page size changes, reset to page 1
            this.currentPage = 1;
          } else if (newValue.numberOfPages !== oldValue.numberOfPages && this.currentPage > newValue.numberOfPages) {
            // If `numberOfPages` changes and is less than
            // the `currentPage` number, reset to page 1
            this.currentPage = 1;
          }
        }

        this.localNumberOfPages = newValue.numberOfPages;
      }
    },
    created: function created() {
      var _this = this;

      // Set the initial page count
      this.localNumberOfPages = this.numberOfPages; // Set the initial page value

      var currentPage = toInteger(this[MODEL_PROP_NAME], 0);

      if (currentPage > 0) {
        this.currentPage = currentPage;
      } else {
        this.$nextTick(function () {
          // If this value parses to `NaN` or a value less than `1`
          // trigger an initial emit of `null` if no page specified
          _this.currentPage = 0;
        });
      }
    },
    methods: {
      // These methods are used by the render function
      onClick: function onClick(event, pageNumber) {
        var _this2 = this;

        // Dont do anything if clicking the current active page
        if (pageNumber === this.currentPage) {
          return;
        }

        var target = event.target; // Emit a user-cancelable `page-click` event

        var clickEvt = new BvEvent(EVENT_NAME_PAGE_CLICK, {
          cancelable: true,
          vueTarget: this,
          target: target
        });
        this.$emit(clickEvt.type, clickEvt, pageNumber);

        if (clickEvt.defaultPrevented) {
          return;
        } // Update the `v-model`


        this.currentPage = pageNumber; // Emit event triggered by user interaction

        this.$emit(EVENT_NAME_CHANGE, this.currentPage); // Keep the current button focused if possible

        this.$nextTick(function () {
          if (isVisible(target) && _this2.$el.contains(target)) {
            attemptFocus(target);
          } else {
            _this2.focusCurrent();
          }
        });
      },
      makePage: function makePage(pageNum) {
        return pageNum;
      },

      /* istanbul ignore next */
      linkProps: function linkProps() {
        // No props, since we render a plain button
        return {};
      }
    }
  });

  const conferencesFunctions = {
    data() {
      return {
        perPage: 20,
        currentPage: 1,
      };
    },
    computed: {
      conferencesPagination() {
        if(this.conferences == null) return []
        return this.conferences
          .concat()
          .sort((conference1, conference2) => {
            const time1 = new Date(conference1.created_at).getTime();
            const time2 = new Date(conference2.created_at).getTime();

            return Math.sign(time2 - time1);
          })
          .slice(
            this.perPage * (this.currentPage - 1),
            this.perPage * this.currentPage,
        );
      },
    },

    methods: {
      hasName(conference) {
        return !!conference.conference_name;
      },
      hasError(conference) {
        return conference.issues.some((issue) => issue.type === 'error')
      },
      hasWarning(conference) {
        return conference.issues.some((issue) => issue.type === 'warning')
      },
      createPath(conference) {
        return peermetrics.createPath('conference', conference.id)
      }
    },
  };

  //
  var script$7 = {
    name: "conferencesTab",

    components: {
      BPagination
    },

    props: {
      conferences: {
        type: Array,
        required: true
      },
      sessions: {
        type: Array,
        required: true
      },
      isSfu: {
        type: Boolean,
        default: false,
        required: false
      }
    },

    mixins: [conferencesFunctions],

    watch: {
      sessions() {
        this.createDurationChart();
      },
      conferences() {
        // we only want this to run for sfus
        if (!this.isSfu) return

        this.createDurationChart();
      },
    },

    computed: {
      conferenceProblemTitle() {
        if (this.isSfu) {
          return 'Conferences that had problems:'
        }

        return 'Conferences where this participant had problems:'
      },

      participationTitle() {
        if (this.isSfu) {
          return 'Conferences hosted by this server:'
        }

        return 'Conferences this participant attended:'
      },

      warningConferences() {
        // if an sfu, show all conferences that had at least one issue
        if (this.isSfu) {
          return this.conferences.filter((conference) => {
            return conference.issues.length
          })
        }

        // for participants, find all the confs where this specific participant had an issue
        const confWithIssues = [];
        this.sessions.forEach((session) => {
          if (session.issues.length) {
            confWithIssues.push(session.conference);
          }
        });

        return this.conferences.filter((conference) => {
          return confWithIssues.includes(conference.id)
        })
      },

      callDurationChartData() {
        const dates = peermetrics.utils.createDatesArray(peermetrics.daysHistory);

        const aux = {};
        // if it's an SFU, look at conferences, else look at sessions
        const toParse = this.isSfu ? this.conferences : this.sessions;
        toParse.forEach((session) => {
            var date = moment(session.created_at).format('MM/DD');

            if (date in aux) {
                aux[date] += session.duration;
            } else {
                aux[date] = session.duration;
            }
        });

        const seriesData = dates.map((date) => {
          if (aux[date]) {
            const val = aux[date] / 60;
            return Number(val.toFixed(2))
          }

          return 0
        });

        return {
          categories: dates,
          seriesData
        }
      }
    },

    methods: {
      createDurationChart() {
        const {categories, seriesData} = this.callDurationChartData;

        Highcharts.chart("call-duration-chart", {
          credits: false,
          chart: {
            type: "column"
          },
          title: false,
          xAxis: {
            categories: categories,
            crosshair: true
          },
          yAxis: {
            min: 0,
            title: {
              text: "Duration (min)"
            }
          },
          tooltip: {
            formatter: function() {
                return peermetrics.utils.secondsToHMS(this.y * 60)
            },
            shared: true
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0,
              groupPadding: 0,
              shadow: false
            }
          },
          series: [
            {
              name: "Interval (min) ",
              data: seriesData,
              color: peermetrics.colors.info
            }
          ]
        });
      }
    }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      const options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      let hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              const originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              const existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  /* script */
  const __vue_script__$7 = script$7;

  /* template */
  var __vue_render__$6 = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", [
      _vm._m(0),
      _vm._v(" "),
      _c("div", { staticClass: "row" }, [
        _c("div", { staticClass: "col" }, [
          _c("h3", { staticClass: "h5 mt-4" }, [
            _vm._v(_vm._s(_vm.conferenceProblemTitle)),
          ]),
          _vm._v(" "),
          _vm.warningConferences.length < 1
            ? _c("div", { staticClass: "col-12" }, [_vm._m(1)])
            : _c("div", { staticClass: "col-12" }, [
                _c(
                  "div",
                  {
                    staticClass: "list-group list-group-flush",
                    attrs: { id: "conference-list" },
                  },
                  _vm._l(_vm.warningConferences, function (conference) {
                    return _c(
                      "a",
                      {
                        key: conference.id,
                        staticClass: "list-group-item list-group-item-action",
                        attrs: { href: _vm.createPath(conference) },
                      },
                      [
                        _c("div", [
                          _vm.hasName(conference)
                            ? _c("span", [
                                _vm._v(_vm._s(conference.conference_name) + ","),
                              ])
                            : _c("span", { staticClass: "text-muted" }, [
                                _vm._v("No conference name,"),
                              ]),
                          _vm._v(" "),
                          _c("span", { staticClass: "text-muted" }, [
                            _vm._v(_vm._s(conference.conference_id)),
                          ]),
                        ]),
                      ]
                    )
                  }),
                  0
                ),
              ]),
        ]),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "row" }, [
        _c(
          "div",
          { staticClass: "col" },
          [
            _c("h3", { staticClass: "h5 mt-4" }, [
              _vm._v(_vm._s(_vm.participationTitle)),
            ]),
            _vm._v(" "),
            _c(
              "div",
              {
                staticClass: "list-group list-group-flush",
                attrs: { id: "conference-list" },
              },
              _vm._l(_vm.conferencesPagination, function (conference) {
                return _c(
                  "a",
                  {
                    key: conference.id,
                    staticClass: "list-group-item list-group-item-action",
                    attrs: { href: _vm.createPath(conference) },
                  },
                  [
                    _c("div", [
                      _vm.hasName(conference)
                        ? _c("span", [
                            _vm._v(_vm._s(conference.conference_name) + ","),
                          ])
                        : _c("span", { staticClass: "text-muted" }, [
                            _vm._v("No conference name,"),
                          ]),
                      _vm._v(" "),
                      _c("span", { staticClass: "text-muted" }, [
                        _vm._v(_vm._s(conference.conference_id)),
                      ]),
                    ]),
                  ]
                )
              }),
              0
            ),
            _vm._v(" "),
            _vm.conferences.length > _vm.perPage
              ? _c("b-pagination", {
                  staticClass: "mt-3",
                  attrs: {
                    "per-page": _vm.perPage,
                    "aria-controls": "conference-list",
                  },
                  model: {
                    value: _vm.currentPage,
                    callback: function ($$v) {
                      _vm.currentPage = $$v;
                    },
                    expression: "currentPage",
                  },
                })
              : _vm._e(),
          ],
          1
        ),
      ]),
    ])
  };
  var __vue_staticRenderFns__$6 = [
    function () {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "row" }, [
        _c("div", { staticClass: "col" }, [
          _c("h3", { staticClass: "h5 mt-2" }, [_vm._v("Call duration")]),
          _vm._v(" "),
          _c("div", { attrs: { id: "call-duration-chart" } }),
        ]),
      ])
    },
    function () {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "card card-lg text-center" }, [
        _c("div", { staticClass: "card-body" }, [
          _c("h1", { staticClass: "h5" }, [_vm._v("Nothing here!")]),
          _vm._v(" "),
          _c("p", [
            _vm._v("This participant didn't have any problems recently."),
          ]),
        ]),
      ])
    },
  ];
  __vue_render__$6._withStripped = true;

    /* style */
    const __vue_inject_styles__$7 = undefined;
    /* scoped */
    const __vue_scope_id__$7 = undefined;
    /* module identifier */
    const __vue_module_identifier__$7 = undefined;
    /* functional template */
    const __vue_is_functional_template__$7 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$7 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
      __vue_inject_styles__$7,
      __vue_script__$7,
      __vue_scope_id__$7,
      __vue_is_functional_template__$7,
      __vue_module_identifier__$7,
      false,
      undefined,
      undefined,
      undefined
    );

  //
  //
  //
  //

  var script$6 = {
    name: "connectionTab"
  };

  const isOldIE = typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
      return (id, style) => addStyle(id, style);
  }
  let HEAD;
  const styles = {};
  function addStyle(id, css) {
      const group = isOldIE ? css.media || 'default' : id;
      const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
      if (!style.ids.has(id)) {
          style.ids.add(id);
          let code = css.source;
          if (css.map) {
              // https://developer.chrome.com/devtools/docs/javascript-debugging
              // this makes source maps inside style tags work properly in Chrome
              code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
              // http://stackoverflow.com/a/26603875
              code +=
                  '\n/*# sourceMappingURL=data:application/json;base64,' +
                      btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                      ' */';
          }
          if (!style.element) {
              style.element = document.createElement('style');
              style.element.type = 'text/css';
              if (css.media)
                  style.element.setAttribute('media', css.media);
              if (HEAD === undefined) {
                  HEAD = document.head || document.getElementsByTagName('head')[0];
              }
              HEAD.appendChild(style.element);
          }
          if ('styleSheet' in style.element) {
              style.styles.push(code);
              style.element.styleSheet.cssText = style.styles
                  .filter(Boolean)
                  .join('\n');
          }
          else {
              const index = style.ids.size - 1;
              const textNode = document.createTextNode(code);
              const nodes = style.element.childNodes;
              if (nodes[index])
                  style.element.removeChild(nodes[index]);
              if (nodes.length)
                  style.element.insertBefore(textNode, nodes[index]);
              else
                  style.element.appendChild(textNode);
          }
      }
  }

  /* script */
  const __vue_script__$6 = script$6;

  /* template */
  var __vue_render__$5 = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", [_vm._v("connection Tab")])
  };
  var __vue_staticRenderFns__$5 = [];
  __vue_render__$5._withStripped = true;

    /* style */
    const __vue_inject_styles__$6 = function (inject) {
      if (!inject) return
      inject("data-v-46f3c58e_0", { source: "\n\n\n\n\n\n\n\n\n\n\n", map: {"version":3,"sources":[],"names":[],"mappings":"","file":"connectionTab.vue"}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$6 = undefined;
    /* module identifier */
    const __vue_module_identifier__$6 = undefined;
    /* functional template */
    const __vue_is_functional_template__$6 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$6 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
      __vue_inject_styles__$6,
      __vue_script__$6,
      __vue_scope_id__$6,
      __vue_is_functional_template__$6,
      __vue_module_identifier__$6,
      false,
      createInjector,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //

  var script$5 = {
    name: "no-data-message"
  };

  /* script */
  const __vue_script__$5 = script$5;

  /* template */
  var __vue_render__$4 = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    _vm._self._c || _h;
    return _vm._m(0)
  };
  var __vue_staticRenderFns__$4 = [
    function () {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "card card-lg text-center align-middle" }, [
        _c("div", { staticClass: "card-body" }, [
          _c("p", [_vm._v("There is no data to display for this chart.")]),
        ]),
      ])
    },
  ];
  __vue_render__$4._withStripped = true;

    /* style */
    const __vue_inject_styles__$5 = function (inject) {
      if (!inject) return
      inject("data-v-66ea92ec_0", { source: ".card[data-v-66ea92ec] {\n  flex-grow: 1;\n  margin-bottom: 0;\n}\n.card .card-body[data-v-66ea92ec] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n/*# sourceMappingURL=noDataMessage.vue.map */", map: {"version":3,"sources":["/home/andrei/Documents/peermetrics/open source/web/static/js/components/noDataMessage.vue","noDataMessage.vue"],"names":[],"mappings":"AAeA;EACA,YAAA;EACA,gBAAA;ACdA;ADgBA;EACA,aAAA;EACA,uBAAA;EACA,mBAAA;ACdA;;AAEA,4CAA4C","file":"noDataMessage.vue","sourcesContent":["<template>\n  <div class=\"card card-lg text-center align-middle\">\n    <div class=\"card-body\">\n      <p>There is no data to display for this chart.</p>\n    </div>\n  </div>\n</template>\n\n<script>\nexport default {\n  name: \"no-data-message\"\n};\n</script>\n\n<style lang=\"scss\" scoped>\n.card {\n  flex-grow: 1;\n  margin-bottom: 0;\n\n  .card-body {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n  }\n}\n</style>",".card {\n  flex-grow: 1;\n  margin-bottom: 0;\n}\n.card .card-body {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n/*# sourceMappingURL=noDataMessage.vue.map */"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$5 = "data-v-66ea92ec";
    /* module identifier */
    const __vue_module_identifier__$5 = undefined;
    /* functional template */
    const __vue_is_functional_template__$5 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$5 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
      __vue_inject_styles__$5,
      __vue_script__$5,
      __vue_scope_id__$5,
      __vue_is_functional_template__$5,
      __vue_module_identifier__$5,
      false,
      createInjector,
      undefined,
      undefined
    );

  //

  var script$4 = {
    name: "map-chart",
    props: {
      sessions: {
        type: Array,
        required: true
      }
    },
    components: {
      NoDataMessage: __vue_component__$5
    },
    mounted() {
      this.createMapChart();
    },
    data() {
      return {
        map: null,
        countries: null
      }
    },
    computed: {
      dataSeries() {
        let cities = {};

        // keep track of the min and max of occurences
        let min;
        let max;

        this.sessions.map(session => {
          let city = session.geo_ip.city;
          let lat = parseFloat(session.geo_ip.latitude);
          let lon = parseFloat(session.geo_ip.longitude);

          if (city && lat && lon) {
            if (city in cities) {
              cities[city].z += 1;
            } else {
              cities[city] = {
                lat: lat,
                lon: lon,
                z: 1
              };
            }

            min = min ? Math.min(min, cities[city].z) : cities[city].z;
            max = max ? Math.max(max, cities[city].z) : cities[city].z;
          }
        });

        let citySeries = [];
        for (let city of Object.keys(cities)) {
          citySeries.push({
            name: city,
            lat: cities[city].lat,
            lon: cities[city].lon,
            z: cities[city].z
          });
        }

        return {
          citySeries,
          min,
          max
        };
      }
    },
    methods: {
      async createMapChart() {
        // if we have not sessions to use
        if (this.dataSeries.citySeries.length === 0) return

        if (!this.countries) {
          this.countries = await wretch('/static/data/countries.json').get().json();
        }

        if (this.map) {
          this.map.remove();
          this.map = null;
        }

        const {min, max} = this.dataSeries;

        this.map = L.map('map-chart', {
          attributionControl: false,
          maxZoom: 10,
        }).setView([30, 0], 2);

        L.geoJson(this.countries, {
            clickable: false,
            style: {
              fillColor: "#fff",
              fillOpacity: 1,
              fill: true,
              // TODO: find a better color
              color: "#495057",
              weight: 1,
              opacity: 1
          }
        }).addTo(this.map);

        this.dataSeries.citySeries.forEach((city) => {
          let radius;
          // if this happens, most likely we only have on value
          if (min === max) {
            // still, if we have multiple points with the same value, make them a bit smaller
            radius = this.dataSeries.citySeries.length === 0 ? 30 : 20;
          } else {
            // we should always have a value between 10 and 30
            radius = ( city.z - min / max - min ) * 30;
            radius = Math.min(Math.max(radius, 10), 30);
          }

          L.circleMarker([city.lat, city.lon], {
            color: peermetrics.colors.default,
            fillColor: peermetrics.colors.default,
            fillOpacity: 0.5,
            radius: radius
          })
          .bindTooltip(`${city.name}<br>Count: ${city.z}`, {
            direction: 'top'
          })
          .addTo(this.map);
        });
      }
    },
    watch: {
      sessions() {
        this.$nextTick(this.createMapChart);
      },
    },
  };

  /* script */
  const __vue_script__$4 = script$4;

  /* template */
  var __vue_render__$3 = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "chart" },
      [
        !_vm.dataSeries || _vm.dataSeries.citySeries.length === 0
          ? _c("NoDataMessage")
          : _c("div", { attrs: { id: "map-chart" } }),
      ],
      1
    )
  };
  var __vue_staticRenderFns__$3 = [];
  __vue_render__$3._withStripped = true;

    /* style */
    const __vue_inject_styles__$4 = function (inject) {
      if (!inject) return
      inject("data-v-3d05a61c_0", { source: "\n#map-chart {\n  min-height: 200px;\n}\n", map: {"version":3,"sources":["/home/andrei/Documents/peermetrics/open source/web/static/js/components/mapChart.vue"],"names":[],"mappings":";AAgJA;EACA,iBAAA;AACA","file":"mapChart.vue","sourcesContent":["<template>\n  <div class=\"chart\">\n    <NoDataMessage v-if=\"!dataSeries || dataSeries.citySeries.length === 0 \" />\n    <div v-else id=\"map-chart\"></div>\n  </div>\n</template>\n\n<script>\nimport NoDataMessage from \"./noDataMessage.vue\";\n\nexport default {\n  name: \"map-chart\",\n  props: {\n    sessions: {\n      type: Array,\n      required: true\n    }\n  },\n  components: {\n    NoDataMessage\n  },\n  mounted() {\n    this.createMapChart();\n  },\n  data() {\n    return {\n      map: null,\n      countries: null\n    }\n  },\n  computed: {\n    dataSeries() {\n      let cities = {};\n\n      // keep track of the min and max of occurences\n      let min\n      let max\n\n      this.sessions.map(session => {\n        let city = session.geo_ip.city;\n        let lat = parseFloat(session.geo_ip.latitude);\n        let lon = parseFloat(session.geo_ip.longitude);\n\n        if (city && lat && lon) {\n          if (city in cities) {\n            cities[city].z += 1;\n          } else {\n            cities[city] = {\n              lat: lat,\n              lon: lon,\n              z: 1\n            };\n          }\n\n          min = min ? Math.min(min, cities[city].z) : cities[city].z\n          max = max ? Math.max(max, cities[city].z) : cities[city].z\n        }\n      });\n\n      let citySeries = [];\n      for (let city of Object.keys(cities)) {\n        citySeries.push({\n          name: city,\n          lat: cities[city].lat,\n          lon: cities[city].lon,\n          z: cities[city].z\n        });\n      }\n\n      return {\n        citySeries,\n        min,\n        max\n      };\n    }\n  },\n  methods: {\n    async createMapChart() {\n      // if we have not sessions to use\n      if (this.dataSeries.citySeries.length === 0) return\n\n      if (!this.countries) {\n        this.countries = await wretch('/static/data/countries.json').get().json()\n      }\n\n      if (this.map) {\n        this.map.remove()\n        this.map = null\n      }\n\n      const {min, max} = this.dataSeries\n\n      this.map = L.map('map-chart', {\n        attributionControl: false,\n        maxZoom: 10,\n      }).setView([30, 0], 2);\n\n      L.geoJson(this.countries, {\n          clickable: false,\n          style: {\n            fillColor: \"#fff\",\n            fillOpacity: 1,\n            fill: true,\n            // TODO: find a better color\n            color: \"#495057\",\n            weight: 1,\n            opacity: 1\n        }\n      }).addTo(this.map)\n\n      this.dataSeries.citySeries.forEach((city) => {\n        let radius\n        // if this happens, most likely we only have on value\n        if (min === max) {\n          // still, if we have multiple points with the same value, make them a bit smaller\n          radius = this.dataSeries.citySeries.length === 0 ? 30 : 20\n        } else {\n          // we should always have a value between 10 and 30\n          radius = ( city.z - min / max - min ) * 30\n          radius = Math.min(Math.max(radius, 10), 30)\n        }\n\n        L.circleMarker([city.lat, city.lon], {\n          color: peermetrics.colors.default,\n          fillColor: peermetrics.colors.default,\n          fillOpacity: 0.5,\n          radius: radius\n        })\n        .bindTooltip(`${city.name}<br>Count: ${city.z}`, {\n          direction: 'top'\n        })\n        .addTo(this.map)\n      })\n    }\n  },\n  watch: {\n    sessions() {\n      this.$nextTick(this.createMapChart)\n    },\n  },\n};\n</script>\n\n<style>\n  #map-chart {\n    min-height: 200px;\n  }\n</style>"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$4 = undefined;
    /* module identifier */
    const __vue_module_identifier__$4 = undefined;
    /* functional template */
    const __vue_is_functional_template__$4 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$4 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$4,
      __vue_script__$4,
      __vue_scope_id__$4,
      __vue_is_functional_template__$4,
      __vue_module_identifier__$4,
      false,
      createInjector,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //

  var script$3 = {
    name: "loader"
  };

  /* script */
  const __vue_script__$3 = script$3;

  /* template */
  var __vue_render__$2 = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    _vm._self._c || _h;
    return _vm._m(0)
  };
  var __vue_staticRenderFns__$2 = [
    function () {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "loader-container" }, [
        _c("div", { staticClass: "loader" }),
      ])
    },
  ];
  __vue_render__$2._withStripped = true;

    /* style */
    const __vue_inject_styles__$3 = function (inject) {
      if (!inject) return
      inject("data-v-c92a4578_0", { source: "\n\n/*# sourceMappingURL=loader.vue.map */", map: {"version":3,"sources":["loader.vue"],"names":[],"mappings":";;AAEA,qCAAqC","file":"loader.vue"}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$3 = "data-v-c92a4578";
    /* module identifier */
    const __vue_module_identifier__$3 = undefined;
    /* functional template */
    const __vue_is_functional_template__$3 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$3 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      false,
      createInjector,
      undefined,
      undefined
    );

  //

  var script$2 = {
    name: "devicesTab",

    components: {
      BCardGroup,
      BCard,
      MapChart: __vue_component__$4,
      Loader: __vue_component__$3
    },

    props: {
      sessions: {
        type: Array,
        required: true
      },
      displayed: {
        type: Boolean,
        required: false,
        default: false
      }
    },

    data() {
      return {
        maxDevices: 3,
        showMap: false
      }
    },

    watch: {
      sessions() {
        this.createOSChart();
        this.createBrowserChart();
      },

      // we need to wait for the tab to become visible before we instantiate <map-chart>
      // leaflet does not like when base elements are hidden
      displayed(val) {
        if (val) {
          setTimeout(() => {
            this.showMap = true;
          // this is a bit more than bootstrap's "fade" CSS transition
          }, 160);
        }
      }
    },

    computed: {
      browsers() {
        let systems = [];
        let drilldown = {};
        let len = this.sessions.length;

        this.sessions.forEach(function (event) {
            if (event.platform) {
                let platform = event.platform;
                let name = platform.browser.name;
                let version = platform.browser.version;

                systems.push(name);

                if (version) {
                    if (drilldown[name]) {
                        drilldown[name].push(version);
                    } else {
                        drilldown[name] = [version];
                    }
                }
            }
        });

        systems = peermetrics.utils.reduce(systems, len);

        let series = [];
        let drilldownSeries = [];
        for (let browser in systems) {
            series.push({
                name: browser,
                y: systems[browser],
                drilldown: drilldown[browser] ? browser : null
            });

            if (drilldown[browser]) {
                let versions = peermetrics.utils.reduce(drilldown[browser], drilldown[browser].length);
                drilldownSeries.push({
                    name: browser,
                    id: browser,
                    data: Object.entries(versions)
                });
            }
        }

        return {
          series,
          drilldown: drilldownSeries
        }
      },

      operatingSystems() {
        let systems = [];
        let drilldown = {};
        let len = this.sessions.length;

        this.sessions.forEach(function (event) {
            if (event.platform) {
                let platform = event.platform;
                let name = platform.os.name;
                let version = platform.os.version;

                systems.push(name);

                if (version) {
                    if (drilldown[name]) {
                        drilldown[name].push(version);
                    } else {
                        drilldown[name] = [version];
                    }
                }
            }
        });

        systems = peermetrics.utils.reduce(systems, len);

        let series = [];
        let drilldownSeries = [];
        for (let browser in systems) {
            series.push({
                name: browser,
                y: systems[browser],
                drilldown: drilldown[browser] ? browser : null
            });

            if (drilldown[browser]) {
                let versions = peermetrics.utils.reduce(drilldown[browser], drilldown[browser].length);
                drilldownSeries.push({
                    name: browser,
                    id: browser,
                    data: Object.entries(versions)
                });
            }
        }

        return {
          series,
          drilldown: drilldownSeries
        }
      },

      inputDevices() {
        const label = 'audioinput';

        return this.createDevicesList(this.sessions, label)
      },

      videoDevices() {
        const label = 'videoinput';

        return this.createDevicesList(this.sessions, label)
      },

      outputDevices() {
        const label = 'audiooutput';

        return this.createDevicesList(this.sessions, label)
      }
    },

    methods: {
      createOSChart() {
        const {series, drilldown} = this.operatingSystems;

        Highcharts.chart("os-chart", {
          credits: false,
          chart: {
            type: "pie"
          },
          title: {
            text: ""
          },
          subtitle: {
            text: "Click the slices to view versions"
          },
          plotOptions: {
            series: {
              dataLabels: {
                enabled: true,
                format: "{point.name}: {point.y:.1f}%"
              }
            }
          },
          tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat:
              '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b><br/>'
          },
          series: [
            {
              name: "OS",
              colorByPoint: true,
              data: series
            }
          ],
          drilldown: {
            series: drilldown
          }
        });
      },

      createBrowserChart() {
        const {series, drilldown} = this.browsers;

        Highcharts.chart("browser-chart", {
          credits: false,
          chart: {
            type: "pie"
          },
          title: {
            text: ""
          },
          subtitle: {
            text: "Click the slices to view versions"
          },
          plotOptions: {
            series: {
              dataLabels: {
                enabled: true,
                format: "{point.name}: {point.y:.1f}%"
              }
            }
          },
          tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat:
              '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b><br/>'
          },
          series: [
            {
              name: "Browser",
              colorByPoint: true,
              data: series
            }
          ],
          drilldown: {
            series: drilldown
          }
        });
      },

      createDevicesList(data = [], kind) {
        const filteredDevices = data.reduce((acc, item) => {
          // filter just the device kind that we care, and add it to filteredDevices
          return acc.concat(item.devices.filter((device) => device.kind === kind))
        }, [])
        .map(item => item.label);

        const counted = peermetrics.utils.reduce(filteredDevices);

        return Object.keys(counted)
          .map(item => ({
            label: item,
            count: counted[item]
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, this.maxDevices);
      }
    }
  };

  /* script */
  const __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$1 = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", [
      _c("div", { staticClass: "row" }, [
        _c(
          "div",
          { staticClass: "col-12 col-sm" },
          [
            _c("h3", { staticClass: "mb-2 mt-2" }, [
              _vm._v("\n        Connected devices\n      "),
            ]),
            _vm._v(" "),
            _c("p", [
              _vm._v(
                "\n        This is a top " +
                  _vm._s(_vm.maxDevices) +
                  " list of devices the participant used to connect to conferences.\n      "
              ),
            ]),
            _vm._v(" "),
            _c(
              "b-card-group",
              { attrs: { deck: "" } },
              [
                _c(
                  "b-card",
                  { attrs: { header: "Micropones", "header-tag": "header" } },
                  _vm._l(_vm.inputDevices, function (device) {
                    return _c("p", { key: device.label }, [
                      _vm._v(_vm._s(device.label)),
                    ])
                  }),
                  0
                ),
                _vm._v(" "),
                _c(
                  "b-card",
                  { attrs: { header: "Cameras", "header-tag": "header" } },
                  _vm._l(_vm.videoDevices, function (device) {
                    return _c("p", { key: device.label }, [
                      _vm._v(_vm._s(device.label)),
                    ])
                  }),
                  0
                ),
                _vm._v(" "),
                _c(
                  "b-card",
                  { attrs: { header: "Output Devices", "header-tag": "header" } },
                  _vm._l(_vm.outputDevices, function (device) {
                    return _c("p", { key: device.label }, [
                      _vm._v(_vm._s(device.label)),
                    ])
                  }),
                  0
                ),
              ],
              1
            ),
          ],
          1
        ),
      ]),
      _vm._v(" "),
      _vm._m(0),
      _vm._v(" "),
      _c("div", { staticClass: "row mt-3" }, [
        _c(
          "div",
          { staticClass: "col" },
          [
            _c("h3", { staticClass: "mb-2" }, [
              _vm._v("\n        User locations\n      "),
            ]),
            _vm._v(" "),
            _vm.sessions == null ? _c("Loader") : _vm._e(),
            _vm._v(" "),
            _vm.showMap
              ? _c("map-chart", { attrs: { sessions: _vm.sessions } })
              : _vm._e(),
          ],
          1
        ),
      ]),
    ])
  };
  var __vue_staticRenderFns__$1 = [
    function () {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "row mt-3" }, [
        _c("div", { staticClass: "col-12 col-sm" }, [
          _c("h3", { staticClass: "mb-2" }, [
            _vm._v("\n        Operating systems\n      "),
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "pie-chart", attrs: { id: "os-chart" } }),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "col" }, [
          _c("h3", { staticClass: "mb-2" }, [
            _vm._v("\n        Browsers\n      "),
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "pie-chart", attrs: { id: "browser-chart" } }),
        ]),
      ])
    },
  ];
  __vue_render__$1._withStripped = true;

    /* style */
    const __vue_inject_styles__$2 = function (inject) {
      if (!inject) return
      inject("data-v-676c2b63_0", { source: "\n.pie-chart {\n  height: 300px;\n}\n", map: {"version":3,"sources":["/home/andrei/Documents/peermetrics/open source/web/static/js/participant/components/devicesTab.vue"],"names":[],"mappings":";AAuUA;EACA,aAAA;AACA","file":"devicesTab.vue","sourcesContent":["<template>\n  <div>\n    <div class=\"row\">\n      <div class=\"col-12 col-sm\">\n        <h3 class=\"mb-2 mt-2\">\n          Connected devices\n        </h3>\n        <p>\n          This is a top {{ maxDevices }} list of devices the participant used to connect to conferences.\n        </p>\n        <b-card-group deck>\n          <b-card header=\"Micropones\" header-tag=\"header\">\n            <p v-for=\"device in inputDevices\" :key=\"device.label\">{{device.label}}</p>\n          </b-card>\n          <b-card header=\"Cameras\" header-tag=\"header\">\n            <p v-for=\"device in videoDevices\" :key=\"device.label\">{{device.label}}</p>\n          </b-card>\n          <b-card header=\"Output Devices\" header-tag=\"header\">\n            <p v-for=\"device in outputDevices\" :key=\"device.label\">{{device.label}}</p>\n          </b-card>\n        </b-card-group>\n      </div>\n    </div>\n\n    <div class=\"row mt-3\">\n      <div class=\"col-12 col-sm\">\n        <h3 class=\"mb-2\">\n          Operating systems\n        </h3>\n        <div id=\"os-chart\" class=\"pie-chart\"></div>\n      </div>\n      <div class=\"col\">\n        <h3 class=\"mb-2\">\n          Browsers\n        </h3>\n        <div id=\"browser-chart\" class=\"pie-chart\"></div>\n      </div>\n    </div>\n\n    <div class=\"row mt-3\">\n      <div class=\"col\">\n        <h3 class=\"mb-2\">\n          User locations\n        </h3>\n        <Loader v-if=\"sessions == null\" />\n        <map-chart v-if=\"showMap\" :sessions=\"sessions\" />\n      </div>\n    </div>\n  </div>\n</template>\n\n<script>\nimport { BCardGroup, BCard } from \"bootstrap-vue\";\n\nimport MapChart from \"../../components/mapChart.vue\";\nimport Loader from \"../../components/loader.vue\";\n\nexport default {\n  name: \"devicesTab\",\n\n  components: {\n    BCardGroup,\n    BCard,\n    MapChart,\n    Loader\n  },\n\n  props: {\n    sessions: {\n      type: Array,\n      required: true\n    },\n    displayed: {\n      type: Boolean,\n      required: false,\n      default: false\n    }\n  },\n\n  data() {\n    return {\n      maxDevices: 3,\n      showMap: false\n    }\n  },\n\n  watch: {\n    sessions() {\n      this.createOSChart();\n      this.createBrowserChart();\n    },\n\n    // we need to wait for the tab to become visible before we instantiate <map-chart>\n    // leaflet does not like when base elements are hidden\n    displayed(val) {\n      if (val) {\n        setTimeout(() => {\n          this.showMap = true\n        // this is a bit more than bootstrap's \"fade\" CSS transition\n        }, 160)\n      }\n    }\n  },\n\n  computed: {\n    browsers() {\n      let systems = []\n      let drilldown = {}\n      let len = this.sessions.length\n\n      this.sessions.forEach(function (event) {\n          if (event.platform) {\n              let platform = event.platform\n              let name = platform.browser.name\n              let version = platform.browser.version\n\n              systems.push(name)\n\n              if (version) {\n                  if (drilldown[name]) {\n                      drilldown[name].push(version)\n                  } else {\n                      drilldown[name] = [version]\n                  }\n              }\n          }\n      })\n\n      systems = peermetrics.utils.reduce(systems, len)\n\n      let series = []\n      let drilldownSeries = []\n      for (let browser in systems) {\n          series.push({\n              name: browser,\n              y: systems[browser],\n              drilldown: drilldown[browser] ? browser : null\n          })\n\n          if (drilldown[browser]) {\n              let versions = peermetrics.utils.reduce(drilldown[browser], drilldown[browser].length)\n              drilldownSeries.push({\n                  name: browser,\n                  id: browser,\n                  data: Object.entries(versions)\n              })\n          }\n      }\n\n      return {\n        series,\n        drilldown: drilldownSeries\n      }\n    },\n\n    operatingSystems() {\n      let systems = []\n      let drilldown = {}\n      let len = this.sessions.length\n\n      this.sessions.forEach(function (event) {\n          if (event.platform) {\n              let platform = event.platform\n              let name = platform.os.name\n              let version = platform.os.version\n\n              systems.push(name)\n\n              if (version) {\n                  if (drilldown[name]) {\n                      drilldown[name].push(version)\n                  } else {\n                      drilldown[name] = [version]\n                  }\n              }\n          }\n      })\n\n      systems = peermetrics.utils.reduce(systems, len)\n\n      let series = []\n      let drilldownSeries = []\n      for (let browser in systems) {\n          series.push({\n              name: browser,\n              y: systems[browser],\n              drilldown: drilldown[browser] ? browser : null\n          })\n\n          if (drilldown[browser]) {\n              let versions = peermetrics.utils.reduce(drilldown[browser], drilldown[browser].length)\n              drilldownSeries.push({\n                  name: browser,\n                  id: browser,\n                  data: Object.entries(versions)\n              })\n          }\n      }\n\n      return {\n        series,\n        drilldown: drilldownSeries\n      }\n    },\n\n    inputDevices() {\n      const label = 'audioinput'\n\n      return this.createDevicesList(this.sessions, label)\n    },\n\n    videoDevices() {\n      const label = 'videoinput'\n\n      return this.createDevicesList(this.sessions, label)\n    },\n\n    outputDevices() {\n      const label = 'audiooutput'\n\n      return this.createDevicesList(this.sessions, label)\n    }\n  },\n\n  methods: {\n    createOSChart() {\n      const {series, drilldown} = this.operatingSystems\n\n      Highcharts.chart(\"os-chart\", {\n        credits: false,\n        chart: {\n          type: \"pie\"\n        },\n        title: {\n          text: \"\"\n        },\n        subtitle: {\n          text: \"Click the slices to view versions\"\n        },\n        plotOptions: {\n          series: {\n            dataLabels: {\n              enabled: true,\n              format: \"{point.name}: {point.y:.1f}%\"\n            }\n          }\n        },\n        tooltip: {\n          headerFormat: '<span style=\"font-size:11px\">{series.name}</span><br>',\n          pointFormat:\n            '<span style=\"color:{point.color}\">{point.name}</span>: <b>{point.y:.2f}%</b><br/>'\n        },\n        series: [\n          {\n            name: \"OS\",\n            colorByPoint: true,\n            data: series\n          }\n        ],\n        drilldown: {\n          series: drilldown\n        }\n      });\n    },\n\n    createBrowserChart() {\n      const {series, drilldown} = this.browsers\n\n      Highcharts.chart(\"browser-chart\", {\n        credits: false,\n        chart: {\n          type: \"pie\"\n        },\n        title: {\n          text: \"\"\n        },\n        subtitle: {\n          text: \"Click the slices to view versions\"\n        },\n        plotOptions: {\n          series: {\n            dataLabels: {\n              enabled: true,\n              format: \"{point.name}: {point.y:.1f}%\"\n            }\n          }\n        },\n        tooltip: {\n          headerFormat: '<span style=\"font-size:11px\">{series.name}</span><br>',\n          pointFormat:\n            '<span style=\"color:{point.color}\">{point.name}</span>: <b>{point.y:.2f}%</b><br/>'\n        },\n        series: [\n          {\n            name: \"Browser\",\n            colorByPoint: true,\n            data: series\n          }\n        ],\n        drilldown: {\n          series: drilldown\n        }\n      });\n    },\n\n    createDevicesList(data = [], kind) {\n      const filteredDevices = data.reduce((acc, item) => {\n        // filter just the device kind that we care, and add it to filteredDevices\n        return acc.concat(item.devices.filter((device) => device.kind === kind))\n      }, [])\n      .map(item => item.label);\n\n      const counted = peermetrics.utils.reduce(filteredDevices);\n\n      return Object.keys(counted)\n        .map(item => ({\n          label: item,\n          count: counted[item]\n        }))\n        .sort((a, b) => b.count - a.count)\n        .slice(0, this.maxDevices);\n    }\n  }\n};\n</script>\n\n<style>\n  .pie-chart {\n    height: 300px;\n  }\n</style>"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$2 = undefined;
    /* module identifier */
    const __vue_module_identifier__$2 = undefined;
    /* functional template */
    const __vue_is_functional_template__$2 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$2 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      false,
      createInjector,
      undefined,
      undefined
    );

  //

  var script$1 = {
    data() {
      return {
        conferences: [],
        sessions: [],
        // TODO: this might not be the best way. we use this flag to detect 
        // when the devices tab is disaplyed so we rerender the leaflet map
        showDevices: false,
        participant: window.peermetrics.participant
      };
    },

    async created() {
      const conferences = await peermetrics.get(peermetrics.urls.conferences(), {
        participantId: peermetrics.participant.id
      }).catch(e => console.log(e));
      if(conferences) {
        conferences.forEach(conference => this.conferences.push(conference));
      }

      const sessions = await peermetrics.get(peermetrics.urls.sessions, {
        participantId: peermetrics.participant.id
      }).catch(e => console.log(e));
      if(sessions) {
        sessions.forEach(session => this.sessions.push(session));
      }

      // TODO: remove this after we've implemented the connections tab
      $('[data-toggle="tooltip"]').tooltip();
    },

    methods: {},

    components: {
      ConferencesTab: __vue_component__$7,
      ConnectionsTab: __vue_component__$6,
      DevicesTab: __vue_component__$2
    }
  };

  /* script */
  const __vue_script__$1 = script$1;

  /* template */
  var __vue_render__ = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", [
      _c(
        "ul",
        { staticClass: "nav nav-tabs", attrs: { id: "myTab", role: "tablist" } },
        [
          _vm._m(0),
          _vm._v(" "),
          !_vm.participant.isSfu
            ? _c("li", { staticClass: "nav-item" }, [
                _c(
                  "a",
                  {
                    staticClass: "nav-link",
                    attrs: {
                      id: "devices-tab",
                      "data-toggle": "tab",
                      href: "#devices",
                      role: "tab",
                      "aria-controls": "devices",
                      "aria-selected": "false",
                    },
                    on: {
                      click: function ($event) {
                        _vm.showDevices = true;
                      },
                    },
                  },
                  [_vm._v("Devices")]
                ),
              ])
            : _vm._e(),
          _vm._v(" "),
          _vm._m(1),
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "tab-content", attrs: { id: "myTabContent" } }, [
        _c(
          "div",
          {
            staticClass: "tab-pane fade show active",
            attrs: {
              id: "conferences",
              role: "tabpanel",
              "aria-labelledby": "conferences-tab",
            },
          },
          [
            _c("conferences-tab", {
              attrs: {
                conferences: _vm.conferences,
                sessions: _vm.sessions,
                isSfu: _vm.participant.isSfu,
              },
            }),
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass: "tab-pane fade",
            attrs: {
              id: "devices",
              role: "tabpanel",
              "aria-labelledby": "devices-tab",
            },
          },
          [
            _c("DevicesTab", {
              attrs: { sessions: _vm.sessions, displayed: _vm.showDevices },
            }),
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass: "tab-pane fade",
            attrs: {
              id: "connections",
              role: "tabpanel",
              "aria-labelledby": "connections-tab",
            },
          },
          [_c("ConnectionsTab")],
          1
        ),
      ]),
    ])
  };
  var __vue_staticRenderFns__ = [
    function () {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("li", { staticClass: "nav-item" }, [
        _c(
          "a",
          {
            staticClass: "nav-link active",
            attrs: {
              id: "conferences-tab",
              "data-toggle": "tab",
              href: "#conferences",
              role: "tab",
              "aria-controls": "conferences",
              "aria-selected": "true",
            },
          },
          [_vm._v("Conferences")]
        ),
      ])
    },
    function () {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("li", { staticClass: "nav-item" }, [
        _c(
          "a",
          {
            staticClass: "nav-link",
            attrs: {
              id: "connections-tab",
              "aria-controls": "connections",
              "aria-selected": "false",
              title: "Launching soon",
              "data-toggle": "tooltip",
              "data-placement": "right",
              disabled: "",
            },
          },
          [_vm._v("Connection stats")]
        ),
      ])
    },
  ];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__$1 = function (inject) {
      if (!inject) return
      inject("data-v-1e1e05e8_0", { source: "\n.tab-pane {\n  padding-top: 30px;\n}\n", map: {"version":3,"sources":["/home/andrei/Documents/peermetrics/open source/web/static/js/participant/components/app.vue"],"names":[],"mappings":";AAyGA;EACA,iBAAA;AACA","file":"app.vue","sourcesContent":["<template>\n  <div>\n    <ul class=\"nav nav-tabs\" id=\"myTab\" role=\"tablist\">\n      <li class=\"nav-item\">\n        <a\n          class=\"nav-link active\"\n          id=\"conferences-tab\"\n          data-toggle=\"tab\"\n          href=\"#conferences\"\n          role=\"tab\"\n          aria-controls=\"conferences\"\n          aria-selected=\"true\"\n        >Conferences</a>\n      </li>\n      <li v-if=\"!participant.isSfu\" class=\"nav-item\">\n        <a\n          class=\"nav-link\"\n          id=\"devices-tab\"\n          data-toggle=\"tab\"\n          href=\"#devices\"\n          role=\"tab\"\n          aria-controls=\"devices\"\n          aria-selected=\"false\"\n          @click=\"showDevices = true\"\n        >Devices</a>\n      </li>\n      <li class=\"nav-item\">\n        <a\n          class=\"nav-link\"\n          id=\"connections-tab\"\n          aria-controls=\"connections\"\n          aria-selected=\"false\"\n          title=\"Launching soon\"\n          data-toggle=\"tooltip\" \n          data-placement=\"right\"\n          disabled\n        >Connection stats</a>\n      </li>\n    </ul>\n    <div class=\"tab-content\" id=\"myTabContent\">\n      <div\n        class=\"tab-pane fade show active\"\n        id=\"conferences\"\n        role=\"tabpanel\"\n        aria-labelledby=\"conferences-tab\"\n      >\n        <conferences-tab v-bind:conferences=\"conferences\" v-bind:sessions=\"sessions\" :isSfu=\"participant.isSfu\" />\n      </div>\n      <div class=\"tab-pane fade\" id=\"devices\" role=\"tabpanel\" aria-labelledby=\"devices-tab\">\n        <DevicesTab :sessions=\"sessions\" :displayed=\"showDevices\" />\n      </div>\n      <div class=\"tab-pane fade\" id=\"connections\" role=\"tabpanel\" aria-labelledby=\"connections-tab\">\n        <ConnectionsTab />\n      </div>\n    </div>\n  </div>\n</template>\n\n<script>\nimport ConferencesTab from \"./conferencesTab.vue\";\nimport ConnectionsTab from \"./connectionTab.vue\";\nimport DevicesTab from \"./devicesTab.vue\";\n\nexport default {\n  data() {\n    return {\n      conferences: [],\n      sessions: [],\n      // TODO: this might not be the best way. we use this flag to detect \n      // when the devices tab is disaplyed so we rerender the leaflet map\n      showDevices: false,\n      participant: window.peermetrics.participant\n    };\n  },\n\n  async created() {\n    const conferences = await peermetrics.get(peermetrics.urls.conferences(), {\n      participantId: peermetrics.participant.id\n    }).catch(e => console.log(e));\n    if(conferences) {\n      conferences.forEach(conference => this.conferences.push(conference));\n    }\n\n    const sessions = await peermetrics.get(peermetrics.urls.sessions, {\n      participantId: peermetrics.participant.id\n    }).catch(e => console.log(e));\n    if(sessions) {\n      sessions.forEach(session => this.sessions.push(session));\n    }\n\n    // TODO: remove this after we've implemented the connections tab\n    $('[data-toggle=\"tooltip\"]').tooltip()\n  },\n\n  methods: {},\n\n  components: {\n    ConferencesTab,\n    ConnectionsTab,\n    DevicesTab\n  }\n};\n</script>\n\n<style>\n.tab-pane {\n  padding-top: 30px;\n}\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$1 = undefined;
    /* module identifier */
    const __vue_module_identifier__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$1 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      false,
      createInjector,
      undefined,
      undefined
    );

  var script = new Vue({
    el: "#app",
    render: h => h(__vue_component__$1)
  });

  /* script */
  const __vue_script__ = script;

  /* template */

    /* style */
    const __vue_inject_styles__ = undefined;
    /* scoped */
    const __vue_scope_id__ = undefined;
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = undefined;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__ = /*#__PURE__*/normalizeComponent(
      {},
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      undefined,
      undefined,
      undefined
    );

  return __vue_component__;

})(Vue);
//# sourceMappingURL=index.js.map
