import * as hrefs from '../observers/hrefs';
import * as hover from '../observers/mouseover';
import * as intersect from '../observers/intersect';
import * as request from '../app/request';
import * as scroll from '../observers/scroll';
import * as history from '../observers/history';
// import * as proximity from '../observers/proximity';
import { getRoute } from './route';
import { connect, config } from './state';
import * as store from './store';
import { isArray } from '../constants/native';

/**
 * Sets initial page state executing on intial load.
 * Caches page so a return navigation does not perform
 * an extrenous request.
 */
function onload (): void {

  const state = store.create(getRoute());
  state.position = scroll.position();
  const page = store.set(state, document.documentElement.outerHTML);

  if (config.preload !== null) {

    if (isArray(config.preload)) {
      // PRELOAD ARRAY LIST
      for (const path of config.preload) {
        const route = getRoute(path, 'preload');
        if (route.key !== path) request.get(store.create(route));
      }
    } else if (typeof config.preload === 'object' && state.key in config.preload) {
      // PRELOAD SPECIFIC ROUTE LIST
      for (const path of config.preload[state.key]) {
        const route = getRoute(path, 'preload');
        if (route.key !== path) request.get(store.create(route));
      }
    }
  }

  if (!config.reverse) {

    history.create(page);

  } else {

    // PERFORM REVERSE CACHING
    const route = history.previous();

    if (route && route !== state.key) {
      const state = getRoute(route, 'reverse');
      request.get(store.create(state));
    }

    history.update();

  }

  removeEventListener('load', onload);

}

/**
 * Initialize
 */
export function initialize (): void {

  if (!connect.has(1)) {

    history.start();
    scroll.start();
    hrefs.start();
    hover.start();
    intersect.start();
    // proximity.start();

    addEventListener('load', onload);

    connect.add(1);
    console.info('Brixtol Pjax: Connection Established ⚡');
  }
}

/**
 * Destory Pjax instances
 */
export function destroy (): void {

  if (connect.has(1)) {

    history.stop();
    scroll.stop();
    hrefs.stop();
    hover.stop();
    intersect.stop();
    // proximity.stop();
    store.clear();
    connect.delete(1);

    console.warn('Brixtol Pjax: Instance has been disconnected! 😔');

  } else {

    console.warn('Brixtol Pjax: No connection made, disconnection is void 🙃');
  }

}
