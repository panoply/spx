import browser from 'history/browser';
import { BrowserHistory, createPath } from 'history';
import * as render from '../app/render';
import * as request from '../app/request';
import * as store from '../app/store';
import { position } from './scroll';
import { IPage } from '../types/page';
import { connect } from '../app/connects';
import merge from 'mergerino';

let unlisten: () => void = null;

let inTransit: string;

/**
 * Popstate Navigation
 */
async function popstate (url: string, state: IPage): Promise<void|IPage> {

  if (url !== inTransit) request.cancel(inTransit);

  if (store.has(url)) {
    if (state.type === 'reverse') {
      return render.update(store.pages.update(url, { position: state.position }), true);
    } else {
      return render.update(store.pages.get(url), true);
    }
  }

  inTransit = url;

  const page = await request.get(state);

  return page ? render.update(page, true) : location.assign(url);

};

/**
 * Event History dispatch controller, handles popstate,
 * push and replace events via third party module
 */
function listener ({ action, location }: BrowserHistory) {

  if (action === 'POP') return popstate(createPath(location), location.state);

};

/**
 * Attached `history` event listener.
 */
export function start (): void {

  if (!connect.history) {
    unlisten = browser.listen(listener);
    connect.history = true;
  }

}

/**
 * Removed `history` event listener.
 */
export function stop (): void {

  if (connect.history) {
    unlisten();
    connect.history = false;
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
  const updated = merge(location.state, { position });

  console.log(location);

  browser.replace(location, updated);

  return updated;

}
