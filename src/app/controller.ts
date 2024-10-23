import type { Page } from 'types';
import { $, ctx } from './session';
import { VisitType } from '../shared/enums';
import { getRoute } from './location';
import { enqueue, parse, takeSnapshot } from '../shared/utils';

import * as log from '../shared/logs';
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
import { m } from 'src/shared/native';
import { emit } from './events';

/**
 * Initialize SPX
 *
 * This function is invoked upon connection and is used to generate
 * an SPX instance. It will run only once, unless SPX re-invokes.
 */
export const initialize = (): Promise<Page> => {

  const route = getRoute(VisitType.INITIAL);

  // Connect HistoryAPI push~state observers
  // This MUST be called after we've obtained the initial
  // state reference (above) as history.state will be assigned
  //
  const state = history.connect(q.create(route));

  // Set the refs getter reflection on session context
  Object.defineProperty(ctx, 'refs', {
    configurable: false,
    enumerable: false,
    get () {
      return this.snaps.length > 0 ? this.snaps[this.snaps.length - 1][1] : m();
    }
  });

  // Set common used getter reflections on the main $ session model.
  Object.defineProperties($, {
    prev: {
      get: () => $.pages[$.history.rev]
    },
    page: {
      get: () => $.pages[$.history.key]
    },
    snapDom: {
      get: () => parse($.snaps[$.page.snap])
    }
  });

  /**
   * DOM Ready
   *
   * This function is called returns the intitial page state and is responsible
   * for SPX activation. The promise callback will resolve the return value.
   */
  const DOMContentLoaded = () => {

    const page = q.set(state, takeSnapshot());

    hrefs.connect();
    fragment.connect();
    hover.connect();
    intersect.connect();
    proximity.connect();
    components.connect();
    // mutations.connect();

    emit('connect', page);

    enqueue(
      () => q.patch('type', VisitType.VISIT),
      async () => await request.reverse(page),
      async () => await request.preload(page)
    );

    return page;

  };

  return new Promise(resolve => {

    document.readyState === 'loading'
      ? addEventListener('DOMContentLoaded', () => resolve(DOMContentLoaded()))
      : resolve(DOMContentLoaded());

  });

};

/**
 * Destory SPX instances
 */
export const disconnect = (): void => {

  history.disconnect();
  hrefs.disconnect();
  // mutations.disconnect();
  hover.disconnect();
  intersect.disconnect();
  proximity.disconnect();

  if ($.config.components) {
    components.disconnect();
    components.teardown();
    $.registry.clear();
  }

  // Purge q
  q.clear();

  if ($.config.globalThis) delete window.spx;

  log.info('Disconnected');

};
