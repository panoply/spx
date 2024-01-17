/* eslint-disable dot-notation */
/* eslint-disable no-use-before-define */
/* eslint-disable no-redeclare */

import { $ } from '../app/session';
import { Errors } from '../shared/enums';
import { isArray } from '../shared/native';
import { attrJSON, defineGetter, hasProp, hasProps, log, upcase } from '../shared/utils';
import { IComponentExtends, TypeConstructors } from '../types/components';

/**
 * Component Extends
 *
 * Extends base classes and assigns scopes to classes.
 */
export class Component {

  /**
   * Component Scope
   *
   * The scope of this specific instance according to the UUID
   */

  private get scope () { return $.components.scopes.get(this.key); }

  /**
   * Component UUID Key
   *
   * The unique identifier key for this instance. This is used to
   * retrive scopes from the static `scopes` Map store.
   */
  private key: string;

  /**
   * Component State
   *
   * The digested static `attrs` references of components that have
   * extended this base class.
   */
  public state?: ProxyHandler<{
    readonly [key: `has${Capitalize<string>}`]: boolean;
    [key: string]: any;
  }>;

  public get dom () { return this.scope.domNode; }
  public get html () { return this.dom.closest('html'); }
  public component <T extends IComponentExtends> (id: string): T {

    if (hasProp($.components.instances, id)) {
      return $.components.instances[id] as T;
    } else {
      log(Errors.WARN, `Unknown or undefined component identifier: id="${id}"`);
      return null;
    }

  }

  constructor (key: string) {

    this.key = key;

    const { domNode, domState, instanceOf, nodes } = this.scope;
    const prefix = $.config.schema + instanceOf;

    /**
     * State applied proxy
     *
     * Aligns the DOM attributes whenever a state change is applied.
     */
    this.state = new Proxy(domState, {
      set (target, key: string, newValue) {

        target[key] = newValue;

        domNode.setAttribute(`${prefix}:${key}`, typeof newValue === 'object' || isArray(newValue)
          ? JSON.stringify(newValue, null, 0)
          : newValue);

        return true;

      }
    });

    const { attrs } = $.components.registar[instanceOf] as any;

    if (attrs !== null) {

      const has = defineGetter(this.state);
      const exists = hasProps(domState);

      for (const k in attrs) {

        // if (!exists(k)) continue;

        const isDefined = domNode.hasAttribute(`${prefix}:${k}`);

        has(`has${upcase(k)}`, isDefined);

        let value: any;
        let type: TypeConstructors;

        if (typeof attrs[k] === 'object') {
          value = isDefined ? domState[k] : attrs[k]['default'];
          type = attrs[k]['typeof'];
        } else {
          value = isDefined ? domState[k] : undefined;
          type = attrs[k];
        }

        if (typeof value === 'string' && value.startsWith('window.')) {
          this.state[k] = domState[k] = window[value.slice(7)];
        } else if (type === String) {
          this.state[k] = domState[k] = value;
        } else if (type === Boolean) {
          this.state[k] = domState[k] = value === 'true';
        } else if (type === Number) {
          this.state[k] = domState[k] = Number(value);
        } else if (type === Array || type === Object) {
          this.state[k] = domState[k] = attrJSON(k, value);
        }

      }
    }

    const define = defineGetter(this);

    for (const [ k, n ] of nodes) {
      define(`${k}Node`, n[0]);
      define(`${k}Nodes`, n);
    }

  }

}
