import merge from 'mergerino'
import history from 'history/browser'
import { dispatchEvent } from './utils'
import { nanoid } from 'nanoid'
import path from './path'
import scroll from '../observers/scroll'
import * as nprogress from './progress'

/**
 * Snapshots Cache
 *
 * @exports
 */
export const snapshots = new Map()

/**
 * store
 */
export const store = (() => {

  /**
   * Preset Configuration
   *
   * @type {object}
   */
  let presets

  /**
   * Cache
   *
   * @exports
   * @type {Map<string, Store.IPage>}
   */
  const cache = new Map()

  /* CLOSURE IIFE ------------------------------- */

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

      presets = merge(
        {
          targets: [ 'main', '#navbar' ],
          request: {
            timeout: 1500,
            throttle: 150,
            dispatch: 'mousedown'
          },
          prefetch: {
            mouseover: {
              enable: true,
              threshold: 100
            },
            intersect: {
              enable: true,
              threshold: 250
            }
          },
          cache: {
            enable: true,
            limit: 25,
            save: false
          },
          progress: {
            enable: true,
            threshold: 350,
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
        ,
        {

          // PRESETS PATCH COPY

          ...options

          , request: {

            ...options?.request

            // PREVENT DISPATCH PROPERTY FROM PATCH

            , dispatch: undefined
          }
          , cache: {

            ...options?.cache

            // PREVENT SAVE PROPERTY FROM PATCH

            , save: undefined
          }
        }
      )

      nprogress.config(this.config.progress.options)

    },

    /**
     * Sets initial page state executing on intial load.
     * Caches page so a return navigation does not perform
     * an extrenous request.
     *
     * @param {Event} event
     * @returns {void}
     */
    initialize (event) {

      history.replace(history.location, store.create({
        url: path.url,
        location: path.parse(path.url),
        position: scroll.position
      }, document.documentElement.outerHTML))

      removeEventListener('load', this.initialize)

    },

    /**
     * Returns the Pjax preset configuration object. Presets are global
     * configurations. This getter will give us access to the defined
     * settings for this Pjax instance.
     *
     * @type {Store.IPresets}
     * @return {Store.IPresets}
     */
    get config () {

      return presets

    },

    clear: () => {

      cache.clear()
      snapshots.clear()

    },

    /**
     * Check if cache record exists with snapshot
     *
     * @param {string} url
     * @param {{snapshot?: boolean}} has
     * @return {boolean}
     */
    has: (url, has = { snapshot: false }) => {

      return !has.snapshot ? cache.has(url) : (
        cache.has(url) || snapshots.has(cache.get(url)?.snapshot)
      )

    },

    /**
     * Saves a HTML Document String as snapshot
     *
     * @param {string} id
     * @returns {string}
     */
    snapshot: (id) => {

      return snapshots.get(id)

    },

    /**
     * Inserts a page into cache. This function is called upon
     * a new page instance being generated via `new()`. Optionally
     * pass in an `object`to assert into new state.
     *
     * @param {string} url
     * @returns {Store.IPage}
     */
    cache (url) {

      return cache.get(url)

    },

    /**
     * Update current pushState History
     *
     * @param {string} url
     * @returns {void}
     */
    history (url) {

      history.replace(history.location, {
        ...history.location.state,
        position: scroll.position
      })

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
    update: (state) => {

      const page = cache
        .set(state.url, merge(cache.get(state.url), state))
        .get(state.url)

      return page

    },

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
        captured: false,
        append: false,
        prepend: false,
        snapshot: state?.snapshot || nanoid(16),
        position: state?.position || scroll.reset(),
        targets: this.config.targets,
        cache: this.config.cache.enable,
        progress: this.config.progress.threshold,
        threshold: this.config.prefetch.mouseover.threshold,
        ...state
      }

      snapshots.set(page.snapshot, snapshot)

      if (dispatchEvent('pjax:cache', page, true)) cache.set(page.url, page)

      return page

    }

  })

})()
