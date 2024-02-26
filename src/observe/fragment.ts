import { $ } from '../app/session';
import { forNode } from '../shared/utils';

/**
 * Connect Fragments
 *
 * Updates the session `$.fragments` record
 */
export function connect () {

  $.fragments.clear();

  forNode($.page.selector, node => $.fragments.add(node));

}

/**
 * Node is contained in Fragment
 *
 * Checks whether or not the provided node is a child of a fragment
 * or the fragment itself
 */
export function contains (node: HTMLElement) {

  for (const fragment of $.fragments) {
    if (fragment.contains(node) || fragment.isEqualNode(node)) return true;
  }

  return false;

}
