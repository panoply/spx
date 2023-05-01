import * as hrefs from '../observers/hrefs';
import * as hover from '../observers/hover';
import * as intersect from '../observers/intersect';
import * as request from './fetch';
import * as history from '../observers/history';
import * as proximity from '../observers/proximity';
import * as store from './store';
import { EventType, Errors } from '../shared/enums';
import { getRoute } from './location';
import { log, position } from '../shared/utils';
import { IPage } from 'types';
import { config } from './session';

/**
 * Initialize
 */
export function initialize (): Promise<IPage> {

  history.connect();

  const state = store.create(getRoute(EventType.INITIAL));

  // record first page
  config.index = state.key;

  return new Promise(resolve => {

    addEventListener('DOMContentLoaded', () => {

      hrefs.connect();

      if (config.manual === false) {
        hover.connect();
        intersect.connect();
        proximity.connect();
      }

      const page = store.set(state, document.documentElement.outerHTML);

      if (history.doReverse()) page.rev = history.api.state.rev;

      page.position = position();

      history.replace(page);

      if (page.rev !== page.key) setTimeout(() => request.reverse(page.rev));

      setTimeout(() => request.preload(page));

      resolve(page);

    }, { once: true });

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

  log(Errors.INFO, 'Disconnected 😔');

}
