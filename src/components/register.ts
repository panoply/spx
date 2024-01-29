import { defineGetter, hasProp, log } from '../shared/utils';
import { $ } from '../app/session';
import { Errors } from '../shared/enums';
import { IComponentRegister } from '../types/components';

/**
 * Register Components
 *
 * Component registar, exposed on the global level, assigns each component caller.
 */
export function register (components: { [component: string]: IComponentRegister }) {

  for (const id in components) {

    const instance = components[id];
    const identifier = id.toLowerCase();

    if (!hasProp(instance, 'connect')) instance.connect = { state: {}, nodes: [] };
    if (!hasProp(instance.connect, 'state')) instance.connect.state = {};
    if (!hasProp(instance.connect, 'nodes')) instance.connect.nodes = [];

    if (!hasProp($.components.registry, identifier)) {
      defineGetter($.components.registry, identifier, instance);
      log(Errors.TRACE, `${id} component registered under: ${identifier}`);
    }

  }

}
