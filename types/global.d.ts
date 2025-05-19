/* eslint-disable no-redeclare */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */

import type { Config, Observers, Memory } from './config';
import type { LiteralUnion } from 'type-fest';
import type { Page } from './page';
import type { Options } from './options';
import type { EventNames, LifecycleEvent } from './events';
import type { ComponentSession, Class, Component, Scope } from './components';
import type { Session } from './session';
import type { Attrs, ComponentState, DOMEvents, Identity, TypeEvent } from 'types';
import { HTTPConfig } from './http';
export * from './components';
export * from './session';
export * from './events';
export * from './options';
export * from './config';
export * from './page';

/**
 * **SPX Types**
 *
 * Small collection of TypeScript utilities for dealing with SPX
 */
export declare namespace SPX {

  export { Page, Options, Class, Scope };

  export abstract class Methods {

    /**
    * ### Component (Base Class)
    *
    * The **extends** base class for SPX Components.
    *
    * ---
    *
    * #### TypeScript Example
    *
    * ```ts
    * import spx from 'spx';
    *
    * class Demo extends spx.Component<HTMLElement>({
    *   state: {},
    *   nodes: <const>[] // Using <const> for intelliSense
    * }) {
    *
    * }
    * ```
    *
    * #### JavaScript Example
    *
    * ```ts
    * import spx from 'spx';
    *
    * class Example extends spx.Component({
    *   state: {},
    *   nodes: []
    * }) {
    *
    *   // SPX Component logic here
    *
    * }
    * ```
    */
    static Component: Component;

    /**
    * ### Supported
    *
    * Boolean to determine whether or not the browser supports SPX. You can use this
    * to load in polyfills if you plan on supporting legacy browsers.
    *
    * [SPX Documentation](https://spx.js.org/misc/polyfills/)
    */
    static readonly supported: boolean;

    /**
    * ### Session
    *
    * Returns the current session instance. This includes all state, snapshots, options and settings
    * which exists in memory. If you intend
    *
    * > **Note**
    * >
    * > This is the internal data model, from which SPX operates. Treat this as **read only** and
    * > avoid manipulating the model, use the available methods if you wish to carry out session manipulation.
    */
    static readonly $: Session;

    /**
    * ### Live
    *
    * This method retrieves, iterates and interface with component instances. You have the option to
    * specify and filter components by passing name/s or an alias identifier. The method is flexible,
    * it allows you to obtain specific instances, observe mounts and perform actions on components globally.
    *
    * > **NOTE**
    * >
    * > This differs from the capitilized `spx.Component` method. The `spx.Component` method is used
    * > for class extends, where this method is used for interfacing.
    *
    * [SPX Documentation](https://spx.js.org/api/component/)
    *
    * ---
    *
    * #### Example
    *
    * ```js
    * import spx from 'spx';
    *
    * // Returns component named "foo"
    * spx.live('foo')
    *
    * // Return a live component name "foo" otherwise false
    * spx.live('foo', { live: true })
    *
    * // Iteration over all components named "foo"
    * spx.live('foo', instance => instance.method())
    *
    * // Observe component name foo, callback if or when live
    * spx.live('foo', { observe: true }, instance => instance.method())
    *
    * // Iterate over all components
    * spx.live(instance => instance.method())
    *
    * // Iterate over all live components
    * spx.live({ live: true }, instance => instance.method())
    *
    * ```
    */
    static live: {
      <T = Class>(id: string): T;
      <T = Class>(id: string, callback: (instance: T) => void): void;
    };

    /**
    * ### Global
    *
    * Define a global dataset to be exposed and made available within all contexts. You'd typically leverage
    * this within a `<script>` tag and it can be used as store for references.
    *
    * > Global data is **READ ONLY** and once defined it cannot be overwritten.
    *
    * ---
    *
    * #### Example
    *
    * Use the `global` within a `<script>` tag.
    *
    * ```html
    * <script>
    *   spx.global({
    *     foo: 'string',
    *     bar: true,
    *     baz: {
    *       qux: 100
    *     }
    *   })
    * </script>
    * ```
    *
    * Whenever we trigger a hook, the global data is made available.
    *
    * ```js
    * spx.on('load', function({ global }) {
    *
    *    console.log(global.baz) // logs { qux: 100 }
    *
    * })
    * ```
    */
    static global<T extends { [key: string]: any }>(model: T): T;

    /**
    * #### Session
    *
    * Returns the current session instance. This includes all state, snapshots, options and settings
    * which exists in memory. If you intend of augmenting the session, please note that the store records
    * are created without prototype.
    *
    * ---
    *
    * #### Example
    *
    * ```js
    * import spx from 'spx';
    *
    * const session = spx.session();
    *
    * console.log(session); // Returns all the session data
    *
    * ```
    */
    static session(key?: string, merge?: object): {
      pages: { [key: string]: Page; };
      snaps: { [uuid: string]: string; };
      memory: Memory & { size: string };
      config: Config;
      observers: Observers;
      components: ComponentSession
    }

    /**
    * #### Component Register
    *
    * Accepts raw components and makes them available for usage. Components must be
    * added to the registry in SPX and this method allows you to provide custom identifers
    * for DOM mapping. You can pass components 4 different ways (see example).
    *
    * > **NOTE**
    * >
    * > You can also choose to pass components upon connection via the `components{}` option.
    *
    * [SPX Documentation](https://spx.js.org/components/register/)
    *
    * ---
    *
    * #### Example
    *
    * ```js
    * import spx from 'spx';
    * import { Foo } from './components/foo';
    * import { Bar } from './components/foo';
    * import { Baz } from './components/foo';
    *
    * // Option 1 - Register as a spread
    * //
    * spx.register(Foo, Bar, Baz);
    *
    * // Option 2 - Register as an array list
    * //
    * spx.register([
    *   Foo,  // identifier will be: foo
    *   Bar,  // identifier will be: bar
    *   Baz   // identifier will be: baz
    * );
    *
    * // Option 3 - Register with named identifier
    * //
    * spx.register('example', Foo);  // identifier will be: example
    * spx.register('another', Bar);  // identifier will be: another
    * spx.register('some-id', Bar);  // identifier will be: someId
    *
    * // Option 4 - Register as an object map
    * //
    * spx.register({
    *   Foo,       // identifier will be: foo
    *   Bar,       // identifier will be: bar
    *   qux: Baz   // identifier will be: qux
    * })
    *
    * // Option 5 - Register as an array map
    * //
    * spx.register([
    *   ['foo', Foo]
    *   ['bar', Bar],  // identifier will be: bar
    *   ['qux', Baz]   // identifier will be: qux
    * ])
    * ```
    */
    static register(...component:
      | [ ...any ]
      | [ identifer: string, component: any ]
      | [{ [identifier: string]: any }]
      | Array<[identifier: string, component: any ]>): void

    /**
    * #### Reload
    *
    * Triggers a reload of the current page. The page will be re-fetched over HTTP and re-cached.
    *
    * [SPX Documentation](https://spx.js.org/api/reload/)
    * ---
    *
    * #### Example
    *
    * ```js
    * import spx from 'spx';
    *
    * spx.reload().then(page => {});
    * ```
    */
    static reload(): Promise<Page>;

    /**
    * #### Add Event Listener
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
    * #### Example
    *
    * ```js
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
    * }, {
    *   foo: 'bar',
    *   baz: 'qux'
    * });
    *
    * ```
    */
    static on<T extends EventNames, S = unknown>(
      event: T,
      callback: LifecycleEvent<T, S>,
      binding?: any
    ): number;

    /**
    * #### Remove Event Listener
    *
    * Removes an event listener added using `spx.on`. Requires you pass the event listeners name as
    * the first parameter. The second parameter fan be callback function provided to `spx.on` or the
    * event id, which is an interger that the `spx.on` method returned.
    *
    * ---
    *
    * #### Example
    *
    * ```js
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
    * const load = () => console.log('Lorem Ipsum');
    *
    * spx.on('load', load);
    * spx.off('load', load); // Pass function to remove event
    *
    * ```
    */
    static off<T extends EventNames>(event: T, callback: LifecycleEvent<T, any> | number): number;

    /**
     * #### HTTP
     *
     * HTTP Request client for fetching a resource from the network using **XHR**
     * instead of [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch).
     *
     * SPX uses the [XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest) API
     * under the hood and you can optionally have SPX handle all data and resource requests within
     * your web application.
     */
    static http <T>(url?: string, options?: HTTPConfig): Promise<T>

    /**
    * #### State
    *
    * View or modify page state record.
    */
    static state (key?: string, store?: Page): { page: Page, dom: Document }

    /**
    * #### Render
    *
    * Programmatic rendering
    */
    static render <T = any>(url: string, pushState: 'replace' | 'push', fn: (
      this: {
        /**
          * The current page state
          */
        page: Page;
        /**
          * The current document
          */
        dom: Document;
      },
      /**
       * The fetched document
       */
      dom: Document
    ) => Document, context?: T): Promise<Page>

    /**
    * #### Capture
    *
    * Performs a snapshot modification to the current document. Use this to align a snapshot cache
    * record between navigations. This is helpful in situations where the dom is augmented and you want
    * to preserve the current DOM.
    */
    static capture(targets?: string[]): void

    /**
    * #### Form
    *
    * Programmatic form submission. This method will submit form requests and return
    * the response document reference.
    *
    * ---
    *
    * #### Example
    *
    * ```js
    * import spx from 'spx';
    *
    * // This would hydrate the <main> element but
    * // preserve the <div id="navbar"> element.
    * spx.form('/submission', {
    *   method: 'POST',
    *   hydrate: ["main", "!#navbar"],
    *   data: {
    *    name: 'Marvin Hagler',
    *    profession: 'Professional Boxer',
    *    age: 35,
    *    champion: true
    *  }
    * })
    *
    * ```
    */
    static form<T extends object>(url: string, options: {
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
    * #### Hydrate
    *
    * Programmatic hydrate execution. The method expects a `url` and accepts an optional selector
    * target string list. You can preserve certain elements from morphs by prefixing an `!` mark.
    *
    * ---
    *
    * #### Example
    *
    * ```js
    * import spx from 'spx';
    *
    * // This would hydrate the <main> element but
    * // preserve the <div id="navbar"> element.
    * spx.hydrate('/path', ["main", "!#navbar"])
    *
    * ```
    */
    static hydrate(url: string, nodes: string[]): Promise<Document>

    /**
    * #### Prefetch
    *
    * Executes a programmatic prefetch. The method expects a `url` or `<a href="">`
    * node as an argument. This method behaves the same way as hover, intersect
    * or proximity prefetch.
    */
    static prefetch(link: string): Promise<Page>

    /**
    * #### Route
    *
    * Executes a programmatic visit. The method optionally
    * accepts a page state modifier as second argument.
    */
    static visit(link: string, state?: Page): Promise<Page>;

    /**
     * #### Dom
     *
     * Expects a HTML String Literal and will return either an `HTMLElement`
     * or an `HTMLElement[]` array list depending on the markup structure
     * provided by the literal.
     *
     * > **NOTE**
     * >
     * > You can access the original literal via the `raw` getter on
     * > the returning `HTMLElement` or `HTMLElement[]`.
     *
     * ---
     *
     * @example
     *
     * // Creating a button
     * //
     * const button = spx.dom<HTMLButtonElement>`
     *  <button type="button">
     *    Hello World!
     *  </button>
     * `
     * button     // Returns the <button> element
     * button.raw // Returns literal string
     *
     * // Creating several list items
     * //
     * const items = spx.dom<HTMLLIElement[]>`
     *  <li>foo</li>
     *  <li>bar</li>
     *  <li>baz</li>
     * `
     * items     // Returns an array if <li> elements.
     * items.raw // Returns literal string
     * items[0]  // <li>foo</li>
     * items[1]  // <li>bar</li>
     * items[2]  // <li>baz</li>
     */
    static dom<T extends HTMLElement>(markup: TemplateStringsArray, ...values: string[]): T

    /**
     * #### Fetch
     *
     * Executes a programmatic fetch. The XHR request response is not
     * cached and no state references are touched. The XHR response is
     * returned as DOM.
     *
     * ---
     *
     * #### Example
     *
     * ```js
     * import spx from 'spx';
     *
     * spx.fetch('/some/path').then(dom => {
     *
     *   dom.querySelector('.el').classList.add('active')
     *
     *   return dom // Return DOM to update snapshot
     *
     * })
     * ```
     */
    static fetch(url: string): Promise<Document>;

    /**
    * #### Clear
    *
    * Removes a cache references. Optionally clear a specific
    * record by passing a url key reference.
    */
    static clear(url?: string | string[]): void;

    /**
    * #### Disconnect
    *
    * Disconnects SPX, purges all records in memory and
    * removes all observer listeners.
    */
    static disconnect(): void;

  }

  export interface API extends Identity<typeof Methods> {

   /**
    * #### Connect
    *
    * Establish a SPX connection with your web application. Optionally pass in connect options.
    *
    * ---
    *
    * #### Example
    *
    * ```js
    * import spx from 'spx';
    *
    * spx()(function() {
    *
    *   // DOM Ready
    *
    * })
    * ```
    */
   (options?: Options): (callback: (state?: Page) => void) => Promise<void>;

  }

  /**
   * An event sent when the state of contacts with a touch-sensitive surface changes.
   * This surface can be a touch screen or trackpad, for example. The event can describe
   * one or more points of contact with the screen and includes support for detecting movement,
   * addition and removal of contact points, and so forth.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Event)
   */
  export type Event<A = Attrs, E = HTMLElement> = TypeEvent<DOMEvents['Event'], E, A>;
  /**
   * The InputEvent interface represents an event notifying the user of editable content changes.
   *
   * ```html
   *
   * <input
   *  type="text"
   *  spx@input="component.method" />
   *
   * ```
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent)
   */
  export type InputEvent<A = Attrs, E = HTMLInputElement> = TypeEvent<DOMEvents['InputEvent'], E, A>;
  /**
   * KeyboardEvent objects describe a user interaction with the keyboard; each event describes a
   * single interaction between the user and a key (or combination of a key with modifier keys) on
   * the keyboard.
   *
   * ```html
   *
   * <input
   *  type="text"
   *  spx@keydown="component.method" />
   *
   * ```
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)
   */
  export type KeyboardEvent<A = Attrs, E = HTMLElement> = TypeEvent<DOMEvents['KeyboardEvent'], E, A>;
  /**
   * An event sent when the state of contacts with a touch-sensitive surface changes. This surface
   * can be a touch screen or trackpad, for example. The event can describe one or more points of
   * contact with the screen and includes support for detecting movement, addition and removal of
   * contact points, and so forth.
   *
   * ```html
   *
   * <input
   *  type="text"
   *  spx@keydown="component.method" />
   *
   * ```
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent)
   */
  export type TouchEvent<A = Attrs, E = HTMLElement> = TypeEvent<DOMEvents['TouchEvent'], E, A>;
  /**
   * The state of a DOM event produced by a pointer such as the geometry of the contact point,
   * the device type that generated the event, the amount of pressure that was applied on the contact
   * surface, etc.
   *
   * ```html
   *
   * <button type="button" spx@click="component.method">
   *   Click
   * </button>
   *
   * ```
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent)
   */
  export type PointerEvent<A = Attrs, E = HTMLElement> = TypeEvent<DOMEvents['PointerEvent'], E, A>;
  export type DragEvent<A = Attrs, E = HTMLElement> = TypeEvent<DOMEvents['DragEvent'], E, A>;
  export type FocusEvent<A = Attrs, E = HTMLElement> = TypeEvent<DOMEvents['FocusEvent'], E, A>;
  export type MouseEvent<A = Attrs, E = HTMLElement> = TypeEvent<DOMEvents['MouseEvent'], E, A>;
  export type AnimationEvent<A = Attrs, E = HTMLElement> = TypeEvent<DOMEvents['AnimationEvent'], E, A>;
  export type WheelEvent<A = Attrs, E = HTMLElement> = TypeEvent<DOMEvents['WheelEvent'], E, A>;
  export type SubmitEvent<A = Attrs, E = HTMLElement> = TypeEvent<DOMEvents['SubmitEvent'], E, A>;
  export type ToggleEvent<A = Attrs, E = HTMLElement> = TypeEvent<DOMEvents['ToggleEvent'], E, A>;
  export type FormDataEvent<A = Attrs, E = HTMLElement> = TypeEvent<DOMEvents['FormDataEvent'], E, A>;

  /**
   * An extended variation of {@link HTMLElementTagNameMap} which exposes support to some custom
   * tag name variations, these include:
   *
   * ```js
   * 'href' // HTMLAnchorElement (same as 'a')
   * ```
   */
  export type TagNodes = HTMLElementTagNameMap & {
    /**
     * Hyperlink elements and provides special properties and methods (beyond those of the regular
     * HTMLElement object interface that they inherit from) for manipulating the layout and presentation
     * of such elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement)
     */
    href: HTMLAnchorElement;
  }

  /**
   * Literal Union of the keys existing on {@link TagNodes} Element map.
   */
  export type TagNames = keyof TagNodes;

  /**
   * State object where `T` returns optional object.
   */
  export type State<T extends object> = {
    state: { [K in keyof T]?: T[K] }
  }

  /**
   * #### Component Definition
   *
   * The static `define` property of component classes
   */
  export type Define = {
    /**
     * Identifier Name
     */
    name?: string;
    /**
     * Media Query
     */
    media?: [
      'xs',
      'sm',
      'md',
      'lg',
      'xl'
    ];
    /**
     * Whether or not to merge on mount
     */
    merge?: boolean;
    /**
     * #### State
     *
     * Attribute state references used to connect DOM states with component `this.state`.
     * Accepts Constructor types or `typeof` and `default` object presets.
     */
    state?: ComponentState;
    /**
     * #### Nodes
     *
     * DOM Node identifier references used to connect elements in the DOM with component
     * `this<node>` values.
     */
    nodes?: ReadonlyArray<string>;
  }

}
