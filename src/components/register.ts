import { camelCase, downcase, hasProp, hasProps } from '../shared/utils';
import { $ } from '../app/session';
import { Colors, LogType } from '../shared/enums';
import { ComponentRegister } from '../types/components';
import { log } from '../shared/logs';
import { Merge } from 'type-fest';

type Register = Merge<ComponentRegister, {
  /**
   * Component class name
   */
  name?: string
}>

/**
 * Normalize Component
 *
 * Ensures that component identifiers and internal logic has been correctly
 * composed into a format the SPX can understand. Specifically, this function
 * will align identifiers and assign missing `static connect` references.
 *
 * The `identifer` parameter is optional here, when `undefined` we will obtain
 * id reference from either the instance `static connect` or the component class name.
 */
export function getComponentId (instance: Register, identifier?: string) {

  const name = instance.name;
  const original = identifier;

  identifier = downcase(identifier || name);

  if (!hasProp(instance, 'connect')) {
    instance.connect = { id: identifier, state: {}, nodes: [] };
  }

  const has = hasProps(instance.connect);

  if (!has('state')) instance.connect.state = {};
  if (!has('nodes')) instance.connect.nodes = [];
  if (!has('id')) instance.connect.id = identifier;
  if (identifier !== instance.connect.id) {
    identifier = camelCase(instance.connect.id);
  }

  if (name !== original && /^[A-Z]|[_-]/.test(instance.connect.id)) {
    log(LogType.WARN, [
      `Component identifer name "${instance.connect.id}" must use camelCase format.`,
      `The identifer has been converted to "${identifier}"`
    ]);
  }

  return identifier;

}

/**
 * Register Components
 *
 * Component registration. This function assigns each component caller within the
 * `$.components.register` Map store. The `isValidID` parameter will determine whether
 * or not we should call `getComponentId()` to obtain identifier. When `isValidID` is `true`
 * it signals that component was registered via `spx.register()` method and analysis has
 * already taken place,
 */
export function registerComponents (components: { [id: string]: Register }, isValidID = false) {

  const { $registry } = $.components;

  for (const id in components) {
    const instance = components[id];
    const identifier = isValidID ? id : getComponentId(instance, id);
    if (!$registry.has(identifier)) {
      $registry.set(identifier, instance);
      log(LogType.VERBOSE, `Component ${instance.name} registered using id: ${identifier}`, Colors.PINK);
    }
  }

  if (!$.config.components) $.config.components = true;

}
