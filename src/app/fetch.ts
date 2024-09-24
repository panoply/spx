/* eslint-disable n/no-callback-literal */
import type { Page, Key, HistoryState } from 'types';
import { $ } from './session';
import { emit } from './events';
import { log } from '../shared/logs';
import { hasProp, onNextTickResolve } from '../shared/utils';
import { getRoute } from './location';
import { XHR } from '../shared/native';
import { Log, VisitType } from '../shared/enums';
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
  headers?: Array<[ key: string, value: string ]>;
}

/**
 * Fetch XHR Request wrapper function
 */
export const http = <T> (key: string, {
  method = 'GET',
  body = null,
  headers = [ [ 'spx-http', 'href' ] ],
  type = 'text'
}: RequestParams = {}) => new Promise<T extends string ? string : Document>((resolve, reject) => {

  const xhr = new XHR();

  xhr.key = key;
  xhr.responseType = type;
  xhr.open(method, key, true);

  for (const [ hk, hv ] of headers) xhr.setRequestHeader(hk, hv);

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

/**
 * Cleanup throttlers
 */
export const cleanup = (key: string) => {

  if (!(key in XHR.$timeout)) return true;

  clearTimeout(XHR.$timeout[key]);

  return delete XHR.$timeout[key];

};

/**
 * Fetch Throttle
 */
export const throttle = (key: string, callback: (cancel?: boolean) => void, delay: number): void => {

  if (key in XHR.$timeout) return;
  if (!q.has(key)) XHR.$timeout[key] = setTimeout(callback, delay);

};

/**
 * Abort Single Request
 *
 * Aborts a specific request in transit.
 */
export const abort = (key: string): void => {

  if (XHR.$request.has(key)) {
    XHR.$request.get(key).abort();
    log(Log.WARN, `Cancelled request: ${key}`);
  }

};

/**
 * Cancel Multiple Requests
 *
 * Aborts all pending requests excluding the
 * the request id (page key identifier) provided.
 * To cancel a specific request, use `abort` export.
 */
export const cancel = (key?: string): void => {

  for (const [ url, xhr ] of XHR.$request) {
    if (key !== url) {
      xhr.abort();
      log(Log.WARN, `Pending request aborted: ${url}`);
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
export const preload = (state: Page) => {

  if ($.config.preload !== null) {

    if (Array.isArray($.config.preload)) {

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
};

/**
 * Reverse Fetch
 *
 * Triggers a reverse fetch which is preemptive request
 * dispatched at different points, like (for example) in
 * popstate operations or at initial load.
 */
export const reverse = async (state: Page | HistoryState): Promise<void> => {

  if (state.rev === state.key) return;

  const page = q.create(getRoute(state.rev, VisitType.REVERSE));

  await onNextTickResolve();

  fetch(page).then(page => {
    page
      ? log(Log.INFO, `Reverse fetch completed: ${page.rev}`)
      : log(Log.WARN, `Reverse fetch failed: ${state.rev}`);
  });

};

export const wait = async (state: Page): Promise<Page> => {

  if (!XHR.$transit.has(state.key)) return state;

  const snapshot = await XHR.$transit.get(state.key);

  XHR.$transit.delete(state.key);

  delete XHR.$timeout[state.key];

  return q.set(state, snapshot);

};

/**
 * Fetch Request
 *
 * Fetches documents and guards from duplicated requests
 * from being dispatched when an indentical fetch is inFlight.
 * Page state is returned and the session is update success.
 */
export const fetch = async <T extends Page> (state: T): Promise<false|Page> => {

  if (XHR.$request.has(state.key)) {
    if (state.type !== VisitType.HYDRATE) {

      if (state.type === VisitType.REVERSE && XHR.$request.has(state.rev)) {
        XHR.$request.get(state.rev).abort();
        log(Log.WARN, `Request aborted: ${state.rev}`);
      } else {
        log(Log.WARN, `Request in transit: ${state.key}`);
      }

      return false;
    }
  }

  if (!emit('fetch', state)) {
    log(Log.WARN, `Request cancelled via dispatched event: ${state.key}`);
    return false;
  }

  // create a transit queue reference of the dispatched request in transit.
  XHR.$transit.set(state.key, http<string>(state.key));

  return wait(state);

};
