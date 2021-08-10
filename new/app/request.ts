import { IPage, ICacheSize } from '../types/store';
import { store } from './store';
import { dispatchEvent } from './events';
import { byteConvert, byteSize } from './utils';
import { progress } from './progress';

let ratelimit: number = 0;
let storage: number = 0;
let showprogress: boolean = false;

/**
 * XHR Requests
 */
export const transit: Map<string, XMLHttpRequest> = new Map();

/**
 * Async Timeout
 */
function asyncTimeout (callback: Function, ms = 0): Promise<boolean> {

  return new Promise(resolve => setTimeout(() => {
    const fn = callback();
    resolve(fn);
  }, ms));

};

/**
 * Executes on request end. Removes the XHR recrod and update
 * the response DOMString cache size record.
 */
function HttpRequestEnd (url: string, DOMString: string): void {

  transit.delete(url);
  storage = storage + byteSize(DOMString);

};

/**
 * Fetch XHR Request wrapper function
 */
function HttpRequest (url: string): Promise<string> {

  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {

    // OPEN
    //
    xhr.open('GET', url, store.config.request.async);

    // HEADERS
    //
    xhr.setRequestHeader('X-Pjax', 'true');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    // EVENTS
    //
    xhr.onloadstart = e => transit.set(url, xhr);
    xhr.onload = e => xhr.status === 200 ? resolve(xhr.responseText) : null;
    xhr.onloadend = e => HttpRequestEnd(url, xhr.responseText);
    xhr.onerror = reject;
    xhr.timeout = store.config.request.timeout;
    xhr.responseType = 'text';

    // SEND
    //
    xhr.send(null);

  });

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
 * Cancels the request in transit
 */
export function cancel (url: string): void {

  if (transit.has(url)) {

    transit.get(url).abort();
    transit.delete(url);

    console.warn(`Pjax: XHR Request was cancelled for url: ${url}`);

  }
};

/**
 * Prevents repeated requests from being executed.
 * When prefetching, if a request is in transit and a click
 * event dispatched this will prevent multiple requests and
 * instead wait for initial fetch to complete.
 *
 * Number of recursive runs to make, set this to 85 to disable,
 * else just leave it to execute as is.
 *
 * Returns `true` if request resolved in `850ms` else `false`
 */
export async function inFlight (url: string): Promise<boolean> {

  if (transit.has(url) && ratelimit <= store.config.request.timeout) {

    if (!showprogress && Object.is((ratelimit * 10), store.config.progress.threshold)) {
      progress.start();
      showprogress = true;
    }

    return asyncTimeout(() => {
      ratelimit++;
      return inFlight(url);
    }, 1);

  }

  ratelimit = 0;
  showprogress = false;

  return !transit.has(url);

};

/**
 * Fetches documents and guards from duplicated requests
 * from being dispatched if an indentical fetch is in flight.
 * Requests will always save responses and snapshots.
 */
export async function get (state: IPage): Promise<IPage|false> {

  if (transit.has(state.url)) {
    console.warn(`Pjax: XHR Request is already in transit for: ${state.url}`);
    return false;
  }

  if (!dispatchEvent('pjax:request', { state }, true)) {
    console.warn(`Pjax: Request cancelled via dispatched event for: ${state.url}`);
    return false;
  }

  try {

    const response = await HttpRequest(state.url);

    if (typeof response === 'string') return store.create(state, response);

    console.warn(`Pjax: Failed to retrive response at: ${state.url}`);

  } catch (error) {

    transit.delete(state.url);
    console.error(error);

  }

  return false;

};
