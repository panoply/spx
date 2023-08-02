import { emit } from './events';
import { evaljs } from '../observers/scripts';
import { Errors, EventType } from '../shared/enums';
import { toArray } from '../shared/native';
import { log, onNextAnimationFrame } from '../shared/utils';
import { parse } from '../shared/dom';
import { IPage } from '../types/page';
import { tracked, snapshots, config } from './session';
import * as store from './store';
import * as hover from '../observers/hover';
import * as intersect from '../observers/intersect';
import * as progress from './progress';
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
    ? config.selectors.scriptsHydrate
    : config.selectors.scripts;

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

  document.head.querySelectorAll(config.selectors.evals).forEach(node => {
    if (!target.head.contains(node)) node.remove();
  });

  document.head.append(...target.querySelectorAll(config.selectors.evals));

  // if (config.eval.style !== false) {
  //   document.querySelectorAll(config.selectors.styles).forEach(node => {
  //     if (!target.contains(node)) {
  //       node.remove();
  //     } else {
  //       target.removeChild(node);
  //     }
  //   });

  //   target.querySelectorAll(config.selectors.styles).forEach(node => {
  //     document.head.appendChild(node);
  //   });
  // }

  // if (config.eval.link !== false || config.eval.meta !== false) {

  //   if (config.eval.meta !== false) {

  //     document.head.querySelectorAll(config.selectors.metas).forEach(node => {
  //       if (!target.head.contains(node)) node.remove();
  //     });

  //     document.head.append(...target.querySelectorAll(config.selectors.metas));

  //   }

  //   if (config.eval.link !== false) {

  //     document.head.querySelectorAll(config.selectors.links).forEach(node => {
  //       if (!target.head.contains(node)) node.remove();
  //     });

  //     document.head.append(...target.querySelectorAll(config.selectors.links));

  //   }

  // }

}

/**
 * Tracked Nodes
 *
 * '[spx-track]:not([spx-track="hydrate"])'
 */
function trackedNodes (target: HTMLElement): void {

  const tracking = target.querySelectorAll(config.selectors.tracking);

  if (tracking !== null) {
    for (const node of tracking) {
      if (!node.hasAttribute('id')) {
        log(Errors.WARN, `Tracked node <${node.tagName.toLowerCase()}> must contain an id attribute`);
      } else if (!tracked.has(node.id)) {
        document.body.appendChild(node);
        tracked.add(node.id);
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
      morph(document.body, target.body);
    } else if (method === 'replace') {
      document.body.replaceChildren(target.body);
    } else {
      document.body.innerHTML = target.body.innerHTML;
    }

  } else {

    const selector = nodes.join(',');
    const fetched = target.body.querySelectorAll<HTMLElement>(selector);

    document.body.querySelectorAll<HTMLElement>(selector).forEach((node, i) => {

      if (node.isEqualNode(fetched[i])) return;
      if (!emit('render', node, fetched[i])) return;

      let renderer = method;

      if (node.hasAttribute(config.selectors.render)) {
        const value = node.getAttribute(config.selectors.render) as any;
        if (value !== renderer) renderer = value;
      }

      if (renderer === 'morph') {
        morph(node, fetched[i]);
      } else if (page.render === 'replace') {
        node.replaceWith(fetched[i]);
      } else {
        node.innerHTML = fetched[i].innerHTML;
      }

      if (page.append || page.prepend) {
        const fragment = document.createElement('div');
        target.childNodes.forEach(fragment.appendChild);
        return page.append ? node.appendChild(fragment) : node.insertBefore(fragment, node.firstChild);
      }

    });

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
    morph(document.body, target.body);
    return;
  }

  const selector = nodes.join(',');
  const current = document.body.querySelectorAll<HTMLElement>(selector);
  const preserve = state.preserve && state.preserve.length > 0 ? state.preserve.join(',') : null;
  const elements: HTMLElement[] = []

  if (preserve) {
    document.body.querySelectorAll<HTMLElement>(preserve).forEach(node => {
      node.setAttribute('spx-morph', 'false');
      elements.push(node)
    });
  }

  if (current.length > 0) {
    const fetched = target.body.querySelectorAll<HTMLElement>(selector);
    current.forEach((node, i) => {
      if (fetched[i] instanceof HTMLElement) {
        if (!emit('hydrate', node, fetched[i])) return;
        morph(node, fetched[i]);
      }
    });
  }

  if (preserve) {
    for (const node of elements) node.removeAttribute('spx-morph');
  }

  scriptNodes(target, EventType.HYDRATE);

  state.hydrate = undefined;
  state.preserve = undefined;
  state.type = EventType.VISIT;

  store.update(state);

  // store.purge(state.key);

}

/**
 * Update the DOM and execute page adjustments
 * to new navigation point
 */
export async function update (page: IPage):Promise<IPage> {

  await onNextAnimationFrame();

  hover.disconnect();
  intersect.disconnect();
  proximity.disconnect();

  document.title = page.title;

  const target = parse(snapshots[page.uuid]);

  if (page.type === EventType.HYDRATE) {
    hydrateNodes(page, target);
  } else {
    evalNodes(target);
    renderNodes(page, target);
    scrollTo(page.position.x, page.position.y);
    scriptNodes(target, page.type);
  }

  progress.done();
  hover.connect();
  intersect.connect();
  proximity.connect();

  emit('load', page);

  return page;

}
