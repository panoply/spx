/* eslint-disable dot-notation */
/* eslint-disable no-use-before-define */
/* eslint-disable no-redeclare */

import type { Scope, ValueOf } from 'types';
import { $ } from '../app/session';
import { nil, isArray, defineProps, defineProp, m } from '../shared/native';
import { attrJSON, hasProp, isEmpty, kebabCase, upcase } from '../shared/utils';

/**
 * Component Extends
 *
 * Extends base classes and assigns scopes to custom defined components.
 */
export const Component = class {

  /**
   * Component Scopes
   *
   * Isolated store of all component instance scopes. Available to component instances
   * via the getter `scope` property. This reference acts as the generation guideline
   * for component instances.
   */
  static scopes: Map<string, Scope> = m();

  /**
   * Component Scope
   *
   * Holds scope reference information about the instance, elements which pertain to the instance
   * and event reference handling.
   */
  readonly scope: Scope;

  /**
   * DOM Node
   *
   * Returns the element of which is annotated with `spx-component`
   */
  readonly dom: HTMLElement;

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

  }> = {};

  /**
   * **SPX Document Element**
   *
   * Holds a reference to the DOM Document element `<html>` node.
   */
  get html () { return document.documentElement; };

  /**
   * Constructor
   *
   * Creates the component instance
   */
  constructor (key: string) {

    const { $elements } = $.components;
    const { scope } = defineProps(this, {
      scope: {
        get: () => Component.scopes.get(key)
      },
      dom: {
        get: () => $elements.get(scope.dom)
      }
    });

    const { define } = scope;
    const prefix = `${$.config.schema}${scope.instanceOf}`;

    // console.log(scope);

    /**
     * State applied proxy
     *
     * Aligns the DOM attributes whenever a state change is applied.
     */
    this.state = new Proxy({}, {
      set: (target, key: string, value) => {

        const preset = define.state[key];
        const domValue = typeof value === 'object' || isArray(value)
          ? JSON.stringify(value)
          : `${value}`;

        if (typeof preset === 'object' && hasProp(preset, 'persist') && preset.persist) {
          scope.state[key] = value;
          target[key] = scope.state[key];
        } else {
          target[key] = value;
        }

        if (domValue.trim() !== nil && this.dom) {

          const attrName = this.dom.hasAttribute(`${prefix}:${key}`)
            ? `${prefix}:${key}`
            : `${prefix}:${kebabCase(key)}`;

          if (domValue !== this.dom.getAttribute(`${prefix}:${key}`)) {
            this.dom.setAttribute(attrName, domValue);
          }

        }

        if (key in scope.binds) {

          const { binds } = scope;

          for (const id in binds[key]) {
            binds[key][id].value = domValue;
            if ($elements.has(binds[key][id].dom)) {
              $elements.get(binds[key][id].dom).innerText = domValue;
            }
          }
        }

        return true;

      }
    });

    if (isEmpty(scope.state)) {

      for (const prop in define.state) {

        /**
         * The `static` state value
         */
        const attr = define.state[prop];

        /**
         * The `static` state type contructor value
         */
        let type: ValueOf<typeof define.state>;

        /**
         * The `static` state type converted value
         */
        let value: string;

        if (typeof attr === 'object') {
          type = attr.typeof;
          value = attr.default;
        } else {
          type = attr;
        }

        if (type === String) {
          this.state[prop] = value || nil;
        } else if (type === Boolean) {
          this.state[prop] = typeof value === 'boolean' ? value : value === 'true' || false;
        } else if (type === Number) {
          this.state[prop] = value ? Number(value) : 0;
        } else if (type === Array) {
          this.state[prop] = isArray(value) ? value : [];
        } else if (type === Object) {
          this.state[prop] = typeof value === 'object' ? value : {};
        }

        scope.state[prop] = this.state[prop];

      }

    } else {

      for (const prop in define.state) {

        if (!(prop in scope.state)) {
          if (typeof define.state[prop] === 'object') {
            scope.state[prop] = define.state[prop].default;
          } else {
            switch (define.state[prop]) {
              case String: scope.state[prop] = nil; break;
              case Boolean: scope.state[prop] = false; break;
              case Number: scope.state[prop] = 0; break;
              case Object: scope.state[prop] = {}; break;
              case Array: scope.state[prop] = []; break;
            }
          }
        }

        /**
         * The `static` state value
         */
        const attr = define.state[prop];

        /**
         * The converted attribute name
         */
        const attrName = kebabCase(prop);

        /**
       * The `static` state type contructor value
       */
        let type: ValueOf<typeof define.state>;

        /**
         * The `static` state type converted value
         */
        let value: string = this.dom.hasAttribute(`${prefix}:${attrName}`)
          ? this.dom.getAttribute(`${prefix}:${attrName}`)
          : this.dom.getAttribute(`${prefix}:${prop}`);

        /**
         * Whether or not dom state reference exists
         */
        const defined = value !== null && value !== nil;

        if (typeof attr === 'object') {
          type = attr.typeof;
          if (!defined) value = attr.default;
        } else {
          type = attr;
        }

        if (!(`has${upcase(prop)}` in this.state)) {
          defineProp(this.state, `has${upcase(prop)}`, {
            get () { return defined; }
          });
        }

        if (typeof value === 'string' && value.startsWith('window.')) {
          this.state[prop] = window[value.slice(7)];
        } else if (type === String) {
          this.state[prop] = value || nil;
        } else if (type === Boolean) {
          this.state[prop] = typeof value === 'boolean' ? value : value === 'true' || false;
        } else if (type === Number) {
          this.state[prop] = value ? Number(value) : 0;
        } else if (type === Array) {
          this.state[prop] = defined ? attrJSON(value) : value || [];
        } else if (type === Object) {
          this.state[prop] = defined ? attrJSON(value) : value || {};
        }

        scope.state[prop] = this.state[prop];

      }

    }

  }

};
