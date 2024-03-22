/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import type { LiteralUnion, Merge } from 'type-fest';
import type { Page } from './page';
import type { SPX, TypeState } from './namespace';
import { Hooks } from 'src/shared/enums';

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
export type State<T extends SPX.Define> = Merge<{
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

export abstract class Class<T = SPX.Define> {

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
  static readonly define?: SPX.Define;

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
   * **SPX `connect`**
   *
   * An SPX component lifecycle callback that will be triggered on component register.
   * This event will on fire once for each instance occurance throughout an SPX session.
   */
  connect(session?: { page?: Page }): any;
  /**
   * **SPX `onmount`**
   *
   * SPX lifecycle hook triggered each time the component is present in the DOM.
   */
  onmount(session?: { page?: Page }): any;
  /**
   * **SPX `unmount`**
   *
   * SPX lifecycle hook that executes when a component is removed from the DOM.
   *
   */
  unmount(session?: { page?: Page }): any;

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
export interface ComponentRegister extends Class {
  define: Merge<SPX.Define, {
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
  static: SPX.Define;
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
   * Whether or not this component has been connected. When `true` the `connect` hook methods
   * has been triggered, whereas a value of `false` indicates that `connect()` has yet to be
   * called.
   */
  connect: boolean;
  /**
   * The current mount status of the component. This is an `enum` value which will signal
   * how observer connection and disconnection actions will proceed.
   *
   * - `1 = CONNECT`_Component will apply a sequention connect_
   * - `2 = MOUNT` _Component will mount on next obserser connect call._
   * - `3 = MOUNTED` _Component has mounted and hook has been triggered_
   * - `4 = UNMOUNT` _Component will unmount on next obserser disconnect call._
   * - `5 = UNMOUNTED` _Component has unmounted and is not present in the DOM._
   */
  mounted: Hooks;
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
export type ComponentClass = Class<Class>

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
  $instances: Map<string, Class>;
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
  $reference: ProxyHandler<{ [key: string]: Class }>;
  /**
   * SPX Component instance UUID's existing on the page. Each entry
   * points to an instance scope on {@link ComponentSession}.
   */
  $connected: Set<string>;
}
