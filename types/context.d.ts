import type { Scope } from './components';

export interface Context {
  /**
   * Alias Maps
   */
  $aliases: { [alias: string]: string; };
  /**
   * Component Scopes
   */
  $scopes: { [component: string]: Scope[]; };
  /**
   * When we are applying incremental context generation (i.e: during morphs)
   * this value will be `true`, otherwise `false`.
   *
   * @default false
   */
  $morph: HTMLElement;
  /**
   * Holds a reference to the snapshot, used for creating data-spx="" references
   *
   * @default false
   */
  $snapshot: HTMLElement;
  /**
   * Holds a reference to the last known element identifier
   *
   * @default null
   */
  $element: string;
  /**
   * Holds a reference to the last known element identifier
   *
   * @default null
   */
  $snaps: string;
}

export interface CTX {
  /**
   * This holds `id=""` values
   */
  marks: Set<string>,
  /**
   * This reference consists of a selector and `data-spx` reference value.
   * The Map **key** is a selector whereas the `string[]` **value** represents
   * each reference to be assigned.
   */
  refs?: Map<string, string[]>;
  /**
   * Records describing context states of components
   */
  snaps: Array<[ element: HTMLElement, refs: Map<string, string[]>]>;
  /**
   * Component state contexts, consisting of a Context store
   */
  store: Context;
}
