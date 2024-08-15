/* eslint-disable n/no-callback-literal */
import type { Page, Key, HistoryState } from 'types';
import { $ } from './session';
import { emit } from './events';
import { log } from '../shared/logs';
import { hasProp, onNextTickResolve } from '../shared/utils';
import { getRoute } from './location';
import { XHR, isArray, toArray } from '../shared/native';
import { LogType, VisitType } from '../shared/enums';
import * as q from './queries';

interface RequestParams {
  /**
   * The Request body
   *
   * @default null
   */
  body?: Document | XMLHttpRequestBodyInit;
  /**
   * The Response type
   *
   * @default 'text'
   */
  type?: XMLHttpRequestResponseType
  /**
   * The Request method
   *
   * @default 'GET'
   */
  method?: string;
  /**
   * Optional Request headers
   *
   * @default null
   */
  headers?: { [key: string]: string };
}

/**
 * Returns specific element/s from over the wire
 */
export async function element <T extends HTMLElement> (key: string, ...elements: string[]): Promise<T[]> {

  const dom = await request(key, { type: 'document' });
  const elm = dom.querySelectorAll<T>(elements.join());

  if (!elm) return null;

  return toArray(elm);

}

/**
 * Fetch XHR Request wrapper function
 */
export function request <T> (key: string, {
  method = 'GET',
  body = null,
  headers = null,
  type = 'text'
}: RequestParams = {}) {

  return new Promise<T extends string ? string : Document>(function (resolve, reject) {

    const xhr = new XHR();

    xhr.key = key;
    xhr.responseType = type;
    xhr.open(method, key, true);
    xhr.setRequestHeader('spx-request', 'true');

    if (headers !== null) {
      for (const prop in headers) {
        xhr.setRequestHeader(prop, headers[prop]);
      }
    }

    xhr.onloadstart = function (this: XHR) {

      XHR.$request.set(this.key, xhr);

    };

    xhr.onload = function (this: XHR) {

      resolve(this.response);

    };

    xhr.onerror = function (this: XHR) {

      reject(this.statusText);

    };

    xhr.onabort = function (this: XHR) {

      delete XHR.$timeout[this.key];
      XHR.$transit.delete(this.key);
      XHR.$request.delete(this.key);

    };

    xhr.onloadend = function (this: XHR, event: ProgressEvent<EventTarget>) {
      XHR.$request.delete(this.key);
      $.memory.bytes = $.memory.bytes + event.loaded;
      $.memory.visits = $.memory.visits + 1;
    };

    xhr.send(body);

  });

};

/**
 * Cleanup throttlers
 */
export function cleanup (key: string) {

  if (!(key in XHR.$timeout)) return true;

  clearTimeout(XHR.$timeout[key]);

  return delete XHR.$timeout[key];

}

/**
 * Fetch Throttle
 */
export function throttle (key: string, callback: (cancel?: boolean) => void, delay: number): void {

  if (key in XHR.$timeout) return;

  if (!q.has(key)) {
    XHR.$timeout[key] = setTimeout(callback, delay);
  }

};

/**
 * Abort Single Request
 *
 * Aborts a specific request in transit.
 */
export function abort (key: string): void {

  if (XHR.$request.has(key)) {
    XHR.$request.get(key).abort();
    log(LogType.WARN, `Cancelled request: ${key}`);
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

  for (const [ url, xhr ] of XHR.$request) {
    if (key !== url) {
      xhr.abort();
      log(LogType.WARN, `Pending request aborted: ${url}`);
    }
  }

};

/**
 * Preload Requests
 *
 * Triggered on SPX connection and preloads
 * locations defined in configuration. This
 * fetch is executed only once.
 */
export function preload (state: Page) {

  if ($.config.preload !== null) {

    if (isArray($.config.preload)) {

      const promises = $.config.preload.filter(path => {
        const route = getRoute(path, VisitType.PRELOAD);
        return route.key !== path
          ? fetch(q.create(route))
          : false;
      });

      return Promise.allSettled(promises);

    } else if (typeof $.config.preload === 'object') {

      if (hasProp($.config.preload, state.key as Key)) {

        const promises = $.config.preload[state.key].map((path: Key) => (
          fetch(
            q.create(
              getRoute(
                path,
                VisitType.PRELOAD
              )
            )
          )
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
export async function reverse (state: Page | HistoryState): Promise<void> {

  if (state.rev === state.key) return;

  const page = q.create(getRoute(state.rev, VisitType.REVERSE));

  await onNextTickResolve();

  fetch(page).then(page => {
    if (page) {
      log(LogType.INFO, `Reverse fetch completed: ${page.rev}`);
    } else {
      log(LogType.WARN, `Reverse fetch failed: ${state.rev}`);
    }
  });

}

export async function wait (state: Page): Promise<Page> {

  if (!XHR.$transit.has(state.key)) return state;

  const snapshot = await XHR.$transit.get(state.key);

  XHR.$transit.delete(state.key);

  delete XHR.$timeout[state.key];

  return q.set(state, snapshot);

}

/**
 * Fetch Request
 *
 * Fetches documents and guards from duplicated requests
 * from being dispatched when an indentical fetch is inFlight.
 * Page state is returned and the session is update success.
 */
export async function fetch <T extends Page> (state: T): Promise<false|Page> {

  if (XHR.$request.has(state.key)) {
    if (state.type !== VisitType.HYDRATE) {

      if (state.type === VisitType.REVERSE && XHR.$request.has(state.rev)) {
        XHR.$request.get(state.rev).abort();
        log(LogType.WARN, `Request aborted: ${state.rev}`);
      } else {
        log(LogType.WARN, `Request in transit: ${state.key}`);
      }

      return false;
    }
  }

  if (!emit('fetch', state)) {
    log(LogType.WARN, `Request cancelled via dispatched event: ${state.key}`);
    return false;
  }

  // create a transit queue reference of the dispatched request in transit.
  XHR.$transit.set(state.key, request<string>(state.key));

  return wait(state);

};
