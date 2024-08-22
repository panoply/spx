import type { Page } from 'types';
import { $ } from '../app/session';
import { getSnapDom, patch, setSnap } from '../app/queries';
import { Log, VisitType } from '../shared/enums';
import { b, nil } from '../shared/native';
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

  $.fragments.clear();

  /**
   * Selector string to be used to obtain dom elements during render
   */
  let selector: string;

  /**
   * The SPX Target directive, will either be `spx-target` or `spx-fragment`
   */
  let directive: string;

  /**
   * Set of SPX Component aliases using and `id=""` and `spx-component=""`
   */
  let aliases: Set<HTMLElement>;

  const dom = b();

  if ($.page.target.length > 0) {

    directive = $.qs.$target;
    selector = $.page.target.join(',');
    aliases = nodeSet(dom.querySelectorAll<HTMLElement>(`[id][${$.qs.$component}]`));

  } else {

    directive = $.qs.$fragment;
    selector = $.config.fragments.length === 1 && $.config.fragments[0] === 'body'
      ? $.qs.$fragments
      : `${$.config.fragments.join()},${$.qs.$fragments}`;
  }

  forNode(selector, node => {

    if (aliases) {
      for (const alias of aliases) {
        if (!node.contains(alias)) continue;
        aliases.delete(alias);
        break;
      }
    }

    if (node.hasAttribute(directive)) {
      const attr = node.getAttribute(directive).trim();
      (node.id !== nil && (attr === 'true' || attr === nil))
        ? $.fragments.set(`#${node.id}`, node)
        : $.fragments.set(getSelector(node, directive, attr), node);

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

  patch('fragments', [ ...$.fragments.keys() ]);

}

/**
 * Set Fragment elements
 *
 * Checks snapshots outside the event loop for fragment targets
 * and marks them accordingly.
 */
export function setFragmentElements (page: Page) {

  if (page.type === VisitType.VISIT || page.selector === 'body' || page.selector === null) return;

  onNextTick(() => {

    const snapDom = getSnapDom(page.snap);
    const targets = snapDom.body.querySelectorAll<HTMLElement>($.qs.$targets);
    const domNode = b().querySelectorAll<HTMLElement>($.qs.$targets);

    forNode(targets, (node, index) => {

      if (contains(node)) {
        log(Log.WARN, 'The fragment or target is a decedent of an element which morphs', node);
      } else {

        if (!node.hasAttribute('id')) {
          node.setAttribute('id', `t.${uuid()}`);
          domNode && domNode[index].setAttribute('id', `t.${uuid()}`);
        } else if (node.id.startsWith('t.')) {
          return;
        }

        page.target.push(node.id);

      }
    });

    setSnap(snapDom.documentElement.outerHTML, page.snap);

  });

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
