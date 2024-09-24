import type { Class } from 'types';
import type { Context } from './context';
import { $ } from '../app/session';
import { Colors, Hooks, HookStatus, Log, Nodes, Refs } from '../shared/enums';
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

const connect = (node: HTMLElement, refs: string[]) => {

  for (const id of refs) {

    if (!$.components.$reference[id]) continue;

    const instance: Class = $.components.$reference[id];
    const ref = id.charCodeAt(0);

    if (ref === Refs.COMPONENT) {

      $.components.$mounted.add(instance.scope.key);

      console.log(node);
      instance.dom = node;
      instance.scope.status = Hooks.MOUNT;

      log(Log.VERBOSE, `Component ${instance.scope.define.name} mounted: ${instance.scope.key}`, Colors.GREEN);

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

    if (!$.components.$reference[id]) continue;

    const instance: Class = $.components.$reference[id];
    const ref = id.charCodeAt(0);

    if (ref === Refs.COMPONENT) {

      instance.scope.hooks.unmount === HookStatus.DEFINED && instance.unmount(hargs());

      $.components.$mounted.delete(instance.scope.key);

      if (instance.scope.define.merge) {

        instance.scope.snapshot = curNode.innerHTML;
        log(Log.VERBOSE, `Component ${instance.scope.define.name} snapshot: ${instance.scope.key}`, Colors.GRAY);

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

      log(Log.VERBOSE, `Component ${instance.scope.define.name} unmounted: ${instance.scope.key}`, Colors.PURPLE);

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

      context ? context.$morph = node : context = getContext(node);

      walkNode(node, context);
    }

  }
};

export const readNode = (newNode: HTMLElement) => {

  context ? context.$morph = newNode : context = getContext(newNode);

  walkNode(newNode, context, false);

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

    context ? context.$morph = curNode : context = getContext(curNode, newNode);

    if (cRef && !nRef) unmount(curNode, cRef);

    if (isDirective(newNode.attributes)) walkNode(curNode, context);

  }
};
