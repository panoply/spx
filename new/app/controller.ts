import * as hrefs from '../observers/hrefs';
import * as hover from '../observers/hover';
import * as intersect from '../observers/intersect';
import * as scroll from '../observers/scroll';
import * as history from '../observers/history';
import _history from 'history/browser';
import { url, parse } from './path';
import { store } from './store';

let connected: boolean = false;

/**
 * Sets initial page state executing on intial load.
 * Caches page so a return navigation does not perform
 * an extrenous request.
 */
function onload (): void {

  const page = store.create({
    url,
    location: parse(url),
    position: scroll.position
  }, document.documentElement.outerHTML);

  _history.replace(window.location, page);

  removeEventListener('load', onload);

}

/**
 * Initialize
 */
export function initialize ():void {

  if (!connected) {

    history.start();
    hrefs.start();
    scroll.start();
    hover.start();
    intersect.start();

    addEventListener('load', onload);

    connected = true;

    console.info('Pjax: Connection Established ⚡');
  }
}

/**
 * Destory Pjax instances
 */
export function destroy (): void {

  if (connected) {

    history.stop();
    hrefs.stop();
    scroll.stop();
    hover.stop();
    intersect.stop();
    store.clear();

    connected = false;

    console.warn('Pjax: Instance has been disconnected! 😔');

  } else {

    console.warn('Pjax: No connection made, disconnection is void 🙃');
  }

}
