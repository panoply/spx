import merge from 'mergerino'
import history from 'history/browser'
import { nanoid } from 'nanoid'
import { dispatchEvent } from './utils'
import scroll from '../observers/scroll'
import * as nprogress from './progress'
import render from './render'

/**
 * store
 */
export default ((config) => {

  /**
   * Cache
   *
   * @exports
   * @type {Map<string, Store.IPage>}
   */
  const cache = new Map()

  /**
   * Cache
   *
   * @exports
   * @type {Map<string, string>}
   */
  const snapshots = new Map()

  /**
   * Preset Configuration
   *
   * @type {object}
   */
  let presets

  return ({

    /**
     * Connects store and intialized the workable
     * state management model. Connect MUST be called
     * upon Pjax initialization. This function acts
     * as a class `constructor` establishing an instance.
     *
     * @param {Store.IPresets} [options]
     */
    connect (options = {}) {

      presets = merge(config, {
        // PRESETS PATCH COPY
        ...options
        , request: { ...options?.request, dispatch: undefined }
        , cache: { ...options?.cache, save: undefined }
      })

      nprogress.config(this.config.progress.options)

    },

    /**
     * Returns the Pjax preset configuration object. Presets are global
     * configurations. This getter will give us access to the defined
     * settings for this Pjax instance.
     *
     * @type {Store.IPresets}
     * @return {Store.IPresets}
     */
    get config () { return presets },

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
     *
     * @param {Store.IPage} state
     * @param  {string} snapshot
     * @returns {Store.IPage}
     */
    create (state, snapshot) {

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

      }

      if (page.cache && dispatchEvent('pjax:cache', page, true)) {
        cache.set(page.url, page)
        snapshots.set(page.snapshot, snapshot)
      }

      return page

    },

    /**
     * Removes cached records. Optionally pass in URL
     * to remove specific record.
     *
     * @param {string} id
     */
    snapshot: id => snapshots.get(id),

    /**
     * Removes cached records. Optionally pass in URL
     * to remove specific record.
     *
     * @param {string} [url]
     */
    clear: url => {
      if (typeof url === 'string') {
        snapshots.delete(cache.get(url).snapshot)
        cache.delete(url)
      } else {
        snapshots.clear()
        cache.clear()
      }
    },

    /**
     * Check if cache record exists with snapshot
     *
     * @param {string} url
     * @param {{snapshot?: boolean}} has
     */
    get: url => ({

      /**
       * @returns {Store.IPage}
       */
      get page () {
        return cache.get(url)
      },

      /**
       * @returns {string}
       */
      get snapshot () {
        if (this.page?.snapshot) {
          return snapshots.get(this.page.snapshot)
        }
      },

      /**
       * @returns {Document}
       */
      get target () {
        return render.parse(this.snapshot)
      }

    }),

    /**
     * Map setters
     */
    get set () {

      return ({

        /**
         * @param {string} key
         * @param {Store.IPage} value
         */
        cache: (key, value) => {
          cache.set(key, value)
          return value
        },

        /**
         * @param {string} key
         * @param {string} value
         */
        snapshots: (key, value) => {
          snapshots.set(key, value)
          return key
        }

      })

    },

    /**
     * Map Deletions
     */
    get delete () {

      return ({

        /**
         * @param {string} url
         */
        cache: url => cache.delete(url),

        /**
         * @param {string} id
         */
        snapshots: id => snapshots.delete(id)

      })

    },

    /**
     * Check if cache record exists with snapshot
     *
     * @param {string} url
     * @param {{snapshot?: boolean}} has
     * @return {boolean}
     */
    has: (url, has = { snapshot: false }) => (

      !has.snapshot ? cache.has(url) : (
        cache.has(url) || snapshots.has(cache.get(url)?.snapshot)
      )

    ),

    /**
     * Update current pushState History
     *
     * @param {string} url
     * @returns {string}
     */
    history: () => {

      history.replace(history.location, {
        ...history.location.state,
        position: scroll.position
      })

      // @ts-ignore
      return history.location.state.url

    },

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
     * @param {Store.IPage} state
     * @returns {Store.IPage}
     */
    update: state => (

      cache
        .set(state.url, merge(cache.get(state.url), state))
        .get(state.url)

    )

  })

})({
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
    options: {
      minimum: 0.10,
      easing: 'ease',
      speed: 225,
      trickle: true,
      trickleSpeed: 225,
      showSpinner: false
    }
  }
})
