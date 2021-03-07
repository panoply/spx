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
      this.update.prefetch()
      this.update.dom()
      this.update.hrefs()
      this.update.request()

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
    /* OBSERVER GETTERS                             */
    /* -------------------------------------------- */

    /**
     * @return {IPjax.IPrefetch}
     */
    get prefetch () {

      return state.prefetch

    }

    ,

    /**
     * @return {IPjax.IHrefs}
     */
    get hrefs () {

      return state.hrefs

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
          action: 'replace',
          prefetch: true,
          cache: true,
          throttle: 0,
          progress: false
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
          action: 'replace',
          prefetch: 'intersect',
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

      prefetch: (
        initial => patch => (
          state.prefetch = merge(
            initial,
            { ...patch, transit: initial.transit }
          )
        )
      )(
        {
          nodes: null,
          started: false,
          transit: new Map(),
          threshold: {
            intersect: 200,
            hover: 100
          }
        }
      )

      ,

      hrefs: (
        initial => patch => (
          state.hrefs = merge(
            initial,
            { ...patch, attrs: initial.attrs }
          )

        )
      )(
        {
          started: false,
          attrs: [
            'target',
            'action',
            'prefetch',
            'cache',
            'progress',
            'throttle',
            'position',
            'reload'
          ]
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
      cache: new Map()
    }
  )
)
