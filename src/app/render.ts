import type { Page } from 'types';
import { $ } from './session';
import { emit } from './events';
import { LogType, VisitType } from '../shared/enums';
import { d, h, s } from '../shared/native';
import { hasProp } from '../shared/utils';
import { progress } from './progress';
import { context, mark } from '../components/observe';
import { getSnapDom, patch } from './queries';
import { morph } from '../morph/morph';
import { log } from '../shared/logs';
import { snap } from '../components/snapshot';
import * as hover from '../observe/hovers';
import * as intersect from '../observe/intersect';
import * as components from '../observe/components';
import * as mutations from '../observe/mutations';
import * as proximity from '../observe/proximity';
import * as fragment from '../observe/fragment';
import { walkElements } from 'src/morph/walk';
import { getSelector } from 'src/components/context';

/**
 * Tracked Nodes
 *
 * '[spx-track]:not([spx-track="hydrate"])'
 */
// function trackedNodes (target: HTMLElement): void {

//   if (!target) return;

//   const tracking = target.querySelectorAll($.qs.$track);

//   if (tracking.length > 0) {
//     for (const node of tracking) {
//       if (!node.hasAttribute('id')) {
//         log(LogType.WARN, `Tracked node <${node.tagName.toLowerCase()}> must have id attribute`);
//       } else if (!$.tracked.has(node.id)) {
//         d().appendChild(node);
//         $.tracked.add(node.id);
//       }
//     }
//   }

// }

async function morphHead (head: HTMLHeadElement, target: HTMLCollection): Promise<PromiseSettledResult<void>[]> {

  if (!$.eval || !head || !target) return;

  const remove: Element[] = [];
  const nodes = s<string>();
  const { children } = head;

  for (let i = 0, s = target.length; i < s; i++) {
    nodes.add(target[i].outerHTML);
  }

  for (let i = 0, s = children.length; i < s; i++) {

    const childNode = children[i];
    const { nodeName, outerHTML } = childNode;

    let evaluate: boolean = true;

    if (nodeName === 'SCRIPT') {
      evaluate = childNode.matches($.qs.$script);
    } else if (nodeName === 'STYLE') {
      evaluate = childNode.matches($.qs.$style);
    } else if (nodeName === 'META') {
      evaluate = childNode.matches($.qs.$meta);
    } else if (nodeName === 'LINK') {
      evaluate = childNode.matches($.qs.$link);
    } else {
      evaluate = head.getAttribute($.qs.$eval) !== 'false';
    }

    if (nodes.has(outerHTML)) {
      if (evaluate) {
        remove.push(childNode);
      } else {
        nodes.delete(outerHTML);
      }
    } else {
      remove.push(childNode);
    }
  }

  const promises: Promise<void>[] = [];
  const range = document.createRange();

  for (const outerHTML of nodes) {

    const node = range.createContextualFragment(outerHTML).firstChild;
    const link: boolean = hasProp(node, 'href');

    if (link || hasProp(node, 'src')) {

      const promise = new Promise<void>(function (resolve) {

        node.addEventListener('error', (e) => {
          log(LogType.WARN, `Resource <${node.nodeName.toLowerCase()}> failed:`, node);
          resolve();
        });

        node.addEventListener('load', () => resolve());

      });

      promises.push(promise);

    }

    head.appendChild(node);
    nodes.delete(outerHTML);

  }

  for (let i = 0, s = remove.length; i < s; i++) head.removeChild(remove[i]);

  await Promise.all<void>(promises);

}

/**
 * Render Nodes
 *
 * Renders the new page navigation nodes replacing the
 * current pages targets with the destination targets.
 * This function is also responsible for handling append,
 * prepend and tracked replacements of element in the dom.
 */
function morphNodes (page: Page, snapDom: Document) {

  const pageDom = d();

  if (page.selector === 'body' || page.fragments.length === 0) {

    morph(pageDom, snapDom.body);

  } else {

    const elements = page.target.length > 0 ? $.fragments.keys() : page.fragments;

    for (const id of elements) {

      const domNode = $.fragments.get(id);
      const newNode = snapDom.body.querySelector<HTMLElement>(id);

      if (!newNode || !domNode) continue;
      if (!emit('render', domNode, newNode)) continue;

      if (mark.has(newNode.id)) {
        newNode.setAttribute($.qs.$ref, domNode.getAttribute($.qs.$ref));
      } else {
        if (domNode.isEqualNode(newNode)) continue;
        snap.set(newNode);
        morph(domNode, newNode);
      }
    }

  }

  if (context) snap.sync(snapDom.body);
  if (page.type !== VisitType.VISIT) patch('type', VisitType.VISIT);

  // Lets check whether or not location points to an anchor.
  // When page hash has a value, we will scroll to the point of the page.
  if (page.location.hash) {
    const anchor = pageDom.querySelector(page.location.hash);
    if (anchor) {
      anchor.scrollIntoView();
      return;
    }
  }

  scrollTo(page.scrollX, page.scrollY);

  /*
  else if (page.selector !== null) {

    const pageNodes = pageDom.querySelectorAll<HTMLElement>(page.selector);
    const snapNodes = snapDom.body.querySelectorAll<HTMLElement>(page.selector);
    const nodeMorph: Set<Element> = s();

    for (let i = 0, s = pageNodes.length; i < s; i++) {

      const curNode = pageNodes[i];
      const newNode = snapNodes[i];

      if (!newNode || !curNode) continue;
      if (!emit('render', curNode, newNode)) continue;
      if (curNode.isEqualNode(newNode)) continue;

      nodeMorph.add(
        morph(
          curNode,
          newNode
        )
      );
    }

    if (page.type !== VisitType.VISIT && context && context.$nodes.length > 0) {
      onNextTick(() => {
        patchSnap(snapDom.body, pageDom, context.$nodes, nodeMorph);
        patch('type', VisitType.VISIT);
        nodeMorph.clear();
      });
    }

  }

  */

}

/**
 * Update the DOM and execute page adjustments
 * to new navigation point
 */
export function update (page: Page): Page {

  hover.disconnect();
  intersect.disconnect();
  proximity.disconnect();
  mutations.disconnect();
  components.disconnect();

  fragment.connect();

  if (!$.eval) document.title = page.title;

  const snapDom = getSnapDom(page.snap);

  morphHead(h(), snapDom.head.children);
  morphNodes(page, snapDom);

  progress.done();

  hover.connect();
  intersect.connect();
  proximity.connect();
  components.connect();
  mutations.connect();

  emit('load', page);

  return page;

}
