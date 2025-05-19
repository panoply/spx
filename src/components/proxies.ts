import type { Class, ValueOf } from 'types';
import { $ } from '../app/session';
import { attrJSON, forNode, isEmpty, kebabCase, upcase, setStateDefaults } from '../shared/utils';
import * as log from '../shared/logs';

export const stateProxy = <T extends Class = Class>(instance: T) => {

  const { scope, view } = instance;

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
          forNode(binding[id].selector, node => (node.innerText = domValue));
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

      console.log(prop, kebabCase(prop));

      if (!view.hasAttribute(attrName)) attrName = `${prefix}:${prop}`;

      const domValue = view.getAttribute(attrName);
      const defined = domValue !== null && domValue !== ''; // whether dom state is defined

      hasProp in scope.state || Reflect.set(scope.state, hasProp, defined);

      if (typeof domValue === 'string' && domValue.startsWith('window.')) {

        const windowProp = domValue.slice(7);

        if (windowProp in window) {
          scope.state[prop] = window[windowProp];
        } else {
          log.warn(`Property does not exist on window: ${$.qs.$component}:${attrName}="${domValue}"`);
        }

      } else {

        if (Array.isArray(stateValue)) {
          scope.state[prop] = defined ? attrJSON(domValue) : stateValue;
        } else {
          const typeOf: ValueOf<typeof scope.define.state> = typeof stateValue;
          if (typeOf === 'object') {
            scope.state[prop] = defined ? attrJSON(domValue) : stateValue;
          } else if (typeOf === 'number') {
            scope.state[prop] = defined ? Number(domValue) : stateValue;
          } else if (typeOf === 'boolean') {
            scope.state[prop] = defined ? domValue === 'true' : stateValue;
          } else if (typeOf === 'string') {
            scope.state[prop] = defined ? domValue : stateValue;
          } else {
            switch (stateValue) {
              case String:
                scope.state[prop] = defined ? domValue : ''; break;
              case Boolean:
                scope.state[prop] = domValue === 'true' || false; break;
              case Number:
                scope.state[prop] = domValue ? Number(domValue) : 0; break;
              case Object:
                scope.state[prop] = defined ? attrJSON(domValue) : {}; break;
              case Array:
                scope.state[prop] = defined ? attrJSON(domValue) : []; break;
            }
          }
        }
      }
    }
  }
};
