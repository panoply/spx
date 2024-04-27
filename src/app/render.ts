import type { Page } from 'types';
import { $ } from './session';
import { emit } from './events';
import { LogType, VisitType } from '../shared/enums';
import { d, h, s } from '../shared/native';
import { hasProp, onNextTick } from '../shared/utils';
import { progress } from './progress';
import { context } from '../components/observe';
import { getSnapDom, patchPage } from './queries';
import { morph } from '../morph/morph';
import { morphSnap, patchSnap } from '../morph/snapshot';
import { log } from '../shared/logs';
import * as hover from '../observe/hovers';
import * as intersect from '../observe/intersect';
import * as components from '../observe/components';
import * as mutations from '../observe/mutations';
import * as proximity from '../observe/proximity';
import * as fragment from '../observe/fragment';

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

  for (let i = 0, s = remove.length; i < s; i++) {
    head.removeChild(remove[i]);
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

    const newDom = snapDom.body;

    morph(pageDom, newDom);

    if (context && context.$nodes.length > 0) {
      onNextTick(() => {
        morphSnap(newDom, context.$nodes);
        patchPage('type', VisitType.VISIT);
      });
    }

  } else if (page.selector !== null) {

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
        patchPage('type', VisitType.VISIT);
        nodeMorph.clear();
      });
    }

  } else {

    for (const id of page.fragments) {

      const curNode = $.fragments.get(id);
      const newNode = snapDom.body.querySelector<HTMLElement>(id);

      if (!newNode || !curNode) continue;
      if (!emit('render', curNode, newNode)) continue;
      if (curNode.isEqualNode(newNode)) continue;

      morph(curNode, newNode);

      if (context && context.$nodes.length > 0) {
        onNextTick(() => morphSnap(newNode, context.$nodes));
      }
    }

    patchPage('type', VisitType.VISIT);

  }

}

/**
 * Node Hydration
 *
 * Executes node replacements hydrating the DOM with
 * the fetched target. All nodes provided with `spx-hydrate`
 * or via the `visit.hydrate[]` method are replaced. TextNode types
 * will be swapped out via `innerHTML` to prevent missing replacements
 * for occuring.
 */
function morphHydrate (state: Page, target: Document): void {

  const nodes = state.hydrate;

  if (nodes.length === 1 && nodes[0] === 'body') {
    morph(d(), target.body);
    return;
  }

  const selector = nodes.join(',');
  const domNodes = d().querySelectorAll<HTMLElement>(selector);
  const preserve = state.preserve && state.preserve.length > 0 ? state.preserve.join(',') : null;
  const skipped: HTMLElement[] = [];

  if (preserve) {

    const skipNodes = d().querySelectorAll<HTMLElement>(preserve);

    for (let i = 0, s = skipNodes.length; i < s; i++) {
      const skipNode = skipNodes[i];
      skipNode.setAttribute($.qs.$morph, 'false');
      skipped.push(skipNode);
    }

  }

  if (domNodes.length > 0) {

    const newNodes = target.body.querySelectorAll<HTMLElement>(selector);

    for (let i = 0, s = domNodes.length; i < s; i++) {

      const oldNode = domNodes[i];
      const newNode = newNodes[i];

      if (newNodes[i] instanceof HTMLElement) {
        if (!emit('hydrate', oldNode, newNode)) continue;
        morph(newNode, newNode);
      }
    }

  }

  if (preserve) {
    for (const node of skipped) {
      node.removeAttribute('spx-morph');
    }
  }

  // scriptNodes(target, VisitType.HYDRATE);

  state.hydrate = undefined;
  state.preserve = undefined;
  state.type = VisitType.VISIT;

  update(state);

  // q.purge(state.key);

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

  if (page.type === VisitType.HYDRATE) {
    morphHydrate(page, snapDom);
  } else {
    morphHead(h(), snapDom.head.children);
    morphNodes(page, snapDom);
    scrollTo(page.scrollX, page.scrollY);
  }

  progress.done();

  onNextTick(() => {
    hover.connect();
    intersect.connect();
    proximity.connect();
    components.connect();
    mutations.connect();
  });

  emit('load', page);

  return page;

}
