var __defProp = Object.defineProperty;
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
var { assign, keys, entries } = Object;
var defineProp = Object.defineProperty;
var defineProps = Object.defineProperties;
var object = Object.create;
var { isArray } = Array;
var toArray = Array.from;
var nil = "";
var { warn, info, error, debug } = console;
var d = () => document.body;
var h = () => document.head;
var o = (value) => value ? assign(object(null), value) : object(null);
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
var $ = o({
  index: "",
  eval: true,
  patched: false,
  loaded: false,
  logLevel: 2,
  qs: o(),
  config: o({
    fragments: ["body"],
    timeout: 3e4,
    globalThis: true,
    schema: "spx-",
    manual: false,
    logLevel: 2,
    cache: true,
    components: null,
    maxCache: 100,
    reverse: true,
    preload: null,
    annotate: false,
    eval: o({
      script: null,
      style: null,
      link: null,
      meta: false
    }),
    hover: o({
      trigger: "href",
      threshold: 250
    }),
    intersect: o({
      rootMargin: "0px 0px 0px 0px",
      threshold: 0
    }),
    proximity: o({
      distance: 75,
      threshold: 250,
      throttle: 500
    }),
    progress: o({
      bgColor: "#111",
      barHeight: "3px",
      minimum: 0.08,
      easing: "linear",
      speed: 200,
      threshold: 500,
      trickle: true,
      trickleSpeed: 200
    })
  }),
  fragments: m(),
  components: o({
    $registry: m(),
    $instances: m(),
    $connected: s(),
    $elements: m(),
    $reference: p({ get: (target, key) => $.components.$instances.get(target[key]) })
  }),
  events: o(),
  observe: o(),
  memory: o(),
  pages: o(),
  snaps: o(),
  resources: s()
});

// src/shared/logs.ts
function log(type, message, context2) {
  const LEVEL = $.logLevel;
  const PREFIX = "\x1B[96mSPX\x1B[0m ";
  if (isArray(message))
    message = message.join(" ");
  if ((type === 2 /* INFO */ || type === 1 /* VERBOSE */) && (LEVEL === 1 /* VERBOSE */ || LEVEL === 2 /* INFO */)) {
    info(`${PREFIX}%c${message}`, `color: ${context2 || "#999" /* GRAY */};`);
  } else if (type <= 3 /* WARN */ && LEVEL === 3 /* WARN */) {
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
}

// src/shared/regexp.ts
var isPender = /\b(?:append|prepend)/;
var Whitespace = /\s+/g;
var isBoolean = /^\b(?:true|false)$/i;
var isNumber = /^\d*\.?\d+$/;
var isNumeric = /^(?:[.-]?\d*\.?\d+|NaN)$/;
var isPrefetch = /\b(?:intersect|hover|proximity)\b/;
var isResourceTag = /\b(?:SCRIPT|STYLE|LINK)\b/;
var isArray2 = /\[(['"]?.*['"]?,?)\]/;
var inPosition = /[xy]\s*|\d*\.?\d+/gi;

// src/shared/utils.ts
function splitAttrArrayValue(input2) {
  let value = input2.replace(/\s+,/g, ",").replace(/,\s+/g, ",").replace(/['"]/g, nil);
  if (value.charCodeAt(0) === 91) {
    if (/^\[\s*\[/.test(value) || /,/.test(value) && /\]$/.test(value)) {
      value = value.replace(/^\[/, nil).replace(/\]$/, nil);
    }
  }
  return value.split(/,|\|/);
}
function attrJSON(attr, string) {
  try {
    const json = (string || attr).replace(/\\'|'/g, (m2) => m2[0] === "\\" ? m2 : '"').replace(/\[|[^\s[\]]*|\]/g, (match) => /[[\]]/.test(match) ? match : match.split(",").map(
      (value) => value.replace(/^(\w+)$/, '"$1"').replace(/^"([\d.]+)"$/g, "$1")
    ).join(",")).replace(/([a-zA-Z0-9_-]+)\s*:/g, '"$1":').replace(/:\s*([$a-zA-Z_-]+)\s*([,\]}])/g, ':"$1"$2').replace(/,([\]}])/g, "$1").replace(/([a-zA-Z_-]+)\s*,/g, '"$1",').replace(/([\]},\s]+)?"(true|false)"([\s,{}\]]+)/g, "$1$2$3");
    return JSON.parse(json);
  } catch (err) {
    log(
      5 /* ERROR */,
      "Invalid JSON expression in attribute value: " + JSON.stringify(attr || string, null, 2),
      err
    );
    return string;
  }
}
function last(input2) {
  return input2[input2.length - 1];
}
function equalizeWS(input2) {
  return input2.replace(/\s+/g, " ").trim();
}
function escSelector(input2) {
  return input2.replace(/\./g, "\\.").replace(/@/g, "\\@").replace(/:/g, "\\:");
}
function attrValueNotation(input2) {
  return equalizeWS(input2.replace(/[\s .]+/g, ".")).replace(/\s+/g, " ").trim().split(/[ ,]/);
}
function attrValueFromType(input2) {
  if (isNumeric.test(input2))
    return input2 === "NaN" ? NaN : +input2;
  if (isBoolean.test(input2))
    return input2 === "true";
  const code = input2.charCodeAt(0);
  if (code === 123 || code === 91)
    return attrJSON(input2);
  return input2;
}
function onNextTickResolve() {
  return new Promise((resolve) => setTimeout(() => resolve(), 1));
}
function onNextTick(callback) {
  return setTimeout(() => callback(), 1);
}
function promiseResolve() {
  return Promise.resolve();
}
function decodeEntities(string) {
  const textarea2 = document.createElement("textarea");
  textarea2.innerHTML = string;
  return textarea2.value;
}
function ts() {
  return (/* @__PURE__ */ new Date()).getTime();
}
function hasProps(object2) {
  return (property) => {
    if (!property)
      return false;
    if (typeof property === "string")
      return property in object2;
    return property.every((prop) => prop in object2);
  };
}
function hasProp(object2, property) {
  return object2 ? property in object2 : false;
}
function defineGetter(object2, name, value) {
  if (name !== void 0) {
    defineProp(object2, name, { get: () => value });
    return object2;
  } else {
    return (name2, value2, options2) => {
      if (hasProp(object2, name2))
        return;
      const get2 = () => value2;
      return defineProp(object2, name2, options2 ? assign(options2, { get: get2 }) : { get: get2 });
    };
  }
}
function targets(page) {
  if (hasProp(page, "target")) {
    if (page.target.length === 1 && page.target[0] === "body")
      return page.target;
    return page.target.filter((v, i, a) => v !== "body" && v !== nil && v.indexOf(",") === -1 ? a.indexOf(v) === i : false);
  } else if ($.config.fragments.length === 1 && $.config.fragments[0] === "body") {
    return ["body"];
  }
  return [];
}
function selector(target) {
  if (target.length === 1 && target[0] === "body")
    return "body";
  return target.length === 0 ? null : target.join(",");
}
function isEmpty(input2) {
  const T = typeof input2;
  if (T === "object") {
    for (const _ in input2)
      return false;
    return true;
  } else if (T === "string") {
    return input2[0] === void 0;
  } else if (isArray(input2)) {
    return input2.length > 0;
  }
  return false;
}
function glue(...input2) {
  return input2.join(nil);
}
var uuid = function uuid2(length = 5) {
  const k = Math.random().toString(36).slice(-length);
  if (uuid2.$cache.has(k))
    return uuid2(length);
  uuid2.$cache.add(k);
  return k;
};
uuid.$cache = s();
function chunk(size2 = 2) {
  return (acc, value) => {
    const length = acc.length;
    const chunks = length < 1 || acc[length - 1].length === size2 ? acc.push([value]) : acc[length - 1].push(value);
    return chunks && acc;
  };
}
function size(bytes) {
  const kb = 1024;
  const mb = 1048576;
  const gb = 1073741824;
  if (bytes < kb)
    return bytes + " B";
  else if (bytes < mb)
    return (bytes / kb).toFixed(1) + " KB";
  else if (bytes < gb)
    return (bytes / mb).toFixed(1) + " MB";
  else
    return (bytes / gb).toFixed(1) + " GB";
}
function downcase(input2) {
  return input2[0].toLowerCase() + input2.slice(1);
}
function upcase(input2) {
  return input2[0].toUpperCase() + input2.slice(1);
}
function kebabCase(input2) {
  return /[A-Z]/.test(input2) ? input2.replace(/(.{1})([A-Z])/g, "$1-$2").toLowerCase() : input2;
}
function camelCase(input2) {
  return /[_-]/.test(downcase(input2)) ? input2.replace(/([_-]+).{1}/g, (x, k) => x[k.length].toUpperCase()) : input2;
}
function forNode(selector2, callback) {
  const nodes = typeof selector2 === "string" ? d().querySelectorAll(selector2) : selector2;
  const count = nodes.length;
  if (count === 0)
    return;
  for (let i = 0; i < count; i++)
    if (callback(nodes[i], i) === false)
      break;
}
function forEach(callback, array) {
  if (arguments.length === 1)
    return (array2) => forEach(callback, array2);
  const len = array.length;
  if (len === 0)
    return;
  for (let i = 0; i < len; i++)
    callback(array[i], i, array);
}
function empty(object2) {
  for (const prop in object2)
    delete object2[prop];
}

// src/shared/patch.ts
function patchSetAttribute() {
  if ($.patched)
    return;
  $.patched = true;
  const n = Element.prototype.setAttribute;
  const e = document.createElement("i");
  Element.prototype.setAttribute = function setAttribute(name, value) {
    if (name.indexOf("@") < 0)
      return n.call(this, name, value);
    e.innerHTML = `<i ${name}="${value}"></i>`;
    const attr = e.firstElementChild.getAttributeNode(name);
    e.firstElementChild.removeAttributeNode(attr);
    this.setAttributeNode(attr);
  };
}

// src/app/progress.ts
function ProgressBar() {
  const pending = [];
  const node = document.createElement("div");
  let status = null;
  let timeout;
  let element = null;
  const style = ({ bgColor, barHeight, speed, easing }) => {
    node.style.cssText = glue(
      "pointer-events:none;",
      `background-color:${bgColor};`,
      `height:${barHeight};`,
      "position:fixed;",
      "display:block;",
      "z-index:2147483647;",
      "top:0;",
      "left:0;",
      "width:100%;",
      "will-change:opacity,transform;",
      `transition:transform ${speed}ms ${easing};`
    );
  };
  const percent = (n) => (-1 + n) * 100;
  const current = (n, min, max) => n < min ? min : n > max ? max : n;
  const render2 = () => {
    if (element)
      return element;
    node.style.setProperty("transform", `translateX(${percent(status || 0)}%)`);
    element = d().appendChild(node);
    return node;
  };
  const remove = () => {
    const dom = d();
    if (dom.contains(element)) {
      const animate = element.animate(
        { opacity: ["1", "0"] },
        { easing: "ease-out", duration: 100 }
      );
      animate.onfinish = () => {
        dom.removeChild(element);
        element = null;
      };
    } else {
      element = null;
    }
  };
  const dequeue = () => {
    const update3 = pending.shift();
    if (update3)
      update3(dequeue);
  };
  const enqueue = (call) => {
    pending.push(call);
    if (pending.length === 1)
      dequeue();
  };
  const set2 = (amount) => {
    amount = current(amount, $.config.progress.minimum, 1);
    status = amount === 1 ? null : amount;
    const progress2 = render2();
    enqueue((update3) => {
      progress2.style.setProperty("transform", `translateX(${percent(amount)}%)`);
      if (amount === 1) {
        setTimeout(() => {
          remove();
          update3();
        }, $.config.progress.speed * 2);
      } else {
        setTimeout(update3, $.config.progress.speed);
      }
    });
  };
  const inc = (amount) => {
    let n = status;
    if (!n)
      return start();
    if (n < 1) {
      if (typeof amount !== "number") {
        if (n >= 0 && n < 0.2)
          amount = 0.1;
        else if (n >= 0.2 && n < 0.5)
          amount = 0.04;
        else if (n >= 0.5 && n < 0.8)
          amount = 0.02;
        else if (n >= 0.8 && n < 0.99)
          amount = 5e-3;
        else
          amount = 0;
      }
      n = current(n + amount, 0, 0.994);
      return set2(n);
    }
  };
  const doTrickle = () => {
    setTimeout(() => {
      if (!status)
        return;
      inc();
      doTrickle();
    }, $.config.progress.trickleSpeed);
  };
  function start(threshold) {
    if (!$.config.progress)
      return;
    timeout = setTimeout(() => {
      if (!status)
        set2(0);
      if ($.config.progress.trickle)
        doTrickle();
    }, threshold || 0);
  }
  function done(force) {
    clearTimeout(timeout);
    if (!force && !status)
      return;
    inc(0.3 + 0.5 * Math.random());
    set2(1);
  }
  return { start, done, style };
}
var progress = ProgressBar();

// src/components/register.ts
function getComponentId(instance, identifier) {
  const name = instance.name;
  const original = identifier;
  identifier = downcase(identifier || name);
  if (!hasProp(instance, "connect")) {
    instance.connect = { id: identifier, state: {}, nodes: [] };
  }
  const has3 = hasProps(instance.connect);
  if (!has3("state"))
    instance.connect.state = {};
  if (!has3("nodes"))
    instance.connect.nodes = [];
  if (!has3("id"))
    instance.connect.id = identifier;
  if (identifier !== instance.connect.id) {
    identifier = camelCase(instance.connect.id);
  }
  if (name !== original && /^[A-Z]|[_-]/.test(instance.connect.id)) {
    log(3 /* WARN */, [
      `Component identifer name "${instance.connect.id}" must use camelCase format.`,
      `The identifer has been converted to "${identifier}"`
    ]);
  }
  return identifier;
}
function registerComponents(components, isValidID = false) {
  const { $registry } = $.components;
  for (const id in components) {
    const instance = components[id];
    const identifier = isValidID ? id : getComponentId(instance, id);
    if (!$registry.has(identifier)) {
      $registry.set(identifier, instance);
      log(1 /* VERBOSE */, `Component ${instance.name} registered using id: ${identifier}`, "#F48FB1" /* PINK */);
    }
  }
  if (!$.config.components)
    $.config.components = true;
}

// src/app/config.ts
function observers(options2) {
  for (const key of [
    "hover",
    "intersect",
    "proximity",
    "progress"
  ]) {
    if (hasProp(options2, key)) {
      if (options2[key] === false) {
        $.config[key] = false;
      } else if (typeof options2[key] === "object") {
        assign($.config[key], options2[key]);
      }
      delete options2[key];
    }
  }
  return options2;
}
function not(attr, name) {
  const prefix = `:not([${attr}${name}=false]):not([${attr}link])`;
  switch (name.charCodeAt(0)) {
    case 104 /* LCH */:
      return `${prefix}:not([${attr}proximity]):not([${attr}intersect])`;
    case 105 /* LCI */:
      return `${prefix}:not([${attr}hover]):not([${attr}proximity])`;
    case 112 /* LCP */:
      return `${prefix}:not([${attr}intersect]):not([${attr}hover])`;
  }
}
function evaluators(options2, attr, disable) {
  if ("eval" in options2) {
    if (options2.eval) {
      if (typeof options2.eval === "object") {
        const e = assign($.config.eval, options2.eval);
        $.eval = !(!e.link && !e.meta && !e.script && !e.style);
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
    if ($.config.eval[tag] === null)
      return defaults;
    if (isArray($.config.eval[tag])) {
      if ($.config.eval[tag].length > 0) {
        return $.config.eval[tag].map((s2) => `${s2}:${disable}`).join(",");
      } else {
        log(3 /* WARN */, `Missing eval ${tag} value, SPX will use defaults`);
        return defaults;
      }
    }
    log(4 /* TYPE */, `Invalid eval ${tag} value, expected boolean or array`);
  };
}
function fragments(options2) {
  const elements = [];
  if ("fragments" in options2 && isArray(options2.fragments) && options2.fragments.length > 0) {
    for (const fragment of options2.fragments) {
      const charCode = fragment.charCodeAt(0);
      if (charCode === 46 /* DOT */ || charCode === 91 /* LSB */) {
        log(3 /* WARN */, [
          `Invalid fragment selector "${fragment}" provided. Fragments must be id annotated values.`,
          "Use spx-target attributes for additional fragment selections."
        ]);
        continue;
      } else if (charCode === 35 /* HSH */) {
        elements.push(fragment.slice(1).trim());
      } else {
        elements.push(fragment.trim());
      }
    }
  } else {
    return ["body"];
  }
  return elements;
}
function configure(options2 = o()) {
  patchSetAttribute();
  defineProps($, {
    ready: {
      get: () => document.readyState === "complete"
    },
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
  assign($.config, observers(options2));
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
  assign($.qs, {
    $attrs: new RegExp(`^href|${attr}(${"hydrate|append|prepend|target|progress|threshold|scroll|position|proximity|hover|cache|history" /* NAMES */})$`, "i"),
    $find: new RegExp(`${attr}(?:node|bind|component)|@[a-z]|[a-z]:[a-z]`, "i"),
    $param: new RegExp(`^${attr}[a-zA-Z0-9-]+:`, "i"),
    $target: `${attr}target`,
    $targets: `[${attr}target]:not([${attr}target=false])`,
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
}

// src/shared/dom.ts
function parse(HTMLString) {
  return new DOMParser().parseFromString(HTMLString, "text/html");
}
function takeSnapshot(dom) {
  return (dom || document).documentElement.outerHTML;
}
function getTitle(dom) {
  const title = dom.indexOf("<title");
  if (title === -1)
    return nil;
  const start = dom.indexOf(">", title) + 1;
  const end = dom.indexOf("</title", start);
  return decodeEntities(dom.slice(start, end).trim());
}

// src/app/events.ts
function emit(name, ...args) {
  const isCache = name === "before:cache";
  if (isCache)
    args[1] = parse(args[1]);
  let returns = true;
  forEach((argument) => {
    const returned = argument.apply(null, args);
    if (isCache) {
      if (returned instanceof Document) {
        returns = returned.documentElement.outerHTML;
      } else {
        if (typeof returns !== "string")
          returns = returned !== false;
      }
    } else {
      returns = returned !== false;
    }
  }, $.events[name] || []);
  return returns;
}
function on(name, callback, scope) {
  if (!(name in $.events))
    $.events[name] = [];
  return $.events[name].push(scope ? callback.bind(scope) : callback) - 1;
}
function off(name, callback) {
  if (name in $.events) {
    const events = $.events[name];
    if (events && typeof callback === "number") {
      events.splice(callback, 1);
      log(2 /* INFO */, `Removed ${name} event listener (id: ${callback})`);
      if (events.length === 0)
        delete $.events[name];
    } else {
      const live = [];
      if (events && callback) {
        for (let i = 0, s2 = events.length; i < s2; i++) {
          if (events[i] !== callback) {
            live.push(events[i]);
          } else if (name !== "x") {
            log(2 /* INFO */, `Removed ${name} event listener (id: ${i})`);
          }
        }
      }
      if (live.length) {
        $.events[name] = live;
      } else {
        delete $.events[name];
      }
    }
  } else {
    log(3 /* WARN */, `There are no ${name} event listeners`);
  }
  return this;
}

// src/observe/components.ts
var components_exports = {};
__export(components_exports, {
  connect: () => connect3,
  disconnect: () => disconnect2,
  hook: () => hook,
  mount: () => mount,
  teardown: () => teardown
});

// src/morph/walk.ts
function walkElements(node, callback) {
  if (callback(node) === false)
    return;
  let e;
  let i;
  if (node.firstElementChild) {
    i = 0;
    e = node.children[i];
  }
  while (e) {
    if (e)
      walkElements(e, callback);
    e = node.children[++i];
  }
}

// src/components/listeners.ts
function isValidEvent(eventName, node) {
  if (`on${eventName}` in node)
    return true;
  log(5 /* ERROR */, [
    `Invalid event name "${eventName}" provided. No such event exists in the DOM API.`,
    "Only known event listeners can be attached."
  ], node);
  return false;
}
function eventAttrs(instance, event, node) {
  const method = instance[event.method];
  return function handle2(e) {
    if (event.params) {
      if (!hasProp(e, "attrs"))
        defineGetter(e, "attrs", o());
      assign(e.attrs, event.params);
    }
    method.call(instance, e);
  };
}
function removeEvent(instance, event) {
  if (!event.attached)
    return;
  event.listener.abort();
  event.listener = new AbortController();
  event.options.signal = event.listener.signal;
  event.attached = false;
  $.components.$elements.delete(event.dom);
  log(1 /* VERBOSE */, [
    `Detached ${event.key} ${event.eventName} event from ${event.method}() method in component`,
    `${instance.scope.static.id}: ${instance.scope.key}`
  ]);
}
function addEvent(instance, node, event) {
  if (event.attached)
    return;
  if (!(event.method in instance)) {
    log(3 /* WARN */, `Undefined callback method: ${instance.scope.static.id}.${event.method}()`);
    return;
  }
  getEventParams(node.attributes, event);
  if (event.isWindow) {
    if (isValidEvent(event.eventName, window)) {
      addEventListener(event.eventName, eventAttrs(instance, event));
    }
  } else {
    if (isValidEvent(event.eventName, node)) {
      node.addEventListener(event.eventName, eventAttrs(instance, event), event.options);
      $.components.$elements.set(event.dom, node);
    }
  }
  log(1 /* VERBOSE */, [
    `Attached ${event.key} ${event.eventName} event to ${event.method}() method in component`,
    `${instance.scope.static.id}: ${instance.scope.key}`
  ]);
  event.attached = true;
}

// src/components/extends.ts
var _a;
var Component = (_a = class {
  /**
   * Constructor
   *
   * Creates the component instance
   */
  constructor(key) {
    /**
     * Component State
     *
     * The digested static `state` references of components that have
     * extended this base class.
     */
    this.state = o();
    const { $elements } = $.components;
    const { scope } = defineProps(this, {
      scope: {
        get: () => Component.scopes.get(key)
      },
      dom: {
        get: () => $elements.get(scope.dom)
      }
    });
    const prefix = `${$.config.schema}${scope.instanceOf}`;
    this.state = new Proxy(o(), {
      set: (target, key2, value) => {
        const preset = scope.static.state[key2];
        const domValue = typeof value === "object" || isArray(value) ? JSON.stringify(value) : `${value}`;
        if (typeof preset === "object" && hasProp(preset, "persist") && preset.persist) {
          target[key2] = scope.state[key2] = value;
        } else {
          target[key2] = value;
        }
        if (domValue.trim() !== nil && this.dom) {
          const attrName = this.dom.hasAttribute(`${prefix}:${key2}`) ? `${prefix}:${key2}` : `${prefix}:${kebabCase(key2)}`;
          if (domValue !== this.dom.getAttribute(`${prefix}:${key2}`)) {
            this.dom.setAttribute(attrName, domValue);
          }
        }
        if (key2 in scope.binds) {
          const { binds } = scope;
          for (const id in binds[key2]) {
            binds[key2][id].value = domValue;
            if ($elements.has(binds[key2][id].dom)) {
              $elements.get(binds[key2][id].dom).innerText = domValue;
            }
          }
        }
        return true;
      }
    });
    if (isEmpty(scope.state)) {
      for (const prop in scope.static.state) {
        const attr = scope.static.state[prop];
        let type;
        let value;
        if (typeof attr === "object") {
          type = attr.typeof;
          value = attr.default;
        } else {
          type = attr;
        }
        if (type === String) {
          this.state[prop] = value || nil;
        } else if (type === Boolean) {
          this.state[prop] = value || false;
        } else if (type === Number) {
          this.state[prop] = value ? +value : 0;
        } else if (type === Array) {
          this.state[prop] = value || [];
        } else if (type === Object) {
          this.state[prop] = value || {};
        }
        scope.state[prop] = this.state[prop];
      }
    } else {
      for (const prop in scope.static.state) {
        if (!(prop in scope.state)) {
          if (typeof scope.static.state[prop] === "object") {
            scope.state[prop] = scope.static.state[prop].default;
          } else {
            switch (scope.static.state[prop]) {
              case String:
                scope.state[prop] = nil;
                break;
              case Boolean:
                scope.state[prop] = false;
                break;
              case Number:
                scope.state[prop] = 0;
                break;
              case Object:
                scope.state[prop] = {};
                break;
              case Array:
                scope.state[prop] = [];
                break;
            }
          }
        }
        const attr = scope.static.state[prop];
        const attrName = kebabCase(prop);
        let type;
        let value = this.dom.hasAttribute(`${prefix}:${attrName}`) ? this.dom.getAttribute(`${prefix}:${attrName}`) : this.dom.getAttribute(`${prefix}:${prop}`);
        let json;
        const defined = value !== null && value !== nil;
        if (typeof attr === "object") {
          type = attr.typeof;
          json = defined;
          if (!defined)
            value = attr.default;
        } else {
          type = attr;
        }
        if (!(`has${upcase(prop)}` in this.state)) {
          defineProp(this.state, `has${upcase(prop)}`, {
            get() {
              return defined;
            }
          });
        }
        if (typeof value === "string" && value.startsWith("window.")) {
          this.state[prop] = window[value.slice(7)];
        } else if (type === String) {
          this.state[prop] = value || nil;
        } else if (type === Boolean) {
          this.state[prop] = value || false;
        } else if (type === Number) {
          this.state[prop] = value ? +value : 0;
        } else if (type === Array) {
          this.state[prop] = defined ? attrJSON(value) : json ? value : [];
        } else if (type === Object) {
          this.state[prop] = defined ? attrJSON(value) : json ? value : {};
        }
        scope.state[prop] = this.state[prop];
      }
    }
  }
  /**
   * **SPX Document Element**
   *
   * Holds a reference to the DOM Document element `<html>` node.
   */
  get html() {
    return this.dom.closest("html");
  }
}, /**
 * Component Scopes
 *
 * Isolated store of all component instance scopes. Available to component instances
 * via the getter `scope` property.
 */
_a.scopes = m(), _a);

// src/morph/snapshot.ts
function patchSnap(snapNode, pageNode, nodes, morphs) {
  let i;
  let s2;
  let d2;
  if (snapNode.firstElementChild) {
    i = 0;
    s2 = snapNode.children[i];
    d2 = pageNode.children[i];
  }
  while (s2) {
    if (s2) {
      if (morphs.has(d2)) {
        morphSnap(s2, nodes, true);
        morphs.delete(d2);
      } else if (d2.hasAttribute($.qs.$ref)) {
        s2.setAttribute(
          $.qs.$ref,
          d2.getAttribute($.qs.$ref)
        );
      }
      patchSnap(s2, d2, nodes, morphs);
    }
    s2 = snapNode.children[++i];
    d2 = pageNode.children[i];
  }
}
function morphSnap(snapNode, nodes, isPatch = false) {
  const { $elements } = $.components;
  walkElements(snapNode, (node) => {
    if (node.getAttribute("spx-snapshot") === "false")
      return;
    if (isDirective(node.attributes) && !node.hasAttribute($.qs.$ref)) {
      const nodeRef = nodes.shift();
      if (!nodeRef) {
        log(5 /* ERROR */, "Undefined reference, the snapshot record failed to align", node);
      }
      if ($elements.has(nodeRef)) {
        const snapAttr = node.getAttribute($.qs.$ref);
        const domNode = $elements.get(nodeRef);
        const domAttr = domNode.getAttribute($.qs.$ref);
        if (snapAttr !== domAttr) {
          node.setAttribute($.qs.$ref, domAttr);
        }
        if (nodes.length === 0) {
          if (isPatch === false) {
            setSnap(node.ownerDocument.documentElement.outerHTML);
            log(1 /* VERBOSE */, `Snapshot ${$.page.key} updated for: ${$.page.snap}`);
          }
          return false;
        }
      } else {
        log(5 /* ERROR */, "Undefined reference, the snapshot record failed to align", node);
      }
    }
  });
}
function morphHead(method, newNode) {
  const { page, dom } = get($.page.key);
  const operation = method.charCodeAt(0) === 114 ? "removed" : "appended";
  if (dom.head.contains(newNode)) {
    dom.head[method](newNode);
    $.snaps[page.snap] = dom.documentElement.outerHTML;
    log(1 /* VERBOSE */, `Snapshot record was updated. Node ${operation} from <head>`, newNode);
  } else {
    log(3 /* WARN */, "Node does not exists in snapshot record, no mutation applied", newNode);
  }
}

// src/components/instances.ts
function defineNodes(instance, nodes) {
  const model = o();
  const { $elements } = $.components;
  for (const key in nodes) {
    if (!(nodes[key].schema in model))
      model[nodes[key].schema] = [];
    model[nodes[key].schema].push(nodes[key].dom);
  }
  for (const prop in model) {
    if (`${prop}s` in instance)
      continue;
    if (prop in instance) {
      instance[prop] = model[prop];
      continue;
    }
    let entires = model[prop];
    if (entires.length > 1) {
      defineProps(instance, {
        [prop]: {
          get: () => $elements.get(entires[0]),
          set(id) {
            entires = id;
          }
        },
        [`${prop}s`]: {
          get: () => entires.map((id) => $elements.get(id))
        }
      });
    } else {
      defineProp(instance, prop, {
        get: () => $elements.get(entires[0]),
        set(id) {
          entires = id;
        }
      });
    }
  }
}
function setInstances({ $scopes, $aliases, $nodes, $morph }) {
  const isReverse = $.page.type === 4 /* REVERSE */;
  const promises = [];
  const {
    $elements,
    $connected,
    $instances,
    $registry,
    $reference
  } = $.components;
  for (const instanceOf in $scopes) {
    for (const scope of $scopes[instanceOf]) {
      if (scope.instanceOf === null) {
        if (instanceOf in $aliases) {
          scope.instanceOf = $aliases[instanceOf];
        } else {
          continue;
        }
      }
      let Component2;
      let instance;
      if (scope.mounted === false && ($morph !== null || isReverse)) {
        const mounted = getMounted();
        if (scope.alias !== null && scope.alias in mounted) {
          instance = mounted[scope.alias][0];
          Component2 = instance.scope.static;
        } else {
          if (scope.instanceOf in mounted) {
            if (mounted[scope.instanceOf].length === 1) {
              instance = mounted[scope.instanceOf][0];
              Component2 = instance.scope.static;
            }
          }
        }
        if (!instance) {
          log(3 /* WARN */, "Increment component instance failed as instance was undefined", scope);
          continue;
        }
        scope.key = instance.scope.key;
        scope.ref = instance.scope.ref;
      } else {
        Component2 = $registry.get(scope.instanceOf);
        Component.scopes.set(scope.key, defineGetter(scope, "static", Component2.connect));
        instance = new Component2(scope.key);
      }
      if (!isEmpty(scope.nodes)) {
        defineNodes(instance, scope.nodes);
      }
      if ($morph === null && "nodes" in Component2 && Component2.nodes.length > 0) {
        for (const name of Component2.nodes) {
          defineGetter(instance, `has${upcase(name)}Node`, `${name}Node` in instance);
        }
      }
      for (const key in scope.events) {
        let event;
        if ($morph !== null && scope.mounted === false) {
          event = instance.scope.events[key] = scope.events[key];
          $reference[key] = instance.scope.key;
        } else {
          event = scope.events[key];
        }
        addEvent(instance, $elements.get(event.dom), event);
      }
      if ($morph === null || ($morph !== null || isReverse) && scope.mounted === true) {
        $connected.add(scope.key);
        $instances.set(scope.key, instance);
        log(1 /* VERBOSE */, `Component ${scope.static.id} (oninit) mounted: ${scope.key}`, "#6DD093" /* GREEN */);
        if ("oninit" in instance)
          promises.push([instance, "oninit"]);
        if ("onload" in instance)
          promises.push([instance, "onload"]);
      }
    }
  }
  if ($.page.type === 0 /* INITIAL */ && $nodes.length > 0) {
    onNextTick(() => morphSnap($.snapDom.body, $nodes));
  }
  return promises.length > 0 ? mount(promises) : Promise.resolve();
}

// src/observe/fragment.ts
function connect() {
  const fragments2 = [];
  for (const id of $.page.fragments) {
    const element = document.getElementById(id);
    if (element) {
      $.fragments.set(id, element);
      fragments2.push(id);
    } else {
      $.fragments.delete(id);
    }
  }
  patchPage("fragments", fragments2);
}
function snapshots(page) {
  if (page.type !== 6 /* VISIT */) {
    onNextTick(() => {
      const snapDom = getSnapDom(page.snap);
      const selector2 = page.selector !== "body" && page.selector !== null ? `${page.target.join()},${$.qs.$targets}` : $.qs.$targets;
      const targets2 = snapDom.body.querySelectorAll(selector2);
      const domNode = page.type === 0 /* INITIAL */ ? d().querySelectorAll(selector2) : null;
      forNode(targets2, (node, index) => {
        if (!node.hasAttribute("id")) {
          node.setAttribute("id", `t.${uuid()}`);
          if (domNode !== null) {
            domNode[index].setAttribute("id", `t.${uuid()}`);
          }
        } else {
          if (node.id.startsWith("t."))
            return;
        }
        page.fragments.push(node.id);
      });
      setSnap(snapDom.documentElement.outerHTML, page.snap);
    });
  }
}
function contains(node) {
  for (const [id, fragment] of $.fragments) {
    if (id === node.id)
      return true;
    if (fragment.contains(node))
      return true;
  }
  return false;
}

// src/components/context.ts
function getComponentValues(input2) {
  return input2.trim().replace(/\s+/, " ").split(/[|, ]/).map(camelCase);
}
function getEventParams(attributes, event) {
  for (let i = 0, s2 = attributes.length; i < s2; i++) {
    const { name, value } = attributes[i];
    if (!$.qs.$param.test(name))
      continue;
    if (!name.startsWith($.qs.$data) && value) {
      const prop = name.slice($.config.schema.length).split(":").pop();
      if (event.params === null)
        event.params = o();
      if (!(prop in event.params)) {
        event.params[prop] = attrValueFromType(value);
      }
    }
  }
}
function isDirective(attrs) {
  if (typeof attrs === "string") {
    return attrs.indexOf("@") > -1 || attrs === $.qs.$component || attrs === $.qs.$node || attrs === $.qs.$bind;
  }
  for (let i = attrs.length - 1; i >= 0; i--) {
    if (isDirective(attrs[i].name))
      return true;
  }
  return false;
}
function walkNode(node, context2) {
  if (!isDirective(node.attributes))
    return;
  if (node.hasAttribute($.qs.$component)) {
    setComponent(node, node.getAttribute($.qs.$component), context2);
  } else {
    setAttrs(node, context2, null, null);
  }
}
function getContext($morph = null) {
  return o({
    $aliases: o(),
    $scopes: o(),
    $element: null,
    $nodes: [],
    $morph,
    $snaps: $morph ? o() : null
  });
}
function getScope(id, { $scopes, $aliases }) {
  if (!(id in $scopes)) {
    if (id in $aliases)
      return last($scopes[$aliases[id]]);
    $scopes[id] = [setScope(id)];
    return $scopes[id][0];
  }
  return id in $aliases ? last($scopes[$aliases[id]]) : last($scopes[id]);
}
function setRefs(node, instance, ref) {
  $.components.$reference[ref] = instance;
  const value = node.getAttribute($.qs.$ref);
  const suffix = value ? `${value},${ref}` : ref;
  node.setAttribute($.qs.$ref, suffix);
  return ref;
}
function setScope(instanceOf, dom, context2) {
  const { $registry } = $.components;
  const key = uuid();
  const scope = o({
    key,
    mounted: false,
    ref: `c.${key}`,
    state: o(),
    nodes: o(),
    events: o(),
    binds: o()
  });
  if (dom) {
    setRefs(dom, key, scope.ref);
    scope.dom = context2.$element;
    scope.mounted = true;
    scope.inFragment = contains(dom);
    if (dom.hasAttribute("id")) {
      scope.alias = camelCase(dom.id.trim());
    }
  }
  if ($registry.has(instanceOf)) {
    scope.instanceOf = instanceOf;
    if (scope.alias) {
      if (!$registry.has(scope.alias)) {
        context2.$aliases[scope.alias] = instanceOf;
      } else {
        log(5 /* ERROR */, [
          `Component alias "${scope.alias}" matches a component identifer in the registry.`,
          "An alias reference must be unique and cannot match component names."
        ]);
      }
    } else {
      scope.alias = null;
    }
  } else {
    scope.alias = instanceOf || null;
    scope.instanceOf = null;
    if (scope.mounted) {
      context2.$aliases[scope.alias] = null;
    }
  }
  return scope;
}
function setEvent(node, name, value, context2) {
  const event = o();
  const hasOptions = value.indexOf("{");
  const eventName = name.slice($.config.schema.length);
  const listener = new AbortController();
  event.key = `e.${uuid()}`;
  event.dom = `${context2.$element}`;
  event.isWindow = eventName.startsWith("window:");
  event.eventName = event.isWindow ? eventName.slice(7) : eventName;
  event.attached = false;
  event.params = null;
  event.options = { signal: listener.signal };
  let attrVal = value;
  if (hasOptions > -1) {
    const args = value.slice(hasOptions, value.lastIndexOf("}", hasOptions)).match(/(passive|once)/g);
    if (args !== null) {
      if (args.indexOf("once") > -1) {
        event.options.once = true;
      }
      if (args.indexOf("passive") > -1) {
        event.options.passive = true;
      }
    }
    attrVal = value.slice(0, hasOptions);
  }
  const eventValue = attrValueNotation(attrVal);
  if (eventValue.length > 1) {
    log(3 /* WARN */, `No more than 1 DOM Event listener method allowed in value: ${value}`);
  }
  const [instanceOf, method] = eventValue[0].split(".");
  const scope = getScope(instanceOf, context2);
  event.listener = listener;
  event.method = method.trim();
  scope.events[event.key] = event;
  setRefs(node, scope.key, event.key);
}
function setNodes(node, value, context2) {
  for (const nodeValue of attrValueNotation(value)) {
    const [instanceOf, keyProp] = nodeValue.split(".");
    const scope = getScope(instanceOf, context2);
    const key = setRefs(node, scope.key, `n.${uuid()}`);
    scope.nodes[key] = o({
      key,
      keyProp,
      dom: context2.$element,
      schema: `${keyProp}Node`,
      isChild: scope.mounted
    });
  }
}
function setBinds(node, value, context2) {
  for (const bindValue of attrValueNotation(value)) {
    const [instanceOf, stateKey] = bindValue.split(".");
    const scope = getScope(instanceOf, context2);
    const key = setRefs(node, scope.key, `b.${uuid()}`);
    if (!(stateKey in scope.binds)) {
      scope.binds[stateKey] = o();
    }
    scope.binds[stateKey][key] = o({
      key,
      stateKey,
      value: node.innerText,
      dom: context2.$element,
      stateAttr: `${$.config.schema}${instanceOf}:${stateKey}`,
      selector: `[${$.qs.$ref}*=${escSelector(key)}]`,
      isChild: scope.mounted
    });
  }
}
function setAttrs(node, context2, instanceOf, alias) {
  if (instanceOf === null && alias === null) {
    context2.$element = uuid();
    context2.$nodes.push(context2.$element);
    $.components.$elements.set(context2.$element, node);
  }
  for (let n = node.attributes.length - 1; n >= 0; n--) {
    const { name, value } = node.attributes[n];
    if (instanceOf) {
      let schema = `${$.config.schema}${instanceOf}:`;
      if (alias && !name.startsWith(schema)) {
        schema = `${$.config.schema}${alias}:`;
      }
      if (name.startsWith(schema)) {
        getScope(instanceOf, context2).state[camelCase(name.slice(schema.length))] = value;
      }
    }
    if (name.indexOf("@") > -1) {
      setEvent(node, name, value, context2);
    } else if (name === $.qs.$bind) {
      setBinds(node, value, context2);
    } else if (name === $.qs.$node) {
      setNodes(node, value, context2);
    }
  }
}
function setComponent(node, value, context2) {
  const { $registry, $elements } = $.components;
  const { $scopes, $aliases } = context2;
  const id = node.hasAttribute("id") ? node.id.trim() : null;
  context2.$element = uuid();
  context2.$nodes.push(context2.$element);
  $elements.set(context2.$element, node);
  for (const instanceOf of getComponentValues(value)) {
    if (!$registry.has(instanceOf)) {
      log(5 /* ERROR */, `Component does not exist in registry: ${instanceOf}`);
    } else {
      let scope;
      if (instanceOf in $scopes) {
        scope = last($scopes[instanceOf]);
        if (scope.mounted === false) {
          setRefs(node, scope.key, scope.ref);
          scope.dom = context2.$element;
          scope.mounted = true;
          scope.inFragment = contains(node);
        } else {
          $scopes[instanceOf].push(
            setScope(
              instanceOf,
              node,
              context2
            )
          );
        }
      } else {
        $scopes[instanceOf] = [
          setScope(
            instanceOf,
            node,
            context2
          )
        ];
      }
      scope = last($scopes[instanceOf]);
      if (id && !(id in $aliases)) {
        $aliases[id] = instanceOf;
      }
      setAttrs(node, context2, instanceOf, scope.alias);
    }
  }
}
function getComponents(nodes) {
  const context2 = getContext();
  if (!nodes) {
    walkElements(d(), (node) => walkNode(node, context2));
    if (isEmpty(context2.$scopes))
      return;
    setInstances(context2);
  } else if (nodes instanceof Set) {
    for (const node of nodes)
      walkNode(node, context2);
    nodes.clear();
    return context2;
  } else {
    walkNode(nodes, context2);
    return context2;
  }
}

// src/components/observe.ts
var context;
function resetContext() {
  onNextTick(() => {
    context = void 0;
  });
}
function connect2(node, refs) {
  const {
    $reference,
    $connected,
    $elements
  } = $.components;
  for (const id of refs) {
    const instance = $reference[id];
    if (!instance)
      continue;
    const ref = id.charCodeAt(0);
    if (ref === 99 /* COMPONENT */) {
      $connected.add(instance.scope.key);
      $elements.set(instance.scope.dom, node);
      instance.scope.mounted = true;
      log(1 /* VERBOSE */, `Component ${instance.scope.static.id} mounted: ${instance.scope.key}`, "#6DD093" /* GREEN */);
    } else if (ref === 101 /* EVENT */) {
      addEvent(instance, node, instance.scope.events[id]);
    } else if (ref === 110 /* NODE */) {
      $elements.set(instance.scope.nodes[id].dom, node);
    } else if (ref === 98 /* BINDING */) {
      const { binds } = instance.scope;
      for (const key in binds) {
        if (id in binds[key]) {
          node.innerText = binds[key][id].value;
          $elements.set(binds[key][id].dom, node);
          break;
        }
      }
    }
  }
}
function disconnect(curNode, refs, newNode) {
  const { $reference, $connected, $elements } = $.components;
  for (const id of refs) {
    const instance = $reference[id];
    if (!instance)
      continue;
    const ref = id.charCodeAt(0);
    if (ref === 99 /* COMPONENT */) {
      instance.scope.mounted = false;
      $connected.delete(instance.scope.key);
      $elements.delete(instance.scope.dom);
      const { scope } = instance;
      for (const key in scope.nodes) {
        $elements.delete(scope.nodes[key].dom);
      }
      for (const key in scope.binds) {
        for (const uuid3 in scope.binds[key]) {
          $elements.delete(scope.binds[key][uuid3].dom);
        }
      }
      for (const key in scope.events) {
        removeEvent(instance, scope.events[key]);
      }
      log(1 /* VERBOSE */, `Component ${instance.scope.static.id} unmounted: ${instance.scope.key}`, "#7b97ca" /* PURPLE */);
    } else if (ref === 101 /* EVENT */) {
      removeEvent(instance, instance.scope.events[id]);
    } else if (ref === 110 /* NODE */) {
      const node = instance.scope.nodes[id];
      $elements.delete(node.dom);
      if (newNode && curNode.isEqualNode(newNode)) {
        setRefs(curNode, instance.scope.key, id);
        context.$nodes.push(node.dom);
      }
    } else if (ref === 98 /* BINDING */) {
      const { binds } = instance.scope;
      for (const key in binds) {
        if (id in binds[key]) {
          $elements.delete(binds[key][id].dom);
          if (newNode && curNode.isEqualNode(newNode)) {
            setRefs(curNode, instance.scope.key, id);
            context.$nodes.push(binds[key][id].dom);
          }
          break;
        }
      }
    }
  }
}
function removeNode(node) {
  if (node.nodeType !== 1 /* ELEMENT_NODE */ && node.nodeType !== 11 /* FRAGMENT_NODE */)
    return;
  if (node.hasAttribute($.qs.$ref)) {
    disconnect(
      node,
      node.getAttribute($.qs.$ref).split(",")
    );
  }
}
function addedNode(node) {
  if (node.hasAttribute($.qs.$ref)) {
    connect2(node, node.getAttribute($.qs.$ref).split(","));
  } else {
    if (isDirective(node.attributes)) {
      if (!context) {
        context = getContext(node);
      } else {
        context.$morph = node;
      }
      walkNode(node, context);
    }
  }
}
function updateNode(curNode, newNode, cRef, nRef) {
  if (cRef)
    cRef = cRef.split(",");
  if (nRef)
    nRef = nRef.split(",");
  if (cRef && nRef) {
    disconnect(curNode, cRef);
    connect2(curNode, nRef);
  } else if (!cRef && nRef) {
    connect2(curNode, nRef);
  } else {
    if (!context) {
      context = getContext(curNode);
    } else {
      context.$morph = curNode;
    }
    if (cRef && !nRef) {
      disconnect(curNode, cRef, newNode);
    }
    if (isDirective(newNode.attributes))
      walkNode(curNode, context);
  }
}

// src/observe/components.ts
function teardown() {
  for (const ref in $.components.$reference) {
    delete $.components.$reference[ref];
  }
  for (const instance of $.components.$instances.values()) {
    for (const key in instance.scope.events) {
      removeEvent(instance, instance.scope.events[key]);
    }
  }
  $.components.$elements.clear();
  $.components.$instances.clear();
  $.components.$connected.clear();
  log(2 /* INFO */, "Component instances were disconnected");
}
function mount(promises) {
  const promise = promises.map(([instance, method]) => instance.scope.mounted ? instance[method]($.page) : Promise.reject(instance.scope.instanceOf));
  return Promise.race(promise);
}
function hook(event, params, cb) {
  if (event === "onvisit")
    return onNextTick(() => hook(null, params));
  const { $connected, $instances } = $.components;
  let method = 1 /* SYNC */;
  let promises = [];
  if (event === null)
    event = "onvisit";
  else if (event === "onload") {
    method = 2 /* ONLOAD */;
    promises = [];
    patchPage("components", toArray($connected));
  } else if (event === "onexit") {
    method = 3 /* ONEXIT */;
    promises = [];
  }
  for (const uuid3 of $connected) {
    const instance = $instances.get(uuid3);
    if (instance && event in instance) {
      if (method === 1 /* SYNC */) {
        instance[event](params);
      } else {
        promises.push([instance, event]);
      }
    }
  }
  if (promises.length > 0) {
    mount(promises).then(() => {
      for (const [instance] of promises) {
        instance.scope.mounted = method === 2 /* ONLOAD */;
      }
    }).catch(() => {
      for (const [instance] of promises) {
        instance.scope.mounted = false;
      }
    });
  }
}
function connect3() {
  if (!$.config.components)
    return;
  if ($.observe.components)
    return;
  if ($.page.type === 0 /* INITIAL */) {
    getComponents();
  } else {
    if (context) {
      setInstances(context).then(() => {
        hook("onload", $.page);
        resetContext();
      });
    } else {
      hook("onload", $.page);
    }
  }
  $.observe.components = true;
}
function disconnect2() {
  if (!$.observe.components)
    return;
  hook("onexit", $.page);
  $.observe.components = false;
}

// src/app/fetch.ts
function request(key, {
  method = "GET",
  body = null,
  headers = null,
  type = "text"
} = {}) {
  return new Promise(function(resolve, reject) {
    const xhr = new XHR();
    xhr.key = key;
    xhr.responseType = type;
    xhr.open(method, key);
    xhr.setRequestHeader("spx-request", "true");
    if (headers !== null) {
      for (const prop in headers) {
        xhr.setRequestHeader(prop, headers[prop]);
      }
    }
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
}
function cleanup(key) {
  if (!(key in XHR.$timeout))
    return true;
  clearTimeout(XHR.$timeout[key]);
  return delete XHR.$timeout[key];
}
function throttle(key, callback, delay) {
  if (key in XHR.$timeout)
    return;
  if (!has(key)) {
    XHR.$timeout[key] = setTimeout(callback, delay);
  }
}
function cancel(key) {
  for (const [url, xhr] of XHR.$request) {
    if (key !== url) {
      xhr.abort();
      log(3 /* WARN */, `Pending request aborted: ${url}`);
    }
  }
}
function preload(state) {
  if ($.config.preload !== null) {
    if (isArray($.config.preload)) {
      const promises = $.config.preload.filter((path) => {
        const route = getRoute(path, 3 /* PRELOAD */);
        return route.key !== path ? fetch(create(route)) : false;
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
}
async function reverse(state) {
  if (state.rev === state.key)
    return;
  const page = create(getRoute(state.rev, 4 /* REVERSE */));
  await onNextTickResolve();
  fetch(page).then((page2) => {
    if (page2) {
      log(2 /* INFO */, `Reverse fetch completed: ${page2.rev}`);
    } else {
      log(3 /* WARN */, `Reverse fetch failed: ${state.rev}`);
    }
  });
}
async function wait(state) {
  if (!XHR.$transit.has(state.key))
    return state;
  const snapshot = await XHR.$transit.get(state.key);
  XHR.$transit.delete(state.key);
  delete XHR.$timeout[state.key];
  return set(state, snapshot);
}
async function fetch(state) {
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
  XHR.$transit.set(state.key, request(state.key));
  return wait(state);
}

// src/morph/attributes.ts
function setBooleanAttribute(curElement, newElement, name) {
  if (curElement[name] !== newElement[name]) {
    curElement[name] = newElement[name];
    if (curElement[name]) {
      curElement.setAttribute(name, nil);
    } else {
      curElement.removeAttribute(name);
    }
  }
}
function morphAttributes(curNode, newNode) {
  if (newNode.nodeType === 11 /* FRAGMENT_NODE */ || curNode.nodeType === 11 /* FRAGMENT_NODE */)
    return;
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
        if (attrNode.prefix === "xmlns")
          attrName = attrNode.name;
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
    }
  }
  if (cRef || nRef || attrDirective) {
    updateNode(
      curNode,
      newNode,
      cRef,
      nRef
    );
  }
}

// src/morph/forms.ts
function option(curElement, newElement) {
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
}
function input(curElement, newElement) {
  setBooleanAttribute(curElement, newElement, "checked");
  setBooleanAttribute(curElement, newElement, "disabled");
  if (curElement.value !== newElement.value)
    curElement.value = newElement.value;
  if (!newElement.hasAttribute("value"))
    curElement.removeAttribute("value");
}
function textarea(curElement, newElement) {
  const { value } = newElement;
  if (curElement.value !== value)
    curElement.value = value;
  const { firstChild } = curElement;
  if (firstChild) {
    const { nodeValue } = firstChild;
    if (nodeValue === value || !value && nodeValue === curElement.placeholder)
      return;
    firstChild.nodeValue = value;
  }
}
function select(curElement, newElement) {
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
}

// src/morph/morph.ts
function createElementNS(nodeName, namespaceURI) {
  return !namespaceURI || namespaceURI === "http://www.w3.org/1999/xhtml" ? document.createElement(nodeName) : document.createElementNS(namespaceURI, nodeName);
}
function matchName(curNodeName, newNodeName) {
  if (curNodeName === newNodeName)
    return true;
  const curCodeStart = curNodeName.charCodeAt(0);
  const newCodeStart = newNodeName.charCodeAt(0);
  return curCodeStart <= 90 && newCodeStart >= 97 ? curNodeName === newNodeName.toUpperCase() : newCodeStart <= 90 && curCodeStart >= 97 ? newNodeName === curNodeName.toUpperCase() : false;
}
function formNodes(curElement, newElement) {
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
}
function getKey(node) {
  return node ? "getAttribute" in node ? node.getAttribute("id") : void 0 : void 0;
}
function moveChildren(curElement, newElement) {
  let firstChild = curElement.firstChild;
  let nextChild;
  while (firstChild) {
    nextChild = firstChild.nextSibling;
    newElement.appendChild(firstChild);
    firstChild = nextChild;
  }
  return newElement;
}
function removeNode2(curNode, parentNode, context2, skipKeys = true) {
  removeNode(curNode);
  if (parentNode) {
    parentNode.removeChild(curNode);
  }
  walkNodes(
    curNode,
    skipKeys,
    context2
  );
}
function morphChildren(curElement, newElement, context2) {
  let newNode = newElement.firstChild;
  let newKey;
  let newNextSibling;
  let curNode = curElement.firstChild;
  let curKey;
  let curNodeType;
  let curNextSibling;
  let curMatch;
  outer:
    while (newNode) {
      newKey = getKey(newNode);
      newNextSibling = newNode.nextSibling;
      while (curNode) {
        curNextSibling = curNode.nextSibling;
        if (newNode.isEqualNode(curNode)) {
          newNode = newNextSibling;
          curNode = curNextSibling;
          continue outer;
        }
        curKey = getKey(curNode);
        curNodeType = curNode.nodeType;
        let isCompatible;
        if (curNodeType === newNode.nodeType) {
          if (curNodeType === 1 /* ELEMENT_NODE */) {
            if (newKey) {
              if (newKey !== curKey) {
                if (curMatch = context2.$lookup.get(newKey)) {
                  if (curNextSibling.isEqualNode(curMatch)) {
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
                    curKey = getKey(curNode);
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
            if (curNode.nodeValue !== newNode.nodeValue) {
              curNode.nodeValue = newNode.nodeValue;
            }
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
        morphElement(
          curMatch,
          newNode,
          context2
        );
      } else {
        if (newNode.actualize)
          newNode = newNode.actualize(curElement.ownerDocument || document);
        curElement.appendChild(newNode);
        addedNode2(
          newNode,
          context2
        );
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
}
function morphElement(curElement, newElement, context2) {
  const newKey = getKey(newElement);
  if (newKey) {
    context2.$lookup.delete(newKey);
  }
  if (curElement.isEqualNode(newElement))
    return;
  const morphAttr = curElement.getAttribute($.qs.$morph);
  if (morphAttr === "false")
    return;
  if (morphAttr !== "children") {
    morphAttributes(
      curElement,
      newElement
    );
  }
  if (curElement.nodeName !== "TEXTAREA") {
    morphChildren(
      curElement,
      newElement,
      context2
    );
  } else {
    textarea(
      curElement,
      newElement
    );
  }
}
function walkNodes(curNode, skipKeys, context2) {
  if (curNode.nodeType !== 1 /* ELEMENT_NODE */)
    return;
  let curChild = curNode.firstChild;
  while (curChild) {
    let key;
    if (skipKeys && (key = getKey(curChild))) {
      context2.$remove.add(key);
    } else {
      removeNode(curChild);
      if (curChild.firstChild) {
        walkNodes(
          curChild,
          skipKeys,
          context2
        );
      }
    }
    curChild = curChild.nextSibling;
  }
}
function addedNode2(curElement, context2) {
  if (curElement.nodeType === 1 /* ELEMENT_NODE */ || curElement.nodeType === 11 /* FRAGMENT_NODE */) {
    addedNode(curElement);
  }
  let curChild = curElement.firstChild;
  while (curChild) {
    const nextSibling = curChild.nextSibling;
    const curKey = getKey(curChild);
    if (curKey) {
      const unmatchElement = context2.$lookup.get(curKey);
      if (unmatchElement && matchName(curChild.nodeName, unmatchElement.nodeName)) {
        curChild.parentNode.replaceChild(
          unmatchElement,
          curChild
        );
        morphElement(
          unmatchElement,
          curChild,
          context2
        );
      } else {
        addedNode2(
          curChild,
          context2
        );
      }
    } else {
      addedNode2(
        curChild,
        context2
      );
    }
    curChild = nextSibling;
  }
}
function cleanNode(curElement, curNode, curKey, context2) {
  while (curNode) {
    const curNextSibling = curNode.nextSibling;
    if (curKey = getKey(curNode)) {
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
}
function indexNode(fromNode, context2) {
  if (fromNode.nodeType === 1 /* ELEMENT_NODE */ || fromNode.nodeType === 11 /* FRAGMENT_NODE */) {
    let childNode = fromNode.firstChild;
    while (childNode) {
      const key = getKey(childNode);
      if (key) {
        context2.$lookup.set(
          key,
          childNode
        );
      }
      indexNode(
        childNode,
        context2
      );
      childNode = childNode.nextSibling;
    }
  }
}
function morph(curNode, snapNode) {
  let newNode = snapNode.cloneNode(true);
  const context2 = o({
    $remove: s(),
    $lookup: m()
  });
  if (newNode.nodeType === 11 /* FRAGMENT_NODE */) {
    newNode = newNode.firstElementChild;
  }
  indexNode(
    curNode,
    context2
  );
  let morphedNode = curNode;
  const curNodeType = morphedNode.nodeType;
  const newNodeType = newNode.nodeType;
  if (curNodeType === 1 /* ELEMENT_NODE */) {
    if (newNodeType === 1 /* ELEMENT_NODE */) {
      if (!matchName(curNode.nodeName, newNode.nodeName)) {
        removeNode(curNode);
        morphedNode = moveChildren(
          curNode,
          createElementNS(
            newNode.nodeName,
            newNode.namespaceURI
          )
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
    if (newNode.isEqualNode(morphedNode))
      return morphedNode;
    morphElement(
      morphedNode,
      newNode,
      context2
    );
    if (context2.$remove.size > 0) {
      for (const key of context2.$remove) {
        if (context2.$lookup.has(key)) {
          const node = context2.$lookup.get(key);
          removeNode2(
            node,
            node.parentNode,
            context2,
            false
          );
        }
      }
    }
  }
  if (morphedNode !== curNode && curNode.parentNode) {
    if (morphedNode.actualize)
      morphedNode = morphedNode.actualize(curNode.ownerDocument || document);
    curNode.parentNode.replaceChild(
      morphedNode,
      curNode
    );
  }
  context2.$lookup.clear();
  context2.$remove.clear();
  return morphedNode;
}

// src/shared/links.ts
function getLink(target, selector2) {
  if (!(target instanceof Element))
    return false;
  const element = target.closest(selector2);
  return element && element.tagName === "A" ? element : false;
}
function canFetch(target) {
  if (target.nodeName !== "A")
    return false;
  const href = target.getAttribute("href");
  if (!href)
    return false;
  if (!validKey(href))
    return false;
  return has(getKey2(href)) === false;
}
function getNodeTargets(selector2, hrefs) {
  const targets2 = [];
  forNode(selector2, (targetNode) => {
    if (targetNode.nodeName !== "A") {
      const nodes = targetNode.querySelectorAll(hrefs);
      forNode(nodes, (linkNode) => {
        if (canFetch(linkNode)) {
          targets2.push(linkNode);
        }
      });
    } else {
      if (targetNode.hasAttribute("href")) {
        const { href } = targetNode;
        if (validKey(href) && has(getKey2(href))) {
          targets2.push(targetNode);
        }
      }
    }
  });
  return targets2;
}
var getTargets = (selector2) => {
  const targets2 = [];
  forNode(selector2, (linkNode) => {
    if (canFetch(linkNode)) {
      targets2.push(linkNode);
    }
  });
  return targets2;
};

// src/observe/hovers.ts
function onEnter(event) {
  const target = getLink(event.target, $.qs.$hover);
  if (!target)
    return;
  const route = getRoute(target, 10 /* HOVER */);
  if (has(route.key))
    return;
  if (route.key in XHR.$timeout)
    return;
  target.addEventListener(`${pointer}leave`, onLeave, { once: true });
  const state = create(route);
  const delay = state.threshold || $.config.hover.threshold;
  throttle(route.key, function() {
    if (!emit("prefetch", target, route))
      return;
    fetch(state).then(function() {
      delete XHR.$timeout[route.key];
      removeListener(target);
    });
  }, delay);
}
function onLeave(event) {
  const target = getLink(event.target, $.qs.$hover);
  if (target) {
    cleanup(getKey2(target.href));
  }
}
function addListener(target) {
  target.addEventListener(`${pointer}enter`, onEnter);
}
function removeListener(target) {
  target.removeEventListener(`${pointer}enter`, onEnter);
  target.removeEventListener(`${pointer}leave`, onLeave);
}
function connect4() {
  if (!$.config.hover || $.observe.hover)
    return;
  forEach(addListener, getTargets($.qs.$hover));
  $.observe.hover = true;
}
function disconnect3() {
  if (!$.observe.hover)
    return;
  forEach(removeListener, getTargets($.qs.$hover));
  $.observe.hover = false;
}

// src/observe/intersect.ts
var entries2;
async function onIntersect(entry) {
  if (entry.isIntersecting) {
    const route = getRoute(entry.target, 11 /* INTERSECT */);
    if (!emit("prefetch", entry.target, route))
      return entries2.unobserve(entry.target);
    const response = await fetch(create(route));
    if (response) {
      entries2.unobserve(entry.target);
    } else {
      log(3 /* WARN */, `Prefetch will retry at next intersect for: ${route.key}`);
      entries2.observe(entry.target);
    }
  }
}
function connect5() {
  if (!$.config.intersect || $.observe.intersect)
    return;
  if (!entries2)
    entries2 = new IntersectionObserver(forEach(onIntersect), $.config.intersect);
  const observe2 = forEach((target) => entries2.observe(target));
  const targets2 = getNodeTargets($.qs.$intersector, $.qs.$intersect);
  observe2(targets2);
  $.observe.intersect = true;
}
function disconnect4() {
  if (!$.observe.intersect)
    return;
  entries2.disconnect();
  $.observe.intersect = false;
}

// src/observe/mutations.ts
var resources = new MutationObserver(function([mutation]) {
  if (mutation.type !== "childList")
    return;
  const isAdded = mutation.addedNodes.length;
  if (isAdded || mutation.removedNodes.length > 0) {
    const node = isAdded ? mutation.addedNodes[0] : mutation.removedNodes[0];
    if (node.nodeType !== 1 /* ELEMENT_NODE */)
      return;
    if ($.eval && isResourceTag.test(node.nodeName)) {
      if (node.parentNode.nodeName === "HEAD") {
        if (isAdded) {
          morphHead("appendChild", node);
        } else {
          morphHead("removeChild", node);
        }
      } else {
        if (nodeOutsideTarget(node) && !$.resources.has(node)) {
          $.resources.add(node);
        } else {
          $.resources.delete(node);
        }
      }
    } else if (node instanceof HTMLElement) {
      if (isAdded && !node.hasAttribute($.qs.$ref)) {
        getComponents(node);
      }
    }
  }
});
function nodeOutsideTarget(node) {
  const targets2 = d().querySelectorAll(`${$.page.target.join(",")},[${$.qs.$target}]`);
  for (let i = 0, s2 = targets2.length; i < s2; i++) {
    if (targets2[i].contains(node))
      return false;
  }
  return true;
}
function connect6() {
  if (!$.observe.mutations)
    return;
  resources.observe(document.head, { childList: true });
  resources.observe(d(), { childList: true, subtree: true });
  $.observe.mutations = true;
}
function disconnect5() {
  if (!$.observe.mutations)
    return;
  resources.takeRecords();
  resources.disconnect();
  for (const node of $.resources) {
    d().removeChild(node);
    $.resources.delete(node);
  }
  $.observe.mutations = false;
}

// src/observe/proximity.ts
function inRange({ clientX, clientY }, bounds) {
  return clientX <= bounds.right && clientX >= bounds.left && clientY <= bounds.bottom && clientY >= bounds.top;
}
function setBounds(target) {
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
}
function observer(targets2) {
  let wait2 = false;
  return (event) => {
    if (wait2)
      return;
    wait2 = true;
    const node = targets2.findIndex((node2) => inRange(event, node2));
    if (node === -1) {
      setTimeout(() => {
        wait2 = false;
      }, $.config.proximity.throttle);
    } else {
      const { target } = targets2[node];
      const page = create(getRoute(target, 12 /* PROXIMITY */));
      const delay = page.threshold || $.config.proximity.threshold;
      throttle(page.key, async () => {
        if (!emit("prefetch", target, page))
          return disconnect6();
        const prefetch2 = await fetch(page);
        if (prefetch2) {
          targets2.splice(node, 1);
          wait2 = false;
          if (targets2.length === 0) {
            disconnect6();
            log(2 /* INFO */, "Proximity observer disconnected");
          }
        }
      }, delay);
    }
  };
}
var entries3;
function connect7() {
  if (!$.config.proximity || $.observe.proximity)
    return;
  const targets2 = getTargets($.qs.$proximity).map(setBounds);
  if (targets2.length > 0) {
    entries3 = observer(targets2);
    addEventListener(`${pointer}move`, entries3, { passive: true });
    $.observe.proximity = true;
  }
}
function disconnect6() {
  if (!$.observe.proximity)
    return;
  removeEventListener(`${pointer}move`, entries3);
  $.observe.proximity = false;
}

// src/app/render.ts
async function morphHead2(head, target) {
  if (!$.eval || !head || !target)
    return;
  const remove = [];
  const nodes = s();
  const { children } = head;
  for (let i = 0, s2 = target.length; i < s2; i++) {
    nodes.add(target[i].outerHTML);
  }
  for (let i = 0, s2 = children.length; i < s2; i++) {
    const childNode = children[i];
    const { nodeName, outerHTML } = childNode;
    let evaluate = true;
    if (nodeName === "SCRIPT") {
      evaluate = childNode.matches($.qs.$script);
    } else if (nodeName === "STYLE") {
      evaluate = childNode.matches($.qs.$style);
    } else if (nodeName === "META") {
      evaluate = childNode.matches($.qs.$meta);
    } else if (nodeName === "LINK") {
      evaluate = childNode.matches($.qs.$link);
    } else {
      evaluate = head.getAttribute($.qs.$eval) !== "false";
    }
    if (nodes.has(outerHTML)) {
      if (evaluate) {
        remove.push(childNode);
      } else {
        nodes.delete(outerHTML);
      }
    } else {
      remove.push(childNode);
    }
  }
  const promises = [];
  const range = document.createRange();
  for (const outerHTML of nodes) {
    const node = range.createContextualFragment(outerHTML).firstChild;
    const link = hasProp(node, "href");
    if (link || hasProp(node, "src")) {
      const promise = new Promise(function(resolve) {
        node.addEventListener("error", (e) => {
          log(3 /* WARN */, `Resource <${node.nodeName.toLowerCase()}> failed:`, node);
          resolve();
        });
        node.addEventListener("load", () => resolve());
      });
      promises.push(promise);
    }
    head.appendChild(node);
    nodes.delete(outerHTML);
  }
  for (let i = 0, s2 = remove.length; i < s2; i++) {
    head.removeChild(remove[i]);
  }
  await Promise.all(promises);
}
function morphNodes(page, snapDom) {
  const pageDom = d();
  if (page.selector === "body" || page.fragments.length === 0) {
    const newDom = snapDom.body;
    morph(pageDom, newDom);
    if (context && context.$nodes.length > 0) {
      onNextTick(() => {
        morphSnap(newDom, context.$nodes);
        patchPage("type", 6 /* VISIT */);
      });
    }
  } else if (page.selector !== null) {
    const pageNodes = pageDom.querySelectorAll(page.selector);
    const snapNodes = snapDom.body.querySelectorAll(page.selector);
    const nodeMorph = s();
    for (let i = 0, s2 = pageNodes.length; i < s2; i++) {
      const curNode = pageNodes[i];
      const newNode = snapNodes[i];
      if (!newNode || !curNode)
        continue;
      if (!emit("render", curNode, newNode))
        continue;
      if (curNode.isEqualNode(newNode))
        continue;
      nodeMorph.add(
        morph(
          curNode,
          newNode
        )
      );
    }
    if (page.type !== 6 /* VISIT */ && context && context.$nodes.length > 0) {
      onNextTick(() => {
        patchSnap(snapDom.body, pageDom, context.$nodes, nodeMorph);
        patchPage("type", 6 /* VISIT */);
        nodeMorph.clear();
      });
    }
  } else {
    for (const id of page.fragments) {
      const curNode = $.fragments.get(id);
      const newNode = snapDom.getElementById(id);
      if (!newNode || !curNode)
        continue;
      if (!emit("render", curNode, newNode))
        continue;
      if (curNode.isEqualNode(newNode))
        continue;
      morph(curNode, newNode);
      if (context && context.$nodes.length > 0) {
        onNextTick(() => {
          morphSnap(newNode, context.$nodes);
          patchPage("type", 6 /* VISIT */);
        });
      }
    }
  }
}
function morphHydrate(state, target) {
  const nodes = state.hydrate;
  if (nodes.length === 1 && nodes[0] === "body") {
    morph(d(), target.body);
    return;
  }
  const selector2 = nodes.join(",");
  const domNodes = d().querySelectorAll(selector2);
  const preserve = state.preserve && state.preserve.length > 0 ? state.preserve.join(",") : null;
  const skipped = [];
  if (preserve) {
    const skipNodes = d().querySelectorAll(preserve);
    for (let i = 0, s2 = skipNodes.length; i < s2; i++) {
      const skipNode = skipNodes[i];
      skipNode.setAttribute($.qs.$morph, "false");
      skipped.push(skipNode);
    }
  }
  if (domNodes.length > 0) {
    const newNodes = target.body.querySelectorAll(selector2);
    for (let i = 0, s2 = domNodes.length; i < s2; i++) {
      const oldNode = domNodes[i];
      const newNode = newNodes[i];
      if (newNodes[i] instanceof HTMLElement) {
        if (!emit("hydrate", oldNode, newNode))
          continue;
        morph(newNode, newNode);
      }
    }
  }
  if (preserve) {
    for (const node of skipped) {
      node.removeAttribute("spx-morph");
    }
  }
  state.hydrate = void 0;
  state.preserve = void 0;
  state.type = 6 /* VISIT */;
  update(state);
}
function update(page) {
  disconnect3();
  disconnect4();
  disconnect6();
  disconnect5();
  disconnect2();
  connect();
  if (!$.eval)
    document.title = page.title;
  const snapDom = getSnapDom(page.snap);
  if (page.type === 7 /* HYDRATE */) {
    morphHydrate(page, snapDom);
  } else {
    morphHead2(h(), snapDom.head.children);
    morphNodes(page, snapDom);
    scrollTo(page.scrollX, page.scrollY);
  }
  progress.done();
  onNextTick(() => {
    connect4();
    connect5();
    connect7();
    connect3();
    connect6();
  });
  emit("load", page);
  return page;
}

// src/observe/history.ts
var api = window.history;
function reverse2() {
  return api.state !== null && "rev" in api.state && api.state.key !== api.state.rev;
}
function has2(key) {
  if (api.state == null)
    return false;
  if (typeof api.state !== "object")
    return false;
  const match = hasProps(api.state)([
    "key",
    "rev",
    "scrollX",
    "scrollY",
    "title"
  ]);
  return typeof key === "string" ? match && api.state.key === key : match;
}
async function load() {
  await promiseResolve();
  $.loaded = true;
}
function initialize(page) {
  if (has2(page.key)) {
    scrollTo(api.state.scrollX, api.state.scrollY);
    assign(page, api.state);
  } else {
    replace(page);
  }
  return page;
}
function replace({ key, rev, title, scrollX, scrollY }) {
  const state = {
    key,
    rev,
    scrollX,
    scrollY,
    title: title || document.title
  };
  api.replaceState(state, state.title, state.key);
  log(1 /* VERBOSE */, `History replaceState: ${api.state.key}`);
  return api.state;
}
function push({ key, rev, title, location: location2 }) {
  const path = location2.pathname + location2.search;
  const state = {
    key,
    rev,
    title,
    scrollY: 0,
    scrollX: 0
  };
  api.pushState(state, state.title, path);
  log(1 /* VERBOSE */, `History pushState: ${api.state.key}`);
  return api.state;
}
async function pop(event) {
  if (event.state === null)
    return;
  if (has(event.state.key)) {
    if (!has(event.state.rev) && event.state.rev !== event.state.key) {
      reverse(event.state.rev);
    }
    const page = $.pages[event.state.key];
    if (page.type === 4 /* REVERSE */) {
      log(1 /* VERBOSE */, `History popState reverse (snapshot): ${page.key}`);
    } else {
      log(1 /* VERBOSE */, `History popState session (snapshot): ${page.key}`);
    }
    patchPage("type", 5 /* POPSTATE */);
    update(page);
  } else {
    log(1 /* VERBOSE */, `History popState fetch: ${event.state.key}`);
    teardown();
    event.state.type = 5 /* POPSTATE */;
    const page = await fetch(event.state);
    if (!page)
      return location.assign(event.state.key);
    const key = getKey2(location);
    if (page.key === key) {
      update(page);
    } else if (has(key)) {
      update($.pages[key]);
    } else {
      teardown();
      const data = create(getRoute(key, 5 /* POPSTATE */));
      await fetch(data);
      push(data);
    }
  }
}
function connect8(page) {
  if ($.observe.history)
    return;
  if (api.scrollRestoration)
    api.scrollRestoration = "manual";
  addEventListener("popstate", pop, false);
  $.observe.history = true;
  if (typeof page === "object" && page.type === 0 /* INITIAL */) {
    return initialize(page);
  }
  return page;
}
function disconnect7() {
  if (!$.observe.history)
    return;
  if (api.scrollRestoration)
    api.scrollRestoration = "auto";
  removeEventListener("popstate", pop, false);
  removeEventListener("load", load, false);
  $.observe.history = false;
}

// src/app/queries.ts
function create(page) {
  const has3 = hasProps(page);
  page.ts = ts();
  page.target = targets(page);
  if (!has3("selector")) {
    if (page.target[0] === "body") {
      page.selector = "body";
    } else {
      page.selector = selector(page.target);
    }
  }
  if ($.config.cache) {
    if (!has3("cache"))
      page.cache = $.config.cache;
    if (!has3("snap"))
      page.snap = uuid();
  }
  if (!has3("scrollY"))
    page.scrollY = 0;
  if (!has3("scrollX"))
    page.scrollX = 0;
  if ($.config.hover !== false && page.type === 10 /* HOVER */) {
    if (!has3("threshold")) {
      page.threshold = $.config.hover.threshold;
    }
  }
  if ($.config.proximity !== false && page.type === 12 /* PROXIMITY */) {
    if (!has3("proximity"))
      page.proximity = $.config.proximity.distance;
    if (!has3("threshold"))
      page.threshold = $.config.proximity.threshold;
  }
  if ($.config.progress && !has3("progress")) {
    page.progress = $.config.progress.threshold;
  }
  if (!has3("fragments"))
    page.fragments = $.config.fragments;
  if (!has3("history"))
    page.history = true;
  if (!has3("visits"))
    page.visits = 0;
  if (!has3("components"))
    page.components = [];
  $.pages[page.key] = page;
  return $.pages[page.key];
}
function newPage(page) {
  const state = assign(o(page), {
    target: [],
    selector: null,
    cache: $.config.cache,
    history: true,
    scrollX: 0,
    scrollY: 0,
    fragments: $.config.fragments
  });
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
}
function patchPage(prop, value, key = api.state.key) {
  if (prop === "location") {
    $.pages[key][prop] = assign($.pages[key][prop], value);
  } else if (prop === "target") {
    $.pages[key].target = targets(value);
    $.pages[key].selector = selector($.pages[key].target);
  } else if (prop === "components") {
    $.pages[key].components = value;
  } else {
    $.pages[key][prop] = value;
  }
  return $.pages[key];
}
function set(state, snapshot) {
  const event = emit("before:cache", state, snapshot);
  const dom = typeof event === "string" ? event : snapshot;
  if (state.type > 5 /* POPSTATE */) {
    if (state.type > 9 /* RELOAD */) {
      state.type = 1 /* PREFETCH */;
    }
  }
  state.title = getTitle(snapshot);
  if (!$.config.cache || event === false)
    return state;
  if (!("snap" in state))
    return update2(state, dom);
  $.pages[state.key] = state;
  $.snaps[state.snap] = dom;
  snapshots(state);
  emit("after:cache", state);
  hook("oncache", state);
  return state;
}
function update2(page, snapshot) {
  const state = page.key in $.pages ? $.pages[page.key] : create(page);
  if (typeof snapshot === "string") {
    $.snaps[state.snap] = snapshot;
    page.title = getTitle(snapshot);
  }
  return assign(state, page);
}
function setSnap(snapshot, key) {
  const snap = key = key ? key.charCodeAt(0) === 47 ? key in $.pages ? $.pages[key].snap : null : key : $.page.snap;
  if (snap) {
    $.snaps[snap] = snapshot;
  } else {
    log(3 /* WARN */, "Snapshot record does not exist, update failed");
  }
}
function get(key) {
  if (!key) {
    if (api.state === null) {
      log(3 /* WARN */, "Missing history state reference, page cannot be returned");
      return;
    }
    key = api.state.key;
  }
  if (key in $.pages) {
    return defineProps(o(), {
      page: {
        get: () => $.pages[key]
      },
      dom: {
        get: () => parse($.snaps[$.pages[key].snap])
      }
    });
  }
  log(5 /* ERROR */, `No record exists: ${key}`);
}
function getSnapDom(key) {
  const uuid3 = key = key ? key.charCodeAt(0) === 47 ? $.pages[key].snap : key : $.page.snap;
  return parse($.snaps[uuid3]);
}
function getMounted({ mounted = null } = {}) {
  const mounts = o();
  for (const instance of $.components.$instances.values()) {
    const { scope } = instance;
    if (!$.components.$connected.has(scope.key))
      continue;
    if (mounted !== null && scope.mounted === mounted)
      continue;
    if (scope.alias !== null && !(scope.alias in mounts)) {
      mounts[scope.alias] = [instance];
    } else {
      if (!(scope.instanceOf in mounts)) {
        mounts[scope.instanceOf] = [instance];
      } else {
        mounts[scope.instanceOf].push(instance);
      }
    }
  }
  return isEmpty(mounts) ? null : mounts;
}
function getPage(key) {
  if (!key) {
    if (api.state === null) {
      log(3 /* WARN */, "Missing history state reference, page cannot be returned");
      return;
    }
    key = api.state.key;
  }
  if (key in $.pages)
    return $.pages[key];
  log(5 /* ERROR */, `No page record exists for: ${key}`);
}
function has(key) {
  return hasProp($.pages, key) && hasProp($.pages[key], "snap") && hasProp($.snaps, $.pages[key].snap) && typeof $.snaps[$.pages[key].snap] === "string";
}
function clear(key) {
  if (!key) {
    empty($.pages);
    empty($.snaps);
  } else if (typeof key === "string") {
    delete $.snaps[$.pages[key].snap];
    delete $.pages[key];
  } else if (isArray(key)) {
    forEach((url) => {
      delete $.snaps[$.pages[url].snap];
      delete $.pages[url];
    }, key);
  }
}

// src/app/location.ts
var hostname = origin.replace(/(?:https?:)?(?:\/\/(?:www\.)?|(?:www\.))/, nil);
function getAttributes(element, page) {
  const state = page ? newPage(page) : o();
  const attrs = element.getAttributeNames();
  for (let i = 0, s2 = attrs.length; i < s2; i++) {
    const nodeName = attrs[i];
    if (nodeName.startsWith($.qs.$data)) {
      if (!hasProp(state, "data"))
        state.data = o();
      const name = camelCase(nodeName.slice($.qs.$data.length));
      const value = element.getAttribute(nodeName).trim();
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
      if (!$.qs.$attrs.test(nodeName))
        continue;
      const nodeValue = element.getAttribute(nodeName).trim();
      if (nodeName === "href") {
        state.rev = location.pathname + location.search;
        if (!page) {
          state.location = getLocation(nodeValue);
          state.key = state.location.pathname + state.location.search;
        }
      } else {
        const name = nodeName.slice(nodeName.lastIndexOf("-") + 1);
        const value = nodeValue.replace(Whitespace, nil).trim();
        if (name === "target") {
          state[name] = value === "true" ? [] : value !== nil ? splitAttrArrayValue(value) : [];
          state.selector = selector(state[name]);
        } else if (isArray2.test(value)) {
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
            log(
              3 /* WARN */,
              `Invalid attribute value on <${nodeName}>, expected: y:number or x:number`,
              element
            );
          }
        } else if (name === "scroll") {
          if (isNumber.test(value)) {
            state.scrollY = +value;
          } else {
            log(
              3 /* WARN */,
              `Invalid attribute value on <${nodeName}>, expected: number`,
              element
            );
          }
        } else if (isBoolean.test(value) && !isPrefetch.test(nodeName)) {
          state[name] = value === "true";
        } else if (isNumeric.test(value)) {
          state[name] = +value;
        } else {
          if (name === "history") {
            if (value !== "push" && value !== "replace") {
              log(
                5 /* ERROR */,
                `Invalid attribute value on <${nodeName}>, expected: false, push or replace`,
                element
              );
            }
          }
          state[name] = value;
        }
      }
    }
  }
  return state;
}
function parsePath(path) {
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
}
function getPath(url, protocol) {
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
}
function parseOrigin(url) {
  const path = url.startsWith("www.") ? url.slice(4) : url;
  const name = path.indexOf("/");
  if (name >= 0) {
    const key = path.slice(name);
    if (path.slice(0, name) === hostname)
      return key.length > 0 ? parsePath(key) : parsePath("/");
  } else {
    const char = path.search(/[?#]/);
    if (char >= 0) {
      if (path.slice(0, char) === hostname)
        return parsePath("/" + path.slice(char));
    } else {
      if (path === hostname)
        return parsePath("/");
    }
  }
  return null;
}
function hasOrigin(url) {
  if (url.startsWith("http"))
    return 1 /* HTTP */;
  if (url.startsWith("//"))
    return 2 /* SLASH */;
  if (url.startsWith("www."))
    return 3 /* WWW */;
  return 1 /* NONE */;
}
function validKey(url) {
  if (typeof url !== "string" || url.length === 0)
    return false;
  if (url.charCodeAt(0) === 47 /* FWD */) {
    if (url.charCodeAt(1) !== 47 /* FWD */)
      return true;
    if (url.startsWith("www.", 2))
      return url.startsWith(hostname, 6);
    return url.startsWith(hostname, 2);
  }
  if (url.charCodeAt(0) === 63 /* QWS */)
    return true;
  if (url.startsWith("www."))
    return url.startsWith(hostname, 4);
  if (url.startsWith("http")) {
    const start = url.indexOf("/", 4) + 2;
    return url.startsWith("www.", start) ? url.startsWith(hostname, start + 4) : url.startsWith(hostname, start);
  }
}
function parseKey(url) {
  if (url.charCodeAt(0) === 47 /* FWD */) {
    return url.charCodeAt(1) !== 47 /* FWD */ ? parsePath(url) : parseOrigin(url.slice(2));
  }
  if (url.charCodeAt(0) === 63 /* QWS */) {
    return parsePath(location.pathname + url);
  }
  if (url.startsWith("https:") || url.startsWith("http:")) {
    return parseOrigin(url.slice(url.indexOf("/", 4) + 2));
  }
  if (url.startsWith("www."))
    return parseOrigin(url);
  return null;
}
function getKey2(link) {
  if (typeof link === "object") {
    return link.pathname + link.search;
  }
  if (link === nil || link === "/")
    return "/";
  const has3 = hasOrigin(link);
  if (has3 === 1) {
    const protocol = link.charCodeAt(4) === 115 ? 8 : 7;
    const www = link.startsWith("www.", protocol) ? protocol + 4 : protocol;
    return link.startsWith(hostname, www) ? getPath(link, www) : null;
  }
  if (has3 === 2) {
    const www = link.startsWith("www.", 2) ? 6 : 2;
    return link.startsWith(hostname, www) ? getPath(link, www) : null;
  }
  if (has3 === 3) {
    return link.startsWith(hostname, 4) ? getPath(link, 4) : null;
  }
  return link.startsWith(hostname, 0) ? getPath(link, 0) : null;
}
function fallback() {
  const { pathname, search, hash } = location;
  return o({
    hostname,
    origin,
    pathname,
    search,
    hash
  });
}
function getLocation(path) {
  if (path === nil)
    return fallback();
  const state = parseKey(path);
  if (state === null) {
    log(5 /* ERROR */, `Invalid pathname: ${path}`);
  }
  state.origin = origin;
  state.hostname = hostname;
  return state;
}
function getRoute(link, type = 6 /* VISIT */) {
  if (link instanceof Element) {
    const state2 = getAttributes(link);
    state2.type = type || 6 /* VISIT */;
    return state2;
  }
  const state = o();
  if (link === 0 /* INITIAL */) {
    state.location = fallback();
    state.key = state.rev = getKey2(state.location);
    state.type = link;
    state.visits = 1;
    $.index = state.key;
  } else if (type === 7 /* HYDRATE */) {
    state.location = getLocation(link);
    state.key = state.rev = getKey2(state.location);
    state.type = type;
  } else {
    state.rev = location.pathname + location.search;
    state.location = getLocation(typeof link === "string" ? link : state.rev);
    state.key = getKey2(state.location);
    state.type = type;
  }
  return state;
}

// src/observe/hrefs.ts
function linkEvent(event) {
  return !// @ts-ignore
  (event.target && event.target.isContentEditable || event.defaultPrevented || event.button > 1 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
}
var handle = function(event) {
  if (!linkEvent(event))
    return;
  const target = getLink(event.target, $.qs.$href);
  if (!target)
    return;
  const key = getKey2(target.href);
  if (key === null)
    return;
  const isRoute = key === $.page.key;
  const move = () => {
    log(3 /* WARN */, `Drag occurance deteced, cancelled visit: ${key}`);
    handle.drag = true;
    target.removeEventListener(`${pointer}move`, move);
  };
  target.addEventListener(`${pointer}move`, move, { once: true });
  if (handle.drag === true) {
    handle.drag = false;
    return handle(event);
  }
  target.removeEventListener(`${pointer}move`, move);
  if (!emit("visit", event))
    return;
  const click = (state, subsequent = true) => {
    $.pages[state.key].ts = ts();
    $.pages[state.key].visits = state.visits + 1;
    $.pages[state.rev].scrollX = window.scrollX;
    $.pages[state.rev].scrollY = window.scrollY;
    hook("onvisit", state);
    if (isRoute) {
      log(1 /* VERBOSE */, `URL Pathname matches current route: ${key}`);
      update(state);
    } else {
      replace($.pages[state.rev]);
      if (subsequent) {
        push(state);
        update(state);
      } else {
        visit(state);
      }
    }
  };
  disconnect3();
  disconnect6();
  disconnect4();
  if (has(key)) {
    const attrs = getAttributes(target, $.pages[key]);
    const page = update2(attrs);
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
  if (state.progress)
    progress.start(state.progress);
  const page = await wait(state);
  if (page) {
    push(page);
    update(page);
  } else {
    location.assign(state.key);
  }
}
async function navigate(key, state) {
  if (state) {
    if (typeof state.cache === "string")
      state.cache === "clear" ? clear() : clear(state.key);
    if (state.progress)
      progress.start(state.progress);
    const page = await fetch(state);
    if (page) {
      push(page);
      update(page);
    } else {
      location.assign(state.key);
    }
  } else {
    return visit($.pages[key]);
  }
}
function connect9() {
  if ($.observe.hrefs)
    return;
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
}
function disconnect8() {
  if (!$.observe.hrefs)
    return;
  if (deviceType === "mouseOnly") {
    removeEventListener(`${pointer}down`, handle, false);
  } else if (deviceType === "touchOnly") {
    removeEventListener("touchstart", handle, false);
  } else {
    removeEventListener(`${pointer}down`, handle, false);
    removeEventListener("touchstart", handle, false);
  }
  $.observe.hrefs = false;
}

// src/app/controller.ts
function initialize2() {
  const route = getRoute(0 /* INITIAL */);
  const state = connect8(create(route));
  defineProps($, {
    prev: {
      get: () => $.pages[api.state.rev]
    },
    page: {
      get: () => $.pages[api.state.key]
    },
    snapDom: {
      get: () => parse($.snaps[$.page.snap])
    }
  });
  const DOMReady = () => {
    const page = set(state, takeSnapshot());
    connect9();
    connect();
    if ($.config.manual === false) {
      connect4();
      connect5();
      connect7();
      connect3();
      connect6();
    }
    onNextTick(() => {
      patchPage("type", 6 /* VISIT */);
      reverse(page);
      preload(page);
    });
    emit("x");
    return page;
  };
  return new Promise((resolve) => {
    const { readyState } = document;
    if (readyState === "interactive" || readyState === "complete") {
      return resolve(DOMReady());
    }
    addEventListener("DOMContentLoaded", () => resolve(DOMReady()));
  });
}
function observe() {
  disconnect3();
  connect4();
  disconnect4();
  connect5();
  disconnect6();
  connect7();
  disconnect2();
  connect3();
  disconnect5();
  connect6();
}
function disconnect9() {
  disconnect7();
  disconnect8();
  disconnect5();
  disconnect3();
  disconnect4();
  disconnect6();
  if ($.config.components) {
    disconnect2();
    teardown();
    $.components.$registry.clear();
  }
  clear();
  if ($.config.globalThis)
    delete window.spx;
  log(2 /* INFO */, "Disconnected");
}

// src/index.ts
var spx = o({
  $,
  Component,
  on,
  off,
  observe,
  connect: connect10,
  capture,
  form,
  render,
  session,
  reload,
  fetch: fetch2,
  clear,
  hydrate,
  prefetch,
  visit: visit2,
  disconnect: disconnect9,
  register,
  get config() {
    return $.config;
  },
  supported: !!(isBrowser && window.history.pushState && window.requestAnimationFrame && window.DOMParser && window.Proxy),
  history: o({
    get state() {
      return api.state;
    },
    api,
    push,
    replace,
    has: has2,
    reverse: reverse2
  })
});
function connect10(options2 = {}) {
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
  if ($.config.globalThis && hasProp(window, "spx") === false) {
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
    for (const component of classes) {
      if (isArray(component)) {
        for (const item of component) {
          if (typeof item[0] === "string") {
            registerComponents({ [item[0]]: item[1] });
          } else if (typeof item === "function") {
            registerComponents({ [getComponentId(item)]: item }, true);
          }
        }
      } else {
        const type = typeof component;
        if (type === "function") {
          registerComponents({ [getComponentId(component)]: component }, true);
        } else if (type === "object") {
          registerComponents(component);
        }
      }
    }
  }
  if (!$.ready) {
    on("x", function run() {
      connect3();
      off("x", run);
    });
  } else {
    connect3();
  }
}
function session() {
  return defineProps(o(), {
    config: { get: () => $.config },
    snaps: { get: () => $.snaps },
    pages: { get: () => $.pages },
    observers: { get: () => $.observe },
    components: { get: () => $.components },
    fragments: { get: () => $.fragments },
    memory: {
      get() {
        const memory = $.memory;
        memory.size = size(memory.bytes);
        return memory;
      }
    }
  });
}
async function reload() {
  const state = $.pages[api.state.key];
  state.type = 9 /* RELOAD */;
  const page = await fetch(state);
  if (page) {
    log(2 /* INFO */, "Triggered reload, page was re-cached");
    return update(page);
  }
  log(3 /* WARN */, "Reload failed, triggering refresh (cache will purge)");
  return location.assign(state.key);
}
async function fetch2(url) {
  const link = getRoute(url, 2 /* FETCH */);
  if (link.location.origin !== origin) {
    log(5 /* ERROR */, "Cross origin fetches are not allowed");
  }
  const dom = await request(link.key);
  if (dom)
    return dom;
}
async function render(url, pushState, fn) {
  const page = $.page;
  const route = getRoute(url);
  if (route.location.origin !== origin)
    log(5 /* ERROR */, "Cross origin fetches are not allowed");
  const dom = await request(route.key, { type: "document" });
  if (!dom)
    log(5 /* ERROR */, `Fetch failed for: ${route.key}`, dom);
  await fn.call(page, dom);
  if (pushState === "replace") {
    page.title = dom.title;
    const state = update2(assign(page, route), takeSnapshot(dom));
    replace(state);
    return state;
  } else {
    return update(set(route, takeSnapshot(dom)));
  }
}
function capture(targets2) {
  const page = getPage();
  if (!page)
    return;
  const dom = getSnapDom();
  targets2 = isArray(targets2) ? targets2 : page.target;
  if (targets2.length === 1 && targets2[0] === "body") {
    morph(dom.body, d());
    update2(page, takeSnapshot(dom));
    return;
  }
  const selector2 = targets2.join(",");
  const current = d().querySelectorAll(selector2);
  forNode(dom.body.querySelectorAll(selector2), (node, i) => {
    morph(node, current[i]);
  });
  update2(page, takeSnapshot(dom));
}
async function prefetch(link) {
  const path = getRoute(link, 1 /* PREFETCH */);
  if (has(path.key)) {
    log(3 /* WARN */, `Cache already exists for ${path.key}, prefetch skipped`);
    return;
  }
  const prefetch2 = await fetch(create(path));
  if (prefetch2)
    return prefetch2;
  log(5 /* ERROR */, `Prefetch failed for ${path.key}`);
}
async function form(action, options2) {
  const body = new FormData();
  for (const key in options2.data) {
    body.append(key, options2.data[key]);
  }
  const submit = await request(action, {
    method: options2.method,
    body
  });
  return submit;
}
async function hydrate(link, nodes) {
  const route = getRoute(link, 7 /* HYDRATE */);
  fetch(route);
  if (isArray(nodes)) {
    route.hydrate = [];
    route.preserve = [];
    for (const node of nodes) {
      if (node.charCodeAt(0) === 33) {
        route.preserve.push(node.slice(1));
      } else {
        route.hydrate.push(node);
      }
    }
  } else {
    route.hydrate = $.config.fragments;
  }
  const page = await wait(route);
  if (page) {
    const { key } = api.state;
    replace(page);
    update(page);
    if (route.key !== key) {
      if ($.index === key)
        $.index = route.key;
      for (const p2 in $.pages) {
        if ($.pages[p2].rev === key) {
          $.pages[p2].rev = route.key;
        }
      }
      clear(key);
    }
  }
  return getSnapDom(page.key);
}
async function visit2(link, options2) {
  const route = getRoute(link);
  const merge = typeof options2 === "object" ? assign(route, options2) : route;
  return has(route.key) ? navigate(route.key, update2(merge)) : navigate(route.key, create(merge));
}
var src_default = spx;

export { src_default as default };
