import { emit } from './events';
import { evaljs } from '../observers/scripts';
import { Errors, EventType } from '../shared/enums';
import { d, toArray } from '../shared/native';
import { log, onNextTick } from '../shared/utils';
import { parse } from '../shared/dom';
import { IPage } from '../types/page';
import { $ } from './session';
import * as store from './store';
import * as hover from '../observers/hover';
import * as intersect from '../observers/intersect';
import * as components from '../components/initialize';
import { progress } from './progress';
import * as proximity from '../observers/proximity';
import { morph } from '../morph/morph';

/**
 * Node Positions
 */
function nodePosition (a: Element, b: Element) {

  return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING || -1;
}

/**
 * Script Nodes
 *
 * Executes `<script>` node javascript
 * evaluations and loading.
 */
async function scriptNodes (target: Document, type?: EventType) {

  const selector = type === EventType.HYDRATE
    ? $.qs.$scriptsHydrate
    : $.qs.$scripts;

  const scripts: HTMLScriptElement[] = toArray(target.querySelectorAll(selector));

  await evaljs(scripts.sort(nodePosition));

}

/**
 * Evaluator Nodes
 *
 * Injects and/or replaced all nodes contained in the `<head>`
 * element with an annotation of `spx-eval`
 */
function evalNodes (target: Document) {

  document.head.querySelectorAll($.qs.$evals).forEach(node => {
    if (!target.head.contains(node)) node.remove();
  });

  document.head.append(...target.querySelectorAll($.qs.$evals));

  // if ($.config.eval.style !== false) {
  //   document.querySelectorAll($.qs.styles).forEach(node => {
  //     if (!target.contains(node)) {
  //       node.remove();
  //     } else {
  //       target.removeChild(node);
  //     }
  //   });

  //   target.querySelectorAll($.qs.styles).forEach(node => {
  //     document.head.appendChild(node);
  //   });
  // }

  // if ($.config.eval.link !== false || $.config.eval.meta !== false) {

  //   if ($.config.eval.meta !== false) {

  //     document.head.querySelectorAll($.qs.metas).forEach(node => {
  //       if (!target.head.contains(node)) node.remove();
  //     });

  //     document.head.append(...target.querySelectorAll($.qs.metas));

  //   }

  //   if ($.config.eval.link !== false) {

  //     document.head.querySelectorAll($.qs.links).forEach(node => {
  //       if (!target.head.contains(node)) node.remove();
  //     });

  //     document.head.append(...target.querySelectorAll($.qs.links));

  //   }

  // }

}

/**
 * Tracked Nodes
 *
 * '[spx-track]:not([spx-track="hydrate"])'
 */
function trackedNodes (target: HTMLElement): void {

  if (!target) return;

  const tracking = target.querySelectorAll($.qs.$tracking);

  if (tracking.length > 0) {
    for (const node of tracking) {
      if (!node.hasAttribute('id')) {
        log(Errors.WARN, `Tracked node <${node.tagName.toLowerCase()}> must contain an id attribute`);
      } else if (!$.tracked.has(node.id)) {
        d().appendChild(node);
        $.tracked.add(node.id);
      }
    }
  }
}

/**
 * Render Nodes
 *
 * Renders the new page navigation nodes replacing the
 * current pages targets with the destination targets.
 * This function is also responsible for handling append,
 * prepend and tracked replacements of element in the dom.
 */
function renderNodes (page: IPage, target: Document) {

  const nodes = page.target;
  const method = page.render;

  if (nodes.length === 1 && nodes[0] === 'body') {

    if (method === 'morph') {
      morph(d(), target.body);
    } else if (method === 'replace') {
      d().replaceWith(target.body);
    } else {
      d().innerHTML = target.body.innerHTML;
    }

  } else {

    const selectors = `${nodes.join(',')},[${$.qs.$target}]`;
    const newNodes = target.body.querySelectorAll<HTMLElement>(selectors);

    if (newNodes.length === 0) {

      log(Errors.WARN, `Unmatched targets, applied <body> replacement on: ${page.key}`);
      d().replaceWith(target.body);

    } else {

      const oldNodes = d().querySelectorAll<HTMLElement>(selectors);
      const decends: Array<HTMLElement> = [];

      if (oldNodes.length !== newNodes.length) {
        log(Errors.WARN, `Target mismatch, fallback visit applies: ${page.key}`);
        return location.assign(page.key);
      }

      for (let i = 0, s = oldNodes.length; i < s; i++) {

        const oldNode = oldNodes[i];
        const newNode = newNodes[i];

        if (!newNode) continue;
        if (oldNode.isEqualNode(newNode)) continue;
        if (!emit('render', oldNode, newNode)) continue;

        const attrTarget = newNode.getAttribute($.qs.$target);

        if (attrTarget === '' || attrTarget === 'true') {
          if (decends.some(node => node.contains(oldNode))) continue;
        } else {
          decends.push(oldNode);
        }

        let renderKind = method;

        if (oldNode.hasAttribute($.qs.$render)) {
          const value = oldNode.getAttribute($.qs.$render) as any;
          if (value !== renderKind) {
            renderKind = value;
          }
        }

        if (renderKind === 'morph') {
          morph(oldNode, newNode);
        } else if (page.render === 'replace') {
          oldNode.replaceWith(newNode);
        } else {
          oldNode.innerHTML = newNode.innerHTML;
        }

        if (page.append || page.prepend) {
          const fragment = document.createElement('div');
          for (const childNode of target.childNodes) fragment.appendChild(childNode);
          if (page.append) {
            oldNode.appendChild(fragment);
          } else {
            oldNode.insertBefore(fragment, oldNode.firstChild);
          }
        }
      }
    }

    trackedNodes(target.body);

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
function hydrateNodes (state: IPage, target: Document): void {

  const nodes = state.hydrate;

  if (nodes.length === 1 && nodes[0] === 'body') {
    morph(d(), target.body);
    return;
  }

  const selector = nodes.join(',');
  const oldNodes = d().querySelectorAll<HTMLElement>(selector);
  const preserve = state.preserve && state.preserve.length > 0 ? state.preserve.join(',') : null;
  const skipped: HTMLElement[] = [];

  if (preserve) {

    const skipNodes = d().querySelectorAll<HTMLElement>(preserve);

    for (let i = 0, s = skipNodes.length; i < s; i++) {
      const skipNode = skipNodes[i];
      skipNode.setAttribute('spx-morph', 'false');
      skipped.push(skipNode);
    }

  }

  if (oldNodes.length > 0) {

    const newNodes = target.body.querySelectorAll<HTMLElement>(selector);

    for (let i = 0, s = oldNodes.length; i < s; i++) {

      const oldNode = oldNodes[i];
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

  scriptNodes(target, EventType.HYDRATE);

  state.hydrate = undefined;
  state.preserve = undefined;
  state.type = EventType.VISIT;

  store.update(state);

  // store.purge(state.key);

}

// function updateSnapshot (state: IPage) {

//   const { page, dom } = store.dom(state);

//   if (page.target.length === 1 && page.target[0] === 'body') {
//     dom.body.replaceChildren(d());
//   } else {
//     const selector = page.target.join(',');
//     const current = d().querySelectorAll<HTMLElement>(selector);
//     dom.querySelectorAll<HTMLElement>(selector).forEach((node, i) => morph(node, current[i]));
//   }

//   $.snaps[page.uuid] = dom.documentElement.innerHTML;

// }

/**
 * Update the DOM and execute page adjustments
 * to new navigation point
 */
export function update (page: IPage): IPage {

  hover.disconnect();
  intersect.disconnect();
  proximity.disconnect();
  components.disconnect();

  document.title = page.title;

  const target = parse($.snaps[page.uuid]);

  if (page.type === EventType.HYDRATE) {
    hydrateNodes(page, target);
  } else {
    evalNodes(target);
    renderNodes(page, target);
    scriptNodes(target, page.type);
    scrollTo(page.scrollX, page.scrollY);
  }

  progress.done();

  onNextTick(() => {
    hover.connect();
    intersect.connect();
    proximity.connect();
    components.connect();
  });

  emit('load', page);

  return page;

}
