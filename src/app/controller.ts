import * as hrefs from '../observers/hrefs';
import * as hover from '../observers/hover';
import * as intersect from '../observers/intersect';
import * as request from './fetch';
import * as history from '../observers/history';
import * as proximity from '../observers/proximity';
import * as scroll from '../observers/scroll';
import * as store from './store';
import { EventType, Errors } from '../shared/enums';
import { getRoute } from './location';
import { log, position } from '../shared/utils';
import { IPage } from 'types';
import { config } from './session';

/**
 * Initialize SPX
 *
 * This function is invoked upon connection and is used to generate
 * an SPX instance. It will run only once, unless SPX re-invokes.
 */
export function initialize (): Promise<IPage> {

  const state = store.create(getRoute(EventType.INITIAL));

  // Connect HistoryAPI push~state observers
  // This MUST be called after we've obtained the initial
  // state reference (above) as history.state will be assigned
  //
  history.connect(state);

  // Record first page
  //
  config.index = state.key;

  /**
   * DOM Ready
   *
   * This function is called returns the intitial page state and is responsible
   * for SPX activation. The promise callback will resolve the return value.
   */
  function DOMReady () {

    hrefs.connect();

    if (config.manual === false) {
      hover.connect();
      intersect.connect();
      proximity.connect();
      scroll.connect();
    }

    const page = store.set(state, document.documentElement.outerHTML);

    if (history.doReverse()) page.rev = history.api.state.rev;

    page.position = position();

    history.replace(page);

    if (page.rev !== page.key) setTimeout(() => request.reverse(page.rev), 0);

    setTimeout(() => request.preload(page), 0);

    return page;

  }

  return new Promise(resolve => {

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      return resolve(DOMReady());
    }

    // FALLBACK
    // Invoked id readyState is matched, likely obsolete
    //
    addEventListener('DOMContentLoaded', () => resolve(DOMReady()), { once: true });

  });

}

export function observe () {

  hover.disconnect();
  hover.connect();

  intersect.disconnect();
  intersect.connect();

  proximity.disconnect();
  proximity.connect();

}

/**
 * Destory SPX instances
 */
export function disconnect (): void {

  history.disconnect();
  hrefs.disconnect();
  hover.disconnect();
  intersect.disconnect();
  proximity.disconnect();

  // Purge Store
  store.clear();

  if (config.globalThis) delete window.spx;

  log(Errors.INFO, 'Disconnected 😔');

}
