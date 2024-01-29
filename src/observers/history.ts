import { HistoryState, HistoryAPI, IPage } from 'types';
import { $ } from '../app/session';
import { assign, o } from '../shared/native';
import { hasProp, hasProps, log } from '../shared/utils';
import * as request from '../app/fetch';
import * as render from '../app/render';
import * as store from '../app/store';
import { Errors, EventType } from '../shared/enums';
import { getKey, getRoute } from '../app/location';

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
    hasProp(api.state, 'rev') &&
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

  return typeof key === 'string'
    ? match && api.state.key === key
    : match;

}

/**
 * Initialise
 *
 * Assigns the `page` with last known `history.state` reference and aligns scroll position.
 */
export function initialize (page: IPage) {

  if (has(page.key)) {
    scrollTo(api.state.scrollX, api.state.scrollY);
    return assign(page, api.state);
  } else {
    replace(page);
  }

  return page;

}

/**
 * History ReplaceState
 *
 * Applied `history.replaceState` reference update.
 */
export function replace ({ key, rev, title, scrollX, scrollY }: HistoryState) {

  const state: HistoryState = o<HistoryState>({
    key,
    rev,
    title: title || document.title,
    scrollX,
    scrollY
  });

  api.replaceState(state, state.title, state.key);

  log(Errors.TRACE, `History replaceState: ${api.state.key}`);

  return api.state;

}

/**
 * History PushState
 *
 * Applied `history.pushState` and passes SPX references.
 */
export function push ({ key, rev, title }: IPage) {

  const state: HistoryState = o<HistoryState>({
    key,
    rev,
    title,
    scrollY: 0,
    scrollX: 0
  });

  api.pushState(state, state.title, state.key);

  log(Errors.TRACE, `History pushState: ${api.state.key}`);

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

  if (store.has(event.state.key)) {

    if (store.has(event.state.rev) === false && event.state.rev !== event.state.key) {
      request.reverse(event.state.rev);
    }

    log(Errors.TRACE, `History popState: ${event.state.key}`);

    $.pages[event.state.key].type = EventType.POPSTATE;

    render.update($.pages[event.state.key]);

  } else {

    event.state.type = EventType.POPSTATE;

    const page = await request.fetch(event.state);

    if (!page) return location.assign(event.state.key);

    const key = getKey(location);

    if (page.key === key) {

      render.update(page);

    } else if (store.has(key)) {

      render.update($.pages[key]);

    } else {

      const data = store.create(getRoute(key, EventType.POPSTATE));

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
export function connect (page?: IPage): IPage {

  if ($.observe.history) return;

  // Scroll restoration is set to manual for Safari and iOS
  // when auto, content flashes are incurred, manual is a far better approach here.
  if (api.scrollRestoration) api.scrollRestoration = 'manual';

  addEventListener('popstate', pop, false);

  $.observe.history = true;

  // Connection allows page state to be passed
  // this will ensure history push~state is aligned on initial runs
  if (typeof page === 'object' && page.type === EventType.INITIAL) return initialize(page);

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

  $.observe.history = false;

}
