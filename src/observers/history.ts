import { HistoryState, IPage } from 'types';
import { pages, observers, config } from '../app/session';
import { history, object } from '../shared/native';
import * as render from '../app/render';
import * as request from '../app/fetch';
import * as store from '../app/store';
// import * as scroll from './scroll';
import { EventType } from '../shared/enums';

/**
 * The state reference to be populated and
 * saved in the browser state. This is a partial
 * copy of the in-memory page state.
 */
function getState (page: IPage) {

  const state: HistoryState = object(null);

  console.log('GET STATE', state);

  state.key = page.key;
  state.rev = page.rev;
  state.title = page.title;
  state.uuid = page.uuid;
  state.position = page.position;
  state.cache = page.cache;
  state.replace = page.replace;
  state.type = page.type;
  state.progress = page.progress;

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
 * last path reference
 */
export function reverse () {

  // PERFORM REVERSE CACHING
  if (!history.state) return false;
  if ('rev' in history.state) return history.state.rev;

  return false;

}

export function replace (state: IPage) {

  console.log('REPLACE STATE', state);

  history.replaceState(getState(state), null, state.key);

  return state;

}

export function push (state: IPage) {

  console.log('PUSH STATE', state);

  history.pushState(getState(state), null, state.key);

  return state;

}

/**
 * Popstate Event
 *
 * Fires popstate navigation request
 */
async function pop ({ state }: PopStateEvent & { state: HistoryState}): Promise<void|IPage> {

  console.log('POP STATE', state);

  if (store.has(state.key)) {

    // PERFORM REVERSE CACHING
    request.reverse(state);

    return render.update(pages[state.key]);
  }

  state.type = EventType.POPSTATE;
  const page = await request.fetch(state);

  if (page) return render.update(page);

  return location.assign(state.key);

};

/**
 * Listener Callback
 *
 * Event History dispatch controller, handles popstate,
 * push and replace events via third party module
 */
function persist ({ timeStamp }: BeforeUnloadEvent) {

  console.log('PERSIST', timeStamp);

};

/**
 * Start History API
 *
 * Attached `history` event listener.
 */
export function connect (): void {

  if (observers.history) return;

  addEventListener('popstate', pop);

  if (config.persist) {
    addEventListener('beforeunload', persist, { capture: true });
  }

  observers.history = true;

}

/**
 * End History API
 *
 * Removed `history` event listener.
 */
export function disconnect (): void {

  if (!observers.history) return;

  removeEventListener('popstate', pop);

  if (config.persist) {
    removeEventListener('beforeunload', persist, { capture: true });
  }

  observers.history = false;

}
