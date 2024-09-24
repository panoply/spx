/**
* SPX ~ Single Page XHR | https://spx.js.org
*
* @license CC BY-NC-ND 4.0
* @version 0.1.2-beta.1
* @copyright 2024 Nikolas Savvidis
*/
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b2) => {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp.call(b2, prop))
      __defNormalProp(a, prop, b2[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b2)) {
      if (__propIsEnum.call(b2, prop))
        __defNormalProp(a, prop, b2[prop]);
    }
  return a;
};
var __spreadProps = (a, b2) => __defProps(a, __getOwnPropDescs(b2));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/.pnpm/detect-it@4.0.1/node_modules/detect-it/dist/detect-it.esm.js
var w = typeof window !== "undefined" ? window : { screen: {}, navigator: {} };
var matchMedia = (w.matchMedia || function() {
  return { matches: false };
}).bind(w);
var options = {
  get passive() {
    return true;
  }
};
var noop = function() {
};
w.addEventListener && w.addEventListener("p", noop, options);
w.removeEventListener && w.removeEventListener("p", noop, false);
var onTouchStartInWindow = "ontouchstart" in w;
var touchEventInWindow = "TouchEvent" in w;
var supportsTouchEvents = onTouchStartInWindow || touchEventInWindow && matchMedia("(any-pointer: coarse)").matches;
var hasTouch = (w.navigator.maxTouchPoints || 0) > 0 || supportsTouchEvents;
var userAgent = w.navigator.userAgent || "";
var isIPad = matchMedia("(pointer: coarse)").matches && // both iPad and iPhone can "request desktop site", which sets the userAgent to Macintosh
// so need to check both userAgents to determine if it is an iOS device
// and screen size to separate iPad from iPhone
/iPad|Macintosh/.test(userAgent) && Math.min(w.screen.width || 0, w.screen.height || 0) >= 768;
var hasCoarsePrimaryPointer = (matchMedia("(pointer: coarse)").matches || // if the pointer is not coarse and not fine then the browser doesn't support
// interaction media queries (see https://caniuse.com/css-media-interaction)
// so if it has onTouchStartInWindow assume it has a coarse primary pointer
!matchMedia("(pointer: fine)").matches && onTouchStartInWindow) && // bug in firefox (as of v81) on hybrid windows devices where the interaction media queries
// always indicate a touch only device (only has a coarse pointer that can't hover)
// so assume that the primary pointer is not coarse for firefox windows
!/Windows.*Firefox/.test(userAgent);
var hasAnyHoverOrAnyFinePointer = matchMedia("(any-pointer: fine)").matches || matchMedia("(any-hover: hover)").matches || // iPads might have an input device that can hover, so assume it has anyHover
isIPad || // if no onTouchStartInWindow then the browser is indicating that it is not a touch only device
// see above note for supportsTouchEvents
!onTouchStartInWindow;
var deviceType = hasTouch && (hasAnyHoverOrAnyFinePointer || !hasCoarsePrimaryPointer) ? "hybrid" : hasTouch ? "touchOnly" : "mouseOnly";

// src/shared/native.ts
var isBrowser = typeof window !== "undefined";
"content" in document.createElement("template");
document.createRange && "createContextualFragment" in document.createRange();
var pointer = supportsTouchEvents ? "pointer" : "mouse";
var origin = window.location.origin;
var object = Object.create;
var nil = "";
var { warn, info, error, debug } = console;
var d = () => document.documentElement;
var b = () => document.body;
var h = () => document.head;
var o = (value) => value ? Object.assign(object(null), value) : object(null);
var s = (value) => new Set(value);
var p = (handler) => new Proxy(o(), handler);
var m = () => /* @__PURE__ */ new Map();
var XHR = class extends XMLHttpRequest {
  constructor() {
    super(...arguments);
    /**
     * Request Key
     *
     * The request URL key reference.
     */
    this.key = null;
  }
};
/**
 * XHR Request Queue
 *
 * The promise-like queue reference which holds the
 * XHR requests for each fetch dispatched. This allows
 * for aborting in-transit requests.
 */
XHR.$request = m();
/**
 * Request Transits
 *
 * This object holds the XHR requests in transit. The map
 * keys represent the the request URL and values hold the XML Request instance.
 */
XHR.$transit = m();
/**
 * Request Timeouts
 *
 * Transit timeout used to keep track of promises
 * and trigger operations like hover or proximity
 * prefetching.
 */
XHR.$timeout = {};

// src/app/session.ts
var $ = {
  index: "",
  eval: true,
  patched: false,
  loaded: false,
  logLevel: 2,
  qs: o(),
  config: {
    fragments: ["body"],
    timeout: 3e4,
    globalThis: true,
    schema: "spx-",
    logLevel: 3,
    cache: true,
    components: null,
    maxCache: 100,
    reverse: true,
    preload: null,
    annotate: false,
    eval: {
      script: null,
      style: null,
      link: null,
      meta: false
    },
    hover: {
      trigger: "href",
      threshold: 250
    },
    intersect: {
      rootMargin: "0px 0px 0px 0px",
      threshold: 0
    },
    proximity: {
      distance: 75,
      threshold: 250,
      throttle: 500
    },
    progress: {
      bgColor: "#111",
      barHeight: "3px",
      minimum: 0.08,
      easing: "linear",
      speed: 200,
      threshold: 500,
      trickle: true,
      trickleSpeed: 200
    }
  },
  fragments: m(),
  components: {
    $mounted: s(),
    $registry: m(),
    $instances: m(),
    $reference: p({
      get: (map, key) => $.components.$instances.get(map[key])
    })
  },
  events: o(),
  observe: o(),
  memory: o(),
  pages: o(),
  snaps: o(),
  resources: s()
};

// src/shared/logs.ts
var PREFIX = "SPX ";
var START = "\x1B[";
var END = "\x1B[0m";
var R = (text) => START + "31m" + text + END;
var C = (text) => START + "36m" + text + END;
var log = (type, message, context2) => {
  const LEVEL = $.logLevel;
  if (LEVEL > 2 /* INFO */ && type <= 2 /* INFO */) return;
  if (Array.isArray(message)) message = message.join(" ");
  if ((type === 2 /* INFO */ || type === 1 /* VERBOSE */) && (LEVEL === 1 /* VERBOSE */ || LEVEL === 2 /* INFO */)) {
    info(`${PREFIX}%c${message}`, `color: ${context2 || "#999" /* GRAY */};`);
  } else if (type === 3 /* WARN */ && LEVEL <= 3 /* WARN */) {
    if (context2) {
      warn(PREFIX + message, context2);
    } else {
      warn(PREFIX + message);
    }
  } else if (type === 5 /* ERROR */ || type === 4 /* TYPE */) {
    if (context2) {
      error(PREFIX + message, context2);
    } else {
      error(PREFIX + message);
    }
    try {
      if (type === 4 /* TYPE */) {
        throw new TypeError(message);
      } else {
        throw new Error(message);
      }
    } catch (e) {
    }
  }
};

// src/shared/regexp.ts
var CharEntities = /&(?:amp|lt|gt|quot|#39|#x2F|#x60|#x3D);/g;
var ComponentNameCheck = /^[A-Z]|[_-]/;
var isPender = /\b(?:append|prepend)/;
var Whitespace = /\s+/g;
var isBoolean = /^\b(?:true|false)$/i;
var isNumber = /^\d*\.?\d+$/;
var isNumeric = /^(?:[.-]?\d*\.?\d+|NaN)$/;
var isPrefetch = /\b(?:intersect|hover|proximity)\b/;
var isResourceTag = /\b(?:SCRIPT|STYLE|LINK)\b/;
var isArray = /\[(['"]?.*['"]?,?)\]/;
var inPosition = /[xy]\s*|\d*\.?\d+/gi;

// src/shared/const.ts
var Identifiers = s();
var Entities = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#x2F;": "/",
  "&#x60;": "`",
  "&#x3D;": "="
};

// src/shared/utils.ts
function forEach(cb, array) {
  if (arguments.length === 1) return (a) => forEach(cb, a);
  const s2 = array.length;
  if (s2 === 0) return;
  let r, i = -1;
  while (++i < s2) {
    r = cb(array[i], i, array);
    if (r === false) break;
  }
  return r;
}
var splitAttrArrayValue = (input2) => {
  let v = input2.replace(/\s+,/g, ",").replace(/,\s+/g, ",").replace(/['"]/g, "");
  if (v.charCodeAt(0) === 91 /* LSB */ && (/^\[\s*\[/.test(v) || /,/.test(v) && /\]$/.test(v))) {
    v = v.replace(/^\[/, "").replace(/\]$/, "");
  }
  return v.split(/,|\|/);
};
var attrJSON = (attr, string) => {
  try {
    const json = (string || attr).replace(/\\'|'/g, (m2) => m2[0] === "\\" ? m2 : '"').replace(/"(?:\\.|[^"])*"/g, (m2) => m2.replace(/\n/g, "\\n")).replace(
      /\[|[^[\]]*|\]/g,
      (m2) => /[[\]]/.test(m2) ? m2 : m2.split(",").map((value) => value.replace(/^(\w+)$/, '"$1"').replace(/^"([\d.]+)"$/g, "$1")).join(",")
    ).replace(/([a-zA-Z0-9_-]+)\s*:/g, '"$1":').replace(/:\s*([$\w-]+)\s*([,\]}])/g, ':"$1"$2').replace(/,(\s*[\]}])/g, "$1").replace(/([a-zA-Z_-]+)\s*,/g, '"$1",').replace(/([\]},\s]+)?"(true|false)"([\s,{}\]]+)/g, "$1$2$3");
    return JSON.parse(json);
  } catch (e) {
    log(5 /* ERROR */, "Invalid JSON in attribute value: " + JSON.stringify(attr || string, null, 2), e);
    return string;
  }
};
var last = (input2) => input2[input2.length - 1];
var equalizeWS = (input2) => input2.replace(/\s+/g, " ").trim();
var escSelector = (input2) => input2.replace(/\./g, "\\.").replace(/@/g, "\\@").replace(/:/g, "\\:");
var onNextTickResolve = () => new Promise((resolve) => setTimeout(() => resolve(), 1));
var onNextTick = (cb, timeout = 1, bind) => setTimeout(() => cb(), timeout);
var promiseResolve = () => Promise.resolve();
var canEval = (element2) => {
  switch (element2.nodeName) {
    case "SCRIPT":
      return element2.matches($.qs.$script);
    case "STYLE":
      return element2.matches($.qs.$script);
    case "META":
      return element2.matches($.qs.$meta);
    case "LINK":
      return element2.matches($.qs.$link);
    default:
      return element2.getAttribute($.qs.$eval) !== "false";
  }
};
var decodeEntities = (input2) => input2.replace(CharEntities, (m2) => Entities[m2] || m2);
var ts = () => (/* @__PURE__ */ new Date()).getTime();
var hasProps = (object2) => {
  const typeOf = typeof object2 === "object";
  return (property) => typeOf ? !property ? false : typeof property === "string" ? property in object2 : property.every((p2) => p2 ? p2 in object2 : false) : false;
};
var hasProp = (object2, property) => typeof object2 === "object" ? property in object2 : false;
var convertValue = (type, value) => {
  switch (type) {
    case String:
      return value || "";
    case Boolean:
      return value === "true" || false;
    case Number:
      return Number(value) || 0;
    case Object:
      return typeof value === "object" ? value : {};
    case Array:
      return Array.isArray(value) ? value : [];
    default:
      return value;
  }
};
var defineGetter = (object2, name, value, configurable = null) => configurable !== null ? name in object2 ? object2 : Object.defineProperty(object2, name, { get: () => value, configurable }) : Object.defineProperty(object2, name, { get: () => value });
var defineGetterProps = (object2, props) => forEach(([name, get2]) => Object.defineProperty(object2, name, { get: get2 }), props);
var targets = (page) => {
  if ("target" in page) {
    if (page.target.length === 1 && page.target[0] === "body") return page.target;
    if (page.target.includes("body")) {
      log(3 /* WARN */, `The body selector passed via ${$.qs.$target} will override`);
      return ["body"];
    }
    return page.target.filter((v, i, a) => v !== "" && v.indexOf(",") === -1 ? a.indexOf(v) === i : false);
  } else if ($.config.fragments.length === 1 && $.config.fragments[0] === "body") {
    return ["body"];
  }
  return [];
};
var selector = (target) => target.length === 1 && target[0] === "body" ? "body" : target.length === 0 ? null : target.join(",");
var isEmpty = (input2) => {
  const T = typeof input2;
  if (T === "object") {
    for (const _ in input2) return false;
    return true;
  }
  return T === "string" ? input2[0] === void 0 : Array.isArray(input2) ? input2.length > 0 : null;
};
var uid = (k = Math.floor(Math.random() * 89999 + 1e4)) => {
  if (Identifiers.has(k)) return uid();
  Identifiers.add(k);
  return k;
};
var uuid = function uuid2(s2 = 5) {
  const k = Math.random().toString(36).slice(-s2);
  if (Identifiers.has(k)) return uuid2(s2);
  Identifiers.add(k);
  return k;
};
var chunk = (size2 = 2) => (acc, value) => {
  const length = acc.length;
  const chunks = length < 1 || acc[length - 1].length === size2 ? acc.push([value]) : acc[length - 1].push(value);
  return chunks && acc;
};
var size = (bytes) => bytes < 1024 ? bytes + " B" : bytes < 1048576 ? (bytes / 1024).toFixed(1) + " KB" : bytes < 1073741824 ? (bytes / 1048576).toFixed(1) + " MB" : (bytes / 1073741824).toFixed(1) + " GB";
var downcase = (input2) => input2[0].toLowerCase() + input2.slice(1);
var upcase = (input2) => input2[0].toUpperCase() + input2.slice(1);
var kebabCase = (input2) => /[A-Z]/.test(input2) ? input2.replace(/(.{1})([A-Z])/g, "$1-$2").toLowerCase() : input2;
var camelCase = (input2) => /[_-]/.test(downcase(input2)) ? input2.replace(/([_-]+).{1}/g, (x, k) => x[k.length].toUpperCase()) : input2;
var nodeSet = (nodes) => s([].slice.call(nodes));
var forNode = (selector2, cb) => {
  const nodes = typeof selector2 === "string" ? b().querySelectorAll(selector2) : selector2;
  const size2 = nodes.length;
  if (size2 === 0) return;
  let i = -1;
  while (++i < size2) if (cb(nodes[i], i) === false) break;
};
var empty = (object2) => {
  for (const prop in object2) delete object2[prop];
};
var parse = (HTMLString) => new DOMParser().parseFromString(HTMLString, "text/html");
var takeSnapshot = (dom2) => (dom2 || document).documentElement.outerHTML;
var getTitle = (dom2) => {
  const title = dom2.indexOf("<title");
  if (title === -1 || dom2.slice(0, title).indexOf("<svg") > -1) return nil;
  const begin = dom2.indexOf(">", title) + 1;
  const ender = dom2.indexOf("</title", begin);
  if (ender === -1) return nil;
  return decodeEntities(dom2.slice(begin, ender).trim());
};
var element = (selector2, el) => el.querySelector(selector2);
var elements = (selector2, el) => [].slice.call(el.querySelectorAll(selector2)) || [];
var enqueue = /* @__PURE__ */ ((queue) => {
  const promise = (fn) => new Promise((resolve) => resolve(fn()));
  const process = async (batch = 2, delay = 200) => {
    while (queue.length > 0) {
      for (const fn of queue.splice(0, batch)) await promise(fn);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  };
  return (...fn) => {
    fn.forEach((cb) => queue.push(cb));
    onNextTick(() => process(), 50);
  };
})([]);

// src/shared/patch.ts
var patchSetAttribute = () => {
  if ($.patched) return;
  $.patched = true;
  const n = Element.prototype.setAttribute;
  const e = document.createElement("i");
  Element.prototype.setAttribute = function setAttribute(name, value) {
    if (name.indexOf("@") < 0) return n.call(this, name, value);
    e.innerHTML = `<i ${name}="${value}"></i>`;
    const attr = e.firstElementChild.getAttributeNode(name);
    e.firstElementChild.removeAttributeNode(attr);
    this.setAttributeNode(attr);
  };
};

// src/app/progress.ts
var progress = (() => {
  const pending = [];
  const node = document.createElement("div");
  let status = null;
  let timeout;
  let element2 = null;
  const style = ({ bgColor, barHeight, speed, easing }) => {
    node.style.cssText = `pointer-events:none;background:${bgColor};height:${barHeight};position:fixed;display:block;z-index:2147483647;top:0;left:0;width:100%;will-change:opacity,transform;transition:${speed}ms ${easing};`;
  };
  const percent = (n) => (-1 + n) * 100;
  const current = (n, min, max) => Math.max(min, Math.min(max, n));
  const render2 = () => {
    if (element2) return element2;
    node.style.transform = `translateX(${percent(status || 0)}%)`;
    element2 = b().appendChild(node);
    return node;
  };
  const remove = () => {
    const dom2 = b();
    if (dom2.contains(element2)) {
      element2.animate(
        { opacity: ["1", "0"] },
        { easing: "ease-out", duration: 100 }
      ).onfinish = () => {
        dom2.removeChild(element2);
        element2 = null;
      };
    } else {
      element2 = null;
    }
  };
  const dequeue = () => {
    const update3 = pending.shift();
    if (update3) update3(dequeue);
  };
  const enqueue2 = (call) => {
    pending.push(call);
    pending.length === 1 && dequeue();
  };
  const set2 = (amount) => {
    amount = current(amount, $.config.progress.minimum, 1);
    status = amount === 1 ? null : amount;
    const progress2 = render2();
    enqueue2((update3) => {
      progress2.style.transform = `translateX(${percent(amount)}%)`;
      setTimeout(() => amount === 1 ? (remove(), update3()) : update3(), $.config.progress.speed * (amount === 1 ? 2 : 1));
    });
  };
  const inc = (amount) => {
    if (!status) return start();
    if (status < 1) {
      if (!amount) amount = status < 0.2 ? 0.1 : status < 0.5 ? 0.04 : status < 0.8 ? 0.02 : 5e-3;
      set2(current(status + amount, 0, 0.994));
    }
  };
  const doTrickle = () => setTimeout(() => status && (inc(), doTrickle()), $.config.progress.trickleSpeed);
  const start = (threshold) => {
    if (!$.config.progress) return;
    timeout = setTimeout(() => {
      if (!status) set2(0);
      $.config.progress.trickle && doTrickle();
    }, threshold || 0);
  };
  const done = (force) => {
    clearTimeout(timeout);
    if (!force && !status) return;
    inc(0.3 + 0.5 * Math.random());
    set2(1);
  };
  return { start, done, style };
})();

// src/components/register.ts
var getComponentId = (instance, identifier) => {
  if (instance.define.name !== "") return instance.define.name;
  const name = instance.name;
  const original = identifier;
  const hasName = "define" in instance && "name" in instance.define;
  console.log(instance.name, identifier);
  instance.define.name = downcase(identifier || name);
  if (identifier !== instance.define.name) identifier = camelCase(instance.define.name);
  if (hasName && name !== original && ComponentNameCheck.test(instance.define.name)) {
    log(3 /* WARN */, [
      `Component identifer id "${instance.define.name}" must use camelCase format.`,
      `The identifer has been converted to "${identifier}"`
    ]);
  }
  return identifier;
};
var registerComponents = (components, isValidID = false) => {
  const { $registry } = $.components;
  for (const id in components) {
    const instance = components[id];
    const identifier = isValidID ? id : getComponentId(instance, id);
    if (!$registry.has(identifier)) {
      $registry.set(identifier, instance);
      log(1 /* VERBOSE */, `Component ${instance.name} registered using id: ${identifier}`, "#F48FB1" /* PINK */);
    }
  }
  if (!$.config.components) {
    $.config.components = true;
  }
};

// src/app/events.ts
function emit(name, ...args) {
  const isCache = name === "before:cache";
  if (isCache) args[1] = parse(args[1]);
  let returns = true;
  forEach((argument) => {
    const returned = argument.apply(null, args);
    if (isCache) {
      if (returned instanceof Document) {
        returns = returned.documentElement.outerHTML;
      } else {
        if (typeof returns !== "string") returns = returned !== false;
      }
    } else {
      returns = returned !== false;
    }
  }, $.events[name] || []);
  return returns;
}
var on = (name, callback, scope) => {
  if (!(name in $.events)) $.events[name] = [];
  return $.events[name].push(scope ? callback.bind(scope) : callback) - 1;
};
var off = (name, callback) => {
  if (name in $.events) {
    const events = $.events[name];
    if (events && typeof callback === "number") {
      events.splice(callback, 1);
      log(2 /* INFO */, `Removed ${name} event listener (id: ${callback})`);
      if (events.length === 0) delete $.events[name];
    } else {
      const live2 = [];
      if (events && callback) {
        for (let i = 0, s2 = events.length; i < s2; i++) {
          if (events[i] !== callback) {
            live2.push(events[i]);
          } else if (name !== "x") {
            log(2 /* INFO */, `Removed ${name} event listener (id: ${i})`);
          }
        }
      }
      if (live2.length) {
        $.events[name] = live2;
      } else {
        delete $.events[name];
      }
    }
  } else {
    log(3 /* WARN */, `There are no ${name} event listeners`);
  }
  return void 0;
};

// src/morph/walk.ts
var walkElements = (node, callback) => {
  const cb = callback(node);
  if (cb === false) return;
  if (cb === 1) node = node.nextSibling;
  let e;
  let i;
  if (node.firstElementChild) {
    i = 0;
    e = node.children[i];
  }
  while (e) {
    if (e) walkElements(e, callback);
    e = node.children[++i];
  }
};

// src/components/listeners.ts
var isValidEvent = (eventName, node) => {
  if (`on${eventName}` in node) return true;
  log(5 /* ERROR */, [
    `Invalid event name "${eventName}" provided. No such event exists in the DOM API.`,
    "Only known event listeners can be attached."
  ], node);
  return false;
};
var eventAttrs = (instance, event) => {
  const method = instance[event.method];
  return function handle2(e) {
    if (event.attrs) e.attrs = event.attrs;
    method.call(instance, e);
  };
};
var removeEvent = (instance, event) => {
  if (!event.attached) return;
  event.listener.abort();
  event.listener = new AbortController();
  event.options.signal = event.listener.signal;
  event.attached = false;
  log(1 /* VERBOSE */, [
    `Detached ${event.key} ${event.eventName} event from ${event.method}() method in component`,
    `${instance.scope.define.name}: ${instance.scope.key}`
  ]);
};
var addEvent = (instance, event, node) => {
  if (event.attached) return;
  if (!(event.method in instance)) {
    log(3 /* WARN */, `Undefined callback method: ${instance.scope.define.name}.${event.method}()`);
    return;
  }
  const dom2 = node ? defineGetter(event, "dom", node).dom : event.dom;
  getEventParams(dom2.attributes, event);
  if (event.isWindow) {
    if (isValidEvent(event.eventName, window)) {
      addEventListener(event.eventName, eventAttrs(instance, event));
    }
  } else {
    if (isValidEvent(event.eventName, dom2)) {
      dom2.addEventListener(event.eventName, eventAttrs(instance, event), event.options);
    }
  }
  event.attached = true;
  log(1 /* VERBOSE */, [
    `Attached ${event.key} ${event.eventName} event to ${event.method}() method in component`,
    `${instance.scope.define.name}: ${instance.scope.key}`
  ]);
};

// src/components/dom.ts
var forStr = (fn, nodes, every = false, m2 = []) => {
  const s2 = nodes.length;
  const x = s2 === 1 ? nodes[0].split(",") : nodes;
  let i = -1;
  while (++i < s2) {
    const v = m2[m2.push(fn(x[i])) - 1];
    if (every && !v) return false;
  }
  return every || m2;
};
var DoM = {
  toNode(node) {
    return node;
  },
  getAttr(node, ...args) {
    return args.length === 1 ? node.getAttribute(args[0]) : args.reduce((a, v) => Object.assign(a, { [v]: node.getAttribute(a) }), o());
  },
  setAttr(node, ...args) {
    typeof args[0] === "object" ? Object.keys(args[0]).forEach((k) => node.setAttribute(k, args[0][k])) : node.setAttribute(args[0], args[1]);
    return this;
  },
  hasAttr(node, ...args) {
    return forStr((a) => node.hasAttribute(a), args, true);
  },
  removeAttr(node, ...args) {
    forStr((a) => !node.hasAttribute(a) || node.removeAttribute(a), args);
    return this;
  },
  addClass(node, ...args) {
    forStr((c) => node.classList.add(c), args);
    console.log(node, args);
    return this;
  },
  hasClass(node, ...args) {
    return forStr((c) => node.classList.contains(c), args, true);
  },
  removeClass(node, ...args) {
    forStr((c) => node.classList.remove(c), args);
    return this;
  },
  toggleClass(node, from, ...to) {
    this.hasClass(node, from) ? this.removeClass(node, from).addClass(node, ...to) : this.addClass(node, from);
    return this;
  },
  on() {
  },
  off() {
  },
  watch() {
  },
  update() {
  }
};

// src/components/proxies.ts
var stateProxy = (scope, dom2) => {
  const prefix = $.config.schema + scope.instanceOf;
  const initialState = (prop, attr, typeCheck = false) => {
    let type = attr;
    let value = "";
    if (typeof attr === "object" && "typeof" in attr) {
      type = attr.typeof;
      value = attr.default;
    }
    scope.state[prop] = convertValue(type, value);
  };
  if (isEmpty(scope.state)) {
    for (const prop in scope.define.state) {
      initialState(prop, scope.define.state[prop]);
    }
  } else {
    for (const prop in scope.define.state) {
      prop in scope.state || initialState(prop, scope.define.state[prop]);
      const attrName = kebabCase(prop);
      const attrValue = dom2.getAttribute(`${prefix}:${attrName}`) || dom2.getAttribute(`${prefix}:${prop}`);
      const defined = attrValue !== null && attrValue !== "";
      const hasState = `has${upcase(prop)}`;
      hasState in scope.state || Object.defineProperty(scope.state, hasState, { get: () => defined });
      if (attrValue && attrValue.startsWith("window.")) {
        scope.state[prop] = window[attrValue.slice(7)];
      } else {
        const attr = scope.define.state[prop];
        const type = typeof attr === "object" ? attr.typeof : attr;
        const value = defined ? attrValue : typeof attr === "object" ? attr.default : "";
        scope.state[prop] = type === Object || type === Array ? defined ? attrJSON(value) : value : convertValue(type, value);
      }
    }
  }
  return new Proxy(scope.state, {
    get: Reflect.get,
    set: (target, key, value, receiver) => {
      const domValue = typeof value === "object" || Array.isArray(value) ? JSON.stringify(value) : String(value);
      if (dom2 && domValue.trim() !== "") {
        const camelCase2 = `${prefix}:${key}`;
        const attrName = dom2.hasAttribute(camelCase2) ? camelCase2 : `${prefix}:${kebabCase(key)}`;
        domValue === dom2.getAttribute(attrName) || dom2.setAttribute(attrName, domValue);
      }
      if (key in scope.binds) {
        for (const id in scope.binds[key]) {
          if (!scope.binds[key][id].live) continue;
          scope.binds[key][id].value = domValue;
          forNode(scope.binds[key][id].selector, (node) => {
            node.innerText = domValue;
          });
        }
      }
      return Reflect.set(target, key, value, receiver);
    }
  });
};
var nodeProxy = (node) => {
  return new Proxy(node, {
    get: (_, prop) => prop in DoM ? (...args) => DoM[prop](node, ...args) : node[prop]
  });
};
var sugarProxy = ({ dom: dom2, name }) => {
  return new Proxy(() => dom2.nodes, {
    get(target, prop, receiver) {
      const { node } = dom2;
      if (prop === Symbol.toPrimitive) {
        log(5 /* ERROR */, `Sugar Error: Use ${C(`this.${name}.toNode()`)} for raw element: ${R(`this.${name}`)}`);
        return () => "";
      }
      if (prop in DoM) {
        return (...args) => DoM[prop](node, ...args);
      } else if (prop in node) {
        const prototype = Reflect.getPrototypeOf(node);
        const descriptor = Reflect.getOwnPropertyDescriptor(prototype, prop);
        if (descriptor && descriptor.get) return Reflect.get(prototype, prop, node);
        const value = Reflect.get(node, prop);
        return typeof value === "function" ? value.bind(node) : value;
      }
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      const { node } = dom2;
      return prop in node ? Reflect.set(node, prop, value) : Reflect.set(target, prop, value, receiver);
    },
    apply(target, thisArg, args) {
      const { nodes } = dom2;
      if (args.length === 2) return nodes.reduce(args[1], args[0]);
      const length = nodes.length;
      const callback = args[0];
      const typeOf = args[0];
      if (typeOf === "number") return nodeProxy(nodes[callback]);
      if (typeOf === "string") return nodes.filter((el) => el.matches(callback));
      if (typeOf === "function") {
        let index = -1;
        const map = Array(length);
        while (++index < length) map[index] = callback(nodeProxy(nodes[index]), index);
        return map;
      }
      return Reflect.apply(target, thisArg, args);
    }
  });
};

// src/components/class.ts
Component.scopes = m();
function Component(define) {
  var _a;
  return _a = class {
    /**
     * **SPX Document Element**
     *
     * Holds a reference to the DOM Document element `<html>` node.
     */
    get root() {
      return d();
    }
    /**
     * **SPX Component Element**
     *
     * Holds a reference to the DOM Document element `<div spx-component="">` node.
     */
    get dom() {
      return this.scope.dom;
    }
    set dom(dom2) {
      Component.scopes.get(this.ref).dom = dom2;
    }
    /**
     * Constructor
     *
     * Creates the component instance
     */
    constructor(value) {
      Reflect.defineProperty(this, "scope", {
        get: () => Component.scopes.get(value)
      });
      Reflect.defineProperty(this, "ref", {
        value,
        configurable: false,
        enumerable: false,
        writable: false
      });
      console.log(Component.scopes);
      this.state = stateProxy(this.scope, this.dom);
    }
  }, /**
   * Static Definition
   *
   * The define object
   */
  _a.define = Object.assign({
    name: "",
    merge: false,
    sugar: false,
    state: {},
    nodes: []
  }, define), _a;
}

// src/observe/components.ts
var components_exports = {};
__export(components_exports, {
  connect: () => connect2,
  disconnect: () => disconnect,
  hargs: () => hargs,
  hook: () => hook,
  mount: () => mount,
  teardown: () => teardown
});

// src/components/observe.ts
var context;
var mark = s();
var resetContext = () => onNextTick(() => context = void 0);
var connect = (node, refs) => {
  for (const id of refs) {
    if (!$.components.$reference[id]) continue;
    const instance = $.components.$reference[id];
    const ref = id.charCodeAt(0);
    if (ref === 99 /* COMPONENT */) {
      $.components.$mounted.add(instance.scope.key);
      console.log(node);
      instance.dom = node;
      instance.scope.status = 2 /* MOUNT */;
      log(1 /* VERBOSE */, `Component ${instance.scope.define.name} mounted: ${instance.scope.key}`, "#6DD093" /* GREEN */);
    } else if (ref === 101 /* EVENT */) {
      addEvent(instance, instance.scope.events[id], node);
    } else if (ref === 110 /* NODE */) {
      for (const k in instance.scope.nodes) {
        ++instance.scope.nodes[k].live;
      }
    } else if (ref === 98 /* BINDING */) {
      for (const k in instance.scope.binds) {
        if (id in instance.scope.binds[k]) {
          node.innerText = instance.scope.binds[k][id].value;
          instance.scope.binds[k][id].live = true;
          break;
        }
      }
    }
  }
};
var unmount = (curNode, refs) => {
  for (const id of refs) {
    if (!$.components.$reference[id]) continue;
    const instance = $.components.$reference[id];
    const ref = id.charCodeAt(0);
    if (ref === 99 /* COMPONENT */) {
      instance.scope.hooks.unmount === 2 /* DEFINED */ && instance.unmount(hargs());
      $.components.$mounted.delete(instance.scope.key);
      if (instance.scope.define.merge) {
        instance.scope.snapshot = curNode.innerHTML;
        log(1 /* VERBOSE */, `Component ${instance.scope.define.name} snapshot: ${instance.scope.key}`, "#999" /* GRAY */);
      }
      for (const k in instance.scope.nodes) {
        instance.scope.nodes[k].live = 0;
      }
      for (const k in instance.scope.binds) {
        for (const uuid3 in instance.scope.binds[k]) {
          instance.scope.binds[k][uuid3].live = false;
        }
      }
      for (const key in instance.scope.events) {
        removeEvent(instance, instance.scope.events[key]);
      }
      instance.scope.status = 5 /* UNMOUNTED */;
      log(1 /* VERBOSE */, `Component ${instance.scope.define.name} unmounted: ${instance.scope.key}`, "#7b97ca" /* PURPLE */);
    } else if (ref === 101 /* EVENT */) {
      removeEvent(instance, instance.scope.events[id]);
    } else if (ref === 110 /* NODE */) {
      for (const k in instance.scope.nodes) {
        --instance.scope.nodes[k].live;
      }
    } else if (ref === 98 /* BINDING */) {
      for (const k in instance.scope.binds) {
        if (id in instance.scope.binds[k]) {
          instance.scope.binds[k][id].live = false;
          break;
        }
      }
    }
  }
};
var removeNode = (node) => {
  if (node.nodeType !== 1 /* ELEMENT_NODE */ && node.nodeType !== 11 /* FRAGMENT_NODE */) return;
  const attrs = node.getAttribute($.qs.$ref);
  attrs && unmount(node, attrs.split(","));
};
var addedNode = (node) => {
  const attrs = node.getAttribute($.qs.$ref);
  if (attrs) {
    connect(node, attrs.split(","));
  } else {
    if (isDirective(node.attributes)) {
      context ? context.$morph = node : context = getContext(node);
      walkNode(node, context);
    }
  }
};
var readNode = (newNode) => {
  context ? context.$morph = newNode : context = getContext(newNode);
  walkNode(newNode, context, false);
};
var updateNode = (curNode, newNode, cRef, nRef) => {
  if (cRef) cRef = cRef.split(",");
  if (nRef) nRef = nRef.split(",");
  if (cRef && nRef) {
    unmount(curNode, cRef);
    connect(curNode, nRef);
  } else if (!cRef && nRef) {
    connect(curNode, nRef);
  } else {
    context ? context.$morph = curNode : context = getContext(curNode, newNode);
    if (cRef && !nRef) unmount(curNode, cRef);
    if (isDirective(newNode.attributes)) walkNode(curNode, context);
  }
};

// src/morph/snapshot.ts
var patchComponentSnap = (scope, scopeKey) => onNextTick(() => {
  const snap2 = getSnapDom(scope.snap);
  const elem = snap2.querySelector(`[${$.qs.$ref}="${scope.ref}"]`);
  if (elem) {
    elem.innerHTML = scope.snapshot;
    setSnap(elem.ownerDocument.documentElement.outerHTML, scope.snap);
  } else {
    log(3 /* WARN */, `Component snapshot merge failed: ${scope.instanceOf} (${scopeKey})`);
  }
});
var morphHead = (method, newNode) => {
  const { page, dom: dom2 } = get($.page.key);
  const operation = method.charCodeAt(0) === 114 ? "removed" : "appended";
  if (dom2.head.contains(newNode)) {
    dom2.head[method](newNode);
    $.snaps[page.snap] = dom2.documentElement.outerHTML;
    log(1 /* VERBOSE */, `Snapshot record was updated. Node ${operation} from <head>`, newNode);
  } else {
    log(3 /* WARN */, "Node does not exist in the snapshot record, no mutation applied", newNode);
  }
};

// src/observe/components.ts
var hargs = () => o(o($.page));
var teardown = () => {
  for (const ref in $.components.$reference) {
    delete $.components.$reference[ref];
  }
  for (const instance of $.components.$instances.values()) {
    for (const key in instance.scope.events) {
      removeEvent(instance, instance.scope.events[key]);
    }
  }
  $.components.$instances.clear();
  $.components.$mounted.clear();
  log(2 /* INFO */, "Component instances were disconnected");
};
var mount = (promises) => {
  const params = hargs();
  const promise = [];
  for (const [ref, firsthook, finalhook] of promises) {
    const instance = $.components.$instances.get(ref);
    const MOUNT = instance.scope.status === 4 /* UNMOUNT */ ? "unmount" : "onmount";
    if (!instance.scope.snap) instance.scope.snap = $.page.snap;
    const seq = async () => {
      try {
        if (finalhook && instance.scope.status === 1 /* CONNNECT */) {
          await instance[firsthook](params);
          await instance[finalhook](params);
        } else {
          if (instance.scope.status === 4 /* UNMOUNT */) {
            instance.scope.define.merge && patchComponentSnap(instance.scope, ref);
          } else {
            await instance[firsthook](params);
          }
        }
        instance.scope.status = instance.scope.status === 4 /* UNMOUNT */ ? 5 /* UNMOUNTED */ : 3 /* MOUNTED */;
        if (instance.scope.hooks.connect === 2 /* DEFINED */) {
          instance.scope.hooks.connect = 3 /* EXECUTED */;
        }
      } catch (error2) {
        log(3 /* WARN */, `Component to failed to ${MOUNT}: ${instance.scope.instanceOf} (${ref})`, error2);
        return Promise.reject(ref);
      }
    };
    promise.push(promiseResolve().then(seq));
  }
  return Promise.allSettled(promise);
};
var hook = () => {
  const { $mounted, $instances, $registry } = $.components;
  if ($mounted.size === 0 && $instances.size === 0 && $registry.size > 0) return getComponents();
  const promises = [];
  for (const ref of $mounted) {
    if (!$instances.has(ref)) continue;
    const instance = $instances.get(ref);
    if (instance.scope.status !== 3 /* MOUNTED */ && instance.scope.status !== 5 /* UNMOUNTED */) {
      const unmount2 = instance.scope.status === 4 /* UNMOUNT */;
      const trigger = unmount2 ? "unmount" : "onmount";
      if (trigger in instance) {
        trigger === "onmount" && "connect" in instance && instance.scope.hooks.connect === 2 /* DEFINED */ ? promises.push([ref, "connect", trigger]) : promises.push([ref, trigger]);
      } else if (unmount2) {
        instance.scope.define.merge && patchComponentSnap(instance.scope, ref);
        instance.scope.status = 5 /* UNMOUNTED */;
      }
    }
  }
  promises.length > 0 && mount(promises).catch((ref) => {
    const instance = $instances.get(ref);
    instance.scope.status = 5 /* UNMOUNTED */;
    $mounted.delete(ref);
  });
};
var connect2 = () => {
  if ($.components.$registry.size === 0 || $.observe.components) return;
  if ($.page.type === 0 /* INITIAL */) {
    getComponents();
  } else {
    if (context) {
      setInstances(context).then(hook).then(resetContext);
    } else {
      hook();
    }
  }
  $.observe.components = true;
};
var disconnect = () => {
  if (!$.observe.components) return;
  hook();
  $.observe.components = false;
};

// src/components/snapshot.ts
var snap = ((cache) => {
  let record = m();
  const attr = (dom2, refs) => dom2.setAttribute($.qs.$ref, dom2.hasAttribute($.qs.$ref) ? `${dom2.getAttribute($.qs.$ref)},${refs.shift()}` : refs.shift());
  const set2 = (element2) => {
    cache.push([element2, m()]);
    record = cache[cache.length - 1][1];
    return element2;
  };
  const add = (selector2, ref, incremental = false) => record.has(selector2) ? record.get(selector2).push(ref) : record.set(selector2, [ref]);
  const sync = (snapshot, key) => enqueue(() => {
    while (cache.length > 0) {
      const [dom2, marks] = cache.shift();
      for (const [selector2, refs] of marks) {
        dom2.matches(selector2) && attr(dom2, refs);
        dom2.querySelectorAll(selector2).forEach((child) => attr(child, refs));
      }
      marks.clear();
    }
    setSnap(snapshot.documentElement.outerHTML, key);
    log(1 /* VERBOSE */, `Snapshot ${$.page.key} updated for: ${$.page.snap}`);
  });
  return { set: set2, add, sync };
})([]);

// src/components/instance.ts
var setLifecyles = (scope, instance) => {
  scope.hooks = o();
  forEach((hook2) => {
    scope.hooks[hook2] = hook2 in instance ? 2 /* DEFINED */ : 1 /* UNDEFINED */;
  }, [
    "connect",
    "onmount",
    "unmount",
    "onmedia"
  ]);
};
var setTriggers = (hooks, isMorph, isMount) => (instance, scope) => {
  if (isMorph === false || isMount && scope.status === 2 /* MOUNT */) {
    $.components.$mounted.add(scope.key);
    $.components.$instances.set(scope.key, instance);
    log(1 /* VERBOSE */, `Component "${scope.instanceOf}" connected: ${scope.key}`, "#2cc9ee" /* CYAN */);
    let promise = -1;
    if (scope.hooks.connect === 2 /* DEFINED */) {
      promise = hooks.push([scope.key, "connect"]) - 1;
      scope.status = 1 /* CONNNECT */;
    }
    if (scope.hooks.onmount === 2 /* DEFINED */) {
      promise = (promise > -1 ? hooks[promise].push("onmount") : hooks.push([scope.key, "onmount"])) - 1;
    }
    if (promise < 0) {
      scope.status = 3 /* MOUNTED */;
    }
  }
};
var setEvents = (scope, instance, isMorph) => {
  for (const key in scope.events) {
    if (isMorph !== null && scope.status === 3 /* MOUNTED */) {
      $.components.$reference[key] = scope.key;
      instance.scope.events[key] = scope.events[key];
    }
    addEvent(instance, scope.events[key]);
  }
};
var setNodes = (nodes, instance) => {
  const { scope } = instance;
  for (const key in nodes) {
    const node = nodes[key];
    const hasNode = `has${upcase(key)}`;
    if (hasNode in instance) {
      key in scope && ++scope[key].live;
      return;
    }
    Object.defineProperty(instance, hasNode, { get: () => node.live > 0 });
    const getNode = () => element(node.selector, node.isChild ? instance.dom : b());
    const getNodes = () => elements(node.selector, node.isChild ? instance.dom : b());
    if (scope.define.sugar) {
      Object.defineProperties(node.dom, { node: { get: getNode }, nodes: { get: getNodes } });
      instance[key] = sugarProxy(node);
    } else {
      Object.defineProperties(instance, {
        [`${key}Node`]: { get: getNode },
        [`${key}Nodes`]: { get: getNodes }
      });
    }
  }
};
var defineInstances = (promises, mounted2, isMorph) => {
  const isMount = isMorph || $.page.type === 4 /* REVERSE */;
  const setHook = setTriggers(promises, isMorph, isMount);
  return (scope, instance) => {
    if (instance) {
      setNodes(scope.nodes, instance);
      setEvents(scope, instance, isMorph);
    } else {
      scope.define = o();
      const Register = $.components.$registry.get(scope.instanceOf);
      Component.scopes.set(scope.key, defineGetter(scope, "define", Register.define));
      const Instance = new Register(scope.key);
      setLifecyles(scope, Instance);
      setNodes(scope.nodes, Instance);
      setEvents(scope, Instance, isMorph);
      setHook(Instance, scope);
    }
  };
};
var setInstances = (context2, snapshot) => {
  const { $scopes, $aliases, $morph } = context2;
  const promises = [];
  const mounted2 = mounted();
  const define = defineInstances(promises, mounted2, $morph !== null);
  for (const instanceOf in $scopes) {
    if (!$.components.$registry.has(instanceOf) && !mounted2.has(instanceOf)) {
      log(3 /* WARN */, `Component does not exist in registry: ${instanceOf}`, $scopes[instanceOf]);
      continue;
    }
    for (const scope of $scopes[instanceOf]) {
      if (scope.instanceOf == null) {
        if (instanceOf in $aliases) {
          scope.instanceOf = $aliases[instanceOf];
        } else {
          continue;
        }
      }
      if (mounted2.has(instanceOf)) {
        for (const instance of mounted2.get(instanceOf)) {
          if (instance.scope.instanceOf === instanceOf) define(scope, instance);
        }
      } else {
        define(scope);
      }
    }
  }
  onNextTick(() => [mounted2.clear()]);
  $.page.type === 0 /* INITIAL */ && snap.sync(snapshot, $.page.snap);
  return promises.length > 0 ? mount(promises) : Promise.resolve();
};

// src/components/context.ts
var walkNode = (node, context2, strict = true) => {
  if (strict && !isDirective(node.attributes)) return;
  node.hasAttribute($.qs.$component) ? setComponent(node, node.getAttribute($.qs.$component), context2) : setAttrs(node, context2, null, null);
};
var getComponentValues = (input2, cb) => {
  const names = input2.trim().replace(/\s+/, " ").split(/[|, ]/);
  for (let i = 0, n = 0, s2 = names.length; i < s2; i++) {
    if (names[i] === "") continue;
    if ((n = i + 2) < s2 && names[i + 1] === "as") {
      cb(camelCase(names[i]), camelCase(names[n]));
      i = n;
    } else {
      cb(camelCase(names[i]), null);
    }
  }
};
var getEventParams = (attributes, event) => {
  const s2 = attributes.length;
  let i = 0;
  while (++i < s2) {
    const { name, value } = attributes[i];
    if (!$.qs.$param.test(name) || name.startsWith($.qs.$data) || !value) continue;
    const prop = name.slice($.config.schema.length).split(":").pop();
    if (event.attrs === null) event.attrs = o();
    if (!(prop in event.attrs)) event.attrs[prop] = getAttrValueType(value);
  }
};
var isDirective = (attrs) => {
  if (typeof attrs === "string") {
    return attrs.indexOf("@") > -1 || attrs === $.qs.$component || attrs === $.qs.$node || attrs === $.qs.$bind;
  }
  for (let i = attrs.length - 1; i >= 0; i--) if (isDirective(attrs[i].name)) return true;
  return false;
};
var isChild = (scope, node) => scope.status === 2 /* MOUNT */ || scope.status === 3 /* MOUNTED */ ? scope.dom ? scope.dom.contains(node) : false : false;
var getAttrValueNotation = (input2) => {
  return equalizeWS(input2.replace(/\s \./g, ".")).replace(/\s+/g, " ").trim().split(/[ ,]/);
};
var getAttrValueType = (input2) => {
  if (isNumeric.test(input2)) return input2 === "NaN" ? NaN : +input2;
  if (isBoolean.test(input2)) return input2 === "true";
  const code = input2.charCodeAt(0);
  return code === 123 /* LCB */ || code === 91 /* LSB */ ? attrJSON(input2) : input2;
};
var getContext = ($morph = null, $snapshot = null) => {
  return o({
    $aliases: o(),
    $scopes: o(),
    $element: null,
    $snaps: $morph ? o() : null,
    $morph,
    $snapshot
  });
};
var getSelector = (node, attrName, attrValue, contains2) => {
  attrValue || (attrValue = node.getAttribute(attrName));
  return `${node.nodeName.toLowerCase()}[${attrName}${contains2 ? "*=" : "="}"${attrValue}"]`;
};
var getScope = (id, { $scopes, $aliases }) => id in $aliases ? last($scopes[$aliases[id]]) : id in $scopes ? last($scopes[id]) : ($scopes[id] = [setScope([id])])[0];
var defineDomRef = (node, instance, ref, selector2) => {
  $.components.$reference[ref] = instance;
  const value = node.getAttribute($.qs.$ref);
  node.setAttribute($.qs.$ref, value ? `${value},${ref}` : ref);
  selector2 && snap.add(selector2, ref);
  return ref;
};
var setScope = ([instanceOf, aliasOf = null], dom2, context2) => {
  const scope = o();
  scope.key = uuid();
  scope.ref = `c.${scope.key}`;
  scope.status = 5 /* UNMOUNTED */;
  scope.state = o();
  scope.nodes = o();
  scope.binds = o();
  scope.events = o();
  if (dom2) {
    scope.snap = null;
    scope.status = 2 /* MOUNT */;
    scope.inFragment = contains(dom2);
    scope.alias = aliasOf || null;
    scope.dom = dom2;
    defineDomRef(dom2, scope.key, scope.ref, getSelector(dom2, $.qs.$component));
  }
  if ($.components.$registry.has(instanceOf)) {
    scope.instanceOf = instanceOf;
    if (scope.alias) {
      if (!$.components.$registry.has(scope.alias)) {
        if (scope.alias in context2.$scopes) {
          for (const { events, nodes, binds } of context2.$scopes[scope.alias]) {
            if ("events" in scope) {
              for (const e in events) {
                scope.events[e] = events[e];
                $.components.$reference[e] = scope.key;
              }
            }
            if ("nodes" in scope) {
              for (const n in nodes) {
                scope.nodes[n] = nodes[n];
                $.components.$reference[n] = scope.key;
              }
            }
            if ("binds" in scope) {
              for (const b2 in binds) {
                scope.binds[b2] = binds[b2];
                $.components.$reference[b2] = scope.key;
              }
            }
          }
          delete context2.$scopes[scope.alias];
        } else {
          context2.$aliases[scope.alias] = instanceOf;
        }
      } else {
        log(5 /* ERROR */, [
          `The component alias ("${scope.alias}") matches a component identifer in the registry.`,
          "An alias reference must be unique and cannot match component names."
        ]);
      }
    } else {
      scope.alias = null;
    }
  } else {
    instanceOf ? scope.alias = instanceOf : scope.instanceOf = null;
    if (scope.status === 2 /* MOUNT */) {
      context2.$aliases[scope.alias] = null;
    }
  }
  return scope;
};
var setEvent = (node, name, valueRef, context2) => {
  const eventName = name.slice($.config.schema.length);
  const isWindow = eventName.startsWith("window:");
  const hasOptions = valueRef.indexOf("{");
  const values = valueRef.trim().split(hasOptions > -1 ? new RegExp("(?<=[$_\\w}])\\s+(?=[$_\\w])") : /\s+/);
  for (let i = 0, s2 = values.length; i < s2; i++) {
    const value = values[i];
    const listener = new AbortController();
    const ev = o();
    ev.key = `e.${uuid()}`;
    ev.isWindow = isWindow;
    ev.eventName = isWindow ? eventName.slice(7) : eventName;
    ev.attached = false;
    ev.selector = getSelector(node, escSelector(name), value, true);
    ev.attrs = null;
    ev.options = { signal: listener.signal };
    let attrVal = value;
    if (hasOptions > -1) {
      const args = value.slice(hasOptions, value.lastIndexOf("}", hasOptions)).match(/(passive|once|capture)/g);
      if (args !== null) {
        ev.options.once = args.indexOf("once") > -1;
        ev.options.passive = args.indexOf("passive") > -1;
        ev.options.capture = args.indexOf("capture") > -1;
      }
      attrVal = value.slice(0, hasOptions);
    }
    const [instanceOf, method] = getAttrValueNotation(attrVal)[0].split(".");
    const scope = getScope(instanceOf, context2);
    ev.listener = listener;
    ev.method = method.trim();
    ev.isChild = isChild(scope, node);
    defineGetter(ev, "dom", node, true);
    defineDomRef(node, scope.key, ev.key, ev.selector);
    scope.events[ev.key] = ev;
  }
};
var setNodes2 = (node, value, context2) => {
  const nodes = getAttrValueNotation(value);
  for (const nodeValue of nodes) {
    const [instanceOf, name] = nodeValue.split(".");
    const scope = getScope(instanceOf, context2);
    if (name in scope.nodes) {
      scope.nodes[name].live++;
      scope.nodes[name].isChild = isChild(scope, node);
    } else {
      scope.nodes[name] = o({
        name,
        selector: `[${$.qs.$node}*="${value}"]`,
        dom: o(),
        key: `c.${scope.key}`,
        live: 1,
        isChild: isChild(scope, node)
      });
    }
  }
};
var setBinds = (node, value, context2) => {
  var _a;
  for (const bindValue of getAttrValueNotation(value)) {
    const [instanceOf, stateKey] = bindValue.split(".");
    const scope = getScope(instanceOf, context2);
    const selector2 = `[${$.qs.$bind}="${value}"]`;
    const key = defineDomRef(node, scope.key, `b.${uuid()}`, `${node.nodeName.toLowerCase()}${selector2}`);
    (_a = scope.binds)[stateKey] || (_a[stateKey] = o());
    scope.binds[stateKey][key] = o({
      key,
      stateKey,
      selector: selector2,
      value: node.innerText,
      live: true,
      stateAttr: `${$.config.schema}${instanceOf}:${stateKey}`,
      isChild: isChild(scope, node)
    });
    defineGetter(scope.binds[stateKey][key], "dom", node);
  }
};
var setAttrs = (node, context2, instanceOf, alias) => {
  if (instanceOf === null && alias === null) {
    context2.$element = uuid();
  }
  for (let n = node.attributes.length - 1; n >= 0; n--) {
    const { name, value } = node.attributes[n];
    if (instanceOf) {
      let schema = `${$.config.schema}${instanceOf}:`;
      if (alias && !name.startsWith(schema)) schema = `${$.config.schema}${alias}:`;
      if (name.startsWith(schema)) {
        getScope(instanceOf, context2).state[camelCase(name.slice(schema.length))] = value;
      }
    }
    if (name.indexOf("@") > -1) {
      setEvent(node, name, value, context2);
    } else if (name === $.qs.$bind) {
      setBinds(node, value, context2);
    } else if (name === $.qs.$node) {
      setNodes2(node, value, context2);
    }
  }
};
var setComponent = (node, value, context2) => {
  getComponentValues(value, (instanceOf, aliasOf) => {
    if (!$.components.$registry.has(instanceOf)) {
      log(3 /* WARN */, `Component does not exist in registry: ${instanceOf}`);
    } else {
      let scope;
      if (instanceOf in context2.$scopes) {
        scope = last(context2.$scopes[instanceOf]);
        if (scope.status === 5 /* UNMOUNTED */) {
          scope.status = 2 /* MOUNT */;
          scope.inFragment = contains(node);
          scope.dom = node;
          defineDomRef(node, scope.key, scope.ref, getSelector(node, $.qs.$component));
        } else {
          context2.$scopes[instanceOf].push(setScope([instanceOf, aliasOf], node, context2));
        }
      } else {
        context2.$scopes[instanceOf] = [setScope([instanceOf, aliasOf], node, context2)];
      }
      scope = last(context2.$scopes[instanceOf]);
      if (aliasOf) {
        context2.$aliases[aliasOf] = instanceOf;
      } else if (scope.alias && !(scope.alias in context2.$aliases)) {
        if ($.components.$registry.has(scope.alias)) {
          log(3 /* WARN */, `Alias must not match a component identifier: ${scope.instanceOf} as ${scope.alias}`);
          scope.alias = null;
        } else {
          context2.$aliases[scope.alias] = instanceOf;
        }
      }
      setAttrs(node, context2, instanceOf, scope.alias);
    }
  });
};
var getComponents = (nodes) => {
  const context2 = getContext();
  if (!nodes) {
    const snapshot = snap.set($.snapDom.body);
    walkElements(b(), (node) => walkNode(node, context2));
    isEmpty(context2.$scopes) || setInstances(context2, snapshot.ownerDocument);
  } else if (nodes instanceof Set) {
    nodes.forEach((node) => walkNode(node, context2));
    nodes.clear();
    return context2;
  } else {
    walkNode(nodes, context2);
    return context2;
  }
};

// src/observe/fragment.ts
var contains = (node) => {
  for (const [id, fragment] of $.fragments) {
    if (id === node.id) return true;
    if (fragment.contains(node)) return true;
  }
  return false;
};
var connect3 = () => {
  $.fragments.clear();
  let selector2;
  let directive;
  let aliases;
  const dom2 = b();
  if ($.page.target.length > 0) {
    console.log($.page);
    directive = $.qs.$target;
    selector2 = $.page.target.join();
    aliases = nodeSet(dom2.querySelectorAll(`[id][${$.qs.$component}]`));
  } else {
    directive = $.qs.$fragment;
    selector2 = $.config.fragments.length === 1 && $.config.fragments[0] === "body" ? $.qs.$fragments : `${$.config.fragments.join()},${$.qs.$fragments}`;
  }
  forNode(selector2, (node) => {
    if (aliases) {
      for (const alias of aliases) {
        if (!node.contains(alias)) continue;
        aliases.delete(alias);
        break;
      }
    }
    if (node.hasAttribute(directive)) {
      const attr = node.getAttribute(directive).trim();
      node.id !== nil && (attr === "true" || attr === nil) ? $.fragments.set(`#${node.id}`, node) : $.fragments.set(getSelector(node, directive, attr), node);
    } else {
      $.fragments.set(`#${node.id}`, node);
    }
  });
  if (aliases && aliases.size > 0) {
    for (const child of aliases) {
      $.fragments.set(`#${child.id}`, child);
      $.page.target.push(`#${child.id}`);
      mark.add(child.id);
    }
    aliases.clear();
  }
  patch("fragments", [...$.fragments.keys()]);
};
var setFragmentElements = (page) => {
  if (page.type === 6 /* VISIT */ || page.selector === "body" || page.selector === null) return;
  onNextTick(() => {
    const snapDom = getSnapDom(page.snap);
    const targets2 = snapDom.body.querySelectorAll($.qs.$targets);
    const domNode = b().querySelectorAll($.qs.$targets);
    forNode(targets2, (node, index) => {
      if (contains(node)) {
        log(3 /* WARN */, "The fragment or target is a decedent of an element which morphs", node);
      } else {
        if (!node.hasAttribute("id")) {
          node.setAttribute("id", `t.${uuid()}`);
          domNode && domNode[index].setAttribute("id", `t.${uuid()}`);
        } else if (node.id.startsWith("t.")) {
          return;
        }
        page.target.push(node.id);
      }
    });
    setSnap(snapDom.documentElement.outerHTML, page.snap);
  });
};

// src/app/queries.ts
var create = (page) => {
  const has3 = hasProps(page);
  page.ts = ts();
  page.target = targets(page);
  page.selector = selector(page.target);
  if ($.config.cache) {
    has3("cache") || (page.cache = $.config.cache);
    page.snap || (page.snap = uid());
  }
  if ($.config.hover !== false && page.type === 10 /* HOVER */) {
    page.threshold || (page.threshold = $.config.hover.threshold);
  }
  if ($.config.proximity !== false && page.type === 12 /* PROXIMITY */) {
    page.proximity || (page.proximity = $.config.proximity.distance);
    page.threshold || (page.threshold = $.config.proximity.threshold);
  }
  if ($.config.progress) {
    page.progress || (page.progress = $.config.progress.threshold);
  }
  if (!has3("history")) page.history = true;
  page.scrollY || (page.scrollY = 0);
  page.scrollX || (page.scrollX = 0);
  page.fragments || (page.fragments = $.config.fragments);
  page.visits || (page.visits = 0);
  page.location || (page.location = getLocation(page.key));
  $.pages[page.key] = page;
  return $.pages[page.key];
};
var newPage = (page) => {
  const state = o(__spreadProps(__spreadValues({}, page), {
    target: [],
    selector: null,
    cache: $.config.cache,
    history: true,
    scrollX: 0,
    scrollY: 0,
    fragments: $.config.fragments
  }));
  if ($.config.hover) {
    state.threshold = $.config.hover.threshold;
  }
  if ($.config.proximity) {
    state.proximity = $.config.proximity.distance;
    state.threshold = $.config.proximity.threshold;
  }
  if ($.config.progress) {
    state.progress = $.config.progress.threshold;
  }
  return state;
};
var patch = (prop, value, key = $.history.key) => {
  if (key in $.pages && prop in $.pages[key]) {
    if (prop === "location") {
      $.pages[key][prop] = Object.assign($.pages[prop][key], value);
    } else if (prop === "target") {
      $.pages[key].target = targets(value);
      $.pages[key].selector = selector($.pages[key].target);
    } else {
      $.pages[key][prop] = value;
    }
  }
};
var set = (page, snapshot) => {
  const event = emit("before:cache", page, snapshot);
  const dom2 = typeof event === "string" ? event : snapshot;
  if (page.type > 5 /* POPSTATE */) {
    if (page.type > 9 /* RELOAD */) {
      page.type = 1 /* PREFETCH */;
    }
  }
  page.title = getTitle(snapshot);
  if (!$.config.cache || event === false) return page;
  if (page.type !== 0 /* INITIAL */ && !hasProp(page, "snap")) return update(page, dom2);
  $.pages[page.key] = page;
  $.snaps[page.snap] = dom2;
  setFragmentElements(page);
  emit("after:cache", page);
  return page;
};
var update = (page, snapshot = null) => {
  const state = page.key in $.pages ? $.pages[page.key] : create(page);
  if (snapshot) {
    $.snaps[state.snap] = snapshot;
    page.title = getTitle(snapshot);
  }
  return Object.assign(state, page);
};
var setSnap = (snapshot, key) => {
  const snap2 = key = typeof key === "number" ? key : null;
  if (snap2) {
    $.snaps[snap2] = snapshot;
  } else {
    log(3 /* WARN */, "Snapshot record does not exist, update failed");
  }
};
var get = (key) => {
  if (!key) {
    if ($.history === null) {
      log(3 /* WARN */, "Missing history state reference, page cannot be returned");
      return;
    }
    key = $.history.key;
  }
  if (key in $.pages) {
    return defineGetterProps(o(), [
      ["page", () => $.pages[key]],
      ["dom", () => parse($.snaps[$.pages[key].snap])]
    ]);
  }
  log(5 /* ERROR */, `No record exists: ${key}`);
};
var getSnapDom = (key) => {
  const uuid3 = typeof key === "string" ? key.charCodeAt(0) === 47 /* FWD */ ? $.pages[key].snap : key : $.page.snap;
  return parse($.snaps[uuid3]);
};
var mounted = () => {
  const live2 = m();
  const { $instances, $mounted } = $.components;
  for (const key of $mounted) {
    if (!$instances.has(key)) continue;
    const instance = $instances.get(key);
    const { scope } = instance;
    if (scope.status === 2 /* MOUNT */) {
      if (scope.alias !== null) {
        live2.has(scope.alias) ? live2.get(scope.alias).push(instance) : live2.set(scope.alias, [instance]);
      }
      live2.has(scope.instanceOf) ? live2.get(scope.instanceOf).push(instance) : live2.set(scope.instanceOf, [instance]);
    }
  }
  return live2;
};
var getPage = (key) => {
  if (!key) {
    if ($.history === null) {
      log(3 /* WARN */, "Missing history state reference, page cannot be returned");
      return;
    }
    key = $.history.key;
  }
  if (hasProp($.pages, key)) return $.pages[key];
  log(5 /* ERROR */, `No page record exists for: ${key}`);
};
var has = (key) => hasProp($.pages, key) && hasProp($.pages[key], "snap") && hasProp($.snaps, $.pages[key].snap) && typeof $.snaps[$.pages[key].snap] === "string";
var clear = (key) => {
  if (!key) {
    empty($.snaps);
    empty($.pages);
  } else if (typeof key === "string") {
    delete $.snaps[$.pages[key].snap];
    delete $.pages[key];
  } else if (Array.isArray(key)) {
    forEach((url) => {
      delete $.snaps[$.pages[url].snap];
      delete $.pages[url];
    }, key);
  }
};

// src/app/location.ts
var hostname = origin.replace(/(?:https?:)?(?:\/\/(?:www\.)?|(?:www\.))/, nil);
var getAttributes = (element2, page) => {
  const state = page ? newPage(page) : o();
  const attrs = element2.getAttributeNames();
  for (let i = 0, s2 = attrs.length; i < s2; i++) {
    const nodeName = attrs[i];
    if (nodeName.startsWith($.qs.$data)) {
      if (!hasProp(state, "data")) state.data = o();
      const name = camelCase(nodeName.slice($.qs.$data.length));
      const value = element2.getAttribute(nodeName).trim();
      if (isNumeric.test(value)) {
        state.data[name] = value === "NaN" ? NaN : +value;
      } else if (isBoolean.test(value)) {
        state.data[name] = value === "true";
      } else if (value.charCodeAt(0) === 123 || value.charCodeAt(0) === 91) {
        state.data[name] = attrJSON(nodeName, value);
      } else {
        state.data[name] = value;
      }
    } else {
      if (!$.qs.$attrs.test(nodeName)) continue;
      const nodeValue = element2.getAttribute(nodeName).trim();
      if (nodeName === "href") {
        state.rev = getKey(location);
        if (!page) {
          state.location = getLocation(nodeValue);
          state.key = getKey(state.location);
        }
      } else {
        const name = nodeName.slice(nodeName.lastIndexOf("-") + 1);
        const value = nodeValue.replace(Whitespace, nil).trim();
        if (name === "target") {
          state[name] = value === "true" ? [] : value !== nil ? splitAttrArrayValue(value) : [];
          state.selector = selector(state[name]);
        } else if (isArray.test(value)) {
          const match = value.match(/\[?[^,'"[\]()\s]+\]?/g);
          state[name] = isPender.test(name) ? match.reduce(chunk(2), []) : match;
        } else if (name === "position") {
          if (inPosition.test(value)) {
            const XY = value.match(inPosition);
            state[`scroll${XY[0].toUpperCase()}`] = +XY[1];
            if (XY.length === 4) {
              state[`scroll${XY[2].toUpperCase()}`] = +XY[3];
            }
          } else {
            log(3 /* WARN */, `Invalid attribute value on <${nodeName}>, expected: y:number or x:number`, element2);
          }
        } else if (name === "scroll") {
          if (isNumber.test(value)) {
            state.scrollY = +value;
          } else {
            log(3 /* WARN */, `Invalid attribute value on <${nodeName}>, expected: number`, element2);
          }
        } else if (isBoolean.test(value) && !isPrefetch.test(nodeName)) {
          state[name] = value === "true";
        } else if (isNumeric.test(value)) {
          state[name] = +value;
        } else {
          if (name === "history" && value !== "push" && value !== "replace") {
            log(5 /* ERROR */, `Invalid attribute value on <${nodeName}>, expected: false, push or replace`, element2);
          }
          state[name] = value;
        }
      }
    }
  }
  return state;
};
var parsePath = (path) => {
  const state = o();
  const size2 = path.length;
  if (size2 === 1 && path.charCodeAt(0) === 47 /* FWD */) {
    state.pathname = path;
    state.hash = nil;
    state.search = nil;
    return state;
  }
  const hash = path.indexOf("#");
  if (hash >= 0) {
    state.hash = path.slice(hash);
    path = path.slice(0, hash);
  } else {
    state.hash = nil;
  }
  const params = path.indexOf("?");
  if (params >= 0) {
    state.search = path.slice(params);
    path = path.slice(0, params);
  } else {
    state.search = nil;
  }
  state.pathname = path;
  return state;
};
var getPath = (url, protocol) => {
  const path = url.indexOf("/", protocol);
  if (path > protocol) {
    const hash = url.indexOf("#", path);
    return hash < 0 ? url.slice(path) : url.slice(path, hash);
  }
  const param = url.indexOf("?", protocol);
  if (param > protocol) {
    const hash = url.indexOf("#", param);
    return hash < 0 ? url.slice(param) : url.slice(param, hash);
  }
  return url.length - protocol === hostname.length ? "/" : null;
};
var parseOrigin = (url) => {
  const path = url.startsWith("www.") ? url.slice(4) : url;
  const name = path.indexOf("/");
  if (name >= 0) {
    const key = path.slice(name);
    if (path.slice(0, name) === hostname) return key.length > 0 ? parsePath(key) : parsePath("/");
  } else {
    const char = path.search(/[?#]/);
    if (char >= 0) {
      if (path.slice(0, char) === hostname) return parsePath("/" + path.slice(char));
    } else {
      if (path === hostname) return parsePath("/");
    }
  }
  return null;
};
var hasOrigin = (url) => {
  if (url.startsWith("http:") || url.startsWith("https:")) return 1 /* HTTP */;
  if (url.startsWith("//")) return 2 /* SLASH */;
  if (url.startsWith("www.")) return 3 /* WWW */;
  return 0 /* NONE */;
};
var validKey = (url) => {
  if (typeof url !== "string" || url.length === 0) return false;
  if (url.charCodeAt(0) === 47 /* FWD */) {
    if (url.charCodeAt(1) !== 47 /* FWD */) return true;
    if (url.startsWith("www.", 2)) return url.startsWith(hostname, 6);
    return url.startsWith(hostname, 2);
  }
  if (url.charCodeAt(0) === 63 /* QWS */) return true;
  if (url.startsWith("www.")) return url.startsWith(hostname, 4);
  if (url.startsWith("http")) {
    const start = url.indexOf("/", 4) + 2;
    return url.startsWith("www.", start) ? url.startsWith(hostname, start + 4) : url.startsWith(hostname, start);
  }
  return false;
};
var parseKey = (url) => {
  if (url.charCodeAt(0) === 47 /* FWD */) {
    return url.charCodeAt(1) !== 47 /* FWD */ ? parsePath(url) : parseOrigin(url.slice(2));
  }
  if (url.charCodeAt(0) === 63 /* QWS */) {
    return parsePath(location.pathname + url);
  }
  if (url.startsWith("https:") || url.startsWith("http:")) {
    return parseOrigin(url.slice(url.indexOf("/", 4) + 2));
  }
  if (url.startsWith("www.")) return parseOrigin(url);
  return null;
};
var getKey = (link) => {
  if (typeof link === "object") return link.pathname + link.search;
  if (link === nil || link === "/") return "/";
  const has3 = hasOrigin(link);
  if (has3 === 1 /* HTTP */) {
    const protocol = link.charCodeAt(4) === 115 /* COL */ ? 8 : 7;
    const www = link.startsWith("www.", protocol) ? protocol + 4 : protocol;
    return link.startsWith(hostname, www) ? getPath(link, www) : null;
  }
  if (has3 === 2 /* SLASH */) {
    const www = link.startsWith("www.", 2) ? 6 : 2;
    return link.startsWith(hostname, www) ? getPath(link, www) : null;
  }
  if (has3 === 3 /* WWW */) {
    return link.startsWith(hostname, 4) ? getPath(link, 4) : null;
  }
  return link.startsWith(hostname, 0) ? getPath(link, 0) : link.charCodeAt(0) === 47 /* FWD */ ? link : null;
};
var fallback = ({
  pathname,
  search,
  hash
} = location) => o({
  hostname,
  origin,
  pathname,
  hash,
  search
});
var getLocation = (path) => {
  if (path === nil) return fallback();
  const state = parseKey(path);
  if (state === null) {
    log(3 /* WARN */, `Invalid pathname: ${path}`);
  }
  state.origin = origin;
  state.hostname = hostname;
  return state;
};
var getRoute = (link, type = 6 /* VISIT */) => {
  if (link instanceof Element) {
    const state2 = getAttributes(link);
    state2.type = type || 6 /* VISIT */;
    return state2;
  }
  const state = o();
  if (link === 0 /* INITIAL */) {
    state.location = fallback();
    state.key = state.rev = getKey(state.location);
    state.type = link;
    state.visits = 1;
    $.index = state.key;
  } else if (type === 7 /* HYDRATE */) {
    state.location = getLocation(link);
    state.key = state.rev = getKey(state.location);
    state.type = type;
  } else if (type === 4 /* REVERSE */) {
    state.location = getLocation(link);
    state.key = state.rev = getKey(state.location);
    state.type = type;
  } else {
    state.rev = location.pathname + location.search;
    state.location = getLocation(typeof link === "string" ? link : state.rev);
    state.key = getKey(state.location);
    state.type = type;
  }
  return state;
};

// src/app/fetch.ts
var http = (key, {
  method = "GET",
  body = null,
  headers = [["spx-http", "href"]],
  type = "text"
} = {}) => new Promise((resolve, reject) => {
  const xhr = new XHR();
  xhr.key = key;
  xhr.responseType = type;
  xhr.open(method, key, true);
  for (const [hk, hv] of headers) xhr.setRequestHeader(hk, hv);
  xhr.onloadstart = function() {
    XHR.$request.set(this.key, xhr);
  };
  xhr.onload = function() {
    resolve(this.response);
  };
  xhr.onerror = function() {
    reject(this.statusText);
  };
  xhr.onabort = function() {
    delete XHR.$timeout[this.key];
    XHR.$transit.delete(this.key);
    XHR.$request.delete(this.key);
  };
  xhr.onloadend = function(event) {
    XHR.$request.delete(this.key);
    $.memory.bytes = $.memory.bytes + event.loaded;
    $.memory.visits = $.memory.visits + 1;
  };
  xhr.send(body);
});
var cleanup = (key) => {
  if (!(key in XHR.$timeout)) return true;
  clearTimeout(XHR.$timeout[key]);
  return delete XHR.$timeout[key];
};
var throttle = (key, callback, delay) => {
  if (key in XHR.$timeout) return;
  if (!has(key)) XHR.$timeout[key] = setTimeout(callback, delay);
};
var cancel = (key) => {
  for (const [url, xhr] of XHR.$request) {
    if (key !== url) {
      xhr.abort();
      log(3 /* WARN */, `Pending request aborted: ${url}`);
    }
  }
};
var preload = (state) => {
  if ($.config.preload !== null) {
    if (Array.isArray($.config.preload)) {
      const promises = $.config.preload.filter((path) => {
        const route2 = getRoute(path, 3 /* PRELOAD */);
        return route2.key !== path ? fetch(create(route2)) : false;
      });
      return Promise.allSettled(promises);
    } else if (typeof $.config.preload === "object") {
      if (hasProp($.config.preload, state.key)) {
        const promises = $.config.preload[state.key].map((path) => fetch(
          create(
            getRoute(
              path,
              3 /* PRELOAD */
            )
          )
        ));
        return Promise.allSettled(promises);
      }
    }
  }
};
var reverse = async (state) => {
  if (state.rev === state.key) return;
  const page = create(getRoute(state.rev, 4 /* REVERSE */));
  await onNextTickResolve();
  fetch(page).then((page2) => {
    page2 ? log(2 /* INFO */, `Reverse fetch completed: ${page2.rev}`) : log(3 /* WARN */, `Reverse fetch failed: ${state.rev}`);
  });
};
var wait = async (state) => {
  if (!XHR.$transit.has(state.key)) return state;
  const snapshot = await XHR.$transit.get(state.key);
  XHR.$transit.delete(state.key);
  delete XHR.$timeout[state.key];
  return set(state, snapshot);
};
var fetch = async (state) => {
  if (XHR.$request.has(state.key)) {
    if (state.type !== 7 /* HYDRATE */) {
      if (state.type === 4 /* REVERSE */ && XHR.$request.has(state.rev)) {
        XHR.$request.get(state.rev).abort();
        log(3 /* WARN */, `Request aborted: ${state.rev}`);
      } else {
        log(3 /* WARN */, `Request in transit: ${state.key}`);
      }
      return false;
    }
  }
  if (!emit("fetch", state)) {
    log(3 /* WARN */, `Request cancelled via dispatched event: ${state.key}`);
    return false;
  }
  XHR.$transit.set(state.key, http(state.key));
  return wait(state);
};

// src/morph/attributes.ts
var setBooleanAttribute = (curElement, newElement, name) => {
  if (curElement[name] !== newElement[name]) {
    curElement[name] = newElement[name];
    curElement[name] ? curElement.setAttribute(name, nil) : curElement.removeAttribute(name);
  }
};
var morphAttributes = (curNode, newNode) => {
  if (newNode.nodeType === 11 /* FRAGMENT_NODE */ || curNode.nodeType === 11 /* FRAGMENT_NODE */) return;
  const newNodeAttrs = newNode.attributes;
  const cRef = curNode.getAttribute($.qs.$ref);
  const nRef = newNode.getAttribute($.qs.$ref);
  let attrDirective = false;
  let attrNode;
  let attrName;
  let attrNamespaceURI;
  let attrValue;
  let fromValue;
  for (let n = newNodeAttrs.length - 1; n >= 0; n--) {
    attrNode = newNodeAttrs[n];
    attrName = attrNode.name;
    attrValue = attrNode.value;
    attrNamespaceURI = attrNode.namespaceURI;
    if (attrNamespaceURI) {
      attrName = attrNode.localName || attrName;
      fromValue = curNode.getAttributeNS(attrNamespaceURI, attrName);
      if (fromValue !== attrValue) {
        if (attrNode.prefix === "xmlns") attrName = attrNode.name;
        curNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
      }
    } else {
      fromValue = curNode.getAttribute(attrName);
      if (fromValue !== attrValue) {
        curNode.setAttribute(attrName, attrValue);
        if (!cRef && !nRef && !attrDirective) {
          attrDirective = isDirective(attrName);
        }
      }
    }
  }
  const curNodeAttrs = curNode.attributes;
  for (let o2 = curNodeAttrs.length - 1; o2 >= 0; o2--) {
    if (curNodeAttrs[o2] === void 0) continue;
    attrNode = curNodeAttrs[o2];
    attrName = attrNode.name;
    attrValue = attrNode.value;
    attrNamespaceURI = attrNode.namespaceURI;
    if (attrNamespaceURI) {
      attrName = attrNode.localName || attrName;
      if (!newNode.hasAttributeNS(attrNamespaceURI, attrName)) {
        curNode.removeAttributeNS(attrNamespaceURI, attrName);
      }
    } else {
      if (!newNode.hasAttribute(attrName)) {
        curNode.removeAttribute(attrName);
      }
      if (!attrDirective) {
        attrDirective = isDirective(attrName);
      }
    }
  }
  if (cRef || nRef || attrDirective) {
    updateNode(curNode, newNode, cRef, nRef);
  }
};

// src/morph/forms.ts
var option = (curElement, newElement) => {
  let parentNode = curElement.parentNode;
  if (parentNode) {
    let parentName = parentNode.nodeName.toUpperCase();
    if (parentName === "OPTGROUP") {
      parentNode = parentNode.parentNode;
      parentName = parentNode && parentNode.nodeName.toUpperCase();
    }
    if (parentName === "SELECT" && !parentNode.hasAttribute("multiple")) {
      if (curElement.hasAttribute("selected") && !newElement.selected) {
        curElement.setAttribute("selected", "selected");
        curElement.removeAttribute("selected");
      }
      parentNode.selectedIndex = -1;
    }
  }
  setBooleanAttribute(curElement, newElement, "selected");
};
var input = (curElement, newElement) => {
  setBooleanAttribute(curElement, newElement, "checked");
  setBooleanAttribute(curElement, newElement, "disabled");
  if (curElement.value !== newElement.value) curElement.value = newElement.value;
  if (!newElement.hasAttribute("value")) curElement.removeAttribute("value");
};
var textarea = (curElement, newElement) => {
  const { value } = newElement;
  if (curElement.value !== value) curElement.value = value;
  const { firstChild } = curElement;
  if (firstChild) {
    const { nodeValue } = firstChild;
    if (nodeValue === value || !value && nodeValue === curElement.placeholder) return;
    firstChild.nodeValue = value;
  }
};
var select = (curElement, newElement) => {
  if (!newElement.hasAttribute("multiple")) {
    let i = 0;
    let selectedIndex = -1;
    let curChild = curElement.firstElementChild;
    let optgroup;
    let nodeName;
    while (curChild) {
      nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
      if (nodeName === "OPTGROUP") {
        optgroup = curChild;
        curChild = optgroup.firstElementChild;
      } else {
        if (nodeName === "OPTION") {
          if (curChild.hasAttribute("selected")) {
            selectedIndex = i;
            break;
          }
          i++;
        }
        curChild = curChild.nextElementSibling;
        if (!curChild && optgroup) {
          curChild = optgroup.nextElementSibling;
          optgroup = null;
        }
      }
    }
    curElement.selectedIndex = selectedIndex;
  }
};

// src/morph/morph.ts
var createElementNS = (nodeName, namespaceURI) => !namespaceURI || namespaceURI === "http://www.w3.org/1999/xhtml" ? document.createElement(nodeName) : document.createElementNS(namespaceURI, nodeName);
var matchName = (curNodeName, newNodeName) => {
  if (curNodeName === newNodeName) return true;
  const curCodeStart = curNodeName.charCodeAt(0);
  const newCodeStart = newNodeName.charCodeAt(0);
  return curCodeStart <= 90 && newCodeStart >= 97 ? curNodeName === newNodeName.toUpperCase() : newCodeStart <= 90 && curCodeStart >= 97 ? newNodeName === curNodeName.toUpperCase() : false;
};
var formNodes = (curElement, newElement) => {
  switch (curElement.nodeName) {
    case "INPUT":
      input(
        curElement,
        newElement
      );
      break;
    case "OPTION":
      option(
        curElement,
        newElement
      );
      break;
    case "SELECT":
      select(
        curElement,
        newElement
      );
      break;
    case "TEXTAREA":
      textarea(
        curElement,
        newElement
      );
      break;
  }
};
var getKey2 = (node) => node ? "getAttribute" in node ? node.getAttribute("id") : void 0 : void 0;
var moveChildren = (curElement, newElement) => {
  let firstChild = curElement.firstChild;
  let nextChild;
  while (firstChild) {
    nextChild = firstChild.nextSibling;
    newElement.appendChild(firstChild);
    firstChild = nextChild;
  }
  return newElement;
};
var removeNode2 = (curNode, parentNode, context2, skipKeys = true) => {
  removeNode(curNode);
  parentNode && parentNode.removeChild(curNode);
  walkNodes(curNode, skipKeys, context2);
};
var morphEqual = (curElement) => {
  if (curElement.nodeType === 1 /* ELEMENT_NODE */) {
    if (curElement.hasAttribute($.qs.$node)) {
      readNode(curElement);
    }
  }
};
var morphChildren = (curElement, newElement, context2) => {
  let newNode = newElement.firstChild;
  let newKey;
  let newNextSibling;
  let curNode = curElement.firstChild;
  let curKey;
  let curNodeType;
  let curNextSibling;
  let curMatch;
  outer: while (newNode) {
    newKey = getKey2(newNode);
    newNextSibling = newNode.nextSibling;
    while (curNode) {
      curNextSibling = curNode.nextSibling;
      if (newNode.isEqualNode(curNode)) {
        morphEqual(curNode);
        newNode = newNextSibling;
        curNode = curNextSibling;
        continue outer;
      }
      curKey = getKey2(curNode);
      curNodeType = curNode.nodeType;
      let isCompatible;
      if (curNodeType === newNode.nodeType) {
        if (curNodeType === 1 /* ELEMENT_NODE */) {
          if (newKey) {
            if (newKey !== curKey) {
              if (curMatch = context2.$lookup.get(newKey)) {
                if (curNextSibling && curNextSibling.isEqualNode(curMatch)) {
                  isCompatible = false;
                } else {
                  curElement.insertBefore(
                    curMatch,
                    curNode
                  );
                  if (curKey) {
                    context2.$remove.add(curKey);
                  } else {
                    removeNode2(
                      curNode,
                      curElement,
                      context2
                    );
                  }
                  curNode = curMatch;
                  curKey = getKey2(curNode);
                }
              } else {
                isCompatible = false;
              }
            }
          } else if (curKey) {
            isCompatible = false;
          }
          isCompatible = isCompatible !== false && matchName(
            curNode.nodeName,
            newNode.nodeName
          );
          if (isCompatible) {
            morphElement(
              curNode,
              newNode,
              context2
            );
          }
        } else if (curNodeType === 3 /* TEXT_NODE */ || curNodeType === 8 /* COMMENT_NODE */) {
          isCompatible = true;
          if (curNode.nodeValue !== newNode.nodeValue) curNode.nodeValue = newNode.nodeValue;
        }
      }
      if (isCompatible) {
        newNode = newNextSibling;
        curNode = curNextSibling;
        continue outer;
      }
      if (curKey) {
        context2.$remove.add(curKey);
      } else {
        removeNode2(
          curNode,
          curElement,
          context2
        );
      }
      curNode = curNextSibling;
    }
    if (newKey && (curMatch = context2.$lookup.get(newKey)) && matchName(curMatch.nodeName, newNode.nodeName)) {
      curElement.appendChild(curMatch);
      morphElement(curMatch, newNode, context2);
    } else {
      if (newNode.actualize) newNode = newNode.actualize(curElement.ownerDocument || document);
      curElement.appendChild(newNode);
      addedNode2(newNode, context2);
    }
    newNode = newNextSibling;
    curNode = curNextSibling;
  }
  cleanNode(
    curElement,
    curNode,
    curKey,
    context2
  );
  formNodes(
    curElement,
    newElement
  );
};
var morphElement = (curElement, newElement, context2) => {
  const newKey = getKey2(newElement);
  newKey && context2.$lookup.delete(newKey);
  if (curElement.isEqualNode(newElement)) return;
  const morphAttr = curElement.getAttribute($.qs.$morph);
  if (morphAttr === "false") return;
  morphAttr !== "children" && morphAttributes(curElement, newElement);
  curElement.nodeName === "TEXTAREA" ? textarea(curElement, newElement) : morphChildren(curElement, newElement, context2);
};
var walkNodes = (curNode, skipKeys, context2) => {
  if (curNode.nodeType !== 1 /* ELEMENT_NODE */) return;
  let curChild = curNode.firstChild;
  while (curChild) {
    let key;
    if (skipKeys && (key = getKey2(curChild))) {
      context2.$remove.add(key);
    } else {
      removeNode(curChild);
      curChild.firstChild && walkNodes(curChild, skipKeys, context2);
    }
    curChild = curChild.nextSibling;
  }
};
var addedNode2 = (curElement, context2) => {
  (curElement.nodeType === 1 /* ELEMENT_NODE */ || curElement.nodeType === 11 /* FRAGMENT_NODE */) && addedNode(curElement);
  let curChild = curElement.firstChild;
  while (curChild) {
    const nextSibling = curChild.nextSibling;
    const curKey = getKey2(curChild);
    if (curKey) {
      const unmatchElement = context2.$lookup.get(curKey);
      if (unmatchElement && matchName(curChild.nodeName, unmatchElement.nodeName)) {
        curChild.parentNode.replaceChild(unmatchElement, curChild);
        morphElement(unmatchElement, curChild, context2);
      } else {
        addedNode2(curChild, context2);
      }
    } else {
      addedNode2(curChild, context2);
    }
    curChild = nextSibling;
  }
};
var cleanNode = (curElement, curNode, curKey, context2) => {
  while (curNode) {
    const curNextSibling = curNode.nextSibling;
    if (curKey = getKey2(curNode)) {
      context2.$remove.add(curKey);
    } else {
      removeNode2(curNode, curElement, context2);
    }
    curNode = curNextSibling;
  }
};
var indexNode = (fromNode, context2) => {
  if (fromNode.nodeType === 1 /* ELEMENT_NODE */ || fromNode.nodeType === 11 /* FRAGMENT_NODE */) {
    let childNode = fromNode.firstChild;
    while (childNode) {
      const key = getKey2(childNode);
      key && context2.$lookup.set(key, childNode);
      indexNode(childNode, context2);
      childNode = childNode.nextSibling;
    }
  }
};
var morph = (curNode, snapNode) => {
  let newNode = snapNode.cloneNode(true);
  const context2 = o({ $remove: s(), $lookup: m() });
  newNode.nodeType === 11 /* FRAGMENT_NODE */ && (newNode = newNode.firstElementChild);
  indexNode(curNode, context2);
  let morphedNode = curNode;
  const curNodeType = morphedNode.nodeType;
  const newNodeType = newNode.nodeType;
  if (curNodeType === 1 /* ELEMENT_NODE */) {
    if (newNodeType === 1 /* ELEMENT_NODE */) {
      if (!matchName(curNode.nodeName, newNode.nodeName)) {
        removeNode(curNode);
        morphedNode = moveChildren(
          curNode,
          createElementNS(newNode.nodeName, newNode.namespaceURI)
        );
      }
    } else {
      morphedNode = newNode;
    }
  } else if (curNodeType === 3 /* TEXT_NODE */ || curNodeType === 8 /* COMMENT_NODE */) {
    if (newNodeType === curNodeType) {
      if (morphedNode.nodeValue !== newNode.nodeValue) {
        morphedNode.nodeValue = newNode.nodeValue;
      }
      return morphedNode;
    } else {
      morphedNode = newNode;
    }
  }
  if (morphedNode.isEqualNode(newNode)) {
    removeNode(curNode);
  } else {
    if (newNode.isEqualNode(morphedNode)) return morphedNode;
    morphElement(morphedNode, newNode, context2);
    if (context2.$remove.size > 0) {
      for (const key of context2.$remove) {
        if (context2.$lookup.has(key)) {
          const node = context2.$lookup.get(key);
          removeNode2(node, node.parentNode, context2, false);
        }
      }
    }
  }
  if (morphedNode !== curNode && curNode.parentNode) {
    if (morphedNode.actualize) morphedNode = morphedNode.actualize(curNode.ownerDocument || document);
    curNode.parentNode.replaceChild(morphedNode, curNode);
  }
  context2.$lookup.clear();
  context2.$remove.clear();
  return morphedNode;
};

// src/shared/links.ts
var getLink = (target, selector2) => {
  if (!(target instanceof Element)) return false;
  const element2 = target.closest(selector2);
  return element2 && element2.tagName === "A" ? element2 : false;
};
var canFetch = (target) => {
  if (target.nodeName !== "A") return 2 /* NO */;
  const href = target.getAttribute("href");
  if (!href || !validKey(href)) return 2 /* NO */;
  const key = getKey(href);
  return key === null ? 2 /* NO */ : has(key) ? 2 /* NO */ : 1 /* YES */;
};
var getNodeTargets = (selector2, hrefs) => {
  const targets2 = [];
  forNode(
    selector2,
    (targetNode) => {
      if (targetNode.nodeName !== "A") {
        forNode(
          hrefs,
          (linkNode) => canFetch(linkNode) === 1 /* YES */ ? targets2.push(linkNode) : null
        );
      } else {
        if (targetNode.hasAttribute("href") && validKey(targetNode.href)) {
          const key = getKey(targetNode.href);
          if (getKey(key) !== null && has(key) === false) targets2.push(targetNode);
        }
      }
    }
  );
  return targets2;
};
var getTargets = (selector2) => {
  const targets2 = [];
  forNode(
    selector2,
    (linkNode) => canFetch(linkNode) === 1 /* YES */ ? targets2.push(linkNode) : null
  );
  return targets2;
};

// src/observe/hovers.ts
var onEnter = (event) => {
  const target = getLink(event.target, $.qs.$hover);
  if (!target) return;
  const route2 = getRoute(target, 10 /* HOVER */);
  if (has(route2.key)) return;
  if (route2.key in XHR.$timeout) return;
  target.addEventListener(`${pointer}leave`, onLeave, { once: true });
  const state = create(route2);
  const delay = state.threshold || $.config.hover.threshold;
  throttle(route2.key, function() {
    if (!emit("prefetch", target, route2)) return;
    fetch(state).then(function() {
      delete XHR.$timeout[route2.key];
      removeListener(target);
    });
  }, delay);
};
var onLeave = (event) => {
  const target = getLink(event.target, $.qs.$hover);
  if (target) {
    cleanup(getKey(target.href));
  }
};
var addListener = (target) => target.addEventListener(`${pointer}enter`, onEnter);
var removeListener = (target) => {
  target.removeEventListener(`${pointer}enter`, onEnter);
  target.removeEventListener(`${pointer}leave`, onLeave);
};
var connect4 = () => {
  if (!$.config.hover || $.observe.hover) return;
  forEach(addListener, getTargets($.qs.$hover));
  $.observe.hover = true;
};
var disconnect2 = () => {
  if (!$.observe.hover) return;
  forEach(removeListener, getTargets($.qs.$hover));
  $.observe.hover = false;
};

// src/observe/intersect.ts
var entries;
var onIntersect = async (entry) => {
  if (entry.isIntersecting) {
    const route2 = getRoute(entry.target, 11 /* INTERSECT */);
    if (!emit("prefetch", entry.target, route2)) return entries.unobserve(entry.target);
    const response = await fetch(create(route2));
    if (response) {
      entries.unobserve(entry.target);
    } else {
      log(3 /* WARN */, `Prefetch will retry at next intersect for: ${route2.key}`);
      entries.observe(entry.target);
    }
  }
};
var connect5 = () => {
  if (!$.config.intersect || $.observe.intersect) return;
  if (!entries) entries = new IntersectionObserver(forEach(onIntersect), $.config.intersect);
  const observe = forEach((target) => entries.observe(target));
  const targets2 = getNodeTargets($.qs.$intersector, $.qs.$intersect);
  observe(targets2);
  $.observe.intersect = true;
};
var disconnect3 = () => {
  if (!$.observe.intersect) return;
  entries.disconnect();
  $.observe.intersect = false;
};

// src/observe/mutations.ts
var outsideTarget = (node) => {
  const targets2 = b().querySelectorAll(`${$.page.target.join()},[${$.qs.$target}]`);
  for (let i = 0, s2 = targets2.length; i < s2; i++) {
    if (targets2[i].contains(node)) return false;
  }
  return true;
};
var resources = new MutationObserver(([mutation]) => {
  if (mutation.type !== "childList") return;
  if (mutation.addedNodes.length === 0 && mutation.removedNodes.length === 0) return;
  const isAdded = mutation.addedNodes.length;
  const node = isAdded ? mutation.addedNodes[0] : mutation.removedNodes[0];
  if (node.nodeType !== 1 /* ELEMENT_NODE */) return;
  if ($.eval && isResourceTag.test(node.nodeName)) {
    if (node.parentNode.nodeName === "HEAD") {
      isAdded ? morphHead("appendChild", node) : morphHead("removeChild", node);
    } else {
      outsideTarget(node) && $.resources.has(node) ? $.resources.delete(node) : $.resources.add(node);
    }
  } else if (node instanceof HTMLElement) {
    const ref = node.getAttribute($.qs.$ref);
    if (isAdded && ref === null) {
      getComponents(node);
    } else if (ref) {
      unmount(node, ref.split(","));
    }
  }
});
var connect6 = () => {
  if ($.observe.mutations) return;
  resources.observe(document.head, { childList: true });
  resources.observe(b(), { childList: true, subtree: true });
  $.observe.mutations = true;
};
var disconnect4 = () => {
  if (!$.observe.mutations) return;
  resources.takeRecords();
  resources.disconnect();
  for (const node of $.resources) {
    b().removeChild(node);
    $.resources.delete(node);
  }
  $.observe.mutations = false;
};

// src/observe/proximity.ts
var inRange = ({
  clientX,
  clientY
}, bounds) => clientX <= bounds.right && clientX >= bounds.left && clientY <= bounds.bottom && clientY >= bounds.top;
var setBounds = (target) => {
  const rect = target.getBoundingClientRect();
  const attr = target.getAttribute($.qs.$proximity);
  const distance = isNumber.test(attr) ? Number(attr) : $.config.proximity.distance;
  return {
    target,
    top: rect.top - distance,
    bottom: rect.bottom + distance,
    left: rect.left - distance,
    right: rect.right + distance
  };
};
var observer = (targets2, wait2 = false) => (event) => {
  if (wait2) return;
  wait2 = true;
  const node = targets2.findIndex((node2) => inRange(event, node2));
  if (node === -1) {
    onNextTick(() => wait2 = false, $.config.proximity.throttle);
  } else {
    const { target } = targets2[node];
    if (canFetch(target) === 2 /* NO */) {
      targets2.splice(node, 1);
    } else {
      const page = create(getRoute(target, 12 /* PROXIMITY */));
      const delay = page.threshold || $.config.proximity.threshold;
      throttle(page.key, async () => {
        if (!emit("prefetch", target, page)) return disconnect5();
        const prefetch2 = await fetch(page);
        if (prefetch2) {
          targets2.splice(node, 1);
          wait2 = false;
          if (targets2.length === 0) {
            disconnect5();
            log(2 /* INFO */, "Proximity observer disconnected");
          }
        }
      }, delay);
    }
  }
};
var entries2;
var connect7 = () => {
  if (!$.config.proximity || $.observe.proximity) return;
  const target = getTargets($.qs.$proximity);
  const targets2 = target.map(setBounds);
  if (targets2.length > 0) {
    entries2 = observer(targets2);
    addEventListener(`${pointer}move`, entries2, { passive: true });
    $.observe.proximity = true;
  }
};
var disconnect5 = () => {
  if (!$.observe.proximity) return;
  removeEventListener(`${pointer}move`, entries2);
  $.observe.proximity = false;
};

// src/app/render.ts
var morphHead2 = async (curHead, newHead) => {
  if (!$.eval || !curHead.children || !newHead.children) return;
  const curHeadChildren = curHead.children;
  const newHeadExternal = s();
  const newHeadChildren = newHead.children;
  const newHeadRemovals = [];
  for (let i = 0, s2 = newHeadChildren.length; i < s2; i++) {
    if (canEval(newHeadChildren[i])) {
      newHeadExternal.add(newHeadChildren[i].outerHTML);
    }
  }
  for (let i = 0, s2 = curHeadChildren.length; i < s2; i++) {
    const curHeadChildNode = curHeadChildren[i];
    const canEvalChildNode = canEval(curHeadChildNode);
    const curHeadOuterHTML = curHeadChildNode.outerHTML;
    if (newHeadExternal.has(curHeadOuterHTML)) {
      canEvalChildNode ? newHeadRemovals.push(curHeadChildNode) : newHeadExternal.delete(curHeadOuterHTML);
    } else if (canEvalChildNode) {
      newHeadRemovals.push(curHeadChildNode);
    }
  }
  const promises = [];
  const range = document.createRange();
  for (const outerHTML of newHeadExternal) {
    const node = range.createContextualFragment(outerHTML).firstChild;
    if (hasProp(node, "href") || hasProp(node, "src")) {
      let resolve;
      const promise = new Promise((_) => resolve = _);
      node.addEventListener("load", () => resolve());
      node.addEventListener("error", (error2) => {
        log(3 /* WARN */, `Resource <${node.nodeName.toLowerCase()}> failed:`, error2);
        resolve();
      });
      promises.push(promise);
    }
    curHead.appendChild(node);
    newHeadExternal.delete(outerHTML);
  }
  for (let i = 0, s2 = newHeadRemovals.length; i < s2; i++) {
    curHead.removeChild(newHeadRemovals[i]);
  }
  await Promise.allSettled(promises);
};
var morphDom = (page, snapDom) => {
  const pageDom = b();
  if (page.selector === "body" || page.fragments.length === 0) {
    morph(pageDom, snapDom.body);
  } else {
    const elements2 = page.target.length > 0 ? $.fragments.keys() : page.fragments;
    const components = $.components.$registry.size > 0;
    for (const id of elements2) {
      const domNode = $.fragments.get(id);
      const newNode = snapDom.body.querySelector(id);
      if (!newNode || !domNode) continue;
      if (!emit("render", domNode, newNode)) continue;
      if (mark.has(newNode.id)) {
        newNode.setAttribute($.qs.$ref, domNode.getAttribute($.qs.$ref));
      } else {
        if (domNode.isEqualNode(newNode)) continue;
        components && snap.set(newNode);
        morph(domNode, newNode);
      }
    }
  }
  context && snap.sync(snapDom, page.snap);
  page.type !== 6 /* VISIT */ && patch("type", 6 /* VISIT */);
  if (page.location.hash !== nil) {
    const anchor = pageDom.querySelector(page.location.hash);
    anchor && anchor.scrollIntoView();
  }
  scrollTo(page.scrollX, page.scrollY);
};
var update2 = (page) => {
  disconnect2();
  disconnect3();
  disconnect5();
  disconnect4();
  disconnect();
  connect3();
  $.eval === false && (document.title = page.title);
  const snapDom = getSnapDom(page.snap);
  morphHead2(h(), snapDom.head);
  morphDom(page, snapDom);
  progress.done();
  connect4();
  connect5();
  connect7();
  connect2();
  connect6();
  emit("load", page);
  return page;
};

// src/observe/history.ts
var api = window.history;
var reverse2 = () => api.state !== null && "spx" in api.state && "rev" in api.state.spx && api.state.spx.key !== api.state.spx.rev;
var has2 = (key) => {
  if (api.state === null) return false;
  if (typeof api.state !== "object") return false;
  if (!("spx" in api.state)) return false;
  const match = hasProps(api.state.spx)([
    "key",
    "rev",
    "scrollX",
    "scrollY",
    "title",
    "target"
  ]);
  return typeof key === "string" ? match && api.state.spx.key === key : match;
};
var load = async () => {
  await promiseResolve();
  $.loaded = true;
};
var initialize = (page) => {
  if (has2(page.key)) {
    Object.assign(page, api.state.spx);
    scrollTo(api.state.spx.scrollX, api.state.spx.scrollY);
  } else {
    replace(page);
  }
  return page;
};
var replace = ({
  key,
  rev,
  title,
  scrollX,
  scrollY,
  target
}) => {
  api.replaceState({
    spx: o({
      key,
      rev,
      scrollX,
      scrollY,
      target,
      title: title || document.title
    })
  }, title, key);
  log(1 /* VERBOSE */, `History replaceState: ${key}`);
  return api.state.spx;
};
var push = ({ key, rev, title, scrollX, scrollY, target }) => {
  api.pushState({
    spx: o({
      key,
      rev,
      scrollX,
      scrollY,
      target,
      title: title || document.title
    })
  }, title, key);
  log(1 /* VERBOSE */, `History pushState: ${key}`);
  return api.state.spx;
};
var pop = async (event) => {
  if (event.state === null || !("spx" in event.state)) return;
  const { spx: spx2 } = event.state;
  if (has(spx2.key)) {
    if (!has(spx2.rev) && spx2.rev !== spx2.key) {
      reverse(spx2);
    }
    patch("type", 5 /* POPSTATE */, spx2.key);
    const { type, key } = update2($.pages[spx2.key]);
    type === 4 /* REVERSE */ ? log(1 /* VERBOSE */, `History popState reverse: ${key}`) : log(1 /* VERBOSE */, `History popState session: ${key}`);
  } else {
    log(1 /* VERBOSE */, `History popState fetch: ${spx2.key}`);
    spx2.type = 5 /* POPSTATE */;
    const page = await fetch(spx2);
    if (!page) return location.assign(spx2.key);
    const key = getKey(location);
    if (page.key === key) {
      log(1 /* VERBOSE */, `History popState fetch Complete: ${spx2.key}`, "#2cc9ee" /* CYAN */);
      page.target = [];
      page.selector = null;
      update2(page);
    } else if (has(key)) {
      update2($.pages[key]);
    } else {
      const data = create(getRoute(key, 5 /* POPSTATE */));
      const page2 = await fetch(data);
      if (page2) push(page2);
    }
  }
};
var connect8 = (page) => {
  if ($.observe.history) return;
  addEventListener("popstate", pop, false);
  $.observe.history = true;
  if (typeof page === "object" && page.type === 0 /* INITIAL */) {
    return initialize(page);
  }
  return page;
};
var disconnect6 = () => {
  if (!$.observe.history) return;
  if (api.scrollRestoration) api.scrollRestoration = "auto";
  removeEventListener("popstate", pop, false);
  removeEventListener("load", load, false);
  $.observe.history = false;
};

// src/app/config.ts
var observers = (options2) => {
  for (const key of ["hover", "intersect", "proximity", "progress"]) {
    if (hasProp(options2, key)) {
      if (options2[key] === false) {
        $.config[key] = false;
      } else if (typeof options2[key] === "object") {
        Object.assign($.config[key], options2[key]);
      }
      delete options2[key];
    }
  }
  return options2;
};
var not = (attr, name) => {
  const prefix = `:not([${attr}${name}=false]):not([${attr}link])`;
  switch (name.charCodeAt(0)) {
    case 104 /* LCH */:
      return `${prefix}:not([${attr}proximity]):not([${attr}intersect])`;
    case 105 /* LCI */:
      return `${prefix}:not([${attr}hover]):not([${attr}proximity])`;
    case 112 /* LCP */:
      return `${prefix}:not([${attr}intersect]):not([${attr}hover])`;
  }
};
var evaluators = (options2, attr, disable) => {
  if ("eval" in options2) {
    if (options2.eval) {
      if (typeof options2.eval === "object") {
        const e = Object.assign($.config.eval, options2.eval);
        $.eval = !(e.link === false && e.meta === false && e.script === false && e.style === false);
      }
    } else {
      $.eval = false;
    }
  }
  return (tag) => {
    if ($.eval === false || $.config.eval[tag] === false) {
      return `${tag}[${attr}eval]:${disable}`;
    }
    if ($.config.eval[tag] === true) {
      return `${tag}:${disable}`;
    }
    const defaults = tag === "link" ? `${tag}[rel=stylesheet]:${disable}` : tag === "script" ? `${tag}:${disable}:not([${attr}eval=hydrate])` : `${tag}:${disable}`;
    if ($.config.eval[tag] === null) return defaults;
    if (Array.isArray($.config.eval[tag])) {
      if ($.config.eval[tag].length > 0) {
        return $.config.eval[tag].map((s2) => `${s2}:${disable}`).join(",");
      } else {
        log(3 /* WARN */, `Missing eval ${tag} value, SPX will use defaults`);
        return defaults;
      }
    }
    log(4 /* TYPE */, `Invalid eval ${tag} value, expected boolean or array`);
  };
};
var fragments = (options2) => {
  const elements2 = [];
  if ("fragments" in options2 && Array.isArray(options2.fragments) && options2.fragments.length > 0) {
    for (const fragment of options2.fragments) {
      const charCode = fragment.charCodeAt(0);
      if (charCode === 46 /* DOT */ || charCode === 91 /* LSB */) {
        log(3 /* WARN */, [
          `Invalid fragment selector "${fragment}" provided. Fragments must be id annotated values.`,
          "Use spx-target attributes for additional fragment selections."
        ]);
        continue;
      } else if (charCode === 35 /* HSH */) {
        elements2.push(fragment.trim());
      } else {
        elements2.push(`#${fragment.trim()}`);
      }
    }
  } else {
    return ["body"];
  }
  return elements2;
};
var configure = (options2 = o()) => {
  if ("logLevel" in options2) {
    $.logLevel = options2.logLevel;
    if ($.logLevel === 1 /* VERBOSE */) {
      log(1 /* VERBOSE */, "Verbose Logging");
    }
  }
  patchSetAttribute();
  Object.defineProperties($, {
    history: { get: () => typeof api.state === "object" && "spx" in api.state ? api.state.spx : null },
    ready: { get: () => document.readyState === "complete" },
    types: {
      get: () => o({
        INITIAL: 0,
        PREFETCH: 1,
        FETCH: 2,
        PRELOAD: 3,
        REVERSE: 4,
        POPSTATE: 5,
        VISIT: 6,
        HYDRATE: 7,
        CAPTURE: 8,
        RELOAD: 9,
        HOVER: 10,
        INTERSECT: 11,
        PROXIMITY: 12
      })
    }
  });
  if ("components" in options2) {
    registerComponents(options2.components);
    delete options2.components;
  }
  Object.assign($.config, observers(options2));
  const schema = $.config.schema;
  const attr = schema === "spx" ? "spx" : schema.endsWith("-") ? schema : schema === null ? nil : `${schema}-`;
  const href = `:not([${attr}disable]):not([href^=\\#])`;
  const disable = `not([${attr}eval=false])`;
  const evals = evaluators(options2, attr, disable);
  $.config.fragments = fragments(options2);
  $.config.schema = attr;
  $.config.index = null;
  $.memory.bytes = 0;
  $.memory.visits = 0;
  $.memory.limit = $.config.maxCache;
  Object.assign($.qs, {
    $attrs: new RegExp(`^href|${attr}(${"hydrate|append|prepend|target|progress|threshold|scroll|position|proximity|hover|cache|history" /* NAMES */})$`, "i"),
    $find: new RegExp(`${attr}(?:node|bind|component)|@[a-z]|[a-z]:[a-z]`, "i"),
    $param: new RegExp(`^${attr}[a-zA-Z0-9-]+:`, "i"),
    $target: `${attr}target`,
    $fragment: `${attr}fragment`,
    $fragments: `[${attr}fragment]`,
    $targets: `[${attr}target]:not(a[spx-target]):not([${attr}target=false])`,
    $morph: `${attr}morph`,
    $eval: `${attr}eval`,
    $intersector: `[${attr}intersect]${not(attr, "intersect")}`,
    $track: `[${attr}track]:not([${attr}track=false])`,
    $component: `${attr}component`,
    $node: `${attr}node`,
    $bind: `${attr}bind`,
    $ref: "data-spx",
    $href: $.config.annotate ? `a[${attr}link]${href}` : `a${href}`,
    $script: evals("script"),
    $style: evals("style"),
    $link: evals("link"),
    $meta: evals("meta"),
    $hydrate: `script[${attr}eval=hydrate]:${disable}`,
    $resource: `link[rel=stylesheet][href*=\\.css]:${disable},script[src*=\\.js]:${disable}`,
    $data: `${attr}data:`,
    $proximity: `a[${attr}proximity]${href}${not(attr, "proximity")}`,
    $intersect: `a${href}${not(attr, "intersect")}`,
    $hover: $.config.hover !== false && $.config.hover.trigger === "href" ? `a${href}${not(attr, "hover")}` : `a[${attr}hover]${href}${not(attr, "hover")}`
  });
  progress.style($.config.progress);
};

// src/observe/hrefs.ts
var linkEvent = (event) => !// @ts-ignore
(event.target && event.target.isContentEditable || event.defaultPrevented || event.button > 1 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
var handle = function(event) {
  if (!linkEvent(event)) return;
  const target = getLink(event.target, $.qs.$href);
  if (!target) return;
  const key = getKey(target.href);
  if (key === null) return;
  const isRoute = key === $.page.key;
  const move = () => {
    log(3 /* WARN */, `Drag occurance, visit cancelled: ${key}`);
    handle.drag = true;
    target.removeEventListener(`${pointer}move`, move);
  };
  target.addEventListener(`${pointer}move`, move, { once: true });
  if (handle.drag === true) {
    handle.drag = false;
    return handle(event);
  }
  target.removeEventListener(`${pointer}move`, move);
  if (!emit("visit", event)) return;
  const click = (state, subsequent = true) => {
    $.pages[state.key].ts = ts();
    $.pages[state.key].visits = state.visits + 1;
    $.pages[state.key].target = $.pages[state.rev].target = state.target;
    $.pages[state.key].selector = $.pages[state.rev].selector = state.selector;
    $.pages[state.rev].scrollX = window.scrollX;
    $.pages[state.rev].scrollY = window.scrollY;
    if (isRoute) {
      log(2 /* INFO */, `Identical pathname, page visit skipped: ${key}`);
    } else {
      replace($.pages[state.rev]);
      if (subsequent) {
        push(state);
        update2(state);
      } else {
        visit(state);
      }
    }
  };
  disconnect2();
  disconnect5();
  disconnect3();
  if (has(key)) {
    const attrs = getAttributes(target, $.pages[key]);
    const page = update(attrs);
    target.onclick = (event2) => {
      event2.preventDefault();
      click(page);
    };
  } else if (XHR.$transit.has(key)) {
    cancel(key);
    log(2 /* INFO */, `Request in transit: ${key}`);
    const page = $.pages[key];
    target.onclick = (event2) => {
      event2.preventDefault();
      click(page, false);
    };
  } else {
    cancel();
    cleanup(key);
    const page = create(getRoute(target, 6 /* VISIT */));
    fetch(page);
    target.onclick = (event2) => {
      event2.preventDefault();
      click(page, false);
    };
  }
};
async function visit(state) {
  if (state.progress) progress.start(state.progress);
  try {
    const page = await wait(state);
    if (page) {
      if (page.history === "replace") {
        replace(page);
      } else {
        push(page);
      }
      update2(page);
    } else {
      location.assign(state.key);
    }
  } catch (e) {
    location.assign(state.key);
  }
}
var navigate = async (key, state) => {
  if (state) {
    if (typeof state.cache === "string") state.cache === "clear" ? clear() : clear(state.key);
    if (state.progress) progress.start(state.progress);
    const page = await fetch(state);
    if (page) {
      push(page);
      update2(page);
    } else {
      location.assign(state.key);
    }
  } else {
    return visit($.pages[key]);
  }
};
var connect9 = () => {
  if ($.observe.hrefs) return;
  handle.drag = false;
  if (deviceType === "mouseOnly") {
    addEventListener(`${pointer}down`, handle, false);
  } else if (deviceType === "touchOnly") {
    addEventListener("touchstart", handle, false);
  } else {
    addEventListener(`${pointer}down`, handle, false);
    addEventListener("touchstart", handle, false);
  }
  $.observe.hrefs = true;
};
var disconnect7 = () => {
  if (!$.observe.hrefs) return;
  if (deviceType === "mouseOnly") {
    removeEventListener(`${pointer}down`, handle, false);
  } else if (deviceType === "touchOnly") {
    removeEventListener("touchstart", handle, false);
  } else {
    removeEventListener(`${pointer}down`, handle, false);
    removeEventListener("touchstart", handle, false);
  }
  $.observe.hrefs = false;
};

// src/app/controller.ts
var initialize2 = () => {
  const route2 = getRoute(0 /* INITIAL */);
  const state = connect8(create(route2));
  defineGetterProps($, [
    ["prev", () => $.pages[$.history.rev]],
    ["page", () => $.pages[$.history.key]],
    ["snapDom", () => parse($.snaps[$.page.snap])]
  ]);
  const DOMContentLoaded = () => {
    const page = set(state, takeSnapshot());
    connect9();
    connect3();
    connect4();
    connect5();
    connect7();
    connect2();
    connect6();
    enqueue(
      () => patch("type", 6 /* VISIT */),
      async () => await reverse(page),
      async () => await preload(page)
    );
    return page;
  };
  return new Promise((resolve) => {
    document.readyState === "loading" ? addEventListener("DOMContentLoaded", () => resolve(DOMContentLoaded())) : resolve(DOMContentLoaded());
  });
};
var disconnect8 = () => {
  disconnect6();
  disconnect7();
  disconnect4();
  disconnect2();
  disconnect3();
  disconnect5();
  if ($.config.components) {
    disconnect();
    teardown();
    $.components.$registry.clear();
  }
  clear();
  if ($.config.globalThis) delete window.spx;
  log(2 /* INFO */, "Disconnected");
};

// src/index.ts
function spx(options2 = {}) {
  if (isBrowser === false) {
    return log(5 /* ERROR */, "Invalid runtime environment: window is undefined.");
  }
  if (!spx.supported) {
    return log(5 /* ERROR */, "Browser does not support SPX");
  }
  if (!window.location.protocol.startsWith("http")) {
    return log(5 /* ERROR */, "Invalid protocol, SPX expects HTTPS or HTTP protocol");
  }
  configure(options2);
  if ($.config.globalThis && !("spx" in window)) {
    defineGetter(window, "spx", spx);
  }
  const promise = initialize2();
  return async function(callback) {
    const state = await promise;
    if (callback.constructor.name === "AsyncFunction") {
      try {
        await callback(state);
      } catch (e) {
        log(3 /* WARN */, "Connection Error", e);
      }
    } else {
      callback(state);
    }
    log(2 /* INFO */, "Connection Established");
  };
}
spx.Component = Component;
spx.on = on;
spx.off = off;
spx.component = component;
spx.live = live;
spx.capture = capture;
spx.form = form;
spx.render = render;
spx.session = session;
spx.reload = reload;
spx.fetch = fetch2;
spx.clear = clear;
spx.hydrate = hydrate;
spx.prefetch = prefetch;
spx.route = route;
spx.disconnect = disconnect8;
spx.register = register;
spx.dom = dom;
spx.supported = supported();
Object.defineProperties(spx, {
  $: { get: () => $ },
  history: {
    value: {
      get state() {
        return $.history;
      },
      api,
      push,
      replace,
      has: has2,
      reverse: reverse2
    }
  }
});
function supported() {
  return !!(isBrowser && window.history.pushState && window.requestAnimationFrame && window.DOMParser && window.Proxy);
}
function live(identifers = null, ...rest) {
  const ids = identifers ? [identifers, ...rest].flat() : null;
  const mounted2 = {};
  for (const { scope: { alias, instanceOf } } of $.components.$instances.values()) {
    const id = ids ? ids.includes(alias) ? alias : ids.includes(instanceOf) ? instanceOf : null : null;
    mounted2[id || !ids && (alias || instanceOf)] = Array.isArray(mounted2[id || !ids && instanceOf]) ? [...mounted2[id || !ids && instanceOf], component] : component;
  }
  return mounted2;
}
function component(identifer, callback) {
  const instances = [];
  for (const instance of $.components.$instances.values()) {
    const { scope } = instance;
    if (scope.instanceOf === identifer || scope.alias === identifer) {
      instances.push(instance);
    }
  }
  return callback ? forEach(callback, instances) : instances[0];
}
function register(...classes) {
  if (typeof classes[0] === "string") {
    if (classes.length > 2) {
      log(5 /* ERROR */, [
        `Named component registration expects 2 parameters, recieved ${classes.length}.`,
        'Registry should follow this structure: spx.register("identifer", YourComponent)'
      ], classes);
    }
    registerComponents({ [components_exports[0]]: classes[1] });
  } else {
    for (const component2 of classes) {
      if (Array.isArray(component2)) {
        for (const item of component2) {
          if (typeof item[0] === "string") {
            registerComponents({ [item[0]]: item[1] });
          } else if (typeof item === "function") {
            registerComponents({ [getComponentId(item)]: item }, true);
          }
        }
      } else {
        console.log(component2);
        if (typeof component2 === "function") {
          registerComponents({ [getComponentId(component2)]: component2 }, true);
        } else if (typeof component2 === "object") {
          registerComponents(component2);
        }
      }
    }
  }
  connect2();
}
function session() {
  return Object.defineProperties(o(), {
    config: { get: () => $.config },
    snaps: { get: () => $.snaps },
    pages: { get: () => $.pages },
    observers: { get: () => $.observe },
    components: { get: () => $.components },
    fragments: { get: () => $.fragments },
    memory: { get: () => $.memory.size = size($.memory.bytes) }
  });
}
async function reload() {
  $.page.type = 9 /* RELOAD */;
  const page = await fetch($.page);
  if (page) {
    log(2 /* INFO */, "Triggered reload, page was re-cached");
    return update2(page);
  }
  log(3 /* WARN */, "Reload failed, triggering refresh (cache will purge)");
  return location.assign($.page.key);
}
async function fetch2(url) {
  const link = getRoute(url, 2 /* FETCH */);
  if (link.location.origin !== origin) {
    log(5 /* ERROR */, "Cross origin fetches are not allowed");
  }
  const dom2 = await http(link.key);
  if (dom2) return dom2;
}
function dom(strings, ...values) {
  let result = strings[0];
  for (let i = 0, s2 = values.length; i < s2; i++) result += values[i] + strings[i + 1];
  const raw = result;
  const dom2 = document.createElement("div");
  dom2.innerHTML = raw;
  const len = dom2.children.length;
  if (len === 0) return null;
  if (len === 1) return defineGetter(dom2.children[0], "raw", raw);
  const arr = defineGetter([], "raw", raw);
  while (dom2.firstChild) {
    const child = dom2.firstElementChild;
    child && arr.push(child);
    dom2.removeChild(dom2.firstChild);
  }
}
async function render(url, pushState, fn) {
  const page = $.page;
  const route2 = getRoute(url);
  if (route2.location.origin !== origin) log(5 /* ERROR */, "Cross origin fetches are not allowed");
  const dom2 = await http(route2.key, { type: "document" });
  if (!dom2) log(5 /* ERROR */, `Fetch failed for: ${route2.key}`, dom2);
  await fn.call(page, dom2);
  if (pushState === "replace") {
    page.title = dom2.title;
    const state = update(Object.assign(page, route2), takeSnapshot(dom2));
    replace(state);
    return state;
  } else {
    return update2(set(route2, takeSnapshot(dom2)));
  }
}
function capture(targets2) {
  const page = getPage();
  if (!page) return;
  const dom2 = getSnapDom();
  targets2 = Array.isArray(targets2) ? targets2 : page.target;
  if (targets2.length === 1 && targets2[0] === "body") {
    morph(dom2.body, b());
    update(page, takeSnapshot(dom2));
    return;
  }
  const selector2 = targets2.join(",");
  const current = b().querySelectorAll(selector2);
  forNode(dom2.body.querySelectorAll(selector2), (node, i) => {
    morph(node, current[i]);
  });
  update(page, takeSnapshot(dom2));
}
async function prefetch(link) {
  const path = getRoute(link, 1 /* PREFETCH */);
  if (has(path.key)) {
    log(3 /* WARN */, `Cache already exists for ${path.key}, prefetch skipped`);
    return;
  }
  const prefetch2 = await fetch(create(path));
  if (prefetch2) return prefetch2;
  log(5 /* ERROR */, `Prefetch failed for ${path.key}`);
}
async function form(action, options2) {
  const body = new FormData();
  for (const key in options2.data) {
    body.append(key, options2.data[key]);
  }
  const submit = await http(action, {
    method: options2.method,
    body
  });
  return submit;
}
async function hydrate(link, nodes) {
  const route2 = getRoute(link, 7 /* HYDRATE */);
  fetch(route2);
  if (Array.isArray(nodes)) {
    route2.hydrate = [];
    route2.preserve = [];
    for (const node of nodes) {
      if (node.charCodeAt(0) === 33) {
        route2.preserve.push(node.slice(1));
      } else {
        route2.hydrate.push(node);
      }
    }
  } else {
    route2.hydrate = $.config.fragments;
  }
  const page = await wait(route2);
  if (page) {
    const { key } = $.history;
    replace(page);
    update2(page);
    if (route2.key !== key) {
      if ($.index === key) $.index = route2.key;
      for (const p2 in $.pages) {
        if ($.pages[p2].rev === key) {
          $.pages[p2].rev = route2.key;
        }
      }
      clear(key);
    }
  }
  return getSnapDom(page.key);
}
async function route(uri, options2) {
  const goto = getRoute(uri);
  const merge = typeof options2 === "object" ? Object.assign(goto, options2) : goto;
  return has(goto.key) ? navigate(goto.key, update(merge)) : navigate(goto.key, create(merge));
}

export { spx as default };
