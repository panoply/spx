/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import type { Merge } from 'type-fest';
import type { Page } from './page';
import type { Options } from './options';
import type { Component } from './spx';

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
 * **SPX Types**
 *
 * Small collection of TypeScript utilities for dealing with SPX
 */
export namespace SPX {

  export { Page, Options, Component };

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

  export type Define = {
    /**
     * Identifier Name
     */
    id?: string;
    /**
     * Whether or not to merge on mount
     */
    merge?: boolean;
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

}
