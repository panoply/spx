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
XHR.$timeout = o();

// src/app/session.ts
var ctx = {
  marks: s(),
  store: void 0,
  snaps: []
};
var $ = {
  index: "",
  eval: true,
  patched: false,
  loaded: false,
  logLevel: 2,
  qs: o(),
  fragments: m(),
  mounted: s(),
  registry: m(),
  instances: m(),
  maps: p({ get: (m2, k) => $.instances.get(m2[k]) }),
  events: o(),
  observe: o(),
  memory: o(),
  pages: o(),
  snaps: o(),
  resources: s(),
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
  }
};

// src/shared/logs.ts
var SPXError = class extends Error {
  constructor(message, context) {
    super(message);
    this.context = context;
    this.name = "SPX Error";
    if (context) this.context = context;
  }
};
var PREFIX = "SPX ";
var START = "\x1B[";
var END = "\x1B[0m";
var C = (COLOR, text) => START + COLOR + text + END;
var debug2 = (message, color = "#999" /* GRAY */) => {
  if ($.logLevel === 3 /* DEBUG */) {
    console.debug("%c" + PREFIX + (Array.isArray(message) ? message.join(" ") : message), `color: ${color};`);
  }
};
var warn2 = (message, context) => {
  if ($.logLevel >= 1 /* WARN */) {
    context ? console.warn(PREFIX + message, context) : console.warn(PREFIX + message);
  }
};
var info2 = (...message) => {
  if ($.logLevel === 2 /* INFO */) {
    console.info(PREFIX + C("90m" /* Gray */, message.join("")));
  }
};
var error2 = (message, context) => {
  throw new SPXError(message, context);
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
var attrJSON = (attr2, string) => {
  try {
    const json = (string || attr2).replace(/\\'|'/g, (m2) => m2[0] === "\\" ? m2 : '"').replace(/"(?:\\.|[^"])*"/g, (m2) => m2.replace(/\n/g, "\\n")).replace(
      /\[|[^[\]]*|\]/g,
      (m2) => /[[\]]/.test(m2) ? m2 : m2.split(",").map((value) => value.replace(/^(\w+)$/, '"$1"').replace(/^"([\d.]+)"$/g, "$1")).join(",")
    ).replace(/([a-zA-Z0-9_-]+)\s*:/g, '"$1":').replace(/:\s*([$\w-]+)\s*([,\]}])/g, ':"$1"$2').replace(/,(\s*[\]}])/g, "$1").replace(/([a-zA-Z_-]+)\s*,/g, '"$1",').replace(/([\]},\s]+)?"(true|false)"([\s,{}\]]+)/g, "$1$2$3");
    return JSON.parse(json);
  } catch (e) {
    error2("Invalid JSON in attribute value: " + JSON.stringify(attr2 || string, null, 2), e);
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
var setStateDefaults = (value) => {
  switch (value) {
    case String:
      return "";
    case Boolean:
      return false;
    case Number:
      return 0;
    case Object:
      return {};
    case Array:
      return [];
    default:
      return value;
  }
};
var defineGetter = (object2, name, value, configurable = null) => configurable !== null ? name in object2 ? object2 : Object.defineProperty(object2, name, { get: () => value, configurable }) : Object.defineProperty(object2, name, { get: () => value });
var targets = (page) => {
  if ("target" in page) {
    if (page.target.length === 1 && page.target[0] === "body") return page.target;
    if (page.target.includes("body")) {
      warn2(`The body selector passed via ${$.qs.$target} will override`);
      return ["body"];
    }
    return page.target.filter((v, i, a) => v !== "" && v.indexOf(",") === -1 ? a.indexOf(v) === i : false);
  } else if ($.config.fragments.length === 1 && $.config.fragments[0] === "body") {
    return ["body"];
  }
  return [];
};
var getSelectorFromElement = (node) => {
  let selector2 = node.tagName.toLowerCase();
  if (node.id) return selector2 + "#" + node.id;
  if (node.hasAttribute("class")) {
    const className = node.className.trim().replace(/\s+/g, ".");
    if (className) selector2 += "." + className;
  }
  return `${selector2}:nth-child(${Array.prototype.indexOf.call(node.parentNode.children, node) + 1})`;
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
    const attr2 = e.firstElementChild.getAttributeNode(name);
    e.firstElementChild.removeAttributeNode(attr2);
    this.setAttributeNode(attr2);
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
  const remove2 = () => {
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
    const update4 = pending.shift();
    if (update4) update4(dequeue);
  };
  const enqueue2 = (call) => {
    pending.push(call);
    pending.length === 1 && dequeue();
  };
  const set2 = (amount) => {
    amount = current(amount, $.config.progress.minimum, 1);
    status = amount === 1 ? null : amount;
    const progress2 = render2();
    enqueue2((update4) => {
      progress2.style.transform = `translateX(${percent(amount)}%)`;
      setTimeout(() => amount === 1 ? (remove2(), update4()) : update4(), $.config.progress.speed * (amount === 1 ? 2 : 1));
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
  instance.define.name = downcase(identifier || name);
  if (identifier !== instance.define.name) identifier = camelCase(instance.define.name);
  if (hasName && name !== original && ComponentNameCheck.test(instance.define.name)) {
    warn2(`Component name "${instance.define.name}" is invalid and converted to: ${identifier}`);
  }
  return identifier;
};
var registerComponents = (components, isValidID = false) => {
  for (const id in components) {
    const instance = components[id];
    const identifier = isValidID ? id : getComponentId(instance, id);
    if (!$.registry.has(identifier)) {
      $.registry.set(identifier, instance);
      debug2(`Component ${instance.name} registered using id: ${identifier}`);
    }
  }
  if (!$.config.components) {
    $.config.components = true;
  }
};

// src/app/events.ts
function emit(name, ...args) {
  const isCache = name === "cache";
  const binding = name === "disconnect" ? null : args.length === 1 ? args[0] : args.shift();
  if (isCache) args[0] = parse(args[0]);
  let returns = true;
  forEach((argument) => {
    const returned = argument.apply(binding, args);
    if (isCache) {
      if (returned instanceof Document) {
        returns = returned.documentElement.outerHTML;
      } else if (typeof returns !== "string") {
        returns = returned !== false;
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
      debug2(`Removed ${name} event listener (id: ${callback})`);
      if (events.length === 0) delete $.events[name];
    } else {
      const live2 = [];
      if (events && callback) {
        for (let i = 0, s2 = events.length; i < s2; i++) {
          if (events[i] !== callback) {
            live2.push(events[i]);
          } else if (name !== "x") {
            debug2(`Removed ${name} event listener (id: ${i})`);
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
    warn2(`Unknown or invalid event listener: ${name}`);
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
  error2(`Invalid event name "${eventName}" provided`, node);
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
  debug2([
    `Detached ${event.key} ${event.eventName} event from ${event.method}() method in component`,
    `${instance.scope.define.name}: ${instance.scope.key}`
  ], "#D1A9FF" /* LAVENDAR */);
};
var addEvent = (instance, event, node) => {
  if (event.attached) return;
  if (!(event.method in instance)) {
    warn2(`Undefined callback method: ${instance.scope.define.name}.${event.method}()`);
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
  debug2([
    `Attached ${event.key} ${event.eventName} event to ${event.method}() method in component`,
    `${instance.scope.define.name}: ${instance.scope.key}`
  ], "#7b97ca" /* PURPLE */);
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
    forStr((c2) => node.classList.add(c2), args);
    return this;
  },
  hasClass(node, ...args) {
    return forStr((c2) => node.classList.contains(c2), args, true);
  },
  removeClass(node, ...args) {
    forStr((c2) => node.classList.remove(c2), args);
    return this;
  },
  toggleClass(node, from, ...to) {
    this.hasClass(node, from) ? this.removeClass(node, from).addClass(node, ...to) : this.addClass(node, from);
    return this;
  },
  watch() {
  },
  update() {
  }
};

// src/components/proxies.ts
var stateProxy = (instance) => {
  const { scope, view } = instance;
  instance.state = new Proxy(scope.state, {
    get: Reflect.get,
    set(target, key, value, receiver) {
      if (key in scope.binds) {
        const binding = scope.binds[key];
        const domValue = typeof value === "object" || Array.isArray(value) ? JSON.stringify(value) : `${value}`;
        for (const id in binding) {
          if (!binding[id].live) continue;
          binding[id].value = domValue;
          forNode(binding[id].selector, (node) => {
            node.innerText = domValue;
          });
        }
      }
      return Reflect.set(target, key, value, receiver);
    }
  });
  const prefix = $.config.schema + scope.instanceOf;
  if (isEmpty(scope.state)) {
    for (const prop in scope.define.state) {
      scope.state[prop] = setStateDefaults(scope.define.state[prop]);
    }
  } else {
    for (const prop in scope.define.state) {
      const stateValue = scope.define.state[prop];
      if (!(prop in scope.state)) {
        scope.state[prop] = setStateDefaults(stateValue);
        continue;
      }
      const hasProp2 = `has${upcase(prop)}`;
      let attrName = `${prefix}:${kebabCase(prop)}`;
      if (!view.hasAttribute(attrName)) attrName = `${prefix}:${prop}`;
      const domValue = view.getAttribute(attrName);
      const defined = domValue !== null && domValue !== "";
      hasProp2 in scope.state || Reflect.set(scope.state, hasProp2, defined);
      if (typeof domValue === "string" && domValue.startsWith("window.")) {
        const windowProp = domValue.slice(7);
        if (windowProp in window) {
          scope.state[prop] = window[windowProp];
        } else {
          warn2(`Property "windowProp" does not exist on window: ${$.qs.$component}-${attrName}="${domValue}"`);
        }
      } else {
        if (Array.isArray(stateValue)) {
          scope.state[prop] = defined ? attrJSON(domValue) : stateValue;
        } else {
          const typeOf = typeof stateValue;
          if (typeOf === "object") {
            scope.state[prop] = defined ? attrJSON(domValue) : stateValue;
          } else if (typeOf === "number") {
            scope.state[prop] = defined ? +domValue : stateValue;
          } else if (typeOf === "boolean") {
            scope.state[prop] = defined ? domValue === "true" : stateValue;
          } else if (typeOf === "string") {
            scope.state[prop] = defined ? domValue : stateValue;
          } else {
            switch (stateValue) {
              case String:
                scope.state[prop] = defined ? domValue : "";
                break;
              case Boolean:
                scope.state[prop] = domValue === "true" || false;
                break;
              case Number:
                scope.state[prop] = domValue ? Number(domValue) : 0;
                break;
              case Object:
                scope.state[prop] = defined ? attrJSON(domValue) : {};
                break;
              case Array:
                scope.state[prop] = defined ? attrJSON(domValue) : [];
                break;
            }
          }
        }
      }
    }
  }
};
var setNodeProxy = (prop, node) => {
  const prototype = Reflect.getPrototypeOf(node);
  const descriptor = Reflect.getOwnPropertyDescriptor(prototype, prop);
  if (descriptor && descriptor.get) return Reflect.get(prototype, prop, node);
  const value = Reflect.get(node, prop);
  return typeof value === "function" ? value.bind(node) : value;
};
var nodeProxy = (node) => !node ? null : new Proxy(node, {
  set: (target, prop, value, receiver) => prop in node ? Reflect.set(node, prop, value) : Reflect.set(target, prop, value, receiver),
  get: (target, prop, receiver) => {
    if (prop in node) return setNodeProxy(prop, node);
    if (prop in DoM) return (...args) => DoM[prop](node, ...args);
    return Reflect.get(target, prop, receiver);
  }
});
var sugarProxy = ({ dom: dom2, name }) => {
  return new Proxy(() => dom2.nodes, {
    get(target, prop, receiver) {
      const { node } = dom2;
      if (prop === Symbol.toPrimitive) {
        error2(`Sugar Error: Use this.${name}.toNode() for raw element: ${`this.${name}`}`);
        return () => "";
      }
      if (prop in DoM) {
        return (...args) => DoM[prop](node, ...args);
      } else if (prop in node) {
        return setNodeProxy(prop, node);
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
      const typeOf = typeof args[0];
      if (typeOf === "number") return nodeProxy(nodes[callback]);
      if (typeOf === "string") return nodes.filter((el) => el.matches(callback));
      if (typeOf === "function") {
        let index = -1;
        const map = Array(length);
        while (++index < length) {
          map[index] = callback(nodeProxy(nodes[index]), index);
        }
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
    get view() {
      return this.scope.dom;
    }
    /**
     * Constructor
     *
     * Creates the component instance
     */
    constructor(value) {
      Reflect.defineProperty(this, "scope", {
        get() {
          return Component.scopes.get(value);
        }
      });
      Reflect.defineProperty(this, "ref", {
        value,
        configurable: false,
        enumerable: false,
        writable: false
      });
      stateProxy(this);
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
var resetContext = () => onNextTick(() => ctx.store = void 0);
var connect = (node, refs) => {
  for (const id of refs) {
    if (!$.maps[id]) continue;
    const instance = $.maps[id];
    const ref2 = id.charCodeAt(0);
    if (ref2 === 99 /* COMPONENT */) {
      $.mounted.add(instance.scope.key);
      instance.scope.dom = node;
      instance.scope.status = 2 /* MOUNT */;
      debug2(`Component ${instance.scope.define.name} mounted: ${instance.scope.key}`, "#6DD093" /* GREEN */);
    } else if (ref2 === 101 /* EVENT */) {
      addEvent(instance, instance.scope.events[id], node);
    } else if (ref2 === 110 /* NODE */) {
      for (const k in instance.scope.nodes) {
        ++instance.scope.nodes[k].live;
      }
    } else if (ref2 === 98 /* BINDING */) {
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
    if (!$.maps[id]) continue;
    const instance = $.maps[id];
    const ref2 = id.charCodeAt(0);
    if (ref2 === 99 /* COMPONENT */) {
      instance.scope.hooks.unmount === 2 /* DEFINED */ && instance.unmount(hargs());
      $.mounted.delete(instance.scope.key);
      if (instance.scope.define.merge) {
        instance.scope.snapshot = curNode.innerHTML;
        debug2(`Component ${instance.scope.define.name} snapshot: ${instance.scope.key}`);
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
      debug2(`Component ${instance.scope.define.name} unmounted: ${instance.scope.key}`, "#CAAF7C" /* ORANGE */);
    } else if (ref2 === 101 /* EVENT */) {
      removeEvent(instance, instance.scope.events[id]);
    } else if (ref2 === 110 /* NODE */) {
      for (const k in instance.scope.nodes) {
        --instance.scope.nodes[k].live;
      }
    } else if (ref2 === 98 /* BINDING */) {
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
      ctx.store ? ctx.store.$morph = node : ctx.store = getContext(node);
      walkNode(node, ctx.store);
    }
  }
};
var readNode = (newNode) => {
  ctx.store ? ctx.store.$morph = newNode : ctx.store = getContext(newNode);
  walkNode(newNode, ctx.store, false);
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
    ctx.store ? ctx.store.$morph = curNode : ctx.store = getContext(newNode);
    if (cRef && !nRef) unmount(curNode, cRef);
    if (isDirective(newNode.attributes)) walkNode(curNode, ctx.store);
  }
};

// src/app/snapshot.ts
var attr = (dom2, refs) => dom2.setAttribute(
  $.qs.$ref,
  dom2.hasAttribute($.qs.$ref) ? `${dom2.getAttribute($.qs.$ref)},${refs.shift()}` : refs.shift()
);
var replace = (key, snapshot) => {
  if (Reflect.set($.snaps, key, snapshot)) {
    debug2(`Snapshot ${$.page.key} updated for: ${$.page.snap}`, "#6DD093" /* GREEN */);
  } else {
    warn2(`Snapshot ${$.page.key} could not be updated for: ${$.page.snap}`);
  }
};
var add = (element2) => {
  ctx.snaps.push([element2, m()]);
  return element2;
};
var ref = (selector2, reference) => ctx.refs.has(selector2) ? ctx.refs.get(selector2).push(reference) : ctx.refs.set(selector2, [reference]);
var update = (snapshot, key) => enqueue(() => {
  while (ctx.snaps.length > 0) {
    const [dom2, marks] = ctx.snaps.shift();
    for (const [selector2, dataspx] of marks) {
      dom2.matches(selector2) && attr(dom2, dataspx);
      dom2.querySelectorAll(selector2).forEach((child) => attr(child, dataspx));
    }
    marks.clear();
  }
  replace(key, snapshot.documentElement.outerHTML);
});

// src/morph/snapshot.ts
var patchComponentSnap = (scope, scopeKey) => onNextTick(() => {
  const snap = getSnapDom(scope.snap);
  const dom2 = snap.querySelector(`[${$.qs.$ref}="${scope.ref}"]`);
  if (dom2) {
    dom2.innerHTML = scope.snapshot;
    replace(scope.snap, dom2.ownerDocument.documentElement.outerHTML);
  } else {
    warn2(`Component snapshot merge failed: ${scope.instanceOf} (${scopeKey})`);
  }
});
var morphHead = (method, newNode) => {
  const { page, dom: dom2 } = get($.page.key);
  const operation = method.charCodeAt(0) === 114 ? "removed" : "appended";
  if (dom2.head.contains(newNode)) {
    dom2.head[method](newNode);
    replace(page.snap, dom2.documentElement.outerHTML);
    debug2(`Snapshot record was updated, ${operation} ${newNode.nodeName.toLowerCase()} from <head>`);
  } else {
    warn2("Node does not exist in the snapshot record, snapshot morph skipped", newNode);
  }
};

// src/observe/components.ts
var hargs = () => o(o($.page));
var teardown = () => {
  for (const ref2 in $.maps) {
    delete $.maps[ref2];
  }
  for (const instance of $.instances.values()) {
    for (const key in instance.scope.events) {
      removeEvent(instance, instance.scope.events[key]);
    }
  }
  $.instances.clear();
  $.mounted.clear();
  info2("Component instances were disconnected");
};
var mount = (promises) => {
  const params = hargs();
  const promise = [];
  for (const [ref2, firsthook, finalhook] of promises) {
    const instance = $.instances.get(ref2);
    const MOUNT = instance.scope.status === 4 /* UNMOUNT */ ? "unmount" : "onmount";
    if (!instance.scope.snap) instance.scope.snap = $.page.snap;
    const seq = async () => {
      try {
        if (finalhook && instance.scope.status === 1 /* CONNNECT */) {
          await instance[firsthook](params);
          await instance[finalhook](params);
        } else {
          if (instance.scope.status === 4 /* UNMOUNT */) {
            instance.scope.define.merge && patchComponentSnap(instance.scope, ref2);
          } else {
            await instance[firsthook](params);
          }
        }
        instance.scope.status = instance.scope.status === 4 /* UNMOUNT */ ? 5 /* UNMOUNTED */ : 3 /* MOUNTED */;
        if (instance.scope.hooks.connect === 2 /* DEFINED */) {
          instance.scope.hooks.connect = 3 /* EXECUTED */;
        }
      } catch (error3) {
        warn2(`Component to failed to ${MOUNT}: ${instance.scope.instanceOf} (${ref2})`, error3);
        return Promise.reject(ref2);
      }
    };
    promise.push(promiseResolve().then(seq));
  }
  return Promise.allSettled(promise);
};
var hook = () => {
  if ($.mounted.size === 0 && $.instances.size === 0 && $.registry.size > 0) return getComponents();
  const promises = [];
  for (const ref2 of $.mounted) {
    if (!$.instances.has(ref2)) continue;
    const instance = $.instances.get(ref2);
    if (instance.scope.status !== 3 /* MOUNTED */ && instance.scope.status !== 5 /* UNMOUNTED */) {
      const unmount2 = instance.scope.status === 4 /* UNMOUNT */;
      const trigger = unmount2 ? "unmount" : "onmount";
      if (trigger in instance) {
        trigger === "onmount" && "connect" in instance && instance.scope.hooks.connect === 2 /* DEFINED */ ? promises.push([ref2, "connect", trigger]) : promises.push([ref2, trigger]);
      } else if (unmount2) {
        instance.scope.define.merge && patchComponentSnap(instance.scope, ref2);
        instance.scope.status = 5 /* UNMOUNTED */;
      }
    }
  }
  promises.length > 0 && mount(promises).catch((ref2) => {
    const instance = $.instances.get(ref2);
    instance.scope.status = 5 /* UNMOUNTED */;
    $.mounted.delete(ref2);
  });
};
var connect2 = () => {
  if ($.registry.size === 0 || $.observe.components) return;
  if ($.page.type === 0 /* INITIAL */) {
    getComponents();
  } else {
    if (ctx.store) {
      setInstances(ctx.store).then(hook).then(resetContext);
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
    $.mounted.add(scope.key);
    $.instances.set(scope.key, instance);
    debug2(`Component "${scope.instanceOf}" connected: ${scope.key}`, "#F48FB1" /* PINK */);
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
var setEvents = (scope, $instance, isMorph) => {
  for (const key in scope.events) {
    const event = scope.events[key];
    if (!(key in $instance.scope.events)) {
      $.maps[key] = $instance.ref;
      $instance.scope.events[key] = event;
    }
    if (isMorph !== null && scope.status === 3 /* MOUNTED */) {
      $.maps[key] = scope.key;
      $instance.scope.events[key] = scope.events[key];
    }
    addEvent($instance, scope.events[key]);
  }
};
var setNodes = (nodes, $instance) => {
  for (const key in nodes) {
    const node = nodes[key];
    const hasNodeKey = `has${upcase(key)}`;
    if (!(key in $instance.scope.nodes)) {
      $.maps[key] = $instance.ref;
      $instance.scope.nodes[key] = node;
    }
    if (hasNodeKey in $instance) {
      key in $instance.scope.nodes && ++$instance.scope.nodes[key].live;
      return;
    }
    const hasNode = () => node.live > 0;
    const getNode = () => element(node.selector, node.isChild ? $instance.view : b());
    const getNodes = () => elements(node.selector, node.isChild ? $instance.view : b());
    Object.defineProperty($instance, hasNodeKey, { get: hasNode });
    if ($instance.scope.define.sugar) {
      Object.defineProperties(node.dom, {
        node: { get: getNode },
        nodes: { get: getNodes }
      });
      $instance[key] = sugarProxy(node);
    } else {
      Object.defineProperties($instance, {
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
      const Register = $.registry.get(scope.instanceOf);
      const Defined = Object.defineProperty(scope, "define", { get: () => Register.define });
      Component.scopes.set(scope.key, Defined);
      const Instance = new Register(scope.key);
      setLifecyles(scope, Instance);
      setNodes(scope.nodes, Instance);
      setEvents(scope, Instance, isMorph);
      setHook(Instance, scope);
    }
  };
};
var setInstances = (context, snapshot) => {
  const { $scopes, $aliases, $morph } = context;
  const promises = [];
  const mounted2 = mounted();
  const define = defineInstances(promises, mounted2, $morph !== null);
  for (const instanceOf in $scopes) {
    if (!$.registry.has(instanceOf) && !mounted2.has(instanceOf)) {
      warn2(`Component does not exist in registry: ${instanceOf}`, $scopes[instanceOf]);
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
          if (instance.scope.instanceOf === instanceOf) {
            define(scope, instance);
          }
        }
      } else {
        define(scope);
      }
    }
  }
  onNextTick(() => [mounted2.clear()]);
  if ($.page.type === 0 /* INITIAL */ && snapshot || snapshot) {
    update(snapshot, $.page.snap);
  }
  return promises.length > 0 ? mount(promises) : Promise.resolve();
};

// src/components/context.ts
var walkNode = (node, context, strict = true) => {
  if (strict && !isDirective(node.attributes)) return;
  node.hasAttribute($.qs.$component) ? setComponent(node, node.getAttribute($.qs.$component), context) : setAttrs(node, context, null, null);
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
  const ctx2 = o();
  ctx2.$aliases = o();
  ctx2.$scopes = o();
  ctx2.$element = null;
  ctx2.$snaps = $morph ? o() : null;
  ctx2.$morph = $morph;
  ctx2.$snapshot = $snapshot;
  return ctx2;
};
var getSelector = (node, attrName, attrValue, contains2) => {
  attrValue || (attrValue = node.getAttribute(attrName));
  return `${node.nodeName.toLowerCase()}[${attrName}${contains2 ? "*=" : "="}"${attrValue}"]`;
};
var getScope = (id, { $scopes, $aliases }) => id in $aliases ? last($scopes[$aliases[id]]) : id in $scopes ? last($scopes[id]) : ($scopes[id] = [setScope([id])])[0];
var defineDomRef = (node, instance, ref2, selector2) => {
  $.maps[ref2] = instance;
  const value = node.getAttribute($.qs.$ref);
  node.setAttribute($.qs.$ref, value ? `${value},${ref2}` : ref2);
  selector2 && ref(selector2, ref2);
  return ref2;
};
var setScope = ([instanceOf, aliasOf = null], dom2, context) => {
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
  if ($.registry.has(instanceOf)) {
    scope.instanceOf = instanceOf;
    if (scope.alias) {
      if (!$.registry.has(scope.alias)) {
        if (scope.alias in context.$scopes) {
          for (const { events, nodes, binds } of context.$scopes[scope.alias]) {
            if ("events" in scope) {
              for (const e in events) {
                scope.events[e] = events[e];
                $.maps[e] = scope.key;
              }
            }
            if ("nodes" in scope) {
              for (const n in nodes) {
                scope.nodes[n] = nodes[n];
                $.maps[n] = scope.key;
              }
            }
            if ("binds" in scope) {
              for (const b2 in binds) {
                scope.binds[b2] = binds[b2];
                $.maps[b2] = scope.key;
              }
            }
          }
          delete context.$scopes[scope.alias];
        } else {
          context.$aliases[scope.alias] = instanceOf;
        }
      } else {
        error2(`Component alias "${scope.alias}" matched a component identifier in the registry`);
      }
    } else {
      scope.alias = null;
    }
  } else {
    instanceOf ? scope.alias = instanceOf : scope.instanceOf = null;
    if (scope.status === 2 /* MOUNT */) {
      context.$aliases[scope.alias] = null;
    }
  }
  return scope;
};
var setEvent = (node, name, valueRef, context) => {
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
    const scope = getScope(instanceOf, context);
    ev.listener = listener;
    ev.method = method.trim();
    ev.isChild = isChild(scope, node);
    defineGetter(ev, "dom", node, true);
    defineDomRef(node, scope.key, ev.key, ev.selector);
    scope.events[ev.key] = ev;
  }
};
var setNodes2 = (node, value, context) => {
  const nodes = getAttrValueNotation(value);
  for (const nodeValue of nodes) {
    const [instanceOf, name] = nodeValue.split(".");
    const scope = getScope(instanceOf, context);
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
var setBinds = (node, value, context) => {
  var _a;
  for (const bindValue of getAttrValueNotation(value)) {
    const [instanceOf, stateKey] = bindValue.split(".");
    const scope = getScope(instanceOf, context);
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
    Object.defineProperty(scope.binds[stateKey][key], "dom", { get: () => node });
  }
};
var setAttrs = (node, context, instanceOf, alias) => {
  if (instanceOf === null && alias === null) {
    context.$element = uuid();
  }
  for (let n = node.attributes.length - 1; n >= 0; n--) {
    const { name, value } = node.attributes[n];
    if (instanceOf) {
      let schema = `${$.config.schema}${instanceOf}:`;
      if (alias && !name.startsWith(schema)) schema = `${$.config.schema}${alias}:`;
      if (name.startsWith(schema)) {
        getScope(instanceOf, context).state[camelCase(name.slice(schema.length))] = value;
      }
    }
    if (name.indexOf("@") > -1) {
      setEvent(node, name, value, context);
    } else if (name === $.qs.$bind) {
      setBinds(node, value, context);
    } else if (name === $.qs.$node) {
      setNodes2(node, value, context);
    }
  }
};
var setComponent = (node, value, context) => {
  getComponentValues(value, (instanceOf, aliasOf) => {
    if (!$.registry.has(instanceOf)) {
      warn2(`Component does not exist in registry: ${instanceOf}`);
    } else {
      let scope;
      if (instanceOf in context.$scopes) {
        scope = last(context.$scopes[instanceOf]);
        if (scope.status === 5 /* UNMOUNTED */) {
          scope.status = 2 /* MOUNT */;
          scope.inFragment = contains(node);
          scope.dom = node;
          defineDomRef(node, scope.key, scope.ref, getSelector(node, $.qs.$component));
        } else {
          context.$scopes[instanceOf].push(setScope([instanceOf, aliasOf], node, context));
        }
      } else {
        context.$scopes[instanceOf] = [setScope([instanceOf, aliasOf], node, context)];
      }
      scope = last(context.$scopes[instanceOf]);
      if (aliasOf) {
        context.$aliases[aliasOf] = instanceOf;
      } else if (scope.alias && !(scope.alias in context.$aliases)) {
        if ($.registry.has(scope.alias)) {
          warn2(`Alias cannot use a component identifier: ${scope.instanceOf} as ${scope.alias}`);
          scope.alias = null;
        } else {
          context.$aliases[scope.alias] = instanceOf;
        }
      }
      setAttrs(node, context, instanceOf, scope.alias);
    }
  });
};
var getComponents = (nodes, snapSelector = null) => {
  const context = getContext();
  if (!nodes && !snapSelector) {
    const { ownerDocument } = add($.snapDom.body);
    walkElements(b(), (node) => walkNode(node, context));
    isEmpty(context.$scopes) || setInstances(context, ownerDocument);
  } else if (snapSelector) {
    let ownerDocument;
    const snapshot = $.snapDom.querySelector(snapSelector);
    if (!snapshot) {
      warn2(`Cannot find element in snapshot using selector: ${snapSelector}`);
    } else {
      ownerDocument = add($.snapDom.querySelector(snapSelector)).ownerDocument;
    }
    walkElements(nodes, (node) => walkNode(node, context));
    isEmpty(context.$scopes) || setInstances(context, ownerDocument);
  } else if (nodes instanceof Set) {
    nodes.forEach((node) => walkNode(node, context));
    nodes.clear();
    return context;
  } else {
    walkNode(nodes, context);
    return context;
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
      const attr2 = node.getAttribute(directive).trim();
      node.id !== nil && (attr2 === "true" || attr2 === nil) ? $.fragments.set(`#${node.id}`, node) : $.fragments.set(getSelector(node, directive, attr2), node);
    } else {
      $.fragments.set(`#${node.id}`, node);
    }
  });
  if (aliases && aliases.size > 0) {
    for (const child of aliases) {
      $.fragments.set(`#${child.id}`, child);
      $.page.target.push(`#${child.id}`);
      ctx.marks.add(child.id);
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
        warn2("The fragment or target is a decedent of an element which morphs", node);
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
    replace(page.snap, snapDom.documentElement.outerHTML);
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
  const h2 = $.config.hover;
  const p2 = $.config.proximity;
  if (h2) state.threshold = h2.threshold;
  if (p2) {
    state.proximity = p2.distance;
    state.threshold = p2.threshold;
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
  if (page.type > 5 /* POPSTATE */) {
    if (page.type > 9 /* RELOAD */) page.type = 1 /* PREFETCH */;
  }
  page.title = getTitle(snapshot);
  const event = emit("cache", page, snapshot);
  const dom2 = typeof event === "string" ? event : snapshot;
  if (!$.config.cache || event === false) return page;
  if (page.type !== 0 /* INITIAL */ && !hasProp(page, "snap")) return update2(page, dom2);
  $.pages[page.key] = page;
  $.snaps[page.snap] = dom2;
  setFragmentElements(page);
  return page;
};
var update2 = (page, snapshot = null) => {
  const state = page.key in $.pages ? $.pages[page.key] : create(page);
  if (snapshot) {
    $.snaps[state.snap] = snapshot;
    page.title = getTitle(snapshot);
  }
  return Object.assign(state, page);
};
var get = (key) => {
  if (!key) {
    if ($.history === null) {
      warn2("Missing history state reference, page cannot be returned");
      return;
    }
    key = $.history.key;
  }
  if (key in $.pages) {
    return {
      get page() {
        return $.pages[key];
      },
      get dom() {
        return parse($.snaps[$.pages[key].snap]);
      }
    };
  }
  error2(`No record exists: ${key}`);
};
var getSnapDom = (key) => {
  const uuid3 = typeof key === "number" ? key : typeof key === "string" && key.charCodeAt(0) === 47 /* FWD */ ? $.pages[key].snap : $.page.snap;
  return parse($.snaps[uuid3]);
};
var mounted = () => {
  const live2 = m();
  for (const key of $.mounted) {
    if (!$.instances.has(key)) continue;
    const instance = $.instances.get(key);
    const { scope } = instance;
    if (scope.status === 2 /* MOUNT */ || scope.status === 3 /* MOUNTED */) {
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
      warn2("Missing history state reference, page cannot be returned");
      return;
    }
    key = $.history.key;
  }
  if (hasProp($.pages, key)) return $.pages[key];
  error2(`No page record exists for: ${key}`);
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
            warn2(`Invalid ${nodeName} value, expected: y:number or x:number`, element2);
          }
        } else if (name === "scroll") {
          if (isNumber.test(value)) {
            state.scrollY = +value;
          } else {
            warn2(`Invalid ${nodeName} value, expected: number`, element2);
          }
        } else if (isBoolean.test(value) && !isPrefetch.test(nodeName)) {
          state[name] = value === "true";
        } else if (isNumeric.test(value)) {
          state[name] = +value;
        } else {
          if (name === "history" && value !== "push" && value !== "replace") {
            warn2(`Invalid ${nodeName} value, expected: false, push or replace`, element2);
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
    warn2(`Invalid pathname: ${path}`);
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
      warn2(`Pending request aborted: ${url}`);
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
    page2 ? info2(`Reverse fetch completed: ${page2.rev}`) : warn2(`Reverse fetch failed: ${state.rev}`);
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
        warn2(`Request aborted: ${state.rev}`);
      } else {
        warn2(`Request in transit: ${state.key}`);
      }
      return false;
    }
  }
  if (!emit("fetch", state)) {
    warn2(`Request cancelled via dispatched event: ${state.key}`);
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
var removeNode2 = (curNode, parentNode, ctx2, skipKeys = true) => {
  removeNode(curNode);
  parentNode && parentNode.removeChild(curNode);
  walkNodes(curNode, skipKeys, ctx2);
};
var morphEqual = (curElement) => {
  if (curElement.nodeType === 1 /* ELEMENT_NODE */) {
    if (curElement.hasAttribute($.qs.$node)) {
      readNode(curElement);
    }
  }
};
var morphChildren = (curElement, newElement, ctx2) => {
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
              if (curMatch = ctx2.$lookup.get(newKey)) {
                if (curNextSibling && curNextSibling.isEqualNode(curMatch)) {
                  isCompatible = false;
                } else {
                  curElement.insertBefore(
                    curMatch,
                    curNode
                  );
                  if (curKey) {
                    ctx2.$remove.add(curKey);
                  } else {
                    removeNode2(
                      curNode,
                      curElement,
                      ctx2
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
              ctx2
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
        ctx2.$remove.add(curKey);
      } else {
        removeNode2(
          curNode,
          curElement,
          ctx2
        );
      }
      curNode = curNextSibling;
    }
    if (newKey && (curMatch = ctx2.$lookup.get(newKey)) && matchName(curMatch.nodeName, newNode.nodeName)) {
      curElement.appendChild(curMatch);
      morphElement(curMatch, newNode, ctx2);
    } else {
      if (newNode.actualize) newNode = newNode.actualize(curElement.ownerDocument || document);
      curElement.appendChild(newNode);
      addedNode2(newNode, ctx2);
    }
    newNode = newNextSibling;
    curNode = curNextSibling;
  }
  cleanNode(
    curElement,
    curNode,
    curKey,
    ctx2
  );
  formNodes(
    curElement,
    newElement
  );
};
var morphElement = (curElement, newElement, ctx2) => {
  const newKey = getKey2(newElement);
  newKey && ctx2.$lookup.delete(newKey);
  if (curElement.isEqualNode(newElement)) return;
  const morphAttr = curElement.getAttribute($.qs.$morph);
  if (morphAttr === "false") return;
  morphAttr !== "children" && morphAttributes(curElement, newElement);
  curElement.nodeName === "TEXTAREA" ? textarea(curElement, newElement) : morphChildren(curElement, newElement, ctx2);
};
var walkNodes = (curNode, skipKeys, ctx2) => {
  if (curNode.nodeType !== 1 /* ELEMENT_NODE */) return;
  let curChild = curNode.firstChild;
  while (curChild) {
    let key;
    if (skipKeys && (key = getKey2(curChild))) {
      ctx2.$remove.add(key);
    } else {
      removeNode(curChild);
      curChild.firstChild && walkNodes(curChild, skipKeys, ctx2);
    }
    curChild = curChild.nextSibling;
  }
};
var addedNode2 = (curElement, ctx2) => {
  (curElement.nodeType === 1 /* ELEMENT_NODE */ || curElement.nodeType === 11 /* FRAGMENT_NODE */) && addedNode(curElement);
  let curChild = curElement.firstChild;
  while (curChild) {
    const nextSibling = curChild.nextSibling;
    const curKey = getKey2(curChild);
    if (curKey) {
      const unmatchElement = ctx2.$lookup.get(curKey);
      if (unmatchElement && matchName(curChild.nodeName, unmatchElement.nodeName)) {
        curChild.parentNode.replaceChild(unmatchElement, curChild);
        morphElement(unmatchElement, curChild, ctx2);
      } else {
        addedNode2(curChild, ctx2);
      }
    } else {
      addedNode2(curChild, ctx2);
    }
    curChild = nextSibling;
  }
};
var cleanNode = (curElement, curNode, curKey, ctx2) => {
  while (curNode) {
    const curNextSibling = curNode.nextSibling;
    if (curKey = getKey2(curNode)) {
      ctx2.$remove.add(curKey);
    } else {
      removeNode2(curNode, curElement, ctx2);
    }
    curNode = curNextSibling;
  }
};
var indexNode = (fromNode, ctx2) => {
  if (fromNode.nodeType === 1 /* ELEMENT_NODE */ || fromNode.nodeType === 11 /* FRAGMENT_NODE */) {
    let childNode = fromNode.firstChild;
    while (childNode) {
      const key = getKey2(childNode);
      key && ctx2.$lookup.set(key, childNode);
      indexNode(childNode, ctx2);
      childNode = childNode.nextSibling;
    }
  }
};
var morph = (curNode, snapNode) => {
  let newNode = snapNode.cloneNode(true);
  const ctx2 = o();
  ctx2.$remove = s();
  ctx2.$lookup = m();
  newNode.nodeType === 11 /* FRAGMENT_NODE */ && (newNode = newNode.firstElementChild);
  indexNode(curNode, ctx2);
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
    morphElement(morphedNode, newNode, ctx2);
    if (ctx2.$remove.size > 0) {
      for (const key of ctx2.$remove) {
        if (ctx2.$lookup.has(key)) {
          const node = ctx2.$lookup.get(key);
          removeNode2(node, node.parentNode, ctx2, false);
        }
      }
    }
  }
  if (morphedNode !== curNode && curNode.parentNode) {
    if (morphedNode.actualize) morphedNode = morphedNode.actualize(curNode.ownerDocument || document);
    curNode.parentNode.replaceChild(morphedNode, curNode);
  }
  ctx2.$lookup.clear();
  ctx2.$remove.clear();
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
  forNode(selector2, (targetNode) => {
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
  });
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
    if (!emit("prefetch", route2, target)) return;
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
    if (!emit("prefetch", route2, entry.target)) return entries.unobserve(entry.target);
    const response = await fetch(create(route2));
    if (response) {
      entries.unobserve(entry.target);
    } else {
      warn2(`Prefetch will retry at next intersection for: ${route2.key}`);
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
c.qs = null;
function c(node) {
  const hasResource = $.resources.has(node);
  if (c.qs === null) c.qs = b().querySelectorAll(`${$.page.target.join()},[${$.qs.$target}]`);
  const e = c.qs;
  const s2 = e.length;
  let i = -1;
  while (++i < s2) if (e[i].contains(node)) return hasResource && false;
  return hasResource && true;
}
var isNode = (type, node) => {
  if ($.eval && isResourceTag.test(node.nodeName)) {
    node.parentNode.nodeName === "HEAD" ? morphHead(type, node) : c(node) ? $.resources.delete(node) : $.resources.add(node);
    return false;
  }
  return true;
};
var added = (nodes, length) => {
  let i = -1;
  while (++i < length) {
    const node = nodes[i];
    if (node.nodeType !== 1 /* ELEMENT_NODE */) continue;
    if (isNode("appendChild", node) && node instanceof HTMLElement) {
      if (node.hasAttribute($.qs.$component)) {
        getComponents(node, getSelectorFromElement(node.parentElement));
      }
    }
  }
};
var remove = (nodes, length) => {
  let i = -1;
  while (++i < length) {
    const node = nodes[i];
    if (node.nodeType !== 1 /* ELEMENT_NODE */) continue;
    if (isNode("removeChild", node) && node instanceof HTMLElement) {
      const ref2 = node.getAttribute($.qs.$ref);
      if (node.getAttribute($.qs.$ref)) {
        unmount(node, ref2.split(","));
      }
    }
  }
};
var resources = new MutationObserver(([mutation]) => {
  if (mutation.type !== "childList") return;
  const isAdded = mutation.addedNodes.length;
  const isRemove = mutation.removedNodes.length;
  if (isAdded === 0 && isRemove === 0) return;
  if (isAdded > 0) added(mutation.addedNodes, isAdded);
  if (isRemove > 0) remove(mutation.removedNodes, isRemove);
});
var connect6 = () => {
  if ($.observe.mutations) return;
  resources.observe(h(), { childList: true });
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
  c.qs = null;
  $.observe.mutations = false;
};

// src/observe/proximity.ts
var inRange = ({
  clientX,
  clientY
}, bounds) => clientX <= bounds.right && clientX >= bounds.left && clientY <= bounds.bottom && clientY >= bounds.top;
var setBounds = (target) => {
  const rect = target.getBoundingClientRect();
  const attr2 = target.getAttribute($.qs.$proximity);
  const distance = isNumber.test(attr2) ? Number(attr2) : $.config.proximity.distance;
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
        if (!emit("prefetch", page, target)) return disconnect5();
        const prefetch2 = await fetch(page);
        if (prefetch2) {
          targets2.splice(node, 1);
          wait2 = false;
          if (targets2.length === 0) {
            disconnect5();
            info2("Proximity observer disconnected");
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
var morphHead2 = async (page, curHead, newHead) => {
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
      if (!emit("resource", page, node)) continue;
      let resolve;
      const promise = new Promise((_) => resolve = _);
      node.addEventListener("load", () => resolve());
      node.addEventListener("error", (error3) => {
        warn2(`Resource <${node.nodeName.toLowerCase()}> failed:`, error3);
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
    const components = $.registry.size > 0;
    const events = "render" in $.events;
    for (const id of elements2) {
      const domNode = $.fragments.get(id);
      const newNode = snapDom.body.querySelector(id);
      if (!newNode || !domNode) continue;
      if (events && !emit("render", page, domNode, newNode)) continue;
      if (ctx.marks.has(newNode.id)) {
        newNode.setAttribute($.qs.$ref, domNode.getAttribute($.qs.$ref));
      } else {
        if (domNode.isEqualNode(newNode)) continue;
        components && add(newNode);
        morph(domNode, newNode);
      }
    }
  }
  ctx.store && update(snapDom, page.snap);
  page.type !== 6 /* VISIT */ && patch("type", 6 /* VISIT */);
  if (page.location.hash !== nil) {
    const anchor = pageDom.querySelector(page.location.hash);
    anchor && anchor.scrollIntoView();
  }
  scrollTo(page.scrollX, page.scrollY);
};
var update3 = (page) => {
  disconnect2();
  disconnect3();
  disconnect5();
  disconnect4();
  disconnect();
  connect3();
  $.eval === false && (document.title = page.title);
  const snapDom = getSnapDom(page.snap);
  morphHead2(page, h(), snapDom.head);
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
  console.log(api);
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
    replace2(page);
  }
  return page;
};
var replace2 = ({
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
  debug2(`History replaceState: ${key}`);
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
  debug2(`History pushState: ${key}`);
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
    if (!emit("popstate", $.pages[spx2.key])) return;
    const { type, key } = update3($.pages[spx2.key]);
    debug2(`History popState ${type === 4 /* REVERSE */ ? "session" : "reverse"}: ${key}`);
  } else {
    debug2(`History popState fetch: ${spx2.key}`);
    spx2.type = 5 /* POPSTATE */;
    if (!emit("popstate", spx2)) return;
    const page = await fetch(spx2);
    if (!page) return location.assign(spx2.key);
    const key = getKey(location);
    if (page.key === key) {
      debug2(`History popState fetch Complete: ${spx2.key}`);
      page.target = [];
      page.selector = null;
      update3(page);
    } else if (has(key)) {
      update3($.pages[key]);
    } else {
      const data = create(getRoute(key, 5 /* POPSTATE */));
      if (!emit("popstate", data)) return;
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
var not = (attr2, name) => {
  const prefix = `:not([${attr2}${name}=false]):not([${attr2}link]):not`;
  switch (name.charCodeAt(0)) {
    case 104 /* LCH */:
      return `${prefix}([${attr2}proximity]):not([${attr2}intersect])`;
    case 105 /* LCI */:
      return `${prefix}([${attr2}hover]):not([${attr2}proximity])`;
    case 112 /* LCP */:
      return `${prefix}([${attr2}intersect]):not([${attr2}hover])`;
  }
};
var evaluators = (options2, attr2, disable) => {
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
    if ($.eval === false || $.config.eval[tag] === false) return `${tag}[${attr2}eval]:${disable}`;
    if ($.config.eval[tag] === true) return `${tag}:${disable}`;
    const defaults = tag === "link" ? `${tag}[rel=stylesheet]:${disable}` : `${tag}:${disable}${tag === "script" ? `:not([${attr2}eval=hydrate])` : ""}`;
    if ($.config.eval[tag] === null) return defaults;
    if (Array.isArray($.config.eval[tag])) {
      if ($.config.eval[tag].length > 0) {
        return $.config.eval[tag].map((s2) => `${s2}:${disable}`).join(",");
      } else {
        warn2(`Missing eval ${tag} value, default will be used`);
        return defaults;
      }
    }
    error2(`Invalid "eval" ${tag} value, expected boolean or array type`);
  };
};
var fragments = (options2) => {
  const elements2 = [];
  if ("fragments" in options2 && Array.isArray(options2.fragments) && options2.fragments.length > 0) {
    for (const fragment of options2.fragments) {
      const charCode = fragment.charCodeAt(0);
      if (charCode === 46 /* DOT */ || charCode === 91 /* LSB */) {
        warn2(`Invalid fragment, only element id values allowed: "${fragment}"`);
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
    $.logLevel === 3 /* DEBUG */ && debug2("DEBUG MODE");
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
  const attr2 = schema === "spx" ? "spx" : schema.endsWith("-") ? schema : schema === null ? nil : `${schema}-`;
  const href = `:not([${attr2}disable]):not([href^=\\#])`;
  const disable = `not([${attr2}eval=false])`;
  const evals = evaluators(options2, attr2, disable);
  $.config.fragments = fragments(options2);
  $.config.schema = attr2;
  $.config.index = null;
  $.memory.bytes = 0;
  $.memory.visits = 0;
  $.memory.limit = $.config.maxCache;
  $.qs.$attrs = new RegExp(`^href|${attr2}(${"hydrate|append|prepend|target|progress|threshold|scroll|position|proximity|hover|cache|history" /* NAMES */})$`, "i");
  $.qs.$find = new RegExp(`${attr2}(?:node|bind|component)|@[a-z]|[a-z]:[a-z]`, "i");
  $.qs.$param = new RegExp(`^${attr2}[a-zA-Z0-9-]+:`, "i");
  $.qs.$target = `${attr2}target`;
  $.qs.$fragment = `${attr2}fragment`;
  $.qs.$fragments = `[${$.qs.$fragment}]`;
  $.qs.$targets = `[${attr2}target]:not(a[spx-target]):not([${attr2}target=false])`;
  $.qs.$morph = `${attr2}morph`;
  $.qs.$eval = `${attr2}eval`;
  $.qs.$intersector = `[${attr2}intersect]${not(attr2, "intersect")}`;
  $.qs.$track = `[${attr2}track]:not([${attr2}track=false])`;
  $.qs.$component = `${attr2}component`;
  $.qs.$node = `${attr2}node`;
  $.qs.$bind = `${attr2}bind`;
  $.qs.$ref = "data-spx";
  $.qs.$href = `a${$.config.annotate ? `[${attr2}link]` : ""}${href}`;
  $.qs.$script = evals("script");
  $.qs.$style = evals("style");
  $.qs.$link = evals("link");
  $.qs.$meta = evals("meta");
  $.qs.$hydrate = `script[${attr2}eval=hydrate]:${disable}`;
  $.qs.$resource = `link[rel=stylesheet][href*=\\.css]:${disable},script[src*=\\.js]:${disable}`;
  $.qs.$data = `${attr2}data:`;
  $.qs.$proximity = `a[${attr2}proximity]${href}${not(attr2, "proximity")}`;
  $.qs.$intersect = `a${href}${not(attr2, "intersect")}`;
  $.qs.$hover = $.config.hover !== false && $.config.hover.trigger === "href" ? `a${href}${not(attr2, "hover")}` : `a[${attr2}hover]${href}${not(attr2, "hover")}`;
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
    warn2(`Drag occurance, visit cancelled: ${key}`);
    handle.drag = true;
    target.removeEventListener(`${pointer}move`, move);
  };
  target.addEventListener(`${pointer}move`, move, { once: true });
  if (handle.drag === true) {
    handle.drag = false;
    return handle(event);
  }
  target.removeEventListener(`${pointer}move`, move);
  const click = (event2, state, subsequent = true) => {
    event2.preventDefault();
    $.pages[state.key].ts = ts();
    $.pages[state.key].visits = state.visits + 1;
    $.pages[state.key].target = $.pages[state.rev].target = state.target;
    $.pages[state.key].selector = $.pages[state.rev].selector = state.selector;
    $.pages[state.rev].scrollX = window.scrollX;
    $.pages[state.rev].scrollY = window.scrollY;
    if ("visit" in $.events && !emit("visit", $.pages[state.key], event2)) return;
    if (isRoute) {
      info2(`Identical pathname, page visit skipped: ${key}`);
    } else {
      replace2($.pages[state.rev]);
      if (subsequent) {
        push(state);
        update3(state);
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
    const page = update2(attrs);
    target.onclick = (event2) => click(event2, page);
  } else if (XHR.$transit.has(key)) {
    cancel(key);
    info2(`Request in transit: ${key}`);
    const page = $.pages[key];
    target.onclick = (event2) => click(event2, page, false);
  } else {
    cancel();
    cleanup(key);
    const page = create(getRoute(target, 6 /* VISIT */));
    fetch(page);
    target.onclick = (event2) => click(event2, page, false);
  }
};
async function visit(state) {
  if (state.progress) progress.start(state.progress);
  try {
    const page = await wait(state);
    if (page) {
      if (page.history === "replace") {
        replace2(page);
      } else {
        push(page);
      }
      update3(page);
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
      update3(page);
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
  Object.defineProperty(ctx, "refs", {
    configurable: false,
    enumerable: false,
    get() {
      return this.snaps.length > 0 ? this.snaps[this.snaps.length - 1][1] : m();
    }
  });
  Object.defineProperties($, {
    prev: {
      get: () => $.pages[$.history.rev]
    },
    page: {
      get: () => $.pages[$.history.key]
    },
    snapDom: {
      get: () => parse($.snaps[$.page.snap])
    }
  });
  const DOMContentLoaded = () => {
    const page = set(state, takeSnapshot());
    connect9();
    connect3();
    connect4();
    connect5();
    connect7();
    connect2();
    connect6();
    emit("connect", page);
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
    $.registry.clear();
  }
  clear();
  if ($.config.globalThis) delete window.spx;
  info2("Disconnected");
};

// src/index.ts
function spx(options2 = {}) {
  if (!isBrowser) {
    return error2("Invalid runtime environment: window is undefined.");
  }
  if (!spx.supported) {
    return error2("Browser does not support SPX");
  }
  if (!window.location.protocol.startsWith("http")) {
    return error2("Invalid protocol, SPX expects HTTPS or HTTP protocol");
  }
  configure(options2);
  if ($.config.globalThis && window && !("spx" in window)) {
    defineGetter(window, "spx", spx);
  }
  const promise = initialize2();
  return async function(callback) {
    const state = await promise;
    if (callback.constructor.name === "AsyncFunction") {
      try {
        await callback(state);
      } catch (e) {
        console.error(e);
        error2("Connection Error", e);
      }
    } else {
      callback(state);
    }
    info2("Connection Established");
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
      replace: replace2,
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
  for (const { scope: { alias, instanceOf } } of $.instances.values()) {
    const id = ids ? ids.includes(alias) ? alias : ids.includes(instanceOf) ? instanceOf : null : null;
    mounted2[id || !ids && (alias || instanceOf)] = Array.isArray(mounted2[id || !ids && instanceOf]) ? [...mounted2[id || !ids && instanceOf], component] : component;
  }
  return mounted2;
}
function component(identifer, callback) {
  const instances = [];
  for (const instance of instances.values()) {
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
      error2(`Named component registration expects 2 parameters, recieved ${classes.length}.`, classes);
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
  return [
    "config",
    "snaps",
    "pages",
    "observers",
    "fragments",
    "instances",
    "mounted",
    "registry",
    "reference",
    "memory"
  ].reduceRight((target, prop) => Object.defineProperty(target, prop, {
    get: prop === "memory" ? () => $[prop].size = size($[prop].bytes) : () => $[prop],
    enumerable: false,
    configurable: false
  }), o());
}
async function reload() {
  $.page.type = 9 /* RELOAD */;
  const page = await fetch($.page);
  if (page) {
    info2("Triggered reload, page was re-cached");
    return update3(page);
  }
  warn2("Reload failed, triggering refresh (cache will purge)");
  return location.assign($.page.key);
}
async function fetch2(url) {
  const link = getRoute(url, 2 /* FETCH */);
  if (link.location.origin !== origin) {
    error2("Cross origin fetches are not allowed");
    return;
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
  if (route2.location.origin !== origin) error2("Cross origin fetches are not allowed");
  const dom2 = await http(route2.key, { type: "document" });
  if (!dom2) error2(`Fetch failed for: ${route2.key}`, dom2);
  await fn.call(page, dom2);
  if (pushState === "replace") {
    page.title = dom2.title;
    const state = update2(Object.assign(page, route2), takeSnapshot(dom2));
    replace2(state);
    return state;
  } else {
    return update3(set(route2, takeSnapshot(dom2)));
  }
}
function capture(targets2) {
  const page = getPage();
  if (!page) return;
  const dom2 = getSnapDom();
  targets2 = Array.isArray(targets2) ? targets2 : page.target;
  if (targets2.length === 1 && targets2[0] === "body") {
    morph(dom2.body, b());
    update2(page, takeSnapshot(dom2));
    return;
  }
  const selector2 = targets2.join(",");
  const current = b().querySelectorAll(selector2);
  forNode(dom2.body.querySelectorAll(selector2), (node, i) => {
    morph(node, current[i]);
  });
  update2(page, takeSnapshot(dom2));
}
async function prefetch(link) {
  const path = getRoute(link, 1 /* PREFETCH */);
  if (has(path.key)) {
    warn2(`Cache already exists for ${path.key}, prefetch skipped`);
    return;
  }
  const prefetch2 = await fetch(create(path));
  if (prefetch2) return prefetch2;
  error2(`Prefetch failed for ${path.key}`);
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
    replace2(page);
    update3(page);
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
  return has(goto.key) ? navigate(goto.key, update2(merge)) : navigate(goto.key, create(merge));
}

export { spx as default };
