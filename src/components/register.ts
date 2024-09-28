import type { ComponentRegister, Merge } from 'types';
import { $ } from '../app/session';
import { camelCase, downcase } from '../shared/utils';
import * as log from '../shared/logs';
import { ComponentNameCheck } from '../shared/regexp';

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
export const getComponentId = (instance: Register, identifier?: string) => {

  if (instance.define.name !== '') return instance.define.name;

  const name = instance.name;
  const original = identifier;
  const hasName = 'define' in instance && 'name' in instance.define;

  console.log(instance.name, identifier);

  instance.define.name = downcase(identifier || name);

  if (identifier !== instance.define.name) identifier = camelCase(instance.define.name);

  if (hasName && name !== original && ComponentNameCheck.test(instance.define.name)) {
    log.warn(`Component name "${instance.define.name}" is invalid and converted to: ${identifier}`);
  }

  return identifier;

};

/**
 * Register Components
 *
 * Component registration. This function assigns each component caller within the
 * `$.components.register` Map store. The `isValidID` parameter will determine whether
 * or not we should call `getComponentId()` to obtain identifier. When `isValidID` is `true`
 * it signals that component was registered via `spx.register()` method and analysis has
 * already taken place,
 */
export const registerComponents = (components: { [id: string]: Register }, isValidID = false) => {

  for (const id in components) {

    const instance = components[id];
    const identifier = isValidID ? id : getComponentId(instance, id);

    if (!$.registry.has(identifier)) {

      $.registry.set(identifier, instance);

      log.debug(`Component ${instance.name} registered using id: ${identifier}`);

    }
  }

  if (!$.config.components) {

    $.config.components = true;

  }
};
