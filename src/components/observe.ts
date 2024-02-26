import { $ } from '../app/session';
import { Errors, Nodes, Refs } from '../shared/enums';
import { Context, getContext, walkNode, isDirective, setRefs } from './context';
import { addEvent, removeEvent } from './listeners';
import { log } from '../shared/logs';
import { onNextTick } from '../shared/utils';
import { SPX } from '../types/components';

export let context: Context;

export function resetContext () {

  onNextTick(() => { context = undefined; });

}

function disconnect (curNode: HTMLElement, refs: string[], newNode?: HTMLElement) {

  const { reference, connected, elements } = $.components;

  for (const id of refs) {

    const instance: SPX.Class = reference[id];

    if (!instance) continue;

    const ref = id.charCodeAt(0);

    if (ref === Refs.COMPONENT) {

      instance.scope.mounted = false;
      connected.delete(instance.scope.key);
      elements.delete(instance.scope.el);

      for (const key in instance.scope.nodes) {
        elements.delete(instance.scope.nodes[key].el);
      }

      for (const key in instance.scope.binds) {
        elements.delete(instance.scope.binds[key].el);
      }

      for (const key in instance.scope.events) {
        removeEvent(instance, instance.scope.events[key]);
      }

      log(Errors.TRACE, `Unmounted component ${instance.static.id} (${instance.scope.key})`, '#8f5150');

    } else if (ref === Refs.EVENT) {

      removeEvent(instance, instance.scope.events[id]);

    } else if (ref === Refs.NODE || ref === Refs.BINDING) {

      const node = instance.scope[ref === Refs.BINDING ? 'binds' : 'nodes'][id];

      if (newNode && curNode.isEqualNode(newNode)) {

        setRefs(curNode, instance.scope.key, id);

        elements.set(node.el, curNode);

        context.$nodes.push(node.el);

      } else {

        elements.delete(node.el);

      }

    }
  }

}

function connect (node: HTMLElement, refs: string[]) {

  const { reference, connected, elements } = $.components;

  for (const id of refs) {

    const instance = reference[id];

    if (!instance) continue;

    const ref = id.charCodeAt(0);

    if (ref === Refs.COMPONENT) {

      connected.add(instance.scope.key);
      elements.set(instance.scope.el, node);
      instance.scope.mounted = true;

      log(Errors.TRACE, `Mounted component ${instance.static.id} (${instance.scope.key})`, '#6dd093');

    } else if (ref === Refs.EVENT) {

      addEvent(instance, node, instance.scope.events[id]);

    } else if (ref === Refs.NODE) {

      elements.set(instance.scope.nodes[id].el, node);

    } else if (ref === Refs.BINDING) {

      elements.set(instance.scope.binds[id].el, node);

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
      context = getContext(newNode);
    } else {
      context.$morph = newNode;
    }

    if (cRef && !nRef) {
      disconnect(curNode, cRef, newNode);
      if (curNode.hasAttribute($.qs.$ref)) return;
    }

    walkNode(curNode, context);
  }
}
