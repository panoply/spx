import type { Page } from 'types';
import { $ } from './session';
import { VisitType, Log } from '../shared/enums';
import { getRoute } from './location';
import { log } from '../shared/logs';
import { onNextTick } from '../shared/utils';
import { d } from '../shared/native';
import { parse, takeSnapshot } from '../shared/dom';
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

/**
 * Initialize SPX
 *
 * This function is invoked upon connection and is used to generate
 * an SPX instance. It will run only once, unless SPX re-invokes.
 */
export function initialize (): Promise<Page> {

  const route = getRoute(VisitType.INITIAL);

  // Connect HistoryAPI push~state observers
  // This MUST be called after we've obtained the initial
  // state reference (above) as history.state will be assigned
  //
  const state = history.connect(q.create(route));

  Object.defineProperties($, {
    prev: { get: () => $.pages[$.history.rev] },
    page: { get: () => $.pages[$.history.key] },
    snapDom: { get: () => parse($.snaps[$.page.snap]) }
  });

  /**
   * DOM Ready
   *
   * This function is called returns the intitial page state and is responsible
   * for SPX activation. The promise callback will resolve the return value.
   */
  const DOMContentLoaded = () => {

    const page = q.set(state, takeSnapshot());

    // We mark the document <html> element
    d().id = page.snap;

    hrefs.connect();
    fragment.connect();
    hover.connect();
    intersect.connect();
    proximity.connect();
    components.connect();
    mutations.connect();

    onNextTick(() => {
      q.patch('type', VisitType.VISIT);
      request.reverse(page);
      request.preload(page);
    }, 500);

    return page;

  };

  return new Promise(resolve => {

    document.readyState === 'loading'
      ? addEventListener('DOMContentLoaded', () => resolve(DOMContentLoaded()))
      : resolve(DOMContentLoaded());

  });

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
    $.components.$registry.clear();
  }

  // Purge q
  q.clear();

  if ($.config.globalThis) delete window.spx;

  log(Log.INFO, 'Disconnected');

}
