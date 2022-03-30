import history from 'history/browser';
import loadjs from 'loadjs';
import { forEach } from './utils';
import { dispatch } from './events';
import { progress } from './progress';
import { IPage } from '../types/page';
import { snaps, config, selectors } from './state';
import { toArray } from '../constants/native';
import * as store from './store';
import * as mouseover from '../observers/mouseover';
import * as intersect from '../observers/intersect';
// import * as proximity from '../observers/proximity';

/**
 * DOM Parser
 */
const DOMParse: DOMParser = new DOMParser();

/**
 * Tracked Elements
 */
const tracked: Set<string> = new Set();

/**
 * Observe HTML `<head>` tags for mutations, allows us
 * to track scripts, styles and such.
 */
// @ts-ignore
// eslint-disable-next-line
function observeHead(
  mutations: MutationRecord[],
  observer: MutationObserver
): void {

  mutations.forEach((mutation: MutationRecord) => {

    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        if (node.nodeName === 'SCRIPT' && node instanceof HTMLElement) {
          if (node.getAttribute(selectors.eval) !== 'false') {
            node.setAttribute(selectors.eval, 'false');
          }
        }
      });

    } else if (mutation.type === 'attributes') {
      console.log(mutation.target);

      console.log(
        'The ' + mutation.attributeName + ' attribute was modified.'
      );
    }
  });
}

/**
 * DOM Scripts elements, eg: `<script>` - We will parse
 * all load all scripts for each navigation. We lean on
 * the powerful little module known as `loadjs` for script
 * execution and tracking
 */
function DOMScripts ({ src, id = src }: HTMLScriptElement): void {
  if (!loadjs.isDefined(id)) {
    loadjs(src, id, {
      before: (_, script) => script.setAttribute(selectors.eval, 'false'),
      success: () => dispatch('pjax:script', { id }),
      error: path => console.error(`Pjax: Failed to load script ${path} `),
      numRetries: 1
    });
  }
}

/**
 * DOM Head Nodes
 */
function DOMHeadNodes (nodes: string[], { ...children }: HTMLHeadElement): string {

  forEach(DOMNode => {
    if (DOMNode.tagName === 'TITLE') return null;
    if (DOMNode.getAttribute(selectors.eval) !== 'false') {
      const index = nodes.indexOf(DOMNode.outerHTML);
      index === -1
        ? DOMNode.parentNode.removeChild(DOMNode)
        : nodes.splice(index, 1);
    }
  }, children);

  return nodes.join('');

}

/**
 * DOM Head
 */
function DOMHead ({ children }: HTMLHeadElement): void {

  const targetNodes = toArray(children).reduce((arr, node) => {

    if (node.tagName === 'SCRIPT' && node.hasAttribute('src')) {
      if (node.getAttribute(selectors.eval) !== 'false') {
        if (node instanceof HTMLScriptElement) {
          DOMScripts(node);
          node.parentNode.removeChild(node);
        }
      }
    }

    if (node.tagName !== 'TITLE' && node.tagName !== 'SCRIPT') {
      arr.push(node.outerHTML);
    } else {
      return arr;
    }

    return arr;

  }, []);

  const fragment = document.createElement('div');

  fragment.innerHTML = DOMHeadNodes(targetNodes, document.head);

  // console.log(fragment.children);

  for (const DOMNode of fragment.children) {
    if (!DOMNode.hasAttribute(selectors.eval)) document.head.appendChild(DOMNode);
  }

}

/**
 * Parse HTML document string from request response
 * using `parser()` method. Cached pages will pass
 * the saved response here.
 */
export function parse (HTMLString: string): Document {

  return DOMParse.parseFromString(HTMLString, 'text/html');

}

/**
 * Tracked Nodes
 *
 * '[data-pjax-track]:not([data-pjax-track="hydrate"])'
 */
function trackedNodes (target: HTMLElement): void {

  const nodes = target.querySelectorAll(selectors.track);

  nodes.forEach((node) => {

    // tracked element must contain id
    if (!node.hasAttribute('id')) return;

    if (!tracked.has(node.id)) {
      document.body.appendChild(node);
      tracked.add(node.id);
      dispatch('pjax:tracked', { target: node }, true);
    }
  });

}

/**
 * Render Nodes
 *
 * Renders the new page navigation nodes replacing the
 * current pages targets with the destination targets.
 * This function is also responsible for handling append,
 * prepend and tracked replacements of element in the dom.
 */
function renderNodes (state: IPage, target: Document) {

  const nodes = state.replace ? [ ...state.targets, ...state.replace ] : state.targets;
  const selector = nodes.join(',');
  const current = document.body.querySelectorAll<HTMLElement>(selector);

  if (current.length === 0) return document.body.replaceWith(target.body);

  const fetched = target.body.querySelectorAll<HTMLElement>(selector);
  // const ignored = isArray(state.ignore) ? state.ignore.join(',') : false;

  current.forEach((node, i) => {

    if (!node.matches(nodes[i])) return;
    if (!dispatch('pjax:render', { target: node, newTarget: fetched[i] }, true)) return;

    node.replaceWith(fetched[i]);

    if (state.append || state.prepend) {
      const fragment = document.createElement('div');
      target.childNodes.forEach(fragment.appendChild);
      return state.append ? node.appendChild(fragment) : node.insertBefore(fragment, node.firstChild);
    }

  });

  trackedNodes(target.body);

}

/**
 * Node Hydration
 *
 * Executes node replacements hydrating the DOM with
 * the fetched target. All nodes provided with `data-pjax-hydrate`
 * or via the `visit.hydrate[]` method are replaced. TextNode types
 * will be swapped out via `innerHTML` to prevent missing replacements
 * for occuring.
 */
function hydrateNodes (state: IPage, target: Document): void {

  const nodes = state.hydrate.join(',');
  const current = document.body.querySelectorAll<HTMLElement>(nodes);

  if (current.length > 0) {
    const fetched = target.body.querySelectorAll<HTMLElement>(nodes);
    current.forEach((node, i) => {

      if (!dispatch('pjax:hydrate', { target: node, newTarget: fetched[i] }, true)) return;

      // InnerHTML replacment on text nodes
      if (node.firstChild.nodeType === Node.TEXT_NODE) {
        node.innerHTML = fetched[i].innerHTML;
      } else {
        node.replaceWith(fetched[i]);
      }
    });
  }

  state.history = undefined;
  state.type = 'visit';

  store.update(state);
  store.purge([ state.key ]);

}

/**
 * Observe Head Element
 */
// const observer = new MutationObserver(observeHead);

/**
 * Observe Head Element
 */
// observer.observe(document.head, {
//  attributes: true,
//  childList: true,
//  subtree: true
// });

/**
 * Update the DOM and execute page adjustments
 * to new navigation point
 */
export function update (state: IPage, popstate?: boolean): IPage {

  if (config.mouseover !== false) mouseover.stop();
  if (config.intersect !== false) intersect.stop();
  // if (config.proximity !== false) proximity.stop();

  const target = parse(snaps[state.snapshot]);
  state.title = document.title = target.title || '';

  if (target.head) DOMHead(target.head);

  if (state.hydrate) {

    hydrateNodes(state, target);

  } else {

    renderNodes(state, target);

    if (state.history) {

      if (!popstate) {
        if (state.key === state.location.lastpath) {
          history.replace(state.location, state);
        } else {
          history.push(state.location, state);
        }
      }

      scrollTo(state.position.x, state.position.y);

    }
  }

  progress.done();

  if (config.mouseover !== false) mouseover.start();
  if (config.intersect !== false) intersect.start();
  // if (config.proximity !== false) proximity.start();

  dispatch('pjax:load', state);

  return state;

}
