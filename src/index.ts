import type { Config, Page, LiteralUnion, Class } from 'types';
import { $ } from './app/session';
import { defineGetter, forEach, forNode, size, takeSnapshot } from './shared/utils';
import { configure } from './app/config';
import { getRoute } from './app/location';
import { VisitType } from './shared/enums';
import { b, isBrowser, o, origin } from './shared/native';
import { initialize, disconnect } from './app/controller';
import { clear } from './app/queries';
import { on, off } from './app/events';
import { morph } from './morph/morph';
import { Component } from './components/class';
import { registerComponents, getComponentId } from './components/register';
import * as q from './app/queries';
import * as hrefs from './observe/hrefs';
import * as request from './app/fetch';
import * as renderer from './app/render';
import * as history from './observe/history';
import * as components from './observe/components';
import * as log from './shared/logs';

/**
 * Connect SPX
 */
export default function spx (options: Config = {}) {

  if (!isBrowser) {
    return log.error('Invalid runtime environment: window is undefined.');
  }

  if (!spx.supported) {
    return log.error('Browser does not support SPX');
  }

  if (!window.location.protocol.startsWith('http')) {
    return log.error('Invalid protocol, SPX expects HTTPS or HTTP protocol');
  }

  configure(options);

  if ($.config.globalThis && window && !('spx' in window)) {
    defineGetter(window, 'spx', spx);
  }

  const promise = initialize();

  return async function (callback: any) {

    const state = await promise;

    if (callback.constructor.name === 'AsyncFunction') {
      try {
        await callback(state);
      } catch (e) {
        console.error(e);
        log.error('Connection Error', e);
      }
    } else {
      callback(state);
    }

    log.info('Connection Established');

  };

};

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
spx.fetch = fetch;
spx.clear = clear;
spx.hydrate = hydrate;
spx.prefetch = prefetch;
spx.route = route;
spx.disconnect = disconnect;
spx.register = register;
spx.dom = dom;
spx.supported = supported();

Object.defineProperties(spx, {
  $: { get: () => $ },
  history: {
    value: {
      get state () { return $.history; },
      api: history.api,
      push: history.push,
      replace: history.replace,
      has: history.has,
      reverse: history.reverse
    }
  }
});

function supported () {

  return !!(isBrowser &&
    window.history.pushState &&
    window.requestAnimationFrame &&
    window.DOMParser &&
    window.Proxy
  );
}

function live (identifers: string | string[] = null, ...rest: string[]) {

  const ids = identifers ? [ identifers, ...rest ].flat() : null;
  const mounted = {};

  for (const { scope: { alias, instanceOf } } of $.instances.values()) {

    const id = ids ? (ids.includes(alias)
      ? alias
      : ids.includes(instanceOf) ? instanceOf : null) : null;

    mounted[id || (!ids && (alias || instanceOf))] = Array.isArray(mounted[id || (!ids && instanceOf)])
      ? [ ...mounted[id || (!ids && instanceOf)], component ]
      : component;

  }

  return mounted;

}

function component (identifer: string, callback?: (instance: any) => any) {

  const instances: Class[] = [];

  for (const instance of instances.values()) {

    const { scope } = instance;

    if (
      scope.instanceOf === identifer ||
      scope.alias === identifer) {

      instances.push(instance);

    }
  }

  return callback ? forEach(callback, instances) : instances[0];

}

function register (...classes: any[]) {

  if (typeof classes[0] === 'string') {

    if (classes.length > 2) {
      log.error(`Named component registration expects 2 parameters, recieved ${classes.length}.`, classes);
    }

    registerComponents({ [components[0]]: classes[1] });

  } else {

    for (const component of classes) {
      if (Array.isArray(component)) {
        for (const item of component) {
          if (typeof item[0] === 'string') {
            registerComponents({ [item[0]]: item[1] });
          } else if (typeof item === 'function') {
            registerComponents({ [getComponentId(item)]: item }, true);
          }
        }
      } else {

        if (typeof component === 'function') {
          registerComponents({ [getComponentId(component)]: component }, true);
        } else if (typeof component === 'object') {
          registerComponents(component);
        }
      }
    }
  }

  components.connect();

}

/**
 * Session
 *
 * Returns the current SPX session
 */
function session () {

  return [
    'config',
    'snaps',
    'pages',
    'observers',
    'fragments',
    'instances',
    'mounted',
    'registry',
    'reference',
    'memory'
  ].reduceRight((
    target,
    prop
  ) => Object.defineProperty(target, prop, {
    get: prop === 'memory' ? () => ($[prop].size = size($[prop].bytes)) : () => $[prop],
    enumerable: false,
    configurable: false
  }), o());

}

// function global (model?: { [key: string]: any }) {

//   if (isEmpty($.global)) {
//     if (model) {
//       assign($.global, model);
//       if ($.logLevel === LogLevel.INFO) {
//         log(Log.INFO, 'Global has been defined');
//       } else if ($.logLevel === LogLevel.VERBOSE) {
//         log(Log.VERBOSE, 'Global has been defined: ', $.global);
//       }
//     }
//   } else {
//     if (model) {
//       log(Log.WARN, 'You cannot re-define global data within an SPX session');
//     }
//   }

//   return $.global;

// }

/**
 * Reload
 *
 * Reloads the current page
 */
async function reload () {

  $.page.type = VisitType.RELOAD;
  const page = await request.fetch($.page);

  if (page) {
    log.info('Triggered reload, page was re-cached');
    return renderer.update(page);
  }

  log.warn('Reload failed, triggering refresh (cache will purge)');

  return location.assign($.page.key);

};

/**
 * Fetch
 */
async function fetch (url: string) {

  const link = getRoute(url, VisitType.FETCH);

  if (link.location.origin !== origin) {
    log.error('Cross origin fetches are not allowed');
    return;
  }

  const dom = await request.http<Document>(link.key);

  if (dom) return dom;

}

/**
 * DOM Literal
 *
 * Generates a DOM from string literal. Returns either
 * an array list of elements or element, depending on
 * the provided literal structure.
 */
function dom (strings: TemplateStringsArray, ...values: Array<string>) {

  // Perform interpolation
  let result = strings[0];

  for (let i = 0, s = values.length; i < s; i++) result += values[i] + strings[i + 1];

  const raw: string = result;
  const dom: HTMLElement = document.createElement('div');

  dom.innerHTML = raw;

  const len: number = dom.children.length;

  if (len === 0) return null;
  if (len === 1) return defineGetter(dom.children[0], 'raw', raw);

  const arr: Element[] = defineGetter([], 'raw', raw);

  while (dom.firstChild) {
    const child = dom.firstElementChild;
    child && arr.push(child);
    dom.removeChild(dom.firstChild); // Remove the child after pushing to avoid infinite loop
  }

};

async function render (url: string, pushState: 'intersect' | 'replace' | 'push', fn: (
  this: Page,
  dom: Document,
) => Document) {

  const page = $.page;
  const route = getRoute(url);

  if (route.location.origin !== origin) log.error('Cross origin fetches are not allowed');

  const dom = await request.http<Document>(route.key, { type: 'document' });

  if (!dom) log.error(`Fetch failed for: ${route.key}`, dom);

  await fn.call(page, dom) as Document;

  if (pushState === 'replace') {

    page.title = dom.title;
    const state = q.update(Object.assign(page, route), takeSnapshot(dom));

    history.replace(state);

    return state;

  } else {

    return renderer.update(q.set(route, takeSnapshot(dom)));

  }

}

function capture (targets?: string[]) {

  const page = q.getPage();

  if (!page) return;

  const dom = q.getSnapDom();

  targets = Array.isArray(targets) ? targets : page.target;

  if (targets.length === 1 && targets[0] === 'body') {
    morph(dom.body, b());
    q.update(page, takeSnapshot(dom));
    return;
  }

  const selector = targets.join(',');
  const current = b().querySelectorAll<HTMLElement>(selector);

  forNode(dom.body.querySelectorAll<HTMLElement>(selector), (node, i) => {
    morph(node, current[i]);
  });

  q.update(page, takeSnapshot(dom));

}

/**
 * Prefetch
 */
async function prefetch (link: string): Promise<void|Page> {

  const path = getRoute(link, VisitType.PREFETCH);

  if (q.has(path.key)) {
    log.warn(`Cache already exists for ${path.key}, prefetch skipped`);
    return;
  }

  const prefetch = await request.fetch(q.create(path));
  if (prefetch) return prefetch;

  log.error(`Prefetch failed for ${path.key}`);

};

async function form (action: string, options: {
  method: LiteralUnion<'POST' | 'PUT' | 'DELETE' | 'GET', string>,
  data: { [key: string]: string };
  hydrate?: string[]
}) {

  const body = new FormData();

  for (const key in options.data) {
    body.append(key, options.data[key]);
  }

  const submit = await request.http(action, {
    method: options.method,
    body
  });

  return submit;

}

/**
 * Hydrate the current document
 */
async function hydrate (link: string, nodes?: string[]): Promise<Document> {

  const route = getRoute(link, VisitType.HYDRATE);

  request.fetch(route);

  if (Array.isArray(nodes)) {

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

  const page = await request.wait(route);

  if (page) {

    const { key } = $.history;

    history.replace(page);
    renderer.update(page);

    if (route.key !== key) {

      if ($.index === key) $.index = route.key;

      for (const p in $.pages) {
        if ($.pages[p].rev === key) {
          $.pages[p].rev = route.key;
        }
      }

      q.clear(key);
    }

  }

  return q.getSnapDom(page.key);

};

/**
 * Visit
 */
async function route (uri: string, options?: Page): Promise<void|Page> {

  const goto = getRoute(uri);
  const merge = typeof options === 'object' ? Object.assign(goto, options) : goto;

  return q.has(goto.key)
    ? hrefs.navigate(goto.key, q.update(merge))
    : hrefs.navigate(goto.key, q.create(merge));

};
