var Cr = Object.defineProperty;
var Or = (e, t) => {
  for (var r in t)
    Cr(e, r, { get: t[r], enumerable: !0 });
};
var E = (e, t, r) => new Promise((o, s) => {
  var i = (f) => {
    try {
      c(r.next(f));
    } catch (p) {
      s(p);
    }
  }, a = (f) => {
    try {
      c(r.throw(f));
    } catch (p) {
      s(p);
    }
  }, c = (f) => f.done ? o(f.value) : Promise.resolve(f.value).then(i, a);
  c((r = r.apply(e, t)).next());
});

// ../../node_modules/.pnpm/detect-it@4.0.1/node_modules/detect-it/dist/detect-it.esm.js
var q = typeof window != "undefined" ? window : { screen: {}, navigator: {} }, fe = (q.matchMedia || function() {
  return { matches: !1 };
}).bind(q), qr = {
  get passive() {
    return !0;
  }
}, Lt = function() {
};
q.addEventListener && q.addEventListener("p", Lt, qr);
q.removeEventListener && q.removeEventListener("p", Lt, !1);
var Qe = "ontouchstart" in q, Hr = "TouchEvent" in q, et = Qe || Hr && fe("(any-pointer: coarse)").matches, $t = (q.navigator.maxTouchPoints || 0) > 0 || et, wt = q.navigator.userAgent || "", kr = fe("(pointer: coarse)").matches && // both iPad and iPhone can "request desktop site", which sets the userAgent to Macintosh
// so need to check both userAgents to determine if it is an iOS device
// and screen size to separate iPad from iPhone
/iPad|Macintosh/.test(wt) && Math.min(q.screen.width || 0, q.screen.height || 0) >= 768, Dr = (fe("(pointer: coarse)").matches || // if the pointer is not coarse and not fine then the browser doesn't support
// interaction media queries (see https://caniuse.com/css-media-interaction)
// so if it has onTouchStartInWindow assume it has a coarse primary pointer
!fe("(pointer: fine)").matches && Qe) && // bug in firefox (as of v81) on hybrid windows devices where the interaction media queries
// always indicate a touch only device (only has a coarse pointer that can't hover)
// so assume that the primary pointer is not coarse for firefox windows
!/Windows.*Firefox/.test(wt), Wr = fe("(any-pointer: fine)").matches || fe("(any-hover: hover)").matches || // iPads might have an input device that can hover, so assume it has anyHover
kr || // if no onTouchStartInWindow then the browser is indicating that it is not a touch only device
// see above note for supportsTouchEvents
!Qe, be = $t && (Wr || !Dr) ? "hybrid" : $t ? "touchOnly" : "mouseOnly";

// src/shared/native.ts
var tt = typeof window != "undefined"; "content" in document.createElement("template"); document.createRange && "createContextualFragment" in document.createRange(); var M = et ? "pointer" : "mouse", re = window.location.origin, R = Object.assign, rt = Object.defineProperty, le = Object.defineProperties, Vr = Object.create, H = Array.isArray, qe = Array.from, P = "", $ = () => document.body, m = (e, t = Vr(null)) => e ? R(t, e) : t, pe = () => /* @__PURE__ */ new Set(), Y = () => /* @__PURE__ */ new Map();
var x = class extends XMLHttpRequest {
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
x.request = Y(), /**
 * Request Transits
 *
 * This object holds the XHR requests in transit. The object
 * properties represent the the request URL and the
 * value is the XML Request instance.
 */
x.transit = Y(), /**
 * Request Timeouts
 *
 * Transit timeout used to keep track of promises
 * and trigger operations like hover or proximity
 * prefetching.
 */
x.timeout = Y();

// src/app/session.ts
var n = m({
  loaded: !1,
  index: "",
  qs: m({
    component: m(),
    script: m(),
    tags: m(),
    href: m()
  }),
  config: m({
    fragments: ["body"],
    timeout: 3e4,
    globalThis: !0,
    schema: "spx-",
    manual: !1,
    logLevel: 2,
    cache: !0,
    maxCache: 100,
    preload: null,
    annotate: !1,
    eval: m({
      script: null,
      style: null,
      link: null,
      meta: !1
    }),
    hover: m({
      trigger: "href",
      threshold: 250
    }),
    intersect: m({
      rootMargin: "0px 0px 0px 0px",
      threshold: 0
    }),
    proximity: m({
      distance: 75,
      threshold: 250,
      throttle: 500
    }),
    progress: m({
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
  events: m(),
  observe: m(),
  memory: m(),
  pages: m(),
  snaps: m(),
  components: m({
    registry: m(),
    connected: pe(),
    instances: m(),
    refs: m()
  }),
  tracked: pe(),
  resources: Y(),
  styles: pe()
});

// src/shared/regexp.ts
var Mt = /(?:https?:)?(?:\/\/(?:www\.)?|(?:www\.))/;
var Ct = /^(?:application|text)\/(?:x-)?(?:ecma|java)script|text\/javascript$/;
var Ot = /\b(?:append|prepend)/, St = /\s+/g, Te = /^\b(?:true|false)$/i, He = /^\d*\.?\d+$/, Ie = /^(?:[.-]?\d*\.?\d+|NaN)$/;
var qt = /\b(?:intersect|hover|proximity)\b/;
var ot = /\[?[^,'"[\]()\s]+\]?/g;
var Ht = /\[(['"]?.*['"]?,?)\]/, nt = /[xy]\s*|\d*\.?\d+/gi;

// src/shared/utils.ts
function Dt(e, t) {
  return `${e.toLowerCase()}[data-spx="${t}"]`;
}
function me(e, t) {
  try {
    let r = (t || e).replace(/\\'|'/g, (o) => o[0] === "\\" ? o : '"').replace(/([{,])\s*(.+?)\s*:/g, '$1 "$2":');
    return JSON.parse(r);
  } catch (r) {
    return l(
      5,
      `Invalid JSON expression in attribute value:

` + JSON.stringify(e || t, null, 2) + `

`,
      r
    ), t;
  }
}
function ue(e) {
  return e[e.length - 1];
}
function Wt(e) {
  return e.trim().replace(/\s+/, " ").split(/[|, ]/).map(ct);
}
function st(e) {
  return e.replace(/[\s .]+/g, ".").replace(/\s+/g, " ").trim().split(/[ ,]/);
}
function Vt(e) {
  return Ie.test(e) ? e === "NaN" ? NaN : +e : Te.test(e) ? e === "true" : e.charCodeAt(0) === 123 || e.charCodeAt(0) === 91 ? me(e) : e;
}
function Xt() {
  return new Promise((e) => setTimeout(() => e(), 0));
}
function ke(e) {
  setTimeout(() => e(), 1);
}
function jt(e) {
  let t = document.createElement("textarea");
  return t.innerHTML = e, t.value;
}
function de() {
  return (/* @__PURE__ */ new Date()).getTime();
}
function l(e, t, r) {
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
function De(e) {
  return (t) => t ? typeof t == "string" ? t in e : t.every((r) => r in e) : !1;
}
function d(e, t) {
  return e ? t in e : !1;
}
function ee(e, t, r) {
  if (arguments.length > 1)
    rt(e, t, { get: () => r });
  else
    return (o, s, i) => {
      if (d(e, o))
        return;
      let a = () => s;
      return rt(e, o, i ? R(i, { get: a }) : { get: a });
    };
}
function it(e) {
  return d(e, "target") ? e.target.length === 1 && e.target[0] === "body" ? e.target : [].concat(n.config.fragments, e.target).filter((t, r, o) => t !== "body" && t !== P && t.indexOf(",") === -1 ? o.indexOf(t) === r : !1) : n.config.fragments.length === 1 && n.config.fragments[0] === "body" ? ["body"] : [...n.config.fragments];
}
function Ft(...e) {
  return e.join(P);
}
var te = function e(t = 5) {
  let r = Math.random().toString(36).slice(-t);
  return e.o.has(r) ? e(t) : (e.o.add(r), r);
};
te.o = pe();
function Kt(e = 2) {
  return (t, r) => {
    let o = t.length;
    return (o < 1 || t[o - 1].length === e ? t.push([r]) : t[o - 1].push(r)) && t;
  };
}
function at(e) {
  return e < 1024 ? e + " B" : e < 1048576 ? (e / 1024).toFixed(1) + " KB" : e < 1073741824 ? (e / 1048576).toFixed(1) + " MB" : (e / 1073741824).toFixed(1) + " GB";
}
function Yt(e) {
  return e[0].toUpperCase() + e.slice(1);
}
function ct(e) {
  return /[_-]/.test(e) ? e.replace(/([_-]+).{1}/g, (t, r) => t[r.length].toUpperCase()) : e;
}
function he(e, t) {
  let r = typeof e == "string" ? $().querySelectorAll(e) : e, o = r.length;
  if (o !== 0)
    for (let s = 0; s < o && t(r[s], s) !== !1; s++)
      ;
}
function k(e, t) {
  if (arguments.length === 1)
    return (o) => k(e, o);
  let r = t.length;
  if (r !== 0)
    for (let o = 0; o < r; o++)
      e(t[o], o, t);
}
function ft(e) {
  for (let t in e)
    delete e[t];
}

// src/app/progress.ts
function jr() {
  let e = [], t = document.createElement("div"), r = null, o, s = null, i = ({ bgColor: u, barHeight: y, speed: F, easing: Ze }) => {
    t.style.cssText = Ft(
      "pointer-events:none;",
      `background-color:${u};`,
      `height:${y};`,
      "position:fixed;",
      "z-index:9999999;",
      "top:0;",
      "left:0;",
      "width:100%;",
      "will-change:opacity,transform;",
      `transition:transform ${F}ms ${Ze};`
    );
  }, a = (u) => (-1 + u) * 100, c = (u, y, F) => u < y ? y : u > F ? F : u, f = () => s || (t.style.setProperty("transform", `translateX(${a(r || 0)}%)`), s = $().appendChild(t), t), p = () => {
    let u = $();
    if (u.contains(s)) {
      let y = s.animate(
        { opacity: ["1", "0"] },
        { easing: "ease-out", duration: 100 }
      );
      y.onfinish = () => {
        u.removeChild(s), s = null;
      };
    } else
      s = null;
  }, g = () => {
    let u = e.shift();
    u && u(g);
  }, h = (u) => {
    e.push(u), e.length === 1 && g();
  }, b = (u) => {
    u = c(u, n.config.progress.minimum, 1), r = u === 1 ? null : u;
    let y = f();
    h((F) => {
      y.style.setProperty("transform", `translateX(${a(u)}%)`), u === 1 ? setTimeout(() => {
        p(), F();
      }, n.config.progress.speed * 2) : setTimeout(F, n.config.progress.speed);
    });
  }, W = (u) => {
    let y = r;
    if (!y)
      return T();
    if (y < 1)
      return typeof u != "number" && (y >= 0 && y < 0.2 ? u = 0.1 : y >= 0.2 && y < 0.5 ? u = 0.04 : y >= 0.5 && y < 0.8 ? u = 0.02 : y >= 0.8 && y < 0.99 ? u = 5e-3 : u = 0), y = c(y + u, 0, 0.994), b(y);
  }, Ee = () => {
    setTimeout(() => {
      r && (W(), Ee());
    }, n.config.progress.trickleSpeed);
  };
  function T(u) {
    n.config.progress && (o = setTimeout(() => {
      r || b(0), n.config.progress.trickle && Ee();
    }, u || 0));
  }
  function j(u) {
    clearTimeout(o), !(!u && !r) && (W(0.3 + 0.5 * Math.random()), b(1));
  }
  return { start: T, done: j, style: i };
}
var oe = jr();

// src/components/register.ts
function We(e) {
  for (let t in e) {
    let r = e[t], o = t.toLowerCase();
    d(r, "connect") || (r.connect = { state: {}, nodes: [] }), d(r.connect, "state") || (r.connect.state = {}), d(r.connect, "nodes") || (r.connect.nodes = []), d(n.components.registry, o) || (ee(n.components.registry, o, r), l(1, `${t} component registered under: ${o}`));
  }
}

// src/app/config.ts
function Fr(e) {
  for (let t of [
    "hover",
    "intersect",
    "proximity",
    "progress"
  ])
    d(e, t) && (e[t] === !1 ? n.config[t] = !1 : typeof e[t] == "object" && R(n.config[t], e[t]), delete e[t]);
  return e;
}
function lt(e = {}) {
  d(e, "components") && (We(e.components), delete e.components), R(n.config, Fr(e)), d(e, "eval") && R(n.config.eval, e.eval), n.config.index = null;
  let t = n.config.schema, r = n.config.schema = t === "spx" ? "spx" : t.endsWith("-") ? t : t === null ? P : `${t}-`, o = `:not([${r}disable]):not([href^="#"])`, s = `not([${r}eval=false])`;
  n.qs.n = `${r}target`, n.qs.s = `${r}morph`, n.qs.v = `${r}render`, n.qs.E = `[${r}eval]:not([${r}eval=false]):not(script)`, n.qs.a = new RegExp(`^href|${r}(hydrate|append|prepend|target|progress|threshold|scroll|position|proximity|hover|cache)$`, "i"), n.qs.c = `[${r}intersect]${a("intersect")}`, n.qs.f = `[${r}track]:not([${r}track=false])`, n.qs.component.l = `${r}component`, n.qs.component.p = `${r}node`, n.qs.component.m = `${r}bind`, n.qs.component.t = new RegExp(`${r}(?:node|bind|component)|@[a-z]|[a-z]:[a-z]`, "i"), n.qs.component.u = new RegExp(`^${r}[a-zA-Z0-9-]+:`, "i"), n.qs.component.b = "data-spx", n.qs.tags.d = n.config.annotate ? `a[${r}link]${o}` : `a${o}`, n.qs.tags.h = i("script"), n.qs.tags.T = i("style"), n.qs.tags.I = i("link"), n.qs.tags.P = i("meta"), n.qs.script.g = `script[${r}eval=hydrate]:not([${r}eval=false])`, n.qs.href.r = `${r}data:`, n.qs.href.i = `a[${r}proximity]${o}${a("proximity")}`, n.qs.href.y = `a${o}${a("intersect")}`, n.qs.href.e = n.config.hover !== !1 && n.config.hover.trigger === "href" ? `a${o}${a("hover")}` : `a[${r}hover]${o}${a("hover")}`, n.memory.bytes = 0, n.memory.visits = 0, n.memory.limit = n.config.maxCache, oe.style(n.config.progress);
  function i(c) {
    let f = c === "link" ? `${c}[rel=stylesheet]:${s},${c}[rel~=preload]:${s}` : c === "script" ? `${c}:${s}:not([${r}eval=hydrate])` : `${c}:${s}`;
    if (n.config.eval[c] === !1 || n.config.eval[c] === null)
      return f;
    if (n.config.eval[c] === !0)
      return `${c}[${r}eval]:${s}`;
    if (H(n.config.eval[c]))
      return n.config.eval[c].length > 0 ? n.config.eval[c].map((p) => `${p}:${s}`).join(",") : (l(3, `Missing eval ${c} option, SPX will use defaults`), f);
    l(4, `Invalid eval ${c} option, expected boolean or array`);
  }
  function a(c) {
    let f = `:not([${r}${c}=false]):not([${r}link])`;
    switch (c.charCodeAt(0)) {
      case 104:
        return `${f}:not([${r}proximity]):not([${r}intersect])`;
      case 105:
        return `${f}:not([${r}hover]):not([${r}proximity])`;
      case 112:
        return `${f}:not([${r}intersect]):not([${r}hover])`;
    }
  }
}

// src/app/location.ts
var C = re.replace(Mt, P);
function ut(e, t) {
  let r = t || m();
  for (let { nodeName: o, nodeValue: s } of e.attributes)
    if (o.startsWith(n.qs.href.r)) {
      d(r, "data") || (r.data = m());
      let i = ct(o.slice(n.qs.href.r.length)), a = s.trim();
      Ie.test(a) ? r.data[i] = a === "NaN" ? NaN : +a : Te.test(a) ? r.data[i] = a === "true" : a.charCodeAt(0) === 123 || a.charCodeAt(0) === 91 ? r.data[i] = me(o, a) : r.data[i] = a;
    } else {
      if (!n.qs.a.test(o))
        continue;
      if (o === "href")
        r.rev = location.pathname + location.search, t || (r.location = mt(s), r.key = r.location.pathname + r.location.search);
      else {
        let i = o.slice(o.lastIndexOf("-") + 1), a = s.replace(St, P).trim();
        if (Ht.test(a))
          r[i] = Ot.test(i) ? a.match(ot).reduce(Kt(2), []) : a.match(ot);
        else if (i === "position")
          if (nt.test(a)) {
            let c = a.match(nt);
            r[`scroll${c[0].toUpperCase()}`] = +c[1], c.length === 4 && (r[`scroll${c[2].toUpperCase()}`] = +c[3]);
          } else
            l(3, `Invalid attribute value on ${o}, expects: y:number or x:number`);
        else
          i === "scroll" ? He.test(a) ? r.scrollY = +a : l(3, `Invalid attribute value on ${o}, expects: number`) : i === "target" ? a === "true" ? r[i] = [] : r[i] = a !== P ? a.split(",") : [] : Te.test(a) ? qt.test(o) || (r[i] = a === "true") : Ie.test(a) ? r[i] = +a : r[i] = a;
      }
    }
  return r;
}
function ge(e) {
  let t = m();
  if (e.length === 1 && e.charCodeAt(0) === 47)
    return t.pathname = e, t.hash = P, t.search = P, t;
  let o = e.indexOf("#");
  o >= 0 ? (t.hash = e.slice(o), e = e.slice(0, o)) : t.hash = P;
  let s = e.indexOf("?");
  return s >= 0 ? (t.search = e.slice(s), e = e.slice(0, s)) : t.search = P, t.pathname = e, t;
}
function Ve(e, t) {
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
  return e.length - t === C.length ? "/" : null;
}
function pt(e) {
  let t = e.startsWith("www.") ? e.slice(4) : e, r = t.indexOf("/");
  if (r >= 0) {
    let o = t.slice(r);
    if (t.slice(0, r) === C)
      return o.length > 0 ? ge(o) : ge("/");
  } else {
    let o = t.search(/[?#]/);
    if (o >= 0) {
      if (t.slice(0, o) === C)
        return ge("/" + t.slice(o));
    } else if (t === C)
      return ge("/");
  }
  return null;
}
function Kr(e) {
  return e.startsWith("http") ? 1 : e.startsWith("//") ? 2 : e.startsWith("www.") ? 3 : 0;
}
function dt(e) {
  if (typeof e != "string" || e.length === 0)
    return !1;
  if (e.charCodeAt(0) === 47)
    return e.charCodeAt(1) !== 47 ? !0 : e.startsWith("www.", 2) ? e.startsWith(C, 6) : e.startsWith(C, 2);
  if (e.charCodeAt(0) === 63)
    return !0;
  if (e.startsWith("www."))
    return e.startsWith(C, 4);
  if (e.startsWith("http")) {
    let t = e.indexOf("/", 4) + 2;
    return e.startsWith("www.", t) ? e.startsWith(C, t + 4) : e.startsWith(C, t);
  }
}
function Yr(e) {
  return e.charCodeAt(0) === 47 ? e.charCodeAt(1) !== 47 ? ge(e) : pt(e.slice(2)) : e.charCodeAt(0) === 63 ? ge(location.pathname + e) : e.startsWith("https:") || e.startsWith("http:") ? pt(e.slice(e.indexOf("/", 4) + 2)) : e.startsWith("www.") ? pt(e) : null;
}
function S(e) {
  if (typeof e == "object")
    return e.pathname + e.search;
  if (e === P)
    return "/";
  let t = Kr(e);
  if (t === 1) {
    let r = e.charCodeAt(4) === 115 ? 8 : 7, o = e.startsWith("www.", r) ? r + 4 : r;
    return e.startsWith(C, o) ? Ve(e, o) : null;
  }
  if (t === 2) {
    let r = e.startsWith("www.", 2) ? 6 : 2;
    return e.startsWith(C, r) ? Ve(e, r) : null;
  }
  return t === 3 ? e.startsWith(C, 4) ? Ve(e, 4) : null : e.startsWith(C, 0) ? Ve(e, 0) : null;
}
function Bt() {
  return m({
    hostname: C,
    origin: re,
    pathname: location.pathname,
    search: location.search,
    hash: location.hash
  });
}
function mt(e) {
  if (e === P)
    return Bt();
  let t = Yr(e);
  return t === null && l(5, `Invalid pathname: ${e}`), t.origin = re, t.hostname = C, t;
}
function I(e, t = 6) {
  if (e instanceof Element) {
    let o = ut(e);
    return o.type = t || 6, o;
  }
  let r = m();
  return e === 0 ? (r.location = Bt(), r.key = S(r.location), r.rev = r.key, r.type = e, r.visits = 1) : t === 7 ? (r.location = mt(e), r.key = S(r.location), r.rev = r.key, r.type = t) : (r.rev = location.pathname + location.search, r.location = mt(typeof e == "string" ? e : r.rev), r.key = S(r.location), r.type = t), r;
}

// src/shared/dom.ts
function ye(e) {
  return new DOMParser().parseFromString(e, "text/html");
}
function ht(e) {
  let t = e.indexOf("<title");
  if (t === -1)
    return P;
  let r = e.indexOf(">", t) + 1, o = e.indexOf("</title", r);
  return jt(e.slice(r, o).trim());
}

// src/app/events.ts
function L(e, ...t) {
  let r = e === "before:cache";
  r && (t[1] = ye(t[1]));
  let o = !0;
  return k((s) => {
    let i = s.apply(null, t);
    r ? i instanceof Document ? o = i.documentElement.outerHTML : typeof o != "string" && (o = i !== !1) : o = i !== !1;
  }, n.events[e] || []), o;
}
function Ut(e, t, r) {
  return d(n.events, e) || (n.events[e] = []), n.events[e].push(r ? t.bind(r) : t) - 1;
}
function _t(e, t) {
  if (d(n.events, e)) {
    let r = n.events[e];
    if (r && typeof t == "number")
      r.splice(t, 1), l(2, `Removed ${e} event listener (id: ${t})`), r.length === 0 && delete n.events[e];
    else {
      let o = [];
      if (r && t)
        for (let s = 0, i = r.length; s < i; s++)
          r[s] !== t ? o.push(r[s]) : l(2, `Removed ${e} event listener (id: ${s})`);
      o.length ? n.events[e] = o : delete n.events[e];
    }
  } else
    l(3, `There are no ${e} event listeners`);
  return this;
}

// src/app/fetch.ts
function Pe(e, {
  method: t = "GET",
  body: r = null,
  headers: o = null,
  type: s = "text"
} = {}) {
  return new Promise(function(i, a) {
    let c = new x();
    if (c.key = e, c.responseType = s, c.open(t, e), c.setRequestHeader("spx-request", "true"), o !== null)
      for (let f in o)
        c.setRequestHeader(f, o[f]);
    c.onloadstart = function() {
      x.request.set(this.key, c);
    }, c.onload = function() {
      i(this.response);
    }, c.onerror = function() {
      a(this.statusText);
    }, c.onabort = function() {
      x.timeout.delete(this.key), x.transit.delete(this.key), x.request.delete(this.key);
    }, c.onloadend = function(f) {
      x.request.delete(this.key), n.memory.bytes = n.memory.bytes + f.loaded, n.memory.visits = n.memory.visits + 1;
    }, c.send(r);
  });
}
function Xe(e) {
  return x.timeout.has(e) ? (clearTimeout(x.timeout.get(e)), x.timeout.delete(e)) : !0;
}
function je(e, t, r) {
  x.timeout.has(e) || w(e) || x.timeout.set(e, setTimeout(t, r));
}
function gt(e) {
  for (let [t, r] of x.request)
    e !== t && (r.abort(), l(3, `Pending request aborted: ${t}`));
}
function zt(e) {
  if (n.config.preload !== null) {
    if (H(n.config.preload)) {
      let t = n.config.preload.filter((r) => {
        let o = I(r, 3);
        return o.key !== r ? A(N(o)) : !1;
      });
      return Promise.allSettled(t);
    } else if (typeof n.config.preload == "object" && d(n.config.preload, e.key)) {
      let t = n.config.preload[e.key].map((r) => A(
        N(
          I(
            r,
            3
          )
        )
      ));
      return Promise.allSettled(t);
    }
  }
}
function Fe(e) {
  return E(this, null, function* () {
    let t = N(I(e, 4));
    yield Xt(), A(t).then((r) => {
      r ? l(2, `Reverse fetch completed: ${r.key}`) : l(3, `Reverse fetch failed: ${e}`);
    });
  });
}
function Ne(e) {
  return E(this, null, function* () {
    if (!x.transit.has(e.key))
      return e;
    let t = yield x.transit.get(e.key);
    return x.transit.delete(e.key), x.timeout.delete(e.key), xe(e, t);
  });
}
function A(e) {
  return E(this, null, function* () {
    return x.request.has(e.key) && e.type !== 7 ? (e.type === 4 && x.request.has(e.rev) ? (x.request.get(e.rev).abort(), l(3, `Request aborted: ${e.rev}`)) : l(3, `Request in transit: ${e.key}`), !1) : L("fetch", e) ? (x.transit.set(e.key, Pe(e.key)), Ne(e)) : (l(3, `Request cancelled via dispatched event: ${e.key}`), !1);
  });
}

// src/observers/scripts.ts
function Br(e) {
  return new Promise((t, r) => {
    let o = document.createElement("script");
    o.addEventListener("error", r, { once: !0 }), o.async = !1, o.text = e.target.text;
    for (let { nodeName: s, nodeValue: i } of e.target.attributes)
      o.setAttribute(s, i);
    document.contains(e.target) ? e.target.replaceWith(o) : (document.head.append(o), e.external ? o.addEventListener("load", () => o.remove(), { once: !0 }) : o.remove()), e.external && o.addEventListener("load", () => t(), { once: !0 }), t();
  });
}
function Ur(e) {
  if (!e.hasAttribute("src") && !e.text)
    return;
  let t = e.type ? e.type.trim().toLowerCase() : "text/javascript", r = Ct.test(t) ? 1 : t === "module" ? 2 : NaN, o = m();
  return o.blocking = !0, o.evaluate = !1, o.external = !1, isNaN(r) || e.noModule && r === 1 || (e.src && (o.external = !0), (r !== 1 || o.external && (e.hasAttribute("async") || e.defer)) && (o.blocking = !1), o.evaluate = !0, o.target = e), o;
}
function Gt(e) {
  return E(this, null, function* () {
    try {
      let t = Br(e);
      e.blocking && (yield t);
    } catch (t) {
      console.error(t);
    }
  });
}
function Jt(e) {
  return E(this, null, function* () {
    let r = qe(e, Ur).filter((o) => o.evaluate).reduce((o, s) => E(this, null, function* () {
      return s.external ? Promise.all([o, Gt(s)]) : (yield o, yield Gt(s));
    }), Promise.resolve());
    yield Promise.race([r]);
  });
}

// src/observers/hover.ts
function Zt(e) {
  let t = Re(e.target, n.qs.href.e);
  if (!t)
    return;
  let r = I(t, 10);
  if (w(r.key) || x.timeout.has(r.key))
    return;
  t.addEventListener(`${M}leave`, Qt, { once: !0 });
  let o = N(r), s = o.threshold || n.config.hover.threshold;
  je(r.key, function() {
    L("prefetch", t, r) && A(o).then(function() {
      x.timeout.delete(r.key), er(t);
    });
  }, s);
}
function Qt(e) {
  let t = Re(e.target, n.qs.href.e);
  t && Xe(S(t.href));
}
function _r(e) {
  e.addEventListener(`${M}enter`, Zt);
}
function er(e) {
  e.removeEventListener(`${M}enter`, Zt), e.removeEventListener(`${M}leave`, Qt);
}
function Ae() {
  !n.config.hover || n.observe.hover || (k(_r, $e(n.qs.href.e)), n.observe.hover = !0);
}
function se() {
  n.observe.hover && (k(er, $e(n.qs.href.e)), n.observe.hover = !1);
}

// src/observers/intersect.ts
var ie;
function zr(e) {
  return E(this, null, function* () {
    if (e.isIntersecting) {
      let t = I(e.target, 11);
      if (!L("prefetch", e.target, t))
        return ie.unobserve(e.target);
      (yield A(N(t))) ? ie.unobserve(e.target) : (l(3, `Prefetch will retry at next intersect for: ${t.key}`), ie.observe(e.target));
    }
  });
}
function Le() {
  if (!n.config.intersect || n.observe.intersect)
    return;
  ie || (ie = new IntersectionObserver(k(zr), n.config.intersect));
  let e = k((r) => ie.observe(r)), t = tr(n.qs.c, n.qs.href.y);
  e(t), n.observe.intersect = !0;
}
function ae() {
  n.observe.intersect && (ie.disconnect(), n.observe.intersect = !1);
}

// src/observers/components.ts
var Be = {};
Or(Be, {
  connect: () => Me,
  disconnect: () => vt
});

// src/components/listeners.ts
function rr(e, { method: t, params: r }) {
  let o = e[t];
  return (s) => (r && ee(s, "attrs", r), o.call(e, s));
}
function Ke(e, t) {
  return t.isWindow ? addEventListener(t.eventName, rr(e, t)) : e[t.schema][t.index].addEventListener(
    t.eventName,
    rr(e, t),
    t.options
  ), !0;
}
function or(e, t) {
  return t.isWindow ? removeEventListener(t.eventName, e[t.method]) : e[t.schema][t.index].removeEventListener(
    t.eventName,
    e[t.method]
  ), !1;
}

// src/components/connect.ts
var z = Y();
function sr(e, t) {
  t(e);
  let r, o;
  for (e.firstElementChild && (o = 0, r = e.children[o]); r; )
    sr(r, t), e.nodeName === "svg" ? (o = e.childElementCount, r = e.children[o]) : r = e.children[++o];
}
function we(e, t, r) {
  return n.components.refs[t] = r, e.dataset.spx = e.dataset.spx ? `${e.dataset.spx},${t}` : t, z.set(t, e), t;
}
function Ye(e, t) {
  let r = m();
  return r.instanceOf = e, r.key = `c.${te()}`, r.state = m(), r.events = m(), r.nodes = m(), r.binds = m(), r.dom = t ? we(t, r.key, r.key) : null, r;
}
function nr(e, t, r) {
  let o = st(t);
  for (let s = 0, i = o.length; s < i; s++) {
    let a = o[s], [c, f] = a.split(".");
    e.has(c) ? r(ue(e.get(c)), f.trim(), a) : (e.set(c, [Ye(c)]), r(e.get(c)[0], f.trim(), a));
  }
}
function Gr(e, t, r) {
  let o = m({
    once: !1,
    passive: !1
  }), s = t.indexOf("{");
  if (s > -1) {
    let f = t.slice(s, t.lastIndexOf("}", s)).match(/(passive|once)/g);
    f !== null && (o.once = f.includes("once"), o.passive = f.includes("passive")), t = t.slice(0, s);
  }
  let i = st(t), [a, c] = i[0].split(".");
  i.length > 1 && l(3, `More than 1 event binding defined: ${t}`), e.has(a) ? r(ue(e.get(a)), c.trim(), o) : (e.set(a, [Ye(a)]), r(e.get(a)[0], c.trim(), o));
}
function Jr(e, t) {
  if (n.components.connected.has(e))
    return;
  let { attributes: r } = e, o = r.length;
  if (o === 0 || o === 1 && n.qs.component.t.test(r[0].name) === !1 || o === 2 && n.qs.component.t.test(r[0].name) === !1 && n.qs.component.t.test(r[1].name) === !1)
    return;
  let s = e.getAttribute(n.qs.component.l);
  if (!s)
    return i(e);
  console.log(e), k((a) => {
    if (!d(n.components.registry, a))
      l(3, `Component does not exist in registry: ${a}`);
    else {
      if (t.has(a)) {
        let c = ue(t.get(a));
        c.dom !== null ? t.get(a).push(Ye(a, e)) : c.dom = we(e, c.key, c.key);
      } else
        t.set(a, [Ye(a, e)]);
      i(e, a);
    }
  }, Wt(s));
  function i(a, c) {
    let f = null, p = null, g = !1;
    for (let h = r.length - 1; h >= 0; h--) {
      let { name: b, value: W } = r[h];
      if (c) {
        if (f = `${n.config.schema}${c}:`, b.startsWith(f)) {
          let T = b.slice(f.length);
          ue(t.get(c)).state[T] = W;
        }
      } else if (n.qs.component.u.test(b) && !b.startsWith(n.qs.href.r) && W) {
        let [T, j] = b.slice(n.config.schema.length).split(":");
        p || (p = m()), d(p, T) || (p[T] = m()), d(p[T], j) ? l(3, `Duplicated event parameter binding: ${b}="${W}"`) : (p[T][j] = Vt(W), g = !0);
        continue;
      }
      let Ee = b.indexOf("@");
      if (Ee > -1) {
        let T = b.slice(Ee + 1), j = T.startsWith("window:");
        Gr(t, W, ({ events: u, key: y }, F, Ze) => {
          let K = `e.${te()}`;
          u[K] = m(), u[K].element = we(a, K, y), u[K].isWindow = j, u[K].eventName = j ? T.slice(7) : T, u[K].attached = !1, u[K].params = null, u[K].method = F, u[K].schema = `${F}EventNodes`, u[K].options = Ze;
        }), g = !0;
      } else
        b === n.qs.component.p ? (nr(t, W, ({ nodes: T, key: j }, u) => {
          let y = `n.${te()}`;
          T[y] = m(), T[y].element = we(a, y, j), T[y].schema = `${u}Nodes`;
        }), g = !0) : b === n.qs.component.m && (nr(t, W, ({ binds: T, key: j }, u) => {
          let y = `b.${te()}`;
          T[y] = m(), T[y].element = we(a, y, j), T[y].schema = `${u}StateNodes`, T[y].persist = !1, T[y].stateKey = u;
        }), g = !0);
    }
    if (g && (n.components.connected.add(a), g = !1), p) {
      for (let h in p)
        ue(t.get(h)).events[a.dataset.spx].params = p[h];
      p = null, g = !1;
    }
  }
}
function Zr(e, t) {
  let { instanceOf: r, events: o } = t;
  for (let s in o) {
    let i = o[s];
    if (!d(e, i.method)) {
      l(3, `Event callback is undefined: ${r}.${i.method}()`);
      continue;
    }
    if (i.attached) {
      l(3, `Event listener already exists: ${r}.${i.method}()`);
      continue;
    }
    let a = z.get(i.element);
    d(e, i.schema) ? i.index = e[i.schema].push(a) - 1 : (e[i.schema] = [a], e[i.schema.slice(0, -1)] = e[i.schema][0], i.index = 0), i.attached = Ke(e, i), z.delete(i.element);
  }
}
function Qr(e, t) {
  for (let r in t.nodes) {
    let o = t.nodes[r], s = z.get(o.element);
    d(e, o.schema) ? o.index = e[o.schema].push(s) - 1 : (e[o.schema] = [s], e[o.schema.slice(0, -1)] = e[o.schema][0], o.index = 0), z.delete(o.element);
  }
}
function eo(e, t, r) {
  for (let o in t.binds) {
    let s = t.binds[o];
    if (!d(r, s.stateKey)) {
      l(3, `Unknown state binding on key: ${t.instanceOf}.${s.stateKey}`);
      continue;
    }
    let i = z.get(s.element);
    d(e, s.schema) ? s.index = e[s.schema].push(i) - 1 : (e[s.schema] = [i], e[s.schema.slice(0, -1)] = e[s.schema][0], s.index = 0), d(r[s.stateKey], "persist") && r[s.stateKey] !== !1 && (s.persist = !0), z.delete(s.element);
  }
}
function ir() {
  let e = Y();
  sr($(), (r) => Jr(r, e)), n.page.visits === 1 && (n.snaps[n.page.uuid] = document.documentElement.outerHTML);
  for (let [r, o] of e) {
    let s = n.components.registry[r], { connect: i } = s;
    for (let a of o)
      if (a.dom !== null) {
        let c = z.get(a.dom), f = new s(a, c, i);
        Zr(f, a), Qr(f, a), eo(f, a, i.state), n.components.instances[a.key] = le(m(), {
          scope: { get: () => a },
          instance: { get: () => f }
        }), d(f, "onInit") && f.onInit(), n.components.connected.has(c) || n.components.connected.add(c), n.page.components.push(a.key), z.delete(a.dom);
      }
  }
}

// src/observers/components.ts
function Me() {
  if (!n.observe.components) {
    if (n.page.components.length === 0)
      return ir();
    n.observe.components = !0;
  }
}
function vt() {
  n.observe.components && (n.observe.components = !1);
}

// src/observers/proximity.ts
function to({ clientX: e, clientY: t }, r) {
  return e <= r.right && e >= r.left && t <= r.bottom && t >= r.top;
}
function ro(e) {
  let t = e.getBoundingClientRect(), r = e.getAttribute(n.qs.href.i), o = He.test(r) ? Number(r) : n.config.proximity.distance;
  return {
    target: e,
    top: t.top - o,
    bottom: t.bottom + o,
    left: t.left - o,
    right: t.right + o
  };
}
function oo(e) {
  let t = !1;
  return (r) => {
    if (t)
      return;
    t = !0;
    let o = e.findIndex((s) => to(r, s));
    if (o === -1)
      setTimeout(() => {
        t = !1;
      }, n.config.proximity.throttle);
    else {
      let { target: s } = e[o], i = N(I(s, 12)), a = i.threshold || n.config.proximity.threshold;
      je(i.key, () => E(this, null, function* () {
        if (!L("prefetch", s, i))
          return G();
        (yield A(i)) && (e.splice(o, 1), t = !1, e.length === 0 && (G(), l(2, "Proximity observer disconnected")));
      }), a);
    }
  };
}
var Et;
function Ce() {
  if (!n.config.proximity || n.observe.proximity)
    return;
  let e = $e(n.qs.href.i).map(ro);
  e.length > 0 && (Et = oo(e), addEventListener(`${M}move`, Et, { passive: !0 }), n.observe.proximity = !0);
}
function G() {
  n.observe.proximity && (removeEventListener(`${M}move`, Et), n.observe.proximity = !1);
}

// src/morph/utils.ts
function ar(e, t) {
  return !t || t === "http://www.w3.org/1999/xhtml" ? document.createElement(e) : document.createElementNS(t, e);
}
function U(e) {
  return e ? e.getAttribute && e.getAttribute("id") || e.id : void 0;
}
function Oe(e, t) {
  let r = e.nodeName, o = t.nodeName;
  if (r === o)
    return !0;
  let s = r.charCodeAt(0), i = o.charCodeAt(0);
  return s <= 90 && i >= 97 || s <= 90 && i >= 97 ? r === o.toUpperCase() : !1;
}
function cr(e, t) {
  let r = e.firstChild;
  for (; r; ) {
    let o = r.nextSibling;
    t.appendChild(r), r = o;
  }
  return t;
}

// src/morph/attributes.ts
function Ue(e, t, r) {
  e[r] !== t[r] && (e[r] = t[r], e[r] ? e.setAttribute(r, P) : e.removeAttribute(r));
}
function lr(e, t) {
  if (t.nodeType === 11 || e.nodeType === 11)
    return;
  let r = t.attributes, o, s, i, a, c;
  for (let p = r.length - 1; p >= 0; p--)
    o = r[p], s = o.name, a = o.value, i = o.namespaceURI, i ? (s = o.localName || s, c = e.getAttributeNS(i, s), c !== a && (o.prefix === "xmlns" && (s = o.name), e.setAttributeNS(i, s, a))) : (c = e.getAttribute(s), c !== a && e.setAttribute(s, a));
  let f = e.attributes;
  for (let p = f.length - 1; p >= 0; p--)
    o = f[p], s = o.name, a = o.value, i = o.namespaceURI, i ? (s = o.localName || s, t.hasAttributeNS(i, s) || e.removeAttributeNS(i, s)) : t.hasAttribute(s) || e.removeAttribute(s);
}

// src/morph/forms.ts
function pr(e, t) {
  let r = e.parentNode;
  if (r) {
    let o = r.nodeName.toUpperCase();
    o === "OPTGROUP" && (r = r.parentNode, o = r && r.nodeName.toUpperCase()), o === "SELECT" && !r.hasAttribute("multiple") && (e.hasAttribute("selected") && !t.selected && (e.setAttribute("selected", "selected"), e.removeAttribute("selected")), r.selectedIndex = -1);
  }
  Ue(e, t, "selected");
}
function mr(e, t) {
  Ue(e, t, "checked"), Ue(e, t, "disabled"), e.value !== t.value && (e.value = t.value), t.hasAttribute("value") || e.removeAttribute("value");
}
function Tt(e, t) {
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
function ur(e, t) {
  if (!t.hasAttribute("multiple")) {
    let r = 0, o = -1, s = e.firstElementChild, i, a;
    for (; s; )
      if (a = s.nodeName && s.nodeName.toUpperCase(), a === "OPTGROUP")
        i = s, s = i.firstElementChild;
      else {
        if (a === "OPTION") {
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

// src/components/observe.ts
new MutationObserver(function(e) {
  console.log(e);
});
function Se(e) {
  if (e.nodeType !== 1 || !e.dataset.spx)
    return;
  n.components.connected.has(e) && n.components.connected.delete(e);
  let t = e.dataset.spx.split(",");
  for (let r = 0, o = t.length; r < o; r++) {
    let s = t[r];
    if (!d(n.components.refs, s) || !d(n.components.instances, n.components.refs[s]))
      continue;
    let i = s.charCodeAt(0), { instance: a, scope: c } = n.components.instances[n.components.refs[s]];
    i === 99 ? d(a, "onExit") && a.onExit() : i === 98 && c.binds[s].persist ? hr(n.page.rev, Dt(e.nodeName, e.dataset.spx), e) : i === 101 && (c.events[s].attached = or(a, c.events[s]));
  }
}
function dr(e) {
  if (!e.dataset.spx)
    return;
  let t = e.dataset.spx.split(",");
  for (let r = 0, o = t.length; r < o; r++) {
    let s = t[r];
    if (!d(n.components.refs, s) || !d(n.components.instances, n.components.refs[s]))
      continue;
    let { instance: i, scope: a } = n.components.instances[n.components.refs[s]], c = s.charCodeAt(0);
    if (c === 99)
      i.dom = e, R(i.state, a.state);
    else if (c === 110)
      i[a.nodes[s].schema][a.nodes[s].index] = e, a.nodes[s].index === 0 && (i[a.nodes[s].schema.slice(0, -1)] = e);
    else if (c === 101) {
      let f = a.events[s];
      i[f.schema][f.index] = e, f.index === 0 && (i[f.schema.slice(0, -1)] = e), f.attached = Ke(i, f);
    } else
      c === 98 && (i[a.binds[s].schema][a.binds[s].index] = e, a.binds[s].index === 0 && (i[a.binds[s].schema.slice(0, -1)] = e));
  }
}

// src/morph/morph.ts
function no(e, t, r) {
  let o = t.firstChild, s, i, a = e.firstChild, c, f, p, g;
  e:
    for (; o; ) {
      for (i = o.nextSibling, s = U(o); a; ) {
        if (p = a.nextSibling, o.isSameNode && o.isSameNode(a)) {
          o = i, a = p;
          continue e;
        }
        c = U(a), f = a.nodeType;
        let h;
        if (f === o.nodeType && (f === 1 ? (s ? s !== c && ((g = r.lookup.get(s)) ? p === g ? h = !1 : (e.insertBefore(g, a), c ? r.remove.push(c) : ze(a, e, !0, r), a = g, c = U(a)) : h = !1) : c && (h = !1), h !== !1 && (h = Oe(a, o)), h === !1 && r.lookup.has(c) && r.lookup.get(c).getAttribute(n.qs.s) === "children" && (h = !0), h && _e(a, o, r)) : (f === 3 || f === 8) && (h = !0, a.nodeValue !== o.nodeValue && (a.nodeValue = o.nodeValue))), h) {
          o = i, a = p;
          continue e;
        }
        c ? r.remove.push(c) : ze(a, e, !0, r), a = p;
      }
      s && (g = r.lookup.get(s)) && Oe(g, o) ? (e.appendChild(g), _e(g, o, r)) : (o.actualize && (o = o.actualize(e.ownerDocument || document)), e.appendChild(o), It(o, r)), o = i, a = p;
    }
  switch (so(e, a, c, r), e.nodeName) {
    case "INPUT":
      mr(
        e,
        t
      );
      break;
    case "OPTION":
      pr(
        e,
        t
      );
      break;
    case "SELECT":
      ur(
        e,
        t
      );
      break;
    case "TEXTAREA":
      Tt(
        e,
        t
      );
      break;
  }
}
function _e(e, t, r) {
  let o = U(t);
  if (o && r.lookup.delete(o), e.isEqualNode(t))
    return;
  let s = e.getAttribute(n.qs.s);
  s !== "false" && (s !== "children" && lr(e, t), e.nodeName !== "TEXTAREA" ? no(e, t, r) : Tt(e, t));
}
function gr(e, t, r) {
  if (e.nodeType !== 1)
    return;
  let o = e.firstChild;
  for (; o; ) {
    let s;
    t && (s = U(o)) ? r.remove.push(s) : (Se(o), o.firstChild && gr(o, t, r)), o = o.nextSibling;
  }
}
function It(e, t) {
  e.nodeType === 1 && dr(e);
  let r = e.firstChild;
  for (; r; ) {
    let o = r.nextSibling, s = U(r);
    if (s) {
      let i = t.lookup.get(s);
      i && Oe(r, i) ? (r.parentNode.replaceChild(i, r), _e(i, r, t)) : It(r, t);
    } else
      It(r, t);
    r = o;
  }
}
function ze(e, t, r, o) {
  t && t.removeChild(e), Se(e), gr(e, r, o);
}
function so(e, t, r, o) {
  for (; t; ) {
    let s = t.nextSibling;
    (r = U(t)) ? o.remove.push(r) : ze(t, e, !0, o), t = s, r = U(t);
  }
}
function yr(e, t) {
  if (e.nodeType === 1 || e.nodeType === 11) {
    let r = e.firstChild;
    for (; r; ) {
      let o = U(r);
      o && t.lookup.set(o, r), yr(r, t), r = r.nextSibling;
    }
  }
}
function J(e, t) {
  t.nodeType === 11 && (t = t.firstElementChild);
  let r = m({
    remove: [],
    lookup: Y()
  });
  yr(e, r);
  let o = e, s = o.nodeType, i = t.nodeType;
  if (s === 1)
    i === 1 ? Oe(e, t) || (Se(e), o = cr(e, ar(t.nodeName, t.namespaceURI))) : o = t;
  else if (s === 3 || s === 8) {
    if (i === s)
      return o.nodeValue !== t.nodeValue && (o.nodeValue = t.nodeValue), o;
    o = t;
  }
  if (o === t)
    Se(e);
  else {
    if (t.isSameNode && t.isSameNode(o))
      return;
    if (_e(o, t, r), r.remove)
      for (let a of r.remove) {
        let c = r.lookup.get(a);
        c && ze(c, c.parentNode, !1, r);
      }
  }
  return o !== e && e.parentNode && (o.actualize && (o = o.actualize(e.ownerDocument || document)), e.parentNode.replaceChild(o, e)), o;
}

// src/app/render.ts
function io(e, t) {
  return e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING || -1;
}
function xr(e, t) {
  return E(this, null, function* () {
    let r = t === 7 ? n.qs.script.g : n.qs.tags.h, o = qe(e.querySelectorAll(r));
    yield Jt(o.sort(io));
  });
}
function ao(e) {
  document.head.querySelectorAll(n.qs.x).forEach((t) => {
    e.head.contains(t) || t.remove();
  }), document.head.append(...e.querySelectorAll(n.qs.x));
}
function co(e) {
  if (!e)
    return;
  let t = e.querySelectorAll(n.qs.f);
  if (t.length > 0)
    for (let r of t)
      r.hasAttribute("id") ? n.tracked.has(r.id) || ($().appendChild(r), n.tracked.add(r.id)) : l(3, `Tracked node <${r.tagName.toLowerCase()}> must contain an id attribute`);
}
function fo(e, t) {
  let r = e.target;
  if (r.length === 1 && r[0] === "body")
    J($(), t.body);
  else {
    let o = `${r.join(",")},[${n.qs.n}]`, s = t.body.querySelectorAll(o);
    if (s.length === 0)
      l(3, `Unmatched targets, applied <body> replacement on: ${e.key}`), $().replaceWith(t.body);
    else {
      let i = $().querySelectorAll(o), a = [];
      if (i.length !== s.length)
        return l(3, `Target mismatch, fallback visit applies: ${e.key}`), location.assign(e.key);
      for (let c = 0, f = i.length; c < f; c++) {
        let p = i[c], g = s[c];
        if (!g || p.isEqualNode(g) || !L("render", p, g))
          continue;
        let h = g.getAttribute(n.qs.n);
        if (h === "" || h === "true") {
          if (a.some((b) => b.contains(p)))
            continue;
        } else
          a.push(p);
        if (J(p, g), e.append || e.prepend) {
          let b = document.createElement("div");
          for (let W of t.childNodes)
            b.appendChild(W);
          e.append ? p.appendChild(b) : p.insertBefore(b, p.firstChild);
        }
      }
    }
    console.log(Be), co(t.body);
  }
}
function lo(e, t) {
  let r = e.hydrate;
  if (r.length === 1 && r[0] === "body") {
    J($(), t.body);
    return;
  }
  let o = r.join(","), s = $().querySelectorAll(o), i = e.preserve && e.preserve.length > 0 ? e.preserve.join(",") : null, a = [];
  if (i) {
    let c = $().querySelectorAll(i);
    for (let f = 0, p = c.length; f < p; f++) {
      let g = c[f];
      g.setAttribute("spx-morph", "false"), a.push(g);
    }
  }
  if (s.length > 0) {
    let c = t.body.querySelectorAll(o);
    for (let f = 0, p = s.length; f < p; f++) {
      let g = s[f], h = c[f];
      if (c[f] instanceof HTMLElement) {
        if (!L("hydrate", g, h))
          continue;
        J(h, h);
      }
    }
  }
  if (i)
    for (let c of a)
      c.removeAttribute("spx-morph");
  xr(t, 7), e.hydrate = void 0, e.preserve = void 0, e.type = 6, X(e);
}
function V(e) {
  se(), ae(), G(), vt(), document.title = e.title;
  let t = ye(n.snaps[e.uuid]);
  return e.type === 7 ? lo(e, t) : (ao(t), fo(e, t), xr(t, e.type), scrollTo(e.scrollX, e.scrollY)), oe.done(), ke(() => {
    Ae(), Le(), Ce(), Me();
  }), L("load", e), e;
}

// src/observers/history.ts
var v = window.history;
function vr() {
  return v.state !== null && d(v.state, "rev") && v.state.key !== v.state.rev;
}
function Nt(e) {
  if (v.state == null || typeof v.state != "object")
    return !1;
  let t = De(v.state)([
    "key",
    "rev",
    "scrollX",
    "scrollY",
    "title"
  ]);
  return typeof e == "string" ? t && v.state.key === e : t;
}
function po(e) {
  return Nt(e.key) ? (scrollTo(v.state.scrollX, v.state.scrollY), R(e, v.state)) : (Z(e), e);
}
function Z({ key: e, rev: t, title: r, scrollX: o, scrollY: s }) {
  let i = m({
    key: e,
    rev: t,
    title: r || document.title,
    scrollX: o,
    scrollY: s
  });
  return v.replaceState(i, i.title, i.key), l(1, `History replaceState: ${v.state.key}`), v.state;
}
function ce({ key: e, rev: t, title: r }) {
  let o = m({
    key: e,
    rev: t,
    title: r,
    scrollY: 0,
    scrollX: 0
  });
  return v.pushState(o, o.title, o.key), l(1, `History pushState: ${v.state.key}`), v.state;
}
function Er(e) {
  return E(this, null, function* () {
    if (e.state !== null)
      if (w(e.state.key))
        w(e.state.rev) === !1 && e.state.rev !== e.state.key && Fe(e.state.rev), l(1, `History popState: ${e.state.key}`), n.pages[e.state.key].type = 5, V(n.pages[e.state.key]);
      else {
        e.state.type = 5;
        let t = yield A(e.state);
        if (!t)
          return location.assign(e.state.key);
        let r = S(location);
        if (t.key === r)
          V(t);
        else if (w(r))
          V(n.pages[r]);
        else {
          let o = N(I(r, 5));
          yield A(o), ce(o);
        }
      }
  });
}
function br(e) {
  if (!n.observe.history)
    return v.scrollRestoration && (v.scrollRestoration = "manual"), addEventListener("popstate", Er, !1), n.observe.history = !0, typeof e == "object" && e.type === 0 ? po(e) : e;
}
function Tr() {
  n.observe.history && (v.scrollRestoration && (v.scrollRestoration = "auto"), removeEventListener("popstate", Er, !1), n.observe.history = !1);
}

// src/app/store.ts
function N(e) {
  let t = De(e);
  return e.components = [], e.target = it(e), e.ts = de(), n.config.cache && (t("cache") || (e.cache = n.config.cache), t("uuid") || (e.uuid = te())), t("scrollY") || (e.scrollY = 0), t("scrollX") || (e.scrollX = 0), n.config.hover !== !1 && e.type === 10 && (t("threshold") || (e.threshold = n.config.hover.threshold)), n.config.proximity !== !1 && e.type === 12 && (t("proximity") || (e.proximity = n.config.proximity.distance), t("threshold") || (e.threshold = n.config.proximity.threshold)), n.config.progress && !t("progress") && (e.progress = n.config.progress.threshold), t("visits") || (e.visits = 0), n.pages[e.key] = e, n.pages[e.key];
}
function xe(e, t) {
  let r = L("before:cache", e, t), o = typeof r == "string" ? r : t;
  return e.type > 5 && e.type > 9 && (e.type = 1), e.title = ht(t), !n.config.cache || r === !1 ? e : d(e, "uuid") ? (n.pages[e.key] = e, n.snaps[e.uuid] = o, L("after:cache", e), e) : X(e, o);
}
function hr(e, t, r) {
  let { page: o, dom: s } = ve(e), i = s.body.querySelector(t);
  i && (J(i, r), n.snaps[o.uuid] = s.documentElement.outerHTML);
}
function X(e, t) {
  let r = d(n.pages, e.key) ? n.pages[e.key] : N(e);
  return e.target = it(e), e.visits = e.visits + 1, typeof t == "string" && (n.snaps[r.uuid] = t, e.title = ht(t)), R(r, e);
}
function mo(e) {
  let t = ye(n.snaps[e.uuid]);
  return le(m(), {
    page: { get: () => e },
    dom: { get: () => t }
  });
}
function ve(e) {
  if (!e) {
    if (v.state === null) {
      l(3, "Missing history state reference, page cannot be returned");
      return;
    }
    e = v.state.key;
  }
  if (d(n.pages, e))
    return mo(n.pages[e]);
  l(5, `No record exists: ${e}`);
}
function w(e) {
  return d(n.pages, e) && d(n.pages[e], "uuid") && d(n.snaps, n.pages[e].uuid) && typeof n.snaps[n.pages[e].uuid] == "string";
}
function Q(e) {
  e ? typeof e == "string" ? (delete n.snaps[n.pages[e].uuid], delete n.pages[e]) : H(e) && k((t) => {
    delete n.snaps[n.pages[t].uuid], delete n.pages[t];
  }, e) : (ft(n.pages), ft(n.snaps));
}

// src/shared/links.ts
function Re(e, t) {
  if (!(e instanceof Element))
    return !1;
  let r = e.closest(t);
  return r && r.tagName === "A" ? r : !1;
}
function Ir(e) {
  if (e.nodeName !== "A")
    return !1;
  let t = e.getAttribute("href");
  return !t || !dt(t) ? !1 : w(S(t)) === !1;
}
function tr(e, t) {
  let r = [];
  return he(e, (o) => {
    if (o.nodeName !== "A") {
      let s = o.querySelectorAll(t);
      he(s, (i) => {
        Ir(i) && r.push(i);
      });
    } else if (o.hasAttribute("href")) {
      let { href: s } = o;
      dt(s) && w(S(s)) && r.push(o);
    }
  }), r;
}
var $e = (e) => {
  let t = [];
  return he(e, (r) => {
    Ir(r) && t.push(r);
  }), t;
};

// src/observers/hrefs.ts
function uo(e) {
  return !// @ts-ignore
  (e.target && e.target.isContentEditable || e.defaultPrevented || e.which > 1 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey);
}
var D = function(e) {
  if (!uo(e))
    return;
  let t = Re(e.target, n.qs.tags.d);
  if (!t)
    return;
  let r = S(t.href);
  if (r === null)
    return;
  let o = () => {
    D.drag = !0, l(3, `Drag occurance, visit was cancelled to link: ${r}`), t.removeEventListener(`${M}move`, o);
  };
  if (t.addEventListener(`${M}move`, o, { once: !0 }), D.drag === !0)
    return D.drag = !1, D(e);
  if (t.removeEventListener(`${M}move`, o), !!L("visit", e))
    if (se(), G(), ae(), w(r)) {
      let s = ut(t, n.pages[r]), i = X(s);
      t.onclick = (a) => {
        a.preventDefault(), n.pages[i.key].ts = de(), n.pages[i.rev].scrollX = window.scrollX, n.pages[i.rev].scrollY = window.scrollY, Z(n.pages[i.rev]), ce(i), V(i);
      };
    } else if (x.transit.has(r)) {
      gt(r), l(2, `Request in transit: ${r}`);
      let s = n.pages[r];
      t.onclick = (i) => {
        i.preventDefault(), n.pages[s.key].ts = de(), n.pages[s.rev].scrollX = window.scrollX, n.pages[s.rev].scrollY = window.scrollY, Z(n.pages[s.rev]), At(s);
      };
    } else {
      gt(), Xe(r);
      let s = N(I(t, 6));
      A(s), t.onclick = (i) => {
        i.preventDefault(), n.pages[s.key].ts = de(), n.pages[s.rev].scrollX = window.scrollX, n.pages[s.rev].scrollY = window.scrollY, Z(n.pages[s.rev]), At(s);
      };
    }
};
function At(e) {
  return E(this, null, function* () {
    e.progress && oe.start(e.progress);
    let t = yield Ne(e);
    t ? (ce(t), V(t)) : location.assign(e.key);
  });
}
function Rt(e, t) {
  return E(this, null, function* () {
    if (t) {
      typeof t.cache == "string" && (t.cache === "clear" ? Q() : Q(t.key)), t.progress && oe.start(t.progress);
      let r = yield A(t);
      r ? (ce(r), V(r)) : location.assign(t.key);
    } else
      return At(n.pages[e]);
  });
}
function Pr() {
  n.observe.hrefs || (D.drag = !1, be === "mouseOnly" ? addEventListener(`${M}down`, D, !1) : (be === "touchOnly" || addEventListener(`${M}down`, D, !1), addEventListener("touchstart", D, !1)), n.observe.hrefs = !0);
}
function Nr() {
  n.observe.hrefs && (be === "mouseOnly" ? removeEventListener(`${M}down`, D, !1) : (be === "touchOnly" || removeEventListener(`${M}down`, D, !1), removeEventListener("touchstart", D, !1)), n.observe.hrefs = !1);
}

// src/app/controller.ts
function Rr() {
  let e = I(0), t = br(N(e));
  le(n, {
    page: {
      get() {
        return n.pages[v.state.key];
      }
    },
    snap: {
      get() {
        return n.snaps[n.page.uuid];
      }
    }
  }), n.index = t.key;
  let r = () => {
    let o = xe(t, document.documentElement.outerHTML);
    return Pr(), n.config.manual === !1 && (Ae(), Le(), Ce(), Me()), ke(() => {
      o.rev !== o.key && Fe(o.rev), zt(o);
    }), o;
  };
  return new Promise((o) => {
    if (document.readyState === "complete" || document.readyState === "interactive")
      return o(r());
    addEventListener("DOMContentLoaded", () => o(r()), { once: !0 });
  });
}
function $r() {
  se(), Ae(), ae(), Le(), G(), Ce();
}
function Lr() {
  Tr(), Nr(), se(), ae(), G(), n.components.registry.size > 0 && n.components.registry.clear(), Q(), n.config.globalThis && delete window.spx, l(2, "Disconnected");
}

// src/components/extends.ts
var Je = class {
  /**
   * Document Element
   *
   * Returns the `<html>` documentElement
   */
  get html() {
    return this.dom.closest("html");
  }
  /**
   * Constructor
   *
   * Creates the component instance
   */
  constructor({ state: t, instanceOf: r }, o, s) {
    if (this.dom = o, s.state !== null) {
      let i = n.config.schema + r;
      this.state = new Proxy(m(), {
        set: (c, f, p) => {
          let g = s.state[f];
          typeof g == "object" && d(g, "persist") && g.persist ? c[f] = t[f] = p : c[f] = p;
          let h = typeof p == "object" || H(p) ? JSON.stringify(p) : p;
          if (this.dom.setAttribute(`${i}:${f}`, h), d(this, `${f}StateNodes`))
            for (let b of this[`${f}StateNodes`])
              b.innerText = h;
          return !0;
        }
      });
      let a = ee(this.state);
      for (let c in s.state) {
        let f = s.state[c], p = this.dom.hasAttribute(`${i}:${c}`);
        a(`has${Yt(c)}`, p);
        let g, h, b = !1;
        typeof f == "object" ? (h = p ? t[c] : f.default, g = f.typeof, b = typeof h == "object" || H(h)) : (h = p ? t[c] : void 0, g = f), typeof h == "string" && h.startsWith("window.") ? this.state[c] = t[c] = window[h.slice(7)] : g === String ? this.state[c] = t[c] = h || P : g === Boolean ? this.state[c] = t[c] = h === "true" : g === Number ? this.state[c] = t[c] = Number(h) || 0 : g === Array ? this.state[c] = t[c] = h === void 0 ? [] : b ? h : me(c, h) : g === Object && (this.state[c] = t[c] = h === void 0 ? {} : b ? h : me(c, h));
      }
    }
  }
};

// src/index.ts
function Si() {
}
var wr = !!(tt && window.history.pushState && window.requestAnimationFrame && window.addEventListener && window.DOMParser && window.Proxy), Mr = m({
  Component: Je,
  supported: wr,
  on: Ut,
  off: _t,
  observe: $r,
  connect: ho,
  capture: bo,
  form: Io,
  render: Eo,
  session: go,
  state: yo,
  reload: xo,
  fetch: vo,
  clear: Q,
  hydrate: Po,
  prefetch: To,
  visit: No,
  disconnect: Lr,
  register: We,
  history: m({
    get state() {
      return v.state;
    },
    api: v,
    push: ce,
    replace: Z,
    has: Nt,
    reverse: vr
  }),
  get config() {
    return n.config;
  }
});
function ho(e = {}, ...t) {
  if (tt === !1)
    return l(5, "Invalid runtime environment: window is undefined.");
  if (!wr)
    return l(5, "Browser does not support SPX");
  if (!window.location.protocol.startsWith("http"))
    return l(5, "Invalid protocol, SPX expects HTTPS or HTTP protocol");
  lt(e), n.config.globalThis && d(window, "spx") === !1 && ee(window, "spx", Mr);
  let r = Rr();
  return function(o) {
    return E(this, null, function* () {
      let s = yield r;
      if (o.constructor.name === "AsyncFunction")
        try {
          yield o(s);
        } catch (i) {
          l(3, "Connection Error", i);
        }
      else
        o(s);
      l(2, "Connection Established \u26A1");
    });
  };
}
function go(e, t) {
  if (e)
    if (t)
      e === "config" && lt(t), e === "observe" && R(n.observe, t);
    else {
      if (e === "config")
        return n.config;
      if (e === "observe")
        return n.observe;
      if (e === "components")
        return n.components;
      if (e === "pages")
        return n.pages;
      if (e === "snaps")
        return n.snaps;
      if (e === "memory")
        return at(n.memory.bytes);
    }
  return {
    config: n.config,
    snaps: n.snaps,
    pages: n.pages,
    observers: n.observe,
    components: n.components,
    get memory() {
      let r = n.memory;
      return r.size = at(r.bytes), r;
    }
  };
}
function yo(e, t) {
  if (e === void 0)
    return ve();
  if (typeof e == "string") {
    let r = S(e);
    w(r) || l(5, `No store exists at: ${r}`);
    let o = ve(r);
    return t !== void 0 ? X(R(o.page, t)) : o;
  }
  if (typeof e == "object")
    return X(e);
}
function xo() {
  return E(this, null, function* () {
    let e = n.pages[v.state.key];
    e.type = 9;
    let t = yield A(e);
    return t ? (l(2, "Triggered reload, page was re-cached"), V(t)) : (l(3, "Reload failed, triggering refresh (cache will purge)"), location.assign(e.key));
  });
}
function vo(e) {
  return E(this, null, function* () {
    let t = I(e, 2);
    t.location.origin !== re && l(5, "Cross origin fetches are not allowed");
    let r = yield Pe(t.key);
    if (r)
      return r;
  });
}
function Eo(e, t, r) {
  return E(this, null, function* () {
    let o = n.page, s = I(e);
    s.location.origin !== re && l(5, "Cross origin fetches are not allowed");
    let i = yield Pe(s.key, { type: "document" });
    if (i || l(5, `Fetch failed for: ${s.key}`, i), yield r.call(o, i), t === "replace") {
      o.title = i.title;
      let a = X(R(o, s), i.documentElement.outerHTML);
      return Z(a), a;
    } else
      return V(xe(s, i.documentElement.outerHTML));
  });
}
function bo(e) {
  let t = ve();
  if (!t)
    return;
  let { page: r, dom: o } = t;
  if (e = H(e) ? e : r.target, e.length === 1 && e[0] === "body") {
    o.body.replaceChildren(document.body), X(r, o.documentElement.innerHTML);
    return;
  }
  let s = e.join(","), i = $().querySelectorAll(s), a = o.body.querySelectorAll(s);
  he(a, (c, f) => {
    J(c, i[f]);
  }), X(r, o.documentElement.innerHTML);
}
function To(e) {
  return E(this, null, function* () {
    let t = I(e, 1);
    if (w(t.key)) {
      l(3, `Cache already exists for ${t.key}, prefetch skipped`);
      return;
    }
    let r = yield A(N(t));
    if (r)
      return r;
    l(5, `Prefetch failed for ${t.key}`);
  });
}
function Io(e, t) {
  return E(this, null, function* () {
    let r = new FormData();
    for (let s in t.data)
      r.append(s, t.data[s]);
    return yield Pe(e, {
      method: t.method,
      body: r
    });
  });
}
function Po(e, t) {
  return E(this, null, function* () {
    let r = I(e, 7);
    if (A(r), H(t)) {
      r.hydrate = [], r.preserve = [];
      for (let s of t)
        s.charCodeAt(0) === 33 ? r.preserve.push(s.slice(1)) : r.hydrate.push(s);
    } else
      r.hydrate = n.config.fragments;
    let o = yield Ne(r);
    if (o) {
      let { key: s } = v.state;
      if (Z(o), V(o), r.key !== s) {
        n.index === s && (n.index = r.key);
        for (let i in n.pages)
          n.pages[i].rev === s && (n.pages[i].rev = r.key);
        Q(s);
      }
    }
    return ve(o.key).dom;
  });
}
function No(e, t) {
  return E(this, null, function* () {
    let r = I(e), o = typeof t == "object" ? R(r, t) : r;
    return w(r.key) ? Rt(r.key, X(o)) : Rt(r.key, N(o));
  });
}
var qi = Mr;

export { Si as Decorator, qi as default };
