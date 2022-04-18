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
import { log } from '../shared/utils';

/**
 * Sets initial page state executing on intial load.
 * Caches page so a return navigation does not perform
 * an extrenous request.
 */
function onload (): void {

  const state = store.create(getRoute(EventType.INITIAL));
  const page = store.set(state, document.documentElement.outerHTML);
  const reverse = history.reverse();

  if (config.reverse && typeof reverse === 'string') state.rev = reverse;

  state.position = scroll.position();

  emit('connected', page);

  history.replace(page);
  request.preload(state);
  request.reverse(page);

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

  log(Errors.INFO, 'Connection Established ⚡');

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
