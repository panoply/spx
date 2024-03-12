import type { SPX } from 'types';
import type { Context } from './context';
import { $ } from '../app/session';
import { Colors, LogType, Nodes, Refs } from '../shared/enums';
import { getContext, walkNode, isDirective, setRefs } from './context';
import { addEvent, removeEvent } from './listeners';
import { log } from '../shared/logs';
import { onNextTick } from '../shared/utils';

export let context: Context;

export function resetContext () {

  onNextTick(() => { context = undefined; });

}

function connect (node: HTMLElement, refs: string[]) {

  const {
    $reference,
    $connected,
    $elements
  } = $.components;

  for (const id of refs) {

    const instance: SPX.Class = $reference[id];

    if (!instance) continue;

    const ref = id.charCodeAt(0);

    if (ref === Refs.COMPONENT) {

      $connected.add(instance.scope.key);
      $elements.set(instance.scope.dom, node);

      instance.scope.mounted = true;

      log(LogType.VERBOSE, `Component ${instance.scope.static.id} mounted: ${instance.scope.key}`, Colors.GREEN);

    } else if (ref === Refs.EVENT) {

      addEvent(instance, node, instance.scope.events[id]);

    } else if (ref === Refs.NODE) {

      $elements.set(instance.scope.nodes[id].dom, node);

    } else if (ref === Refs.BINDING) {

      const { binds } = instance.scope;

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

  const { $reference, $connected, $elements } = $.components;

  for (const id of refs) {

    const instance: SPX.Class = $reference[id];

    if (!instance) continue;

    const ref = id.charCodeAt(0);

    if (ref === Refs.COMPONENT) {

      instance.scope.mounted = false;
      $connected.delete(instance.scope.key);
      $elements.delete(instance.scope.dom);

      const { scope } = instance;

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

      log(LogType.VERBOSE, `Component ${instance.scope.static.id} unmounted: ${instance.scope.key}`, Colors.PURPLE);

    } else if (ref === Refs.EVENT) {

      removeEvent(instance, instance.scope.events[id]);

    } else if (ref === Refs.NODE) {

      const node = instance.scope.nodes[id];

      $elements.delete(node.dom);

      if (newNode && curNode.isEqualNode(newNode)) {
        setRefs(curNode, instance.scope.key, id);
        context.$nodes.push(node.dom);
      }

    } else if (ref === Refs.BINDING) {

      const { binds } = instance.scope;

      for (const key in binds) {

        if (id in binds[key]) {

          $elements.delete(binds[key][id].dom);

          if (newNode && curNode.isEqualNode(newNode)) {
            setRefs(curNode, instance.scope.key, id);
            context.$nodes.push(binds[key][id].dom);
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

    disconnect(
      node,
      node.getAttribute($.qs.$ref).split(',')
    );
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
    if (cRef && !nRef) {
      disconnect(curNode, cRef, newNode);
    }

    if (isDirective(newNode.attributes)) walkNode(curNode, context);

  }
}
