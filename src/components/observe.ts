import { $ } from '../app/session';
import { snapshot } from '../app/store';
import { Nodes, Refs } from '../shared/enums';
import { assign } from '../shared/native';
import { getSelector, hasProp } from '../shared/utils';
import { addEvent, removeEvent } from './listeners';

export const observer = new MutationObserver(function (mutatation) {

  console.log(mutatation);

});

export function observeNode (node: HTMLElement) {

  observer.observe(node, { attributes: true, childList: true, subtree: true });

  return node;

}

export function removeNode (node: HTMLElement) {

  observer.disconnect();

}

/**
 * Removes Component
 *
 * Morph hook for disconnecting a component from the DOM.
 * Removed listeners and invokes the `onExit()` callback.
 */
export function removeComponent (node: HTMLElement) {

  if (node.nodeType !== Nodes.ELEMENT_NODE) return;
  if (!node.dataset.spx) return;
  if ($.components.connected.has(node)) $.components.connected.delete(node);

  const refs = node.dataset.spx.split(',');

  for (let i = 0, s = refs.length; i < s; i++) {

    const uuid = refs[i];

    if (
      !hasProp($.components.refs, uuid) ||
      !hasProp($.components.instances, $.components.refs[uuid])) {
      continue;
    }

    const ref = uuid.charCodeAt(0);
    const { instance, scope } = $.components.instances[$.components.refs[uuid]];

    if (ref === Refs.COMPONENT) {

      if (hasProp(instance, 'onExit')) instance.onExit();

    } else if (ref === Refs.BINDING && scope.binds[uuid].persist) {

      snapshot($.page.rev, getSelector(node.nodeName, node.dataset.spx), node);

    } else if (ref === Refs.EVENT) {

      scope.events[uuid].attached = removeEvent(instance, scope.events[uuid]);

    }

  }
}

/**
 * Add Component
 *
 * Morph hook for connecting a component in the DOM. Components
 * matched here already have an instance applied.
 */
export function addComponent (node: HTMLElement) {

  if (!node.dataset.spx) return;

  const refs = node.dataset.spx.split(',');

  for (let i = 0, s = refs.length; i < s; i++) {

    const uuid = refs[i];

    if (
      !hasProp($.components.refs, uuid) ||
      !hasProp($.components.instances, $.components.refs[uuid])) {
      continue;
    }

    const { instance, scope } = $.components.instances[$.components.refs[uuid]];
    const ref = uuid.charCodeAt(0);

    if (ref === Refs.COMPONENT) {

      instance.dom = node;

      assign(instance.state, scope.state);

    } else if (ref === Refs.NODE) {

      instance[scope.nodes[uuid].schema][scope.nodes[uuid].index] = node;

      if (scope.nodes[uuid].index === 0) {
        instance[scope.nodes[uuid].schema.slice(0, -1)] = node;
      }

    } else if (ref === Refs.EVENT) {

      const event = scope.events[uuid];

      instance[event.schema][event.index] = node;

      if (event.index === 0) {
        instance[event.schema.slice(0, -1)] = node;
      }

      event.attached = addEvent(instance, event);

    } else if (ref === Refs.BINDING) {

      instance[scope.binds[uuid].schema][scope.binds[uuid].index] = node;

      if (scope.binds[uuid].index === 0) {
        instance[scope.binds[uuid].schema.slice(0, -1)] = node;
      }

    }
  }

}
