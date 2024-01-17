var Ir = Object.defineProperty;
var Nr = (e, t) => {
  for (var r in t)
    Ir(e, r, { get: t[r], enumerable: !0 });
};
var P = (e, t, r) => new Promise((o, s) => {
  var i = (d) => {
    try {
      a(r.next(d));
    } catch (y) {
      s(y);
    }
  }, c = (d) => {
    try {
      a(r.throw(d));
    } catch (y) {
      s(y);
    }
  }, a = (d) => d.done ? o(d.value) : Promise.resolve(d.value).then(i, c);
  a((r = r.apply(e, t)).next());
});

// ../../node_modules/.pnpm/detect-it@4.0.1/node_modules/detect-it/dist/detect-it.esm.js
var X = typeof window != "undefined" ? window : { screen: {}, navigator: {} }, me = (X.matchMedia || function() {
  return { matches: !1 };
}).bind(X), Rr = {
  get passive() {
    return !0;
  }
}, Pt = function() {
};
X.addEventListener && X.addEventListener("p", Pt, Rr);
X.removeEventListener && X.removeEventListener("p", Pt, !1);
var _e = "ontouchstart" in X, $r = "TouchEvent" in X, ze = _e || $r && me("(any-pointer: coarse)").matches, Tt = (X.navigator.maxTouchPoints || 0) > 0 || ze, It = X.navigator.userAgent || "", Lr = me("(pointer: coarse)").matches && // both iPad and iPhone can "request desktop site", which sets the userAgent to Macintosh
// so need to check both userAgents to determine if it is an iOS device
// and screen size to separate iPad from iPhone
/iPad|Macintosh/.test(It) && Math.min(X.screen.width || 0, X.screen.height || 0) >= 768, wr = (me("(pointer: coarse)").matches || // if the pointer is not coarse and not fine then the browser doesn't support
// interaction media queries (see https://caniuse.com/css-media-interaction)
// so if it has onTouchStartInWindow assume it has a coarse primary pointer
!me("(pointer: fine)").matches && _e) && // bug in firefox (as of v81) on hybrid windows devices where the interaction media queries
// always indicate a touch only device (only has a coarse pointer that can't hover)
// so assume that the primary pointer is not coarse for firefox windows
!/Windows.*Firefox/.test(It), Or = me("(any-pointer: fine)").matches || me("(any-hover: hover)").matches || // iPads might have an input device that can hover, so assume it has anyHover
Lr || // if no onTouchStartInWindow then the browser is indicating that it is not a touch only device
// see above note for supportsTouchEvents
!_e, xe = Tt && (Or || !wr) ? "hybrid" : Tt ? "touchOnly" : "mouseOnly";

// src/shared/native.ts
var Ge = typeof window != "undefined"; "content" in document.createElement("template"); document.createRange && "createContextualFragment" in document.createRange(); var k = ze ? "pointer" : "mouse", b = window.history, ne = window.location.origin, S = Object.assign, Je = Object.defineProperty;
var Mr = Object.create, K = Array.isArray, ke = Array.from, A = "", w = () => document.body, v = (e, t = Mr(null)) => e ? S(t, e) : t, Ze = () => /* @__PURE__ */ new Set(), z = () => /* @__PURE__ */ new Map();
var T = class extends XMLHttpRequest {
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
T.request = z(), /**
 * Request Transits
 *
 * This object holds the XHR requests in transit. The object
 * properties represent the the request URL and the
 * value is the XML Request instance.
 */
T.transit = z(), /**
 * Request Timeouts
 *
 * Transit timeout used to keep track of promises
 * and trigger operations like hover or proximity
 * prefetching.
 */
T.timeout = z();

// src/app/session.ts
var n = v({
  loaded: !1,
  index: "",
  qs: v(),
  config: v({
    fragments: ["body"],
    timeout: 3e4,
    globalThis: !0,
    schema: "spx-",
    method: "morph",
    manual: !1,
    logLevel: 2,
    cache: !0,
    maxCache: 100,
    preload: null,
    annotate: !1,
    eval: v({
      script: null,
      style: null,
      link: null,
      meta: !1
    }),
    hover: v({
      trigger: "href",
      threshold: 250
    }),
    intersect: v({
      rootMargin: "0px 0px 0px 0px",
      threshold: 0
    }),
    proximity: v({
      distance: 75,
      threshold: 250,
      throttle: 500
    }),
    progress: v({
      bgColor: "#111",
      barHeight: "3px",
      minimum: 0.08,
      easing: "linear",
      speed: 200,
      threshold: 500,
      trickle: !0,
      trickleSpeed: 200
    })
  }),
  events: v(),
  observe: v(),
  memory: v(),
  pages: v(),
  snaps: v(),
  components: v({
    registar: v(),
    instances: v(),
    scopes: z()
  }),
  tracked: Ze(),
  resources: z(),
  styles: Ze()
});

// src/shared/regexp.ts
var Nt = /(?:https?:)?(?:\/\/(?:www\.)?|(?:www\.))/;
var At = /^(?:application|text)\/(?:x-)?(?:ecma|java)script|text\/javascript$/;
var Rt = /\b(?:append|prepend)/, $t = /\s+/g, Ee = /^\b(?:true|false)$/i, He = /^\d*\.?\d+$/, be = /^(?:[.-]?\d*\.?\d+|NaN)$/;
var Lt = /\b(?:intersect|hover|proximity)\b/;
var Qe = /\[?[^,'"[\]()\s]+\]?/g;
var wt = /\[(['"]?.*['"]?,?)\]/, et = /[xy]\s*|\d*\.?\d+/gi;

// src/shared/utils.ts
function Te(e, t) {
  try {
    let r = (t || e).replace(/\\'|'/g, (o) => o[0] === "\\" ? o : '"').replace(/([{,])\s*(.+?)\s*:/g, '$1 "$2":');
    return JSON.parse(r);
  } catch (r) {
    return p(5, `Invalid JSON expression in attribute value: ${t || e}`, r), t;
  }
}
function Mt(e) {
  return e.trim().replace(/\s+/, " ").split(/[|, ]/);
}
function St(e) {
  return e.replace(/[\s .]+/g, ".").replace(/\s+/g, " ").trim().split(/[ ,]/);
}
function qt(e) {
  return be.test(e) ? e === "NaN" ? NaN : +e : Ee.test(e) ? e === "true" : e.charCodeAt(0) === 123 || e.charCodeAt(0) === 91 ? Te(e) : e;
}
function Ct() {
  return new Promise((e) => setTimeout(() => e(), 0));
}
function De(e) {
  setTimeout(() => e(), 1);
}
function kt(e) {
  let t = document.createElement("textarea");
  return t.innerHTML = e, t.value;
}
function pe() {
  return (/* @__PURE__ */ new Date()).getTime();
}
function p(e, t, r) {
  let { logLevel: o } = n.config;
  if (e === 1 && o === 1 || e === 2 && (o === 1 || o === 2))
    console.info("SPX: " + t);
  else if (e === 3 && o < 4)
    console.warn("SPX: " + t);
  else if (e === 5 || e === 4) {
    r ? console.error("SPX: " + t, r) : console.error("SPX: " + t);
    try {
      throw e === 4 ? new TypeError(t) : new Error(t);
    } catch (s) {
    }
  }
}
function V(e) {
  return (t) => t ? typeof t == "string" ? x(e, t) : t.every((r) => r in e) : !1;
}
function x(e, t) {
  return e ? t in e : !1;
}
function U(e, t, r) {
  if (arguments.length > 1)
    Je(e, t, { get: () => r });
  else
    return (o, s, i) => {
      if (x(e, o))
        return;
      let c = () => s;
      Je(e, o, i ? S(i, { get: c }) : { get: c });
    };
}
function tt(e) {
  return x(e, "target") ? e.target.length === 1 && e.target[0] === "body" ? e.target : [].concat(n.config.fragments, e.target).filter((t, r, o) => t !== "body" && t !== A && t.indexOf(",") === -1 ? o.indexOf(t) === r : !1) : n.config.fragments.length === 1 && n.config.fragments[0] === "body" ? ["body"] : [...n.config.fragments];
}
function Ht(...e) {
  return e.join(A);
}
function de() {
  return Math.random().toString(36).slice(4);
}
function Dt(e = 2) {
  return (t, r) => {
    let o = t.length;
    return (o < 1 || t[o - 1].length === e ? t.push([r]) : t[o - 1].push(r)) && t;
  };
}
function rt(e) {
  return e < 1024 ? e + " B" : e < 1048576 ? (e / 1024).toFixed(1) + " KB" : e < 1073741824 ? (e / 1048576).toFixed(1) + " MB" : (e / 1073741824).toFixed(1) + " GB";
}
function ot(e) {
  return e[0].toLowerCase() + e.slice(1);
}
function Wt(e) {
  return e[0].toUpperCase() + e.slice(1);
}
function Xt(e) {
  return /[_-]/.test(e) ? e.replace(/([_-]+).{1}/g, (t, r) => t[r.length].toUpperCase()) : e;
}
function re(e, t) {
  let r = typeof e == "string" ? w().querySelectorAll(e) : e, o = r.length;
  if (o !== 0)
    for (let s = 0; s < o && t(r[s], s) !== !1; s++)
      ;
}
function O(e, t) {
  if (arguments.length === 1)
    return (o) => O(e, o);
  let r = t.length;
  if (r !== 0)
    for (let o = 0; o < r; o++)
      e(t[o], o, t);
}
function nt(e) {
  for (let t in e)
    delete e[t];
}

// src/app/progress.ts
function qr() {
  let e = [], t = document.createElement("div"), r = null, o, s = null, i = ({ bgColor: u, barHeight: E, speed: L, easing: oe }) => {
    t.style.cssText = Ht(
      "pointer-events:none;",
      `background-color:${u};`,
      `height:${E};`,
      "position:fixed;",
      "z-index:9999999;",
      "top:0;",
      "left:0;",
      "width:100%;",
      "will-change:opacity,transform;",
      `transition:transform ${L}ms ${oe};`
    );
  }, c = (u) => (-1 + u) * 100, a = (u, E, L) => u < E ? E : u > L ? L : u, d = () => s || (t.style.setProperty("transform", `translateX(${c(r || 0)}%)`), s = w().appendChild(t), t), y = () => {
    let u = w();
    if (u.contains(s)) {
      let E = s.animate(
        { opacity: ["1", "0"] },
        { easing: "ease-out", duration: 100 }
      );
      E.onfinish = () => {
        u.removeChild(s), s = null;
      };
    } else
      s = null;
  }, h = () => {
    let u = e.shift();
    u && u(h);
  }, f = (u) => {
    e.push(u), e.length === 1 && h();
  }, R = (u) => {
    u = a(u, n.config.progress.minimum, 1), r = u === 1 ? null : u;
    let E = d();
    f((L) => {
      E.style.setProperty("transform", `translateX(${c(u)}%)`), u === 1 ? setTimeout(() => {
        y(), L();
      }, n.config.progress.speed * 2) : setTimeout(L, n.config.progress.speed);
    });
  }, I = (u) => {
    let E = r;
    if (!E)
      return g();
    if (E < 1)
      return typeof u != "number" && (E >= 0 && E < 0.2 ? u = 0.1 : E >= 0.2 && E < 0.5 ? u = 0.04 : E >= 0.5 && E < 0.8 ? u = 0.02 : E >= 0.8 && E < 0.99 ? u = 5e-3 : u = 0), E = a(E + u, 0, 0.994), R(E);
  }, l = () => {
    setTimeout(() => {
      r && (I(), l());
    }, n.config.progress.trickleSpeed);
  };
  function g(u) {
    n.config.progress && (o = setTimeout(() => {
      r || R(0), n.config.progress.trickle && l();
    }, u || 0));
  }
  function m(u) {
    clearTimeout(o), !(!u && !r) && (I(0.3 + 0.5 * Math.random()), R(1));
  }
  return { start: g, done: m, style: i };
}
var se = qr();

// src/components/register.ts
function Ft(...e) {
  let t = V(n.components.registar), r = U(n.components.registar);
  O((o) => {
    x(o, "id") || (o.id = ot(o.prototype.constructor.name)), t(o.id) || r(o.id, o);
  }, e);
}
function Vt(e) {
  let t = V(n.components.registar), r = U(n.components.registar);
  for (let o in e) {
    let s = e[o];
    x(s, "id") || (s.id = ot(o)), t(s.id) || r(s.id, s);
  }
}

// src/app/config.ts
function Cr(e) {
  for (let t of [
    "hover",
    "intersect",
    "proximity",
    "progress"
  ])
    x(e, t) && (e[t] === !1 ? n.config[t] = !1 : typeof e[t] == "object" && S(n.config[t], e[t]), delete e[t]);
  return e;
}
function st(e = {}) {
  x(e, "components") && (Vt(e.components), delete e.components), S(n.config, Cr(e)), x(e, "eval") && S(n.config.eval, e.eval), n.config.index = null;
  let t = n.config.schema, r = n.config.schema = t === "spx" ? "spx" : t.endsWith("-") ? t : t === null ? A : `${t}-`, o = `:not([${r}disable]):not([href^="#"])`, s = `not([${r}eval=false])`;
  n.qs.r = `${r}target`, n.qs.t = `${r}morph`, n.qs.o = `${r}render`, n.qs.n = `${r}component`, n.qs.c = `${r}node`, n.qs.f = new RegExp(`${r}(?:node|component)|@[a-z]|[a-z]:[a-z]`), n.qs.l = new RegExp(`^${r}[a-zA-Z0-9-]+:`), n.qs.s = `${r}data:`, n.qs.u = n.config.annotate ? `a[${r}link]${o}` : `a${o}`, n.qs.m = `[${r}track]:not([${r}track=false])`, n.qs.p = i("script"), n.qs.d = `script[${r}eval=hydrate]:not([${r}eval=false])`, n.qs.v = i("style"), n.qs.x = i("link"), n.qs.E = i("meta"), n.qs.i = `[${r}eval]:not([${r}eval=false]):not(script)`, n.qs.g = new RegExp(`^href|${r}(hydrate|append|prepend|target|progress|threshold|scroll|position|proximity|hover|cache)$`, "i"), n.qs.a = `a[${r}proximity]${o}${c("proximity")}`, n.qs.h = `[${r}intersect]${c("intersect")}`, n.qs.y = `a${o}${c("intersect")}`, n.qs.e = n.config.hover !== !1 && n.config.hover.trigger === "href" ? `a${o}${c("hover")}` : `a[${r}hover]${o}${c("hover")}`, n.memory.bytes = 0, n.memory.visits = 0, n.memory.limit = n.config.maxCache, se.style(n.config.progress);
  function i(a) {
    let d = a === "link" ? `${a}[rel=stylesheet]:${s},${a}[rel~=preload]:${s}` : a === "script" ? `${a}[${r}eval]:${s}:not([${r}eval=hydrate])` : `${a}:${s}`;
    if (n.config.eval[a] === !1 || n.config.eval[a] === null)
      return d;
    if (n.config.eval[a] === !0)
      return `${a}[${r}eval]:${s}`;
    if (K(n.config.eval[a]))
      return n.config.eval[a].length > 0 ? n.config.eval[a].map((y) => `${y}:${s}`).join(",") : (p(3, `Missing eval ${a} option, SPX will use defaults`), d);
    p(4, `Invalid eval ${a} option, expected boolean or array`);
  }
  function c(a) {
    let d = `:not([${r}${a}=false]):not([${r}link])`;
    switch (a.charCodeAt(0)) {
      case 104:
        return `${d}:not([${r}proximity]):not([${r}intersect])`;
      case 105:
        return `${d}:not([${r}hover]):not([${r}proximity])`;
      case 112:
        return `${d}:not([${r}intersect]):not([${r}hover])`;
    }
  }
}

// src/app/location.ts
var D = ne.replace(Nt, A);
function ct(e, t) {
  let r = t || v();
  for (let { nodeName: o, nodeValue: s } of e.attributes)
    if (o.startsWith(n.qs.s)) {
      x(r, "data") || (r.data = v());
      let i = Xt(o.slice(n.qs.s.length)), c = s.trim();
      be.test(c) ? r.data[i] = c === "NaN" ? NaN : +c : Ee.test(c) ? r.data[i] = c === "true" : c.charCodeAt(0) === 123 || c.charCodeAt(0) === 91 ? r.data[i] = Te(o, c) : r.data[i] = c;
    } else {
      if (!n.qs.g.test(o))
        continue;
      if (o === "href")
        r.rev = location.pathname + location.search, t || (r.location = at(s), r.key = r.location.pathname + r.location.search);
      else {
        let i = o.slice(o.lastIndexOf("-") + 1), c = s.replace($t, A).trim();
        if (wt.test(c))
          r[i] = Rt.test(i) ? c.match(Qe).reduce(Dt(2), []) : c.match(Qe);
        else if (i === "position")
          if (et.test(c)) {
            let a = c.match(et);
            r[`scroll${a[0].toUpperCase()}`] = +a[1], a.length === 4 && (r[`scroll${a[2].toUpperCase()}`] = +a[3]);
          } else
            p(3, `Invalid attribute value on ${o}, expects: y:number or x:number`);
        else
          i === "scroll" ? He.test(c) ? r.scrollY = +c : p(3, `Invalid attribute value on ${o}, expects: number`) : i === "target" ? c === "true" ? r[i] = [] : r[i] = c !== A ? c.split(",") : [] : Ee.test(c) ? Lt.test(o) || (r[i] = c === "true") : be.test(c) ? r[i] = +c : r[i] = c;
      }
    }
  return r;
}
function ge(e) {
  let t = v();
  if (e.length === 1 && e.charCodeAt(0) === 47)
    return t.pathname = e, t.hash = A, t.search = A, t;
  let o = e.indexOf("#");
  o >= 0 ? (t.hash = e.slice(o), e = e.slice(0, o)) : t.hash = A;
  let s = e.indexOf("?");
  return s >= 0 ? (t.search = e.slice(s), e = e.slice(0, s)) : t.search = A, t.pathname = e, t;
}
function We(e, t) {
  let r = e.indexOf("/", t);
  if (r > t) {
    let s = e.indexOf("#", r);
    return s < 0 ? e.slice(r) : e.slice(r, s);
  }
  let o = e.indexOf("?", t);
  if (o > t) {
    let s = e.indexOf("#", o);
    return s < 0 ? e.slice(o) : e.slice(o, s);
  }
  return e.length - t === D.length ? "/" : null;
}
function it(e) {
  let t = e.startsWith("www.") ? e.slice(4) : e, r = t.indexOf("/");
  if (r >= 0) {
    let o = t.slice(r);
    if (t.slice(0, r) === D)
      return o.length > 0 ? ge(o) : ge("/");
  } else {
    let o = t.search(/[?#]/);
    if (o >= 0) {
      if (t.slice(0, o) === D)
        return ge("/" + t.slice(o));
    } else if (t === D)
      return ge("/");
  }
  return null;
}
function kr(e) {
  return e.startsWith("http") ? 1 : e.startsWith("//") ? 2 : e.startsWith("www.") ? 3 : 0;
}
function ft(e) {
  if (typeof e != "string" || e.length === 0)
    return !1;
  if (e.charCodeAt(0) === 47)
    return e.charCodeAt(1) !== 47 ? !0 : e.startsWith("www.", 2) ? e.startsWith(D, 6) : e.startsWith(D, 2);
  if (e.charCodeAt(0) === 63)
    return !0;
  if (e.startsWith("www."))
    return e.startsWith(D, 4);
  if (e.startsWith("http")) {
    let t = e.indexOf("/", 4) + 2;
    return e.startsWith("www.", t) ? e.startsWith(D, t + 4) : e.startsWith(D, t);
  }
}
function Hr(e) {
  return e.charCodeAt(0) === 47 ? e.charCodeAt(1) !== 47 ? ge(e) : it(e.slice(2)) : e.charCodeAt(0) === 63 ? ge(location.pathname + e) : e.startsWith("https:") || e.startsWith("http:") ? it(e.slice(e.indexOf("/", 4) + 2)) : e.startsWith("www.") ? it(e) : null;
}
function W(e) {
  if (typeof e == "object")
    return e.pathname + e.search;
  if (e === A)
    return "/";
  let t = kr(e);
  if (t === 1) {
    let r = e.charCodeAt(4) === 115 ? 8 : 7, o = e.startsWith("www.", r) ? r + 4 : r;
    return e.startsWith(D, o) ? We(e, o) : null;
  }
  if (t === 2) {
    let r = e.startsWith("www.", 2) ? 6 : 2;
    return e.startsWith(D, r) ? We(e, r) : null;
  }
  return t === 3 ? e.startsWith(D, 4) ? We(e, 4) : null : e.startsWith(D, 0) ? We(e, 0) : null;
}
function jt() {
  return v({
    hostname: D,
    origin: ne,
    pathname: location.pathname,
    search: location.search,
    hash: location.hash
  });
}
function at(e) {
  if (e === A)
    return jt();
  let t = Hr(e);
  return t === null && p(5, `Invalid pathname: ${e}`), t.origin = ne, t.hostname = D, t;
}
function N(e, t = 6) {
  if (e instanceof Element) {
    let o = ct(e);
    return o.type = t || 6, o;
  }
  let r = v();
  return e === 0 ? (r.location = jt(), r.key = W(r.location), r.rev = r.key, r.type = e, r.visits = 1) : t === 7 ? (r.location = at(e), r.key = W(r.location), r.rev = r.key, r.type = t) : (r.rev = location.pathname + location.search, r.location = at(typeof e == "string" ? e : r.rev), r.key = W(r.location), r.type = t), r;
}

// src/shared/dom.ts
function he(e) {
  return new DOMParser().parseFromString(e, "text/html");
}
function lt(e) {
  let t = e.indexOf("<title");
  if (t === -1)
    return A;
  let r = e.indexOf(">", t) + 1, o = e.indexOf("</title", r);
  return kt(e.slice(r, o).trim());
}

// src/app/events.ts
function q(e, ...t) {
  let r = e === "before:cache";
  r && (t[1] = he(t[1]));
  let o = !0;
  return O((s) => {
    let i = s.apply(null, t);
    r ? i instanceof Document ? o = i.documentElement.outerHTML : typeof o != "string" && (o = i !== !1) : o = i !== !1;
  }, n.events[e] || []), o;
}
function Xe(e, t, r) {
  return x(n.events, e) || (n.events[e] = []), n.events[e].push(r ? t.bind(r) : t) - 1;
}
function Yt(e, t) {
  if (x(n.events, e)) {
    let r = n.events[e];
    if (r && typeof t == "number")
      r.splice(t, 1), p(2, `Removed ${e} event listener (id: ${t})`), r.length === 0 && delete n.events[e];
    else {
      let o = [];
      if (r && t)
        for (let s = 0, i = r.length; s < i; s++)
          r[s] !== t ? o.push(r[s]) : p(2, `Removed ${e} event listener (id: ${s})`);
      o.length ? n.events[e] = o : delete n.events[e];
    }
  } else
    p(3, `There are no ${e} event listeners`);
  return this;
}

// src/app/store.ts
function G(e) {
  e ? typeof e == "string" ? (delete n.snaps[n.pages[e].uuid], delete n.pages[e]) : K(e) && O((t) => {
    delete n.snaps[n.pages[t].uuid], delete n.pages[t];
  }, e) : (nt(n.pages), nt(n.snaps));
}
function $(e) {
  let t = V(e);
  return e.components = [], e.target = tt(e), e.ts = pe(), n.config.cache && (t("cache") || (e.cache = n.config.cache), t("uuid") || (e.uuid = de())), t("scrollY") || (e.scrollY = 0), t("scrollX") || (e.scrollX = 0), n.config.hover !== !1 && e.type === 10 && (t("threshold") || (e.threshold = n.config.hover.threshold)), n.config.proximity !== !1 && e.type === 12 && (t("proximity") || (e.proximity = n.config.proximity.distance), t("threshold") || (e.threshold = n.config.proximity.threshold)), n.config.progress && !t("progress") && (e.progress = n.config.progress.threshold), t("render") || (e.render = n.config.method), t("visits") || (e.visits = 0), n.pages[e.key] = e, n.pages[e.key];
}
function Kt(e, t, r = b.state.key) {
  return e === "location" ? n.pages[r][e] = S(n.pages[r][e], t) : n.pages[r][e] = t, n.pages[r];
}
function ye(e, t) {
  let r = q("before:cache", e, t), o = typeof r == "string" ? r : t;
  return e.type > 5 && e.type > 9 && (e.type = 1), e.title = lt(t), !n.config.cache || r === !1 ? e : x(e, "uuid") ? (n.pages[e.key] = e, n.snaps[e.uuid] = o, q("after:cache", e), e) : j(e, o);
}
function j(e, t) {
  let r = x(n.pages, e.key) ? n.pages[e.key] : $(e);
  return e.target = tt(e), e.visits = e.visits + 1, typeof t == "string" && (n.snaps[r.uuid] = t, e.title = lt(t)), S(r, e);
}
function Fe() {
  let e = b.state.key;
  if (x(n.pages, e))
    return n.pages[e];
  p(5, `No record exists: ${e}`);
}
function Pe(e) {
  if (!e) {
    if (b.state === null)
      return;
    e = b.state.key;
  }
  if (x(n.pages, e)) {
    let t = v();
    return t.page = n.pages[e], t.dom = he(n.snaps[t.page.uuid]), v();
  }
  p(5, `No record exists: ${e}`);
}
function C(e) {
  return x(n.pages, e) && x(n.pages[e], "uuid") && x(n.snaps, n.pages[e].uuid) && typeof n.snaps[n.pages[e].uuid] == "string";
}

// src/shared/links.ts
function Ie(e, t) {
  if (!(e instanceof Element))
    return !1;
  let r = e.closest(t);
  return r && r.tagName === "A" ? r : !1;
}
function Ut(e) {
  if (e.nodeName !== "A")
    return !1;
  let t = e.getAttribute("href");
  return !t || !ft(t) ? !1 : C(W(t)) === !1;
}
function Bt(e, t) {
  let r = [];
  return re(e, (o) => {
    if (o.nodeName !== "A") {
      let s = o.querySelectorAll(t);
      re(s, (i) => {
        Ut(i) && r.push(i);
      });
    } else if (o.hasAttribute("href")) {
      let { href: s } = o;
      ft(s) && C(W(s)) && r.push(o);
    }
  }), r;
}
var Ne = (e) => {
  let t = [];
  return re(e, (r) => {
    Ut(r) && t.push(r);
  }), t;
};

// src/app/fetch.ts
function Ae(e, {
  method: t = "GET",
  body: r = null,
  headers: o = null,
  type: s = "text"
} = {}) {
  return new Promise(function(i, c) {
    let a = new T();
    if (a.key = e, a.responseType = s, a.open(t, e), a.setRequestHeader("spx-request", "true"), o !== null)
      for (let d in o)
        a.setRequestHeader(d, o[d]);
    a.onloadstart = function() {
      T.request.set(this.key, a);
    }, a.onload = function() {
      i(this.response);
    }, a.onerror = function() {
      c(this.statusText);
    }, a.onabort = function() {
      T.timeout.delete(this.key), T.transit.delete(this.key), T.request.delete(this.key);
    }, a.onloadend = function(d) {
      T.request.delete(this.key), n.memory.bytes = n.memory.bytes + d.loaded, n.memory.visits = n.memory.visits + 1;
    }, a.send(r);
  });
}
function Ve(e) {
  return T.timeout.has(e) ? (clearTimeout(T.timeout.get(e)), T.timeout.delete(e)) : !0;
}
function je(e, t, r) {
  T.timeout.has(e) || C(e) || T.timeout.set(e, setTimeout(t, r));
}
function ut(e) {
  for (let [t, r] of T.request)
    e !== t && (r.abort(), p(3, `Pending request aborted: ${t}`));
}
function _t(e) {
  if (n.config.preload !== null) {
    if (K(n.config.preload)) {
      let t = n.config.preload.filter((r) => {
        let o = N(r, 3);
        return o.key !== r ? M($(o)) : !1;
      });
      return Promise.allSettled(t);
    } else if (typeof n.config.preload == "object" && x(n.config.preload, e.key)) {
      let t = n.config.preload[e.key].map((r) => M(
        $(
          N(
            r,
            3
          )
        )
      ));
      return Promise.allSettled(t);
    }
  }
}
function Ye(e) {
  return P(this, null, function* () {
    let t = $(N(e, 4));
    yield Ct(), M(t).then((r) => {
      r ? p(2, `Reverse fetch completed: ${r.key}`) : p(3, `Reverse fetch failed: ${e}`);
    });
  });
}
function Re(e) {
  return P(this, null, function* () {
    if (!T.transit.has(e.key))
      return e;
    let t = yield T.transit.get(e.key);
    return T.transit.delete(e.key), T.timeout.delete(e.key), ye(e, t);
  });
}
function M(e) {
  return P(this, null, function* () {
    return T.request.has(e.key) && e.type !== 7 ? (e.type === 4 && T.request.has(e.rev) ? (T.request.get(e.rev).abort(), p(3, `Request aborted: ${e.rev}`)) : p(3, `Request in transit: ${e.key}`), !1) : q("fetch", e) ? (T.transit.set(e.key, Ae(e.key)), Re(e)) : (p(3, `Request cancelled via dispatched event: ${e.key}`), !1);
  });
}

// src/observers/hover.ts
function zt(e) {
  let t = Ie(e.target, n.qs.e);
  if (!t)
    return;
  let r = N(t, 10);
  if (C(r.key) || T.timeout.has(r.key))
    return;
  t.addEventListener(`${k}leave`, Gt, { once: !0 });
  let o = $(r), s = o.threshold || n.config.hover.threshold;
  je(r.key, function() {
    q("prefetch", t, r) && M(o).then(function() {
      T.timeout.delete(r.key), Jt(t);
    });
  }, s);
}
function Gt(e) {
  let t = Ie(e.target, n.qs.e);
  t && Ve(W(t.href));
}
function Dr(e) {
  e.addEventListener(`${k}enter`, zt);
}
function Jt(e) {
  e.removeEventListener(`${k}enter`, zt), e.removeEventListener(`${k}leave`, Gt);
}
function $e() {
  !n.config.hover || n.observe.hover || (O(Dr, Ne(n.qs.e)), n.observe.hover = !0);
}
function ae() {
  n.observe.hover && (O(Jt, Ne(n.qs.e)), n.observe.hover = !1);
}

// src/observers/proximity.ts
function Wr({ clientX: e, clientY: t }, r) {
  return e <= r.right && e >= r.left && t <= r.bottom && t >= r.top;
}
function Xr(e) {
  let t = e.getBoundingClientRect(), r = e.getAttribute(n.qs.a), o = He.test(r) ? Number(r) : n.config.proximity.distance;
  return {
    target: e,
    top: t.top - o,
    bottom: t.bottom + o,
    left: t.left - o,
    right: t.right + o
  };
}
function Fr(e) {
  let t = !1;
  return (r) => {
    if (t)
      return;
    t = !0;
    let o = e.findIndex((s) => Wr(r, s));
    if (o === -1)
      setTimeout(() => {
        t = !1;
      }, n.config.proximity.throttle);
    else {
      let { target: s } = e[o], i = $(N(s, 12)), c = i.threshold || n.config.proximity.threshold;
      je(i.key, () => P(this, null, function* () {
        if (!q("prefetch", s, i))
          return Z();
        (yield M(i)) && (e.splice(o, 1), t = !1, e.length === 0 && (Z(), p(2, "Proximity observer disconnected")));
      }), c);
    }
  };
}
var pt;
function Le() {
  if (!n.config.proximity || n.observe.proximity)
    return;
  let e = Ne(n.qs.a).map(Xr);
  e.length > 0 && (pt = Fr(e), addEventListener(`${k}move`, pt, { passive: !0 }), n.observe.proximity = !0);
}
function Z() {
  n.observe.proximity && (removeEventListener(`${k}move`, pt), n.observe.proximity = !1);
}

// src/observers/intersect.ts
var ce;
function Vr(e) {
  return P(this, null, function* () {
    if (e.isIntersecting) {
      let t = N(e.target, 11);
      if (!q("prefetch", e.target, t))
        return ce.unobserve(e.target);
      (yield M($(t))) ? ce.unobserve(e.target) : (p(3, `Prefetch will retry at next intersect for: ${t.key}`), ce.observe(e.target));
    }
  });
}
function we() {
  if (!n.config.intersect || n.observe.intersect)
    return;
  ce || (ce = new IntersectionObserver(O(Vr), n.config.intersect));
  let e = O((r) => ce.observe(r)), t = Bt(n.qs.h, n.qs.y);
  e(t), n.observe.intersect = !0;
}
function fe() {
  n.observe.intersect && (ce.disconnect(), n.observe.intersect = !1);
}

// src/observers/scripts.ts
function jr(e) {
  return new Promise((t, r) => {
    let o = document.createElement("script");
    o.addEventListener("error", r, { once: !0 }), o.async = !1, o.text = e.target.text;
    for (let { nodeName: s, nodeValue: i } of e.target.attributes)
      o.setAttribute(s, i);
    document.contains(e.target) ? e.target.replaceWith(o) : (document.head.append(o), e.external ? o.addEventListener("load", () => o.remove(), { once: !0 }) : o.remove()), e.external && o.addEventListener("load", () => t(), { once: !0 }), t();
  });
}
function Yr(e) {
  if (!e.hasAttribute("src") && !e.text)
    return;
  let t = e.type ? e.type.trim().toLowerCase() : "text/javascript", r = At.test(t) ? 1 : t === "module" ? 2 : NaN, o = v();
  return o.blocking = !0, o.evaluate = !1, o.external = !1, isNaN(r) || e.noModule && r === 1 || (e.src && (o.external = !0), (r !== 1 || o.external && (e.hasAttribute("async") || e.defer)) && (o.blocking = !1), o.evaluate = !0, o.target = e), o;
}
function Zt(e) {
  return P(this, null, function* () {
    try {
      let t = jr(e);
      e.blocking && (yield t);
    } catch (t) {
      console.error(t);
    }
  });
}
function Qt(e) {
  return P(this, null, function* () {
    let r = ke(e, Yr).filter((o) => o.evaluate).reduce((o, s) => P(this, null, function* () {
      return s.external ? Promise.all([o, Zt(s)]) : (yield o, yield Zt(s));
    }), Promise.resolve());
    yield Promise.race([r]);
  });
}

// src/components/scopes.ts
function Oe(e, t = null) {
  let r = v(), o = t && t.id || de();
  return t !== null ? (n.components.scopes.has(o) && p(3, `Component identifier already exists for id: ${t.id}`), r.key = o) : r.key = null, r.domNode = t, r.instanceOf = e, r.listeners = z(), r.nodes = z(), r.domState = v(), r;
}
function ve(e) {
  return e[e.length - 1];
}

// src/components/initialize.ts
function rr(e, t) {
  if (t(e) === !1)
    return !1;
  let r, o;
  for (e.childNodes && (o = 0, r = e.childNodes[o]); r; ) {
    if (r.nodeType === 1 && rr(r, t) === !1)
      return !1;
    r = e.childNodes[++o];
  }
}
function er(e, t) {
  for (let r of e) {
    let [o, s] = r.split(".");
    t(o, s.trim());
  }
}
function Kr(e, t) {
  let { attributes: r } = e, o = r.length;
  if (o === 0 || o === 1 && !n.qs.f.test(r[0].name))
    return;
  let s = e.getAttributeNames();
  if (!e.hasAttribute(n.qs.n))
    return c(e, s);
  let i = Mt(e.getAttribute(n.qs.n));
  O((a) => {
    if (!x(n.components.registar, a)) {
      p(3, `Component does not exist in the register: ${a}`);
      return;
    }
    if (!Fe().components.includes(a)) {
      if (x(t, a)) {
        let d = ve(t[a]);
        d.domNode !== null ? t[a].push(Oe(a, e)) : (d.domNode = e, d.key = e.id || de());
      } else
        t[a] = [Oe(a, e)];
      c(e, s, a);
    }
  }, i);
  function c(a, d, y) {
    let h = null;
    if (O((f) => {
      if (y) {
        let l = `${n.config.schema}${y}:`;
        if (f.startsWith(l)) {
          let g = f.slice(l.length);
          ve(t[y]).domState[g] = a.getAttribute(f);
        }
      } else if (n.qs.l.test(f)) {
        let [l, g] = f.slice(n.config.schema.length).split(":"), m = a.getAttribute(f) || A;
        h || (h = v()), x(h, l) || (h[l] = v()), x(h[l], g) ? p(3, `Duplicated event data binding: ${f}="${m}"`) : h[l][g] = qt(m);
        return;
      }
      let R = f.indexOf("@"), I = St(a.getAttribute(f));
      if (R > -1) {
        let l = v(), g = f.slice(R + 1);
        l.isWindow = g.startsWith("window:"), l.eventName = l.isWindow ? g.slice(7) : g, l.attached = !1, l.binding = null, er(I, (m, u) => {
          if (x(t, m) || (t[m] = [Oe(m)]), y && m !== y)
            return;
          l.method = u;
          let { listeners: E } = ve(t[m]);
          E.has(a) ? E.get(a).push(l) : E.set(a, [l]);
        });
      } else
        f === n.qs.c && er(I, (l, g) => {
          if (x(t, l) || (t[l] = [Oe(l)]), y && l !== y)
            return;
          let { nodes: m } = ve(t[l]);
          m.has(g) ? m.get(g).push(a) : m.set(g, [a]);
        });
    }, d), h) {
      for (let f in h) {
        let { listeners: R } = ve(t[f]), I = R.get(a);
        I[I.length - 1].binding = h[f];
      }
      h = null;
    }
  }
}
function tr(e, { method: t, binding: r }) {
  let o = e[t];
  return (s) => (r && U(s, "attrs", r), o.call(e, s));
}
function Ke() {
  let e = v();
  rr(w(), (s) => Kr(s, e));
  let t = V(n.components.instances), r = U(n.components.instances), o = [];
  for (let s in e) {
    let i = n.components.registar[s];
    O((c) => {
      if (n.components.scopes.has(c.key))
        return;
      n.components.scopes.has(c.key) || n.components.scopes.set(c.key, c);
      let a = new i(c.key), d = V(a);
      for (let [y, h] of c.listeners)
        O((f) => {
          if (!d(f.method))
            return p(3, `Event callback is undefined: ${s}.${f.method}()`);
          if (f.attached)
            return p(3, `Event listener already exists: ${s}.${f.method}()`);
          f.isWindow ? addEventListener(f.eventName, tr(a, f)) : y.addEventListener(f.eventName, tr(a, f)), f.attached = !0;
        }, h);
      t(c.key) || (r(c.key, a), d("onInit") && a.onInit(), d("onLoad") && Xe("load", a.onLoad, a)), o.push(c.key);
    }, e[s]);
  }
  Kt("components", o), n.observe.components = !0;
}
function or() {
  if (!n.observe.components)
    return !1;
  for (let [e, t] of n.components.scopes) {
    let r = n.components.instances[e];
    for (let [o, s] of t.listeners)
      O((i) => {
        i.attached && (i.isWindow ? removeEventListener(i.eventName, r[i.method]) : o.removeEventListener(i.eventName, r[i.method]), i.attached = !1);
      }, s), x(r, "onExit") && r.onExit();
  }
}

// src/morph/utils.ts
function sr(e, t) {
  return !t || t === "http://www.w3.org/1999/xhtml" ? document.createElement(e) : document.createElementNS(t, e);
}
function Q(e) {
  return e ? e.getAttribute && e.getAttribute("id") || e.id : void 0;
}
function Me(e, t) {
  let r = e.nodeName, o = t.nodeName;
  if (r === o)
    return !0;
  let s = r.charCodeAt(0), i = o.charCodeAt(0);
  return s <= 90 && i >= 97 || s <= 90 && i >= 97 ? r === o.toUpperCase() : !1;
}
function ir(e, t) {
  let r = e.firstChild;
  for (; r; ) {
    let o = r.nextSibling;
    t.appendChild(r), r = o;
  }
  return t;
}

// src/morph/attributes.ts
function Ue(e, t, r) {
  e[r] !== t[r] && (e[r] = t[r], e[r] ? e.setAttribute(r, A) : e.removeAttribute(r));
}
function ar(e, t) {
  if (t.nodeType === 11 || e.nodeType === 11)
    return;
  let r = t.attributes, o, s, i, c, a;
  for (let y = r.length - 1; y >= 0; y--)
    o = r[y], s = o.name, c = o.value, i = o.namespaceURI, i ? (s = o.localName || s, a = e.getAttributeNS(i, s), a !== c && (o.prefix === "xmlns" && (s = o.name), e.setAttributeNS(i, s, c))) : (a = e.getAttribute(s), a !== c && e.setAttribute(s, c));
  let d = e.attributes;
  for (let y = d.length - 1; y >= 0; y--)
    o = d[y], s = o.name, c = o.value, i = o.namespaceURI, i ? (s = o.localName || s, t.hasAttributeNS(i, s) || e.removeAttributeNS(i, s)) : t.hasAttribute(s) || e.removeAttribute(s);
}

// src/morph/forms.ts
function cr(e, t) {
  let r = e.parentNode;
  if (r) {
    let o = r.nodeName.toUpperCase();
    o === "OPTGROUP" && (r = r.parentNode, o = r && r.nodeName.toUpperCase()), o === "SELECT" && !r.hasAttribute("multiple") && (e.hasAttribute("selected") && !t.selected && (e.setAttribute("selected", "selected"), e.removeAttribute("selected")), r.selectedIndex = -1);
  }
  Ue(e, t, "selected");
}
function fr(e, t) {
  Ue(e, t, "checked"), Ue(e, t, "disabled"), e.value !== t.value && (e.value = t.value), t.hasAttribute("value") || e.removeAttribute("value");
}
function ht(e, t) {
  let { value: r } = t;
  e.value !== r && (e.value = r);
  let { firstChild: o } = e;
  if (o) {
    let { nodeValue: s } = o;
    if (s === r || !r && s === e.placeholder)
      return;
    o.nodeValue = r;
  }
}
function lr(e, t) {
  if (!t.hasAttribute("multiple")) {
    let r = 0, o = -1, s = e.firstElementChild, i, c;
    for (; s; )
      if (c = s.nodeName && s.nodeName.toUpperCase(), c === "OPTGROUP")
        i = s, s = i.firstElementChild;
      else {
        if (c === "OPTION") {
          if (s.hasAttribute("selected")) {
            o = r;
            break;
          }
          r++;
        }
        s = s.nextElementSibling, !s && i && (s = i.nextElementSibling, i = null);
      }
    e.selectedIndex = o;
  }
}

// src/morph/morph.ts
function le(e, t, r) {
  t.nodeType === 11 && (t = t.firstElementChild);
  let o = /* @__PURE__ */ new Map(), s = [];
  function i(l, g, m) {
    for (; g; ) {
      let u = g.nextSibling;
      (m = Q(g)) ? s.push(m) : d(
        g,
        l,
        !0
        /* skip keyed nodes */
      ), g = u;
    }
  }
  function c(l, g) {
    let m = Q(g);
    m && o.delete(m), !l.isEqualNode(g) && l.getAttribute(n.qs.t) !== "false" && (l.getAttribute(n.qs.t) !== "children" && ar(l, g), l.nodeName !== "TEXTAREA" ? a(l, g) : ht(l, g));
  }
  function a(l, g) {
    let m = g.firstChild, u = l.firstChild, E, L, oe, ue, Ce, te;
    e:
      for (; m; ) {
        for (Ce = m.nextSibling, E = Q(m); u; ) {
          if (ue = u.nextSibling, m.isSameNode && m.isSameNode(u)) {
            m = Ce, u = ue;
            continue e;
          }
          L = Q(u), oe = u.nodeType;
          let B;
          if (oe === m.nodeType && (oe === 1 ? (E ? E !== L && ((te = o.get(E)) ? ue === te ? B = !1 : (l.insertBefore(te, u), L ? s.push(L) : d(u, l, !0), u = te, L = Q(u)) : B = !1) : L && (B = !1), B !== !1 && (B = Me(u, m)), B === !1 && o.has(L) && o.get(L).getAttribute(n.qs.t) === "children" && (B = !0), B && c(u, m)) : (oe === 3 || oe === 8) && (B = !0, u.nodeValue !== m.nodeValue && (u.nodeValue = m.nodeValue))), B) {
            m = Ce, u = ue;
            continue e;
          }
          L ? s.push(L) : d(
            u,
            l,
            !0
            /* skip keyed nodes */
          ), u = ue;
        }
        E && (te = o.get(E)) && Me(te, m) ? (l.appendChild(te), c(te, m)) : (m.actualize && (m = m.actualize(l.ownerDocument || document)), l.appendChild(m), h(m)), m = Ce, u = ue;
      }
    switch (i(l, u, L), l.nodeName) {
      case "INPUT":
        fr(
          l,
          g
        );
        break;
      case "OPTION":
        cr(
          l,
          g
        );
        break;
      case "SELECT":
        lr(
          l,
          g
        );
        break;
      case "TEXTAREA":
        ht(
          l,
          g
        );
        break;
    }
  }
  function d(l, g, m) {
    g && g.removeChild(l), y(l, m);
  }
  function y(l, g) {
    if (l.nodeType !== 1)
      return;
    let m = l.firstChild;
    for (; m; ) {
      let u;
      g && (u = Q(m)) ? s.push(u) : m.firstChild && y(m, g), m = m.nextSibling;
    }
  }
  function h(l) {
    let g = l.firstChild;
    for (; g; ) {
      let m = g.nextSibling, u = Q(g);
      if (u) {
        let E = o.get(u);
        E && Me(g, E) ? (g.parentNode.replaceChild(E, g), c(E, g)) : h(g);
      } else
        h(g);
      g = m;
    }
  }
  (function l(g) {
    if (g.nodeType === 1 || g.nodeType === 11) {
      let m = g.firstChild;
      for (; m; ) {
        let u = Q(m);
        u && o.set(u, m), l(m), m = m.nextSibling;
      }
    }
  })(e);
  let f = e, R = f.nodeType, I = t.nodeType;
  if (R === 1)
    I === 1 ? Me(e, t) || (f = ir(e, sr(t.nodeName, t.namespaceURI))) : f = t;
  else if (R === 3 || R === 8) {
    if (I === R)
      return f.nodeValue !== t.nodeValue && (f.nodeValue = t.nodeValue), f;
    f = t;
  }
  if (f !== t) {
    if (t.isSameNode && t.isSameNode(f))
      return;
    if (c(f, t), s)
      for (let l = 0, g = s.length; l < g; l++) {
        let m = o.get(s[l]);
        m && d(m, m.parentNode, !1);
      }
  }
  return f !== e && e.parentNode && (f.actualize && (f = f.actualize(e.ownerDocument || document)), e.parentNode.replaceChild(f, e)), f;
}

// src/app/render.ts
function Br(e, t) {
  return e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING || -1;
}
function ur(e, t) {
  return P(this, null, function* () {
    let r = t === 7 ? n.qs.d : n.qs.p, o = ke(e.querySelectorAll(r));
    yield Qt(o.sort(Br));
  });
}
function _r(e) {
  document.head.querySelectorAll(n.qs.i).forEach((t) => {
    e.head.contains(t) || t.remove();
  }), document.head.append(...e.querySelectorAll(n.qs.i));
}
function zr(e) {
  if (!e)
    return;
  let t = e.querySelectorAll(n.qs.m);
  if (t.length > 0)
    for (let r of t)
      r.hasAttribute("id") ? n.tracked.has(r.id) || (w().appendChild(r), n.tracked.add(r.id)) : p(3, `Tracked node <${r.tagName.toLowerCase()}> must contain an id attribute`);
}
function Gr(e, t) {
  let r = e.target, o = e.render;
  if (r.length === 1 && r[0] === "body")
    o === "morph" ? le(w(), t.body) : o === "replace" ? w().replaceWith(t.body) : w().innerHTML = t.body.innerHTML;
  else {
    let s = `${r.join(",")},[${n.qs.r}]`, i = t.body.querySelectorAll(s);
    if (i.length === 0)
      p(3, `Unmatched targets, applied <body> replacement on: ${e.key}`), w().replaceWith(t.body);
    else {
      let c = w().querySelectorAll(s), a = [];
      if (c.length !== i.length)
        return p(3, `Target mismatch, fallback visit applies: ${e.key}`), location.assign(e.key);
      for (let d = 0, y = c.length; d < y; d++) {
        let h = c[d], f = i[d];
        if (!f || h.isEqualNode(f) || !q("render", h, f))
          continue;
        let R = f.getAttribute(n.qs.r);
        if (R === "" || R === "true") {
          if (a.some((l) => l.contains(h)))
            continue;
        } else
          a.push(h);
        let I = o;
        if (h.hasAttribute(n.qs.o)) {
          let l = h.getAttribute(n.qs.o);
          l !== I && (I = l);
        }
        if (I === "morph" ? le(h, f) : e.render === "replace" ? h.replaceWith(f) : h.innerHTML = f.innerHTML, e.append || e.prepend) {
          let l = document.createElement("div");
          for (let g of t.childNodes)
            l.appendChild(g);
          e.append ? h.appendChild(l) : h.insertBefore(l, h.firstChild);
        }
      }
    }
    zr(t.body);
  }
}
function Jr(e, t) {
  let r = e.hydrate;
  if (r.length === 1 && r[0] === "body") {
    le(w(), t.body);
    return;
  }
  let o = r.join(","), s = w().querySelectorAll(o), i = e.preserve && e.preserve.length > 0 ? e.preserve.join(",") : null, c = [];
  if (i) {
    let a = w().querySelectorAll(i);
    for (let d = 0, y = a.length; d < y; d++) {
      let h = a[d];
      h.setAttribute("spx-morph", "false"), c.push(h);
    }
  }
  if (s.length > 0) {
    let a = t.body.querySelectorAll(o);
    for (let d = 0, y = s.length; d < y; d++) {
      let h = s[d], f = a[d];
      if (a[d] instanceof HTMLElement) {
        if (!q("hydrate", h, f))
          continue;
        le(f, f);
      }
    }
  }
  if (i)
    for (let a of c)
      a.removeAttribute("spx-morph");
  ur(t, 7), e.hydrate = void 0, e.preserve = void 0, e.type = 6, j(e);
}
function Y(e) {
  ae(), fe(), Z(), or(), document.title = e.title;
  let t = he(n.snaps[e.uuid]);
  return e.type === 7 ? Jr(e, t) : (_r(t), Gr(e, t), ur(t, e.type), scrollTo(e.scrollX, e.scrollY)), se.done(), De(() => {
    $e(), we(), Le(), Ke();
  }), q("load", e), e;
}

// src/observers/history.ts
var qe = {};
Nr(qe, {
  api: () => b,
  connect: () => vt,
  disconnect: () => xt,
  exists: () => mr,
  initialize: () => pr,
  push: () => Se,
  replace: () => ee,
  reverse: () => Zr
});
function Zr() {
  return b.state !== null && x(b.state, "rev") && b.state.key !== b.state.rev;
}
function mr(e) {
  if (b.state == null || typeof b.state != "object")
    return !1;
  let t = V(b.state)([
    "key",
    "rev",
    "scrollX",
    "scrollY",
    "title"
  ]);
  return typeof e == "string" ? t && b.state.key === e : t;
}
function pr(e) {
  return mr(e.key) ? (scrollTo(b.state.scrollX, b.state.scrollY), S(e, b.state)) : (ee(e), e);
}
function ee(e) {
  let t = v();
  return t.key = e.key, t.rev = e.rev, t.title = e.title || document.title, t.scrollX = e.scrollX, t.scrollY = e.scrollY, b.replaceState(t, t.title, t.key), p(1, `History replaceState: ${b.state.key}`), b.state;
}
function Se({ key: e, rev: t, title: r }) {
  let o = v({
    key: e,
    rev: t,
    title: r,
    scrollY: 0,
    scrollX: 0
  });
  return b.pushState(o, o.title, o.key), p(1, `History pushState: ${b.state.key}`), b.state;
}
function dr(e) {
  return P(this, null, function* () {
    if (e.state !== null)
      if (C(e.state.key))
        C(e.state.rev) === !1 && e.state.rev !== e.state.key && Ye(e.state.rev), p(1, `History popState: ${e.state.key}`), n.pages[e.state.key].type = 5, yield Y(n.pages[e.state.key]);
      else {
        e.state.type = 5;
        let t = yield M(e.state);
        if (!t)
          return location.assign(e.state.key);
        let r = W(location);
        if (t.key === r)
          yield Y(t);
        else if (C(r))
          yield Y(n.pages[r]);
        else {
          let o = $(N(r, 5));
          yield M(o), b.pushState(o, document.title, r);
        }
      }
  });
}
function vt(e) {
  if (!n.observe.history)
    return b.scrollRestoration && (b.scrollRestoration = "manual"), addEventListener("popstate", dr, !1), n.observe.history = !0, typeof e == "object" && e.type === 0 ? pr(e) : e;
}
function xt() {
  n.observe.history && (b.scrollRestoration && (b.scrollRestoration = "auto"), removeEventListener("popstate", dr, !1), n.observe.history = !1);
}

// src/observers/hrefs.ts
function Qr(e) {
  return !// @ts-ignore
  (e.target && e.target.isContentEditable || e.defaultPrevented || e.which > 1 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey);
}
var F = function(e) {
  if (!Qr(e))
    return;
  let t = Ie(e.target, n.qs.u);
  if (!t)
    return;
  let r = W(t.href);
  if (r === null)
    return;
  let o = () => {
    F.drag = !0, p(3, `Drag occurance, visit was cancelled to link: ${r}`), t.removeEventListener(`${k}move`, o);
  };
  if (t.addEventListener(`${k}move`, o, { once: !0 }), F.drag === !0)
    return F.drag = !1, F(e);
  if (t.removeEventListener(`${k}move`, o), !!q("visit", e))
    if (ae(), Z(), fe(), C(r)) {
      let s = ct(t, n.pages[r]), i = j(s);
      t.onclick = (c) => {
        c.preventDefault(), n.pages[i.key].ts = pe(), n.pages[i.rev].scrollX = window.scrollX, n.pages[i.rev].scrollY = window.scrollY, ee(n.pages[i.rev]), Se(i), Y(i);
      };
    } else if (T.transit.has(r)) {
      ut(r), p(2, `Request in transit: ${r}`);
      let s = n.pages[r];
      t.onclick = (i) => {
        i.preventDefault(), n.pages[s.key].ts = pe(), n.pages[s.rev].scrollX = window.scrollX, n.pages[s.rev].scrollY = window.scrollY, ee(n.pages[s.rev]), Et(s);
      };
    } else {
      ut(), Ve(r);
      let s = $(N(t, 6));
      M(s), t.onclick = (i) => {
        i.preventDefault(), n.pages[s.key].ts = pe(), n.pages[s.rev].scrollX = window.scrollX, n.pages[s.rev].scrollY = window.scrollY, ee(n.pages[s.rev]), Et(s);
      };
    }
};
function Et(e) {
  return P(this, null, function* () {
    e.progress && se.start(e.progress);
    let t = yield Re(e);
    t ? (Se(t), Y(t)) : location.assign(e.key);
  });
}
function bt(e, t) {
  return P(this, null, function* () {
    if (t) {
      typeof t.cache == "string" && (t.cache === "clear" ? G() : G(t.key)), t.progress && se.start(t.progress);
      let r = yield M(t);
      r ? (Se(r), Y(r)) : location.assign(t.key);
    } else
      return Et(n.pages[e]);
  });
}
function gr() {
  n.observe.hrefs || (F.drag = !1, xe === "mouseOnly" ? addEventListener(`${k}down`, F, !1) : (xe === "touchOnly" || addEventListener(`${k}down`, F, !1), addEventListener("touchstart", F, !1)), n.observe.hrefs = !0);
}
function hr() {
  n.observe.hrefs && (xe === "mouseOnly" ? removeEventListener(`${k}down`, F, !1) : (xe === "touchOnly" || removeEventListener(`${k}down`, F, !1), removeEventListener("touchstart", F, !1)), n.observe.hrefs = !1);
}

// src/observers/fragments.ts
function eo(e, t) {
  for (let r of e)
    r.type === "childList" ? console.log(r.target.parentElement) : r.type === "attributes" && console.log(`The ${r.attributeName} attribute was modified.`);
}
function vr() {
  if (!n.observe.fragments)
    return;
  let e = new MutationObserver(eo);
  re(n.config.fragments.join(), (t) => {
    e.observe(t, {
      childList: !0,
      subtree: !0,
      attributes: !1
    });
  }), n.observe.fragments = !0;
}

// src/app/controller.ts
function xr() {
  let e = N(0), t = vt($(e));
  n.index = t.key;
  let r = () => {
    let o = ye(t, document.documentElement.outerHTML);
    return gr(), n.config.manual === !1 && ($e(), we(), Le(), Ke(), vr()), De(() => {
      o.rev !== o.key && Ye(o.rev), _t(o);
    }), o;
  };
  return new Promise((o) => {
    if (document.readyState === "complete" || document.readyState === "interactive")
      return o(r());
    addEventListener("DOMContentLoaded", () => o(r()), { once: !0 });
  });
}
function Er() {
  ae(), $e(), fe(), we(), Z(), Le();
}
function br() {
  xt(), hr(), ae(), fe(), Z(), G(), n.config.globalThis && delete window.spx, p(2, "Disconnected");
}

// src/components/extends.ts
var Be = class {
  /**
   * Component Scope
   *
   * The scope of this specific instance according to the UUID
   */
  get scope() {
    return n.components.scopes.get(this.key);
  }
  get dom() {
    return this.scope.domNode;
  }
  get html() {
    return this.dom.closest("html");
  }
  component(t) {
    return x(n.components.instances, t) ? n.components.instances[t] : (p(3, `Unknown or undefined component identifier: id="${t}"`), null);
  }
  constructor(t) {
    this.key = t;
    let { domNode: r, domState: o, instanceOf: s, nodes: i } = this.scope, c = n.config.schema + s;
    this.state = new Proxy(o, {
      set(y, h, f) {
        return y[h] = f, r.setAttribute(`${c}:${h}`, typeof f == "object" || K(f) ? JSON.stringify(f, null, 0) : f), !0;
      }
    });
    let { attrs: a } = n.components.registar[s];
    if (a !== null) {
      let y = U(this.state);
      for (let f in a) {
        let R = r.hasAttribute(`${c}:${f}`);
        y(`has${Wt(f)}`, R);
        let I, l;
        typeof a[f] == "object" ? (I = R ? o[f] : a[f].default, l = a[f].typeof) : (I = R ? o[f] : void 0, l = a[f]), typeof I == "string" && I.startsWith("window.") ? this.state[f] = o[f] = window[I.slice(7)] : l === String ? this.state[f] = o[f] = I : l === Boolean ? this.state[f] = o[f] = I === "true" : l === Number ? this.state[f] = o[f] = Number(I) : (l === Array || l === Object) && (this.state[f] = o[f] = Te(f, I));
      }
    }
    let d = U(this);
    for (let [y, h] of i)
      d(`${y}Node`, h[0]), d(`${y}Nodes`, h);
  }
};

// src/index.ts
var Tr = !!(Ge && window.history.pushState && window.requestAnimationFrame && window.addEventListener && window.DOMParser && window.Proxy), Pr = v({
  Component: Be,
  supported: Tr,
  on: Xe,
  off: Yt,
  observe: Er,
  history: qe,
  connect: ro,
  capture: co,
  form: lo,
  render: ao,
  session: oo,
  state: no,
  reload: so,
  fetch: io,
  clear: G,
  hydrate: uo,
  prefetch: fo,
  visit: mo,
  disconnect: br,
  register: Ft,
  get config() {
    return n.config;
  }
});
function ro(e = {}, ...t) {
  if (Ge === !1)
    return p(5, "Invalid runtime environment: window is undefined.");
  if (!Tr)
    return p(5, "Browser does not support SPX");
  if (!window.location.protocol.startsWith("http"))
    return p(5, "Invalid protocol, SPX expects HTTPS or HTTP protocol");
  st(e), n.config.globalThis && x(window, "spx") === !1 && U(window, "spx", Pr);
  let r = xr();
  return function(o) {
    return P(this, null, function* () {
      let s = yield r;
      if (o.constructor.name === "AsyncFunction")
        try {
          yield o(s);
        } catch (i) {
          p(3, "Connection Error", i);
        }
      else
        o(s);
      p(2, "Connection Established \u26A1");
    });
  };
}
function oo(e, t) {
  if (e)
    if (t)
      e === "config" && st(t), e === "observe" && S(n.observe, t);
    else {
      if (e === "config")
        return n.config;
      if (e === "observe")
        return n.observe;
      if (e === "components")
        return n.components;
      if (e === "pages")
        return n.pages;
      if (e === "snapshots")
        return n.snaps;
      if (e === "memory")
        return rt(n.memory.bytes);
    }
  return {
    config: n.config,
    snapshots: n.snaps,
    pages: n.pages,
    observers: n.observe,
    components: n.components,
    get memory() {
      let r = n.memory;
      return r.size = rt(r.bytes), r;
    }
  };
}
function no(e, t) {
  if (e === void 0)
    return Pe();
  if (typeof e == "string") {
    let r = W(e);
    C(r) || p(5, `No store exists at: ${r}`);
    let o = Pe(r);
    return t !== void 0 ? j(S(o.page, t)) : o;
  }
  if (typeof e == "object")
    return j(e);
}
function so() {
  return P(this, null, function* () {
    let e = n.pages[b.state.key];
    e.type = 9;
    let t = yield M(e);
    return t ? (p(2, "Triggered reload, page was re-cached"), Y(t)) : (p(3, "Reload failed, triggering refresh (cache will purge)"), location.assign(e.key));
  });
}
function io(e) {
  return P(this, null, function* () {
    let t = N(e, 2);
    t.location.origin !== ne && p(5, "Cross origin fetches are not allowed");
    let r = yield Ae(t.key);
    if (r)
      return r;
  });
}
function ao(e, t, r) {
  return P(this, null, function* () {
    let o = Fe(), s = N(e);
    s.location.origin !== ne && p(5, "Cross origin fetches are not allowed");
    let i = yield Ae(s.key, { type: "document" });
    if (i || p(5, `Fetch failed for: ${s.key}`, i), yield r.call(o, i), t === "replace") {
      o.title = i.title;
      let c = j(S(o, s), i.documentElement.outerHTML);
      return ee(c), c;
    } else
      return Y(ye(s, i.documentElement.outerHTML));
  });
}
function co(e) {
  let t = Pe();
  if (!t)
    return;
  let { page: r, dom: o } = t;
  if (e = K(e) ? e : r.target, e.length === 1 && e[0] === "body") {
    o.body.replaceChildren(document.body), j(r, o.documentElement.innerHTML);
    return;
  }
  let s = e.join(","), i = w().querySelectorAll(s), c = o.body.querySelectorAll(s);
  re(c, (a, d) => {
    le(a, i[d]);
  }), j(r, o.documentElement.innerHTML);
}
function fo(e) {
  return P(this, null, function* () {
    let t = N(e, 1);
    if (C(t.key)) {
      p(3, `Cache already exists for ${t.key}, prefetch skipped`);
      return;
    }
    let r = yield M($(t));
    if (r)
      return r;
    p(5, `Prefetch failed for ${t.key}`);
  });
}
function lo(e, t) {
  return P(this, null, function* () {
    let r = new FormData();
    for (let s in t.data)
      r.append(s, t.data[s]);
    return yield Ae(e, {
      method: t.method,
      body: r
    });
  });
}
function uo(e, t) {
  return P(this, null, function* () {
    let r = N(e, 7);
    if (M(r), K(t)) {
      r.hydrate = [], r.preserve = [];
      for (let s of t)
        s.charCodeAt(0) === 33 ? r.preserve.push(s.slice(1)) : r.hydrate.push(s);
    } else
      r.hydrate = n.config.fragments;
    let o = yield Re(r);
    if (o) {
      let { key: s } = b.state;
      if (ee(o), Y(o), r.key !== s) {
        n.index === s && (n.index = r.key);
        for (let i in n.pages)
          n.pages[i].rev === s && (n.pages[i].rev = r.key);
        G(s);
      }
    }
    return Pe(o.key).dom;
  });
}
function mo(e, t) {
  return P(this, null, function* () {
    let r = N(e), o = typeof t == "object" ? S(r, t) : r;
    return C(r.key) ? bt(r.key, j(o)) : bt(r.key, $(o));
  });
}
var pi = Pr;

export { pi as default };
