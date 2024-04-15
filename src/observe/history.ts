import type { HistoryState, HistoryAPI, Page } from 'types';
import { $ } from '../app/session';
import { assign } from '../shared/native';
import { hasProps, promiseResolve } from '../shared/utils';
import { log } from '../shared/logs';
import { LogType, VisitType } from '../shared/enums';
import { getKey, getRoute } from '../app/location';
// import { teardown } from './components';
import * as request from '../app/fetch';
import * as render from '../app/render';
import * as q from '../app/queries';

/**
 * History API `window.history`
 */
export const api = window.history as HistoryAPI;

/**
 * History Reverse
 *
 * Check if history state holds reverse last path reference. Returns a boolean
 */
export function reverse (): boolean {

  return (
    api.state !== null &&
    'rev' in api.state &&
    api.state.key !== api.state.rev
  );

}

/**
 * History Exists
 *
 * Check if an SPX hsitory state reference exists. Accepts a `key` reference,
 * and when passed will apply an additional check to ensure history record matches key.
 */
export function has (key?: string): boolean {

  if (api.state == null) return false;
  if (typeof api.state !== 'object') return false;

  const match = hasProps(api.state)([
    'key',
    'rev',
    'scrollX',
    'scrollY',
    'title'
  ]);

  return typeof key === 'string' ? match && api.state.key === key : match;

}

/**
 * Load
 *
 * Toggles the `$.loaded` session reference
 */
export async function load () {

  await promiseResolve();

  $.loaded = true;

}

/**
 * Initialise
 *
 * Assigns the `page` with last known `history.state` reference and aligns scroll position.
 */
export function initialize (page: Page) {

  if (has(page.key)) {
    scrollTo(api.state.scrollX, api.state.scrollY);
    assign(page, api.state);
  } else {
    replace(page as unknown as HistoryState);
  }

  return page;

}

/**
 * History ReplaceState
 *
 * Applied `history.replaceState` reference update.
 */
export function replace ({ key, rev, title, scrollX, scrollY }: HistoryState) {

  const state: Omit<HistoryState, 'location'> = {
    key,
    rev,
    scrollX,
    scrollY,
    title: title || document.title
  };

  api.replaceState(state, state.title, state.key);

  if ($.logLevel === LogType.VERBOSE) {
    log(LogType.VERBOSE, `History replaceState: ${api.state.key}`);
  }

  return api.state;

}

/**
 * History PushState
 *
 * Applied `history.pushState` and passes SPX references.
 */
export function push ({ key, rev, title, location }: Page) {

  const path = location.pathname + location.search;
  const state: Omit<HistoryState, 'location'> = {
    key,
    rev,
    title,
    scrollY: 0,
    scrollX: 0
  };

  api.pushState(state, state.title, path);

  if ($.logLevel === LogType.VERBOSE) {
    log(LogType.VERBOSE, `History pushState: ${api.state.key}`);
  }

  return api.state;

}

/**
 * Popstate Event
 *
 * Fires popstate navigation request
 */
async function pop (event: PopStateEvent & { state: HistoryState }) {

  // console.log('POP', event.state.key, event.state.position);

  if (event.state === null) return;

  if (q.has(event.state.key)) {

    // Popstate incurred on a snapshot and previously visited page
    // We will carry on as normal

    if (!q.has(event.state.rev) && event.state.rev !== event.state.key) {
      request.reverse(event.state.rev);
    }

    const page = $.pages[event.state.key];

    if ($.logLevel === LogType.VERBOSE) {
      if (page.type === VisitType.REVERSE) {
        log(LogType.VERBOSE, `History popState reverse (snapshot): ${page.key}`);
      } else {
        log(LogType.VERBOSE, `History popState session (snapshot): ${page.key}`);
      }
    }

    q.patchPage('type', VisitType.POPSTATE);

    render.update(page);

  } else {

    if ($.logLevel === LogType.VERBOSE) {
      log(LogType.VERBOSE, `History popState fetch: ${event.state.key}`);
    }

    //  teardown();

    event.state.type = VisitType.POPSTATE;
    const page = await request.fetch(event.state);

    // No page, infers we have no record available
    // we apply an assign fallback

    if (!page) return location.assign(event.state.key);

    const key = getKey(location);

    if (page.key === key) {

      // Let's proceed as normal, our snapshot is ready.

      render.update(page);

    } else if (q.has(key)) {

      // We have a record, but the user might be agressively
      // going backwards

      render.update($.pages[key]);

    } else {

      // We have got zero knoweldge, we will carry out fetch
      // let's first teardown any components

      // teardown();

      const data = q.create(getRoute(key, VisitType.POPSTATE));

      await request.fetch(data);

      push(data);

    }

  }
};

/**
 * Start History API
 *
 * Attached `history` event listener. Optionally accepts a `page`
 * reference, which is passed on initialisation and used to execute
 * assignment for history push~state when no context exists.
 */
export function connect (page?: Page): Page {

  if ($.observe.history) return;

  // Scroll restoration is set to manual for Safari and iOS
  // when auto, content flashes are incurred, manual is a far better approach here.
  if (api.scrollRestoration) api.scrollRestoration = 'manual';

  addEventListener('popstate', pop, false);

  $.observe.history = true;

  // Connection allows page state to be passed
  // this will ensure history push~state is aligned on initial runs
  if (typeof page === 'object' && page.type === VisitType.INITIAL) {
    return initialize(page);
  }

  return page;

}

/**
 * End History API
 *
 * Removed `history` event listener.
 */
export function disconnect (): void {

  if (!$.observe.history) return;

  // Revert scroll restoration to defaults
  if (api.scrollRestoration) api.scrollRestoration = 'auto';

  removeEventListener('popstate', pop, false);
  removeEventListener('load', load, false);

  $.observe.history = false;

}
