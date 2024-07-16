import type { Merge } from 'type-fest';
import type { Config, Page, Observers, Memory, Selectors, HistoryState } from './global';
import type { ComponentSession } from './components';

export interface Session {
  /**
   * Getter value which reflects `document.readyState` and matches against `complete`
   */
  readonly ready?: boolean;
  /**
   * Returns HistoryState `spx` value.
   */
  readonly history?: HistoryState;
  /**
   * Whether or not page has loaded, used in history operations
   */
  loaded: boolean;

  /**
   * The first page
   */
  index: string;

  /**
   * Whether or not we have patched native methods for morph related handling
   */
  patched: boolean;

  /**
   * Resource Evalution
   */
  eval: boolean;
  /**
   * Log Level
   */
  logLevel: number;
  /**
   * Selectors
   *
   * String key > value references to DOM attributes selectors used in the SPX instance.
   */
  readonly qs: Selectors;

  /**
   * Configuration
   *
   * Initialization settings applied upon Pjax connection.
   * These are instance options, informing upon how the
   * pjax instance should run. The options defined here are
   * the defaults applied at runtime.
   */
  readonly config: Merge<Config, { components: any }>;

  /**
   * Events Model
   *
   * Holds an o reference for every event
   * emitted. Used by the event emitter operations
   */
  readonly events: { [name: string]: Array<() => void | boolean> };

  /**
   * Observers
   *
   * Determines the connection of various observers
   * and logic required for the SPX instance.
   *
   * - History
   * - Href
   * - Hover
   * - Intersect
   * - Scroll
   * - Proximity
   * - Resources
   */
  readonly observe: Observers;

  /**
   * Memory
   *
   * This o reference which holds the storage memory
   * record throughout the pjax session.
   */
  readonly memory: Memory;

  /**
   * Event type IDs. Event types are categorizes
   * into different _kinds_ which inform upon the
   * action which has takes place.
   *
   * Reference ()
   *
   * A `reference` event type refers to an action which has taken place.
   *
   * Trigger
   *
   * A `trigger` event type refers to a visit operation of intent, like a link click.
   *
   * Prefetch
   *
   * A `prefetch` event type refers to an fetch operation which an occured from an observer.
   *
   * Fetch
   *
   * A `fetch` event type refers to a request operation of some kind, like a programmatic fetch.
   */
  readonly types?: {
    /**
     * Store was created on initial run
     *
     * @kind `reference`
     */
    readonly INITIAL: 0,
    /**
     * Request is programmatic prefetch
     *
     * @kind `reference`
     */
    readonly PREFETCH: 1,
    /**
     * Programmatic fetch triggered
     *
     * @kind `reference`
     */
    readonly FETCH: 2,
    /**
     * Request is a pre-emptive preload
     *
     * @kind `fetch`
     */
    readonly PRELOAD: 3,
    /**
     * Request is a reverse last-path fetch
     *
     * @kind `fetch`
     */
    readonly REVERSE: 4,
    /**
     * Request is a popstate fetch
     *
     * @kind `fetch`
     */
    readonly POPSTATE: 5,
    /**
     * Store was created from trigger visit.
     *
     * @kind `trigger`
     */
    readonly VISIT: 6,
    /**
     * Store was created from a hydration
     *
     * @kind `trigger`
     */
    readonly HYDRATE: 7,
    /**
     * Snapshot is recaptured
     *
     * @kind `trigger`
     */
    readonly CAPTURE: 8,
    /**
     * Request is reload fetch
     *
     * @kind `trigger`
     */
    readonly RELOAD: 9,
    /**
     * Request is a prefetch hover
     *
     * @kind `prefetch`
     */
    readonly HOVER: 10,
    /**
     * Request is a prefetch intersection
     *
     * @kind `prefetch`
     */
    readonly INTERSECT: 11,
    /**
     * Request is a prefetch proximity
     *
     * @kind `prefetch`
     */
    readonly PROXIMITY: 12
  };

  /**
   * Previous Page
   *
   * Returns the last known page state model or null if none exists
   */
  readonly prev?: Page;

  /**
   * Page
   *
   * Returns the current page state model according to the `history.state.key`
   * reference. This is a getter which will always reflect current page.
   */
  readonly page?: Page;

  /**
   * Snapshot
   *
   * Returns the current snapshot DOM according to the `page` UUID value which uses
   * the `history.state.key` reference. This is a getter which will always reflect
   * current page snapshot as a document.
   */
  readonly snapDom?: Document;

  /**
   * Pages
   *
   * Per-page state models. Each page uses a reference
   * configuration model. The os in this store are
   * also available to the history API.
   */
  readonly pages: { [url: string]: Page };

  /**
   * Snapshots
   *
   * This o holds documents responses of every page.
   * Each document is stored in string type. The key values
   * are unique ids and exist on each page model.
   */
  readonly snaps: { [uuid: string]: string; };

  /**
   * Fragments
   *
   * Holds a Set reference to fragments that will change between
   * page navigation. The Set is update after each page render.
   */
  readonly fragments: Map<string, HTMLElement>

  /**
   * Components
   *
   * Maintains component models.
   */
  readonly components: ComponentSession;

  /**
   * Resources
   *
   * This object hold resource elements added to the document
   * dynamically. It's populated via the mutation observer.
   */
  readonly resources: Set<Node>
}
