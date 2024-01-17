/* eslint-disable n/no-callback-literal */
import { Key } from 'types';
import { IPage } from '../types/page';
import { emit } from './events';
import { log, hasProp, onNextTickResolve } from '../shared/utils';
import { getRoute } from './location';
import { $ } from './session';
import { XHR, isArray } from '../shared/native';
import { Errors, EventType } from '../shared/enums';
import * as store from './store';

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
    xhr.open(method, key);
    xhr.setRequestHeader('spx-request', 'true');

    if (headers !== null) {
      for (const prop in headers) {
        xhr.setRequestHeader(prop, headers[prop]);
      }
    }

    xhr.onloadstart = function (this: XHR) {
      XHR.request.set(this.key, xhr);
    };

    xhr.onload = function (this: XHR) {
      resolve(this.response);
    };

    xhr.onerror = function (this: XHR) {
      reject(this.statusText);
    };

    xhr.onabort = function (this: XHR) {
      XHR.timeout.delete(this.key);
      XHR.transit.delete(this.key);
      XHR.request.delete(this.key);
    };

    xhr.onloadend = function (this: XHR, event: ProgressEvent<EventTarget>) {
      XHR.request.delete(this.key);
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

  if (!XHR.timeout.has(key)) return true;

  clearTimeout(XHR.timeout.get(key));

  return XHR.timeout.delete(key);

}

/**
 * Fetch Throttle
 */
export function throttle (key: string, callback: (cancel?: boolean) => void, delay: number): void {

  if (XHR.timeout.has(key)) return;
  if (!store.has(key)) XHR.timeout.set(key, setTimeout(callback, delay));

};

/**
 * Abort Single Request
 *
 * Aborts a specific request in transit.
 */
export function abort (key: string): void {

  if (XHR.request.has(key)) {
    XHR.request.get(key).abort();
    log(Errors.WARN, `Cancelled request: ${key}`);
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

  for (const [ url, xhr ] of XHR.request) {
    if (key !== url) {
      xhr.abort();
      log(Errors.WARN, `Pending request aborted: ${url}`);
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
export function preload (state: IPage) {

  if ($.config.preload !== null) {

    if (isArray($.config.preload)) {

      const promises = $.config.preload.filter(path => {
        const route = getRoute(path, EventType.PRELOAD);
        return route.key !== path
          ? fetch(store.create(route))
          : false;
      });

      return Promise.allSettled(promises);

    } else if (typeof $.config.preload === 'object') {

      if (hasProp($.config.preload, state.key as Key)) {

        const promises = $.config.preload[state.key].map((path: Key) => (
          fetch(
            store.create(
              getRoute(
                path,
                EventType.PRELOAD
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
export async function reverse (key: string): Promise<void> {

  const page = store.create(getRoute(key, EventType.REVERSE));

  await onNextTickResolve();

  fetch(page).then(page => {

    if (page) {
      log(Errors.INFO, `Reverse fetch completed: ${page.key}`);
    } else {
      log(Errors.WARN, `Reverse fetch failed: ${key}`);
    }

  });

}

export async function wait (state: IPage): Promise<IPage> {

  if (!XHR.transit.has(state.key)) return state;

  // await onNextTickResolve();

  const snapshot = await XHR.transit.get(state.key);

  XHR.transit.delete(state.key);
  XHR.timeout.delete(state.key);

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

  if (XHR.request.has(state.key)) {
    if (state.type !== EventType.HYDRATE) {

      if (state.type === EventType.REVERSE && XHR.request.has(state.rev)) {
        XHR.request.get(state.rev).abort();
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

  // create a transit queue reference of the dispatched request in transit.
  XHR.transit.set(state.key, request<string>(state.key));

  return wait(state);

};
