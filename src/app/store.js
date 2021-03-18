import merge from 'mergerino'

/**
 * Snapshots Cache
 *
 * @exports
 */
export const snapshots = new Map()

/**
 * @exports
 * @type {Map<string, number>}
 */
export const transit = new Map()

/**
 * Tracked Elements
 *
 * @exports
 * @type {Set<string>}
 */
export const tracked = new Set()

/**
 * XHR Requests
 *
 * @type {Map<string, XMLHttpRequest>}
 */
export const requests = new Map()

/**
 * Cache
 *
 * @exports
 * @type {Map<string, IPjax.IState>}
 */
export const cache = new Map()

/**
 * store
 */
export const store = (

  /**
   * @param {IPjax.IStoreState} state
   */
  state => ({

    /**
     * Connect Store
     *
     * MUST BE CALLED TO UPON INITIALIZATION
     *
     * @param {IPjax.IConfigPresets} options
     */
    connect (options) {

      this.update.config(options)
      this.update.page(this.config)

    }

    ,

    /* -------------------------------------------- */
    /* STARTED                                      */
    /* -------------------------------------------- */

    get started () {

      if (state?.started) state.started = false

      return state.started

    }

    ,

    set started (status) {

      state.started = status

    }

    ,
    /* -------------------------------------------- */
    /* STORE GETTERS                                */
    /* -------------------------------------------- */

    /**
     * @return {IPjax.IConfigPresets}
     */
    get config () {

      return state.config

    }

    ,

    /**
     * @return {IPjax.IState}
     */
    get page () {

      return state.page

    }

    ,

    /* -------------------------------------------- */
    /* UPDATES                                      */
    /* -------------------------------------------- */

    update: {

      /* CONFIG ------------------------------------- */

      config: (
        initial => patch => (
          state.config = merge(initial, patch)
        )
      )(
        {
          target: [ 'main', '#navbar' ],
          method: 'replace',
          prefetch: true,
          cache: true,
          throttle: 0,
          progress: false,
          threshold: {
            intersect: 250,
            hover: 100,
            progress: 10
          }
        }
      )

      ,

      /* PAGE --------------------------------------- */

      page: (
        initial => patch => (
          state.page = merge(
            initial,
            {
              ...patch
              , target: state.config.target
              , action: {
                replace: null,
                append: null,
                prepend: null
              }
            }
          )
        )
      )(
        {
          url: '',
          snapshot: '',
          captured: null,
          target: [],
          title: '',
          method: 'replace',
          prefetch: 'hover',
          cache: null,
          progress: false,
          action: {
            replace: null,
            prepend: null,
            append: null
          },
          location: {
            origin: '',
            hostname: '',
            href: '',
            pathname: '',
            search: '',
            hash: '',
            lastUrl: ''
          },
          position: {
            x: 0,
            y: 0
          }
        }
      )

    }

  })

)(Object.create(null))
