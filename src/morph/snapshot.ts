import type { IComponentBinds } from '../types/components';
import { isDirective } from '../components/context';
import { escSelector, onNextTick } from '../shared/utils';
import { log } from '../shared/logs';
import { Errors } from '../shared/enums';
import { $ } from '../app/session';
import * as q from '../app/queries';

export function markSnap (nodes: string[]) {

  onNextTick(() => morphSnap(q.getSnapDom($.page.key).body, nodes));

}

export function markComponents (datasets: Array<[string, string]>) {

  const { instances } = $.components;
  const { page, dom } = q.get();
  const snapDom = dom.body;

  for (const [ selector, key ] of datasets) {

    const instance = instances.get(key);
    const attrRef = instance.dom.getAttribute($.qs.$ref);
    const element = snapDom.querySelector(selector);
    const {
      instanceOf,
      binds,
      nodes
    } = instance.scope;

    for (const ref in binds) {

      const bind = binds[ref];
      const selector = `[${$.qs.$bind}=${escSelector(`${instanceOf}.${bind.stateKey}`)}]`;
      const node = (bind.isChild ? element : snapDom).querySelector(selector);

      if (node.getAttribute($.qs.$ref) !== bind.key) {
        node.setAttribute($.qs.$ref, bind.key);
        log(Errors.TRACE, `Binding reference in snapshot ${bind.key} was applied`, '#fff');
      }
    }

    for (const ref in nodes) {

      const item = nodes[ref];
      const selector = `[${$.qs.$node}*=${escSelector(`${instanceOf}.${item.keyProp}`)}]`;
      const node = (item.isChild ? element : snapDom).querySelector(selector);

      if (node.getAttribute($.qs.$ref) !== item.key) {
        node.setAttribute($.qs.$ref, item.key);
        log(Errors.TRACE, `Node reference in snapshot ${item.key} was applied`, '#fff');
      }
    }

    if (element.getAttribute($.qs.$ref) !== attrRef) {
      element.setAttribute($.qs.$ref, attrRef);
      log(Errors.TRACE, `Component reference in snapshot ${page.snap} was applied`, '#fff');
    }
  }

  q.setSnap(dom.documentElement.outerHTML);

}

/**
 * Morph Bindings
 *
 * Updates `spx-bind` elements in snapshot references.
 */
export function morphBinds (cRef: string, bind: IComponentBinds, value: string) {

  const { page, dom } = q.get();
  const { body } = dom;

  body.querySelector<HTMLElement>(bind.selector).innerText = value;

  log(Errors.TRACE, `Binding node in snapshot was updated: ${value}`);

  $.snaps[page.snap] = dom.documentElement.outerHTML;

}

/**
 * Morph Snapshot
 *
 * Walks the snapshot and update DOM Elements with reference datasets.
 */
export function morphSnap (snapNode: Element, nodes: string[]) {

  let i: number;
  let s: Element;

  if (snapNode.firstElementChild) {
    i = 0;
    s = snapNode.children[i];
  }

  while (s) {

    if ((s.nodeName === 'svg' || s.nodeName === 'CODE') && s.childElementCount > 0) {
      i = 0;
      s = s.nextElementSibling;
    }

    if (s) {

      if (isDirective(s.attributes)) {

        const nodeRef = nodes.shift();
        const domNode = $.components.elements.get(nodeRef);
        const snapAttr = s.getAttribute($.qs.$ref);
        const domAttr = domNode.getAttribute($.qs.$ref);

        if (snapAttr !== domAttr) {
          s.setAttribute($.qs.$ref, domNode.getAttribute($.qs.$ref));
        }

        if (nodes.length === 0) {
          q.setSnap(s.ownerDocument.documentElement.outerHTML);
          log(Errors.TRACE, 'Snapshot updated');
          break;
        }
      }

      morphSnap(s, nodes);

    }

    s = snapNode.children[++i];

  }

};

/**
 * Insert Node Snapshot
 *
 * Updates DOM elements contained in snapshot cache.
 */
export function morphHead (method: 'removeChild' | 'appendChild', newNode: HTMLElement | Node) {

  const { page, dom } = q.get($.page.key);
  const operation = method.charCodeAt(0) === 114 ? 'removed' : 'appended';

  if (dom.head.contains(newNode)) {

    dom.head[method](newNode);

    $.snaps[page.snap] = dom.documentElement.outerHTML;

    log(Errors.TRACE, `Snapshot record was updated. Node ${operation} from <head>`, newNode);
  } else {
    log(Errors.WARN, 'Node does not exists in snapshot record, no mutation applied', newNode);
  }

}
