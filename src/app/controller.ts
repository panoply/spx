import type { IPage } from 'types';
import { VisitType, Errors } from '../shared/enums';
import { getRoute } from './location';
import { log } from '../shared/logs';
import { onNextTick } from '../shared/utils';
import { defineProps } from '../shared/native';
import { parse, takeSnapshot } from '../shared/dom';
import { $ } from './session';
import * as q from './queries';
import * as hrefs from '../observe/hrefs';
import * as hover from '../observe/hovers';
import * as intersect from '../observe/intersect';
import * as request from './fetch';
import * as history from '../observe/history';
import * as proximity from '../observe/proximity';
import * as components from '../observe/components';
import * as mutations from '../observe/mutations';
import * as fragment from '../observe/fragment';

// import * as timer from '../test/timer';

/**
 * Initialize SPX
 *
 * This function is invoked upon connection and is used to generate
 * an SPX instance. It will run only once, unless SPX re-invokes.
 */
export function initialize (): Promise<IPage> {

  const route = getRoute(VisitType.INITIAL);

  // Connect HistoryAPI push~state observers
  // This MUST be called after we've obtained the initial
  // state reference (above) as history.state will be assigned
  //
  const state = history.connect(q.create(route));

  defineProps($, {
    prev: {
      get () { return $.pages[history.api.state.rev]; }
    },
    page: {
      get () { return $.pages[history.api.state.key]; }
    },
    snapDom: {
      get () { return parse($.snaps[$.page.snap]); }
    }
  });

  /**
   * DOM Ready
   *
   * This function is called returns the intitial page state and is responsible
   * for SPX activation. The promise callback will resolve the return value.
   */
  const DOMReady = () => {

    const page = q.set(state, takeSnapshot());

    hrefs.connect();
    fragment.connect();

    if ($.config.manual === false) {
      hover.connect();
      intersect.connect();
      proximity.connect();
      components.connect();
      mutations.connect();
    }

    onNextTick(() => {
      q.patch('type', VisitType.VISIT);
      request.reverse(page);
      request.preload(page);
    });

    return page;

  };

  return new Promise(resolve => {

    const { readyState } = document;

    if (readyState === 'interactive' || readyState === 'complete') {
      return resolve(DOMReady());
    }

    // FALLBACK
    // Invoked if readyState is not matched, likely obsolete
    //
    addEventListener('DOMContentLoaded', () => resolve(DOMReady()));

  });

}

export function observe () {

  hover.disconnect();
  hover.connect();

  intersect.disconnect();
  intersect.connect();

  proximity.disconnect();
  proximity.connect();

  components.disconnect();
  components.connect();

  mutations.disconnect();
  mutations.connect();

}

/**
 * Destory SPX instances
 */
export function disconnect (): void {

  history.disconnect();
  hrefs.disconnect();
  mutations.disconnect();
  hover.disconnect();
  intersect.disconnect();
  proximity.disconnect();

  if ($.config.components) {
    components.disconnect();
    components.teardown();
    $.components.registry.clear();
  }

  // Purge q
  q.clear();

  if ($.config.globalThis) delete window.spx;

  log(Errors.INFO, 'Disconnected');

}
