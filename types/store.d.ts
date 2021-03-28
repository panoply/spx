import { PartialPath } from "history";

/**
 * Pjax Events
 */
export type IEvents =
  | "pjax:prefetch"
  | "pjax:trigger"
  | "pjax:click"
  | "pjax:request"
  | "pjax:cache"
  | "pjax:render"
  | "pjax:load";

/**
 * Cache Size
 */
export type ICacheSize = {
  total: number;
  weight: string;
};

/**
 * Scroll position records
 */
export type IPosition = {
  x: number;
  y: number;
};

/**
 * The URL location object
 */
export interface ILocation extends PartialPath {
  /**
   * The URL origin name
   *
   * @example
   * 'https://website.com'
   */
  origin?: string;
  /**
   * The URL Hostname
   *
   * @example
   * 'website.com'
   */
  hostname?: string;

  /**
   * The URL Pathname
   *
   * @example
   * '/pathname' OR '/pathname/foo/bar'
   */
  pathname?: string;

  /**
   * The URL search params
   *
   * @example
   * '?param=foo&bar=baz'
   */
  search?: string;

  /**
   * The URL Hash
   *
   * @example
   * '#foo'
   */
  hash?: string;

  /**
   * The previous page path URL, this is also the cache identifier
   *
   * @example
   * '/pathname' OR '/pathname?foo=bar'
   */
  lastpath?: string;
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
  minimum?: number;
  /**
   * CSS Easing String
   *
   * @default cubic-bezier(0,1,0,1)
   */
  easing?: string;
  /**
   * Animation Speed
   *
   * @default 200
   */
  speed?: number;
  /**
   * Turn off the automatic incrementing behavior
   * by setting this to false.
   *
   * @default true
   */
  trickle?: boolean;
  /**
   * Adjust how often to trickle/increment, in ms.
   *
   * @default 200
   */
  trickleSpeed?: number;
  /**
   * Turn on loading spinner by setting it to `true`
   *
   * @default false
   */
  showSpinner?: boolean;
}

export interface IPresets {
  /**
   * Define page fragment targets. By default, this pjax module will replace the
   * entire `<body>` fragment, if undefined. Its best to define specific fragments.
   *
   * ---
   * @default ['body']
   */
  targets?: string[];

  /**
   * Request Configuration
   */
  request?: {
    /**
     * The timeout limit of the XHR request issued. If timeout limit is exceeded a
     * normal page visit will be executed.
     *
     * ---
     * @default 3000
     */
    timeout?: number;

    /**
     * Request polling limit is used when a request is already in transit. Request
     * completion is checked every 10ms, by default this is set to 150 which means
     * requests will wait 1500ms before being a new request is triggered.
     *
     * **BEWARE**
     *
     * Timeout limit will run precedence!
     *
     * ---
     * @default 150
     */
    poll?: 150;

    /**
     * Determin if page requests should be fetched asynchronously or synchronously.
     * Setting this to `false` is not reccomended.
     *
     * ---
     * @default true
     */
    async?: boolean;

    /**
     * **FEATURE NOT YET AVAILABLE**
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
    readonly dispatch?: "mousedown";
  };

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
      enable?: boolean;

      /**
       * Controls the mouseover fetch delay threshold. Requests will fire on mouseover
       * only after the threshold time has been exceeded. This helps limit extrenous
       * requests from firing.
       *
       * ---
       * @default 250
       */
      threshold?: number;

      /**
       * **FEATURE NOT YET AVAILABLE**
       *
       * Proximity hovers allow for prefetch hovers to be dispatched when the cursor is within
       * a proximity range of a href link element. Coupling proximity with mouseover prefetches
       * enable predicative fetching to occur, so a request will trigger before any interaction.
       *
       * ---
       * @default 0
       */
      readonly proximity?: number;
    };

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
      enable?: boolean;

      /**
       * Partial options passed to [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
       *
       */
      options?: {
        /**
         * An offset rectangle applied to the root's href bounding box.
         *
         * ---
         * @default '0px 0px 0px 0px'
         */
        rootMargin?: string;
        /**
         * Threshold limit passed to the intersection observer instance
         *
         * ---
         * @default 0
         */
        threshold?: number;
      };
    };
  };

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
    enable?: boolean;

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
    limit?: number;

    /**
     * FEATURE NOT YET AVAILABLE
     *
     * The save option will save snapshot cache to IndexedDB.
     * This feature is not yet available.
     *
     * ---
     * @default false
     */
    readonly save?: boolean;
  };

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
    enable?: boolean;

    /**
     * Controls the progress bar preset threshold. Defines the amount of
     * time to delay before the progress bar is shown.
     *
     * ---
     * @default 350
     */
    threshold?: number;

    /**
     * [N Progress](https://github.com/rstacruz/nprogress) provides the
     * progress bar feature which is displayed between page visits.
     *
     * > _This pjax module does not expose all configuration options of nprogress,
     * but does allow control of some internals. Any configuration options
     * defined here will be passed to the nprogress instance upon initialization._
     */
    options?: IProgress;
  };
}

/**
 * Page Visit State
 *
 * Configuration from each page visit. For every page navigation
 * the configuration object is generated in a immutable manner.
 */
export interface IPage {
  /**
   * The list of fragment target element selectors defined upon connection.
   *
   * @example
   * ['#main', '.header', '[data-attr]', 'header']
   */
  readonly targets?: string[];

  /**
   * The URL cache key and current url path
   */
  url?: string;

  /**
   * UUID reference to the page snapshot HTML Document element
   */
  snapshot?: string;

  /**
   * Location URL
   */
  location?: ILocation;

  /**
   * The Document title
   */
  title?: string;

  /**
   * Should this fetch be pushed to history
   */
  history?: boolean;

  /**
   * List of fragment element selectors. Accepts any valid
   * `querySelector()` string.
   *
   * @example
   * ['#main', '.header', '[data-attr]', 'header']
   */
  replace?: null | string[];

  /**
   * List of fragments to be appened from and to. Accepts multiple.
   *
   * @example
   * [['#main', '.header'], ['[data-attr]', 'header']]
   */
  append?: null | Array<[from: string, to: string]>;

  /**
   * List of fragments to be prepend from and to. Accepts multiple.
   *
   * @example
   * [['#main', '.header'], ['[data-attr]', 'header']]
   */
  prepend?: null | Array<[from: string, to: string]>;

  /**
   * Controls the caching engine for the link navigation.
   * Option is enabled when `cache` preset config is `true`.
   * Each pjax link can set a different cache option.
   *
   * **IMPORTANT**
   *
   * Cache control is only operational on clicks, prefetches
   * will not control cache.
   *
   * ---
   * `false`
   *
   * Passing in __false__ will execute a pjax visit that will
   * not be saved to cache and if the link exists in cache
   * it will be removed.
   *
   * `reset`
   *
   * Passing in __reset__ will remove the requested page from cache
   * (if it exsists) and the next navigation result will be saved.
   *
   * `clear`
   *
   * Passing in __clear__ will cleat the entire cache, removing all
   * saved records.
   */
  cache?: boolean | string;

  /**
   * Scroll position of the next navigation.
   *
   * ---
   * `x` - Equivalent to `scrollLeft` in pixels
   *
   * `y` - Equivalent to `scrollTop` in pixels
   */
  position?: IPosition;

  /**
   * Define mouseover timeout from which fetching will begin
   * after time spent on mouseover
   *
   * @default 100
   */
  threshold?: number;

  /**
   * Define proximity prefetch distance from which fetching will
   * begin relative to the cursor offset of href elements.
   *
   * @default 0
   */
  proximity?: number;

  /**
   * Progress bar threshold delay
   *
   * @default 350
   */
  progress?: boolean | number;
}

export as namespace Store;
