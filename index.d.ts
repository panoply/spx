import { SPX } from './types/global';
import type { HistoryAPI } from './types/config';
import { LiteralUnion } from 'type-fest';
export type { SPX } from './types/global';

declare global {

  /**
   * Allows manipulation and formatting of text strings and determination and location of substrings within strings.
   *
   * ---
   *
   * #### SPX String
   *
   * String constructors are extended in SPX and to support string literals expressions.
   *
   * ---
   *
   * #### SPX Object
   *
   * Object constructors are extended in SPX and support _typed_ expressions.
   *
   * @example
   *
   * class Example extends spx.Component {
   *
   *   static define = {
   *     state: {
   *       string: String<'foo' | 'bar'>
   *     }
   *   }
   *
   * }
   */
  export interface StringConstructor {
    new <T extends string>(value?: T): LiteralUnion<T, string>;
    <T extends string>(value?: T): LiteralUnion<T, string>;
  }

  /**
   * Provides functionality common to all JavaScript objects.
   *
   * ---
   *
   * #### SPX Object
   *
   * Object constructors are extended in SPX and support _typed_ expressions.
   *
   * @example
   *
   * class Example extends spx.Component {
   *
   *   static define = {
   *     state: {
   *       object: Object<{ foo: string; bar: number; }>
   *     }
   *   }
   *
   * }
   */
  export interface ObjectConstructor {
    new <T extends object>(value?: T): T
    <T extends object>(): T;
    <T extends object>(value: T): T;
  }

  export interface Element {
    /**
     * Morph Related (Virtual DOM)
     */
    actualize?:(element: Node) => Element
  }

  export interface HTMLElement {
    /**
     * SPX Specific Element
     */
    spx?: Set<string>
  }

  export interface History extends HistoryAPI {}

  export interface Window {
    /**
     * **_SPX_**
     */
    spx: SPX.API
  }

}

declare const spx: SPX.API & typeof SPX.Methods;

export default spx;
