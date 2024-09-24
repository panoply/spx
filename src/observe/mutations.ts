import { $ } from '../app/session';
import { b } from '../shared/native';
import { getComponents } from '../components/context';
import { morphHead } from '../morph/snapshot';
import { Nodes } from '../shared/enums';
import { isResourceTag } from '../shared/regexp';
import { unmount } from 'src/components/observe';

const outsideTarget = (node: Node) => {

  const targets = b().querySelectorAll(`${$.page.target.join()},[${$.qs.$target}]`);

  for (let i = 0, s = targets.length; i < s; i++) {

    if (targets[i].contains(node)) return false;

  }

  return true;

};

const resources = new MutationObserver(([ mutation ]: MutationRecord[]) => {

  if (mutation.type !== 'childList') return;
  if (mutation.addedNodes.length === 0 && mutation.removedNodes.length === 0) return;

  const isAdded = mutation.addedNodes.length;
  const node = isAdded ? mutation.addedNodes[0] : mutation.removedNodes[0];

  if (node.nodeType !== Nodes.ELEMENT_NODE) return;

  if ($.eval && isResourceTag.test(node.nodeName)) {

    if (node.parentNode.nodeName === 'HEAD') {

      isAdded ? morphHead('appendChild', node) : morphHead('removeChild', node);

    } else {

      (outsideTarget(node) && $.resources.has(node))
        ? $.resources.delete(node)
        : $.resources.add(node);

    }

  } else if (node instanceof HTMLElement) {

    const ref = node.getAttribute($.qs.$ref);

    if (isAdded && ref === null) {

      getComponents(node);

    } else if (ref) {

      unmount(node, ref.split(','));

    }

  }

});

export const connect = () => {

  if ($.observe.mutations) return;

  resources.observe(document.head, { childList: true });
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

  $.observe.mutations = false;
};
