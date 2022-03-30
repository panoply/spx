import { nanoid } from 'nanoid';
import { IPage } from '../types/page';
import { dispatch } from './events';
import { emptyObject, join } from './utils';
import { assign, create as object, define, isArray } from '../constants/native';
import { pages, snaps, config, selectors } from './state';
import * as scroll from '../observers/scroll';
import * as progress from './progress';
import { IConfig, IIntersect, ILocation, IMouseover, IProximity, Options } from 'types';

/**
 * Connects store and intialized the workable
 * state management model. Connect MUST be called
 * upon Pjax initialization. This function acts
 * as a class `constructor` establishing an instance.
 */
export function initialize (options: Options = {}): IConfig {

  if (options.mouseover !== false) {
    assign<IMouseover, Options>(config.mouseover, options.mouseover);
    delete options.mouseover;
  }
  if (options.intersect !== false) {
    assign<IIntersect, Options>(config.intersect, options.intersect);
    delete options.intersect;
  }
  if (options.proximity !== false) {
    assign<IProximity, Options>(config.proximity, options.proximity);
    delete options.proximity;
  }
  if (options.progress !== false) {
    assign(config.progress, options.progress);
    delete options.progress;
  }

  assign(config, options);

  const attr = config.schema === null ? 'data' : `data-${config.schema}`;
  const keys = 'hydrate|append|prepend|replace|progress|threshold|position|proximity|ignore|mouseover';

  selectors.attrs = new RegExp(`^${attr}-(${keys})$`, 'i');
  selectors.eval = `${attr}-eval`;
  selectors.hydrate = `[${attr}-hydrate]`;
  selectors.href = `a:not([${attr}-disable]):not([href^="#"])`;
  selectors.track = `[${attr}-track]:not([${attr}-track=false])`;

  if (typeof config.intersect === 'object') {
    selectors.intersect = `[${attr}-intersect]:not([${attr}-intersect=false])`;
    selectors.interhref = `a:not([${attr}-disable]):not(a[${attr}-intersect=false]):not([href^="#"])`;
  }

  if (typeof config.proximity === 'object') {
    selectors.proximity = join(
      'a',
      `[${attr}-proximity]`,
      `:not([${attr}-proximity=false])`,
      `:not([${attr}-disable])`,
      ':not([href^="#"])'
    );
  }

  if (typeof config.mouseover === 'object') {
    if (config.mouseover.trigger === 'href') {
      selectors.mouseover = `a:not([${attr}-disable]):not([${attr}-mouseover=false]):not([href^="#"])`;
    } else {
      selectors.mouseover = join(
        'a',
        `[${attr}-mouseover]`,
        `:not([${attr}-intersect])`,
        `:not([${attr}-proximity])`,
        `:not([${attr}-disable])`,
        `:not([${attr}-mouseover=false])`,
        ':not([href^="#"])'
      );
    }
  }

  // Assert Progress
  if (config.progress !== false) progress.config(config.progress);

  return config;

}

/**
 * Removes cached records. Optionally pass in URL
 * to remove specific record.
 */
export function clear (url?: string[] | string): void {

  if (typeof url === 'undefined') {

    emptyObject(pages);
    emptyObject(snaps);

  } else if (typeof url === 'string') {

    delete snaps[pages[url].snapshot];
    delete pages[url];

  } else if (isArray(url)) {

    purge(url);

  }

}

/**
 * Defaults
 *
 * Page state defaults applied to `pages` and written
 * to history push state. This is used on each pjax
 * visit and will be overwritten by attribute configs
 * or by any programmatic triggers.
 */
export function create (state: IPage): IPage {

  const page: IPage = object(null);

  page.type = 'visit';
  page.targets = config.targets;
  page.position = scroll.y0x0();
  page.title = document.title;
  page.history = true;
  page.key = null;
  page.location = null;

  if (config.proximity !== false) page.proximity = config.proximity.threshold;
  if (config.mouseover !== false) page.threshold = config.mouseover.threshold;
  if (config.progress !== false) page.progress = config.progress.threshold;

  if (config.cache === false) {
    page.cache = config.cache;
    delete state.cache;
  } else {
    page.cache = config.cache;
  }

  // Conditionally generate snapshot
  if (page.cache && state.cache !== false && !('snapshot' in state)) {
    page.snapshot = nanoid();
  } else if (page.cache === false) {
    page.snapshot = undefined;
    delete state.snapshot;
  }

  return assign(page, state);

};

/**
 * Check if cache record exists with snapshot
 */
export function cache (record?: 'page' | 'snapshot' | 'location') {

  const page = pages[cache.prototype.key];

  if (record === 'page') return page as IPage;
  if (record === 'location') return page.location as ILocation;
  if (record === 'snapshot') return snaps[page.snapshot] as string;

  return {
    page,
    get snapshot () { return snaps[page.snapshot]; }
  };

};

/**
 * Handles a new page visit or a return page visit. New visits
 * are defined by an event dispatched from a `href` link. Both a new
 * new page visit or subsequent visit will call this function.
 *
 * **Breakdown**
 *
 * Subsequent visits calling this function will have their per-page
 * specific state like the config set via attributes reset and merged
 * into its existing records (if it has any), otherwise a new page
 * instance will be generated with the default preset configuration.
 */
export function set (state: IPage, snapshot: string): IPage {

  if (!dispatch('pjax:cache', { state, snapshot }, true)) return;

  pages[state.key] = state;
  cache.prototype.key = state.key;

  if (state.cache) {
    define(snaps, state.snapshot, {
      configurable: true,
      get () { return snapshot; },
      set (dom) { snapshot = dom; }
    });
  }

  return state;

}

/**
 * Check if cache record exists with snapshot
 */
export function update (state: IPage, snapshot?: string): IPage {

  const page = assign(pages[state.key], state);

  if (typeof snapshot === 'string') snaps[page.snapshot] = snapshot;

  return page;

}

/**
 * Check if cache record exists with snapshot
 *
 * @param {string} url
 */
export function get (url: string) {

  const page = pages[url];
  const snapshot = snaps[page.snapshot];

  return ({ page, snapshot });

}

/**
 * Check if cache record exists with snapshot
 */
export function has (url: string): boolean {

  return (url in pages && 'snapshot' in pages[url])
    ? pages[url].snapshot in snaps
    : false;

}

/**
 * Purge
 *
 * Clears all records from store. Optionally provide a list
 * of targets to be cleared. Returns a list of snapshots
 * that remain.
 */
export function purge (targets: string[] = []) {

  return Object.getOwnPropertyNames(pages).forEach((url) => {
    if (!targets.includes(url)) delete pages[url];
    else delete snaps[pages[url].snapshot];
  });

}
