import type { ComponentBinds } from '../types/components';
import { isDirective } from '../components/context';
import { log } from '../shared/logs';
import { LogType } from '../shared/enums';
import { $ } from '../app/session';
import * as q from '../app/queries';
import { walkElements } from './walk';

// export function markComponents (datasets: Array<[string, string]>) {

//   const { instances } = $.components;
//   const { page, dom } = q.get();
//   const snapDom = dom.body;

//   for (const [ selector, key ] of datasets) {

//     const instance = instances.get(key);
//     const attrRef = instance.dom.getAttribute($.qs.$ref);
//     const element = snapDom.querySelector(selector);
//     const {
//       instanceOf,
//       binds,
//       nodes
//     } = instance.scope;

//     for (const ref in binds) {

//       const bind = binds[ref];
//       const selector = `[${$.qs.$bind}=${escSelector(`${instanceOf}.${bind.stateKey}`)}]`;
//       const node = (bind.isChild ? element : snapDom).querySelector(selector);

//       if (node.getAttribute($.qs.$ref) !== bind.key) {
//         node.setAttribute($.qs.$ref, bind.key);
//         log(LogType.VERBOSE, `Binding reference in snapshot ${bind.key} was applied`, '#fff');
//       }
//     }

//     for (const ref in nodes) {

//       const item = nodes[ref];
//       const selector = `[${$.qs.$node}*=${escSelector(`${instanceOf}.${item.keyProp}`)}]`;
//       const node = (item.isChild ? element : snapDom).querySelector(selector);

//       if (node.getAttribute($.qs.$ref) !== item.key) {
//         node.setAttribute($.qs.$ref, item.key);
//         log(LogType.VERBOSE, `Node reference in snapshot ${item.key} was applied`, '#fff');
//       }
//     }

//     if (element.getAttribute($.qs.$ref) !== attrRef) {
//       element.setAttribute($.qs.$ref, attrRef);
//       log(LogType.VERBOSE, `Component reference in snapshot ${page.snap} was applied`, '#fff');
//     }
//   }

//   q.setSnap(dom.documentElement.outerHTML);

// }

/**
 * Morph Bindings
 *
 * Updates `spx-bind` elements in snapshot references.
 */
export function morphBinds (cRef: string, bind: ComponentBinds, value: string) {

  const { page, dom } = q.get();
  const { body } = dom;

  body.querySelector<HTMLElement>(bind.selector).innerText = value;

  log(LogType.VERBOSE, `Binding node in snapshot was updated: ${value}`);

  $.snaps[page.snap] = dom.documentElement.outerHTML;

}

export function patchSnap (snapNode: Element, pageNode: Element, nodes: string[], morphs: Set<Element>) {

  let i: number;
  let s: Element;
  let d: Element;

  if (snapNode.firstElementChild) {
    i = 0;
    s = snapNode.children[i];
    d = pageNode.children[i];
  }

  while (s) {

    if (s) {

      if (morphs.has(d)) {

        morphSnap(s, nodes, true);
        morphs.delete(d);

      } else if (d.hasAttribute($.qs.$ref)) {

        s.setAttribute(
          $.qs.$ref,
          d.getAttribute($.qs.$ref)
        );

      }

      patchSnap(s, d, nodes, morphs);

    }

    s = snapNode.children[++i];
    d = pageNode.children[i];

  }

};

/**
 * Morph Snapshot
 *
 * Walks the snapshot and update DOM Elements with reference datasets.
 */
export function morphSnap (snapNode: Element, nodes: string[], isPatch = false) {

  const { $elements } = $.components;

  walkElements(snapNode, (node) => {

    if (node.getAttribute('spx-snapshot') === 'false') return;

    if (isDirective(node.attributes) && !node.hasAttribute($.qs.$ref)) {

      const nodeRef = nodes.shift();

      if (!nodeRef) {
        log(LogType.ERROR, 'Undefined reference, the snapshot record failed to align', node);
      }

      if ($elements.has(nodeRef)) {

        const snapAttr = node.getAttribute($.qs.$ref);
        const domNode = $elements.get(nodeRef);
        const domAttr = domNode.getAttribute($.qs.$ref);

        if (snapAttr !== domAttr) {
          node.setAttribute($.qs.$ref, domAttr);
        }

        if (nodes.length === 0) {

          if (isPatch === false) {
            q.setSnap(node.ownerDocument.documentElement.outerHTML);
            log(LogType.VERBOSE, `Snapshot ${$.page.key} updated for: ${$.page.snap}`);
          }

          return false;

        }

      } else {
        log(LogType.ERROR, 'Undefined reference, the snapshot record failed to align', node);
      }
    }

  });

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

    log(LogType.VERBOSE, `Snapshot record was updated. Node ${operation} from <head>`, newNode);
  } else {
    log(LogType.WARN, 'Node does not exists in snapshot record, no mutation applied', newNode);
  }

}
