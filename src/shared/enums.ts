/* eslint-disable no-unused-vars */

/**
 * Attribute Selectors
 */
export enum Attributes {
  /**
   * Regex Capture Attribute List
   */
  NAMES = 'hydrate|append|prepend|target|progress|threshold|scroll|position|proximity|hover|cache|history',
}

export enum Refs {
  /**
   * An SPX Component, eg: `spx-component=""`
   *
   * Value is `99` as per `'c'.charCodeAt(0)`
   */
  COMPONENT = 99,
  /**
   * An SPX Event Node, eg: `spx@click=""`
   *
   *  Value is `101` as per `'e'.charCodeAt(0)`
   */
  EVENT = 101,
  /**
   * An SPX Node, eg: `spx-node=""`
   *
   *  Value is 110` as per `'n'.charCodeAt(0)`
   */
  NODE = 110,
    /**
   * An SPX Binding, eg: `spx-bind=""`
   *
   *  Value is `98` as per `'b'.charCodeAt(0)`
   */
  BINDING = 98
}

export enum Nodes {
  /**
   * An elements node, eg: `<div>`
   */
  ELEMENT_NODE = 1,
  /**
   * A document fragment node
   */
  FRAGMENT_NODE = 11,
  /**
   * A text node
   */
  TEXT_NODE = 3,
  /**
   * A Comment node
   */
  COMMENT_NODE = 8,
}

export enum CharCode {
  /**
   * Forward Slash `/`
   */
  FWD = 47,
  /**
   * Question Mark `?`
   */
  QWS = 63,
  /**
   * Dot `.`
   */
  DOT = 46,
  /**
   * Left Square Bracket `[`
   */
  LSB = 91,
  /**
   * Hash `#`
   */
  HSH = 35,
  /**
   * Lowercase letter `h`
   */
  LCH = 104,
  /**
   * Lowercase letter `i`
   */
  LCI = 105,
  /**
   * Lowercase letter `p`
   */
  LCP = 112
}

/**
 * Origins
 *
 * see `location.ts` file function `hasOrigin`
 */
export enum Origins {
  /**
   * URL is likely a pathname
   */
  NONE = 1,
  /**
   * URL starts with `http` or `https`
   */
  HTTP = 1,
  /**
   * URL starts with `//`
   */
  SLASH = 2,
  /**
   * URL starts with `www`
   */
  WWW = 3
}

/**
 * Component Hooks
 */
export enum Hooks {
  /**
   * Signals a connection `onmount` trigger should apply. Used when establishing a new
   * instance or on `INITIAL` page visit types.
   */
  CONNNECT = 1,
  /**
   * Signals that the component should trigger `onmount` on next `component.connect()`
   * observer action.
   */
  MOUNT = 2,
  /**
   * Indicates that the component has mounted and is rendered in the DOM.
   */
  MOUNTED = 3,
  /**
   * Signals that the component should trigger `unmount` on the next `component.disconnect()`
   * observe action.
   */
  UNMOUNT = 4,
  /**
   * Indicates the component is unmounted and not present in the DOM.
   */
  UNMOUNTED = 5
}

/**
 * Log Colors
 */
export enum Colors {
  CYAN = '#2cc9ee',
  GRAY = '#999',
  GREEN = '#6DD093',
  PURPLE = '#7b97ca',
  PINK = '#F48FB1',
  WHITE = '#FFF',
  RED = '#f86461'
}

/**
 * Error Types
 */
export enum LogLevel {
  /**
   * Prints trace info to console (does not throw)
   */
  VERBOSE = 1,
  /**
   * Prints info to console (does not throw)
   */
  INFO = 2,
  /**
   * Prints warning to console (does not throw)
   */
  WARN = 3,
  /**
   * Prints error to console (will throw Error)
   */
  ERROR = 4
}

/**
 * Error Types
 */
export enum LogType {
  /**
   * Prints Verbose info to console (does not throw)
   */
  VERBOSE = 1,
  /**
   * Prints info to console (does not throw)
   */
  INFO = 2,
  /**
   * Prints warning to console (does not throw)
   */
  WARN = 3,
  /**
   * Prints error to console (will throw TypeError)
   */
  TYPE = 4,
  /**
   * Prints error to console (will throw Error)
   */
  ERROR = 5
}

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
export enum VisitType {
  /**
   * Store was created on initial run
   *
   * @kind `reference`
   */
  INITIAL,
  /**
   * Request is programmatic prefetch
   *
   * @kind `reference`
   */
  PREFETCH,
  /**
   * Programmatic fetch triggered
   *
   * @kind `reference`
   */
  FETCH,
  /**
   * Request is a pre-emptive preload
   *
   * @kind `fetch`
   */
  PRELOAD,
  /**
   * Request is a reverse last-path fetch
   *
   * @kind `fetch`
   */
  REVERSE,
  /**
   * Request is a popstate fetch
   *
   * @kind `fetch`
   */
  POPSTATE,
  /**
   * Store was created from trigger visit.
   *
   * @kind `trigger`
   */
  VISIT,
  /**
   * Store was created from a hydration
   *
   * @kind `trigger`
   */
  HYDRATE,
  /**
   * Snapshot is recaptured
   *
   * @kind `trigger`
   */
  CAPTURE,
  /**
   * Request is reload fetch
   *
   * @kind `trigger`
   */
  RELOAD,
  /**
   * Request is a prefetch hover
   *
   * @kind `prefetch`
   */
  HOVER,
  /**
   * Request is a prefetch intersection
   *
   * @kind `prefetch`
   */
  INTERSECT,
  /**
   * Request is a prefetch proximity
   *
   * @kind `prefetch`
   */
  PROXIMITY
}
