import { IConfig, IPage } from 'types';
import { log, size } from './shared/utils';
import { config, snapshots, pages, observers, memory } from './app/session';
import { configure } from './app/config';
import { getRoute, getKey } from './app/location';
import { Errors, EventType } from './shared/enums';
import { assign, isArray, object, origin } from './shared/native';
import { initialize, disconnect, observe } from './app/controller';
import { clear } from './app/store';
import * as store from './app/store';
import * as hrefs from './observers/hrefs';
import * as request from './app/fetch';
import * as renderer from './app/render';
import * as history from './observers/history';
import { on, off } from './app/events';
import { morph } from './morph/morph';

/**
 * Supported
 */
export const supported = !!(
  window.history.pushState &&
  window.requestAnimationFrame &&
  window.addEventListener &&
  window.DOMParser
);

const spx = assign(object(null), {
  supported,
  on,
  off,
  observe,
  history,
  connect,
  capture,
  render,
  session,
  state,
  reload,
  fetch,
  clear,
  hydrate,
  prefetch,
  visit,
  disconnect,
  get config () { return config; }
});

/**
 * Connect SPX
 */
export function connect (options: IConfig = {}) {

  if (typeof document === 'undefined') {
    return log(Errors.ERROR, 'SPX only runs in the browser');
  }

  if (!supported) {
    return log(Errors.ERROR, 'Browser does not support SPX');
  }

  if (!window.location.protocol.startsWith('http')) {
    return log(Errors.ERROR, 'Invalid protocol, SPX expects https or http protocol');
  }

  configure(options);

  const promise = initialize();

  return async function (callback: any) {

    const state = (await promise);

    if (config.globalThis) {
      Object.defineProperty(window, 'spx', { get () { return spx; } });
    }

    if (callback.constructor.name === 'AsyncFunction') {
      try {
        await callback(state);
      } catch (e) {
        log(Errors.WARN, 'Connection Error', e);
      }
    } else {
      callback(state);
    }

    log(Errors.INFO, 'Connection Established ⚡');

  };

};

/**
 * Session
 *
 * Returns the current SPX session
 */
export function session (key?: string, update?: object) {

  if (key) {
    if (update) {
      if (key === 'config') configure(update);
      if (key === 'observers') assign(observers, update);
    } else {
      if (key === 'config') return config;
      if (key === 'observers') return observers;
      if (key === 'pages') return pages;
      if (key === 'snapshots') return snapshots;
      if (key === 'memory') return size(memory.bytes);
    }
  }

  const state = object(null);

  state.config = config;
  state.snapshots = snapshots;
  state.pages = pages;
  state.observers = observers;
  state.memory = memory;
  state.memory.size = size(state.memory.bytes);

  return state;

}

/**
 * State Record
 *
 * Returns page state
 */
export function state (key?: string | object, update?: object) {

  if (key === undefined) return store.get();

  if (typeof key === 'string') {

    const k = getKey(key);

    if (!store.has(k)) log(Errors.ERROR, `No store exists at: ${k}`);

    const record = store.get(k);

    return update !== undefined
      ? store.update(assign(record.page, update))
      : record;
  }

  if (typeof key === 'object') return store.update(key as IPage);

};

/**
 * Reload
 *
 * Reloads the current page
 */
export async function reload () {

  const state = pages[history.api.state.key];
  state.type = EventType.RELOAD;
  const page = await request.fetch(state);

  if (page) {
    log(Errors.INFO, 'Triggered reload, page was re-cached');
    return renderer.update(page);
  }

  log(Errors.WARN, 'Reload failed, triggering refresh (cache will be purged)');

  return location.assign(state.key);

};

/**
 * Fetch
 */
export async function fetch (url: string) {

  const link = getRoute(url, EventType.FETCH);

  if (link.location.origin !== origin) {
    log(Errors.ERROR, 'Cross origin fetches are not allowed');
  }

  const dom = await request.request<Document>(link.key);

  if (dom) return dom;

}

export async function render (url: string, pushState: 'intersect' | 'replace' | 'push', fn: (
  this: IPage,
  dom: Document,
) => Document) {

  const page = store.current();
  const route = getRoute(url);

  if (route.location.origin !== origin) log(Errors.ERROR, 'Cross origin fetches are not allowed');

  const dom = await request.request<Document>(route.key, 'document');

  if (!dom) log(Errors.ERROR, `Fetch failed for: ${route.key}`, dom);

  await fn.call(page, dom) as Document;

  if (pushState === 'replace') {

    page.title = dom.title;
    const state = store.update(assign(page, route), dom.documentElement.outerHTML);

    history.replace(state);

    return state;

  } else {

    return renderer.update(store.set(route, dom.documentElement.outerHTML));

  }

}

export function capture (targets?: string[]) {

  const { page, dom } = store.get();

  targets = isArray(targets) ? targets : page.target;

  if (targets.length === 1 && targets[0] === 'body') {
    dom.body.replaceChildren(document.body);
    store.update(page, dom.documentElement.innerHTML);
    return
  }

  const selector = targets.join(',');
  const current = document.body.querySelectorAll<HTMLElement>(selector);

  dom.body.querySelectorAll<HTMLElement>(selector).forEach((node, i) => {
    morph(node, current[i])
  });

  store.update(page, dom.documentElement.innerHTML);

}

/**
 * Prefetch
 */
export async function prefetch (link: string): Promise<void|IPage> {

  const path = getRoute(link, EventType.PREFETCH);

  if (store.has(path.key)) {
    log(Errors.WARN, `Cache already exists for ${path.key}, prefetch skipped`);
    return;
  }

  const prefetch = await request.fetch(store.create(path));
  if (prefetch) return prefetch;

  log(Errors.ERROR, `Prefetch failed for ${path.key}`);

};

/**
 * Hydrate the current document
 */
export async function hydrate (link: string, nodes?: string[]): Promise<Document> {

  const route = getRoute(link, EventType.HYDRATE);

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
    route.hydrate = config.targets;
  }

  const page = await request.wait(route);

  if (page) {

    const { key } = history.api.state;

    history.replace(page);
    renderer.update(page);

    if (route.key !== key) {
      if (config.index === key) config.index = route.key;
      for (const p in pages) if (pages[p].rev === key) pages[p].rev = route.key;
      store.clear(key);
    }

  }

  return store.get(page.key).dom;

};

/**
 * Visit
 */
export async function visit (link: string, options?: IPage): Promise<void|IPage> {

  const route = getRoute(link);
  const merge = typeof options === 'object' ? assign(route, options) : route;

  return store.has(route.key)
    ? hrefs.navigate(route.key, store.update(merge))
    : hrefs.navigate(route.key, store.create(merge));

};

export default spx;
