import { Key } from 'types';
import { IPage } from '../types/page';
import { emit } from './events';
import { log, hasProp, position } from '../shared/utils';
import { getRoute } from './location';
import { config, memory, pages } from './session';
import { isArray } from '../shared/native';
import { Errors, EventType } from '../shared/enums';
import * as store from './store';

/**
 * Request Transits
 *
 * This object holds the XHR requests in transit. The object
 * properties represent the the request URL and the
 * value is the XML Request instance.
 */
export const transit: Map<string, ReturnType<typeof request>> = new Map();

/**
 * Request Timeouts
 *
 * Transit timers used to keep track of promises
 * and trigger operations like hover or proximity
 * prefetching.
 */
export const timers: Map<string, NodeJS.Timeout> = new Map();

/**
 * Extends XMLHTTPRequest
 *
 * Extend the native XHR request class and add
 * a key value to the instance.
 */
class XHR extends XMLHttpRequest { key: string = null; }

/**
 * XHR Requests
 *
 * The promise-like queue reference which holds the
 * XHR requests for each fetch dispatched. This allows
 * for aborting in-transit requests.
 */
const xhr: Map<string, XMLHttpRequest> = new Map();

/**
 * Fetch XHR Request wrapper function
 */
export function request (key: string) {

  return new Promise<string>(function (resolve, reject) {

    const req = new XHR();

    req.key = key;
    req.responseType = 'text';

    req.open('GET', key);
    req.setRequestHeader('X-SPX', 'true');
    req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    req.onload = function (this: XHR) {
      resolve(this.response);
    };

    req.onerror = function (this: XHR) {
      reject(this.statusText);
    };

    req.onabort = function (this: XHR) {
      xhr.delete(this.key);
    };

    req.onloadend = function (this: XHR, event: ProgressEvent<EventTarget>) {
      memory.bytes = memory.bytes + event.loaded;
      memory.visits = memory.visits + 1;
      xhr.delete(this.key);
    };

    req.send();
    xhr.set(key, req);

  });

};

/**
 * Fetch Throttle
 */
export function throttle (key: string, callback: () => void, delay: number): void {

  if (timers.has(key)) return;
  if (!store.has(key)) timers.set(key, setTimeout(callback, delay));

};

/**
 * Cleanup throttlers
 */
export function cleanup (key: string) {

  if (!timers.has(key)) return true;

  clearTimeout(timers.get(key));

  return timers.delete(key);

}

/**
 * Abort Single Request
 *
 * Aborts a specific request in transit.
 */
export function abort (key: string): void {

  if (xhr.has(key)) {
    xhr.get(key).abort();
    log(Errors.WARN, `Request aborted: ${key}`);
  }

};

/**
 * Cancel Multiple Requests
 *
 * Aborts all pending requests excluding the
 * the request id (page key identifier) provided.
 * To cancel a specific request, use `abort` export.
 */
export function cancel (key?: string): void {

  return xhr.forEach((req, url) => {
    if (key !== url) {
      req.abort();
      log(Errors.WARN, `Pending request aborted: ${url}`);
    }
  });

};

/**
 * Preload Requests
 *
 * Triggered on SPX connection and preloads
 * locations defined in configuration. This
 * fetch is executed only once.
 */
export function preload (state: IPage) {

  if (config.preload !== null) {

    if (isArray(config.preload)) {

      const promises = config.preload.filter(path => {
        const route = getRoute(path, EventType.PRELOAD);
        return route.key !== path ? fetch(store.create(route)) : false;
      });

      return Promise.allSettled(promises);

    } else if (typeof config.preload === 'object') {

      if (hasProp(config.preload, state.key as Key)) {

        const promises = config.preload[state.key].map((path: Key) => fetch(
          store.create(getRoute(path, EventType.PRELOAD))
        ));

        return Promise.allSettled(promises);

      }
    }
  }
}

/**
 * Reverse Fetch
 *
 * Triggers a reverse fetch which is preemptive request
 * dispatched at different points, like (for example) in
 * popstate operations or at initial load.
 */
export async function reverse (key: string): Promise<void> {

  if (store.has(key)) {
    pages[key].position = position();
    return;
  }

  const route = getRoute(key, EventType.REVERSE);
  const page = store.create(route);

  setTimeout(() => fetch(page));

}

export async function wait (state: IPage): Promise<IPage> {

  if (!transit.has(state.key)) return state;

  const snapshot = await transit.get(state.key);

  return store.set(state, snapshot);

}

/**
 * Fetch Request
 *
 * Fetches documents and guards from duplicated requests
 * from being dispatched when an indentical fetch is inFlight.
 * Page state is returned and the session is update success.
 */
export async function fetch (state: IPage): Promise<false|IPage> {

  if (xhr.has(state.key)) {
    if (state.type !== EventType.HYDRATE) {

      if (state.type === EventType.REVERSE && xhr.has(state.rev)) {
        xhr.get(state.rev).abort();
        log(Errors.WARN, `Request aborted: ${state.rev}`);
      } else {
        log(Errors.WARN, `Request in transit: ${state.key}`);
      }

      return false;
    }
  }

  if (!emit('fetch', state)) {
    log(Errors.WARN, `Request cancelled via dispatched event: ${state.key}`);
    return false;
  }

  // create a transit queue reference of the
  // dispatched request in transit.
  transit.set(state.key, request(state.key));

  return wait(state);

};
