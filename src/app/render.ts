import loadjs from 'loadjs';
import { forEach } from './utils';
import { dispatchEvent } from './events';
import { progress } from './progress';
import { IPage } from '../types';
import history from 'history/browser';
import { store } from './store';
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
function observeHead (mutations: MutationRecord[], observer: MutationObserver): void {

  for (const mutation of mutations) {

    if (mutation.type === 'childList') {

      mutation.addedNodes.forEach(node => {
        if (node.nodeName === 'SCRIPT') {
          if (node instanceof HTMLElement) {
            node.setAttribute('data-pjax-eval', 'false');
          }
        }
      });
    } else if (mutation.type === 'attributes') {
      console.log('The ' + mutation.attributeName + ' attribute was modified.');
    }
  }
};

/**
 * DOM Scripts elements, eg: `<script>` - We will parse
 * all load all scripts for each navigation. We lean on
 * the powerful little module known as `loadjs` for script
 * execution and tracking
 */
function DOMScripts ({ src, id = src }: HTMLScriptElement): void {

  if (!loadjs.isDefined(id)) {
    loadjs(src, id, {
      before: (_, script) => script.setAttribute('data-pjax-eval', 'false'),
      success: () => dispatchEvent('pjax:script', { id }),
      error: (path) => console.error(`Pjax: Failed to load script ${path} `),
      numRetries: 1
    });
  }
};

/**
 * DOM Head Nodes
 */
function DOMHeadNodes (nodes: string[], { ...children }: HTMLHeadElement): string {

  forEach(DOMNode => {
    if (DOMNode.tagName === 'TITLE') return null;
    if (DOMNode.getAttribute('data-pjax-eval') !== 'false') {
      const index = nodes.indexOf(DOMNode.outerHTML);
      index === -1 ? DOMNode.parentNode.removeChild(DOMNode) : nodes.splice(index, 1);
    }
  })(children);

  return nodes.join('');

};

/**
 * DOM Head
 */
function DOMHead ({ children }: HTMLHeadElement): void {

  const targetNodes = Array.from(children).reduce((arr, node) => {

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

  })(Array.from(fragment.children));

};

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

};

/**
 * Apply actions to the documents target fragments
 * with the request response.
 */
function replaceTarget (target: Element, state: IPage): (DOM: Element) => void {

  return DOM => {

    if (dispatchEvent('pjax:render', { target }, true)) {

      DOM.innerHTML = target.innerHTML;

      if (state?.append || state?.prepend) {
        const fragment = document.createElement('div');

        forEach(node => fragment.appendChild(node))([ ...target.childNodes ]);

        state.append
          ? DOM.appendChild(fragment)
          : DOM.insertBefore(fragment, DOM.firstChild);

      }
    }
  };
};

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
export async function capture ({ url, snapshot }: IPage) {

  if (store.has(url, { snapshot: true })) {
    const target = parse(store.snapshot(snapshot));
    target.body.innerHTML = document.body.innerHTML;
    store.set.snapshots(snapshot, target.documentElement.outerHTML);
  }

};

/**
 * Observe Head Element
 */
// const observer = new MutationObserver(observeHead)

/**
   * Observe Head Element
   */
// observer.observe(document.head, { attributes: true, childList: true, subtree: true })

/**
 * Update the DOM and execute page adjustments
 * to new navigation point
 */
export function update (state: IPage, popstate?: boolean): void {

  // console.log(state)
  // window.performance.mark('render')
  // console.log(window.performance.measure('time', 'start'))

  if (store.config.prefetch.mouseover.enable) mouseover.stop();
  if (store.config.prefetch.intersect.enable) intersect.stop();
  // observer.disconnect()

  const target = parse(store.snapshot(state.snapshot));
  state.title = document.title = target?.title || '';

  if (!popstate && state.history) {
    if (state.url === state.location.lastpath) {
      history.replace(state.location, state);
    } else {
      history.push(state.location, state);
    }
  }

  if (target?.head) DOMHead(target.head);

  // Later, you can stop observing

  let fallback = 1;

  forEach(element => {

    const node = target.body.querySelector(element);

    node
      ? forEach(replaceTarget(node, state))(document.body.querySelectorAll(element))
      : fallback++;

  }, state?.replace ? [ ...state.targets, ...state.replace ] : state.targets);

  if (Object.is(fallback, state.targets.length)) {
    replaceTarget(target.body, state)(document.body);
  }

  // APPEND TRACKED NODES
  target.body.querySelectorAll('[data-pjax-track]').forEach(appendTrackedNode);

  window.scrollTo(state.position.x, state.position.y);

  progress.done();

  if (store.config.prefetch.mouseover.enable) mouseover.start();
  if (store.config.prefetch.intersect.enable) intersect.start();

  dispatchEvent('pjax:load', state);

  // console.log(window.performance.measure('Render Time', 'render'))
  // console.log(window.performance.measure('Total', 'started'))

};
