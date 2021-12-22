import loadjs from 'loadjs';
import { forEach } from './utils';
import { dispatchEvent } from './events';
import { progress } from './progress';
import { IPage } from '../types/page';
import history from 'history/browser';
import { from } from '../constants/native';
import * as store from './store';
import * as mouseover from '../observers/hover';
import * as intersect from '../observers/intersect';

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
  forEach((mutation: MutationRecord) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        if (node.nodeName === 'SCRIPT') {
          if (node instanceof HTMLElement) {
            if (node.getAttribute('data-pjax-eval') !== 'false') {
              node.setAttribute('data-pjax-eval', 'false');
            }
          }
        }
      });
    } else if (mutation.type === 'attributes') {
      console.log(mutation.target);

      console.log(
        'The ' + mutation.attributeName + ' attribute was modified.'
      );
    }
  })(mutations);
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
      before: (_, script) =>
        script.setAttribute('data-pjax-eval', 'false'),
      success: () => dispatchEvent('pjax:script', { id }),
      error: path =>
        console.error(`Pjax: Failed to load script ${path} `),
      numRetries: 1
    });
  }
}

/**
 * DOM Head Nodes
 */
function DOMHeadNodes (
  nodes: string[],
  { ...children }: HTMLHeadElement
): string {
  forEach(DOMNode => {
    if (DOMNode.tagName === 'TITLE') return null;
    if (DOMNode.getAttribute('data-pjax-eval') !== 'false') {
      const index = nodes.indexOf(DOMNode.outerHTML);
      index === -1
        ? DOMNode.parentNode.removeChild(DOMNode)
        : nodes.splice(index, 1);
    }
  })(children);

  return nodes.join('');
}

/**
 * DOM Head
 */
function DOMHead ({ children }: HTMLHeadElement): void {

  const targetNodes = from(children).reduce((arr, node) => {

    if (node.tagName === 'SCRIPT' && node.hasAttribute('src')) {
      if (node.getAttribute('data-pjax-eval') !== 'false') {
        if (node instanceof HTMLScriptElement) {
          DOMScripts(node);
          node.parentNode.removeChild(node);
        }
      }
    }

    return node.tagName !== 'TITLE' && node.tagName !== 'SCRIPT'
      ? [ ...arr, node.outerHTML ]
      : arr;

  }, []);

  const fragment = document.createElement('div');

  fragment.innerHTML = DOMHeadNodes(targetNodes, document.head);

  // console.log(fragment.children);

  forEach(DOMNode => {
    if (!DOMNode.hasAttribute('data-pjax-eval')) document.head.appendChild(DOMNode);
  }, from(fragment.children));
}

/**
 * Append Tracked Node
 */
function appendTrackedNode (node: Element): void {

  // tracked element must contain id
  if (!node.hasAttribute('id')) return;

  if (!tracked.has(node.id)) {
    document.body.appendChild(node);
    tracked.add(node.id);
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
 * Captures current document element and sets a
 * record to snapshot state
 */
export async function capture (state: IPage) {

  if (store.has(state.url)) {

    const target = parse(store.snaps.get(state.snapshot));

    target.body.innerHTML = document.body.innerHTML;
    store.snaps.set(state.snapshot, target.documentElement.outerHTML);

  }
}

function renderNodes (state: IPage, target: Document) {

  const nodes = state.replace ? [ ...state.targets, ...state.replace ] : state.targets;
  const selector = nodes.join(',');
  const current = document.body.querySelectorAll(selector);

  if (current.length === 0) return document.body.replaceWith(target.body);

  const fetched = target.body.querySelectorAll(selector);

  current.forEach((node, i) => {

    if (!node.matches(nodes[i])) return;
    if (!dispatchEvent('pjax:render', { target: nodes[i] }, true)) return;

    node.replaceWith(fetched[i]);

    if (state.append || state.prepend) {

      const fragment = document.createElement('div');
      target.childNodes.forEach(fragment.appendChild);

      return state.append
        ? node.appendChild(fragment)
        : node.insertBefore(fragment, node.firstChild);

    }

  });

}

function hydrateNodes (target: Document, selectors: string[]) {

  const nodes = selectors.join(',');
  const current = document.body.querySelectorAll(nodes);

  if (current.length > 0) {
    const fetched = target.body.querySelectorAll(nodes);
    current.forEach((node, i) => node.replaceWith(fetched[i]));
  }

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

  if (store.config.prefetch.mouseover.enable) mouseover.stop();
  if (store.config.prefetch.intersect.enable) intersect.stop();

  const target = parse(store.snaps.get(state.snapshot));

  state.title = document.title = target.title || '';

  if (target.head) DOMHead(target.head);

  if (state.hydrate) {

    hydrateNodes(target, state.hydrate);

    const { url } = store.pages.update(state.url, { hydrate: undefined });
    store.snaps.clear(store.pages.clear([ url ]));

    console.log(store.pages.all);

  } else {

    renderNodes(state, target);

    target.body.querySelectorAll('[data-pjax-track]').forEach(appendTrackedNode);

    if (state.history) {

      if (!popstate) {
        if (state.url === state.location.lastpath) {
          history.replace(state.location, state);
        } else {
          history.push(state.location, state);
        }
      }

      scrollTo(state.position.x, state.position.y);

    }

  }

  progress.done();

  if (store.config.prefetch.mouseover.enable) mouseover.start();
  if (store.config.prefetch.intersect.enable) intersect.start();

  dispatchEvent('pjax:load', state);

  return state;

  // console.log(window.performance.measure('Render Time', 'render'))
  // console.log(window.performance.measure('Total', 'started'))
}
