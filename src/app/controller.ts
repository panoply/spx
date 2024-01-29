import * as hrefs from '../observers/hrefs';
import * as hover from '../observers/hover';
import * as intersect from '../observers/intersect';
import * as request from './fetch';
import * as history from '../observers/history';
import * as proximity from '../observers/proximity';
import * as components from '../observers/components';
import * as store from './store';
import { EventType, Errors } from '../shared/enums';
import { getRoute } from './location';
import { log, onNextTick } from '../shared/utils';
import { IPage } from 'types';
import { $ } from './session';
import { defineProps } from '../shared/native';

// import * as timer from '../test/timer';

/**
 * Initialize SPX
 *
 * This function is invoked upon connection and is used to generate
 * an SPX instance. It will run only once, unless SPX re-invokes.
 */
export function initialize (): Promise<IPage> {

  const route = getRoute(EventType.INITIAL);

  // Connect HistoryAPI push~state observers
  // This MUST be called after we've obtained the initial
  // state reference (above) as history.state will be assigned
  //
  const state = history.connect(store.create(route));

  defineProps($, {
    page: {
      get () {
        return $.pages[history.api.state.key];
      }
    },
    snap: {
      get () {
        return $.snaps[$.page.uuid];
      }
    }
  });

  // Record first page
  //
  $.index = state.key;

  /**
   * DOM Ready
   *
   * This function is called returns the intitial page state and is responsible
   * for SPX activation. The promise callback will resolve the return value.
   */
  const DOMReady = () => {

    const page = store.set(state, document.documentElement.outerHTML);

    hrefs.connect();

    if ($.config.manual === false) {
      hover.connect();
      intersect.connect();
      proximity.connect();
      components.connect();
    }

    onNextTick(() => {
      if (page.rev !== page.key) request.reverse(page.rev);
      request.preload(page);
    });

    return page;

  };

  return new Promise(resolve => {

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      return resolve(DOMReady());
    }

    // FALLBACK
    // Invoked if readyState is matched, likely obsolete
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

  if ($.components.registry.size > 0) {
    $.components.registry.clear();
  }

  // Purge Store
  store.clear();

  if ($.config.globalThis) delete window.spx;

  log(Errors.INFO, 'Disconnected');

}
