import { IPage } from '../types/page';
import { emit } from './events';
import { log, hasProp } from '../shared/utils';
import { getRoute } from './location';
import { config, memory } from './session';
import * as store from './store';
import { isArray, object } from '../shared/native';
import { Errors, EventType } from '../shared/enums';
import { Key } from 'types';

/**
 * Request Transits
 *
 * This object holds the XHR requests in transit. The object
 * properties represent the the request URL and the
 * value is the XML Request instance.
 */
export const transit: { [url: string]: ReturnType<typeof request> } = object(null);

/**
 * Request Timeouts
 *
 * Transit timers used to keep track of promises
 * and trigger operations like hover or proximity
 * prefetching.
 */
export const timers: { [url: string]: NodeJS.Timeout } = object(null);

/**
 * XHR Requests
 *
 * The promise-like queue reference which holds the
 * XHR requests for each fetch dispatched. This allows
 * for aborting in-transit requests.
 */
const xhr: { [url: string]: XMLHttpRequest } = object(null);

/**
 * Fetch XHR Request wrapper function
 */
export function request (key: string) {

  return new Promise<string>(function (resolve, reject) {

    const request = xhr[key] = new XMLHttpRequest();

    request.open('GET', key);
    request.setRequestHeader('X-SPX', 'true');
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    request.onload = function () {
      resolve(request.responseText);
    };

    request.onloadend = function (event: ProgressEvent<EventTarget>) {
      memory.bytes = memory.bytes + event.loaded;
      memory.visits = memory.visits + 1;
      delete xhr[key];
    };

    request.onerror = function () {
      reject(this.statusText);
    };

    request.onabort = function () {
      delete xhr[key];
    };

    request.send();

  });

};

/**
 * Fetch Throttle
 */
export function throttle (key: string, callback: () => void, delay: number): void {

  if (hasProp(timers, key)) return;
  if (!store.has(key)) timers[key] = setTimeout(callback, delay);

};

/**
 * Cleanup throttlers
 */
export function cleanup (key: string) {

  if (!hasProp(timers, key)) return true;

  clearTimeout(timers[key]);

  console.log('cleanup', timers);

  return delete timers[key];

}

/**
 * Abort Single Request
 *
 * Aborts a specific request in transit.
 */
export function abort (key: string): void {

  if (hasProp(xhr, key)) {
    xhr[key].abort();
    log(Errors.WARN, `Fetch aborted: ${key}`);
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

  for (const url in xhr) {
    if (key === url) continue;
    xhr[url].abort();
    log(Errors.WARN, `Pending fetch aborted: ${url}`);
  }

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

      return Promise.all(
        config.preload.filter(
          path => {
            const route = getRoute(path, EventType.PRELOAD);
            return route.key !== path ? fetch(
              store.create(route)
            ) : false;
          }
        )
      );

    } else if (typeof config.preload === 'object') {
      if (hasProp(config.preload, state.key as Key)) {

        return Promise.all(
          config.preload[state.key].map(
            (path: Key) => fetch(
              store.create(
                getRoute(path, EventType.PRELOAD)
              )
            )
          )
        );
      }
    }
  }
}

/**
 * Reverse Fetch
 *
 * Triggers a reverse fetch which is preemptive request
 * dispatched at different points, like (for example) in
 * popstate operations or initial load.
 */
export async function reverse (key: string): Promise<void> {

  if (store.has(key)) return;

  // console.log('REVERSE FETCH FOR', key);

  const route = getRoute(key, EventType.REVERSE);
  const page = store.create(route);

  setTimeout(() => fetch(page));

}

export async function wait (state: IPage): Promise<IPage> {

  if (!hasProp(transit, state.key)) return state;

  const snapshot = await transit[state.key];

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

  if (hasProp(xhr, state.key)) {

    if (state.type === EventType.REVERSE) {
      if (hasProp(xhr, state.rev)) xhr[state.rev].abort();
      log(Errors.WARN, `Reverse fetch aborted: ${state.key}`);
    } else {
      log(Errors.WARN, `Fetch already in transit: ${state.key}`);
    }

    return false;
  }

  if (!emit('fetch', state)) {
    log(Errors.WARN, `Fetch cancelled within dispatched event: ${state.key}`);
    return false;
  }

  // create a transit queue reference of the
  // dispatched request in transit.
  transit[state.key] = request(state.key);

  return wait(state);

};
