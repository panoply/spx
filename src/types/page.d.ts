import { LiteralUnion } from 'type-fest';
import type { EventType } from '../shared/enums';

/**
 * Cache Size
 */
export interface ICacheSize {
  total: number;
  weight: string;
}

/**
 * Scroll position records
 */
export interface IPosition {
  x: number;
  y: number;
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
  origin: string;
  /**
   * The URL Hostname
   *
   * @example
   * 'website.com'
   */
  hostname: string;

  /**
   * The URL Pathname
   *
   * @example
   * '/pathname' OR '/pathname/foo/bar'
   */
  pathname: string;

  /**
   * The URL search params. If none exist this property
   * will be omitted.
   *
   * @example
   * '?param=foo&bar=baz'
   */
  search?: string;

  /**
   * The URL Hash. If none exists then this property
   * will be omitted.
   *
   * @example
   * '#foo'
   */
  hash?: string;
}

export interface IResource {
  type: 'script' | 'style';
  blob: Blob;
}

/**
 * Page Visit State
 *
 * Configuration from each page visit. For every page navigation
 * the configuration object is generated in a immutable manner.
 */
export interface IPage<T = any> {
  /**
   * UUID reference to the page snapshot HTML Document element
   */
  uuid: string;

  /**
   * The session identifier. This is used to determine the
   * connection digest. It is a random 4 digit number. When
   * using a `persisted` session this is the id used by the
   * session storage and other internal logic.
   *
   * @example
   * 1001
   */
  session: string;

  /**
   * The number of visits made to this page
   *
   * @example
   * 1
   */
  visits: number;

  /**
   * The fetched  timestamp in milliseconds since Unix [epoch](https://en.wikipedia.org/wiki/Unix_time).
   * This is applied directly after a fetch concludes.
   *
   * @example
   * 1704339762665
   */
  ts: number;
  /**
   * Passed data from `spx-data:prop=""` attributes. Data can be passed via link elements using
   * the following format:
   *
   * ```html
   * <a
   *   href="/url"
   *   spx-data:foo="string"
   *   spx-data:bar="100"
   *   spx-data:baz="true"
   *   spx-data:qux="{ prop: 'value' }">Link</a>
   *
   *
   * ```
   *
   * The data will be converted into an object and passed to events:
   *
   * ```js
   *
   * import spx from 'spx';
   *
   * spx.on('load', function (state) {
   *
   *   state.data.foo;      // => 'string'
   *   state.data.bar;      // => 100
   *   state.data.baz;      // => true
   *   state.data.qux.prop; // => 'value'
   *
   *});
   *```
   */
  data: T;
  /**
   * The URL cache key and current url path
   *
   * @example
   * '/pathname' OR '/pathname?foo=bar'
   */
  key: string;

  /**
   * The previous page cache key url path. When this value
   * matches the `key` then it is a first visit.
   *
   * @example
   * '/pathname' OR '/pathname?foo=bar'
   */
  rev: string;

  /**
   * A store type number reference which determines how the
   * record was saved. Used by events and internally
   */
  type: EventType;

  /**
   * The Document title. The value is written in the post-request
   * cycle before caching occurs.
   */
  title: string;

  /**
   * Scroll X position of the next navigation, this field
   * will be updated according to history, which means
   * navigating away from this page will update this record.
   *
   * - `x` - Equivalent to `scrollLeft` in pixels
   */
  scrollX: number;

  /**
   * Scroll Y position of the next navigation, this field
   * will be updated according to history, which means
   * navigating away from this page will update this record.
   *
   * - `y` - Equivalent to `scrollTop` in pixels
   */
  scrollY: number;

  /**
   * Location Records reference. This holds a parsed path
   * reference of the page.
   */
  location: ILocation;

 /**
   * Controls the caching engine for the link navigation.
   * Option is enabled when `cache` preset config is `true`.
   * Each href link can set a different cache option. Cache control
   * is only operational on visits (clicks). Prefetches have no
   * control of the cache operation.
   *
   * @default true
   */
  cache: boolean | 'reset' | 'clear' | 'restore' | 'update';

  /**
   * List of additional fragment element selectors to target in the
   * render cycle. Accepts any valid `querySelector()` string.
   * The selectors defined here will be merged with the defined
   * `targets` set in connection.
   *
   * @example
   * ['#main', '.header', '[data-attr]', 'header']
   */
  target: string[];

  /**
   * Progress bar threshold delay.
   *
   * @default 350
   */
  progress?: boolean | number;

  /**
   * Threshold timeout to be applied to `proximity` or `hover`
   * prefetch operations.
   *
   * @default 100
   */
  threshold?: number;

  /**
   * The renderer method to apply on the next navigation.
   *
   * @default 'replace'
   */
  render?: LiteralUnion<'replace' | 'morph' | 'assign', string>

  /**
   * List of fragments to replace. When `hydrate` is used,
   * it will run precedence over `targets` and only execute
   * a replacement on the elements defined.
   *
   * @example
   * ['#main', '.header', '[data-attr]', 'header']
   */
  hydrate?: string[];

  /**
   * List of fragments to preserve during morph. This is typically used
   * on `hydrate` and it will mimic `spx-morph="false"`
   *
   * @example
   * ['#main', '.header', '[data-attr]', 'header']
   */
  preserve?: string[];

  /**
   * List of fragments to be appened from and to. Accepts multiple.
   *
   * @example
   * [['#main', '.header'], ['[data-attr]', 'header']]
   */
  append?: Array<[from: string, to: string]>;

  /**
   * List of fragments to be prepend from and to. Accepts multiple.
   *
   * @example
   * [['#main', '.header'], ['[data-attr]', 'header']]
   */
  prepend?: Array<[from: string, to: string]>;

  /**
   * Define proximity prefetch distance from which fetching should
   * begin. This value is relative to the cursor offset of defined
   * elements using the `spx-proximity` attribute.
   *
   * @default 75
   */
  proximity?: number;

  /**
   * Index references of components
   *
   * @default []
   */
  components?: string[];

}
