/* eslint-disable dot-notation */
/* eslint-disable no-use-before-define */
/* eslint-disable no-redeclare */

import type { Scope, SPX } from 'types';
import { d, m } from '../shared/native';
import { stateProxy } from './proxies';

export function Component (define: SPX.Define) {

  /**
   * Component Extends
   *
   * Extends base classes and assigns scopes to custom defined components.
   */
  return class {

    /**
     * Static Definition
     *
     * The define object
     */
    static define = Object.assign({
      name: '',
      merge: false,
      state: {},
      nodes: []
    }, define);

    /**
     * Component Scope
     *
     * Private reference describing component
     */
    readonly scope: Scope;

    /**
     * Ref
     *
     * The component UUID Reference
     */
    readonly ref: string;

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
      readonly [key: string]: any;

    }>;

    /**
     * **SPX Document Element**
     *
     * Holds a reference to the DOM Document element `<html>` node.
     */
    get root () { return d(); };

    /**
     * **SPX Component Element**
     *
     * Holds a reference to the DOM Document element `<div spx-component="">` node.
     */
    get view () { return this.scope.dom; }

    /**
     * Constructor
     *
     * Creates the component instance
     */
    constructor (value: string) {
      Reflect.defineProperty(this, 'scope', { get () { return Component.scopes.get(value); } });
      Reflect.defineProperty(this, 'ref', { value, configurable: false, enumerable: false, writable: false });
      stateProxy<any>(this);
    }

  };

};

Component.scopes = m<string, Scope>();
