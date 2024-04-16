import type { Page } from 'types';
import { $ } from '../app/session';
import { getSnapDom, patchPage, setSnap } from '../app/queries';
import { VisitType } from '../shared/enums';
import { d } from '../shared/native';
import { forNode, onNextTick, uuid } from '../shared/utils';

/**
 * Connect Fragments
 *
 * Updates the session `$.fragments` references. The `$.page.fragments` will hold identifers
 * and its here were we obtain the elements for each identifier.
 */
export function connect () {

  const fragments = [];

  for (const id of $.page.fragments) {
    const element = document.getElementById(id);
    if (element) {
      $.fragments.set(id, element);
      fragments.push(id);
    } else {
      $.fragments.delete(id);
    }
  }

  patchPage('fragments', fragments);

}

/**
 * Snapshot Fragments
 *
 * Checks snapshots outside the event loop for fragment targets
 * and marks them accordingly.
 */
export function snapshots (page: Page) {

  if (page.type !== VisitType.VISIT) {

    onNextTick(() => {

      const snapDom = getSnapDom(page.snap);
      const selector = page.selector !== 'body' && page.selector !== null
        ? `${$.qs.$targets}`
        : $.qs.$targets;

      const targets = snapDom.body.querySelectorAll<HTMLElement>(selector);
      const domNode = page.type === VisitType.INITIAL
        ? d().querySelectorAll<HTMLElement>(selector)
        : null;

      // console.log(targets, domNode);

      forNode(targets, (node, index) => {

        // SKIP <a href></a> ELEMENTS
        // NOTE: Added during slotenmaker build, might break something, check at later time
        if (node.nodeName === 'A') return;
        if (contains(node)) return;

        if (!node.hasAttribute('id')) {

          node.setAttribute('id', `t.${uuid()}`);

          if (domNode !== null) {
            domNode[index].setAttribute('id', `t.${uuid()}`);
          }

        } else {

          if (node.id.startsWith('t.')) return;

        }

        page.fragments.push(node.id);

      });

      setSnap(snapDom.documentElement.outerHTML, page.snap);

    });

  }
}

/**
 * Node is contained in Fragment
 *
 * Checks whether or not the provided node is a child of a fragment
 * or the fragment itself
 */
export function contains (node: HTMLElement) {

  for (const [ id, fragment ] of $.fragments) {
    if (id === node.id) return true;
    if (fragment.contains(node)) return true;
  }

  return false;

}
