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
function stack (page: IPage) {

  const state: HistoryState = object(null);

  state.key = page.key;
  state.rev = page.rev;
  state.title = page.title;
  state.position = page.position;

  // console.log('HISTORY STACK', page);

  return state;
}

// async function load () {

//   await onNextResolveTick();

//   loaded = true;

// }

/**
 * Returns History State
 */
export function get () {

  return history.state;

}

/**
 * Check if history state holds reverse
 * last path reference. Returns a boolean
 *
 */
export function doReverse () {

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

  // console.log('PUSH STATE', state);

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

  // clearInterval(timeout);

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
 * Attached `history` event listener.
 */
export function connect (): void {

  if (observers.history) return;
  if (history.scrollRestoration) history.scrollRestoration = 'manual';

  addEventListener('popstate', pop, false);
  // addEventListener('load', load, false);

  observers.history = true;

}

/**
 * End History API
 *
 * Removed `history` event listener.
 */
export function disconnect (): void {

  if (!observers.history) return;
  if (history.scrollRestoration) history.scrollRestoration = 'auto';

  removeEventListener('popstate', pop, false);
  // removeEventListener('load', load, false);

  // removeEventListener('beforeunload', persist, { capture: true });

  observers.history = false;

}
