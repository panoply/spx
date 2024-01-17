/* eslint-disable no-use-before-define */
import { IPage } from './page';
import { IObserverOptions, IOptions } from './options';
import { EventNames, LifecycleEvent } from './events';
import { IConfig, IObservers, IMemory } from './config';
import { LiteralUnion, Merge, PartialDeep } from 'type-fest';
import { TypeConstructors } from './components';

export namespace SPX {

  export type This = { dom: HTMLElement}
  export type Types = { [key: string]: TypeConstructors }
  export type State<T = { [key: string]: any }> = PartialDeep<{
    [K in keyof T as K extends string ? K : never]: T[K];
  }>

  export type ClassAttrs = {
   [key: string]:
   | TypeConstructors
   | { typeof: BooleanConstructor; default: boolean; }
   | { typeof: StringConstructor; default: string; }
   | { typeof: NumberConstructor; default: number; }
   | { typeof: ArrayConstructor; default: any[]; }
   | { typeof: ObjectConstructor; default: { [key: string]: any }; }
  }

  export type Attrs<T extends SPX.ClassAttrs> = Merge<{
    [K in keyof T]:
     T[K] extends BooleanConstructor ? boolean :
     T[K] extends StringConstructor ? string :
     T[K] extends ArrayConstructor ? any[] :
     T[K] extends NumberConstructor ? number :
     T[K] extends ObjectConstructor ? { [key: string]: any } :
     T[K] extends { typeof: BooleanConstructor; default: boolean; } ? boolean :
     T[K] extends { typeof: StringConstructor; default: string; } ? string :
     T[K] extends { typeof: NumberConstructor; default: number; } ? number :
     T[K] extends { typeof: ArrayConstructor; default: any[]; } ? any[] :
     T[K] extends { typeof: ObjectConstructor; default: { [key: string]: any }; } ? T[K]['default']
     : never
  }, {
    [K in keyof T as K extends string ? `has${Capitalize<K>}` : never]: boolean;
  }>

  export type Params<S extends any, N extends string[] | { [node: string]: any }> = N extends string[]
  ? {
    [K in N as `${K[number]}Node`]: HTMLElement;
  } & {
    [K in N as `${K[number]}Nodes`]: HTMLElement[];
  } & {
    dom?: HTMLElement;
    state?: SPX.State<S>;
  }
  : {
    nodes: {
      [K in keyof N as K extends string ? `${K}Node` : never]: N[K];
    } & {
      [K in keyof N as K extends string ? `${K}Nodes` : never]: N[K];
    }
  } & {
    dom?: HTMLElement;
    state?: SPX.State<S>;
  }

  export abstract class Class<T extends Element = HTMLElement> {

    [node: string]: any;

    /**
     * **SPX Attrs**
     *
     * Attribute state references used to connect DOM states with component `state`.
     * Accepts Constructor types or `typeof` and `default` object presets.
     */
    static attrs: {
      [key: string]:
      | TypeConstructors
      | { typeof: BooleanConstructor; default: boolean; }
      | { typeof: StringConstructor; default: string; }
      | { typeof: NumberConstructor; default: number; }
      | { typeof: ArrayConstructor; default: any[]; }
      | { typeof: ObjectConstructor; default: { [key: string]: any }; }
    };

    /**
     * **SPX Document Element**
     *
     * Holds a reference to the DOM Document element `<html>` node.
     */
    html?: T;

    /**
     * **SPX Dom**
     *
     * Holds a reference to the SPX Element annotated with `spx-component`.
     */
    dom?: T;

    /**
     * **SPX State**
     *
     * An auto-generated workable object of `attrs` and component attribute state references.
     */
    state?: any;
    /**
     * **SPX `onInit`**
     *
     * An SPX component lifecycle callback that will be triggered on component register.
     */
    onInit?(): void;
    /**
     * **SPX `onLoad`**
     *
     * An SPX component lifecycle triggered for every navigation. This is the equivalent of
     * of using the SPX event emitters, e.g:
     *
     * ```js
     * spx.on('load', function() {})
     * ```
     */
    onLoad?(): void;
    /**
     * **SPX `onExit`**
     *
     * An SPX component lifecycle trigger that executes before a page replacement occurs. Use this
     * to teardown any listeners.
     *
     */
    onExit?(): void;
    /**
     * **SPX `onVisit`**
     *
     * An SPX component lifecycle trigger that executes right before a visit concludes and a page
     * replacement. This is the equivalent of using the SPX event emitters, e.g:
     *
     * ```js
     * spx.on('load', function() {})
     * ```
     */
    onVisit?(): void;
    /**
     * **SPX `onFetch`**
     *
     * An SPX component lifecycle trigger that executes when new a fetch request is made.
     *
     * ```js
     * spx.on('fetch', function() {})
     * ```
     */
    onFetch?(): void;
    /**
     * **SPX `onFetch`**
     *
     * An SPX component lifecycle trigger that executes when new record and snapshot is applied to cache
     *
     * ```js
     * spx.on('cache', function() {})
     * ```
     */
    onCache?(): void;

  }

}

/**
 * **SPX Component**
 *
 * An extends `class` applied to SPX Components.
 *
 * @example
 * import spx from 'spx';
 *
 * class Dropdown extends spx.Component {
 *
 *   // SPX Component logic here
 *
 * }
 *
 */
export class Component extends SPX.Class {}

/**
 * Supported
 *
 * Boolean to determine whether or the browser supports
 * this module.
 */
export const supported: boolean;

/**
 * Configuration
 *
 * Returns the SPX configuration defined on connection. This
 * is getter method.
 */
export const config: IConfig;

/**
 * Connect
 *
 * Establish a SPX connection with your web application. Optionally pass in connect options.
 */
export function connect(options?: IOptions): ((callback: (state?: IPage) => void) => Promise<void>);

/**
 * Session
 *
 * Returns the current session instance. This includes all state, snapshots, options and settings
 * which exists in memory. If you intend of augmenting the session, please note that the store records
 * are created without prototype.
 *
 * @example
 * import spx from 'spx';
 *
 * const session = spx.session();
 *
 * console.log(session); // Returns all the session data
 *
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
 * Triggers a reload of the current page. The page will be re-fetched over HTTP and re-cached.
 */
export function register(...Components: any[]): void;

/**
 * Reload
 *
 * Triggers a reload of the current page. The page will be re-fetched over HTTP and re-cached.
 */
export function reload(): Promise<IPage>;

/**
 * Add Event Listener
 *
 * Lifecycle event hook listener. Events are dispatched upon each navigation. If you
 * have multiple listeners they will trigger in the order they are defined. The listener
 * will return an interger `id` reference that can be used to remove events (see {@link off}).
 *
 * The listener also accepts an optional `binding` parameter. When provided, the callback function
 * will bind the `this` context to the event.
 *
 * **Lifecyle Order**
 *
 * The events will be omitted in the following order:
 *
 * 1. `prefetch`
 * 2. `fetch`
 * 4. `visit`
 * 5. `before:cache`
 * 6. `after:cache`
 * 7. `hydrate`
 * 8. `render`
 * 9. `load`
 *
 * ---
 *
 * @example
 * import spx from 'spx'
 *
 * // Example 1 - Listening to the load event
 * spx.on('load', () => console.log('Hello World!'));
 *
 * // Example 2 - Binding scope to the callback context
 * spx.on('load', function() {
 *
 *   console.log(this.foo) // => value will be "bar"
 *
 * }, { foo: 'bar' });
 *
 */
export function on<T extends EventNames>(event: T, callback: LifecycleEvent<T>, binding?: any): number;

/**
 * Remove Event Listener
 *
 * Removes an event listener added using `spx.on`. Requires you pass the event listeners name as
 * the first parameter. The second parameter fan be callback function provided to `spx.on` or the
 * event id, which is an interger that the `spx.on` method returned.
 *
 * @example
 * import spx from 'spx'
 *
 * // EXAMPLE 1
 * // Using the returning identifier
 *
 * const id = spx.on('load', () => {
 *  console.log('Hello World!')
 * });
 *
 * spx.off('load', id); // pass the id to remove the event
 *
 * // EXAMPLE 2
 * // Using the callback function
 *
 * const load = () => {
 *  console.log('Lorem Ipsum');
 * }
 *
 * spx.on('load', load);
 * spx.off('load', load); // Pass function to remove event
 */
export function off<T extends EventNames>(event: T, callback: LifecycleEvent<T> | number): number;

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
 * Form
 *
 * Programmatic form submission. This method will simulus form requests and returning
 * the response document reference
 *
 * @example
 *
 * // This would hydrate the <main> element but
 * // preserve the <div id="navbar"> element.
 * spx.form('/submission', {
 *  method: 'POST',
 *  hydrate: ["main", "!#navbar"],
 *  data: {
 *   name: 'Marvin Hagler',
 *   profession: 'Professional Boxer',
 *   age: 35,
 *   champion: true
 *  }
 * })
 */
export function form<T extends object>(url: string, options: {
  /**
   * The form submission method
   *
   * @default 'POST'
   */
  method: LiteralUnion<'GET' | 'POST' | 'DELETE' | 'PUT', string>;
  /**
   * The payload request data
   */
  data: T;
  /**
   * Hydration nodes in response
   */
  nodes?: string[];
}): Promise<Document>

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
