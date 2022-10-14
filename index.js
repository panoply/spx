var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// ../../node_modules/.pnpm/detect-it@4.0.1/node_modules/detect-it/dist/detect-it.esm.js
var w = typeof window !== "undefined" ? window : { screen: {}, navigator: {} };
var matchMedia = (w.matchMedia || function() {
  return { matches: false };
}).bind(w);
var passiveOptionAccessed = false;
var options = {
  get passive() {
    return passiveOptionAccessed = true;
  }
};
var noop = function() {
};
w.addEventListener && w.addEventListener("p", noop, options);
w.removeEventListener && w.removeEventListener("p", noop, false);
var supportsPointerEvents = "PointerEvent" in w;
var onTouchStartInWindow = "ontouchstart" in w;
var touchEventInWindow = "TouchEvent" in w;
var supportsTouchEvents = onTouchStartInWindow || touchEventInWindow && matchMedia("(any-pointer: coarse)").matches;
var hasTouch = (w.navigator.maxTouchPoints || 0) > 0 || supportsTouchEvents;
var userAgent = w.navigator.userAgent || "";
var isIPad = matchMedia("(pointer: coarse)").matches && /iPad|Macintosh/.test(userAgent) && Math.min(w.screen.width || 0, w.screen.height || 0) >= 768;
var hasCoarsePrimaryPointer = (matchMedia("(pointer: coarse)").matches || !matchMedia("(pointer: fine)").matches && onTouchStartInWindow) && !/Windows.*Firefox/.test(userAgent);
var hasAnyHoverOrAnyFinePointer = matchMedia("(any-pointer: fine)").matches || matchMedia("(any-hover: hover)").matches || isIPad || !onTouchStartInWindow;
var deviceType = hasTouch && (hasAnyHoverOrAnyFinePointer || !hasCoarsePrimaryPointer) ? "hybrid" : hasTouch ? "touchOnly" : "mouseOnly";

// src/shared/native.ts
var pointer = supportsPointerEvents ? "pointer" : "mouse";
var history = window.history;
var origin = window.location.origin;
var assign = Object.assign;
var object = Object.create;
var isArray = Array.isArray;
var toArray = Array.from;
var nil = "";

// src/app/defaults.ts
var defaults = () => ({
  selectors: {},
  targets: ["body"],
  timeout: 3e4,
  schema: "spx",
  cache: true,
  limit: 100,
  preload: null,
  async: true,
  annotate: false,
  hover: {
    trigger: "attribute",
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
    background: "#111",
    height: "3px",
    minimum: 0.09,
    easing: "linear",
    speed: 300,
    trickle: true,
    threshold: 500,
    trickleSpeed: 300
  }
});

// src/app/session.ts
var config = defaults();
var observers = object(null);
var memory = object(null);
var pages = object(null);
var snapshots = object(null);
var tracked = /* @__PURE__ */ new Set();

// src/shared/utils.ts
function position(state2 = object(null)) {
  state2.x = window.scrollX;
  state2.y = window.scrollY;
  return state2;
}
function decodeEntities(string) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = string;
  return textarea.value;
}
function log(error, message) {
  if (error === 1 /* INFO */) {
    console.info("SPX: " + message);
  } else if (error === 2 /* WARN */) {
    console.warn("SPX: " + message);
  } else {
    console.error("SPX: " + message);
    try {
      if (error === 3 /* TYPE */) {
        throw new TypeError(message);
      } else {
        throw new Error(message);
      }
    } catch (e) {
    }
  }
}
function hasProp(object2, property) {
  return property in object2;
}
function uuid() {
  return Math.random().toString(36).slice(2);
}
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
function forEach(callback, array) {
  if (arguments.length === 1) {
    return (array2) => forEach(callback, array2);
  }
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

// src/app/config.ts
var configure = (options2 = {}) => {
  if (hasProp(options2, "hover")) {
    if (options2.hover === false)
      config.hover = false;
    else if (typeof options2.hover === "object")
      assign(config.hover, options2.hover);
    delete options2.hover;
  }
  if (hasProp(options2, "intersect")) {
    if (options2.intersect === false)
      config.intersect = false;
    else if (typeof options2.intersect === "object")
      assign(config.intersect, options2.intersect);
    delete options2.intersect;
  }
  if (hasProp(options2, "proximity")) {
    if (options2.proximity === false)
      config.proximity = false;
    else if (typeof options2.proximity === "object")
      assign(config.proximity, options2.proximity);
    delete options2.proximity;
  }
  if (hasProp(options2, "progress")) {
    if (options2.progress === false)
      config.progress = false;
    else if (typeof options2.progress === "object")
      assign(config.progress, options2.progress);
    delete options2.progress;
  }
  assign(config, options2);
  const schema = config.schema === null;
  const attr = schema ? "data" : `data-${config.schema}`;
  const href = `:not([${attr}-disable]):not([href^="#"])`;
  config.selectors.hrefs = config.annotate ? schema ? `a[data-spx]${href}` : `a[${attr}]${href}` : `a${href}`;
  config.selectors.tracking = `[${attr}-track]:not([${attr}-track=false])`;
  config.selectors.scripts = `script[${attr}-eval]:not([${attr}-eval=false])`;
  config.selectors.styles = `style[${attr}-eval]:not([${attr}-eval=false])`;
  config.selectors.attributes = new RegExp("^href|" + attr + "-(" + "hydrate|append|prepend|target|progress|threshold|position|proximity|hover" /* NAMES */ + ")$", "i");
  config.selectors.proximity = `a[${attr}-proximity]${href}${not("proximity")}`;
  config.selectors.intersector = `[${attr}-intersect]${not("intersect")}`;
  config.selectors.intersects = `a${href}${not("intersect")}`;
  config.selectors.hover = config.hover.trigger === "href" ? `a${href}${not("hover")}` : `a[${attr}-hover]${href}${not("hover")}`;
  memory.bytes = 0;
  memory.visits = 0;
  memory.limit = config.limit;
  function not(name) {
    const s = `:not([${attr}-${name}=false])`;
    if (name.charCodeAt(0) === 104)
      return `${s}:not([${attr}-proximity]):not([${attr}-intersect])`;
    if (name.charCodeAt(0) === 105)
      return `${s}:not([${attr}-hover]):not([${attr}-proximity])`;
    if (name.charCodeAt(0) === 112)
      return `${s}:not([${attr}-intersect]):not([${attr}-hover])`;
  }
  ;
};

// src/shared/regexp.ts
var Protocol = /(?:https?:)?\/\/(?:www\.)?/;
var isPender = /\b(?:append|prepend)/;
var MimeType = /^(?:application|text)\/(?:x-)?(?:ecma|java)script|text\/javascript$/;
var isBoolean = /^\b(?:true|false)$/i;
var isNumber = /^[+-]?\d*\.?\d+$/;
var Whitespace = /\s+/g;
var isPrefetch = /\b(?:intersect|hover|proximity)\b/;
var ActionParams = /\[?[^,'"[\]()\s]+\]?/g;
var isArray2 = /\(?\[(['"]?.*['"]?,?)\]\)?/;
var isPosition = /[xy]:[0-9.]+/;
var inPosition = /[xy]|\d*\.?\d+/g;

// src/app/location.ts
var hostname = origin.replace(Protocol, nil);
function parseAttribute(attributes) {
  const state2 = object(null);
  forEach((current, index, source) => {
    const prop = source.length - 1 >= index ? index - 1 : index;
    if (index % 2)
      state2[source[prop]] = isNumber.test(current) ? Number(current) : current;
  }, attributes);
  return state2;
}
function getAttributes(element2, page) {
  const state2 = page || object(null);
  for (const { nodeName, nodeValue } of element2.attributes) {
    if (!config.selectors.attributes.test(nodeName))
      continue;
    if (nodeName === "href") {
      state2.rev = location.pathname + location.search;
      if (!page) {
        state2.location = getLocation(nodeValue);
        state2.key = state2.location.pathname + state2.location.search;
      }
    } else {
      const name = nodeName.slice(1 + nodeName.lastIndexOf("-"));
      const value = nodeValue.replace(Whitespace, nil);
      if (isArray2.test(value)) {
        state2[name] = isPender.test(name) ? value.match(ActionParams).reduce(chunk(2), []) : value.match(ActionParams);
      } else if (isPosition.test(value)) {
        state2[name] = parseAttribute(value.match(inPosition));
      } else if (isBoolean.test(value)) {
        if (!isPrefetch.test(nodeName))
          state2[name] = value === "true";
      } else if (isNumber.test(value)) {
        state2[name] = Number(value);
      } else {
        state2[name] = value;
      }
    }
  }
  return state2;
}
function parsePath(path) {
  const state2 = object(null);
  const size2 = path.length;
  if (size2 === 1 && path.charCodeAt(0) === 47) {
    state2.pathname = path;
    state2.hash = nil;
    state2.search = nil;
    return state2;
  }
  const hash = path.indexOf("#");
  if (hash >= 0) {
    state2.hash = path.slice(hash);
    path = path.slice(0, hash);
  } else {
    state2.hash = nil;
  }
  const params = path.indexOf("?");
  if (params >= 0) {
    state2.search = path.slice(params);
    path = path.slice(0, params);
  } else {
    state2.search = nil;
  }
  state2.pathname = path;
  return state2;
}
function getPath(url, proto) {
  const path = url.indexOf("/", proto);
  if (path > proto) {
    const hash = url.indexOf("#", path);
    return hash < 0 ? url.slice(path) : url.slice(path, hash);
  }
  const param = url.indexOf("?", proto);
  if (param > proto) {
    const hash = url.indexOf("#", param);
    return hash < 0 ? url.slice(param) : url.slice(param, hash);
  }
  return url.length - proto === hostname.length ? "/" : null;
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
    return 1;
  if (url.startsWith("//"))
    return 2;
  if (url.startsWith("www."))
    return 3;
  return 0;
}
function validKey(url) {
  if (typeof url !== "string" || url.length === 0)
    return false;
  if (url.charCodeAt(0) === 47) {
    if (url.charCodeAt(1) !== 47)
      return true;
    if (url.startsWith("www.", 2))
      return url.startsWith(hostname, 6);
    return url.startsWith(hostname, 2);
  }
  if (url.charCodeAt(0) === 63)
    return true;
  if (url.startsWith("www."))
    return url.startsWith(hostname, 4);
  if (url.startsWith("http")) {
    const start2 = url.indexOf("/", 4) + 2;
    return url.startsWith("www.", start2) ? url.startsWith(hostname, start2 + 4) : url.startsWith(hostname, start2);
  }
}
function parseKey(url) {
  if (url.charCodeAt(0) === 47) {
    return url.charCodeAt(1) !== 47 ? parsePath(url) : parseOrigin(url.slice(2));
  }
  if (url.charCodeAt(0) === 63)
    return parsePath(location.pathname + url);
  if (url.startsWith("https:") || url.startsWith("http:")) {
    return parseOrigin(url.slice(url.indexOf("/", 4) + 2));
  }
  if (url.startsWith("www."))
    return parseOrigin(url);
  return null;
}
function getKey(link) {
  if (typeof link === "object")
    return link.pathname + link.search;
  if (link === nil)
    return "/";
  const has2 = hasOrigin(link);
  if (has2 === 1) {
    const proto = link.charCodeAt(4) === 115 ? 8 : 7;
    const www = link.startsWith("www.", proto) ? proto + 4 : proto;
    return link.startsWith(hostname, www) ? getPath(link, www) : null;
  }
  if (has2 === 2) {
    const www = link.startsWith("www.", 2) ? 6 : 2;
    return link.startsWith(hostname, www) ? getPath(link, www) : null;
  }
  if (has2 === 3)
    return link.startsWith(hostname, 4) ? getPath(link, 4) : null;
  return link.startsWith(hostname, 0) ? getPath(link, 0) : null;
}
function fallback() {
  return {
    hostname,
    origin,
    pathname: location.pathname,
    search: location.search,
    hash: location.hash
  };
}
function getLocation(path) {
  if (path === nil)
    return fallback();
  const state2 = parseKey(path);
  state2.origin = origin;
  state2.hostname = hostname;
  return state2;
}
function getRoute(link, type) {
  if (link instanceof Element) {
    const state3 = getAttributes(link);
    state3.type = type || 7 /* VISIT */;
    return state3;
  }
  const state2 = object(null);
  state2.rev = location.pathname + location.search;
  state2.location = getLocation(typeof link === "string" ? link : state2.rev);
  state2.key = getKey(state2.location);
  state2.type = type || 7 /* VISIT */;
  return state2;
}

// src/shared/dom.ts
function parse(HTMLString) {
  return new DOMParser().parseFromString(HTMLString, "text/html");
}
function getTitle(dom) {
  const start2 = dom.indexOf(">", dom.indexOf("<title")) + 1;
  const end = dom.indexOf("</title", start2);
  return decodeEntities(dom.slice(start2, end));
}

// src/app/events.ts
var events = object(null);
function emit(name, ...args) {
  const isCache = name === "store";
  if (isCache)
    args.splice(-1, 1, parse(args[args.length - 1]));
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
  }, events[name] || []);
  return returns;
}
function on(name, callback) {
  if (!hasProp(events, name))
    events[name] = [];
  events[name].push(callback);
}
function off(name, callback) {
  const evts = events[name];
  const live = [];
  if (evts && callback) {
    let i = 0;
    const len = evts.length;
    for (; i < len; i++)
      if (evts[i] !== callback)
        live.push(evts[i]);
  }
  if (live.length)
    events[name] = live;
  else
    delete events[name];
  return this;
}

// src/app/store.ts
function purge(key = []) {
  const keys = isArray(key) ? key : [key];
  for (const p in pages) {
    const index = keys.indexOf(p);
    if (index >= 0) {
      delete snapshots[pages[p].uuid];
      delete pages[p];
      keys.splice(index, 1);
    }
  }
}
function clear(key) {
  if (!key) {
    empty(pages);
    empty(snapshots);
  } else if (typeof key === "string") {
    delete snapshots[pages[key].uuid];
    delete pages[key];
  } else if (isArray(key)) {
    forEach((url) => {
      delete pages[url];
      delete snapshots[pages[url].uuid];
    }, key);
  }
}
function create(page) {
  page.target = hasProp(page, "target") ? page.target.length === 1 && page.target[0] === "body" ? page.target : [].concat(config.targets, page.target) : config.targets;
  if (config.cache) {
    if (!hasProp(page, "cache"))
      page.cache = config.cache;
    if (!hasProp(page, "uuid"))
      page.uuid = uuid();
  }
  if (!hasProp(page, "position")) {
    page.position = object(null);
    page.position.y = 0;
    page.position.x = 0;
  }
  if (config.hover !== false && page.type === 11 /* HOVER */) {
    if (!hasProp(page, "threshold"))
      page.threshold = config.hover.threshold;
  }
  if (config.proximity !== false && page.type === 13 /* PROXIMITY */) {
    if (!hasProp(page, "proximity"))
      page.proximity = config.proximity.distance;
    if (!hasProp(page, "threshold"))
      page.threshold = config.proximity.threshold;
  }
  if (config.progress !== false && !hasProp(page, "progress")) {
    page.progress = config.progress.threshold;
  }
  if (!hasProp(page, "visits"))
    page.visits = 0;
  pages[page.key] = page;
  return pages[page.key];
}
function set(state2, snapshot) {
  const event = emit("store", state2, snapshot);
  const dom = typeof event === "string" ? event : snapshot;
  if (state2.type > 6) {
    if (state2.type > 10) {
      state2.type = 2 /* PREFETCH */;
    } else {
      if (hasProp(pages, state2.rev)) {
        pages[state2.rev].position.x = window.scrollX;
        pages[state2.rev].position.y = window.scrollY;
      }
    }
  }
  state2.title = getTitle(dom);
  if (!config.cache || event === false)
    return state2;
  if (!hasProp(state2, "uuid"))
    return update(state2, dom);
  pages[state2.key] = state2;
  snapshots[state2.uuid] = dom;
  emit("cached", state2);
  return state2;
}
function update(page, snapshot) {
  const state2 = hasProp(pages, page.key) ? pages[page.key] : create(page);
  if (typeof snapshot === "string") {
    snapshots[page.uuid] = snapshot;
    page.title = getTitle(snapshot);
    page.position = position();
  }
  return assign(state2, page);
}
function get(key = history.state.key) {
  if (hasProp(pages, key)) {
    const state2 = object(null);
    state2.page = pages[key];
    state2.dom = parse(snapshots[state2.page.uuid]);
    return state2;
  }
  log(4 /* ERROR */, `No record exists: ${key}`);
}
function has(key) {
  return hasProp(pages, key) && hasProp(pages[key], "uuid") && hasProp(snapshots, pages[key].uuid) && typeof snapshots[pages[key].uuid] === "string";
}

// src/shared/links.ts
function getLink(target, selector) {
  if (!(target instanceof Element))
    return false;
  const element2 = target.closest(selector);
  return element2 && element2.tagName === "A" ? element2 : false;
}
function canFetch(target) {
  if (target.nodeName !== "A")
    return false;
  const href = target.href;
  if (!validKey(href))
    return false;
  return !has(getKey(href));
}
function getNodeTargets(selector, hrefs) {
  return toArray(document.body.querySelectorAll(selector)).flatMap((node) => {
    return node.nodeName !== "A" ? toArray(node.querySelectorAll(hrefs)).filter(canFetch) : canFetch(node) ? node : [];
  });
}
var getTargets = (selector) => {
  return toArray(document.body.querySelectorAll(selector)).filter(canFetch);
};

// src/app/fetch.ts
var transit = object(null);
var timers = object(null);
var XHR = class extends XMLHttpRequest {
  constructor() {
    super(...arguments);
    this.key = null;
  }
};
var xhr = /* @__PURE__ */ new Map();
function request(key) {
  return new Promise(function(resolve, reject) {
    const req = new XHR();
    req.key = key;
    req.responseType = "text";
    req.open("GET", key);
    req.setRequestHeader("X-SPX", "true");
    req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    req.onload = function() {
      resolve(this.response);
    };
    req.onerror = function() {
      reject(this.statusText);
    };
    req.onabort = function() {
      xhr.delete(this.key);
    };
    req.onloadend = function(event) {
      memory.bytes = memory.bytes + event.loaded;
      memory.visits = memory.visits + 1;
      xhr.delete(this.key);
    };
    req.send();
    xhr.set(key, req);
  });
}
function throttle(key, callback, delay) {
  if (hasProp(timers, key))
    return;
  if (!has(key))
    timers[key] = setTimeout(callback, delay);
}
function cleanup(key) {
  if (!hasProp(timers, key))
    return true;
  clearTimeout(timers[key]);
  return delete timers[key];
}
function cancel(key) {
  return xhr.forEach((req, url) => {
    if (key !== url) {
      req.abort();
      log(2 /* WARN */, `Pending request aborted: ${url}`);
    }
  });
}
function preload(state2) {
  if (config.preload !== null) {
    if (isArray(config.preload)) {
      const promises = config.preload.filter((path) => {
        const route = getRoute(path, 4 /* PRELOAD */);
        return route.key !== path ? fetch(create(route)) : false;
      });
      return Promise.allSettled(promises);
    } else if (typeof config.preload === "object") {
      if (hasProp(config.preload, state2.key)) {
        const promises = config.preload[state2.key].map((path) => fetch(create(getRoute(path, 4 /* PRELOAD */))));
        return Promise.allSettled(promises);
      }
    }
  }
}
function reverse(key) {
  return __async(this, null, function* () {
    if (has(key)) {
      pages[key].position = position();
      return;
    }
    const route = getRoute(key, 5 /* REVERSE */);
    const page = create(route);
    setTimeout(() => fetch(page));
  });
}
function wait(state2) {
  return __async(this, null, function* () {
    if (!hasProp(transit, state2.key))
      return state2;
    const snapshot = yield transit[state2.key];
    return set(state2, snapshot);
  });
}
function fetch(state2) {
  return __async(this, null, function* () {
    if (xhr.has(state2.key)) {
      if (state2.type === 5 /* REVERSE */ && xhr.has(state2.rev)) {
        xhr.get(state2.rev).abort();
        log(2 /* WARN */, `Request aborted: ${state2.rev}`);
      } else {
        log(2 /* WARN */, `Request in transit: ${state2.key}`);
      }
      return false;
    }
    if (!emit("fetch", state2)) {
      log(2 /* WARN */, `Request cancelled via dispatched event: ${state2.key}`);
      return false;
    }
    transit[state2.key] = request(state2.key);
    return wait(state2);
  });
}

// src/observers/hover.ts
function onEnter(event) {
  const target = getLink(event.target, config.selectors.hover);
  if (!target)
    return;
  const route = getRoute(target, 11 /* HOVER */);
  if (hasProp(timers, route.key) || has(route.key))
    return;
  target.addEventListener(`${pointer}leave`, onLeave, { once: true });
  const state2 = create(route);
  const delay = state2.threshold || config.hover.threshold;
  throttle(route.key, function() {
    return __async(this, null, function* () {
      if (!emit("prefetch", target, route))
        return;
      const fetched = yield fetch(state2);
      if (fetched)
        removeListener(target);
    });
  }, delay);
}
function onLeave(event) {
  const target = getLink(event.target, config.selectors.hover);
  if (target)
    cleanup(getKey(target.href));
}
function addListener(target) {
  target.addEventListener(`${pointer}enter`, onEnter);
}
function removeListener(target) {
  target.removeEventListener(`${pointer}enter`, onEnter);
  target.removeEventListener(`${pointer}leave`, onLeave);
}
function connect() {
  if (!config.hover || observers.hover)
    return;
  forEach(addListener, getTargets(config.selectors.hover));
  observers.hover = true;
}
function disconnect() {
  if (!observers.hover)
    return;
  forEach(removeListener, getTargets(config.selectors.hover));
  observers.hover = false;
}

// src/observers/proximity.ts
function inRange({ clientX, clientY }, bounds) {
  return clientX <= bounds.right && clientX >= bounds.left && clientY <= bounds.bottom && clientY >= bounds.top;
}
function setBounds(target) {
  const rect = target.getBoundingClientRect();
  const attr = target.getAttribute(config.selectors.proximity);
  const distance = isNumber.test(attr) ? Number(attr) : config.proximity.distance;
  return {
    target,
    top: rect.top - distance,
    bottom: rect.bottom + distance,
    left: rect.left - distance,
    right: rect.right + distance
  };
}
function observer(targets) {
  let wait2 = false;
  return function(event) {
    if (wait2)
      return;
    wait2 = true;
    const node = targets.findIndex((node2) => inRange(event, node2));
    if (node === -1) {
      setTimeout(() => {
        wait2 = false;
      }, config.proximity.throttle);
    } else {
      const { target } = targets[node];
      const page = create(getRoute(target, 13 /* PROXIMITY */));
      const delay = page.threshold || config.proximity.threshold;
      throttle(page.key, () => __async(this, null, function* () {
        if (!emit("prefetch", target, page))
          return disconnect2();
        const prefetch2 = yield fetch(page);
        if (prefetch2) {
          targets.splice(node, 1);
          wait2 = false;
          if (targets.length === 0) {
            disconnect2();
            log(1 /* INFO */, "Proximity observer disconnected");
          }
        }
      }), delay);
    }
  };
}
var entries;
function connect2() {
  if (!config.proximity || observers.proximity)
    return;
  const targets = getTargets(config.selectors.proximity).map(setBounds);
  if (targets.length > 0) {
    entries = observer(targets);
    if (supportsPointerEvents) {
      addEventListener("pointermove", entries, { passive: true });
    } else {
      addEventListener("mousemove", entries, { passive: true });
    }
    observers.proximity = true;
  }
}
function disconnect2() {
  if (!observers.proximity)
    return;
  if (supportsPointerEvents) {
    removeEventListener("pointermove", entries);
  } else {
    removeEventListener("mousemove", entries);
  }
  observers.proximity = false;
}

// src/observers/intersect.ts
var entries2;
function onIntersect(entry) {
  return __async(this, null, function* () {
    if (entry.isIntersecting) {
      const route = getRoute(entry.target, 12 /* INTERSECT */);
      if (!emit("prefetch", entry.target, route))
        return entries2.unobserve(entry.target);
      const response = yield fetch(create(route));
      if (response) {
        entries2.unobserve(entry.target);
      } else {
        log(2 /* WARN */, `Prefetch will retry at next intersect for: ${route.key}`);
        entries2.observe(entry.target);
      }
    }
  });
}
function connect3() {
  if (!config.intersect || observers.intersect)
    return;
  if (!entries2)
    entries2 = new IntersectionObserver(forEach(onIntersect), config.intersect);
  const observe = forEach((target) => entries2.observe(target));
  const targets = getNodeTargets(config.selectors.intersector, config.selectors.intersects);
  observe(targets);
  observers.intersect = true;
}
function disconnect3() {
  if (!observers.intersect)
    return;
  entries2.disconnect();
  observers.intersect = false;
}

// src/app/progress.ts
var status = null;
var timeout;
var element = null;
var pending = [];
function setProgress(n) {
  const { speed, easing, minimum } = config.progress;
  const started = typeof status === "number";
  n = clamp(n, minimum, 1);
  status = n === 1 ? null : n;
  const progress = render(!started);
  progress.offsetWidth;
  queue((next) => {
    progress.style.transform = `translate3d(${percentage(n)}%,0,0)`;
    progress.style.transition = `all ${speed}ms ${easing}`;
    if (n !== 1)
      return setTimeout(next, speed);
    progress.style.transition = "none";
    progress.style.opacity = "1";
    progress.offsetWidth;
    setTimeout(() => {
      progress.style.transition = `all ${speed}ms ${easing}`;
      progress.style.opacity = "0";
      setTimeout(() => [remove(), next()], speed);
    }, speed);
  });
}
function increment(amount) {
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
    n = clamp(n + amount, 0, 0.994);
    return setProgress(n);
  }
}
function render(fromStart) {
  if (element)
    return element;
  document.documentElement.classList.add("spx-load");
  const percent = fromStart ? "-100" : percentage(status || 0);
  const progress = document.createElement("div");
  progress.id = "spx-progress";
  progress.style.pointerEvents = "none";
  progress.style.background = config.progress.background;
  progress.style.height = config.progress.height;
  progress.style.position = "fixed";
  progress.style.zIndex = "9999999";
  progress.style.top = "0";
  progress.style.left = "0";
  progress.style.width = "100%";
  progress.style.transition = "all 0 linear";
  progress.style.transform = `translate3d(${percent}%,0,0)`;
  document.body.appendChild(progress);
  element = progress;
  return progress;
}
function remove() {
  document.documentElement.classList.remove("spx-load");
  const progress = document.getElementById("spx-progress");
  progress && document.body.removeChild(element);
  element = null;
}
function clamp(n, min, max) {
  if (n < min)
    return min;
  if (n > max)
    return max;
  return n;
}
function percentage(n) {
  return (-1 + n) * 100;
}
function queue(fn) {
  const next = () => {
    const fn2 = pending.shift();
    if (fn2)
      fn2(next);
  };
  pending.push(fn);
  if (pending.length === 1)
    next();
}
function start(threshold) {
  if (!config.progress)
    return;
  timeout = setTimeout(function() {
    if (!status)
      setProgress(0);
    const work = function() {
      setTimeout(() => {
        if (!status)
          return;
        increment();
        work();
      }, config.progress.trickleSpeed);
    };
    if (config.progress.trickle)
      work();
  }, threshold || 0);
}
function done(force) {
  clearTimeout(timeout);
  if (!force && !status)
    return;
  increment(0.3 + 0.5 * Math.random());
  return setProgress(1);
}

// src/observers/scripts.ts
function evaluator(exec) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.addEventListener("error", reject, { once: true });
    script.async = false;
    script.text = exec.target.text;
    for (const { nodeName, nodeValue } of exec.target.attributes) {
      script.setAttribute(nodeName, nodeValue);
    }
    if (document.contains(exec.target)) {
      exec.target.replaceWith(script);
    } else {
      document.head.append(script);
      exec.external ? script.addEventListener("load", () => script.remove(), { once: true }) : script.remove();
    }
    exec.external ? script.addEventListener("load", () => resolve(), { once: true }) : resolve();
  });
}
function scriptTag(tag) {
  if (!tag.hasAttribute("src") && !tag.text)
    return;
  const mime = tag.type ? tag.type.trim().toLowerCase() : "text/javascript";
  const type = MimeType.test(mime) ? 1 : mime === "module" ? 2 : NaN;
  const exec = object(null);
  exec.blocking = true;
  exec.evaluate = false;
  exec.external = false;
  if (isNaN(type) || tag.noModule && type === 1)
    return exec;
  if (tag.src)
    exec.external = true;
  if (type !== 1 || exec.external && (tag.hasAttribute("async") || tag.defer))
    exec.blocking = false;
  exec.evaluate = true;
  exec.target = tag;
  return exec;
}
function execute(script) {
  return __async(this, null, function* () {
    try {
      const evaluate = evaluator(script);
      if (script.blocking)
        yield evaluate;
    } catch (e) {
      console.error(e);
    }
  });
}
function evaljs(scripts) {
  return __async(this, null, function* () {
    const scriptjs = toArray(scripts, scriptTag).filter((script) => script.evaluate);
    const executed = scriptjs.reduce((promise, script) => __async(this, null, function* () {
      if (script.external)
        return Promise.all([promise, execute(script)]);
      yield promise;
      const exec = yield execute(script);
      return exec;
    }), Promise.resolve());
    yield Promise.race([executed]);
  });
}

// src/app/render.ts
function nodePosition(a, b) {
  return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING || -1;
}
function scriptNodes(target) {
  return __async(this, null, function* () {
    const scripts = toArray(target.querySelectorAll(config.selectors.scripts));
    scripts.sort(nodePosition);
    yield evaljs(scripts);
  });
}
function trackedNodes(target) {
  target.querySelectorAll(config.selectors.tracking).forEach((node) => {
    if (!node.hasAttribute("id"))
      return;
    if (!tracked.has(node.id)) {
      document.body.appendChild(node);
      tracked.add(node.id);
    }
  });
}
function renderNodes(page, target) {
  const nodes = page.target;
  if (nodes.length === 1 && nodes[0] === "body")
    return document.body.replaceWith(target.body);
  const selector = nodes.join(",");
  const current = document.body.querySelectorAll(selector);
  const fetched = target.body.querySelectorAll(selector);
  current.forEach((node, i) => {
    if (!node.matches(nodes[i]))
      return;
    if (!emit("render", node, fetched[i]))
      return;
    node.replaceWith(fetched[i]);
    if (page.append || page.prepend) {
      const fragment = document.createElement("div");
      target.childNodes.forEach(fragment.appendChild);
      return page.append ? node.appendChild(fragment) : node.insertBefore(fragment, node.firstChild);
    }
  });
  trackedNodes(target.body);
}
function hydrateNodes(state2, target) {
  const nodes = state2.hydrate.join(",");
  const current = document.body.querySelectorAll(nodes);
  if (current.length > 0) {
    const fetched = target.body.querySelectorAll(nodes);
    current.forEach((node, i) => {
      if (!fetched[i])
        return;
      if (!emit("hydrate", node, fetched[i]))
        return;
      if (node.firstChild.nodeType === Node.TEXT_NODE) {
        node.innerHTML = fetched[i].innerHTML;
      } else {
        node.replaceWith(fetched[i]);
      }
    });
  }
  state2.type = 7 /* VISIT */;
  update(state2);
  purge(state2.key);
}
function update2(page) {
  document.title = page.title;
  disconnect();
  disconnect3();
  disconnect2();
  const target = parse(snapshots[page.uuid]);
  if (page.type === 8 /* HYDRATE */) {
    hydrateNodes(page, target);
  } else {
    renderNodes(page, target);
    scrollTo(page.position.x, page.position.y);
  }
  scriptNodes(target.head);
  done();
  connect();
  connect3();
  connect2();
  emit("load", page);
  return page;
}

// src/observers/history.ts
function stack(page) {
  const state2 = object(null);
  state2.key = page.key;
  state2.rev = page.rev;
  state2.title = page.title;
  state2.position = page.position;
  return state2;
}
function load() {
  return document.readyState === "complete";
}
function doReverse() {
  return history.state !== null && hasProp(history.state, "rev") && history.state.key !== history.state.rev;
}
function replace(state2) {
  history.replaceState(stack(state2), state2.title, state2.key);
  return state2;
}
function push(state2) {
  history.pushState(stack(state2), state2.title, state2.key);
  return state2;
}
var timeout2;
function pop(event) {
  if (!load())
    return;
  if (event.state === null)
    return;
  clearInterval(timeout2);
  if (has(event.state.key)) {
    reverse(event.state.rev);
    return update2(pages[event.state.key]);
  }
  timeout2 = setTimeout(function() {
    return __async(this, null, function* () {
      event.state.type = 6 /* POPSTATE */;
      const page = yield fetch(event.state);
      if (!page)
        return location.assign(event.state.key);
      const key = getKey(location);
      if (page.key === key) {
        return update2(page);
      } else if (has(key)) {
        return update2(pages[key]);
      } else {
        const data = create(getRoute(key, 6 /* POPSTATE */));
        yield fetch(data);
        history.pushState(data, document.title, key);
      }
    });
  }, 200);
}
function connect4() {
  if (observers.history)
    return;
  addEventListener("popstate", pop, false);
  observers.history = true;
}
function disconnect4() {
  if (!observers.history)
    return;
  removeEventListener("popstate", pop, false);
  observers.history = false;
}

// src/observers/hrefs.ts
function linkEvent(event) {
  return !(event.target && event.target.isContentEditable || event.defaultPrevented || event.which > 1 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
}
function handleTrigger(event) {
  if (!linkEvent(event))
    return;
  const target = getLink(event.target, config.selectors.hrefs);
  if (!target)
    return;
  const key = getKey(target.href);
  if (key === null)
    return;
  if (!emit("visit", event))
    return;
  disconnect();
  disconnect2();
  disconnect3();
  const options2 = { once: true };
  if (has(key)) {
    const attrs = getAttributes(target, pages[key]);
    const page = update(attrs);
    target.addEventListener("click", function handle(event2) {
      event2.preventDefault();
      pages[page.rev].position = position();
      push(page);
      update2(page);
    }, options2);
  } else if (hasProp(transit, key)) {
    const page = pages[key];
    cancel(key);
    target.addEventListener("click", function handle(event2) {
      event2.preventDefault();
      pages[page.rev].position = position();
      visit(page);
    }, options2);
  } else {
    cancel();
    cleanup(key);
    const route = getRoute(target, 7 /* VISIT */);
    const page = create(route);
    fetch(page);
    target.addEventListener("click", function handle(event2) {
      event2.preventDefault();
      pages[page.rev].position = position();
      visit(page);
    }, options2);
  }
}
function visit(state2) {
  return __async(this, null, function* () {
    start(state2.progress);
    const page = yield wait(state2);
    if (page) {
      push(page);
      update2(page);
    } else {
      return location.assign(state2.key);
    }
  });
}
function navigate(key, state2) {
  return __async(this, null, function* () {
    if (state2) {
      if (typeof state2.cache === "string")
        state2.cache === "clear" ? clear() : clear(state2.key);
      start(state2.progress);
      const page = yield fetch(state2);
      if (page) {
        push(page);
        update2(page);
      } else {
        location.assign(state2.key);
      }
    } else {
      return visit(pages[key]);
    }
  });
}
function connect5() {
  if (observers.hrefs)
    return;
  if (deviceType === "mouseOnly") {
    addEventListener(`${pointer}down`, handleTrigger, false);
  } else if (deviceType === "touchOnly") {
    addEventListener("touchstart", handleTrigger, false);
  } else {
    addEventListener(`${pointer}down`, handleTrigger, false);
    addEventListener("touchstart", handleTrigger, false);
  }
  observers.hrefs = true;
}
function disconnect5() {
  if (!observers.hrefs)
    return;
  if (deviceType === "mouseOnly") {
    removeEventListener(`${pointer}down`, handleTrigger, false);
  } else if (deviceType === "touchOnly") {
    removeEventListener("touchstart", handleTrigger, false);
  } else {
    removeEventListener(`${pointer}down`, handleTrigger, false);
    removeEventListener("touchstart", handleTrigger, false);
  }
  observers.hrefs = false;
}

// src/app/controller.ts
function initialize() {
  connect4();
  const state2 = create(getRoute(1 /* INITIAL */));
  return new Promise((resolve) => {
    document.addEventListener("DOMContentLoaded", () => {
      connect5();
      connect();
      connect3();
      connect2();
      const page = set(state2, document.documentElement.outerHTML);
      if (doReverse())
        page.rev = history.state.rev;
      page.position = position();
      replace(page);
      if (page.rev !== page.key)
        setTimeout(() => reverse(page.rev));
      setTimeout(() => preload(page));
      resolve(page);
    }, { once: true });
  });
}
function disconnect6() {
  disconnect4();
  disconnect5();
  disconnect();
  disconnect3();
  disconnect2();
  clear();
  log(1 /* INFO */, "Disconnected \u{1F614}");
}

// src/index.ts
var supported = !!(window.history.pushState && window.requestAnimationFrame && window.addEventListener && window.DOMParser);
function connect6(options2 = {}) {
  if (!supported) {
    return log(4 /* ERROR */, "Browser does not support SPX");
  }
  if (!window.location.protocol.startsWith("http")) {
    return log(4 /* ERROR */, "Invalid protocol, SPX expects https or http protocol");
  }
  configure(options2);
  const promise = initialize();
  return function(callback) {
    return __async(this, null, function* () {
      const state2 = yield promise;
      callback(state2);
      log(1 /* INFO */, "Connection Established \u26A1");
    });
  };
}
function session(key, update4) {
  if (key) {
    if (update4) {
      if (key === "config")
        configure(update4);
      if (key === "observers")
        assign(observers, update4);
    } else {
      if (key === "config")
        return config;
      if (key === "observers")
        return observers;
      if (key === "pages")
        return pages;
      if (key === "snapshots")
        return snapshots;
      if (key === "memory")
        return size(memory.bytes);
    }
  }
  const state2 = object(null);
  state2.config = config;
  state2.snapshots = snapshots;
  state2.pages = pages;
  state2.observers = observers;
  state2.memory = memory;
  state2.memory.size = size(state2.memory.bytes);
  return state2;
}
function state(key, update4) {
  return __async(this, null, function* () {
    if (key === void 0)
      return get();
    if (typeof key === "string") {
      const k = getKey(key);
      if (!has(k))
        log(4 /* ERROR */, `No store exists at: ${k}`);
      const record = get(k);
      return update4 !== void 0 ? update(assign(record.page, update4)) : record;
    }
    if (typeof key === "object")
      return update(key);
  });
}
function reload(options2) {
  return __async(this, null, function* () {
    const state2 = pages[history.state.key];
    if (options2)
      assign(state2, options2);
    state2.type = 10 /* RELOAD */;
    const page = yield fetch(state2);
    if (page) {
      log(1 /* INFO */, "Triggered reload, page was re-cached");
      return update2(page);
    }
    log(2 /* WARN */, "Reload failed, triggering refresh (cache will be purged)");
    return location.assign(state2.key);
  });
}
function fetch2(url) {
  return __async(this, null, function* () {
    const link = getRoute(url, 3 /* FETCH */);
    if (link.location.origin !== origin) {
      log(4 /* ERROR */, "Cross origin fetches are not allowed");
    }
    const response = yield request(link.key);
    if (response)
      return parse(response);
  });
}
function clear2(url) {
  return clear(url);
}
function update3(elements) {
  return __async(this, null, function* () {
  });
}
function hydrate(link, elements) {
  return __async(this, null, function* () {
    const route = getRoute(8 /* HYDRATE */);
    route.position = position();
    route.hydrate = elements;
    const dom = yield request(link);
    if (!dom)
      return log(2 /* WARN */, "Hydration fetch failed");
    const page = has(route.key) ? update(route, dom) : create(route);
    setTimeout(() => reverse(route.rev));
    return update2(page);
  });
}
function prefetch(link) {
  return __async(this, null, function* () {
    const path = getRoute(link, 2 /* PREFETCH */);
    if (has(path.key)) {
      log(2 /* WARN */, `Cache already exists for ${path.key}, prefetch skipped`);
      return;
    }
    const prefetch2 = yield fetch(create(path));
    if (prefetch2)
      return prefetch2;
    log(4 /* ERROR */, `Prefetch failed for ${path.key}`);
  });
}
function visit2(link, options2) {
  return __async(this, null, function* () {
    const route = getRoute(link);
    const merge = typeof options2 === "object" ? assign(route, options2) : route;
    return has(route.key) ? navigate(route.key, update(merge)) : navigate(route.key, create(merge));
  });
}
var src_default = {
  supported,
  on,
  off,
  connect: connect6,
  session,
  state,
  reload,
  fetch: fetch2,
  clear: clear2,
  hydrate,
  prefetch,
  visit: visit2,
  disconnect: disconnect6
};
export {
  clear2 as clear,
  connect6 as connect,
  src_default as default,
  disconnect6 as disconnect,
  fetch2 as fetch,
  hydrate,
  off,
  on,
  prefetch,
  reload,
  session,
  state,
  supported,
  update3 as update,
  visit2 as visit
};
