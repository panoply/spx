import type { Page } from 'types';
import { $ } from '../app/session';
import { getSnapDom, patch, setSnap } from '../app/queries';
import { LogType, VisitType } from '../shared/enums';
import { d, nil, toArray } from '../shared/native';
import { forNode, nodeSet, onNextTick, uuid } from '../shared/utils';
import { log } from '../shared/logs';
import { getSelector } from 'src/components/context';
import { mark } from '../components/observe';

/**
 * Connect Fragments
 *
 * Updates the session `$.fragments` references. The `$.page.fragments` will hold identifers
 * and its here were we obtain the elements for each identifier.
 */
export function connect () {

  let selector: string;
  let directive: string;
  let aliases: Set<HTMLElement>;

  const pageDom = d();

  $.fragments.clear();

  if ($.page.target.length > 0) {

    directive = $.qs.$target;
    selector = $.page.target.join(',');
    aliases = nodeSet(pageDom.querySelectorAll<HTMLElement>(`[id][${$.qs.$component}]`));

  } else {

    const fragment = $.config.fragments;
    directive = $.qs.$fragment;
    selector = fragment.length === 1 && fragment[0] === 'body'
      ? $.qs.$fragments
      : `${fragment.join()},${$.qs.$fragments}`;
  }

  forNode(selector, node => {

    if (aliases) {
      for (const alias of aliases) {
        if (node.contains(alias)) {
          aliases.delete(alias);
          break;
        }
      }
    }

    if (node.hasAttribute(directive)) {

      const id = node.getAttribute(directive).trim();

      if (node.id !== nil && (id === 'true' || id === nil)) {
        $.fragments.set(`#${node.id}`, node);
      } else {
        $.fragments.set(getSelector(node, directive, id), node);
      }

    } else {

      $.fragments.set(`#${node.id}`, node);

    }

  });

  if (aliases && aliases.size > 0) {

    for (const child of aliases) {
      $.fragments.set(`#${child.id}`, child);
      $.page.target.push(`#${child.id}`);
      mark.add(child.id);
    }

    aliases.clear();

  }

  patch('fragments', toArray($.fragments.keys()));

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

        page.target.push(node.id);

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
