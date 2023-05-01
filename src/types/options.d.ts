export type Key = '/' | `${'/' | '?'}${string}`

export interface IHover {
  /**
   * How mousover prefetches should be triggered. By default this option is set
   * to trigger on all `<a>` href link elements. You can instead use the `attribute`
   * option and only prefetch on href link elements that are annotated with a
   * `data-spx-mouseover` or `data-spx-mouseover="true"` attribute.
   *
   * > If you set the trigger to `href` you can annotate links you wish to exclude
   * from prefetch with `data-spx-mouseover="false"`.
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

export interface IIntersect {
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

export interface IProximity {
  /**
   * The distance range the mouse should be within before
   * the prefetch is triggered. You can optionally override
   * this by assigning a number value to the proximity attribute.
   *
   * For example:
   *
   * An href element using `data-spx-proximity="50"` would infrom
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

export interface IProgress {
  /**
   * The progress bar color
   *
   * @default #111111
   */
  background?: string;
  /**
   * The progress bar height in pixels.
   *
   * @default 3px
   */
  height?: `${string}px`;
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
   * Whether or not `<script>` and/or `<script src="*">` tags should evaluate
   * between page visits.
   *
   * This option accepts either a boolean or list of selectors. By default, SPX
   * will evaluate all inline `<script>` tags but will not evaluate `<script src="">`
   * tags. Setting this to `true` is discouraged and you should instead leverage
   * attribute annotations for external scripts.
   *
   * > **NOTE**
   * >
   * > Passing a `string[]` list will overwrite defaults
   *
   * ---
   * @default ['script:not(script[src])']
   */
  script?: string[] | boolean;

  /**
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
   * Whether or not `<meta>` tags should evaluate between page visits.
   *
   * This option accepts either a boolean or list of selectors. By default, SPX
   * ignores `<meta>` tag evaluation. Setting this to `true` is discouraged.
   *
   * ---
   * @default false
   */
  meta?: string[] | boolean;

  /**
   * Whether or not `<link>` tags should evaluate between page visits.
   *
   * This option accepts either a boolean or list of selectors. By default, SPX
   * evaluates `<link rel="preload">` and `<link rel="stylesheet"` elements only.
   *
   * > **NOTE**
   * >
   * > Linked externals are only ever evaluated once. Please keep in mind that
   * > passing a `string[]` list will overwrite defaults.
   *
   * ---
   * @default ['link[rel=stylesheet]', 'link[rel~=preload]']
   */
  link?: string[] | boolean;

}

export interface IObserverOptions {

  /**
   * Mouseover prefetching. You can disable mouseover (hover) prefetching
   * by setting this to `false` otherwise you can customize the fetching
   * behaviour. To use the default behaviour, set this to `true`. When enabled,
   * this option will allow you to fetch pages over the wire upon mouseover and
   * saves them to cache.
   *
   * > If `cache` is disabled then prefetches will be dispatched using HTML5
   * `<link>` prefetches, else when cache is enabled it uses XHR.
   *
   * ---
   *
   * @default true
   */
  hover?: boolean | IHover;

  /**
   * Intersection pre-fetching. Intersect prefetching leverages the
   * [Intersection Observer](https://shorturl.at/drLW9) API to fire requests when
   * elements become visible in viewport. You can disable intersect prefetching
   * by setting this to `false` (default), otherwise you can customize the
   * intersect fetching behaviour.
   *
   * To use default behaviour, set this to `true` and all elements annotated with
   * with a `data-spx-intersect` or `data-spx-intersect="true"` attribute will be
   * prefetched. You can annotate nodes containing href links or `<a>` directly.
   *
   * > Annotate any `<a>` links you wish to exclude from intersection prefetching
   * using the `data-spx-intersect="false"`
   *
   * ---
   *
   * @default true
   */
  intersect?: boolean | IIntersect;
  /**
   * Proximity pre-fetching allow for requests to be dispatched when the cursor is within
   * a proximity range of a href link element. Coupling proximity with mouseover prefetches
   * enable predicative fetching to occur, so a request will trigger before any interaction.
   *
   * To use default behaviour, set this to `true` and all `<a>` annotated with
   * with a `data-spx-proximity` or `data-spx-proximity="true"` attribute will be
   * prefetched.
   *
   * > Annotate any `<a>` links you wish to exclude from intersection prefetching
   * using the `data-spx-proximity="false"`
   *
   * ---
   * @default true
   */
  proximity?: boolean | IProximity;

}

export interface IOptions extends IObserverOptions {
  /**
   * Define page the selector schema
   *
   * ---
   *
   * @default 'SPX'
   */
  schema?: string;
  /**
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
   * Control evaluation of specific tags which either refer to resources or
   * control DOM behaviour. These are _typically_ tags located in the `<head>`
   * region of documents.
   *
   * This option behaves similar to `data-spx-eval` with the difference
   * being that it can be used instead of attributes annotations.
   */
  eval?: IEval;
  /**
   * Define page fragment targets. By default, this SPX module will replace the
   * entire `<body>` fragment, if undefined. Its best to define specific fragments.
   *
   * ---
   *
   * @default ['body']
   */
  targets?: string[];
  /**
   * The timeout limit of the XHR request issued. If timeout limit is exceeded a
   * normal page visit will be executed.
   *
   * ---
   *
   * @default 30000
   */
  timeout?: number;

  /**
   * When `true` SPX visits will only trigger on `<a>` href elements
   * annotated with `data-spx` attribute. Defaults to `false`
   * ---
   *
   * @default false
   */
  annotate?: boolean;

  /**
   * Determine if page requests should be fetched asynchronously or synchronously.
   * Setting this to `false` is not reccomended.
   *
   * ---
   *
   * @default true
   */
  async?: boolean;

  /**
   * Enable or Disable caching. Each page visit request is cached and used in
   * subsequent visits to the same location. By disabling cache, all visits will
   * be fetched over the network and any `data-spx-cache` attribute configs
   * will be ignored.
   *
   * ---
   * @default true
   */
  cache?: boolean;

  /**
   * Cache size limit. This SPX variation limits cache size to `100mb`and once size
   * exceeds that limit, records will be removed starting from the earliest point
   * of the cache entries.
   *
   * _Generally speaking, leave this the fuck alone._
   *
   * ---
   *
   * @default 100
   */
  limit?: number;

  /**
   * Session
   *
   * ---
   *
   * @default true
   */
  session?: boolean

  /**
   * Anticipatory preloading (prefetches). Values defined here will be fetched
   * preemptively and saved to cache either upon initial load or when a specific path is
   * visited. If you provide an array list of paths those pages will be visited
   * asynchronously in the order they were passed after. If you provide an object,
   * preemptive fetches will be carried out when path match occurs based on the
   * `key` entry provided.
   *
   * ---
   *
   * @default null
   */
  preload?: Key[] | { [key: Key]: Key[] }

  /**
   * Progress Bar configuration
   */
  progress?: boolean | IProgress

}
