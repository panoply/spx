/**
 * Pjax Events
 */
export type IEvents = (
  'pjax:click' |
  'pjax:request' |
  'pjax:cache' |
  'pjax:render' |
  'pjax:load'
)

/**
 * Action to be executed on navigation.
 */
export type IConfigAction = 'replace' | 'prepend' | 'append'

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
 * The URL location object
 */
export interface ILocation {

  /**
   * The URL protocol
   *
   * @example
   * 'https:' OR 'http:'
   */
  protocol: string
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
   * Default action to be applied.
   *
   * @default 'replace'
   */
  action?: string,
  /**
   * Enable disable prefetching
   *
   * @default true
   */
  prefetch?: boolean
  /**
   * Enable disable request caching
   *
   * @default true
   */
  cache?: boolean,
  /**
   * Enable or Disable progres bar indicator
   *
   * (_Requests are instantaneous, generally you wont need this_)
   *
   * @default false
   */
  progress?: boolean,
  /**
   * Throttle delay between navigations, set this option if
   * you want to delay the time between visits, helpful if
   * navigation is too fast.
   *
   * @default 0
   */
  throttle?: number
}

export interface IConfig {

  /**
   * List of target element selectors. Accepts any valid
   * `querySelector()` string.
   *
   * @example
   * ['#main', '.header', '[data-attr]', 'header']
   */
  target?: string[]

  /**
   * Default action to be applied.
   * ---
   * `replace` - Navigation target will be replaced
   *
   * `append` - Navigation target will be appened
   *
   * `prepend` - Navigation target will be prepended
   *
   */
  action?: string

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
   * Prefetch option to execute for each link
   *
   * ---
   * `intersect`
   *
   * Pages will be fetched upon `IntersectionObserve()` threshold.
   * ie: when they become visible in viewport.
   *
   * `hover`
   *
   * Pages will be fetched upon `mouseover` on a pjax href link.
   * Try and avoid this, just use __intersect__ instead.
   *
   * > _On mobile devices the hover value will execute on a
   * touch event._
   */
  prefetch?: string

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
   * Enable or Disable progres bar indicator
   *
   * (_Requests are instantaneous, generally you wont need this_)
   *
   * @default false
   */
  progress?: boolean,

}

export interface IDom {
  readonly tracked?: Set<string>,
  head?: object
}

export interface IPrefetch {
  nodes?: IntersectionObserver,
  started?: boolean,
  readonly transit?: Map<string, number>,
  threshold?: {
    intersect?: number,
    hover?: number
  }
}

export type IAttrs<T extends string[]> = {
  [P in T as string]?: string[]
}


export interface IHrefs {
  started?: boolean,
  attrs?: string[]
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
  cache: Map<string, IState>
  config: IConfigPresets;
  page: IState;
  dom: IDom;
  prefetch: IPrefetch;
  hrefs: IHrefs;
  request: IRequest;
}


export type IStoreUpdate = {
  config: (patch?: IConfigPresets) => IConfigPresets;
  page: (patch?: IState) => IState;
  dom: (patch?: IDom) => IDom;
  prefetch: (patch?: IPrefetch) => IPrefetch;
  hrefs: (patch?: IHrefs) => IHrefs;
  request: (patch?: IRequest) => IRequest;
}

export interface IState extends IConfig {

  /**
   * The fetched HTML response string
   */
  snapshot?: string

  /**
   * The fetched HTML response string
   */
  chunks?: {
    [selector: string]: 'replace' | 'prepend' | 'append'
  }

  /**
   * The URL cache key
   */
  url?: string

  /**
   * Location URL
   */
  location?: ILocation


}


/**
 * Event Details dispatched per lifecycle
 */
export interface IEventDetails {
  target?: Element,
  config?: IConfig,
  url?: ILocation
}



export type IVisit = {
  replace: boolean
}



export as namespace IPjax;

