import { Protocol } from './constants/regexp';
import { nanoid } from 'nanoid';
import * as store from './app/store';
import * as hrefs from './observers/hrefs';
import * as request from './app/request';
import * as controller from './app/controller';
import * as render from './app/render';
import * as scroll from './observers/scroll';
import { getRoute, origin } from './app/route';
import { snaps, pages, config } from './app/state';
import { IPage } from './types/page';
import { IConfig } from 'types';
import { assign } from './constants/native';

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
 * Connect Pjax
 */
export function connect (options: IConfig = {}) {

  store.initialize(options);

  if (supported) {
    if (Protocol.test(window.location.protocol)) {
      addEventListener('DOMContentLoaded', controller.initialize);
    } else {
      console.error('Pjax: Invalid protocol, pjax expects https or http protocol');
    }
  } else {
    console.error('Pjax is not supported by this browser');
  }

};

/**
 * Reload
 *
 * Reloads the current page
 */
export async function reload () {

  const state = store.cache('page') as IPage;
  const page = await request.get(state);

  if (page) {
    console.info('Pjax: Triggered reload, page was re-cached');
    return render.update(page);
  }

  console.warn('Pjax: Reload failed, triggering refresh (cache will be purged)');

  return location.assign(state.key);

};

/**
 * Cache
 */
export function cache (key?: string) {

  if (key) {
    if (key in pages) return store.get(key);
    else console.error(`Pjax: No store exists for ${key}`);
  }

  return ({
    get state () { return pages; },
    get snapshots () { return snaps; },
    get size () { return request.cacheSize(); }
  });

}

/**
 * Flush Cache
 */
export async function fetch (url: string, { parsed = false } = { parsed: false }) {

  const link = getRoute(url);

  if (link.location.origin !== origin) {
    return console.error('Pjax: Cross origin fetches are not allowed');
  }

  const response = await request.httpRequest(link.key);

  if (response) return parsed ? render.parse(response) : response;

}

/**
 * UUID Generator
 */
export function uuid (size: number = 12) {

  return nanoid(size);

}

/**
 * Flush Cache
 */
export function clear (url?: string) {

  return store.clear(url);

}

/**
 * Hydrate the current document
 */
export async function hydrate (
  link: string,
  elements: string[]
): Promise<void|IPage> {

  const state = getRoute();
  const last = store.get(state.key);

  state.hydrate = elements;
  state.position = scroll.position();
  state.type = 'hydrate';

  const dom = await request.httpRequest(link);

  if (!dom) return console.warn('Pjax: hydration failed');

  const update = render.update(store.update(state, dom));

  if (config.reverse) {
    const route = getRoute(last.page.location.lastpath, 'preload');
    request.get(route);
  }

  return update;

};

/**
 * Visit
 */
export async function prefetch (link: string | Element): Promise<void|IPage> {

  const path = getRoute(link);

  if (store.has(path.key)) {
    console.warn(`Pjax: Cache already exists for ${path.key}, pre-fetch was skipped`);
    return;
  }

  const prefetch = await request.prefetch(store.create(path));

  if (!prefetch) {
    console.warn(`Pjax: Pre-fetch failed for ${path.key}`);
  }

};

/**
 * Visit
 */
export async function visit (link: string | Element, state?: IPage): Promise<void|IPage> {

  const route = getRoute(link);

  if (typeof state === 'object') {

    const merge = assign(route, state);

    return store.has(route.key)
      ? hrefs.navigate(route.key, store.update(merge))
      : hrefs.navigate(route.key, store.create(merge));

  }

  return store.has(route.key)
    ? hrefs.navigate(route.key, store.update(route))
    : hrefs.navigate(route.key, store.create(route));

};

/**
 * Disconnect
 */
export function disconnect () {

  controller.destroy();

}
