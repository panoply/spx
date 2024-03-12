import type { Page } from 'types';
import { $ } from '../app/session';
import { getSnapDom, patchPage, setSnap } from '../app/queries';
import { VisitType } from '../shared/enums';
import { d } from '../shared/native';
import { forNode, onNextTick, uuid } from '../shared/utils';

/**
 * Connect Fragments
 *
 * Updates the session `$.fragments` record
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
        ? `${page.target.join()},${$.qs.$targets}`
        : $.qs.$targets;

      const targets = snapDom.body.querySelectorAll<HTMLElement>(selector);
      const domNode = page.type === VisitType.INITIAL
        ? d().querySelectorAll<HTMLElement>(selector)
        : null;

      // console.log(targets, domNode);

      forNode(targets, (node, index) => {

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
