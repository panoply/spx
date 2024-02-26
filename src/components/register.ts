import { camelCase, downcase, hasProp, hasProps } from '../shared/utils';
import { $ } from '../app/session';
import { Errors } from '../shared/enums';
import { IComponentRegister } from '../types/components';
import { log } from '../shared/logs';

export function getComponentIdentifier (instance: IComponentRegister & { name?: string }, identifier?: string) {

  const { name } = instance;
  const original = identifier;

  if (!identifier) {
    identifier = downcase(instance.name);
  }

  if (!hasProp(instance, 'connect')) {
    instance.connect = {
      id: identifier,
      state: {},
      nodes: []
    };
  }

  const has = hasProps(instance.connect);

  if (!has('state')) {
    instance.connect.state = {};
  }

  if (!has('nodes')) {
    instance.connect.nodes = [];
  }

  if (!has('id')) {
    instance.connect.id = identifier;
  }

  if (identifier !== instance.connect.id) {
    identifier = camelCase(instance.connect.id);
  }

  if (name !== original && /^[A-Z]|[_-]/.test(instance.connect.id)) {
    log(Errors.WARN, [
      `Component identifer name "${instance.connect.id}" must use camelCase format.`,
      `The identifer has been converted to "${identifier}"`
    ]);
  }

  return identifier;

}

/**
 * Register Components
 *
 * Component registar, exposed on the global level, assigns each component caller.
 */
export function registerComponents (components: { [component: string]: IComponentRegister }) {

  const { registry } = $.components;

  for (const id in components) {

    const instance = components[id];
    const identifier = getComponentIdentifier(instance, id);

    if (!registry.has(identifier)) {
      registry.set(identifier, instance);
      log(Errors.TRACE, `${id} component registered under: ${identifier}`);
    }

  }

}
