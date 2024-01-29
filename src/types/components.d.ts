/* eslint-disable no-use-before-define */
import { Class, Merge } from 'type-fest';
import { IPage } from './page';

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

/**
 * **SPX Component Utilities**
 *
 * Small collection of TypeScript utilities for dealing with SPX
 * components.
 */
export namespace SPX {

  /**
   * **SPX State Interface**
   *
   * Type represents the static `connect.state` structure of type contstructors
   */
  export type Types = {
   [key: string]:
   | TypeConstructors
   | { typeof: BooleanConstructor; default: boolean; }
   | { typeof: StringConstructor; default: string; }
   | { typeof: NumberConstructor; default: number; }
   | { typeof: ArrayConstructor; default: any[]; }
   | { typeof: ObjectConstructor; default: { [key: string]: any }; }
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
     T['state'][K] extends StringConstructor ? string :
     T['state'][K] extends ArrayConstructor ? any[] :
     T['state'][K] extends NumberConstructor ? number :
     T['state'][K] extends ObjectConstructor ? { [key: string]: any } :
     T['state'][K] extends { typeof: BooleanConstructor; default: boolean; } ? boolean :
     T['state'][K] extends { typeof: StringConstructor; default: string; } ? string :
     T['state'][K] extends { typeof: NumberConstructor; default: number; } ? number :
     T['state'][K] extends { typeof: ArrayConstructor; default: any[]; } ? any[] :
     T['state'][K] extends { typeof: ObjectConstructor; default: { [key: string]: any }; } ?
     T['state'][K]['default'] : never
  }, {
    /**
     * **Has Reference**
     *
     * Whether or not the state reference exists on the component template.
     */
    [K in keyof T['state'] as K extends string ? `has${Capitalize<K>}` : never]: boolean;
  }>

  export interface Connect {
    /**
     * **State Interface**
     *
     * Attribute state references used to connect DOM states with component `this.state`.
     * Accepts Constructor types or `typeof` and `default` object presets.
     */
    state?: {
      [key: `${Lowercase<string>}${string}`]: (
        | TypeConstructors
        | {
            typeof: BooleanConstructor;
            default?: boolean;
            persist?: boolean;
          }
        | {
            typeof: StringConstructor;
            default?: string;
            persist?: boolean;
          }
        | {
            typeof: NumberConstructor;
            default?: number;
            persist?: boolean;
          }
        | {
            typeof: ArrayConstructor;
            default?: any[];
            persist?: boolean;
          }
        | {
            typeof: ObjectConstructor;
            default?: { [key: string]: any };
            persist?: boolean;
          }
      )
    };
    /**
     * **Nodes Reference**
     *
     * DOM Node identifier references used to connect elements in the DOM with component
     * `this.<name>Node` values.
     */
    nodes?: string[]
  }

  export abstract class Class<T = typeof Class.connect> {

    [node: `${typeof Class.connect.nodes[number]}Node`]: HTMLElement;
    [nodes: `${typeof Class.connect.nodes[number]}Nodes`]: HTMLElement[];
    [eventNode: `${typeof Class.connect.nodes[number]}EventNode`]: HTMLElement;
    [eventNodes: `${typeof Class.connect.nodes[number]}EventNodes`]: HTMLElement[];
    [stateNode: `${typeof Class.connect.nodes[number]}StateNode`]: HTMLElement;
    [stateNodes: `${typeof Class.connect.nodes[number]}StateNodes`]: HTMLElement[];

    /**
     * **SPX Component Connection**
     *
     * Define the component presets
     */
    static connect?: Connect;

    /**
     * **SPX Document Element**
     *
     * Holds a reference to the DOM Document element `<html>` node.
     */
    readonly html?: HTMLElement;
    /**
     * **SPX Dom**
     *
     * Holds a reference to the SPX Element annotated with `spx-component`.
     */
    dom?: HTMLElement;
    /**
     * **SPX State**
     *
     * An auto-generated workable object of `connect.state` and component attribute state references.
     */
    state?: State<T>;
    /**
     * **SPX `onInit`**
     *
     * An SPX component lifecycle callback that will be triggered on component register.
     */
    onInit?(page?: IPage): void;
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
    onLoad?(page?: IPage): void;
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
    onVisit?(page?: IPage): void;
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
    /**
     * **SPX `onState`**
     *
     * An SPX component trigger that hooks into the state Proxy. Invokes when component attrs are
     * changed via the DOM.
     */
    onState?(key?: string, value?: any): boolean;

  }

}

/**
 * Component Events
 *
 * Event listeners applied in the component instance.
 */
export interface IComponentEvent {
  /**
   * The event name
   */
  eventName: string;
  /**
   * The nodes index position within the scopes `elements[]` array
   */
  index: number;
  /**
   * The nodes index position within the scopes `elements[]` array
   */
  element: string;
  /**
   * The class name property
   *
   * @example 'methodEventNodes'
   */
  schema: `${string}EventNodes`;
  /**
   * The class method name that the event will be attached
   */
  method: string;
  /**
   * Addition event `detail` data attrs annotated on event and binded
   * to the callback method.
   */
  params: any;
  /**
   * Whether or not the event has been attached and is listening
   */
  attached: boolean;
  /**
   * Whether or not the event target is `window`
   */
  isWindow: boolean;
}

/**
 * Component Nodes
 *
 * Nodes associated with the component
 */
export interface IComponentNodes {
  /**
   * The node name reference
   *
   *  @example 'refNodes'
   */
  schema: string;
  /**
   * The nodes index position within the scopes `elements[]` array
   */
  element: string;
    /**
   * The nodes index position within the scopes `elements[]` array
   */
  index: number;
}

export interface IComponentBinds {
  /**
   * The node name reference
   *
   *  @example 'keyStateNodes'
   */
  schema: string;
  /**
   * The state key name binding
   */
  stateKey: string;
  /**
   * Whether or not to persist element between visits
   */
  persist: boolean;
  /**
   * The nodes index position within the scopes `elements[]` array
   */
  element: string;
  /**
   * The nodes index position within the scopes `elements[]` array
   */
  index: number;
}

/**
 * Component Extends
 *
 * The `spx.Component` binding for class components. {@link IScope} will be binded
 * to the instance from which components extend. This interface represents the `this`
 * context of `spx.Component` that user components will inherit.
 */
export interface IComponentExtends {

  /**
   * An conditional return value which signal whether or not
   * the `HTMLElement` node exists, i.e: if it was been defined.
   */
  [name: `has${Capitalize<string>}Node`]: boolean;
  /**
   * Returns a component instance
   */
  component<T extends IComponentExtends>(id: string): T;
  /**
   * The `documentElement` reference, i.e: `<html>`
   */
  readonly html?: HTMLElement;
  /**
   * The Component element where `spx-component=""` was applied.
   */
  dom?: HTMLElement;
  /**
   * State references
   *
   * Combines the static `attrs` entries and also exposes conditional `has` prefixed checks.
   */
  state?: ProxyHandler<{
    /**
     * Whether or not this state reference exists
     */
    readonly [key: `has${Capitalize<string>}`]: boolean;

    [key: string]: any;
  }>
}

/**
 * Component Register
 *
 * Mimics an expected user defined component which will be used to create instances.
 * The keys of this interface represent `static` attrs of user components.
 */
export interface IComponentRegister extends SPX.Class { connect: SPX.Connect }

/**
 * Component Instance
 *
 * Holds the instance type of a component
 */
export type IComponentInstance = Merge<IComponentExtends, SPX.Class>;

/**
 * Component Scope (onInit)
 *
 * This interface describes a component in the DOM. SPX builds a model during tree
 * traversal and uses this reference to extend user defined components.
 */
export interface IScope {
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
   * The components registry name, this value points to the `registar` key and will
   * be the class name of component.
   */
  instanceOf: string;
  /**
   * List of fragments the component is contained within. When a component is within
   * a fragment then it will not persist and in the next known navigation it does
   * not exist or if the internal contents do not match it the component will be removed
   * and any listeners will teardown.
   */
  // fragment: string;
  /**
   * Component Element
   *
   * The Component element where `spx-component=""` was applied. When this value is `null`
   * if infers that we have _some_ context already existing contained outside the component
   * element.
   */
  dom: string;
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
  events: { [uuid: string]: IComponentEvent };
  /**
   * Component Nodes
   *
   * Node Elements of the component. The UUID key matches elements `data-spx` value
   * and the value is an number representing the `this.<name>Node[]` index, which
   * the instance getter references.
   */
  nodes: { [uuid: string]: IComponentNodes };
  /**
   * Component Binds
   *
   * Node elements bound by state.
   */
  binds: { [uuid: string]: IComponentBinds };

}

/**
 * Component Class
 *
 * The raw component as a class type.
 */
export type IComponentClass = Class<IComponentInstance>

/**
 * Component Sessions
 *
 * This interface represents the `$.component` value which holds 3 `Map`
 * references. Each reference (`Map`) is a store used for component control.
 */
export interface IComponent {
  /**
   * Components register
   *
   * This Map contains raw class references that will be used to invoke instances.
   */
  registry: { [componentName: string]: any };
  /**
   * Connected Elements
   *
   * A Set data store which maintain a reference of elements that have been walked.
   */
  connected: Set<HTMLElement>;
  /**
   * Component Instances
   *
   * Holds component instances which have been established. This is a persisted store.
   */
  instances: {
    [uuid: string]: {
      /**
       * Component Instance
       *
       * Returns the component class instance
       */
      instance: IComponentInstance;
      /**
       * Component Scopes
       *
       * Holds reference to components who have had an instance established.
       * Each key is a `uuid` which represents a **component** identifier.
       * Scopes are composed and instances are established on **new visits**
       * to a path location which has a `visit` count of `0`.
       *
       * The scope and instance establishment is an expensive operation and
       * will only run once per-page. Recurring visits to locations will be
       * handled and re-intialized via morphs.
       */
      scope: IScope;
    }
  };
  /**
   * Component References
   *
   * Reference Identifier maps. Each key is a `uuid` applied to elements
   * in the dom via `data-spx` (which is an internal marker). The value
   * is a `uuid` key that can be used to obtain a `scope` and `instance`
   * in the **scope** Map.
   *
   * Refs are matched during **morph** operations.
   */
  refs: { [uuid: string]: string; };
}
