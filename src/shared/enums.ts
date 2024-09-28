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
   * Double Quotation `"`
   */
  DQO = 34,
  /**
   * Left Curly Brace `{`
   */
  LCB = 123,
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
  LCP = 112,
  /**
   * Colon `:`
   */
  COL = 115
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
  NONE = 0,
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

export enum CanFetch {
  /**
   * URL Key does not have a snapshot record
   */
  YES = 1,
 /**
   * URL Key has already been fetched and exists in snapshot cache
   */
  NO = 2
}

export enum HookStatus {
  /**
   * The hook method does not exist on the component
   */
  UNDEFINED = 1,
  /**
   * The hook method is defined
   */
  DEFINED = 2,
  /**
   * The hook method has executed.
   *
   * > This reference is for the `connect()` hook specifically to prevent repeat calls.
   */
  EXECUTED = 3,
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
  LAVENDAR = '#D1A9FF',
  ORANGE = '#CAAF7C',
  PINK = '#F48FB1',
  WHITE = '#FFF',
  RED = '#f86461'
}

export const enum Æ {
  Gray = '90m',
  Teal = '38;5;66m',
  Green = '32m',
  Red = '31m',
  Yellow = '33m',
  Cyan = '36m',
  Blue = '38;5;81m',
  Pink = '38;5;219m'
}

/**
 * Error Types
 */
export enum LogLevel {
  /**
   * Prints error to console (will throw Error)
   */
  ERROR = 0,
  /**
   * Prints warning to console (does not throw)
   */
  WARN = 1,
  /**
   * Prints info to console (does not throw)
   */
  INFO = 2,
  /**
   * Prints trace info to console (does not throw)
   */
  DEBUG = 3,
}

/**
 * Error Types
 */
export enum Log {
  /**
   * Prints error to console (will throw Error)
   */
  ERROR = 0,
  /**
   * Prints warning to console (does not throw)
   */
  WARN = 1,
  /**
   * Prints info to console (does not throw)
   */
  INFO = 2,
  /**
   * Prints trace info to console (does not throw)
   */
  DEBUG = 3,
  /**
   * Prints error to console (will throw TypeError)
   */
  TYPE = 4,
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
