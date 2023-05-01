import { IConfig, IPage } from 'types';
import { log, size } from './shared/utils';
import { config, snapshots, pages, observers, memory } from './app/session';
import { configure } from './app/config';
import { getRoute, getKey } from './app/location';
import { parse } from './shared/dom';
import { Errors, EventType } from './shared/enums';
import { assign, isArray, object, origin } from './shared/native';
import { initialize, disconnect, observe } from './app/controller';
import { clear } from './app/store';
import * as store from './app/store';
import * as hrefs from './observers/hrefs';
import * as request from './app/fetch';
import * as render from './app/render';
import * as history from './observers/history';
import { on, off } from './app/events';
import morphdom from 'morphdom';

/**
 * Supported
 */
export const supported = !!(
  window.history.pushState &&
  window.requestAnimationFrame &&
  window.addEventListener &&
  window.DOMParser
);

/**
 * Connect SPX
 */
export function connect (options: IConfig = {}) {

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

    if (callback.constructor.name === 'AsyncFunction') {
      try {
        await callback(state);
      } catch (e) {
        log(Errors.TYPE, 'Connection Established ⚡');
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
    return render.update(page);
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

  const response = await request.request(link.key);

  if (response) return parse(response);

}

export function capture (targets?: string[]) {

  const { page, dom } = store.get();

  targets = isArray(targets) ? targets : page.target;

  if (targets.length === 1 && targets[0] === 'body') return dom.body.replaceWith(document.body);

  const selector = targets.join(',');
  const current = document.body.querySelectorAll<HTMLElement>(selector);

  dom.body.querySelectorAll<HTMLElement>(selector).forEach((node, i) => {
    if (!node.matches(targets[i])) return;
    morphdom(node, current[i], { onBeforeElUpdated: (from, to) => !from.isEqualNode(to) });
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
export async function hydrate (link: string, nodes?: string[]): Promise<void|IPage> {

  const route = getRoute(link, EventType.HYDRATE);

  request.fetch(route);

  if (nodes) route.hydrate = nodes;

  const page = await request.wait(route);

  if (page) {

    const { key } = history.api.state;

    history.replace(page);
    render.update(page);

    if (route.key !== key) {
      if (config.index === key) config.index = route.key;
      for (const p in pages) if (pages[p].rev === key) pages[p].rev = route.key;
      store.clear(key);
    }

  }

  return page;

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

export default {
  supported,
  on,
  off,
  observe,
  connect,
  capture,
  session,
  state,
  reload,
  fetch,
  clear,
  hydrate,
  prefetch,
  visit,
  disconnect
};
