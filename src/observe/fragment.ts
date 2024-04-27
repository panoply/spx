import type { Page } from 'types';
import { $ } from '../app/session';
import { getSnapDom, patchPage, setSnap } from '../app/queries';
import { LogType, VisitType } from '../shared/enums';
import { d, nil, toArray } from '../shared/native';
import { forNode, onNextTick, uuid } from '../shared/utils';
import { log } from '../shared/logs';

/**
 * Connect Fragments
 *
 * Updates the session `$.fragments` references. The `$.page.fragments` will hold identifers
 * and its here were we obtain the elements for each identifier.
 */
export function connect () {

  const fragment = $.config.fragments;

  const selector = fragment.length === 1 && fragment[0] === 'body'
    ? $.qs.$fragments
    : `${fragment.join()},${$.qs.$fragments}`;

  d().querySelectorAll<HTMLElement>(selector).forEach(node => {

    let dynamic: string = node.getAttribute($.qs.$fragment);

    if (dynamic !== null) {

      dynamic = dynamic.trim();

      if (node.id !== nil && (dynamic === 'true' || dynamic === nil)) {
        $.fragments.set(`#${node.id}`, node);
      } else {
        $.fragments.set(`${node.nodeName.toLowerCase()}[${$.qs.$fragment}="${dynamic}"]`, node);
      }

    } else {
      $.fragments.set(`#${node.id}`, node);
    }

  });

  patchPage('fragments', toArray($.fragments.keys()));

}

/**
 * Set Fragment elements
 *
 * Checks snapshots outside the event loop for fragment targets
 * and marks them accordingly.
 */
export function setFragmentElements (page: Page) {

  if (page.type !== VisitType.VISIT) {

    if (page.selector === 'body' || page.selector === null) return;

    onNextTick(() => {

      const snapDom = getSnapDom(page.snap);
      const targets = snapDom.body.querySelectorAll<HTMLElement>($.qs.$targets);
      const domNode = d().querySelectorAll<HTMLElement>($.qs.$targets);

      // console.log(targets, domNode);

      forNode(targets, (node, index) => {

        if (contains(node)) {

          log(
            LogType.WARN,
            'The fragment or target is a decedent of an element which morphs',
            node
          );

          return;

        }

        if (!node.hasAttribute('id')) {

          node.setAttribute('id', `t.${uuid()}`);

          if (domNode !== null) domNode[index].setAttribute('id', `t.${uuid()}`);

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
