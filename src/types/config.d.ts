import { IOptions, IProximity, IHover, IIntersect, IProgress } from './options';
import { IPage } from './page';

/**
 * Hovers
 *
 * Configuration specific hover observer
 * model which applied the selector.
 */
export interface IHoverConfig extends IHover {
  /**
   * Href selctor for hovers that applies
   * the correct schema.
   */
  selector: string
}

/**
 * Intersection
 *
 * Configuration specific intersect observer
 * model which applied the selector.
 */
export interface IIntersectConfig extends IIntersect {
  /**
   * Href selctor for hovers that applies
   * the correct schema.
   */
  selector: string
}

/**
 * Intersection
 *
 * Configuration specific intersect observer
 * model which applied the selector.
 */
export interface IProximitConfig extends IProximity {
  /**
   * Href selctor for proximity that applies
   * the correct schema.
   */
  selector: string
}
/**
 * Memory
 *
 * Object reference which holds the storage memory
 * record throughout the SPX session. This is accessible
 * for every page.
 */
export interface IMemory {
  /**
   * Current in-store memory in Bytes
   */
  bytes: number;
  /**
   * The memory limit to be imposed before
   * purge begins, defaults to 100mb
   *
   * @default 100
   */
  limit: number;
  /**
   * The visits counter for the page.
   *
   * @default 0
   */
  visits: number;
  /**
   * String Representation
   *
   * @example '500kb'
   */
  size?: string;
}

/**
 * Observers
 *
 * Conditional reference object for observers.
 * Assigns a connection status to each observer.
 */
export interface IObservers {
  /**
   * Whether or not resource element observer has connected and
   * is monitoring the DOM for dymanically injected references.
   */
  mutations: boolean;
  /**
   * Whether or not fragments have been assigned to session,
   *  always `true` unless disconnected.
   */
  fragments: boolean;
  /**
   * Whether or not the scroll observer has connected,
   * always `true` unless disconnected
   */
  scroll: boolean;
  /**
   * Whether or not history pushState observer has connected,
   * always `true` unless disconnected
   */
  history: boolean;
  /**
   * Whether or not href interceptor was connected. This
   * can be disabled via session.
   */
  hrefs?: boolean;
  /**
   * Whether or not hover interceptor was connected. This
   * can be disabled via session.
   */
  hover?: boolean;
  /**
   * Whether or not intersect interceptor was connected. This
   * can be disabled via session.
   */
  intersect?: boolean;
  /**
   * Whether or not href interceptor was connected. This
   * can be disabled via session.
   */
  proximity?: boolean;
  /**
   * Whether or not components connection was initialied
   */
  components?: boolean;
}

/**
 * Selectors
 *
 * String `key > value` references to DOM attributes
 * selectors used in the SPX instance.
 */
export interface ISelectors {
  /**
   * The `<a>` href selector value.
   *
   * ```js
   * 'a[spx-link]:not([spx-disable]):not([href^=\\#])'
   * ```
   */
  $href: string;
  /**
   * Tracked selector for elements
   *
   * ```js
   * '[spx-track]:not([spx-track=false])'
   * ```
   */
  $track?: string;
  /**
   * The `spx-target` attribute with exclusion reference
   *
   * ```js
   * '[spx-target]:not([spx-target=false])'
   * ```
   */
  $targets?: string;
  /**
   * The `spx-target` attribute annotation
   *
   * ```js
   * 'spx-target'
   * ```
   */
  $target?: string;
  /**
   * The `spx-eval` attribute annotation
   *
   * ```js
   * 'spx-eval'
   * ```
   */
  $eval?: string;
  /**
   * The `spx-morph` attribute annotation
   *
   * ```js
   * 'spx-morph'
   * ```
   */
  $morph?: string;
  /**
   * Component Attribute
   *
   * ```js
   * 'spx-component'
   * ```
   */
  $component?: string;
  /**
   * The `spx-node` component attribute annotation
   *
   * ```js
   * 'spx-node'
   * ```
   */
  $node: string;
   /**
   * The `spx-bind` component attribute annotation
   *
   * ```js
   * 'spx-bind'
   * ```
   */
  $bind: string;
  /**
   * The internal `data-spx` walked component marker attribute annotation.
   *
   * ```js
   * 'data-spx'
   * ```
   */
  $ref: string;
  /**
   * Component attributes matcher - Used in elements walk.
   *
   * ```js
   * /spx-(node|bind|component)|@[a-z]|[a-z]:[a-z]/i
   * ```
   */
  $find: RegExp;
  /**
   * Component data attribute matcher - Used on events
   *
   * ```js
   * /^spx-[a-z0-9-]+:/i
   * ```
   */
  $param: RegExp;
  /**
   * Regular Expression used for matching attribute annotations
   *
   * ```js
   * /^href|spx-(hydrate|append|prepend|target|progress|threshold|scroll|position|proximity|hover|cache|history)$/
   * ```
   */
  $attrs?: RegExp;
  /**
   * Intersect element which contains `href` nodes
   *
   * ```js
   * `[spx-intersect]
   *  :not([spx-intersect=false])
   *  :not(a[spx-intersect])
   *  :not(a[spx-link])
   *  :not(a[spx-hover])
   *  :not(a[spx-proximity])
   * `
   * ```
   */
  $intersector?: string
  /**
   * Data attribute `<a spx-data:key="value">` - Ends at colon, eg: `spx-data:` and used to match.
   *
   * ```js
   * 'spx-data:'
   * ```
   */
  $data?: string;
  /**
   * Hover selector `<a spx-hover="*">` - Differs depending on `hover` options
   *
   * ```js
   * `a[spx-hover]
   *  :not(a[spx-disable])
   *  :not(a[href^=\\#])
   *  :not(a[spx-hover=false])
   * `
   * ```
   */
  $hover: string;
  /**
   * Proximity selector `<a spx-proximity="*">` - Differs depending on `proximity` options
   *
   * ```js
   * `a[spx-proximity]
   *  :not(a[spx-disable])
   *  :not(a[href^=\\#])
   *  :not(a[spx-proximity=false])
   *  :not(a[spx-hover])
   * `
   * ```
   */
  $proximity: string;
  /**
   * Intersect selector `<a spx-intersect="*">` - Differs depending on `intersect` options
   *
   * ```js
   * `a[spx-intersect]
   *  :not(a[spx-disable])
   *  :not(a[href^="#"])
   *  :not(a[spx-intersect=false])
   *  :not(a[spx-hover])
   * `
   * ```
   */
  $intersect: string;
  /**
   * Script Hydrate Selector
   *
   * ```js
   * `script[spx-eval=hydrate]
   *  :not([spx-eval=false])
   * `
   * ```
   */
  $hydrate: string;
  /**
   * Script Selector `<script>`
   *
   * ```js
   * `script
   *  :not([spx-eval=false])
   *  :not([spx-eval=hydrate])
   * `
   * ```
   */
  $script: string;
  /**
   * Style Selector `<style>`
   *
   * ```js
   * `style:not([spx-eval=false])`
   * ```
   */
  $style: string;
  /**
   * Link Selector `<link>`
   *
   * ```js
   * `link[rel=stylesheet]
   *  :not([spx-eval=false])
   *  ,
   *  link[rel~=preload]
   *  :not([spx-eval=false])
   * `
   * ```
   */
  $link: string;
  /**
   * The `<meta>` element selectors to evaluate
   *
   * ```js
   * `meta
   *  :not([spx-eval=false])
   * `
   * ```
   */
  $meta: string;
  /**
   * Resource selector for `<link>` and `<style>` url paths
   *
   * ```js
   * `link[rel=stylesheet][href*=\\.css]
   *  :not(spx-eval=false)
   *  ,
   *  script[src*=\\.js]
   *  :not(spx-eval=false)
   * `
   * ```
   */
  $resource: string;
}

/**
 * Configuration is internal, observers differ
 * from options. Observers either use a boolean
 * `false` when disabled of the merged defaults.
 */
export interface IConfig extends IOptions {
  /**
   * Connection key (first page) SPX was started
   */
  index?: string;
  /**
   * Progress Bar
   */
  progress?: IProgress;
  /**
   * Hover Prefeching
   */
  hover?: false | IHover;
  /**
   * Intersection Prefetching
   */
  intersect?: false | IIntersect;
  /**
   * Proximity Prefetching
   */
  proximity?: false | IProximity;
}

/**
 * History State
 *
 * Partial references extracted from the
 * page store. Written to the history stack API.
 */
type HistoryState = Pick<IPage, (
  | 'key'
  | 'rev'
  | 'scrollX'
  | 'scrollY'
  | 'title'
)>

/**
 * History API
 *
 * An overwrite of the History API. Applied to
 * the native exports using `as` type.
 */
export type HistoryAPI = {
  readonly length: number;
  scrollRestoration: ScrollRestoration;
  state: HistoryState;
  back(): void;
  forward(): void;
  go(delta?: number): void;
  pushState(data: HistoryState, unused: string, url?: string | URL | null): void;
  replaceState(data: HistoryState, unused: string, url?: string | URL | null): void;
};
