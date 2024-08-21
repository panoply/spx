/* eslint-disable dot-notation */
/* eslint-disable no-use-before-define */
/* eslint-disable no-redeclare */

import type { DOM, Scope, ValueOf } from 'types';
import { $ } from '../app/session';
import { nil, m, p, o } from '../shared/native';
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
   * Root Node
   *
   * Returns the element of which is annotated with `spx-component`
   */
  readonly root: HTMLElement;

  /**
   * Root Node
   *
   * Returns the element of which is annotated with `spx-component`
   */
  readonly dom: DOM = o();

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

  }> = o();

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
    const { scope } = Object.defineProperties(this, {
      scope: { get: () => Component.scopes.get(key) },
      root: { get: () => $elements.get(scope.root) }
    });

    /**
     * First, we will assign all the DOM nodes
     *
     * This operation will also apply within instances generator
     * in situation where nodes are not defined.
     */
    for (const identifer of scope.define.nodes) {

      const schema = `${identifer}Nodes`;
      const domNode = schema.slice(0, -1);
      const hasNode = `has${upcase(domNode)}`;

      scope.nodeMap[schema] = [];

      Object.defineProperties(this.dom, {
        [domNode]: { get: () => this.dom[schema][0] },
        [hasNode]: { get: () => this.dom[schema].length > 0 },
        [schema]: {
          get: () => scope.nodeMap[schema].map(id => $elements.get(id)),
          set: (ids) => (scope.nodeMap[schema] = ids)
        }
      });

    }

    const { define } = scope;
    const prefix = `${$.config.schema}${scope.instanceOf}`;

    /**
     * State applied proxy
     *
     * Aligns the DOM attributes whenever a state change is applied.
     */
    this.state = p({
      set: (target, key: string, value) => {

        const preset = define.state[key];
        const domValue = typeof value === 'object' || Array.isArray(value)
          ? JSON.stringify(value)
          : `${value}`;

        if (typeof preset === 'object' && hasProp(preset, 'persist') && preset.persist) {
          scope.state[key] = value;
          target[key] = scope.state[key];
        } else {
          target[key] = value;
        }

        if (domValue.trim() !== nil && this.root) {

          const attrName = this.root.hasAttribute(`${prefix}:${key}`)
            ? `${prefix}:${key}`
            : `${prefix}:${kebabCase(key)}`;

          if (domValue !== this.root.getAttribute(`${prefix}:${key}`)) {
            this.root.setAttribute(attrName, domValue);
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
          this.state[prop] = Array.isArray(value) ? value : [];
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
        let value: string = this.root.hasAttribute(`${prefix}:${attrName}`)
          ? this.root.getAttribute(`${prefix}:${attrName}`)
          : this.root.getAttribute(`${prefix}:${prop}`);

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
          Object.defineProperty(this.state, `has${upcase(prop)}`, {
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
