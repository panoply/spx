import { IConfig, IPage } from 'types';
import { config, snapshots, pages, observers, memory } from './app/session';
import { log, position, size } from './shared/utils';
import { configure } from './app/config';
import { getRoute, getKey } from './app/location';
import { parse } from './shared/dom';
import { Errors, EventType } from './shared/enums';
import { assign, history, object, origin } from './shared/native';
import { initialize, disconnect } from './app/controller';
import * as store from './app/store';
import * as hrefs from './observers/hrefs';
import * as request from './app/fetch';
import * as render from './app/render';
import { on, off } from './app/events';

/**
 * RE-Exports
 */
export { on, off } from './app/events';
export { disconnect } from './app/controller';

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

  return async function (callback: (state?: IPage) => void) {

    const state = (await promise);

    callback(state);

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
export async function state (key?: string | object, update?: object) {

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
export async function reload (options?: Omit<IPage, 'key' | 'location'>) {

  const state = pages[history.state.key] as IPage;

  if (options) assign(state, options);

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
 * Flush Cache
 */
export async function fetch (url: string) {

  const link = getRoute(url, EventType.FETCH);

  if (link.location.origin !== origin) {
    log(Errors.ERROR, 'Cross origin fetches are not allowed');
  }

  const response = await request.request(link.key);

  if (response) return parse(response);

}

/**
 * Flush Cache
 */
export function clear (url?: string) {

  return store.clear(url);

}

export async function update (elements: string[]) {

}

/**
 * Hydrate the current document
 */
export async function hydrate (link: string, elements: string[]): Promise<void|IPage> {

  const route = getRoute(EventType.HYDRATE);

  route.position = position();
  route.hydrate = elements;

  const dom = await request.request(link);

  if (!dom) return log(Errors.WARN, 'Hydration fetch failed');

  const page = store.has(route.key)
    ? store.update(route, dom)
    : store.create(route);

  setTimeout(() => request.reverse(route.rev));

  return render.update(page);

};

/**
 * Visit
 */
export async function prefetch (link: string | Element): Promise<void|IPage> {

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
 * Visit
 */
export async function visit (link: string | Element, options?: IPage): Promise<void|IPage> {

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
  connect,
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
