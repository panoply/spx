import { IPage, ICacheSize } from '../types/page';
import { dispatch } from './events';
import { byteConvert, byteSize } from './utils';
import { progress } from './progress';
import { config } from './state';
import * as store from './store';
import { create } from '../constants/native';

let storage: number = 0;

/**
 * Request Transits
 */
export const transit: Map<string, XMLHttpRequest> = new Map();

/**
 * Request Timeouts
 */
export const timeout: { [url: string]: NodeJS.Timeout } = create(null);

/**
 * Async Timeout
 */
function pending (callback: Function): Promise<boolean> {

  return new Promise(resolve => setTimeout(() => resolve(callback()), 5));

};

/**
 * Executes on request end. Removes the XHR recrod and update
 * the response DOMString cache size record.
 */
function httpRequestEnd (url: string, DOMString: string) {

  transit.delete(url);
  storage = storage + byteSize(DOMString);

};

/**
 * Fetch Throttle
 */
export function throttle (url: string, fn: ()=> void, delay: number): void {

  if (url in timeout) return;
  if (!store.has(url)) timeout[url] = setTimeout(fn, delay);

};

/**
 * Cleanup throttlers
 */
export function cleanup (url: string): boolean {

  clearTimeout(timeout[url]);

  return delete timeout[url];

};

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
    xhr.setRequestHeader('X-Pjax', 'true');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    // EVENTS
    //
    xhr.onloadstart = e => transit.set(url, xhr);
    xhr.onload = e => resolve(xhr.status === 200 ? xhr.responseText : false);
    xhr.onloadend = e => httpRequestEnd(url, xhr.responseText);
    xhr.onabort = e => transit.delete(url);

    xhr.onerror = reject;
    xhr.timeout = config.timeout;
    xhr.responseType = 'text';

    // SEND
    //
    xhr.send(null);

  });

};

/**
 * Fetch document and add the response to session cache.
 * Lifecycle event `pjax:cache` will fire upon completion.
 */
export async function prefetch (state: IPage): Promise<boolean> {

  if (!(await get(state))) {
    console.warn(`Pjax: Prefetch failed, request will retry for: ${state.key}`);
  }

  return cleanup(state.key);

};

/**
 * Returns request cache metrics
 */
export function cacheSize (): ICacheSize {

  return {
    total: storage,
    weight: byteConvert(storage)
  };
}

/**
 * Abort Request
 *
 * Aborts a specific request in transit.
 */
export function abort (url: string): void {

  if (transit.has(url)) {
    transit.get(url).abort();
    console.warn(`Pjax: XHR Request was cancelled for url: ${url}`);
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

  transit.forEach((xhr, url) => {
    if (id !== url) {
      xhr.abort();
      console.warn(`Pjax: Cancelled pending request: ${url}`);
    }
  });

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

  if (transit.has(url) && rate <= config.timeout) {
    if ((rate * 10) === config.progress.threshold) progress.start();
    rate++;
    return pending(() => inFlight(url, rate));
  }

  return !transit.delete(url);

};

/**
 * Fetches documents and guards from duplicated transit
 * from being dispatched if an indentical fetch is in flight.
 * transit will always save responses and snapshots.
 */
export async function get (state: IPage): Promise<IPage|false> {

  if (transit.has(state.key)) {
    console.warn(`Pjax: XHR Request is already in transit for: ${state.key}`);
    return false;
  }

  if (!dispatch('pjax:request', { state }, true)) {
    console.info(`Pjax: Request cancelled via dispatched event for: ${state.key}`);
    return false;
  }

  try {

    const snapshot = await httpRequest(state.key);

    // CREATE CACHE RECORD
    if (snapshot) return store.set(state, snapshot);

    console.warn(`Pjax: Failed to retrive response at: ${state.key}`);

  } catch (e) {

    transit.delete(state.key);
    console.error('Pjax: Fetch error:', e);

  }

  return false;

};
