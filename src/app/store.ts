import merge from 'mergerino';
import history from 'history/browser';
import { nanoid } from 'nanoid';
import { IPage, IOptions } from '../types';
import { dispatchEvent } from './events';
import * as scroll from '../observers/scroll';
import * as progress from './progress';

/**
 * store
 */
export const store = new class Store {

  /**
   * Cache
   */
  public cache: Map<string, IPage> = new Map();

  /**
   * Snapshots
   */
  public snapshots: Map<string, string> = new Map();

  /**
   * Configuration
   */
  public config = {
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
  }

  /**
   * Connects store and intialized the workable
   * state management model. Connect MUST be called
   * upon Pjax initialization. This function acts
   * as a class `constructor` establishing an instance.
   */
  public connect (options: IOptions = {}) {

    this.config = merge(this.config, {
      // PRESETS PATCH COPY
      ...options
      , request: {
        ...options?.request,
        dispatch: undefined
      }
      , cache: {
        ...options?.cache,
        save: undefined
      }
    });

    // Assert Progress
    if (this.config.progress.enable) progress.config(this.config.progress);

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
  public create (state: IPage, snapshot: string): IPage {

    const page = {

      // EDITABLE
      //
      history: true,
      snapshot: state?.snapshot || nanoid(16),
      position: state?.position || scroll.reset(),
      cache: this.config.cache.enable,
      progress: this.config.progress.threshold,
      threshold: this.config.prefetch.mouseover.threshold,

      // USER OPTIONS
      //
      ...state,

      // READ ONLY
      //
      targets: this.config.targets

    };

    if (page.cache && dispatchEvent('pjax:cache', page, true)) {
      this.cache.set(page.url, page);
      this.snapshots.set(page.snapshot, snapshot);
    }

    // console.log(cache, snapshot)

    return page;

  }

  /**
   * Returns a snapshot matching provided ID
   */
  public snapshot (id: string) {

    return this.snapshots.get(id);

  }

  /**
   * Removes cached records. Optionally pass in URL
   * to remove specific record.
   */
  public clear (url?: string): void {

    if (typeof url === 'string') {
      this.snapshots.delete(this.cache.get(url).snapshot);
      this.cache.delete(url);
    } else {
      this.snapshots.clear();
      this.cache.clear();
    }
  }

  /**
  * Check if cache record exists with snapshot
  *
  * @param {string} url
  * @param {{snapshot?: boolean}} has
  */
  public get (url: string) {

    const record: Partial<{
      page: IPage,
      snapshot: string,
      readonly target: Document
    }> = {
      page: this.cache.get(url)
    };

    record.snapshot = record.page?.snapshot
      ? this.snapshots.get(record.page.snapshot)
      : undefined;

    return record;

  }

  public set = {

    /**
     * Sets a provided recrod to cache
     */
    cache: (
      key: string,
      value: IPage
    ): IPage => {

      this.cache.set(key, value);
      return value;
    },

    /**
     * Sets a provided record to snapshot
     */
    snapshots: (
      key: string,
      value: string
    ): string => {

      this.snapshots.set(key, value);
      return key;
    }

  };

  /**
    * Map Deletions
    */
  public delete = {
    cache: (url: string) => this.cache.delete(url),
    snapshots: (id: string) => this.snapshots.delete(id)
  }

  /**
   * Check if cache record exists with snapshot
   */
  public has (url: string, has?: { snapshot?: boolean }): boolean {

    return !has?.snapshot ? this.cache.has(url) : (
      this.cache.has(url) ||
      this.snapshots.has(this.cache.get(url)?.snapshot)
    );

  }

  /**
  * Update current pushState History
  */
  public history (): string {

    history.replace(history.location, {
      ...history.location.state,
      position: scroll.position
    });

    // @ts-ignore
    return history.location.state.url;

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
  * The cache will e updated accordingly, so `this.page` will provide
  * access to the updated instance.
  *
  * @param {IPage} state
  * @returns {IPage}
  */
  public update (state: IPage): IPage {

    return this.cache
      .set(state.url, merge(this.cache.get(state.url), state))
      .get(state.url);

  }

}();
