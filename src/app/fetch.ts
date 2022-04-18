import { IPage, ICacheSize } from '../types/page';
import { emit } from './events';
import { size, log } from '../shared/utils';
import * as progress from './progress';
import { config } from './session';
import * as store from './store';
import { object } from '../shared/native';
import { Errors } from '../shared/enums';

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

let storage: number = 0;

/**
 * Executes on request end. Removes the XHR recrod and update
 * the response DOMString cache size record.
 */
async function httpRequestEnd (dom: string) {

  storage = storage + dom.length;

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

    // OPEN
    //
    xhr.open('GET', url, config.async);

    // HEADERS
    //
    xhr.setRequestHeader('X-Brixtol-Pjax', 'true');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    // START
    //
    xhr.onloadstart = e => {
      transit[url] = xhr;
    };

    // ONLOAD
    //
    xhr.onload = e => {
      resolve(xhr.status === 200 ? xhr.responseText : false);
    };

    // ONABORT
    //
    xhr.onabort = e => {
      delete transit[url];
    };

    // END
    //
    xhr.onloadend = e => {
      delete transit[url];
      httpRequestEnd(xhr.responseText);
    };

    xhr.onerror = reject;
    xhr.timeout = config.timeout;
    xhr.responseType = 'text';

    // SEND
    //
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
 * Returns request cache metrics
 */
export function cacheSize (): ICacheSize {

  const cache = object(null);

  cache.total = storage;
  cache.weight = size(storage);

  return cache;
}

/**
 * Abort Request
 *
 * Aborts a specific request in transit.
 */
export function abort (url: string): void {

  if (url in transit) {
    transit[url].abort();
    log(Errors.WARN, `Request aborted: ${url}`);
  }

};

/**
 * Cancel Requests
 *
 * Aborts all pending requests excluding the
 * the request id (page key identifier) provided.
 * To cancel a specific request, use `abort` export.
 */
export function cancel (id: string): void {

  if (!(id in transit)) return;

  for (const url in transit) {
    if (id !== url) {
      transit[url].abort();
      log(Errors.WARN, `Pending request aborted: ${url}`);
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
 * Fetches documents and guards from duplicated transit
 * from being dispatched if an indentical fetch is in flight.
 * transit will always save responses and snapshots.
 */
export async function get (state: IPage): Promise<IPage|false> {

  if (state.key in transit) {
    log(Errors.WARN, `Request already in transit: ${state.key}`);
    return;
  }

  if (!emit('fetch', state)) {
    log(Errors.WARN, `Request cancelled in dispatched event: ${state.key}`);
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
