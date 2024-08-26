/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import type { CamelCase, Except, LiteralUnion, Merge, StringSlice, KebabCase, Split, Constructor } from 'type-fest';
import type { Page } from './page';
import { SPX } from './global';
import { Identity } from 'types';

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
  T extends ObjectConstructor ? { [key: string]: unknown } : never
)

/**
 * **SPX State Interface**
 *
 * Type represents the static `connect.define` structure of type contstructors
 */
export type Types = {
  [key: string]:
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
}

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

type Attrs = { [key: string]: unknown; }
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
 * class Example extends spx.Component {
 *
 *    public state: SPX.State<typeof Example.define>;
 *
 *    static define = {}
 *
 * }
 * ```
 */
export type State<T extends SPX.Define> = Merge<{
  [K in keyof T['state']]?:
  T['state'][K] extends BooleanConstructor ? boolean :
  T['state'][K] extends NumberConstructor ? number :
  T['state'][K] extends StringConstructor ? ReturnType<T['state'][K]> :
  T['state'][K] extends ArrayConstructor ? ReturnType<T['state'][K]> :
  T['state'][K] extends ObjectConstructor ? ReturnType<T['state'][K]> :
  T['state'][K] extends TypeState<BooleanConstructor> ? boolean :
  T['state'][K] extends TypeState<NumberConstructor> ? number :
  T['state'][K] extends TypeState<StringConstructor> ? ReturnType<T['state'][K]['typeof']> :
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

/**
 * DOM Element
 *
 * Returns the HTMLElement tag based on the nodes[] name entry.
 */
type DOMElement<T extends string> = T extends SPX.TagNames ? SPX.TagNodes[T] : HTMLElement

/**
 * First Array Item
 *
 * Extracts the first item in an array list.
 */
type First<T extends readonly [...unknown[]]> = T extends readonly [infer H, ...unknown[] ] ? H : never;

/**
 * DOM Node
 *
 * Determines whether or not the node identifier should return a specific Element tag or
 * default to HTMLElement. Node identifiers which use prefixed HTMLElement tag names
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
 * 'inputFoo' // => HTMLInputElement
 * 'labelBar' // => HTMLLabelElement
 * 'hrefBaz'  // => HTMLAnchorElement
 */
type DOMNode<T extends string> = DOMElement<First<Split<KebabCase<T>, '-'>>>;

export type DOM<T extends readonly string[] = readonly string[]> = {
 /**
   * Dom Element/s
   *
   * As per the static **define** `nodes` method.
   */
  [K in T[number] as `${K}Node` ]: DOMNode<K>;
} & {
  /**
   * Returns an array list of DOM Elements marked with `spx-dom=""`
   */
  [K in T[number] as `${K}Nodes` ]: DOMNode<K>[];
} & {
  /**
   * Returns a boolean signaling whether or not DOM has been defined
   */
  [K in T[number] as `has${Capitalize<K>}Node` ]: boolean;
}

export declare class Class<T extends SPX.Define = SPX.Define> {

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
   * **SPX Document Element**
   *
   * Holds a reference to the DOM Document element `<html>` node.
   */
  public readonly html: HTMLElement;

  /**
   * **SPX Component Element**
   *
   * Holds a reference to the SPX Element annotated with `spx-component`.
   */
  public root: HTMLElement;

  /**
   * **SPX Dom**
   *
   * Holds a reference to the SPX Element annotated with `spx-component`.
   */
  public readonly dom: DOM<T['nodes']>;

  /**
   * **SPX `connect`**
   *
   * An SPX component lifecycle callback that will be triggered on component register.
   * This event will on fire once for each instance occurance throughout an SPX session.
   */
  connect(session?: { page: Page }): any;
  /**
   * **SPX `onmount`**
   *
   * SPX lifecycle hook triggered each time the component is present in the DOM.
   */
  onmount(session?: { page: Page }): any;
  /**
   * **SPX `unmount`**
   *
   * SPX lifecycle hook that executes when a component is removed from the DOM.
   *
   */
  unmount(session?: { page: Page }): any;

  /**
   * **SPX `onmedia`**
   *
   * SPX lifecycle hook which fire upon media query breakpoint changes.
   *
   */
  onmedia(screen: 'xs' | 'sm' | 'md' | 'lg' | 'xl'): any;

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
   * #### Key Identifier
   *
   * The UUID reference key identifier. This value is identical to the property key
   * which this model is contained within.
   *
   * @example
   * { 'e.6x9e7z': { key: 'e.6x9e7z' } } // Identical to the key property
   */
  key: string;
  /**
   * #### Element Key
   *
   * The key identifier reference which points to the DOM element of the Component Session
   * {@link ComponentSession $elements} Map cache. The value will point to the element we
   * retrive from the cache using this identifier.
   *
   * @example 'e3q4w1'
   */
  get dom(): HTMLElement;
  /**
   * #### Within Component
   *
   * Whether or not the event node is child of the component template. When `true` the event element is
   * contained within the component. The value signals on the location of the element within
   * the DOM. When `false` it signals to SPX that this event element exists outside of the component
   * element.
   *
   * > **NOTE**
   * >
   * > The `dom` getter will query from component root level if this is true, otherwise from body.
   */
  isChild: boolean;
  /**
   * #### DOM Selector
   *
   * A query selector string which can be used to find matching elements within
   * the snapshot record. This will be the schema attribute reference.
   *
   * @example
   * 'button[spx@click="component.onClick"]'
   */
  selector: string;
  /**
   * #### Event Parameters
   *
   * DOM defined state provided via the event argument. This value isaccessible using the
   * `attrs` property of event parameter within component methods.
   *
   * > **NOTE**
   * >
   * > The value is automatically type converted accordion to attribute entries.
   *
   * @default
   * {}
   *
   * @example
   * { num: 200 } // <button spx@click="demo.onClick" spx-demo:str="200">
   */
  params: object;
  /**
   * #### Window Reference
   *
   * Whether or not the event target is targeting `globalThis` having passed `window`. When
   * `true`, the event will be handled in accordance.
   *
   * > **NOTE**
   * >
   * > Targeting `window` will adhere to colon prefix on the attribute, for example:
   * >
   * > - `spx@window:click` _signals to trigger if window is clicked_
   * > - `spx@window:scroll` _signals to trigger if window is scrolled_
   *
   * @default false
   */
  isWindow: boolean;
  /**
   * #### Component Method
   *
   * The class method name that the event will be attached and a callback will be invoked.
   * This value will be assigned on the DOM level.
   *
   * @example
   * 'onClick'  // <button spx@click="demo.onClick">
   * 'onScroll' // <div spx@window:scroll="demo.onScroll"> Targeting window
   */
  method: string;
  /**
   * #### Attachment Status
   *
   * Whether or not the event has been attached and is listening. When `true`, the event
   * has been established, when `false` the event is not enabled.
   */
  attached: boolean;
  /**
   * #### Event Name
   *
   * The event name to start listening for. This will be obtained via the directive name
   * and will be used to attach the listener.
   *
   * @example
   * 'click'  // <button spx@click="demo.onClick"> click event
   * 'scroll' // <div spx@window:scroll="demo.onScroll"> scroll event
   */
  eventName: string;
  /**
   * #### Abort Controller
   *
   * The Abort Controller Instance. This will be used when disconnecting to remove the attached
   * event and to prevent any listeners being applied outside of mounted status.
   */
  listener: AbortController
  /**
   * #### Event Options
   *
   * Event Listener options to be attached to the event. This is will default to using the `signal`
   * from `AbortController`, however if an event directive value contains {@link ComponentEventOptions}
   * those entries will also be present here.
   *
   * @default
   * { signal: event.listner.signal }
   *
   * @example
   * 'spx@click="demo.onClick { once }"' // { once: true }
   */
  options: ComponentEventOptions;
}

interface ComponentBinds {
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
   * #### Element Key
   *
   * The key identifier reference which points to the DOM element of the Component Session
   * {@link ComponentSession $elements} Map cache. The value will point to element we
   * retrive from the cache using this identifier.
   *
   * @example 'x4t9c9'
   */
  dom: string
  /**
   * #### Live Node
   *
   * Whether or not the bind node element is present in the current DOM.
   */
  live: boolean;
  /**
   * #### DOM Selector
   *
   * A query selector string which can be used to find matching elements within
   * the snapshot record. This will be the schema attribute reference.
   *
   * @example 'div[spx-bind="ref.stateKey"]'
   */
  selector: string;
 /**
  * #### State Key
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
   * #### State Attribute
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
   * #### State Value
   *
   * The current state value. This will typically reflect the `innerText` of the element
   * and the real-time component state value.
   */
  value: string;
  /**
   * #### Within Component
   *
   * Whether or not the binding node is child of the component template. When `true` the bind/s are
   * contained within the component. The value signals on the location of the element within
   * the DOM. When `false` it signals to SPX that this binded node element exists outside of the component
   * element.
   *
   * > **NOTE**
   * >
   * > Because there can be multiple bindins, this value is used as a determinator.
   */
  isChild: boolean;
}

interface ComponentNodes {
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
   * #### Element Key
   *
   * The key identifier reference which points to the DOM element of the Component Session
   * {@link ComponentSession $elements} Map cache. The `schema` value will point to element we
   * retrive from the cache using this identifier.
   *
   * @example 'e3u5c7'
   */
  dom: string;
  /**
   * #### Live Node
   *
   * Whether or not the node is present in the current DOM.
   */
  live: boolean;
  /**
   * #### DOM Selector
   *
   * A query selector string which can be used to find matching elements within
   * the snapshot record. This will be the schema attribute reference.
   *
   * @example 'div[spx-node="ref.identifier"]'
   */
  selector: string;
  /**
   * #### Property Key
   *
   * The name of the property identifier. This value will be used as the mapping
   * reference identifier within DOM directives.
   *
   * @example
   * 'foo' // <div spx-node="component.foo"> value is "foo"
   * 'bar' // <div spx-node="component.bar"> value is "bar"
   */
  keyProp: string;
  /**
   * #### Property Name
   *
   * The components instance getter property name. This value is the accessor made
   * available within component `this` context. The property name is suffixed with
   * `Node` and references an element within the Component {@link Session} Map.
   *
   * @example
   * this.fooNode // <div spx-node="component.foo">
   * this.barNode // <div spx-node="component.bar">
   */
  schema: LiteralUnion<`${string}Node`, string>;
  /**
   * #### Within Component
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
   * #### Alias Identifier
   *
   * The component alias identifier name. This represents the `id=""` value of a component
   * element. Aliases provide alternate references to be expressed.
   *
   * @default null
   */
  alias: string;
  /**
   * #### Instance Name
   *
   * The component instance name. This value represents the `spx-component=""` value and is
   * used to access components in the {@link ComponentSession Registry}.
   *
   * > The instance name is used to establish instances of a component.
   *
   */
  instanceOf: string;
  /**
   * #### Component Definition
   *
   * Immutable copy of the **static** `define` object provided to the Component.
   *
   */
  define: SPX.Define;
  /**
   * DOM string snapshot of the component to be merged.
   *
   * @default null
   */
  snapshot: string;
  /**
   * The snapshot UUID of the page the component was mounted within
   *
   * @default null
   */
  snap: string;
  /**
   * #### Element Key
   *
   * The key identifier reference which points to the DOM element of the Component Session
   * {@link $elements} Map cache. All active component elements are accessible from this store.
   *
   */
  root: HTMLElement
  /**
   * #### Instance Key
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
   * #### Reference Key
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
   * #### Within Fragment
   *
   * Whether or not the component is contained within page fragments. When this is `false`
   * we will need to update snapshots nodes with ref marks which are not applied due to
   * the partial replacements incurred.
   *
   * @default true
   */
  inFragment: boolean;
  /**
   * #### Component Hooks
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
   * #### Mount Status
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
   * #### Component State
   *
   * The DOM State references, in alignment with the `define.state` static definitions.
   * This value is persisted via Proxy once the component instance is established.
   */
  state: any;
  /**
   * #### Component Binds
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
  binds: { [stateKey: string]: { [key: string]: ComponentBinds; } };
  /**
   * #### Component Events
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
  events: { [key: string]: ComponentEvent; };
  /**
   * #### Component Nodes
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
   * #### Components register
   *
   * This contains raw class references that will be used to invoke instances.
   */
  $registry: Map<string, any>;
  /**
   * #### Connected Instances
   *
   * Initialised component instances. This reference will hold all components
   * that have connected throughout the SPX session. We use this store to in
   * subsequent actions (i.e, returning to page where a component was mounted).
   */
  $instances: Map<string, Class>;
  /**
   * #### Instance References
   *
   * SPX Component instance UUID's existing on the page. Each entry points to an
   * instance scope on {@link ComponentSession}.
   */
  $reference: ProxyHandler<{ [key: string]: Class }>;
  /**
   * #### Connected Elements
   *
   * A Set data store which maintains a reference of elements that have been walked.
   * References represent the DOM `data-spx=""` UUIDs. This is Proxy which returns
   * component instances as per `$instances` store.
   */
  $mounted: Set<string>;
}
