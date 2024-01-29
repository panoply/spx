/* eslint-disable dot-notation */
/* eslint-disable no-use-before-define */
/* eslint-disable no-redeclare */

import { ValueOf } from 'type-fest';
import { $ } from '../app/session';
import { isArray, nil, o } from '../shared/native';
import { attrJSON, defineGetter, hasProp, upcase } from '../shared/utils';
import { IScope, SPX } from '../types/components';

/**
 * Component Extends
 *
 * Extends base classes and assigns scopes to custom defined components.
 */
export class Component {

  /**
   * Component State
   *
   * The digested static `state` references of components that have
   * extended this base class.
   */
  public state?: ProxyHandler<{
    /**
     * State Value Existence
     *
     * Returns a `boolean` informing on whether the state reference
     * has been defined via the DOM component.
     */
    readonly [key: `has${Capitalize<string>}`]: boolean;
    /**
     * State Value
     *
     * The parsed and type converted `state` value.
     */
    [key: string]: any;

  }>;

  /**
   * DOM Node
   *
   * Returns the element of which is annotated with `spx-component`
   */
  public dom: HTMLElement;

  /**
   * Document Element
   *
   * Returns the `<html>` documentElement
   */
  public get html () { return this.dom.closest('html'); }

  /**
   * Constructor
   *
   * Creates the component instance
   */
  constructor ({ state, instanceOf }: IScope, domNode: HTMLElement, connect: SPX.Connect) {

    this.dom = domNode;

    if (connect.state !== null) {

      /**
       * Schema Prefix for `state` value
       */
      const prefix = $.config.schema + instanceOf;

      /**
       * State applied proxy
       *
       * Aligns the DOM attributes whenever a state change is applied.
       */
      this.state = new Proxy(o(), {
        set: (target, key: string, value) => {

          const staticState = connect.state[key];

          if (typeof staticState === 'object' && hasProp(staticState, 'persist') && staticState.persist) {
            target[key] = state[key] = value;
          } else {
            target[key] = value;
          }

          /**
         * We need to stringify the attribute value if it is an array or object
         * before making a reference on the DOM node.
         */
          const domValue = typeof value === 'object' || isArray(value)
            ? JSON.stringify(value)
            : value;

          this.dom.setAttribute(`${prefix}:${key}`, domValue);

          if (hasProp(this, `${key}StateNodes`)) {
            for (const binding of this[`${key}StateNodes`]) {
              binding.innerText = domValue;
            }
          }

          return true;
        }
      });

      const hasRef = defineGetter(this.state);

      for (const prop in connect.state) {

        /**
         * The `static` state value
         */
        const attr = connect.state[prop];

        /**
         * Whether or not the data key exists on DOM component
         */
        const isDefined = this.dom.hasAttribute(`${prefix}:${prop}`);

        /**
         * Applies a getter reference to the state context
         */
        hasRef(`has${upcase(prop)}`, isDefined);

        /**
         * The `static` state type contructor value
         */
        let type: ValueOf<typeof connect.state>;

        /**
         * The `static` state type converted value
         */
        let value: any;

        /**
         * Whether or not connect value is object or array and assigned as default
         */
        let isDefaultJSON: boolean = false;

        /**
         * Lets quickly determine whether the components static `state` has
         * a default value reference or just a constructor reference. We will
         * override component defined defaults with DOM defined defaults if
         * both exist, as DOM defined defaults are first class citizens.
         */
        if (typeof attr === 'object') {
          value = isDefined ? state[prop] : attr['default'];
          type = attr['typeof'];
          isDefaultJSON = typeof value === 'object' || isArray(value);
        } else {
          value = isDefined ? state[prop] : undefined;
          type = attr;
        }

        if (typeof value === 'string' && value.startsWith('window.')) {
          this.state[prop] = state[prop] = window[value.slice(7)];
        } else if (type === String) {
          this.state[prop] = state[prop] = value || nil;
        } else if (type === Boolean) {
          this.state[prop] = state[prop] = value === 'true';
        } else if (type === Number) {
          this.state[prop] = state[prop] = Number(value) || 0;
        } else if (type === Array) {
          this.state[prop] = state[prop] = value === undefined
            ? []
            : isDefaultJSON
              ? value
              : attrJSON(prop, value);
        } else if (type === Object) {
          this.state[prop] = state[prop] = value === undefined
            ? {}
            : isDefaultJSON
              ? value
              : attrJSON(prop, value);
        }

      }
    }
  }

}
