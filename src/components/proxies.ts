import type { Class, ComponentNodes, ValueOf } from 'types';
import { $ } from '../app/session';
import { attrJSON, forNode, isEmpty, kebabCase, upcase, setStateDefaults } from '../shared/utils';
import { DoM } from './dom';
import * as log from '../shared/logs';

export const stateProxy = (instance: Class) => {

  const { scope, dom } = instance;

  // @ts-ignore
  instance.state = new Proxy(scope.state, {
    get: Reflect.get,
    set (target, key: string, value, receiver) {

      if (key in scope.binds) {

        const binding = scope.binds[key];
        const domValue = typeof value === 'object' || Array.isArray(value) ? JSON.stringify(value) : `${value}`;

        for (const id in binding) {
          if (!binding[id].live) continue;
          binding[id].value = domValue;
          forNode(binding[id].selector, node => { node.innerText = domValue; });
        }
      }

      return Reflect.set(target, key, value, receiver);

    }
  });

  const prefix = $.config.schema + scope.instanceOf;

  if (isEmpty(scope.state)) {

    for (const prop in scope.define.state) {
      scope.state[prop] = setStateDefaults(scope.define.state[prop]);
    }

  } else {

    for (const prop in scope.define.state) {

      /** The `state` defined value */
      const stateValue = scope.define.state[prop];

      if (!(prop in scope.state)) {
        scope.state[prop] = setStateDefaults(stateValue);
        continue;
      }

      const hasProp = `has${upcase(prop)}`;

      let attrName = `${prefix}:${kebabCase(prop)}`;
      if (!dom.hasAttribute(attrName)) attrName = `${prefix}:${prop}`;

      const domValue = dom.getAttribute(attrName);
      const defined = domValue !== null && domValue !== ''; // whether dom state is defined

      hasProp in scope.state || Reflect.set(scope.state, hasProp, defined);

      if (typeof domValue === 'string' && domValue.startsWith('window.')) {

        const windowProp = domValue.slice(7);

        if (windowProp in window) {
          scope.state[prop] = window[windowProp];
        } else {
          log.warn(`Property "windowProp" does not exist on window: ${$.qs.$component}-${attrName}="${domValue}"`);
        }

      } else {

        if (Array.isArray(stateValue)) {
          scope.state[prop] = defined ? attrJSON(domValue) : stateValue;
        } else {

          const typeOf: ValueOf<typeof scope.define.state> = typeof stateValue;

          if (typeOf === 'object') {
            scope.state[prop] = defined ? attrJSON(domValue) : stateValue;
          } else if (typeOf === 'number') {
            scope.state[prop] = defined ? +domValue : stateValue;
          } else if (typeOf === 'boolean') {
            scope.state[prop] = defined ? domValue === 'true' : stateValue;
          } else if (typeOf === 'string') {
            scope.state[prop] = defined ? domValue : stateValue;
          } else {
            switch (stateValue) {
              case String: scope.state[prop] = defined ? domValue : ''; break;
              case Boolean: scope.state[prop] = domValue === 'true' || false; break;
              case Number: scope.state[prop] = domValue ? Number(domValue) : 0; break;
              case Object: scope.state[prop] = defined ? attrJSON(domValue) : {}; break;
              case Array: scope.state[prop] = defined ? attrJSON(domValue) : []; break;
            }
          }
        }

      }
    }

  }

};

export const setNodeProxy = (prop: symbol | string, node: HTMLElement) => {

  const prototype = Reflect.getPrototypeOf(node);
  const descriptor = Reflect.getOwnPropertyDescriptor(prototype, prop);

  if (descriptor && descriptor.get) return Reflect.get(prototype, prop, node);

  const value = Reflect.get(node, prop);

  return typeof value === 'function' ? value.bind(node) : value;

};

export const nodeProxy = (node: HTMLElement) => !node ? null : new Proxy(node, {
  set: (target, prop, value, receiver) => prop in node
    ? Reflect.set(node, prop, value)
    : Reflect.set(target, prop, value, receiver),
  get: (target, prop, receiver) => {
    if (prop in node) return setNodeProxy(prop, node);
    if (prop in DoM) return (...args: unknown[]) => DoM[prop](node, ...args);
    return Reflect.get(target, prop, receiver);
  }
});

export const sugarProxy = ({ dom, name }: ComponentNodes) => {

  return new Proxy(() => dom.nodes, {
    get (target, prop, receiver) {

      const { node } = dom;

      if (prop === Symbol.toPrimitive) {
        log.error(`Sugar Error: Use this.${name}.toNode() for raw element: ${`this.${name}`}`);
        return () => '';
      }

      if (prop in DoM) {

        return (...args: unknown[]) => DoM[prop](node, ...args);

      } else if (prop in node) {

        return setNodeProxy(prop, node);

      }

      return Reflect.get(target, prop, receiver);

    },
    set (target, prop, value, receiver) {
      const { node } = dom;
      return prop in node
        ? Reflect.set(node, prop, value)
        : Reflect.set(target, prop, value, receiver);
    },
    apply (target, thisArg, args) {

      const { nodes } = dom;

      if (args.length === 2) return nodes.reduce(args[1], args[0]);

      const length = nodes.length;
      const callback = args[0];
      const typeOf = typeof args[0];

      if (typeOf === 'number') return nodeProxy(nodes[callback]);
      if (typeOf === 'string') return nodes.filter(el => el.matches(callback));
      if (typeOf === 'function') {

        let index = -1;
        const map = Array(length);

        while (++index < length) {
          map[index] = callback(nodeProxy(nodes[index]), index);
        }

        return map;
      }

      return Reflect.apply(target, thisArg, args);

    }
  });

};
