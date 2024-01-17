import { defineGetter, forEach, hasProp, hasProps, downcase } from '../shared/utils';
import { $ } from '../app/session';

/**
 * Register Components
 *
 * Component registar, exposed on the global level, assigns each
 * component caller.
 */
export function register (...components: any[]) {

  const has = hasProps($.components.registar);
  const define = defineGetter($.components.registar);

  forEach((Instance) => {

    if (!hasProp(Instance, 'id')) {
      Instance.id = downcase(Instance.prototype.constructor.name);
    }

    if (!has(Instance.id)) {
      define(Instance.id, Instance);
    }

  }, components);

}

export function registerOnConnect (components: { [identifier: string]: any }) {

  const has = hasProps($.components.registar);
  const define = defineGetter($.components.registar);

  for (const id in components) {
    const Instance = components[id];
    if (!hasProp(Instance, 'id')) Instance.id = downcase(id);
    if (!has(Instance.id)) define(Instance.id, Instance);
  }

}
