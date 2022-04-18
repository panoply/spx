import * as hrefs from '../observers/hrefs';
import * as hover from '../observers/hover';
import * as intersect from '../observers/intersect';
import * as request from './fetch';
import * as scroll from '../observers/scroll';
import * as history from '../observers/history';
import * as proximity from '../observers/proximity';
import * as store from './store';
import { EventType, Errors } from '../shared/enums';
import { getRoute } from './route';
import { config } from './session';
import { emit } from './events';
import { isArray } from '../shared/native';
import { forEach, log } from '../shared/utils';

/**
 * Sets initial page state executing on intial load.
 * Caches page so a return navigation does not perform
 * an extrenous request.
 */
function onload (): void {

  const state = store.create(getRoute(EventType.INITIAL));
  const reverse = history.reverse();
  const page = store.set(state, document.documentElement.outerHTML);

  if (config.reverse && typeof reverse === 'string') state.rev = reverse;

  state.position = scroll.position();

  emit('connected', page);

  if (config.preload !== null) {

    if (isArray(config.preload)) {

      // PRELOAD ARRAY LIST
      forEach(async path => {
        const route = getRoute(path, EventType.PRELOAD);
        if (route.key !== path) await request.get(store.create(route));
      }, config.preload);

    } else if (typeof config.preload === 'object' && state.key in config.preload) {

      // PRELOAD SPECIFIC ROUTE LIST
      forEach(async path => {
        const route = getRoute(path, EventType.PRELOAD);
        if (route.key !== path) await request.get(store.create(route));
      }, config.preload[state.key]);

    }
  }

  history.replace(page);

  // PERFORM REVERSE CACHING
  if (page.rev !== page.key) {
    request.get(store.create(getRoute(page.rev, EventType.REVERSE)));
  }

  removeEventListener('load', onload);

}

/**
 * Initialize
 */
export function initialize (): void {

  history.connect();
  scroll.connect();
  hrefs.connect();
  hover.connect();
  intersect.connect();
  proximity.connect();

  addEventListener('load', onload);

  log(Errors.INFO, 'Connected ⚡');

}

/**
 * Destory Pjax instances
 */
export function destroy (): void {

  history.disconnect();
  scroll.disconnect();
  hrefs.disconnect();
  hover.disconnect();
  intersect.disconnect();
  proximity.disconnect();

  // Purge Store
  store.clear();

  log(Errors.INFO, 'Disconnected 😔');

}
