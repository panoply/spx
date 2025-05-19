import { $ } from '../app/session';
import { b, h } from '../shared/native';
import { getComponents } from '../components/context';
import { morphHead } from '../morph/snapshot';
import { Nodes } from '../shared/enums';
import { isResourceTag } from '../shared/regexp';
import { unmount } from 'src/components/observe';
import { getSelectorFromElement } from 'src/shared/utils';

c.qs = null as NodeListOf<HTMLElement>;

/**
 * Checks whether or not the current document contains the provided node or not.
 * The {@link c.qs} reference will cache the querySelector for look-ups.
 */
function c (node: Node) {

  const hasResource = $.resources.has(node);

  if (c.qs === null) c.qs = b().querySelectorAll(`${$.page.target.join()},[${$.qs.$target}]`);

  const e = c.qs;
  const s = e.length;

  let i = -1;

  while (++i < s) if (e[i].contains(node)) return hasResource && false;

  return hasResource && true;

};

/**
 * Handles resource additions added to the DOM and returns a boolean
 * of `true` when node mutation is not contained within `<head>`
 */
const isNode = (type:'appendChild' | 'removeChild', node: Node) => {

  if ($.eval && isResourceTag.test(node.nodeName)) {

    node.parentNode.nodeName === 'HEAD'
      ? morphHead(type, node)
      : c(node) ? $.resources.delete(node) : $.resources.add(node);

    return false;

  }

  return true;

};

/**
 * Handles added elements of interest. Currently, only Components are
 * supported, whereas incremental additions are not yet covered.
 *
 * @todo Support Component Associates (i.e, events and nodes)
 */
const added = (nodes: NodeList, length: number) => {

  let i: number = -1;

  while (++i < length) {

    const node = nodes[i];

    if (node.nodeType !== Nodes.ELEMENT_NODE) continue;

    if (isNode('appendChild', node) && node instanceof HTMLElement) {

      if (node.hasAttribute($.qs.$component)) {
        getComponents(node, getSelectorFromElement(node.parentElement));
      }
    }
  }
};

/**
 * Handles a removed mounted component. This is not yet tested and
 * likely needs work.
 *
 * @todo Support Component Associates (i.e, events and nodes)
 */
const remove = (nodes: NodeList, length: number) => {

  let i: number = -1;

  while (++i < length) {

    const node = nodes[i];

    if (node.nodeType !== Nodes.ELEMENT_NODE) continue;

    if (isNode('removeChild', node) && node instanceof HTMLElement) {

      const ref = node.getAttribute($.qs.$ref);

      if (node.getAttribute($.qs.$ref)) {

        unmount(node, ref.split(','));

      }
    }
  }
};

const resources = new MutationObserver(([ mutation ]: MutationRecord[]) => {

  if (mutation.type !== 'childList') return;

  const isAdded = mutation.addedNodes.length;
  const isRemove = mutation.removedNodes.length;

  if (isAdded === 0 && isRemove === 0) return;
  if (isAdded > 0) added(mutation.addedNodes, isAdded);
  if (isRemove > 0) remove(mutation.removedNodes, isRemove);

});

export const connect = () => {

  if ($.observe.mutations) return;

  resources.observe(h(), { childList: true });
  resources.observe(b(), { childList: true, subtree: true });

  $.observe.mutations = true;

};

export const disconnect = () => {

  if (!$.observe.mutations) return;

  resources.takeRecords();
  resources.disconnect();

  for (const node of $.resources) {
    b().removeChild(node);
    $.resources.delete(node);
  }

  c.qs = null;
  $.observe.mutations = false;
};
