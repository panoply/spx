import { IOptions, IProximity, IHover, IIntersect, IProgress } from './options';
import { IPage } from './page';

/**
 * Selectors
 *
 * String `key > value` references to DOM attributes
 * selectors used in the SPX instance.
 */
export interface ISelectors {
  attrs?: RegExp;
  script?: string;
  style?: string;
  styleLink?: string;
  hydrate?: string;
  track?: string;
  href?: string;
  hover?: string;
  intersect?: string;
  interHref?: string;
  proximity?: string;
}

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
}

/**
 * Observers
 *
 * Conditional reference object for observers.
 * Assigns a connection status to each observer.
 */
export interface IObservers {
  /**
   * Whether of not the scroll observer has connected,
   * always `true` unless disconnected
   */
  scroll: boolean;
  /**
   * Whether of not history pushState observer has connected,
   * always `true` unless disconnected
   */
  history: boolean;
  /**
   * Whether of not href interceptor was connected. This
   * can be disabled via session.
   */
  hrefs?: boolean;
  /**
   * Whether of not hover interceptor was connected. This
   * can be disabled via session.
   */
  hover?: boolean;
  /**
   * Whether of not intersect interceptor was connected. This
   * can be disabled via session.
   */
  intersect?: boolean;
  /**
   * Whether of not href interceptor was connected. This
   * can be disabled via session.
   */
  proximity?: boolean;
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
  progress?: false | IProgress;
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
  /**
   * Query Selectors
   */
  selectors?: {
    /**
     * Tracked element selector
     */
    tracking?: string;
    /**
     * Morph Children DOM attribute, eg: `spx-morph`
     */
    morph?: string;
    /**
     * Asset evaluation selector used for `<script>`
     * type tags
     */
    scripts?: string;
    /**
     * Hydration asset evaluation selector used for `<script>`
     */
    scriptsHydrate?: string;
    /**
     * HTML `<style>` element selectors to evaluate
     */
    styles?: string;
    /**
     * Any element annotated with `spx-eval="true"`
     */
    evals?: string;
    /**
     * The `<link>` elements selectors to evaluate
     */
    links?: string;
    /**
     * The `<meta>` elements selectors to evaluate
     */
    metas?: string;
    /**
     * The `href` elements to intercepts. Excluded certain
     * nodes from firing SPX visits
     */
    hrefs?: string;
    /**
     * Regular Expression used for matching attribute
     * annotations
     */
    attributes?: RegExp;
    /**
     * Href selctor for proximities that applies
     * the correct schema.
     */
    hover?: string;
    /**
     * Href selector for proximities that applies
     * the correct schema.
     */
    proximity?: string;
    /**
     * Href selctor, which excludes node annotated with a
     * `spx-intersect="false"` attribute.
     */
    intersects?: string
    /**
     * Intersect Element which contains `href` nodes
     */
    intersector?: string
  }

}

/**
 * History State
 *
 * Partial references extracted from the
 * page store. Written to the history stack API.
 */
type HistoryState = Omit<IPage, (
  | 'hydrate'
  | 'append'
  | 'prepend'
  | 'proximity'
  | 'threshold'
  | 'ignore'
)>

/**
 * History API
 *
 * An overwrite of the History API. Applied to
 * the native exports using `as` type.
 */
export type History = {
  readonly length: number;
  scrollRestoration: ScrollRestoration;
  state: HistoryState;
  back(): void;
  forward(): void;
  go(delta?: number): void;
  pushState(data: HistoryState, unused: string, url?: string | URL | null): void;
  replaceState(data: HistoryState, unused: string, url?: string | URL | null): void;
};
