import { IPage } from '../types/page';
import { emit } from './events';
import { forEach, log } from '../shared/utils';
import * as progress from './progress';
import { getRoute } from './route';
import { config, memory } from './session';
import * as store from './store';
import { isArray, object } from '../shared/native';
import { Errors, EventType } from '../shared/enums';

/**
 * Request Transits
 *
 * This object holds the XHR requests in transit. The object
 * properties represent the the request URL and the
 * value is the XML Request instance.
 */
const transit: { [url: string]: XMLHttpRequest } = object(null);

/**
 * Async Timeout
 */
function pending (callback: Function): Promise<boolean> {

  return new Promise(resolve => setTimeout(() => resolve(callback()), 5));

};

/**
 * Request Timeouts
 *
 * Transit timers used to keep track of promises
 * and trigger operations like hover or proximity
 * prefetching.
 */
export const timers: { [url: string]: NodeJS.Timeout } = object(null);

/**
 * Fetch XHR Request wrapper function
 */
export function httpRequest (url: string): Promise<string | false> {

  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {

    xhr.open('GET', url, config.async);
    xhr.setRequestHeader('X-SPX', 'true');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    xhr.onloadstart = e => { transit[url] = xhr; };
    xhr.onload = e => { resolve(xhr.status === 200 ? xhr.responseText : false); };
    xhr.onabort = e => { delete transit[url]; };
    xhr.onloadend = e => {
      delete transit[url];
      memory.bytes = memory.bytes + e.loaded;
      memory.visits = memory.visits++;
    };

    xhr.onerror = reject;
    xhr.timeout = config.timeout;
    xhr.responseType = 'text';

    xhr.send(null);

  });

};

/**
 * Fetch Throttle
 */
export function throttle (url: string, fn: () => void, delay: number): void {

  if (url in timers) return;
  if (!store.has(url)) timers[url] = setTimeout(fn, delay);

};

/**
 * Cleanup throttlers
 */
export function cleanup (url: string) {

  if (url in timers) {
    clearTimeout(timers[url]);
    return delete timers[url];
  }

  return true;
}

/**
 * Abort Single Request
 *
 * Aborts a specific request in transit.
 */
export function abort (url: string): void {

  if (url in transit) {
    transit[url].abort();
    log(Errors.WARN, `Fetch aborted: ${url}`);
  }

};

/**
 * Cancel Multiple Requests
 *
 * Aborts all pending requests excluding the
 * the request id (page key identifier) provided.
 * To cancel a specific request, use `abort` export.
 */
export function cancel (key: string): void {

  if (!(key in transit)) return;

  for (const url in transit) {
    if (key !== url) {
      transit[url].abort();
      log(Errors.WARN, `Pending fetch aborted: ${url}`);
    }
  }
};

/**
 * Prevents repeated transit from being executed.
 * When prefetching, if a request is in transit and a click
 * event dispatched this will prevent multiple transit and
 * instead wait for initial fetch to complete.
 *
 * Number of recursive runs to make, set this to 85 to disable,
 * else just leave it to execute as is.
 *
 * Returns `true` if request resolved in `850ms` else `false`
 */
export async function inFlight (url: string, rate = 0): Promise<boolean> {

  if ((url in transit) && rate <= config.timeout) {

    if (config.progress !== false) {
      const time = rate * 5;
      if (time === config.progress.threshold) progress.start();
    }

    rate++;

    return pending(() => inFlight(url, rate));
  }

  return delete transit[url];

};

/**
 * Preload Requests
 *
 */
export function preload (state: IPage) {

  if (config.preload !== null) {

    const load = forEach(async path => {
      const route = getRoute(path, EventType.PRELOAD);
      if (route.key !== path) await fetch(store.create(route));
    });

    if (isArray(config.preload)) {
      load(config.preload);
    } else if (typeof config.preload === 'object') {
      if (state.key in config.preload) {
        load(config.preload[state.key]);
      }
    }
  }
}

export async function reverse (state: IPage) {

  if (state.rev !== state.key) {
    if (!store.has(state.rev)) {
      console.log('REVERSE FETCH FOR', state.rev);
      await fetch(store.create(getRoute(state.rev, EventType.REVERSE)));
    }
  }

}

/**
 * Fetches documents and guards from duplicated transit
 * from being dispatched if an indentical fetch is in flight.
 * transit will always save responses and snapshots.
 */
export async function fetch (state: IPage): Promise<IPage|false> {

  if (state.key in transit) {

    if (state.type === EventType.REVERSE) {
      transit[state.key].abort();
      log(Errors.WARN, `Reverse fetch aborted: ${state.key}`);
    } else {
      log(Errors.WARN, `Fetch already in transit: ${state.key}`);
    }

    return;
  }

  if (!emit('fetch', state)) {
    log(Errors.WARN, `Fetch cancelled within dispatched event: ${state.key}`);
    return false;
  }

  try {

    const snapshot = await httpRequest(state.key);

    if (snapshot) return store.set(state, snapshot);

    log(Errors.ERROR, ` Failed to retrive response: ${state.key}`);

  } catch (e) {

    delete transit[state.key];

    log(Errors.ERROR, `Fetch failed: ${state.key}`);

  }

  return false;

};
