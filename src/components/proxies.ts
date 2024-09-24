import type { ComponentNodes, Scope } from 'types';
import { $ } from '../app/session';
import { attrJSON, convertValue, forNode, isEmpty, kebabCase, upcase } from '../shared/utils';
import { DoM } from './dom';
import { log, C, R } from '../shared/logs';
import { Log } from '../shared/enums';

export const stateProxy = (scope: Scope, dom: HTMLElement) => {

  const prefix = $.config.schema + scope.instanceOf;

  const initialState = (prop: string, attr: any, typeCheck = false) => {

    /** The `spx.Component()` state type contructor value */
    let type = attr;

    /** The `spx.Component()` state type converted value */
    let value = '';

    if (typeof attr === 'object' && 'typeof' in attr) {
      type = attr.typeof;
      value = attr.default;
    }

    scope.state[prop] = convertValue(type, value);

  };

  if (isEmpty(scope.state)) {

    for (const prop in scope.define.state) {
      initialState(prop, scope.define.state[prop]);
    }

  } else {

    for (const prop in scope.define.state) {

      prop in scope.state || initialState(prop, scope.define.state[prop]);

      const attrName = kebabCase(prop);
      const attrValue = dom.getAttribute(`${prefix}:${attrName}`) || dom.getAttribute(`${prefix}:${prop}`);
      const defined = attrValue !== null && attrValue !== '';
      const hasState = `has${upcase(prop)}`;

      hasState in scope.state || Object.defineProperty(scope.state, hasState, { get: () => defined });

      if (attrValue && attrValue.startsWith('window.')) {

        scope.state[prop] = window[attrValue.slice(7)];

      } else {

        const attr = scope.define.state[prop];
        const type = typeof attr === 'object' ? attr.typeof : attr;
        const value = defined ? attrValue : (typeof attr === 'object' ? attr.default : '');

        scope.state[prop] = (type === Object || type === Array)
          ? (defined ? attrJSON(value) : value)
          : convertValue(type, value);
      }
    }
  }

  return new Proxy(scope.state, {
    get: Reflect.get,
    set: (target, key: string, value, receiver) => {

      const domValue = typeof value === 'object' || Array.isArray(value)
        ? JSON.stringify(value)
        : String(value);

      if (dom && domValue.trim() !== '') {
        const camelCase = `${prefix}:${key}`;
        const attrName = dom.hasAttribute(camelCase) ? camelCase : `${prefix}:${kebabCase(key)}`;
        domValue === dom.getAttribute(attrName) || dom.setAttribute(attrName, domValue);
      }

      if (key in scope.binds) {
        for (const id in scope.binds[key]) {
          if (!scope.binds[key][id].live) continue;
          scope.binds[key][id].value = domValue;
          forNode(scope.binds[key][id].selector, node => { node.innerText = domValue; });
        }
      }

      return Reflect.set(target, key, value, receiver);

    }
  });
};

export const nodeProxy = (node: HTMLElement) => {

  return new Proxy(node, {
    get: (_, prop) => prop in DoM ? (...args: unknown[]) => DoM[prop](node, ...args) : node[prop]
  });

};

export const sugarProxy = ({ dom, name }: ComponentNodes) => {

  return new Proxy(() => dom.nodes, {
    get (target, prop, receiver) {

      const { node } = dom;

      if (prop === Symbol.toPrimitive) {
        log(Log.ERROR, `Sugar Error: Use ${C(`this.${name}.toNode()`)} for raw element: ${R(`this.${name}`)}`);
        return () => '';
      }

      if (prop in DoM) {

        return (...args: unknown[]) => DoM[prop](node, ...args);

      } else if (prop in node) {

        const prototype = Reflect.getPrototypeOf(node);
        const descriptor = Reflect.getOwnPropertyDescriptor(prototype, prop);

        if (descriptor && descriptor.get) return Reflect.get(prototype, prop, node);

        const value = Reflect.get(node, prop);

        return typeof value === 'function' ? value.bind(node) : value;

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
      const typeOf = args[0];

      if (typeOf === 'number') return nodeProxy(nodes[callback]);
      if (typeOf === 'string') return nodes.filter(el => el.matches(callback));
      if (typeOf === 'function') {
        let index = -1;
        const map = Array(length);
        while (++index < length) map[index] = callback(nodeProxy(nodes[index]), index);
        return map;
      }

      return Reflect.apply(target, thisArg, args);

    }
  });

};
