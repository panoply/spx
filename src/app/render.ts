import type { Page } from 'types';
import { $ } from './session';
import { emit } from './events';
import { Log, VisitType } from '../shared/enums';
import { d, b, h, nil, s } from '../shared/native';
import { canEval, hasProp } from '../shared/utils';
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

const morphHead = async (curHead: HTMLHeadElement, newHead: HTMLHeadElement): Promise<PromiseSettledResult<void>[]> => {

  if (!$.eval || !curHead.children || !newHead.children) return;

  const curHeadChildren = curHead.children;
  const newHeadExternal = s<string>();
  const newHeadChildren = newHead.children;
  const newHeadRemovals: Element[] = [];

  for (let i = 0, s = newHeadChildren.length; i < s; i++) {
    if (canEval(newHeadChildren[i])) {
      newHeadExternal.add(newHeadChildren[i].outerHTML);
    }
  }

  for (let i = 0, s = curHeadChildren.length; i < s; i++) {

    const curHeadChildNode = curHeadChildren[i];
    const canEvalChildNode = canEval(curHeadChildNode);
    const curHeadOuterHTML = curHeadChildNode.outerHTML;

    if (newHeadExternal.has(curHeadOuterHTML)) {
      canEvalChildNode
        ? newHeadRemovals.push(curHeadChildNode)
        : newHeadExternal.delete(curHeadOuterHTML);
    } else if (canEvalChildNode) {
      newHeadRemovals.push(curHeadChildNode);
    }
  }

  const promises: Promise<void>[] = [];
  const range = document.createRange();

  for (const outerHTML of newHeadExternal) {

    const node = range.createContextualFragment(outerHTML).firstChild;

    if (hasProp(node, 'href') || hasProp(node, 'src')) {

      /** Promise Resolver */
      let resolve: (value: void | PromiseLike<void>) => void;

      const promise = new Promise<void>(_ => (resolve = _));

      node.addEventListener('load', () => resolve());
      node.addEventListener('error', error => {
        log(Log.WARN, `Resource <${node.nodeName.toLowerCase()}> failed:`, error);
        resolve();
      });

      promises.push(promise);

    }

    curHead.appendChild(node);
    newHeadExternal.delete(outerHTML);

  }

  for (let i = 0, s = newHeadRemovals.length; i < s; i++) {
    curHead.removeChild(newHeadRemovals[i]);
  }

  await Promise.allSettled<void>(promises);

};

/**
 * Render Nodes
 *
 * Renders the new page navigation nodes replacing the
 * current pages targets with the destination targets.
 * This function is also responsible for handling append,
 * prepend and tracked replacements of element in the dom.
 */
const morphNodes = (page: Page, snapDom: Document) => {

  const pageDom = b();

  if (page.selector === 'body' || page.fragments.length === 0) {

    morph(pageDom, snapDom.body);

  } else {

    const elements = page.target.length > 0 ? $.fragments.keys() : page.fragments;
    const components = $.components.$registry.size > 0;

    for (const id of elements) {

      const domNode = $.fragments.get(id);
      const newNode = snapDom.body.querySelector<HTMLElement>(id);

      if (!newNode || !domNode) continue;
      if (!emit('render', domNode, newNode)) continue;

      // I don't know what the fuck this logic pertains to...
      // The mark set store is populated during fragment selections
      // and consists of alias spx-components but I don't know
      // why this check and attribute marking applies??
      //
      if (mark.has(newNode.id)) {

        newNode.setAttribute($.qs.$ref, domNode.getAttribute($.qs.$ref));

      } else {

        // First, let's not morph or do anything when no changes
        if (domNode.isEqualNode(newNode)) continue;

        // Next, we add the newNode from snapshot dom to our component
        // data-spx reference updater which will sync in next tick
        //
        components && snap.set(newNode);

        // Last, we send the elements off form morphing
        //
        morph(domNode, newNode);

      }
    }

  }

  if (context) {
    snap.sync(snapDom.body);
  }

  if (page.type !== VisitType.VISIT) {
    patch('type', VisitType.VISIT);
  }

  // Lets check whether or not location points to an anchor.
  // When page hash has a value, we will scroll to the point of the page.
  //
  if (page.location.hash !== nil) {
    const anchor = pageDom.querySelector(page.location.hash);
    anchor && anchor.scrollIntoView();
  }

  // We mark the document <html> element
  d().id = page.snap;

  scrollTo(page.scrollX, page.scrollY);

};

/**
 * Update the DOM and execute page adjustments
 * to new navigation point
 */
export const update = (page: Page): Page => {

  hover.disconnect();
  intersect.disconnect();
  proximity.disconnect();
  mutations.disconnect();
  components.disconnect();

  fragment.connect();

  $.eval === false && (document.title = page.title);

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

};
