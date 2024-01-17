import { HistoryState, IPage } from 'types';
import { $ } from '../app/session';
import { assign, history, o } from '../shared/native';
import { hasProp, hasProps, log } from '../shared/utils';
import * as request from '../app/fetch';
import * as render from '../app/render';
import * as store from '../app/store';
import { Errors, EventType } from '../shared/enums';
import { getKey, getRoute } from '../app/location';

/**
 * History API - Re-export of the `window.history` native constant
 */
export { history as api } from '../shared/native';

/**
 * Check if history state holds reverse
 * last path reference. Returns a boolean
 */
export function reverse (): boolean {

  return (
    history.state !== null &&
    hasProp(history.state, 'rev') &&
    history.state.key !== history.state.rev
  );

}

/**
 * Check if an SPX hsitory state reference exists.
 * Accepts a `key` reference, when passed will apply an
 * additional check to ensure history record matches key.
 */
export function exists (key?: string): boolean {

  if (history.state == null) return false;
  if (typeof history.state !== 'object') return false;

  const match = hasProps(history.state)([
    'key',
    'rev',
    'scrollX',
    'scrollY',
    'title'
  ]);

  return typeof key === 'string'
    ? match && history.state.key === key
    : match;

}

/**
 * Initialise history reference and align scroll position
 */
export function initialize (page: IPage) {

  if (exists(page.key)) {
    scrollTo(history.state.scrollX, history.state.scrollY);
    return assign(page, history.state);
  } else {
    replace(page);
  }

  return page;

}

export function replace (page: HistoryState) {

  const state: HistoryState = o();

  state.key = page.key;
  state.rev = page.rev;
  state.title = page.title || document.title;
  state.scrollX = page.scrollX;
  state.scrollY = page.scrollY;

  history.replaceState(state, state.title, state.key);

  log(Errors.TRACE, `History replaceState: ${history.state.key}`);

  return history.state;

}

export function push ({ key, rev, title }: IPage) {

  const state: HistoryState = o<HistoryState>({
    key,
    rev,
    title,
    scrollY: 0,
    scrollX: 0
  });

  history.pushState(state, state.title, state.key);

  log(Errors.TRACE, `History pushState: ${history.state.key}`);

  return history.state;

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

    await render.update($.pages[event.state.key]);

  } else {

    event.state.type = EventType.POPSTATE;

    const page = await request.fetch(event.state);

    if (!page) return location.assign(event.state.key);

    const key = getKey(location);

    if (page.key === key) {

      await render.update(page);

    } else if (store.has(key)) {

      await render.update($.pages[key]);

    } else {

      const data = store.create(getRoute(key, EventType.POPSTATE));

      await request.fetch(data);

      history.pushState(data, document.title, key);
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
  if (history.scrollRestoration) history.scrollRestoration = 'manual';

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
  if (history.scrollRestoration) history.scrollRestoration = 'auto';

  removeEventListener('popstate', pop, false);

  $.observe.history = false;

}
