import merge from 'mergerino';
import browser from 'history/browser';
import { nanoid } from 'nanoid';
import { IPage } from '../types/page';
import { IOptions } from '../types/options';
import { assign, create } from '../constants/native';
import { dispatchEvent } from './events';
import * as scroll from '../observers/scroll';
import * as progress from './progress';

/**
 * Cache
 */
export const cache: Map<string, IPage> = new Map();

/**
 * Snapshots
 */
export const snapshots: Map<string, string> = new Map();

/**
 * Ready connections
 */
export const ready: {
  controller: boolean;
  history: boolean;
  href: boolean;
  hover: boolean;
  intersect: boolean;
} = create(
  {
    controller: false,
    history: false,
    href: false,
    hover: false,
    intersect: false
  }
);

/**
 * Configuration
 */
export const config: IOptions = {
  targets: [ 'body' ],
  request: {
    timeout: 30000,
    poll: 250,
    async: true,
    dispatch: 'mousedown'
  },
  prefetch: {
    mouseover: {
      enable: true,
      threshold: 100,
      proximity: 0
    },
    intersect: {
      enable: true
    }
  },
  cache: {
    enable: true,
    limit: 25,
    save: false
  },
  progress: {
    enable: true,
    threshold: 850,
    style: {
      render: true,
      colour: '#111',
      height: '2px'
    },
    options: {
      minimum: 0.10,
      easing: 'ease',
      speed: 225,
      trickle: true,
      trickleSpeed: 225,
      showSpinner: false
    }
  }
};

/**
 * Connects store and intialized the workable
 * state management model. Connect MUST be called
 * upon Pjax initialization. This function acts
 * as a class `constructor` establishing an instance.
 */
export function connect (options: IOptions = {}) {

  const updated = merge(config, {
    // PRESETS PATCH COPY
    ...options,
    request: { ...options?.request, dispatch: undefined },
    cache: { ...options?.cache, save: undefined }
  });

  assign(config, updated);

  // Assert Progress
  if (config.progress.enable) progress.config(config.progress);

}

/**
 * Indicates a new page visit or a return page visit. New visits
 * are defined by an event dispatched from a `href` link. Both a new
 * new page visit or subsequent visit will call this function.
 *
 * **Breakdown**
 *
 * Subsequent visits calling this function will have their per-page
 * specifics configs (generally those configs set with attributes)
 * reset and merged into its existing records (if it has any), otherwise
 * a new page instance will be generated including defult preset configs.
 */
export function capture (state: IPage, snapshot: string): IPage {

  const page = {
    history: true,
    snapshot: state?.snapshot || nanoid(16),
    position: state?.position || scroll.reset(),
    cache: config.cache.enable,
    progress: config.progress.threshold,
    threshold: config.prefetch.mouseover.threshold,
    ...state,
    targets: config.targets
  };

  if (page.cache && dispatchEvent('pjax:cache', page, true)) {
    cache.set(page.url, page);
    snapshots.set(page.snapshot, snapshot);
  }

  // console.log(cache, snapshot)

  return page;

}

/**
 * Returns a snapshot matching provided ID
 */
export function snapshot (id: string) {

  return snapshots.get(id);

}

/**
 * Removes cached records. Optionally pass in URL
 * to remove specific record.
 */
export function clear (url?: string): void {

  if (typeof url === 'string') {
    snapshots.delete(cache.get(url).snapshot);
    cache.delete(url);
  } else {
    snapshots.clear();
    cache.clear();
  }
}

/**
* Check if cache record exists with snapshot
*
* @param {string} url
* @param {{snapshot?: boolean}} has
*/
export function get (url: string) {

  const record: Partial<{
    page: IPage,
    snapshot: string,
    readonly target: Document
  }> = {
    page: cache.get(url)
  };

  record.snapshot = record.page?.snapshot
    ? snapshots.get(record.page.snapshot)
    : undefined;

  return record;

}

/**
 * Check if cache record exists with snapshot
 */
export function has (url: string, has?: { snapshot?: boolean }): boolean {

  return !has?.snapshot ? cache.has(url) : (
    cache.has(url) ||
    snapshots.has(cache.get(url)?.snapshot)
  );

}

/**
* Update current pushState History
*/
export function history (): string {

  const { location } = browser;
  const updated = Object.assign({}, location.state, { position: scroll.position });

  browser.replace(location, updated);

  return location.state.url;

}

/**
* Updates page state, this function will run a merge
* on the current page instance and re-assign the `pageState`
* letting to updated config.
*
* If newState contains a different `ILocation.url` value from
* that of the current page instance `url` then it will be updated
* to match that of the `newState.url` value.
*
* The cache will be updated accordingly, so `this.page` will provide
* access to the updated instance.
*
* @param {IPage} state
* @returns {IPage}
*/
export function update (state: IPage): IPage {

  const updated = merge(cache.get(state.url), state);
  cache.set(state.url, updated);

  return updated;

}
