import type { Page } from 'types';
import { $ } from './session';
import { emit } from './events';
import { LogType, VisitType } from '../shared/enums';
import { d, h, m, s } from '../shared/native';
import { scriptTag, hasProp } from '../shared/utils';
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

async function morphHead (curHead: HTMLHeadElement, newHead: HTMLHeadElement): Promise<PromiseSettledResult<void>[]> {

  if (!$.eval || !curHead.children || !newHead.children) return;

  const curHeadChildren = curHead.children;
  const newHeadExternal = s<string>();
  const newHeadPreserve = m<string, string>();
  const newHeadChildren = newHead.children;
  const newHeadRemovals: Element[] = [];

  for (let i = 0, s = newHeadChildren.length; i < s; i++) {

    const newHeadOuterHTML = newHeadChildren[i].outerHTML;

    newHeadExternal.add(newHeadOuterHTML);

    // This is mainly for Shopify, because they try their hardest
    // to manipulate the CFH so we can't augment logic, however they
    // mark the scripts with ids or classes because they're fucking daft.
    if (newHeadChildren[i].nodeName === 'SCRIPT') {

      // Here we simply capture the script reference
      //
      newHeadPreserve.set(scriptTag(newHeadOuterHTML), newHeadOuterHTML);

    }
  }

  for (let i = 0, s = curHeadChildren.length; i < s; i++) {

    const curHeadChildNode = curHeadChildren[i];
    const curHeadOuterHTML = curHeadChildNode.outerHTML;
    const curHeadNodeName = curHeadChildNode.nodeName;

    let evaluate: boolean = true;

    if (curHeadNodeName === 'SCRIPT') {
      evaluate = curHeadChildNode.matches($.qs.$script);
    } else if (curHeadNodeName === 'STYLE') {
      evaluate = curHeadChildNode.matches($.qs.$style);
    } else if (curHeadNodeName === 'META') {
      evaluate = curHeadChildNode.matches($.qs.$meta);
    } else if (curHeadNodeName === 'LINK') {
      evaluate = curHeadChildNode.matches($.qs.$link);
    } else {
      evaluate = curHeadChildNode.getAttribute($.qs.$eval) !== 'false';
    }

    if (newHeadExternal.has(curHeadOuterHTML)) {

      if (evaluate) {
        newHeadRemovals.push(curHeadChildNode);
      } else {
        newHeadExternal.delete(curHeadOuterHTML);
      }

    } else {

      if (curHeadNodeName === 'SCRIPT') {

        const match = scriptTag(curHeadOuterHTML);

        if (newHeadPreserve.has(match)) {
          newHeadExternal.delete(newHeadPreserve.get(match));
          newHeadPreserve.delete(match);
          continue;
        }

      }

      newHeadRemovals.push(curHeadChildNode);

    }
  }

  const promises: Promise<void>[] = [];
  const range = document.createRange();

  for (const outerHTML of newHeadExternal) {

    const node = range.createContextualFragment(outerHTML).firstChild;

    console.log(node);

    if (hasProp(node, 'href') || hasProp(node, 'src')) {

      let success = null;

      const promise = new Promise<void>(function (resolve) { success = resolve; });

      node.addEventListener('error', (e) => {
        log(LogType.WARN, `Resource <${node.nodeName.toLowerCase()}> failed:`, node);
        success();
      });

      node.addEventListener('load', () => success());

      promises.push(promise);

    }

    curHead.appendChild(node);

    newHeadExternal.delete(outerHTML);

  }

  for (let i = 0, s = newHeadRemovals.length; i < s; i++) {

    curHead.removeChild(newHeadRemovals[i]);

  }

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
  // if ('hash' in page.location && page.location.hash) {
  //   const anchor = pageDom.querySelector(page.location.hash);
  //   if (anchor) {
  //     anchor.scrollIntoView();
  //     return;
  //   }
  // }

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

  morphHead(h(), snapDom.head);
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
