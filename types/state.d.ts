import { IPosition, ILocation } from './store'


export interface Page {

  /**
   * The URL cache key
   */
  url?: string

  /**
   * UUID reference to the page snapshot HTML String
   */
  snapshot?: string

  /**
   * UUID reference to the captured snapshot HTML string
   */
  captured?: string

  /**
   * The fetched HTML response string
   */
  targets?: {
    [selector: string]: Element[]
  }

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
   * List of target element selectors. Accepts any valid
   * `querySelector()` string.
   *
   * @example
   * ['#main', '.header', '[data-attr]', 'header']
   */
  target?: string[]

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
  cache?: boolean | 'false' | 'reset' | 'save'

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
  prefetch?: boolean | 'intersect' | 'mouseover' | 'hover'

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
   * @default true
   */
  progress?: boolean,


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
     * Define mouseover timeout from which fetching will begin
     * after time spent on mouseover
     *
     * @default 100
     */
    mouseover?: number,

    /**
    * Define hover timeout from which fetching will begin
    * after time spent on mouseover
    *
    * @default 100
    *
    * @deprecated
    * Use `mouseover` instead
    */
    hover?: number,


  }

}

export as namespace IPjaxState;

