import { IScope } from '../types/components';
import { m, o } from '../shared/native';
import { log, uuid } from '../shared/utils';
import { $ } from '../app/session';
import { Errors } from '../shared/enums';

/**
 * Set Scope
 *
 * Generates Component Scope reference from which we will use when binding
 * to component instances.
 */
export function setScope (identifier: string, domNode: HTMLElement = null): IScope {

  const scope: IScope = o();
  const id = (domNode && domNode.id) || uuid();

  if (domNode !== null) {

    if ($.components.scopes.has(id)) {
      log(Errors.WARN, `Component identifier already exists for id: ${domNode.id}`);
    }

    scope.key = id;

  } else {
    scope.key = null;
  }

  scope.domNode = domNode;
  scope.instanceOf = identifier;
  scope.listeners = m();
  scope.nodes = m();
  scope.domState = o();

  return scope;

}

/**
 * Get Scope
 *
 * We are walking TOP > DOWN, which means we can refer to last known scope record
 * created in cases where we have nested components.
 */
export function getScope (scopes: IScope[]) {

  return scopes[scopes.length - 1];

}
