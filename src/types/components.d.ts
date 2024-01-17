import { Class, MergeExclusive } from 'type-fest';
import { SPX } from './methods';

export type TypeConstructors = (
  | StringConstructor
  | BooleanConstructor
  | ObjectConstructor
  | NumberConstructor
  | ArrayConstructor
)

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
   * The class method name that the event will be attached
   */
  method: string;
  /**
   * Addition event `detail` data attrs annotated on event and binded
   * to the callback method.
   */
  binding: any;
  /**
   * Whether or not the event has been attached and is listening
   */
  attached: boolean;
  /**
   * Whether or not the event target is `window`
   */
  isWindow: boolean;
}

export interface IScope {
  /**
   * The component UUID key identifier. This **MUST** be unique. When `domNode`
   * elements contain an `id` attribute, the value defined will be used, otherwise
   * a UUID will be generated and assigned here.
   *
   * This value will also be the `Component.scopes` Map key identifier.
   */
  key?: string;
  /**
   * The components registry name, this value points to the `registar` key and will
   * be the class name of component.
   */
  instanceOf?: string;
  /**
   * List of fragments the component is contained within. When a component is within
   * a fragment then it will not persist and if in the next known navigation it does
   * not exist or if the internal contents do not match it the component will be removed
   * and any listeners will teardown.
   */
  inFragment?: Set<string>;
  /**
   * The Component element where `spx-component=""` was applied.
   */
  domNode?: HTMLElement;
  /**
   * The DOM State references, in alignment with the `attrs` static definitions
   */
  domState?: any;
  /**
   * Event Listeners applied in this component instance
   */
  listeners?: Map<HTMLElement, IComponentEvent[]>;
  /**
   * Node Elements contained within the component
   */
  nodes?: Map<string, HTMLElement[]>
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
   * A single node `HTMLElement`
   */
  [name: `${Lowercase<string>}Node`]: HTMLElement;
  /**
   * An Array list of node `HTMLElement[]` occurances.
   */
  [name: `${Lowercase<string>}Nodes`]: HTMLElement[];
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
  readonly dom?: HTMLElement;
  /**
   * State references
   *
   * Combines the static `attrs` entries and also exposes conditional
   * `has` prefixed checks.
   */
  state?: ProxyHandler<{
    readonly [key: `has${Capitalize<string>}`]: boolean;
    [key: string]: any;
  }>
}

export interface IComponent {
  /**
   * Components register, used to invoke instances
   */
  registar: { [name: string]: Class<MergeExclusive<IComponentExtends, SPX.Class>> };
  /**
   * Class instances. Map key value is a UUID, and value is class scope.
   * Pages will determine the running components via `page.components[]`
   * list references.
   */
  instances?: { [uuid: string]: MergeExclusive<IComponentExtends, SPX.Class> };
  /**
   * Holds reference to components currently live in the DOM,
   * each value is a UUID which points to the scopes key reference.
   */
  scopes?: Map<string, IScope>;
}
