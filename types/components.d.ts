/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import type { LiteralUnion, Merge, KebabCase, Split, LastArrayElement, IsAny, EmptyObject } from 'type-fest';
import type { Page } from './page';
import type { setInstances } from '../src/components/instance';
import { SPX } from './global';
import { Identity, Match } from 'types';

declare enum Hooks {
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

declare enum HookStatus {
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

export type NativeTypes= (
  | string
  | boolean
  | number
  | object
  | unknown[]
)

/**
 * Type Constructors
 *
 * Used for the `static attrs = {}` state interface of custom components
 */
export type TypeConstructors = (
  | StringConstructor
  | BooleanConstructor
  | ObjectConstructor
  | NumberConstructor
  | ArrayConstructor
)

export type TypeOf<T extends TypeConstructors> = (
  T extends BooleanConstructor ? boolean :
  T extends StringConstructor ? string :
  T extends NumberConstructor ? number :
  T extends ArrayConstructor ? T :
  T extends ObjectConstructor ? Record<string, unknown> : never
)

/**
 * **SPX State Interface**
 *
 * Type represents the static `define` structure of type contstructors
 */
export type Types = Record<string,
  | StringConstructor
  | BooleanConstructor
  | ObjectConstructor
  | NumberConstructor
  | ArrayConstructor
  | TypeOf<BooleanConstructor>
  | TypeOf<StringConstructor>
  | TypeOf<NumberConstructor>
  | TypeOf<ArrayConstructor>
  | TypeOf<ObjectConstructor>
>

export type TypeState<T extends TypeConstructors> = {
  /**
   * The state type
   */
  typeof: T;
  /**
   * Default value to use
   */
  default: TypeOf<T>;
} | {
  /**
   * The state type
   */
  typeof: T;
  /**
   * Default value to use
   */
  default?: TypeOf<T>;
  /**
   * Whether or not to persist this state reference
   */
  persist?: boolean;
}

export type TypePersist<T extends TypeConstructors> = {
  /**
   * The state type
   */
  typeof: T;
  /**
   * Default value to use
   */
  default?: TypeOf<T>;
  /**
   * Whether or not to persist this state reference
   */
  persist: boolean;
}

export type TypeShared<T extends TypeConstructors> = {
  /**
   * The state type
   */
  typeof: T;
  /**
   * Default value to use
   */
  default?: TypeOf<T>;
  /**
   * Whether or not the state reference is shared
   */
  shared: boolean;
}

export type TypeEvent<E, T, A> = Merge<E, {
  /**
   * Event Target
   */
  target: T;
  /**
   * **SPX Event Attrs**
   *
   * Parameter values passed on event annotated elements.
   */
  attrs: A;
}>

interface DOMEvents {
  Event: Event;
  InputEvent: InputEvent;
  KeyboardEvent: KeyboardEvent;
  TouchEvent: TouchEvent;
  PointerEvent: PointerEvent;
  DragEvent: DragEvent;
  FocusEvent: FocusEvent;
  MouseEvent: MouseEvent;
  AnimationEvent: AnimationEvent;
  WheelEvent: WheelEvent;
  SubmitEvent: SubmitEvent
  ToggleEvent: ToggleEvent;
  FormDataEvent: FormDataEvent;
}

type Selector<T extends SPX.Define> = { [K in T['nodes'][number]]: HTMLElement }
type HasNode<E extends SPX.Define> = { [K in E['nodes'][number] as K extends string ? K : never]?: boolean; }
type GetNode<T extends SPX.Define> = T['nodes'][number] extends string ? T['nodes'][number] : string;

/**
 * **SPX Component State**
 *
 * Helper utility for automatically assigning `this.state` to components.
 *
 * ```ts
 * import spx, { SPX } from 'spx';
 *
 * class Example extends spx.Component({ state: SPX.State }) {
 *
 * }
 * ```
 */
export type State<T extends SPX.Define> = Merge<{
  [K in keyof T['state']]: (
    T['state'][K] extends BooleanConstructor ? boolean :
    T['state'][K] extends NumberConstructor ? number :
    T['state'][K] extends StringConstructor ? ReturnType<T['state'][K]> :
    T['state'][K] extends ArrayConstructor ? ReturnType<T['state'][K]> :
    T['state'][K] extends ObjectConstructor ? ReturnType<T['state'][K]> :
    T['state'][K] extends TypeState<BooleanConstructor> ? boolean :
    T['state'][K] extends TypeState<NumberConstructor> ? number :
    T['state'][K] extends TypeState<StringConstructor> ? ReturnType<T['state'][K]['typeof']> :
    T['state'][K] extends TypeState<ArrayConstructor> ? ReturnType<T['state'][K]['typeof']> :
    T['state'][K] extends TypeState<ObjectConstructor> ? ReturnType<T['state'][K]['typeof']> :
    T['state'][K] extends boolean ? boolean :
    T['state'][K] extends unknown[] ? unknown[] :
    T['state'][K] extends object ? object :
    T['state'][K] extends string ? string :
    T['state'][K] extends number ? number :never
  )
}, {
  /**
   * **Has Reference**
   *
   * Whether or not the state reference exists on the component template.
   */
  [K in keyof T['state'] as K extends string ? `has${Capitalize<K>}` : never]: boolean;
}>

/* -------------------------------------------- */
/* DOM                                          */
/* -------------------------------------------- */

/**
 * DOM Select
 *
 * Returns the HTMLElement nodes, `this.dom` utilities and array list iterators.
 */
declare type DOMSelect<T extends string> = Lowercase<T> extends SPX.TagNames
  ? SPX.TagNodes[Lowercase<T>]
    & Identity<typeof DOMExtend>
    & DOMArray<SPX.TagNodes[Lowercase<T>]>
  : HTMLElement
    & Identity<typeof DOMExtend>
    & DOMArray<HTMLElement>

/**
 * DOM Select
 *
 * Returns the HTMLElement nodes, `this.dom` utilities and array list iterators.
 */
declare type DOMTag<T extends string> = Lowercase<T> extends SPX.TagNames
  ? SPX.TagNodes[Lowercase<T>] & Identity<typeof DOMExtend>
  : HTMLElement & Identity<typeof DOMExtend>

declare class ToNode {

  /**
   * #### toNode
   *
   * Returns the Element itself.
   *
   * > **IMPORTANT**
   * >
   * > **Use this method to return the raw HTMLElement**
   *
   * @example
   *
   * this.dom.node.off('click') // => boolean
   * this.dom.node.off(1,2,3)   // => boolean
   */
  static toNode(): HTMLElement;

}
/**
 * DOM Extends
 *
 * Exposes sugar DOM Node methods that will extend each node of a component for
 * quick and effective operations.
 */
declare class DOMExtend {

  /**
   * #### hasClass
   *
   * Check whether or not this node element contains the provided class names.
   *
   * @example
   *
   * this.dom.node.hasClass('a')       // => boolean (string)
   * this.dom.node.hasClass('b,c')     // => boolean (separator)
   * this.dom.node.hasClass('d','e')   // => boolean (...spread)
   */
  static hasClass(...className: string[]): boolean;
  /**
   * #### setClass
   *
   * Add a class or multiple classes to the node element. The classList
   * will be checked before addition and skipped if class exists.
   *
   * @example
   *
   * this.dom.node.addClass('a')     // => void
   * this.dom.node.addClass('b,c')   // => void
   * this.dom.node.addClass('d','e') // => void
   */
  static addClass(...className: string[]): void;
  /**
   * #### removeClass
   *
   * Remove a class or multiple classes contained on this node element.
   * The classList will be checked before removal, only classes which exist
   * will be removed.
   *
   * @example
   *
   * this.dom.node.removeClass('a')     // => void
   * this.dom.node.removeClass('b,c')   // => void
   * this.dom.node.removeClass('d','e') // => void
   */
  static removeClass(...className: string[]): boolean;

  /**
   * #### toggleClass
   *
   * Toggle a class or multiple classes contained on this node. The classList
   * will be checked for the existence of the class value, adding the class
   * value/s if they do not exists, and removing if the do.
   *
   * @example
   *
   * this.dom.node.toggleClass('a')     // => void
   * this.dom.node.toggleClass('b,c')   // => void
   * this.dom.node.toggleClass('d','e') // => void
   */
  static toggleClass(fromClass: string | string[], className?: string | string[]): boolean;

  /**
   * #### hasAttr
   *
   * Check whether or not this node element contains the provided attributes.
   *
   * @example
   *
   * this.dom.node.hasAttr('value')     // => boolean
   * this.dom.node.hasAttr('id,name')   // => boolean
   * this.dom.node.hasAttr('type','id') // => boolean
   */
  static hasAttr(...attrName: string[]): boolean;

  /**
   * #### removeAttr
   *
   * Remove an attribute or multiple attributes contained on this node element.
   * Attributes will be checked before removal, only those which exist
   * will be removed.
   *
   * @example
   *
   * this.dom.node.removeClass('a')     // => void
   * this.dom.node.removeClass('b,c')   // => void
   * this.dom.node.removeClass('d','e') // => void
   */
  static removeAttr(...attrName: string[]): boolean;

  /**
   * #### setAttr
   *
   * Creates or resets an attribute or multiple attributes contained on this node.
   *
   * @example
   *
   * this.dom.node.setAttr({ name: 'value' }) // => void
   * this.dom.node.setAttr('name', 'value')   // => void
   */
  static setAttr(attribute: Record<string, any>): void;

  /**
   * #### getAttr
   *
   * Returns an attribute value or multiple attribute values contained on this node.
   *
   * @example
   *
   * this.dom.node.getAttr('data-value') // => string
   * this.dom.node.getAttr('id','value') // => { id: string, type: string }
   */
  static getAttr<A extends readonly string[]>(...attribute: A): Record<A[number], string>;

  /**
   * #### on
   *
   * Attach an event or multiple events to this dom node. This method is curried and will
   * automatically assign context to callbacks. The event returns an object with integer value
   * that can be used to remove event listeners.
   *
   * @example
   *
   * this.dom.node.on('keypress')(e => {})       // => { keypress: number }
   * this.dom.node.on('click','focus')(e => {})  // => { click: number, focus: number }
   */
  static on(eventName: string):((this: typeof Class, event: Event) => void);
  /**
   * #### off
   *
   * Removes an attached event listener that was created using `on`.
   *
   * @example
   *
   * this.dom.node.off('click') // => boolean
   * this.dom.node.off(1,2,3)   // => boolean
   */
  static off(eventName: string): boolean;

  /**
   * #### watch
   *
   * Observes the provided node for mutations via the `MutationObserver` and will
   * callback to the curried function of the method. This method will automatically
   * bind component context to scope.
   *
   * @example
   *
   * this.dom.node.watch({ subTree: true })((mutation) => {}) // => boolean
   */
  static watch(options: MutationObserverInit): (this: typeof Class, event: Event) => void;

}

/**
 * DOM Array
 *
 * Callback functions for iterating and cycling through component nodes.
 * Available on the `this.dom` scope only.
 */
interface DOMArray<T> {
  /**
   * List Nodes
   *
   * Returns an array list of all the nodes using the identifier.
   */
  (): T[];
  /**
   * ### Get Node
   *
   * Pass an index number to return the DOM element.
   */
  (index: number): T & Identity<typeof DOMExtend>;
  /**
   * ### Each
   *
   * Iterates over all DOM nodes like `forEach` with an `undefined` or `void`
   * return value. If values have been returned, this will behave like a map.
   */
  <U extends void | undefined>(map: (node: T & Identity<typeof DOMExtend>, index: number) => U): U;
  /**
   * ### Map
   *
   * Iterates over all DOM nodes and generates a new array based on the return value.
   * This is the same callback as `each`, only difference is return value types.
   */
  <U>(map: (node: T & Identity<typeof DOMExtend>, index: number) => U): U[];
  /**
   * ### Reduce
   *
   * Iterate as a reducer, return a new value.
   */
  <U extends unknown[] | object | number | string>(
    initial: U,
    reduce: (acc: U, node: T & Identity<typeof DOMExtend>, index: number) => U): U;
  /**
   * ### Filter
   *
   * Iterate as a filter, return a boolean `false` or `true` for each node
   * in the callback and the resulting value will be a filtered list.
   *
   * > **NOTE**
   * >
   * > **Pass a `boolean` value as the first parameter to signal filter iteration.**
   * > **When the first parameter is not a `boolean` type, the reducer will be used.**
   * > **You must return a `boolean` value for every item in the array.**
   */
 <U extends boolean>(filter: U, each: (node: T & Identity<typeof DOMExtend>, index: number) => U): T[];

}

/**
 * DOM Node
 *
 * Determines whether or not the node identifier should return a specific Element tag or
 * default to HTMLElement. Node identifiers which use suffixed HTMLElement tag names
 * will return the referenced HTML Element.
 *
 * @example
 *
 * 'input' // => HTMLInputElement
 * 'label' // => HTMLLabelElement
 * 'href'  // => HTMLAnchorElement
 *
 * // camelCase expression are supported
 *
 * 'fooInput' // => HTMLInputElement
 * 'barLabel' // => HTMLLabelElement
 * 'bazHref'  // => HTMLAnchorElement
 */
type DOMElement<T extends string> = DOMSelect<LastArrayElement<Split<KebabCase<T>, '-'>>>;

/**
 * Interface State
 *
 * Provides custom component state interfaces be provided and matches against types.
 */
type InterfaceState<T extends SPX.Define, U extends SPX.Define> = {
  [K in keyof T['state']]: Match<T['state'][K], U['state'][K]> extends true ? State<T['state']>[K] : T['state'][K]
}

/**
 * Interface DOM
 *
 * Provides custom component DOM Node map interfaces be provided and matches against types.
 */
type InterfaceDOM<T extends SPX.Define['nodes']> = {
  [K in T[number]]?: HTMLElement
}

/**
 * DOM
 *
 * The `this.dom` type reference
 */
export type DOM<T extends readonly string[] = readonly string[]> = (
  /**
   * Element
   *
   * Returns the DOM Element.
   */
  & { readonly [K in T[number] as `${K}Node`]: DOMElement<K> }
  /**
   * Elements
   *
   * Returns an array list elements
   */
  & { readonly [K in T[number] as `${K}Nodes`]: ReadonlyArray<DOMElement<K>> }
  /**
   * Exists
   *
   * Returns a boolean signaling whether or not the element exists in the DOM.
   */
  & { readonly [K in T[number] as `has${Capitalize<K>}`]: boolean; }

)

/**
 * DOM
 *
 * The `this.dom` type reference
 */
export type DOMSugar<T extends readonly string[] = readonly string[]> = (
  /**
   * Element
   *
   * Returns the DOM Element.
   */
 & { readonly [K in T[number] as `${K}`]: DOMElement<K> & Identity<typeof ToNode> }
  /**
   * Exists
   *
   * Returns a boolean signaling whether or not the element exists in the DOM.
   */
 & { readonly [K in T[number] as `has${Capitalize<K>}`]: boolean; }

)

export declare class ClassHooks {

  /**
   * **SPX `connect`**
   *
   * An SPX component lifecycle callback that will be triggered on component register.
   * This event will on fire once for each instance occurance throughout an SPX session.
   *
   * [SPX Documentation](https://spx.js.org/components/hooks/)
   */
  public connect<U extends Page>(page?: U): any;

  /**
   * **SPX `onmount`**
   *
   * SPX lifecycle hook triggered each time the component is present in the DOM.
   *
   * [SPX Documentation](https://spx.js.org/components/hooks/)
   */
  public onmount<U extends Page>(page?: U): any;

  /**
   * **SPX `unmount`**
   *
   * SPX lifecycle hook that executes when a component is removed from the DOM.
   *
   * [SPX Documentation](https://spx.js.org/components/hooks/)
   */
  public unmount<U extends Page>(page?: U): any;

  /**
   * **SPX `onmedia`**
   *
   * SPX lifecycle hook which fire upon media query breakpoint changes.
   *
   * [SPX Documentation](https://spx.js.org/components/hooks/)
   */
  public onmedia(screen: 'xs' | 'sm' | 'md' | 'lg' | 'xl'): any;

}

/**
 * Component Class
 *
 * The base class of a component from which all components will extend.
 */
export declare class Class<T extends HTMLElement = HTMLElement> {

  /**
   * **SPX Ref**
   *
   * The instance UUID reference key. This is non-writable and is used internally.
   */
  public readonly ref: string;

  /**
   * **SPX Scope**
   *
   * Holds scope reference information about the instance (internal usage).
   */
  public readonly scope: Scope;

  /* PUBLIC ------------------------------------- */

  /**
   * **SPX Document Element**
   *
   * Holds a reference to the DOM Document element `<html>` node.
   */
  public readonly root: HTMLElement;

  /**
   * **SPX Document Element**
   *
   * Holds a reference to the DOM Document element `<html>` node.
   */
  public get dom(): T;
  public set dom(dom: T);

}

type ComponentScope<T extends SPX.Define> = {

  new (context: Class): (
    & Class
    & {
      /**
       * ### SPX State
       *
       * Component state references the structure provided on the `spx.Component({ state: {} })` object.
       * Entries will be matched and merged with the DOM state directives provided on component views.
       *
       * [SPX Documentation](https://spx.js.org/components/state/)
       */
      state: State<T>;
    }
    & DOM<T['nodes']>
  )
}

type ComponentSugar<T extends SPX.Define> = {

  new (context: Class): (
    & Class
    & {
      /**
       * ### SPX State
       *
       * Component state references the structure provided on the `spx.Component({ state: {} })` object.
       * Entries will be matched and merged with the DOM state directives provided on component views.
       *
       * [SPX Documentation](https://spx.js.org/components/state/)
       */
      state?: State<T>;
    }
    & DOMSugar<T['nodes']>
  )
}

export interface Component {
  <T extends SPX.Define = SPX.Define> (define?: T & {
    /**
     * ### Component Name
     *
     * Component identifier for DOM association. If left undefined, SPX will use the name
     * provided upon component registration converted to `kebab-case`. Providing a `name`
     * value results in a strict match, meaning it will run precedence over registry names,
     * however aliases will still be respected.
     *
     * [SPX Documentation](https://spx.js.org/components/register/)
     *
     * ```js
     *
     * // Using default, will convert to kebab-case
     * class FooBar extends spx.Component() {}
     *
     * // Using name, will override Example
     * class Example extends spx.Component({ name: 'demo' }) {}
     *
     * // Register Components
     * spx({ component: { FooBar, Example }})
     *
     *
     * ```
     *
     * #### Directive Association:
     *
     * ```html
     *
     * <!-- Example -->
     * <div spx-component="demo"></div>
     *
     * <!-- FooBar -->
     * <div spx-component="foo-bar"></div>
     *
     * ```
     */
    name?: string;
    /**
     * ### Component State
     *
     * Define the component state references to be accessible via the `this.state` object.
     * State directives that are provided via attribute annotation must be declared here and
     * when undefined SPX will throw. This option accepts multiple structures, including
     * Constructor types or `typeof` and `default` object presets.
     *
     * [SPX Documentation](https://spx.js.org/components/register/)
     *
     * ```js
     *
     * class Example extends spx.Component({ state: { animal: 'dog' } }) {
     *
     *  onmount() {
     *    this.state.animal     // string (defaults to 'dog')
     *    this.state.hasAnimal  // boolean
     *  }
     * }
     *
     *
     * ```
     *
     * #### Directive Association:
     *
     * ```html
     *
     * <div
     *   spx-component="example"
     *   spx-example:animal="cat"></div>
     *
     * ```
     */
    state?: T['state'];
   /**
     * ### Component Nodes
     *
     * Define the Node identifier references used to associate elements in the DOM with
     * this component. Component nodes will be matched via `spx-node` directive values.
     *
     * [SPX Documentation](https://spx.js.org/components/nodes/)
     *
     * ```ts
     *
     * class Example extends spx.Component({ nodes: <const>['foo'] }) {
     *
     *  onmount() {
     *    this.fooNode    // HTMLElement
     *    this.fooNodes   // HTMLElement[]
     *    this.hasFoo     // boolean
     *  }
     * }
     *
     *
     * ```
     *
     * #### Directive Association:
     *
     * ```html
     *
     * <div spx-node="example.foo"></div>
     *
     * ```
     */
    nodes?: ReadonlyArray<string>;
    /**
     * ### Node Sugars
     *
     * SPX provides sugar extendabilities for interfacing with associated nodes.
     * When enabled, nodes are accessible using a different structure and expose
     * additional utilities for executing common tasks.
     *
     * The main differences with sugar enabled is node access. You cannot obtain
     * an element/s using `this.nameNode` or `this.nameNodes` but instead access
     * is made using `this.name` and `this.name()`.
     *
     * [SPX Documentation](https://spx.js.org/components/sugar/)
     *
     * ```ts
     *
     * class Example extends spx.Component({ sugar: true, nodes: ['foo'] }) {
     *
     *  onmount() {
     *    this.foo    // Primitive
     *    this.foo()  // HTMLElement[]
     *    this.hasFoo // boolean
     *  }
     * }
     *
     *
     * ```
     *
     * #### Directive Association:
     *
     * ```html
     *
     * <div spx-node="example.foo"></div>
     *
     * ```
     */
    sugar?: boolean;

  }): T['sugar'] extends true ? ComponentSugar<T> : ComponentScope<T>;
}

export interface ComponentEventOptions {
  /**
   * #### Abort Signal
   *
   * The abort controller for removing events - Defined internally
   *
   * > **NOTE**
   * >
   * > This will be exposed to event options.
   */
  signal: AbortSignal;
  /**
   * #### Passive Option
   *
   * Whether or not listener is passive.
   *
   * @example
   * 'spx@click="ref.method { passive, once, capture }"'
   */
  passive?: boolean;
  /**
   * #### Once Option
   *
   * Whether or not listener is once.
   *
   * @example
   * 'spx@click="ref.method { passive, once, capture }"'
   */
  once?: boolean;
  /**
   * #### Capture Option
   *
   * Whether or not listener is capture.
   *
   * @example
   * 'spx@click="ref.method { passive, once, capture }"'
   */
  capture?: boolean;
}

export interface ComponentEvent {
  /**
   * ### dom
   *
   * This is a getter which references the DOM Element that the event listener will be or is
   * attached. The getter is created in the {@link addEvent} function during {@link setInstances}.
   *
   * @example
   *
   * scope.event['e.6x9e7z'].dom // => HTMLElement
   */
  get dom(): HTMLElement;
  /**
   * ### key
   *
   * The UUID reference key identifier. This value is identical to the property key
   * which of the `events` scope model.
   *
   * @example
   * { 'e.6x9e7z': { key: 'e.6x9e7z' } } // Identical to the key property
   */
  key: string;
  /**
   * ### isChild
   *
   * Whether or not the event node is a child of the component view. When `true` the event element is
   * contained within the component element. The value signals on the location of the node within
   * the DOM. When `false` it signals to SPX that this event element exists outside of the component
   * element.
   *
   * > This value will determine from which point the {@link ComponentEvent.dom} getter obtains the
   * > event node element via `querySelector`. When it is `true`, query selection uses the component view
   * > element, whereas `false` will result in query selection using `document.body`.
   */
  isChild: boolean;
  /**
   * #### selector
   *
   * The `querySelector` string used to find the event nodes. The {@link ComponentEvent.dom} getter
   * will rely on this value for query selection.
   *
   * @example
   * 'button[spx@click="component.onClick"]'
   */
  selector: string;
  /**
   * ### attrs
   *
   * An **immutable** object representing defined event parameter states provided on the event nodes.
   * This value will be provided to the component callback methods `event` parameter, accessible via
   * an `attrs` property.
   *
   * > The object values are automatically type converted, in accordance with the dom directives values
   * > provided on the event node element.
   *
   * @default
   * {}
   *
   * @example
   * { num: 200 } // <button spx@click="demo.onClick" spx-demo:str="200">
   */
  attrs: object;
  /**
   * ### isWindow
   *
   * Whether or not the event should be attached to `window` or not. Event directives can signal `globalThis`
   * events by passing a `spx@window:<event>` structure. When this is `true`, the event listener will be
   * attached globally.
   *
   * **Directive Example**
   *
   * ```html
   * <!-- signals to trigger if window is clicked -->
   * <div spx@window:click></div>
   *
   * <!-- signals to trigger if window is scrolled -->
   * <div spx@window:scroll></div>
   * ```
   *
   * @default false
   */
  isWindow: boolean;
  /**
   * ### method
   *
   * The component method name that the event will be attached and the callback will be invoked.
   *
   * @example
   * 'onClick'  // <button spx@click="demo.onClick">
   * 'onScroll' // <div spx@window:scroll="demo.onScroll"> Targeting window
   */
  method: string;
  /**
   * ### attached
   *
   * Whether or not the event listener is attached or not. When `true`, it signals that the event
   * has been established and actions will invoke method callback on the class. A value of `false`
   * signals that the event listener has either been removed or yet setup.
   *
   * @default false
   */
  attached: boolean;
  /**
   * ### eventName
   *
   * The name of the event for which we attach a listener.
   *
   * @example
   * 'click'  // <button spx@click="demo.onClick"> click event
   * 'scroll' // <div spx@window:scroll="demo.onScroll"> scroll event
   */
  eventName: string;
  /**
   * ### listener
   *
   * Despite the name ("listener") this value holds reference to an instance of
   * [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
   * Events use Abort Controller to remove attached listeners and will prevent additional
   * listeners being applied when component is not mounted.
   */
  listener: AbortController
  /**
   * ### options
   *
   * Event Listener options to be attached to the event. Event directive values accept
   * {@link ComponentEventOptions} and if provided, they will be present on here. This
   * will default to using the `signal` from `AbortController` instance of {@link ComponentEvent.listener},
   * and any directive level options passed will merged.
   *
   * **Directive Example**
   *
   * ```html
   * <!-- Existence of "once" will apply a value of true -->
   * <button spx@click="component.method { once }">
   *   Hello World!
   * </button>
   * ```
   *
   * @default
   * { signal: event.listner.signal }
   */
  options: ComponentEventOptions;
}

export interface ComponentBinds {
  /**
   * ### dom
   *
   * This is a getter references the DOM Element/s that state values will be bound.
   *
   * @example
   *
   * scope.bind['b.4u7i2k'].dom // => HTMLElement[]
   */
  readonly dom?: HTMLElement;
  /**
   * #### Key Identifier
   *
   * The UUID reference key identifier. This value is identical to the property key
   * which this model is contained within.
   *
   * @example
   * { 'n.f8i4b2': { key: 'n.f8i4b2' } } // Identical to the key property
   */
  key: string;
  /**
   * ### selector
   *
   * A query selector string which can be used to find matching elements within
   * the snapshot record. This will be the schema attribute reference.
   *
   * @example '[spx-bind="ref.stateKey"]'
   */
  selector: string;
 /**
  * ### stateKey
  *
  * The name of the state property as per the components `define.state` record. This value
  * is used within the DOM directive and maps to a key within state.
  *
  * @example
  * 'name'   // <div spx-bind="component.name"> value is "name"
  * 'age'    // <div spx-bind="component.age"> value is "age"
  */
  stateKey: string;
  /**
   * #### stateAttr
   *
   * The DOM state attribute directive. This value will reflect the schema used to define
   * state on the component element.
   *
   * @example
   * 'spx-demo:name' // { name: String } Reflects the define state
   * 'spx-demo:age'  // { name: Number } Reflects the define state
   */
  stateAttr: string;
  /**
   * ### value
   *
   * The current state value. This will typically reflect the `innerText` of the element
   * and the real-time component state value.
   */
  value: string;
  /**
   * ### live
   *
   * Whether or not the bind node element is present in the current DOM.
   */
  live: boolean;
  /**
   * ### isChild
   *
   * Whether or not the binding node is child of the component template. When `true` the bind/s are
   * contained within the component. The value signals on the location of the element within
   * the DOM. When `false` it signals to SPX that this binded node element exists outside of the component
   * element.
   *
   * > **NOTE**
   * >
   * > Because there can be multiple bindings, this value is used as a determinator.
   */
  isChild: boolean;
}

export interface ComponentNodes {
  /**
   * ### key
   *
   * The UUID reference key identifier. This value is identical to the property key
   * which this model is contained within.
   *
   * @example
   * { 'n.f8i4b2': { key: 'n.f8i4b2' } } // Identical to the key property
   */
  key: LiteralUnion<`n.${string}`, string>;
  /**
   * ### dom
   *
   * Holds getter references to query selected elements in the DOM. This value is
   * created during {@link setInstances} These will be proxied
   * within component classes.
   */
  dom: {
    /**
     * ### Node Element
     *
     * Holds reference to a single DOM Elements marked with the node name identifier.
     * Accessible within class components via `this.dom.<name>` on the `this.dom` object.
     *
     * @example
     *
     * // Assuming the node name is "foo"
     *
     * this.dom.foo // Returns HTMLElement
     * this.dom.foo.childNodes // Returns childNodes of HTMLElement
     */
    get node(): HTMLElement;
    /**
     * ### Node Elements
     *
     * Holds reference to all DOM Elements marked with the node name identifier.
     * Accessible within class components by calling the name identifier as a
     * function (`this.dom.<name>()`) on the `this.dom` object.
     *
     * @example
     *
     * // Assuming the node name is "foo"
     *
     * this.dom.foo() // Returns HTMLElement[]
     */
    get nodes(): HTMLElement[];
  }
  /**
   * ### live
   *
   * The number of node occurences in the document. The value define here will
   * be used to check for the existence of nodes via `this.dom.has<Name>` on the
   * `this.dom` object.
   */
  live: number;
  /**
   * #### selector
   *
   * The `querySelector` string used to find the event nodes. The {@link ComponentNodes.dom} getters
   * will rely on this value for query selection.
   *
   * @example
   * '[spx-node="component.<name>"]'
   */
  selector: string;
  /**
   * ### name
   *
   * The name of the property identifier. This value will be used as the mapping
   * reference identifier within DOM directives.
   *
   * @example
   * 'foo' // <div spx-node="component.foo"> value is "foo"
   * 'bar' // <div spx-node="component.bar"> value is "bar"
   */
  name: string;
  /**
   * ### isChild
   *
   * Whether or not the node is child of the component template. When `true` the node/s are
   * contained within the component. The value signals on the location of the node within
   * the DOM. When `false` it signals to SPX that this node element exists outside of the component
   * element.
   *
   * > **NOTE**
   * >
   * > Because there can be multiple nodes, this value is used as a determinator.
   */
  isChild: boolean;
}

/**
 * Component Register
 *
 * Mimics an expected user defined component which will be used to create instances.
 * The keys of this interface represent `static` attrs of user components.
 */
export interface ComponentRegister extends Class {
  /**
   * Define Reference
   */
  define: Merge<SPX.Define, { name: string }>
}

/**
 * Component Scope (onInit)
 *
 * This interface describes a component in the DOM. SPX builds a model during tree
 * traversal and uses this reference to extend user defined components.
 */
export interface Scope {
  /**
   * #### DOM
   *
   * Holds reference to the component element and accessible via `this.dom` within
   * component classes.
   */
  dom: HTMLElement
  /**
   * ### alias
   *
   * The component alias identifier name. This represents the `id=""` value of a component
   * element. Aliases provide alternate references to be expressed.
   *
   * @default null
   */
  alias: string;
  /**
   * ### instanceOf
   *
   * The component instance name. This value represents the `spx-component=""` value and is
   * used to access components in the {@link ComponentSession Registry}.
   *
   * > The instance name is used to establish instances of a component.
   *
   */
  instanceOf: string;
  /**
   * ### define
   *
   * Immutable copy of the **static** `define` object provided to the Component.
   *
   */
  define: SPX.Define;
  /**
   * ### snapshot
   *
   * DOM string snapshot of the component to be merged.
   *
   * @default null
   */
  snapshot: string;
  /**
   * ### snap
   *
   * The snapshot UUID of the page the component was mounted within
   *
   * @default null
   */
  snap: string;
  /**
   * ### key
   *
   * The component UUID key identifier. This will be annotated to elements in the DOM and
   * is used to match elements to instances. The value is also used as the suffix within
   * reference identifiers.
   *
   * > This value will also be the {@link Class Component} {@link Scopes} Map key identifier.
   *
   * @example 'a1b2c3'
   */
  key: string;
  /**
   * ### ref
   *
   * This is the `key` identifier value prefixed with a `c.` to represent `component`. The
   * identifier is used as the value of `data-spx="*"` attributes.
   *
   * > **NOTE**
   * >
   * > The prefix `c` is used to identify an elements _type_ association.
   *
   * @example 'c.a1b2c3'
   */
  ref: string;
  /**
   * ### inFragment
   *
   * Whether or not the component is contained within page fragments. When this is `false`
   * we will need to update snapshots nodes with ref marks which are not applied due to
   * the partial replacements incurred.
   *
   * @default true
   */
  inFragment: boolean;
  /**
   * ### hooks
   *
   * Holds a reference to method hooks exposed within the component
   */
  hooks: {
    /**
     * Whether or not `connect()` exists
     *
     * @default false
     */
    connect: HookStatus
    /**
     * Whether or not `onmount()` exists
     *
     * @default false
     */
    onmount: HookStatus
    /**
     * Whether or not `unmount()` exists
     *
     * @default false
     */
    unmount: HookStatus
    /**
     * Whether or not `onmedia()` exists
     *
     * @default false
     */
    onmedia: HookStatus
  };
  /**
   * ### status
   *
   * The current mount status of the component. The status of component is determined using the
   * {@link Hooks} `enum` and is controls the connection and disconnection actions to be execute.
   *
   * #### Available
   *
   * There are 5 different mount states a component might exist. The status will be updates during
   * morph or mutation occurences and is referenced when calling component lifecycle hooks.
   *
   * > `1` = `CONNECT`_Component will apply a sequention connect_
   * >
   * > `2` = `MOUNT` _Component will mount on next observer connect call._
   * >
   * > `3` = `MOUNTED` _Component has mounted and hook has been triggered_
   * >
   * > `4` = `UNMOUNT` _Component will unmount on next obserser disconnect call._
   * >
   * > `5` = `UNMOUNTED` _Component has unmounted and is not present in the DOM._
   *
   * @default
   *
   * 5 // UNMOUNTED
   */
  status: Hooks;
  /**
   * ### state
   *
   * The DOM State references, in alignment with the `define.state` static definitions.
   * This value is persisted via Proxy once the component instance is established.
   */
  state: Record<string, string | number | object | any[] | boolean>;
  /**
   * ### binds
   *
   * {@link ComponentBinds Component Bindings} reflect state values of a component. These
   * associated references will update the `innerText` of annotated elements in the DOM with
   * the state value. Binds are handled in real-time, whenever state changes the elements content
   * will reflect. The model is expressed as an object, the properties are node reference identifers
   * prefixed with the letter `b` which infers **Bind** and will be used as the `data-spx="*"` value.
   *
   * > **NOTE**
   * >
   * > The prefix `b` is used to identify the elements _type_ association.
   *
   * @example 'b.w6y71e'
   */
  binds: { [stateKey: string]: Record<string, ComponentBinds> };
  /**
   * ### events
   *
   * {@link ComponentEvent Component Event} listener associated nodes of the component.
   * Events represent different elements that are will be used to trigger methods within
   * components. The model is expressed as an object, the properties are node reference
   * identifers prefixed with the letter `e` which infers **Event** and will be used as
   * the `data-spx="*"` value.
   *
   * > **NOTE**
   * >
   * > The prefix `e` is used to identify the elements _type_ association.
   *
   * @example 'e.r2n0h7'
   */
  events: Record<string, ComponentEvent>;
  /**
   * ### nodes
   *
   * Associated nodes of the component. Nodes represent different elements that are made
   * available within a components `this` context. The model is expressed as an object,
   * the properties are node reference identifers prefixed with the letter `n` which
   * infers **Node** and will be used as the `data-spx="*"` value.
   *
   * > **NOTE**
   * >
   * > The prefix `n` is used to identify the elements _type_ association.
   *
   * @example 'n.f8i4b2'
   */
  nodes: Record<string, ComponentNodes>;
}

export enum ElementType {
  /**
   * Element is a component, annotated with `spx-component=""`
   */
  COMPONENT = 1,
  /**
   * Element is a node, annotated with `spx-node=""`
   */
  NODE = 2,
  /**
   * Element is a binding, annotated with `spx-bind=""`
   */
  BINDING = 3,
  /**
   * Element is an event, annotated with `spx@event=""`
   */
  EVENT = 4
}

/**
 * Component Sessions
 *
 * This interface represents the `$.component` value.
 */
export interface ComponentSession {
  /**
   * ### Register
   *
   * This contains raw class references that will be used to invoke instances.
   * The SPX Component registry is populated within {@link registerComponents}
   * at runtime intialization. The entires of the map are called upon during the
   * {@link setInstances} operations to establish a component instance.
   */
  $registry: Map<string, any>;
  /**
   * ### Instances
   *
   * Initialised component instances. This reference will hold all components
   * instances which have been established throughout the SPX session. We use this
   * store in subsequent actions (i.e, returning to page where a component was mounted).
   *
   * > Instances will **persist** and their lifespan is infinite during an SPX Session.
   * > Existing instances can be purged using `spx.disconnect()` or `spx.reset()` methods,
   * > but cannot be killed or destroyed in isolation.
   */
  $instances: Map<string, Class>;
  /**
   * ### Reference
   *
   * Holds a `key > value` mapping reference of UUIDs and uses a Proxy to return a Component
   * instance. This is used during morph observation to obtain instances on a per associated
   * element basis.
   *
   * > The `data-spx` value (`ref`) records will be the **key** entries that allow
   * > the {@link ComponentSession} to be acquired.
   */
  $reference: ProxyHandler<Record<string, Class>>;
  /**
   * ### Mounted
   *
   * A (`Set`) containing Component UUID **ref** identifier instances which are
   * currently mounted and live on the current page. The entries will _typically_ change
   * between navigations (depending on fragment morphs) and will always accurately reflect
   * which mounted component instances.
   */
  $mounted: Set<string>;
}
