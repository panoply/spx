import * as hrefs from '../observers/hrefs';
import * as hover from '../observers/hover';
import * as intersect from '../observers/intersect';
import * as scroll from '../observers/scroll';
import * as history from '../observers/history';
import browser from 'history/browser';
import { url, parse } from './path';
import * as store from './store';

/**
 * Sets initial page state executing on intial load.
 * Caches page so a return navigation does not perform
 * an extrenous request.
 */
function onload (): void {

  const page = store.capture({
    url,
    location: parse(url),
    position: scroll.position
  }, document.documentElement.outerHTML);

  browser.replace(window.location, page);

  removeEventListener('load', onload);

}

/**
 * Initialize
 */
export function initialize (): void {

  if (!store.ready.controller) {

    history.start();
    hrefs.start();
    scroll.start();
    hover.start();
    intersect.start();

    addEventListener('load', onload);

    store.ready.controller = true;

    console.info('Pjax: Connection Established ⚡');
  }
}

/**
 * Destory Pjax instances
 */
export function destroy (): void {

  if (store.ready.controller) {

    history.stop();
    hrefs.stop();
    scroll.stop();
    hover.stop();
    intersect.stop();
    store.clear();

    store.ready.controller = false;

    console.warn('Pjax: Instance has been disconnected! 😔');

  } else {

    console.warn('Pjax: No connection made, disconnection is void 🙃');
  }

}
