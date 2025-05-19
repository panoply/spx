import type { HistoryState, HistoryAPI, Page } from 'types';
import { $ } from '../app/session';
import { o } from '../shared/native';
import { hasProps, promiseResolve } from '../shared/utils';
import * as log from '../shared/logs';
import { VisitType } from '../shared/enums';
import { getKey, getRoute } from '../app/location';
import * as request from '../app/fetch';
import * as render from '../app/render';
import * as q from '../app/queries';
import { Merge } from 'type-fest';
import { emit } from 'src/app/events';

/**
 * History API `window.history`
 */
export const api = window.history as HistoryAPI;

/**
 * History Reverse
 *
 * Check if history state holds reverse last path reference. Returns a boolean
 */
export const reverse = (): boolean => (
  api.state !== null &&
  'spx' in api.state &&
  'rev' in api.state.spx &&
  api.state.spx.key !== api.state.spx.rev
);

/**
 * History Exists
 *
 * Check if an SPX hsitory state reference exists. Accepts a `key` reference,
 * and when passed will apply an additional check to ensure history record matches key.
 */
export const has = (key?: string): boolean => {

  if (api.state === null) return false;
  if (typeof api.state !== 'object') return false;
  if (!('spx' in api.state)) return false;

  const match = hasProps(api.state.spx)([
    'key',
    'rev',
    'scrollX',
    'scrollY',
    'title',
    'target'
  ]);

  return typeof key === 'string' ? match && api.state.spx.key === key : match;

};

/**
 * Load
 *
 * Toggles the `$.loaded` session reference
 */
export const load = async () => {

  await promiseResolve();

  $.loaded = true;

};

/**
 * Initialise
 *
 * Assigns the `page` with last known `history.state` reference and aligns scroll position.
 */
export const initialize = (page: Page) => {

  if (has(page.key)) {
    Object.assign(page, api.state.spx);
    scrollTo(api.state.spx.scrollX, api.state.spx.scrollY);
  } else {
    replace(page as unknown as HistoryState);
  }

  return page;

};

/**
 * History ReplaceState
 *
 * Applied `history.replaceState` reference update.
 */
export const replace = ({
  key,
  rev,
  title,
  scrollX,
  scrollY,
  target
}: HistoryState) => {

  api.replaceState({
    spx: o<HistoryState>({
      key,
      rev,
      scrollX,
      scrollY,
      target,
      title: title || document.title
    })
  }, title, key);

  log.debug(`History replaceState: ${key}`);

  return api.state.spx;

};

/**
 * History PushState
 *
 * Applied `history.pushState` and passes SPX references.
 */
export const push = ({ key, rev, title, scrollX, scrollY, target }: Page) => {

  api.pushState({
    spx: o<HistoryState>({
      key,
      rev,
      scrollX,
      scrollY,
      target,
      title: title || document.title
    })
  }, title, key);

  log.debug(`History pushState: ${key}`);

  return api.state.spx;

};

/**
 * Popstate Event
 *
 * Fires popstate navigation request
 */
const pop = async (event: Merge<PopStateEvent, {
  state: {
    spx: Merge<HistoryState, {
      type?: VisitType
    }>
  }
}>) => {

  // console.log('POP', spx.key, event.state.position);

  if (event.state === null || !('spx' in event.state)) return;

  const { spx } = event.state;

  if (q.has(spx.key)) {

    // Popstate incurred on a snapshot and previously visited page
    // We will carry on as normal

    if (!q.has(spx.rev) && spx.rev !== spx.key) {
      request.reverse(spx);
    }

    q.patch('type', VisitType.POPSTATE, spx.key);

    if (!emit('popstate', $.pages[spx.key])) return;

    const { type, key } = render.update($.pages[spx.key]);

    log.debug(`History popState ${type === VisitType.REVERSE ? 'session' : 'reverse'}: ${key}`);

  } else {

    log.debug(`History popState fetch: ${spx.key}`);

    spx.type = VisitType.POPSTATE;

    if (!emit('popstate', spx as Page)) return;

    const page = await request.fetch(spx as Page);

    // No page, infers we have no record available
    // we apply an assign fallback

    if (!page) return location.assign(spx.key);

    const key = getKey(location);

    if (page.key === key) {

      // Let's proceed as normal, our snapshot is ready.

      log.debug(`History popState fetch Complete: ${spx.key}`);

      page.target = [];
      page.selector = null;

      render.update(page);

    } else if (q.has(key)) {

      // We have a record, but the user might be agressively going backwards

      render.update($.pages[key]);

    } else {

      // We have got zero knoweldge, we will carry out fetch
      // let's first teardown any components

      // teardown();

      const data = q.create(getRoute(key, VisitType.POPSTATE));

      if (!emit('popstate', data)) return;

      const page = await request.fetch(data);

      if (page) push(page);

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
export const connect = (page?: Page): Page => {

  if ($.observe.history) return;

  // Scroll restoration is set to manual for Safari and iOS
  // when auto, content flashes are incurred, manual is a far better approach here.
  // if (api.scrollRestoration) api.scrollRestoration = 'manual';

  addEventListener('popstate', pop, false);

  $.observe.history = true;

  // Connection allows page state to be passed
  // this will ensure history push~state is aligned on initial runs
  if (typeof page === 'object' && page.type === VisitType.INITIAL) {

    return initialize(page);

  }

  return page;

};

/**
 * End History API
 *
 * Removed `history` event listener.
 */
export const disconnect = (): void => {

  if (!$.observe.history) return;

  // Revert scroll restoration to defaults
  // if (api.scrollRestoration) api.scrollRestoration = 'auto';

  removeEventListener('popstate', pop, false);
  // removeEventListener('load', load, false);

  $.observe.history = false;

};
