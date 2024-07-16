import type { Config, Page, LiteralUnion } from 'types';
import { $ } from './app/session';
import { log } from './shared/logs';
import { defineGetter, forNode, hasProp, size } from './shared/utils';
import { configure } from './app/config';
import { getRoute } from './app/location';
import { LogType, VisitType } from './shared/enums';
import { assign, d, defineProps, isArray, isBrowser, o, origin } from './shared/native';
import { initialize, disconnect } from './app/controller';
import { clear } from './app/queries';
import { on, off, emit } from './app/events';
import { morph } from './morph/morph';
import { Component } from './components/extends';
import { registerComponents, getComponentId } from './components/register';
import { takeSnapshot } from './shared/dom';
import * as q from './app/queries';
import * as hrefs from './observe/hrefs';
import * as request from './app/fetch';
import * as renderer from './app/render';
import * as history from './observe/history';
import * as components from './observe/components';

const spx = o({
  get $ () { return $; },
  Component,
  on,
  off,
  connect,
  component,
  capture,
  form,
  render,
  session,
  reload,
  fetch,
  clear,
  hydrate,
  prefetch,
  visit,
  disconnect,
  register,
  get config () { return $.config; },
  supported: !!(
    isBrowser &&
    window.history.pushState &&
    window.requestAnimationFrame &&
    window.DOMParser &&
    window.Proxy
  ),
  history: o({
    get state () { return $.history; },
    api: history.api,
    push: history.push,
    replace: history.replace,
    has: history.has,
    reverse: history.reverse
  })
});

/**
 * Connect SPX
 */
function connect (options: Config = {}) {

  if (isBrowser === false) {
    return log(LogType.ERROR, 'Invalid runtime environment: window is undefined.');
  }

  if (!spx.supported) {
    return log(LogType.ERROR, 'Browser does not support SPX');
  }

  if (!window.location.protocol.startsWith('http')) {
    return log(LogType.ERROR, 'Invalid protocol, SPX expects HTTPS or HTTP protocol');
  }

  configure(options);

  if ($.config.globalThis && hasProp(window, 'spx') === false) {
    defineGetter(window, 'spx', spx);
  }

  const promise = initialize();

  return async function (callback: any) {

    const state = (await promise);

    if (callback.constructor.name === 'AsyncFunction') {
      try {
        await callback(state);
      } catch (e) {
        log(LogType.WARN, 'Connection Error', e);
      }
    } else {
      callback(state);
    }

    log(LogType.INFO, 'Connection Established');

  };

};

function component (identifer: string) {

  const mounts = q.mounted();

  return mounts[identifer][0];

}

function register (...classes: any[]) {

  if (typeof classes[0] === 'string') {

    if (classes.length > 2) {
      log(LogType.ERROR, [
        `Named component registration expects 2 parameters, recieved ${classes.length}.`,
        'Registry should follow this structure: spx.register("identifer", YourComponent)'
      ], classes);
    }

    registerComponents({ [components[0]]: classes[1] });

  } else {

    for (const component of classes) {
      if (isArray(component)) {
        for (const item of component) {
          if (typeof item[0] === 'string') {
            registerComponents({ [item[0]]: item[1] });
          } else if (typeof item === 'function') {
            registerComponents({ [getComponentId(item)]: item }, true);
          }
        }
      } else {
        const type = typeof component;
        if (type === 'function') {
          registerComponents({ [getComponentId(component)]: component }, true);
        } else if (type === 'object') {
          registerComponents(component);
        }
      }
    }
  }

  if (!$.ready) {
    on('x', function run () {
      components.connect();
      off('x', run);
      emit('connected');
    });
  } else {
    components.connect();
  }

}

/**
 * Session
 *
 * Returns the current SPX session
 */
function session () {

  return defineProps(o(), {
    config: { get: () => $.config },
    snaps: { get: () => $.snaps },
    pages: { get: () => $.pages },
    observers: { get: () => $.observe },
    components: { get: () => $.components },
    fragments: { get: () => $.fragments },
    memory: {
      get () {
        const memory = $.memory;
        memory.size = size(memory.bytes);
        return memory;
      }
    }
  });

}

// function global (model?: { [key: string]: any }) {

//   if (isEmpty($.global)) {
//     if (model) {
//       assign($.global, model);
//       if ($.logLevel === LogLevel.INFO) {
//         log(LogType.INFO, 'Global has been defined');
//       } else if ($.logLevel === LogLevel.VERBOSE) {
//         log(LogType.VERBOSE, 'Global has been defined: ', $.global);
//       }
//     }
//   } else {
//     if (model) {
//       log(LogType.WARN, 'You cannot re-define global data within an SPX session');
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
    log(LogType.INFO, 'Triggered reload, page was re-cached');
    return renderer.update(page);
  }

  log(LogType.WARN, 'Reload failed, triggering refresh (cache will purge)');

  return location.assign($.page.key);

};

/**
 * Fetch
 */
async function fetch (url: string) {

  const link = getRoute(url, VisitType.FETCH);

  if (link.location.origin !== origin) {
    log(LogType.ERROR, 'Cross origin fetches are not allowed');
  }

  const dom = await request.request<Document>(link.key);

  if (dom) return dom;

}

async function render (url: string, pushState: 'intersect' | 'replace' | 'push', fn: (
  this: Page,
  dom: Document,
) => Document) {

  const page = $.page;
  const route = getRoute(url);

  if (route.location.origin !== origin) log(LogType.ERROR, 'Cross origin fetches are not allowed');

  const dom = await request.request<Document>(route.key, { type: 'document' });

  if (!dom) log(LogType.ERROR, `Fetch failed for: ${route.key}`, dom);

  await fn.call(page, dom) as Document;

  if (pushState === 'replace') {

    page.title = dom.title;
    const state = q.update(assign(page, route), takeSnapshot(dom));

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

  targets = isArray(targets) ? targets : page.target;

  if (targets.length === 1 && targets[0] === 'body') {
    morph(dom.body, d());
    q.update(page, takeSnapshot(dom));
    return;
  }

  const selector = targets.join(',');
  const current = d().querySelectorAll<HTMLElement>(selector);

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
    log(LogType.WARN, `Cache already exists for ${path.key}, prefetch skipped`);
    return;
  }

  const prefetch = await request.fetch(q.create(path));
  if (prefetch) return prefetch;

  log(LogType.ERROR, `Prefetch failed for ${path.key}`);

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

  const submit = await request.request(action, {
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
async function visit (link: string, options?: Page): Promise<void|Page> {

  const route = getRoute(link);
  const merge = typeof options === 'object' ? assign(route, options) : route;

  return q.has(route.key)
    ? hrefs.navigate(route.key, q.update(merge))
    : hrefs.navigate(route.key, q.create(merge));

};

export default spx;
