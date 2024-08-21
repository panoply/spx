import type { Class } from 'types';
import type { Context } from './context';
import { $ } from '../app/session';
import { Colors, Hooks, Log, Nodes, Refs } from '../shared/enums';
import { getContext, walkNode, isDirective } from './context';
import { addEvent, removeEvent } from './listeners';
import { log } from '../shared/logs';
import { onNextTick } from '../shared/utils';
import { s } from '../shared/native';
import { hargs } from '../observe/components';

/**
 * Context Model
 *
 * Contructed when nodes are traversed pertaining to components.
 */
export let context: Context;

/**
 * Mark References
 *
 * This holds `id=""` values fo
 */
export const mark: Set<string> = s();

/**
 * Context Reset
 *
 * Sets the `content` reference to `undefined` outside the event loop.
 */
export const resetContext = () => onNextTick(() => (context = undefined));

function onmount (node: HTMLElement, refs: string[]) {

  const { $reference, $connected, $elements } = $.components;

  for (const id of refs) {

    if (!$reference[id]) continue;

    const instance: Class = $reference[id];
    const ref = id.charCodeAt(0);

    if (ref === Refs.COMPONENT) {

      $connected.add(instance.scope.key);
      $elements.set(instance.scope.root, node);

      instance.scope.status = Hooks.MOUNT;

      log(Log.VERBOSE, `Component ${instance.scope.define.id} mounted: ${instance.scope.key}`, Colors.GREEN);

    } else if (ref === Refs.EVENT) {

      addEvent(instance, node, instance.scope.events[id]);

    } else if (ref === Refs.NODE) {

      $elements.set(instance.scope.nodes[id].dom, node);
      instance.scope.nodes[id].status = 'mounted';

    } else if (ref === Refs.BINDING) {

      for (const k in instance.scope.binds) {
        if (id in instance.scope.binds[k]) {

          node.innerText = instance.scope.binds[k][id].value;
          $elements.set(instance.scope.binds[k][id].dom, node);
          instance.scope.binds[k][id].status = 'unmounted';
          break;

        }
      }
    }
  }

}

function unmount (curNode: HTMLElement, refs: string[], newNode?: HTMLElement) {

  const { $reference, $elements, $connected } = $.components;

  for (const id of refs) {

    if (!$reference[id]) continue;

    const instance: Class = $reference[id];
    const ref = id.charCodeAt(0);

    if (ref === Refs.COMPONENT) {

      !instance.scope.hasUnmount || instance.unmount(hargs());

      $connected.delete(id);
      $elements.delete(instance.scope.root);

      if (instance.scope.define.merge) {

        instance.scope.snapshot = curNode.innerHTML;
        log(Log.VERBOSE, `Component ${instance.scope.define.id} snapshot: ${instance.scope.key}`, Colors.GRAY);

      }

      for (const k in instance.scope.nodes) {
        $elements.delete(instance.scope.nodes[k].dom);
        instance.scope.nodes[k].status = 'unmounted';
      }

      for (const k in instance.scope.binds) {
        for (const uuid in instance.scope.binds[k]) {
          $elements.delete(instance.scope.binds[k][uuid].dom);
          instance.scope.binds[k][uuid].status = 'unmounted';
        }
      }

      for (const key in instance.scope.events) {
        removeEvent(instance, instance.scope.events[key]);
      }

      instance.scope.status = Hooks.UNMOUNTED;

      log(Log.VERBOSE, `Component ${instance.scope.define.id} unmounted: ${instance.scope.key}`, Colors.PURPLE);

    } else if (ref === Refs.EVENT) {

      removeEvent(instance, instance.scope.events[id]);

    } else if (ref === Refs.NODE) {

      $elements.delete(instance.scope.nodes[id].dom);
      instance.scope.nodes[id].status = 'unmounted';

    } else if (ref === Refs.BINDING) {

      for (const k in instance.scope.binds) {
        if (id in instance.scope.binds[k]) {

          $elements.delete(instance.scope.binds[k][id].dom);
          instance.scope.binds[k][id].status = 'unmounted';

          break;
        }
      }
    }
  }

}

export function removeNode (node: HTMLElement) {

  if (node.nodeType !== Nodes.ELEMENT_NODE && node.nodeType !== Nodes.FRAGMENT_NODE) return;

  const attrs = node.getAttribute($.qs.$ref);
  attrs && unmount(node, attrs.split(','));

}

export function addedNode (node: HTMLElement) {

  const attrs = node.getAttribute($.qs.$ref);

  if (attrs) {

    onmount(node, attrs.split(','));

  } else {

    if (isDirective(node.attributes)) {
      context ? context.$morph = node : context = getContext(node);
      walkNode(node, context);
    }

  }
}

export function updateNode (curNode: HTMLElement, newNode: HTMLElement, cRef: any, nRef: any) {

  if (cRef) cRef = cRef.split(',');
  if (nRef) nRef = nRef.split(',');

  if (cRef && nRef) {

    unmount(curNode, cRef);
    onmount(curNode, nRef);

  } else if (!cRef && nRef) {

    onmount(curNode, nRef);

  } else {

    context ? context.$morph = curNode : context = getContext(curNode, newNode);
    cRef && !nRef && unmount(curNode, cRef, newNode);

    isDirective(newNode.attributes) && walkNode(curNode, context);

  }
}
