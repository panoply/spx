import { PartialPath } from 'history'



/**
 * Scroll position records
 */
export type IPosition = {
  x: number,
  y: number
}

/**
 * Methods
 */
export enum IMethods {

  /**
   * Initialized
   */
  Initial = 1,

  /**
   * Initialized
   */
  Click = 2,

  /**
   * Prefetch
   */
  Prefetch = 3,

  /**
   * Cache
   */
  Cache = 4,

  /**
   * Pop
   */
  Pop = 5,

  /**
   * Capture
   */
  Capture = 6
}

/**
 * The URL location object
 */
export interface ILocation extends PartialPath {
  /**
   * The URL Pathname
   *
   * @example
   * '/pathname' OR '/pathname/foo/bar'
   */
  pathname?: string

  /**
   * The URL search params
   *
   * @example
   * '?param=foo&bar=baz'
   */
  search?: string

  /**
   * The URL Hash
   *
   * @example
   * '#foo'
   */
  hash?: string

  /**
   * The previous path href URL.
   * This is also the cache identifier
   *
   * @example
   * '/pathname' OR '/pathname?foo=bar'
   */
  lastpath?: string

}

/**
 * NProgress Exposed Configuration Options
 */
export interface IProgress {
  /**
   * Changes the minimum percentage used upon starting.
   *
   * @default 0.08
   */
  minimum?: number
  /**
   * CSS Easing String
   *
   * @default cubic-bezier(0,1,0,1)
   */
  easing?: string
  /**
   * Animation Speed
   *
   * @default 200
   */
  speed?: number
  /**
   * Turn off the automatic incrementing behavior
   * by setting this to false.
   *
   * @default true
   */
  trickle?: boolean
  /**
   * Adjust how often to trickle/increment, in ms.
   *
   * @default 200
   */
  trickleSpeed?: number
  /**
   * Turn on loading spinner by setting it to `true`
   *
   * @default false
   */
  showSpinner?: boolean
}


export interface IPresets {

  /**
   * Default fallback and preset fragments. By default, this pjax module will replace the
   * entire `<body>` fragment. Its best to define specific fragments here to prevent replacing
   * static elements upon each navigation.
   *
   * ---
   * @default ['body']
   */
  targets?: string[],

  /**
   * Request Configuration
   */
  request?: {

    /**
     * The timeout limit of the XHR request issued. If timeout limit is exceeded a
     * normal page visit will executed.
     *
     * ---
     * @default 1500
     */
    timeout?: number,

    /**
     * Throttle rate limits used when a request is already in transit. If you are leveraging
     * prefetch capabilities then throttle limit will prevent requests already in-flight from
     * occuring and instead wait until the initial request completes.
     *
     * ---
     * @default 150
     */
    throttle?: number,

    /**
     * FEATURE NOT YET AVAILABLE
     *
     * Define the request dispatch. By default, request are fetched upon mousedown, this allows
     * fetching to start sooner that it would from an click event.
     *
     * > Currently, fetches are executed on `mousedown` only. Future releases will provide click
     * dispatches
     *
     * ---
     * @default 'mousedown'
     */
    readonly dispatch?: 'mousedown'
  },

  /**
   * Prefetch configuration
   */
  prefetch?: {

   /**
    * Mouseover prefetching preset configuration
    */
    mouseover?: {
     /**
      * Enable or Disable mouseover (hover) prefetching. When enabled, this option
      * will allow you to fetch pages over the wire upon mouseover and saves them to
      * cache. When `mouseover` prefetches are disabled, all `data-pjax-prefetch="mouseover"`
      * attribute configs will be ignored.
      *
      * > _If cache if disabled then prefetches will be dispatched using HTML5
      * `<link>` prefetches, else when cache is enabled it uses XHR._
      *
      * ---
      * @default true
      */
      enable?: boolean,

     /**
      * Controls the mouseover fetch delay threshold. Requests will fire on mouseover
      * only after the threshold time has been exceeded. This helps limit extrenous
      * requests from firing.
      *
      * ---
      * @default 250
      */
      threshold?: number
    },

   /**
    * Intersection prefetching preset configuration
    */
    intersect?: {
     /**
      * Enable or Disable intersection prefetching. Intersect prefetching leverages the
      * Intersection Observer API to fire requests when elements become visible in viewport.
      * When intersect prefetches are disabled, all `data-pjax-prefetch="intersect"`
      * attribute configs will be ignored.
      *
      * > _If cache if disabled then prefetches will be dispatched using HTML5
      * `<link>` prefetches, else when cache is enabled it uses XHR._
      *
      * ---
      * @default true
      */
      enable?: boolean,

      /**
       * Threshold limit passed to the intersection observer instance
       *
       * ---
       * @default 0
       */
      threshold?: number
    }
  },

  /**
   * Caching engine configuration
   */
  cache?: {

   /**
    * Enable or Disable caching. Each page visit request is cached and used in
    * subsequent visits to the same location. By disabling cache, all visits will
    * be fetched over the network and any `data-pjax-cache` attribute configs
    * will be ignored.
    *
    * ---
    * @default true
    */
    enable?: boolean

   /**
    * Cache size limit. This pjax variation limits cache size to `25mb`and once size
    * exceeds that limit, records will be removed starting from the earliest point
    * cache entry.
    *
    * _Generally speaking, leave this the fuck alone._
    *
    * ---
    * @default 50
    */
    limit?: number,

    /**
     * FEATURE NOT YET AVAILABLE
     *
     * The save option will save snapshot cache to IndexedDB.
     * This feature is not yet available.
     *
     * ---
     * @default false
     */
    readonly save?: boolean
  },

  /**
   * Progress Bar configuration
   */
  progress?: {

   /**
    * Enable or Disables the progress bar globally. Setting this option
    * to `false` will prevent progress from displaying. When disabled,
    * all `data-pjax-progress` attribute configs will be ignored.
    *
    * ---
    * @default true
    */
    enable?: boolean,

   /**
    * Controls the progress bar preset threshold. Defines the amount of
    * time to delay before the progress bar is shown.
    *
    * ---
    * @default 350
    */
    threshold?: number,

    /**
     * [N Progress](https://github.com/rstacruz/nprogress) provides the
     * progress bar feature which is displayed between page visits.
     *
     * > _This pjax module does not expose all configuration options of nprogress,
     * but does allow control of some internals. Any configuration options
     * defined here will be passed to the nprogress instance upon initialization._
     */
    options?: IProgress
  }

}

/**
 * Page Visit State
 *
 * Configuration from each page visit. For every page navigation
 * the configuration object is generated in a immutable manner.
 */
export interface IPage {

  /**
   * The URL cache key and current url path
   */
  url?: string

  /**
   * UUID reference to the page snapshot HTML Document element
   */
  snapshot?: string

  /**
   * UUID to a captured snapshot HTML string. Captures are temporary
   * snapshots used to preserve the document when navigating between history
   * popstate. Captured snapshots are removed upon subsequent visits to location.
   */
  captured?: boolean | string

  /**
   * Location URL
   */
  location?: ILocation

  /**
   * The Document title
   */
  title?: string

  /**
   * List of target element selectors. Accepts any valid
   * `querySelector()` string.
   *
   * @example
   * ['#main', '.header', '[data-attr]', 'header']
   */
  targets?: string[]

  /**
   * List of fragment element selectors. Accepts any valid
   * `querySelector()` string.
   *
   * @example
   * ['#main', '.header', '[data-attr]', 'header']
   */
  replace?: boolean | string[]

  /**
   * List of fragments to be appened from and to. Accepts multiple.
   *
   * @example
   * [['#main', '.header'], ['[data-attr]', 'header']]
   */
  append?:boolean | Array<[from: string, to: string]>,

  /**
   * List of fragments to be prepend from and to. Accepts multiple.
   *
   * @example
   * [['#main', '.header'], ['[data-attr]', 'header']]
   */
  prepend?: boolean | Array<[from: string, to: string]>

  /**
   * Controls the caching engine for the link navigation.
   * Option is enabled when `cache` preset config is `true`.
   * Each pjax link can set a different cache option, see below:
   * ---
   * `false`
   *
   * Passing in __false__ will execute a pjax visit that will
   * not be saved to cache and if the link exists in cache
   * it will be removed.
   *
   * `reset`
   *
   * Passing in __reset__ the cache record will be removed,
   * a new pjax visit will be executed and the result saved to cache.
   *
   * `flush`
   *
   * Passing in __flush__ will completely flush cache, removing all
   * saved records.
   */
  cache?: boolean  | string

  /**
   * Scroll position of the next navigation.
   *
   * ---
   * `x` - Equivalent to `scrollLeft` in pixels
   *
   * `y` - Equivalent to `scrollTop` in pixels
   */
  position?: IPosition

  /**
   * Defines the
   *
   * @default 250
   */
  intersect?: number,

  /**
   * Define mouseover timeout from which fetching will begin
   * after time spent on mouseover
   *
   * @default 100
   */
  threshold?: number,

  /**
   * Define proximity prefetch distance from which fetching will
   * begin relative to the cursor offset of href elements.
   *
   * @default 50
   */
  proximity?: number,

  /**
   * Progress bar threshold delay
   *
   * @default 350
   */
  progress?: boolean | number,

}

export as namespace Store;

