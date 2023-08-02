import { HistoryState, IPage } from 'types';
import { pages, observers } from '../app/session';
import { history, object } from '../shared/native';
import { hasProp, log, onNextResolveTick } from '../shared/utils';
import { fetch, reverse } from '../app/fetch';
import * as render from '../app/render';
import * as store from '../app/store';
import { Errors, EventType } from '../shared/enums';
import { getKey, getRoute } from '../app/location';
// import { emit } from '../app/events';

/**
 * History API - Re-export of the `window.history` native constant
 */
export { history as api } from '../shared/native';

// let loaded: boolean = false;

/**
 * The state reference to be populated and saved in the browser state.
 * This is a partial copy of the in-memory page state. The function
 * will omit render specific options that could otherwise be applied
 * via attribute annotation.
 */
function stack (page?: IPage) {

  const state: HistoryState = object(null);

  state.key = page.key;
  state.rev = page.rev;
  state.title = page.title;
  state.position = page.position;

  return state;

}

/**
 * Returns History State
 */
export function get () {

  return history.state;

}

/**
 * Check if history state holds reverse
 * last path reference. Returns a boolean
 */
export function doReverse (): boolean {

  return (
    history.state !== null &&
    hasProp(history.state, 'rev') &&
    history.state.key !== history.state.rev
  );

}

export function replace (state: IPage) {

  // console.log('REPLACE STATE', state);

  history.replaceState(stack(state), state.title, state.key);

  log(Errors.INFO, `ReplaceState triggered for: ${state.key}`);

  return state;

}

export function push (state: IPage) {

  history.pushState(stack(state), state.title, state.key);

  return state;

}

/**
 * Popstate Event
 *
 * Fires popstate navigation request
 */
async function pop (event: PopStateEvent & { state: HistoryState }) {

  log(Errors.INFO, 'PopState visit incurred');

  if (document.readyState !== 'complete') {

    await onNextResolveTick();

  }

  if (event.state === null) return;

  if (store.has(event.state.key)) {

    reverse(event.state.rev);

    await render.update(pages[event.state.key]);

  } else {

    event.state.type = EventType.POPSTATE;

    const page = await fetch(event.state);

    if (!page) return location.assign(event.state.key);

    const key = getKey(location);

    if (page.key === key) {

      await render.update(page);

    } else if (store.has(key)) {

      await render.update(pages[key]);

    } else {

      const data = store.create(getRoute(key, EventType.POPSTATE));

      await fetch(data);

      history.pushState(data, document.title, key);
    }
  }
};

/**
 * Listener Callback
 *
 * Event History dispatch controller, handles popstate,
 * push and replace events via third party module
 */
// eslint-disable-next-line no-unused-vars
// function persist ({ timeStamp }: BeforeUnloadEvent) {
//  window.sessionStorage.setItem(config.session, JSON.stringify({ snapshots, pages }));
// };

/**
 * Start History API
 *
 * Attached `history` event listener. Optionally accepts a `page`
 * reference, which is passed on initialisation and used to execute
 * assignment for history push~state when no context exists.
 */
export function connect (page?: IPage): void {

  if (observers.history) return;

  // Scroll restoration is set to manual for Safari and iOS
  // when auto, content flashes are incurred, manual is a far better approach here.
  if (history.scrollRestoration) history.scrollRestoration = 'manual';

  // Connection allows page state to be passed
  // this will ensure history push~state is aligned on initial runs
  if (history.state === null && page) history.replaceState(stack(page), page.title, page.key);

  addEventListener('popstate', pop, false);

  observers.history = true;

}

/**
 * End History API
 *
 * Removed `history` event listener.
 */
export function disconnect (): void {

  if (!observers.history) return;

  // Revert scroll restoration to defaults
  if (history.scrollRestoration) history.scrollRestoration = 'auto';

  removeEventListener('popstate', pop, false);

  observers.history = false;

}
