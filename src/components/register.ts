import type { ComponentRegister, Merge } from 'types';
import { $ } from '../app/session';
import { camelCase, downcase } from '../shared/utils';
import { Colors, LogType } from '../shared/enums';
import { log } from '../shared/logs';
import { assign } from '../shared/native';

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
 * will align identifiers and assign missing `static define` references.
 *
 * The `identifer` parameter is optional here, when `undefined` we will obtain
 * id reference from either the instance `static connect` or the component class name.
 */
export function getComponentId (instance: Register, identifier?: string) {

  const name = instance.name;
  const original = identifier;

  identifier = downcase(identifier || name);

  instance.define = assign({
    id: identifier,
    merge: false,
    state: {},
    nodes: []
  }, instance.define);

  if (identifier !== instance.define.id) identifier = camelCase(instance.define.id);

  if (name !== original && /^[A-Z]|[_-]/.test(instance.define.id)) {
    log(LogType.WARN, [
      `Component identifer id "${instance.define.id}" must use camelCase format.`,
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
      log(
        LogType.VERBOSE,
        `Component ${instance.name} registered using id: ${identifier}`,
        Colors.PINK
      );
    }
  }

  if (!$.config.components) $.config.components = true;

}
