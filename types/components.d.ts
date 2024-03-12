/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import type { Class, LiteralUnion, Merge } from 'type-fest';
import type { Page } from './page';

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

type TypeOf<T extends TypeConstructors> = (
  T extends BooleanConstructor ? boolean :
  T extends StringConstructor ? string :
  T extends NumberConstructor ? number :
  T extends ArrayConstructor ? T :
  T extends ObjectConstructor ? { [key: string]: unknown } : never
)

type TypeState<T extends TypeConstructors> = {
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
};

type TypeEvent<E, T, A> = Merge<E, {
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

type Attrs = { [key: string]: unknown; }

/**
 * **SPX Component Utilities**
 *
 * Small collection of TypeScript utilities for dealing with SPX
 * components.
 */
export namespace SPX {

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
  export type InputEvent<A = Attrs, E = HTMLElement> = TypeEvent<DOMEvents['InputEvent'], E, A>;
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
   * <button
   *  type="button"
   *  spx@click="component.method">
   *  Click
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
   * **SPX State Interface**
   *
   * Type represents the static `connect.state` structure of type contstructors
   */
  export type Types = {
   [key: string]:
   | TypeConstructors
   | TypeOf<BooleanConstructor>
   | TypeOf<StringConstructor>
   | TypeOf<NumberConstructor>
   | TypeOf<ArrayConstructor>
   | TypeOf<ObjectConstructor>
  }

  /**
   * **SPX Component State**
   *
   * Helper utility for automatically assigning `this.state` to components.
   *
   * ```ts
   * import spx, { SPX } from 'spx';
   *
   * class Example extends spx.Component {
   *
   *    public state: SPX.State<typeof Example.connect>;
   *
   *    static connect = {}
   *
   * }
   * ```
   */
  export type State<T extends Connect> = Merge<{
    [K in keyof T['state']]?:
     T['state'][K] extends BooleanConstructor ? boolean :
     T['state'][K] extends StringConstructor ? ReturnType<T['state'][K]> :
     T['state'][K] extends ArrayConstructor ? ReturnType<T['state'][K]> :
     T['state'][K] extends NumberConstructor ? number :
     T['state'][K] extends ObjectConstructor ? ReturnType<T['state'][K]> :
     T['state'][K] extends TypeState<BooleanConstructor> ? boolean :
     T['state'][K] extends TypeState<StringConstructor> ? ReturnType<T['state'][K]['typeof']> :
     T['state'][K] extends TypeState<NumberConstructor> ? number :
     T['state'][K] extends TypeState<ArrayConstructor> ? ReturnType<T['state'][K]['typeof']> :
     T['state'][K] extends TypeState<ObjectConstructor> ? ReturnType<T['state'][K]['typeof']> : never
  }, {
    /**
     * **Has Reference**
     *
     * Whether or not the state reference exists on the component template.
     */
    [K in keyof T['state'] as K extends string ? `has${Capitalize<K>}` : never]: boolean;
  }>

  type Selector<T extends Connect> = { [K in T['nodes'][number]]: HTMLElement }

  export interface Connect {
    /**
     * Identifier
     */
    id?: string;
    /**
     * **State Interface**
     *
     * Attribute state references used to connect DOM states with component `this.state`.
     * Accepts Constructor types or `typeof` and `default` object presets.
     */
    state?: {
      [key: `${Lowercase<string>}${string}`]: (
        | TypeConstructors
        | TypeOf<BooleanConstructor>
        | TypeOf<StringConstructor>
        | TypeOf<NumberConstructor>
        | TypeOf<ArrayConstructor>
        | TypeOf<ObjectConstructor>
      )
    };
    /**
     * **Nodes Reference**
     *
     * DOM Node identifier references used to connect elements in the DOM with component
     * `this.<name>Node` values.
     */
    nodes?: readonly string[];
  }

  export type HasNode<E extends Connect> = { [K in E['nodes'][number] as K extends string ? K : never]?: boolean; }
  export type GetNode<T extends Connect> = T['nodes'][number] extends string ? T['nodes'][number] : string;

  export abstract class Class<T = Connect> {

    /**
     * **Node Exists**
     *
     * Whether or not a node exists in the DOM
     */
    readonly [hasNode: `has${Capitalize<string>}Node`]: boolean;
    [node: `${Lowercase<string>}Node`]: HTMLElement;
    [nodes: `${Lowercase<string>}Nodes`]: HTMLElement[];

    /**
     * **SPX Scope**
     *
     * Holds scope reference information about the instance, elements which pertain to the instance
     * and event reference handling.
     */
    public readonly scope?: Scope;

    /**
     * **SPX Component Connection**
     *
     * Define the component presets
     */
    static readonly connect?: Connect;

    /**
     * **SPX State**
     *
     * An auto-generated workable object of `connect.state` and component attribute state references.
     */
    public readonly state?: State<T>;

    /**
     * **SPX Dom**
     *
     * Holds a reference to the SPX Element annotated with `spx-component`.
     */
    public dom: HTMLElement;

    /**
     * **SPX Document Element**
     *
     * Holds a reference to the DOM Document element `<html>` node.
     */
    public readonly html: HTMLElement;

    /**
     * **SPX `oninit`**
     *
     * An SPX component lifecycle callback that will be triggered on component register.
     * This event will on fire once for each instance occurance throughout an SPX session.
     */
    oninit(page?: Page): any;
    /**
     * **SPX `onload`**
     *
     * An SPX component lifecycle triggered for every navigation. This is the equivalent of
     * of using the SPX event emitters, e.g:
     *
     * ```js
     * spx.on('load', function() {})
     * ```
     */
    onload(page?: Page): any;
    /**
     * **SPX `onexit`**
     *
     * An SPX component lifecycle trigger that executes before a page replacement occurs. Use this
     * to teardown any listeners.
     *
     */
    onexit(page?: Page): any;
    /**
     * **SPX `onvisit`**
     *
     * An SPX component lifecycle trigger that executes right before a visit concludes and a page
     * replacement. This is the equivalent of using the SPX event emitters, e.g:
     *
     * ```js
     * spx.on('load', function() {})
     * ```
     */
    onvisit(page?: Page): any;
    /**
     * **SPX `onfetch`**
     *
     * An SPX component lifecycle trigger that executes when new record and snapshot is applied to cache
     *
     * ```js
     * spx.on('cache', function() {})
     * ```
     */
    oncache(page?: Page): any;
    /**
     * **SPX `onstate`**
     *
     * An SPX component trigger that hooks into the state Proxy. Invokes when component attrs are
     * changed via the DOM.
     */
    onstate(key?: string, value?: any): any | boolean;

  }

}

export interface ComponentEventOptions {
  /**
   * The abort controller for removing events - Defined internally
   */
  signal: AbortSignal;
  /**
   * Whether or not listener is passive.
   *
   * @example 'spx@click="ref.method { passive, once }"'
   */
  passive?: boolean;
  /**
   * Whether or not listener is once.
   *
   * @example 'spx@click="ref.method { passive, once }"'
   */
  once?: boolean;
}

export interface ComponentEvent {
  /**
   * The event attribute name which is also the key property
   *
   * ```js
   * {
   *  events: {
   *    af1lr4: {
   *      key: 'af1lr4',
   *      // etc etc
   *    }
   *  }
   * }
   * ```
   */
  key: string;
  /**
   * The element reference key/s
   */
  dom: string
  /**
   * Event `attrs` annotated on event elements which will be passed
   * in the eventthe callback method parameters.
   */
  params: object;
  /**
   * Whether or not the event target is `window`
   */
  isWindow: boolean;
  /**
   * The class method name that the event will be attached
   */
  method: string;
  /**
   * Whether or not the event has been attached and is listening
   */
  attached: boolean;
  /**
   * The event name
   */
  eventName: string;
  /**
   * Abort Controller Instance
   */
  listener: AbortController
  /**
   * Event Listener options to be attached to the event.
   *
   * @default { signal: event.listner.signal }
   */
  options: ComponentEventOptions;
}

interface ComponentBinds {
  /**
   * The reference UUID mapping
   */
  key: string;
  /**
   * The element reference key/s
   */
  dom: string
 /**
  * The selector reference
  */
  selector: string;
 /**
  * The state key reference binding will be bound
  */
  stateKey: string;
  /**
   * The node attribute key
   */
  stateAttr: string;
  /**
   * The current value
   */
  value: string;
 /**
  * Whether or not the node is child of the component template.
  * When `true` the node/s are contained within the dom element.
  * The value signals on whether we use the `this.dom` element as
  * node selector or `document.body` in the getters.
  *
  * When `false` it signals to SPX that it should use `document.body`
  * to query select elements. Because there can be multiple nodes,
  * this value is used as a determinator.
  */
  isChild: boolean;
}

interface ComponentNodes {
  /**
   * The reference key UUID
   */
  key: string;
  /**
   * The element reference key/s
   */
  dom: string
 /**
  * The state key reference binding will be bound
  */
  keyProp: string;
  /**
   * The instance getter property name which returns the query selected elements.
   *
   * @example 'nameNode'
   */
  schema: LiteralUnion<`${string}Node`, string>;
  /**
  * Whether or not the node is child of the component template.
  * When `true` the node/s are contained within the dom element.
  * The value signals on whether we use the `this.dom` element as
  * node selector or `document.body` in the getters.
  *
  * When `false` it signals to SPX that it should use `document.body`
  * to query select elements. Because there can be multiple nodes,
  * this value is used as a determinator.
  */
  isChild: boolean;
}

/**
 * Component Register
 *
 * Mimics an expected user defined component which will be used to create instances.
 * The keys of this interface represent `static` attrs of user components.
 */
export interface ComponentRegister extends SPX.Class {
  connect: Merge<SPX.Connect, {
    id: string
  }>
}

/**
 * Component Scope (onInit)
 *
 * This interface describes a component in the DOM. SPX builds a model during tree
 * traversal and uses this reference to extend user defined components.
 */
export interface Scope {
  /**
   * The component alias name, represents the `id=""` value of a component
   */
  alias: string;
  /**
   * The component instance name, represents the `spx-component=""` value of a component
   */
  instanceOf: string;
  /**
   * The component instance name, represents the `spx-component=""` value of a component
   */
  static: SPX.Connect;
  /**
   * The element reference key/s
   */
  dom: string
  /**
   * Scope Key
   *
   * The component UUID key identifier. This **MUST** be unique. This will be annotated
   * to connected elements in the DOM, which augments snapshot records.
   *
   * This value will also be the `Component.scopes` Map key identifier.
   */
  key: string;
  /**
   * Mark Reference
   *
   * This is the `key` value prefixed with a `c.` to represent `component`
   */
  ref: string;
  /**
   * Whether or not the component is contained within page fragments. When this is `false`
   * we will need to update snapshots nodes with ref marks which are not applied due to
   * the partial replacements incurred.
   */
  inFragment: boolean;
  /**
   * Whether or not this component is mounted in the DOM. When `true` component element
   * exists, when false it does not.
   */
  mounted: boolean;
  /**
   * Component State
   *
   * The DOM State references, in alignment with the `connect.state` static definitions.
   * This value is persisted via Proxy once the component instance is established.
   */
  state: any;
  /**
   * Component Events
   *
   * Event Listeners applied in this component instance based on the event nodes.
   * The UUID key matches elements `data-spx` value and the value is an array list
   * of component event models.
   */
  events: { [key: string]: ComponentEvent; };
  /**
   * Component Binds
   *
   * Node elements bound by state.
   */
  binds:{ [stateKey: string]: { [key: string]: ComponentBinds; } };
  /**
   * Component Binds
   *
   * Node elements reference
   */
  nodes: { [key: string]: ComponentNodes; };
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
 * Component Class
 *
 * The raw component as a class type.
 */
export type ComponentClass = Class<SPX.Class>

/**
 * Component Sessions
 *
 * This interface represents the `$.component` value.
 */
export interface ComponentSession {
  /**
   * Components register
   *
   * This contains raw class references that will be used to invoke instances.
   */
  $registry: Map<string, any>;
  /**
   * Connected Instances
   *
   * Initialised component instances
   */
  $instances: Map<string, SPX.Class>;
  /**
   * Connected Elements
   *
   * Elements on interest in the DOM. Component DOM, Nodes and Event elements exists
   * in this map and will update for each page visit incurred.
   */
  $elements: Map<string, HTMLElement>;
  /**
   * Connected Elements
   *
   * A Set data store which maintain a reference of elements that have been walked.
   * References represent the DOM `data-spx=""` UUIDs. This is Proxy which returns
   * component instance.
   */
  $reference: ProxyHandler<{ [key: string]: SPX.Class }>;
  /**
   * SPX Component instance UUID's existing on the page. Each entry
   * points to an instance scope on {@link ComponentSession}.
   */
  $connected: Set<string>;
}
