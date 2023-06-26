import { IPage } from './page';
import { IObserverOptions, IOptions } from './options';
import { EventNames, LifecycleEvent } from './events';
import { IConfig, IObservers, IMemory } from './config';

/**
 * Supported
 *
 * Boolean to determine whether or the browser supports
 * this module.
 */
export const supported: boolean;

/**
 * Connect
 *
 * Establish a SPX connection with your web application.
 * Optionally pass in connect options.
 */
export function connect(options?: IOptions): ((callback: (state?: IPage) => void) => Promise<void>);

/**
 * Session
 *
 * Returns the current session instance. This includes all state,
 * snapshots, options and settings which exists in memory. If you
 * intend of augmenting the session, please note that the store records
 * are created without prototype.
 */
export function session(key?: string, merge?: object): {
  pages: { [key: string]: IPage };
  snapshots: Map<string, string>;
  memory: IMemory & { size: string };
  config: IConfig;
  observers: IObservers
}

/**
 * Reload
 *
 * Triggers a reload of the current page. The page will be
 * re-fetched over HTTP and re-cached.
 */
export function reload(): Promise<IPage>;

/**
 * Event Listener
 *
 * Lifecycle event hook listener. Events are dispatched upon each
 * navigation. If you have multiple listeners they will trigger in
 * the order they are defined.
 *
 * Accepts an option `scope` parameter which will bind `this` context to the event.
 */
export function on<T extends EventNames>(event: T, callback: LifecycleEvent<T>, scope?: any): void

/**
 * State
 *
 * View or modify page state record.
 */
export function state (key?: string, store?: IPage): { page: IPage, dom: Document }

/**
 * Render
 *
 * Programmatic rendering. Allows document
 */
export function render <T = any>(url: string, pushState: 'replace' | 'push', fn: (
  this: {
    /**
     * The current page state
     */
    page: IPage;
    /**
     * The current document
     */
    dom: Document;
  },
  /**
   * The fetched document
   */
  dom: Document
) => Document, context?: T): Promise<IPage>

/**
 * Observe
 *
 * Either activates or restarts interception observers. Use this method if you are connecting
 * with the `manual` option set to `true` to have SPX begin observing.
 */
export function observe(options?: IObserverOptions): void

/**
 * Capture
 *
 * Performs a snapshot modification to the current document. Use
 * this to align a snapshot cache record between navigations. This
 * is helpful in situations where the dom is augmented and you want
 * to preserve the current DOM.
 */
export function capture(targets?: string[]): void

/**
 * Hydrate
 *
 * Programmatic hydrate execution. The method expects a `url` and accepts an optional selector
 * target string list. You can preserve certain elements from morphs by prefixing an `!` mark.
 *
 * @example
 *
 * // This would hydrate the <main> element but
 * // preserve the <div id="navbar"> element.
 * spx.hydrate('/path', ["main", "!#navbar"])
 */
export function hydrate(url: string, nodes: string[]): Promise<Document>

/**
 * Prefetch
 *
 * Executes a programmatic prefetch. The method expects a `url` or `<a href="">`
 * node as an argument. This method behaves the same way as hover, intersect
 * or proximity prefetch.
 */
export function prefetch(link: string): Promise<IPage>

/**
 * Visit
 *
 * Executes a programmatic visit. The method optionally
 * accepts a page state modifier as second argument.
 */
export function visit(link: string, state?: IPage): Promise<IPage>;

/**
 * Fetch
 *
 * Executes a programmatic fetch. The XHR request response is not
 * cached and no state references are touched. The XHR response is
 * returned as DOM.
 */
export function fetch(url: string): Promise<Document>

/**
 * Clear
 *
 * Removes a cache references. Optionally clear a specific
 * record by passing a url key reference.
 */
export function clear(url?: string | string[]): void;

/**
 * Disconnect
 *
 * Disconnects SPX, purges all records in memory and
 * removes all observer listeners.
 */
export function disconnect(): void;
