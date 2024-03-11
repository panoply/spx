export type Key = '/' | `${'/' | '?'}${string}`

export interface Hover {
  /**
   * How mousover prefetches should be triggered. By default this option is set
   * to trigger on all `<a>` href link elements. You can instead use the `attribute`
   * option and only prefetch on href link elements that are annotated with a
   * `spx-hover` or `spx-hover="true"` attribute.
   *
   * > If you set the trigger to `href` you can annotate links you wish to exclude
   * from prefetch with `spx-hover="false"`.
   *
   * ---
   *
   * @default 'href'
   */
  trigger?: 'attribute' | 'href'

  /**
   * Controls the fetch delay threshold. Requests will fire
   * only when the mouse is both within range and the threshold
   * time limit defined here has exceeded.
   *
   * ---
   * @default 100
   */
  threshold?: number;

}

export interface Intersect {
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
}

export interface Proximity {
  /**
   * The distance range the mouse should be within before
   * the prefetch is triggered. You can optionally override
   * this by assigning a number value to the proximity attribute.
   *
   * For example:
   *
   * An href element using `spx-proximity="50"` would infrom
   * SPX to begin fetching when the mouse is within 50px of the
   * element.
   *
   * ---
   * @default 75
   */
  distance?: number;
  /**
   * Controls the fetch delay threshold. Requests will fire
   * only when the mouse is both within range and the threshold
   * time limit defined here has exceeded.
   *
   * ---
   * @default 100
   */
  threshold?: number;
  /**
   * Controls the mouseover trigger throttle. This helps limit the amount of
   * times an internal callback fires once cursor is in range. It is highly
   * discouraged to set this to a limit less than 250ms.
   *
   * _Generally speaking, leave this the fuck alone._
   *
   * ---
   *
   * @default 500
   */
   throttle?: number;
}

export interface Progress {
  /**
   * The progress bar color
   *
   * @default #111111
   */
  bgColor?: string;
  /**
   * The progress bar height in pixels.
   *
   * @default 3px
   */
  barHeight?: `${number}px`;
  /**
   * Changes the minimum percentage used upon starting.
   *
   * @default 0.08
   */
  minimum?: number;
  /**
   * CSS Easing String
   *
   * @default linear
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
   * Controls the progress bar preset threshold. Defines the amount of
   * time to delay before the progress bar is shown.
   *
   * ---
   * @default 350
   */
  threshold?: number;
}

export interface IEval {
  /**
   * #### Script Evalution
   *
   * Control how `<script>` and `<script src="*">` tag evaluation should be handled.
   * This option accepts either a `boolean` or a list of selectors. By default, SPX will
   * evaluate all inline `<script>` tags on a per-page basis, but will only evalute linked
   * `<script src=".">` tags once. Refer to [Resource Evaluation](https://spx.js.org/introduction/resource-evalution)
   * documentation for a more detailed overview of how SPX handles scripts.
   *
   * The following values are accepted:
   *
   * > **`string[]`** (default)
   * >
   * > Evaluates scripts with attributes that match the provided selectors. The `spx-eval` directive can
   * > still be used to override and perform evaluation. Please note, that passing `string[]` selectors
   * > will override the defaults.
   *
   * > **`true`**
   * >
   * > In cases where you require re-evalution of all `<script>` tag occurances, use `true`.
   * > The `spx-eval` directive can still be used as an override.
   *
   * > **`false`**
   * >
   * > Prevents script evalution from occurring between visits. The `spx-eval` directive can
   * > still be used to override and perform evaluation.
   *
   * ---
   *
   * @default ['script:not(script[src])']
   */
  script?: string[] | boolean;
  /**
   * #### Style Evalution
   *
   * Whether or not `<style>` and/or `<link rel="stylesheet">` tags should
   * evaluate between page visits.
   *
   * This option accepts either a boolean or list of selectors. By default, SPX
   * will always evaluate inline styles. SPX will maintain a cache reference of
   * inline styles and only even re-render changes between visits.
   *
   * Use the `link` reference for evaluation of stylesheets.
   *
   * > **NOTE**
   * >
   * > Passing a `string[]` list will overwrite defaults
   *
   * ---
   * @default ['style']
   */
  style?: string[] | boolean;
  /**
   * #### Meta Evalution
   *
   * Whether or not `<meta>` tags should evaluate between page visits. This option accepts
   * either a boolean or list of selectors. By default, SPX ignores `<meta>` tag evaluation.
   * Setting this to `true` is discouraged, given that meta type tags are typically not of
   * importance.
   *
   * ---
   * @default false
   */
  meta?: string[] | boolean;
  /**
   * #### Link Evalution
   *
   * Whether or not `<link>` tags should evaluate between page visits. This option accepts
   * either a boolean or list of selectors. By default, SPX evaluates `<link rel="preload">`
   * and `<link rel="stylesheet">` occurances, which are typically of
   *
   * > **NOTE**
   * >
   * > Linked externals are only ever evaluated once. Please keep in mind that
   * > passing a `string[]` list will overwrite defaults.
   *
   * ---
   *
   * @default ['link[rel=stylesheet]', 'link[rel~=preload]']
   */
  link?: string[] | boolean;

}

export interface IObserverOptions {

  /**
   * #### SPX Hover
   *
   * Mouseover prefetching. You can disable mouseover (hover) prefetching by setting this
   * to `false` otherwise you can customize the fetching behaviour. To use the default behaviour,
   * set this to `true`. When enabled, this option will allow you to fetch pages over the
   * wire upon mouseover and save them to cache.
   *
   * > If `cache` is disabled then prefetches will be dispatched using HTML5 `<link>` prefetches,
   * else when cache is enabled it uses XHR.
   *
   * ---
   *
   * @default true
   */
  hover?: boolean | Hover;

  /**
   * #### SPX Intersect
   *
   * Intersection pre-fetching. Intersect prefetching leverages the
   * [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
   * API to fire requests when elements become visible in viewport. You can disable intersect prefetching
   * by setting this to `false` (default), otherwise you can customize the
   * intersect fetching behaviour.
   *
   * To use default behaviour, set this to `true` and all elements annotated with
   * with a `spx-intersect` or `spx-intersect="true"` attribute will be
   * prefetched. You can annotate nodes containing href links or `<a>` directly.
   *
   * > Annotate any `<a>` links you wish to exclude from intersection prefetching
   * using the `spx-intersect="false"`
   *
   * ---
   *
   * @default true
   */
  intersect?: boolean | Intersect;
  /**
   * #### SPX Proximity
   *
   * Proximity pre-fetching allow for requests to be dispatched when the cursor is within
   * a proximity range of a href link element. Coupling proximity with mouseover prefetches
   * enables predicative fetching to apply, so requests will trigger before any interaction.
   *
   * To use default behaviour, set this to `true` and all `<a>` annotated with
   * with a `spx-proximity` or `spx-proximity="true"` attribute will be
   * prefetched.
   *
   * > Annotate any `<a>` links you wish to exclude from intersection prefetching
   * using the `spx-proximity="false"`
   *
   * ---
   * @default true
   */
  proximity?: boolean | Proximity;

}

export interface Options extends IObserverOptions {
  /**
   * #### SPX Schema
   *
   * Controls the data attribute selector schema. By default, attributes and directives use a
   * a `spx-` prefix annotation identifier. Setting this to a value of `null` will instruct
   * SPX to **omit** prefix annotation, or alternatively you can use a custom schema.
   *
   * ---
   *
   * #### Examples
   *
   * ```js
   * // Default usage, value set to "spx"
   * <a spx-hover="true"></a>
   *
   * // Omitting, value set to null
   * <a hover="true"></a>
   *
   * // Using custom schema, value set to "data-x"
   * <a data-x-hover="true"></a>
   *
   * // Using standard schema, value set to "data-spx"
   * <a data-spx-hover="true"></a>
   * ```
   *
   * ---
   *
   * @default 'spx'
   *
   */
  schema?: string;

  /**
   * #### SPX Global
   *
   * Whether or not the SPX connection should be made available in globalThis (e.g: `window.spx`) scope.
   *
   * > **NOTE**
   * >
   * > The instance is assigned to `window.spx` as a **getter** method.
   *
   * ---
   *
   * **Example**
   *
   * ```js
   *
   * window.spx // => Returns API methods
   *
   * ```
   *
   * ---
   *
   * @default true
   *
   */
  globalThis?: boolean;
  /**
   * #### SPX Log Level
   *
   * Controls information printed to `console`. By default, SPX will print info, warnings and errors
   * to the browser console (i.e: `2`) but you may require additional context in development mode and
   * in such cases you can set this to `1` which is verbose.
   *
   * SPX provides 4 log levels
   *
   * > **VERBOSE - `1`**
   * >
   * > Verbose logging to the console, use in development mode.
   *
   * > **INFO - `2`** (default)
   * >
   * > Suppress trace logs, prints info, warnings and errors to the browser console.
   *
   * > **WARN - `3`**
   * >
   * > Suppress trace and info logs, prints warnings and errors to the browser console.
   *
   * > **ERROR - `4`**
   * >
   * > Suppress trace, info and warning logs, only errors will be printed to the browser console.
   *
   * ---
   *
   * @default 2
   */
  logLevel?: 1 | 2 | 3 | 4;
  /**
   * #### SPX Manual
   *
   * Whether or not you want to manually invoke observers. This defaults
   * to `false` resulting in all pre-fetch and related interception observers
   * running upon connection. When disabled (i.e: `false`) then invocation is
   * left up to you.
   *
   * Use the `spx.observe()` method to enable observers.
   *
   * ---
   *
   * @default false
   */
  manual?: boolean;
  /**
   * #### SPX Resource Evaluations
   *
   * Control evaluation of specific tags which either refer to resources or
   * control DOM behaviour. These are _typically_ tags located in the `<head>`
   * region of documents.
   */
  eval?: boolean | IEval;
  /**
   * #### SPX Fragments
   *
   * Define a set of `id=""` annotated elements that are expected to change between navigations.
   * By default, SPX will swap the entire `<body>` fragment, but it is **highly recommended**
   * that you define fragment ids.
   *
   * > **Please Note**
   * >
   * > Fragments **MUST** must be identifier values. Only elements which contain an `id=""` attribute
   * > are considered fragments.
   *
   * ---
   *
   * @default []
   */
  fragments?: string[];
  /**
   * #### SPX Timeout
   *
   * The timeout limit that **OTW** (over the wire) XHR requests. When the timeout limit is
   * exceeded a normal page visit will be carried out.
   *
   * ---
   *
   * @default 30000
   */
  timeout?: number;
  /**
   * #### SPX Annotate
   *
   * When `true` SPX visits will only trigger on `<a>` href elements annotated with an `spx`
   * attribute. When set to `false`, SPX will trigger on all `<a>` link elements, excluding
   * those annotated with `spx-disable`. Defaults to `false`.
   *
   * ---
   *
   * @default false
   */
  annotate?: boolean;
  /**
   * #### SPX Cache
   *
   * Enable or Disable snapshot caching. Each page visit request is cached and used in
   * subsequent visits to the same location. When **cache** is disabled (i.e: `false`),
   * all visits will be fetched over the network and any `spx-cache` attribute configs
   * will be ignored.
   *
   * > **NOTE**
   * >
   * > It is **highly recommended** to keep caching enabled for optimal performance.
   *
   * ---
   *
   * @default true
   */
  cache?: boolean;
  /**
   * #### SPX Max Cache
   *
   * Maximum cache (snapshot) size limit. SPX limits cache to `100mb` and when size
   * is exceeded, the snapshot records will be removed starting from the earliest point
   * of the cached entries.
   *
   * ---
   *
   * @default 100
   */
  maxCache?: number;
  /**
   * #### SPX Preload
   *
   * Anticipatory pre-loading (pre-fetches). Entries defined here will be fetched
   * pre-emptively and saved to cache either upon SPX Connection (i.e: `DOMContentLoaded`)
   * or when a specific path is visited.
   *
   * If you provide an array list of paths those pages will be visited asynchronously in the
   * order they are defined. If you provide an object (i.e: `{ key: paths[] }`)map, then SPX
   * will execute the preload fetches when a `key` (path) match is determined.
   *
   * ---
   *
   * #### Example
   *
   * ```js
   * // OPTION 1 - Preloading a list of routes
   * spx.connect({
   *  preload: [ '/path/foo', '/path/bar', '/path/baz']
   * })
   *
   * // OPTION 2 - Preloading routes when page has been visited
   * spx.connect({
   *  preload: {
   *    '/path/foo': ['/path/to/bar', '/path/to/baz'],
   *    '/path/qux': ['/path/to/xxx']
   *  }
   * })
   * ```
   * ---
   *
   * @default null
   *
   */
  preload?: Key[] | { [key: Key]: Key[] };
  /**
   * #### SPX Reverse Fetch
   *
   * Whether or not SPX should apply reverse fetching upon connection. If history state holds an SPX reference
   * then a reverse fetch is carried out on the last known (backward) location.
   *
   * ---
   *
   * @default true
   */
  reverse?: boolean;
  /**
   * #### SPX Progress
   *
   * Progress Bar configuration options. The SPX progress bar is dynamically rendered to the DOM.
   * This option allows you to customize its CSS style and the rendering rules to be applied. Setting
   * this to a boolean value of `false` will prevent the progress bar from showing, whereas a value of
   * `true` will tell SPX to use the defaults (see {@link Progress}).
   *
   * ---
   *
   * @default true
   */
  progress?: boolean | Progress;
  /**
   * #### SPX Components
   *
   * SPX Components to be registered. This option is an `object` and expects raw classes to
   * be provided. Refer to [components](https://spx.js.org/components/structure) documentation.
   *
   * ---
   *
   * #### Example
   *
   * ```js
   * import { Foo } from './components/foo';
   * import { Bar } from './components/bar';
   *
   * spx.connect({
   *
   *  // Both Foo and Bar are class exports, for example:
   *  //
   *  // 1. export class Foo extends spx.Component {}
   *  // 2. export class Bar extends spx.Component {}
   *  //
   *  // Do not intialize or pass instances, raw classes
   *  // will be added to the components registry.
   *  //
   *  //
   *  components: { Foo, Bar }
   * })
   * ```
   * ---
   *
   * @default null
   */
  components?: { [identifier: string]: any }

}
