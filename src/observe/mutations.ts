import { $ } from '../app/session';
import { b } from '../shared/native';
import { getComponents } from '../components/context';
import { morphHead } from '../morph/snapshot';
import { Nodes } from '../shared/enums';
import { isResourceTag } from '../shared/regexp';

const nodeOutsideTarget = (node: Node) => {

  const targets = b().querySelectorAll(`${$.page.target.join(',')},[${$.qs.$target}]`);

  for (let i = 0, s = targets.length; i < s; i++) {
    if (targets[i].contains(node)) return false;
  }

  return true;

};

const resources = new MutationObserver(function ([ mutation ]: MutationRecord[]) {

  if (mutation.type !== 'childList') return;

  const isAdded = mutation.addedNodes.length;

  if (isAdded || mutation.removedNodes.length > 0) {

    const node = isAdded ? mutation.addedNodes[0] : mutation.removedNodes[0];

    if (node.nodeType !== Nodes.ELEMENT_NODE) return;

    if ($.eval && isResourceTag.test(node.nodeName)) {
      if (node.parentNode.nodeName === 'HEAD') {
        if (isAdded) {
          morphHead('appendChild', node);
        } else {
          morphHead('removeChild', node);
        }
      } else {
        if (nodeOutsideTarget(node) && !$.resources.has(node)) {
          $.resources.add(node);
        } else {
          $.resources.delete(node);
        }
      }
    } else if (node instanceof HTMLElement) {
      if (isAdded && !node.hasAttribute($.qs.$ref)) {
        getComponents(node);
      }
    }

  }

});

export const connect = () => {

  if (!$.observe.mutations) return;

  resources.observe(document.head, {
    childList: true
  });

  resources.observe(b(), {
    childList: true,
    subtree: true
  });

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

  $.observe.mutations = false;
};
