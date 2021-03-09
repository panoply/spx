import merge from 'mergerino'

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
      this.update.dom()
      this.update.request()

    }

    ,

    /* -------------------------------------------- */
    /* STARTED                                      */
    /* -------------------------------------------- */

    get started () {

      return state.started

    }

    ,

    set started (status) {

      state.started = status

    }

    ,

    /* -------------------------------------------- */
    /* CACHE                                        */
    /* -------------------------------------------- */

    /**
     * @return {Map<string, IPjax.IState>}
     */
    get cache () {

      return state.cache

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

    /**
     * @return {IPjax.IDom}
     */
    get dom () {

      return state.dom

    }

    ,

    /* -------------------------------------------- */
    /* REQUEST GETTER                               */
    /* -------------------------------------------- */

    /**
     * @return {IPjax.IRequest}
     */
    get request () {

      return state.request

    }

    ,

    /* -------------------------------------------- */
    /* UPDATES                                      */
    /* -------------------------------------------- */

    update: {

      /* CONFIG ------------------------------------- */

      config: (
        initial => patch => (
          state.config = merge(
            initial,
            patch
          )
        )
      )(
        {
          target: [
            'main',
            '#navbar',
            '[script]'
          ],
          method: 'replace',
          prefetch: true,
          cache: true,
          throttle: 0,
          progress: false,
          threshold: {
            intersect: 250,
            hover: 100
          }
        }
      )

      ,

      /* PAGE --------------------------------------- */

      page: (
        initial => patch => (
          state.page = merge(
            state.page || initial,
            patch
          )
        )
      )(
        {
          url: '',
          snapshot: '',
          target: [],
          chunks: Object.create(null),
          method: 'replace',
          prefetch: 'intersect',
          action: {},
          cache: null,
          progress: false,
          reload: false,
          throttle: 0,
          location: {
            protocol: '',
            origin: '',
            hostname: '',
            href: '',
            pathname: '',
            search: ''
          },
          position: {
            x: 0,
            y: 0
          }
        }
      )

      ,

      /* DOM ---------------------------------------- */

      dom: (
        initial => patch => (
          state.dom = merge(
            state.dom || initial,
            { ...patch, tracked: initial.tracked }
          )
        )
      )(
        {
          tracked: new Set(),
          head: Object.create(null)
        }
      )

      ,

      request: (
        initial => patch => (
          state.request = merge(
            state.request || initial,
            { ...patch, xhr: initial.xhr }
          )
        )
      )(
        {
          xhr: new Map(),
          cache: {
            weight: '0 B',
            total: 0,
            limit: 50000000 // = 50 MB
          }
        }
      )
    }

  })

)(
  Object.create(
    {
      started: false,
      cache: new Map()
    }
  )
)
