import browser from 'history/browser';
import { BrowserHistory, createPath } from 'history';
import * as render from '../app/render';
import * as request from '../app/request';
import * as store from '../app/store';
import { position } from './scroll';
import { IPage } from '../types/page';
import { assign } from '../constants/native';

let unlisten: ()=> void = null;
let inTransit: string;

/**
 * Popstate Navigation
 */
async function popstate (url: string, state: IPage): Promise<void|IPage> {

  if (url !== inTransit) request.cancel(inTransit);

  if (store.has(url, { snapshot: true })) {
    return render.update(store.get(url).page, true);
  }

  inTransit = url;

  const page = await request.get(state);

  return page
    ? render.update(page, true)
    : location.assign(url);

};

/**
 * Event History dispatch controller, handles popstate,
 * push and replace events via third party module
 */
function listener ({ action, location }: BrowserHistory) {

  if (action === 'POP') {
    return popstate(createPath(location), location.state);
  }

};

/**
 * Attached `history` event listener.
 */
export function start (): void {

  if (!store.ready.history) {
    unlisten = browser.listen(listener);
    store.ready.history = true;
  }

}

/**
 * Removed `history` event listener.
 */
export function stop (): void {

  if (store.ready.history) {
    unlisten();
    store.ready.history = false;
  }
}

/**
 * Execute a history state replacement for the current
 * page location. It's intended use is to update the
 * current scroll position and any other values stored
 * in history state.
 *
 */
export function updateState (): IPage {

  const { location } = browser;
  const updated = assign({}, location.state, { position });

  browser.replace(location, updated);

  return updated;

}
