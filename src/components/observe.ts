import type { Class } from 'types';
import type { Context } from './context';
import { $ } from '../app/session';
import { Colors, Hooks, LogType, Nodes, Refs } from '../shared/enums';
import { getContext, walkNode, isDirective, setRefs } from './context';
import { addEvent, removeEvent } from './listeners';
import { log } from '../shared/logs';
import { onNextTick } from '../shared/utils';

/**
 * Context Model
 *
 * Contructed when nodes are traversed pertaining to components.
 */
export let context: Context;

/**
 * Context Reset
 *
 * Sets the `content` reference to `undefined` outside the event loop.
 */
export function resetContext () {

  onNextTick(() => { context = undefined; });

}

function connect (node: HTMLElement, refs: string[]) {

  const { $reference, $connected, $elements } = $.components;

  for (const id of refs) {

    const instance: Class = $reference[id];

    if (!instance) continue;

    const ref = id.charCodeAt(0);
    const { scope } = instance;

    if (ref === Refs.COMPONENT) {

      $connected.add(scope.key);
      $elements.set(scope.dom, node);

      scope.mounted = Hooks.MOUNT;

      if ($.logLevel === LogType.VERBOSE) {
        log(LogType.VERBOSE, `Component ${scope.define.name} mounted: ${scope.key}`, Colors.GREEN);
      }

    } else if (ref === Refs.EVENT) {

      addEvent(instance, node, scope.events[id]);

    } else if (ref === Refs.NODE) {

      $elements.set(scope.nodes[id].dom, node);

    } else if (ref === Refs.BINDING) {

      const { binds } = scope;

      for (const key in binds) {
        if (id in binds[key]) {
          node.innerText = binds[key][id].value;
          $elements.set(binds[key][id].dom, node);
          break;
        }
      }
    }
  }

}

function disconnect (curNode: HTMLElement, refs: string[], newNode?: HTMLElement) {

  const { $reference, $elements, $connected } = $.components;

  for (const id of refs) {

    const instance: Class = $reference[id];

    if (!instance) continue;

    const ref = id.charCodeAt(0);
    const { scope } = instance;

    if (ref === Refs.COMPONENT) {

      $connected.delete(id);
      $elements.delete(instance.scope.dom);

      if (scope.define.merge) {
        scope.snapshot = curNode.outerHTML;
        log(LogType.VERBOSE, `Component ${scope.define.name} snapshot: ${scope.key}`, Colors.GRAY);
      }

      for (const key in scope.nodes) {
        $elements.delete(scope.nodes[key].dom);
      }

      for (const key in scope.binds) {
        for (const uuid in scope.binds[key]) {
          $elements.delete(scope.binds[key][uuid].dom);
        }
      }

      for (const key in scope.events) {
        removeEvent(instance, scope.events[key]);
      }

      if ($.logLevel === LogType.VERBOSE) {
        log(LogType.VERBOSE, `Component ${scope.define.name} unmounted: ${scope.key}`, Colors.PURPLE);
      }

      scope.mounted = Hooks.UNMOUNT;

    } else if (ref === Refs.EVENT) {

      removeEvent(instance, scope.events[id]);

    } else if (ref === Refs.NODE) {

      const node = scope.nodes[id];

      $elements.delete(node.dom);

      if (newNode && curNode.isEqualNode(newNode)) {
        setRefs(curNode, scope.key, id);
        context.$nodes.push(node.dom);
      }

    } else if (ref === Refs.BINDING) {

      for (const key in scope.binds) {

        if (id in scope.binds[key]) {

          $elements.delete(scope.binds[key][id].dom);

          if (newNode && curNode.isEqualNode(newNode)) {
            setRefs(curNode, scope.key, id);
            context.$nodes.push(scope.binds[key][id].dom);
          }

          break;
        }

      }
    }
  }

}

export function removeNode (node: HTMLElement) {

  if (node.nodeType !== Nodes.ELEMENT_NODE && node.nodeType !== Nodes.FRAGMENT_NODE) return;

  if (node.hasAttribute($.qs.$ref)) {
    disconnect(node, node.getAttribute($.qs.$ref).split(','));
  }

}

export function addedNode (node: HTMLElement) {

  if (node.hasAttribute($.qs.$ref)) {

    connect(node, node.getAttribute($.qs.$ref).split(','));

  } else {

    if (isDirective(node.attributes)) {

      if (!context) {
        context = getContext(node);
      } else {
        context.$morph = node;
      }

      walkNode(node, context);

    }
  }
}

export function updateNode (curNode: HTMLElement, newNode: HTMLElement, cRef: any, nRef: any) {

  if (cRef) cRef = cRef.split(',');
  if (nRef) nRef = nRef.split(',');

  if (cRef && nRef) {

    disconnect(curNode, cRef);
    connect(curNode, nRef);

  } else if (!cRef && nRef) {

    connect(curNode, nRef);

  } else {

    if (!context) {
      context = getContext(curNode);
    } else {
      context.$morph = curNode;
    }

    // We disconnect current node references
    if (cRef && !nRef) disconnect(curNode, cRef, newNode);
    if (isDirective(newNode.attributes)) walkNode(curNode, context);

  }
}
