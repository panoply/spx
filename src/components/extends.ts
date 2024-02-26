/* eslint-disable dot-notation */
/* eslint-disable no-use-before-define */
/* eslint-disable no-redeclare */

import { Merge, ValueOf } from 'type-fest';
import { o, nil, isArray, defineProps, defineProp } from '../shared/native';
import { attrJSON, hasProp, upcase } from '../shared/utils';
import { IScope, SPX } from '../types/components';
import { Errors } from '../shared/enums';
import { log } from '../shared/logs';
// import { morphBinds } from '../morph/snapshot';
import { $ } from '../app/session';

/**
 * Component Extends
 *
 * Extends base classes and assigns scopes to custom defined components.
 */
export const Component = class {

  /**
   * Component Scope
   *
   * Holds scope reference information about the instance, elements which pertain to the instance
   * and event reference handling.
   */
  readonly scope: IScope;

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
   * State Interface
   *
   * Returns the element of which is annotated with `spx-component`
   */
  readonly static: Merge<SPX.Connect, { id: string; }>;

  /**
   * DOM Node
   *
   * Returns the element of which is annotated with `spx-component`
   */
  public get dom () { return $.components.elements.get(this.scope.el); };

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
  constructor (scope: IScope, connect: SPX.Connect) {

    defineProps(this, {
      scope: {
        get () { return scope; }
      },
      static: {
        get () { return connect; }
      }
    });

    const prefix = `${$.config.schema}${this.scope.instanceOf}`;

    /**
     * State applied proxy
     *
     * Aligns the DOM attributes whenever a state change is applied.
     */
    this.state = new Proxy(o(), {
      set: (target, key: string, value) => {

        const preset = this.static.state[key];
        const domValue = typeof value === 'object' || isArray(value)
          ? JSON.stringify(value)
          : `${value}`;

        if (typeof preset === 'object' && hasProp(preset, 'persist') && preset.persist) {
          target[key] = this.scope.state[key] = value;
        } else {
          target[key] = value;
        }

        if (this.dom && domValue !== this.dom.getAttribute(`${prefix}:${key}`)) {
          this.dom.setAttribute(
            `${prefix}:${key}`,
            domValue
          );
        }

        if (key in this.scope.context.binds) {
          for (const ref of this.scope.context.binds[key]) {

            const bind = this.scope.binds[ref];

            $.components.elements.get(bind.el).innerText = domValue;

            // onNextTick(() => morphBinds(
            //   this.scope.ref,
            //   bind,
            //   domValue
            // ));
          }

        }

        return true;

      }
    });

    for (const prop in this.scope.state) {

      if (!hasProp(connect.state, prop)) {
        log(Errors.WARN, `Undefined state reference passed: ${prefix}:${prop}`, this.dom);
        continue;
      }

      /**
       * The `static` state value
       */
      const attr = this.static.state[prop];

      /**
       * The `static` state type contructor value
       */
      let type: ValueOf<typeof connect.state>;

      /**
       * The `static` state type converted value
       */
      let value: string = this.dom.getAttribute(`${prefix}:${prop}`);

      /**
       * The JSON value defintion
       */
      let json: boolean;

      /**
       * Whether or not dom state reference exists
       */
      const defined = value !== null && value !== nil;

      if (typeof attr === 'object') {
        type = attr.typeof;
        json = defined;
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
        this.state[prop] = value || false;
      } else if (type === Number) {
        this.state[prop] = value ? +value : 0;
      } else if (type === Array) {
        this.state[prop] = defined ? attrJSON(value) : json ? value : [];
      } else if (type === Object) {
        this.state[prop] = defined ? attrJSON(value) : json ? value : {};
      }

      this.scope.state[prop] = this.state[prop];

    }

  }

};
