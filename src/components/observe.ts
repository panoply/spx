import type { Class } from 'types';
import { $, ctx } from '../app/session';
import { Hooks, HookStatus, Nodes, Refs, Colors } from '../shared/enums';
import { getContext, walkNode, isDirective } from './context';
import { addEvent, removeEvent } from './listeners';
import * as log from '../shared/logs';
import { onNextTick } from '../shared/utils';
import { hargs } from '../observe/components';

/**
 * Context Reset
 *
 * Sets the `content` reference to `undefined` outside the event loop.
 */
export const resetContext = () => onNextTick(() => (ctx.store = undefined));

const connect = (node: HTMLElement, refs: string[]) => {

  for (const id of refs) {

    if (!$.maps[id]) continue;

    const instance: Class = $.maps[id];
    const ref = id.charCodeAt(0);

    if (ref === Refs.COMPONENT) {

      $.mounted.add(instance.scope.key);

      instance.scope.dom = node;
      instance.scope.status = Hooks.MOUNT;

      log.debug(`Component ${instance.scope.define.name} mounted: ${instance.scope.key}`, Colors.GREEN);

    } else if (ref === Refs.EVENT) {

      addEvent(instance, instance.scope.events[id], node);

    } else if (ref === Refs.NODE) {

      // $elements.set(instance.scope.nodes[id].dom, node);
      for (const k in instance.scope.nodes) {
        ++instance.scope.nodes[k].live;
      }

    } else if (ref === Refs.BINDING) {

      for (const k in instance.scope.binds) {
        if (id in instance.scope.binds[k]) {
          node.innerText = instance.scope.binds[k][id].value;
          instance.scope.binds[k][id].live = true;
          break;
        }
      }
    }
  }

};

export const unmount = (curNode: HTMLElement, refs: string[]) => {

  for (const id of refs) {

    if (!$.maps[id]) continue;

    const instance: Class = $.maps[id];
    const ref = id.charCodeAt(0);

    if (ref === Refs.COMPONENT) {

      instance.scope.hooks.unmount === HookStatus.DEFINED && instance.unmount(hargs());

      $.mounted.delete(instance.scope.key);

      if (instance.scope.define.merge) {

        instance.scope.snapshot = curNode.innerHTML;
        log.debug(`Component ${instance.scope.define.name} snapshot: ${instance.scope.key}`);

      }

      for (const k in instance.scope.nodes) {
        instance.scope.nodes[k].live = 0;
      }

      for (const k in instance.scope.binds) {
        for (const uuid in instance.scope.binds[k]) {
          instance.scope.binds[k][uuid].live = false;
        }
      }

      for (const key in instance.scope.events) {
        removeEvent(instance, instance.scope.events[key]);
      }

      instance.scope.status = Hooks.UNMOUNTED;

      log.debug(`Component ${instance.scope.define.name} unmounted: ${instance.scope.key}`, Colors.ORANGE);

    } else if (ref === Refs.EVENT) {

      removeEvent(instance, instance.scope.events[id]);

    } else if (ref === Refs.NODE) {

      for (const k in instance.scope.nodes) {
        --instance.scope.nodes[k].live;
      }

    } else if (ref === Refs.BINDING) {

      for (const k in instance.scope.binds) {
        if (id in instance.scope.binds[k]) {
          instance.scope.binds[k][id].live = false;
          break;
        }
      }
    }
  }

};

export const removeNode = (node: HTMLElement) => {

  if (node.nodeType !== Nodes.ELEMENT_NODE && node.nodeType !== Nodes.FRAGMENT_NODE) return;

  const attrs = node.getAttribute($.qs.$ref);
  attrs && unmount(node, attrs.split(','));

};

export const addedNode = (node: HTMLElement) => {

  const attrs = node.getAttribute($.qs.$ref);

  if (attrs) {

    connect(node, attrs.split(','));

  } else {

    if (isDirective(node.attributes)) {
      ctx.store ? ctx.store.$morph = node : ctx.store = getContext(node);
      walkNode(node, ctx.store);
    }

  }
};

export const readNode = (newNode: HTMLElement) => {

  ctx.store ? ctx.store.$morph = newNode : ctx.store = getContext(newNode);

  walkNode(newNode, ctx.store, false);

};

export const updateNode = (curNode: HTMLElement, newNode: HTMLElement, cRef: any, nRef: any) => {

  if (cRef) cRef = cRef.split(',');
  if (nRef) nRef = nRef.split(',');

  if (cRef && nRef) {

    unmount(curNode, cRef);
    connect(curNode, nRef);

  } else if (!cRef && nRef) {

    connect(curNode, nRef);

  } else {

    ctx.store ? ctx.store.$morph = curNode : ctx.store = getContext(newNode);

    if (cRef && !nRef) unmount(curNode, cRef);

    if (isDirective(newNode.attributes)) walkNode(curNode, ctx.store);

  }
};
