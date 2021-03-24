import { NProgressOptions } from 'nprogress'

/**
 * Pjax Events
 */
export type IEvents = (
  'pjax:click' |
  'pjax:prefetch' |
  'pjax:request' |
  'pjax:cache' |
  'pjax:render' |
  'pjax:load'
)

/**
 * Action to be executed on navigation.
 */
export type IConfigMethod= 'replace' | 'prepend' | 'append'

/**
 * Prefetch operation on navigation
 */
export type IConfigPrefetch = 'intersect' | 'hover'

/**
 * Cache operation on navigation
 */
export type IConfigCache = 'false' | 'reset' | 'save'

/**
 * Scroll position records
 */
export type IPosition = {
  x: number,
  y: number
}

/**
 * Scroll position records
 */
export type ICacheSize = {
  requests: number
  total: number
  weight: string
}

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

/**
 * The URL location object
 */
export interface ILocation {
  /**
   * The URL origin name
   *
   * @example
   * 'https://website.com'
   */
  origin: string
  /**
   * The URL Hostname
   *
   * @example
   * 'website.com'
   */
  hostname: string
  /**
   * The URL href location name (full URL)
   *
   * @example
   * 'https://website.com/pathname'
   * OR
   * 'https://website.com/pathname?param=foo&bar=baz'
   */
  href: string
  /**
   * The URL Pathname
   *
   * @example
   * '/pathname' OR '/pathname/foo/bar'
   */
  pathname: string
  /**
   * The URL search params
   *
   * @example
   * '?param=foo&bar=baz'
   */
  search: string
  /**
   * The URL Hash
   *
   * @example
   * '#foo'
   */
  hash: string
  /**
   * The previous path href URL.
   * This is also the cache identifier
   *
   * @example
   * '/pathname' OR '/pathname?foo=bar'
   */
  lastUrl: string

}

export type IConfigPresets = {
  /**
   * List of target element selectors. Accepts any valid
   * `querySelector()` string.
   *
   * @example
   * ['#main', '.header', '[data-attr]', 'header']
   */
  target?: string[],
  /**
   * Default method to be applied.
   *
   * @default 'replace'
   */
  method?: string,
  /**
   * Enable/disable prefetching. Settings this option to `false`will
   * prevent prefetches from occuring and ignore all `data-pjax-prefetch="*"`
   * attributes.
   *
   * @default true
   */
  prefetch?: boolean
  /**
   * Enable disable request caching, setting this option to `false` will
   * prevent cached navigations and ignore all `data-pjax-cache="*"` attributes.
   *
   * @default true
   */
  cache?: boolean,
  /**
   * [NProgress](https://github.com/rstacruz/nprogress) provides the
   * progress bar feature which is displayed between page visits. This pjax
   * module does not expose all configuration options of nprogress, but does allow
   * control of some internals. Any configuration options defined here will be
   * passed to nprogress.
   */
  progress?: IProgress,
  /**
   * Throttle delay between navigations, set this option if
   * you want to delay the time between visits, helpful if
   * navigation is too fast.
   *
   * @default 0
   */
  throttle?: number

  /**
   * Threshold Controls
   */
  threshold?: {

    /**
     * Define an intersection threshold timeout from
     * which intersected elements will begin fetching
     * after being observed
     *
     * @default 250
     */
    intersect?: number,

    /**
    * Define hover timeout from which fetching will begin
    * after time spent on mouseover
    *
    * @default 100
    */
    hover?: number,

    /**
    * Controls the progress bar threshold, where `1` equates
    * to 25ms, maximum of `85`
    *
    * @default 2
    */
    progress?: number

  }


}

export interface IConfig {

  /**
   * List of target element selectors. Accepts any valid
   * `querySelector()` string.
   *
   * @example
   * ['#main', '.header', '[data-attr]', 'header']
   */
  targets?: string[]

  /**
   * Default method to be applied.
   * ---
   * `replace` - Navigation target will be replaced
   *
   * `append` - Navigation target will be appened
   *
   * `prepend` - Navigation target will be prepended
   *
   */
  method?: string

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
   * `save`
   *
   * Passing in __save__ will temporarily store the current
   * cached state to session storage. It will be removed on your
   * next navigation visit.
   *
   * > _The save option should be avoided unless you are executing a
   * full page reload and wish to store your cached pages to prevent
   * new requests being executed on next navigation. If your cache exceeds
   * 3mb in size cache records will be removed starting from the earliest
   * point on of entry. Use `save` in conjunction with the `data-pjax-disable`
   * option, else do your upmost to avoid it._
   */
  cache?: false | 'false' | 'reset' | 'save'

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
   * List array of tracked elements pretaining to this link page
   * navigation visit (if any).
   *
   * @see https://github.com/panoply/pjax#data-pjax-track
   */
  track?: Element[]

  /**
   * Throttle delay between navigations, set this option if
   * you want to delay the time between visits, helpful if
   * navigation is too fast.
   *
   * @default 0
   */
  throttle?: number

  /**
   * Threshold Controls
   */
  threshold?: {

    /**
     * Define an intersection threshold timeout from
     * which intersected elements will begin fetching
     * after being observed
     *
     * @default 250
     */
    intersect?: number,

    /**
    * Define hover timeout from which fetching will begin
    * after time spent on mouseover
    *
    * @default 100
    */
    hover?: number,

    /**
    * Controls the progress bar threshold, where `1` equates
    * to 25ms, maximum of `85`
    *
    * @default 2
    */
    progress?: number

  }

}

export interface IDom {
  readonly tracked?: Set<string>,
  head?: object
  snapshots: Map<string, string>
}


export type IAttrs<T extends string[]> = {
  [P in T as string]?: string[]
}


export interface IRequest {
  readonly xhr?: Map<string, XMLHttpRequest>,
  cache?: {
    weight?: string,
    total?: number,
    readonly limit?: number
  }
}

export interface IStoreState {
  started: boolean
  cache: Map<string, IState>
  config: IConfigPresets;
  page: IState;
  dom: IDom;
  request: IRequest;
}


export type IStoreUpdate = {
  config: (patch?: IConfigPresets) => IConfigPresets;
  page: (patch?: IState) => IState;
  dom: (patch?: IDom) => IDom;
  request: (patch?: IRequest) => IRequest;
}

export interface IState extends IConfig {

  /**
   * The fetched HTML response string
   */
  snapshot?: string

  /**
   * Captured HTML response string
   */
  captured?: string

  /**
   * The fetched HTML response string
   */
  targets?: {
    [selector: string]: Element[]
  }

  /**
   * The URL cache key
   */
  url?: string


  /**
   * Location URL
   */
  location?: ILocation

  /**
   * The Document title
   */
  title?: string

  /**
   * Action
   */
  action?: {
    replace?: [target:string]
    append?: Array<[from: string, to: string]>,
    prepend?: Array<[from: string, to: string]>,
  }

  /**
  * Threshold
  */
  threshold?: {
    intersect?: number
    mouseover?: number
    hover?: number


  }

}


/**
 * Event Details dispatched per lifecycle
 */
export interface IEventDetails {
  target?: Element,
  state?: IConfig,
  data?: any
}



export type IVisit = {
  replace: boolean
}



export as namespace IPjax;

