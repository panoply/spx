import type { ComponentBinds, Scope } from 'types';
import { $ } from '../app/session';
import { log } from '../shared/logs';
import { Log } from '../shared/enums';
import { onNextTick } from '../shared/utils';
import * as q from '../app/queries';

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
//         log(Log.VERBOSE, `Binding reference in snapshot ${bind.key} was applied`, '#fff');
//       }
//     }

//     for (const ref in nodes) {

//       const item = nodes[ref];
//       const selector = `[${$.qs.$node}*=${escSelector(`${instanceOf}.${item.keyProp}`)}]`;
//       const node = (item.isChild ? element : snapDom).querySelector(selector);

//       if (node.getAttribute($.qs.$ref) !== item.key) {
//         node.setAttribute($.qs.$ref, item.key);
//         log(Log.VERBOSE, `Node reference in snapshot ${item.key} was applied`, '#fff');
//       }
//     }

//     if (element.getAttribute($.qs.$ref) !== attrRef) {
//       element.setAttribute($.qs.$ref, attrRef);
//       log(Log.VERBOSE, `Component reference in snapshot ${page.snap} was applied`, '#fff');
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
  const elem = dom.body.querySelector<HTMLElement>(bind.selector);

  if (elem) {

    elem.innerText = value;
    q.setSnap(elem.ownerDocument.documentElement.outerHTML, page.snap);
    log(Log.VERBOSE, `Components binded node in snapshot was updated: ${value}`);

  } else {
    // TODO: FAILED
  }

}

/**
 * Snapshot Component Merge
 *
 * Updates the component snapshot innerHTML. This will apply when a components `{ define: merge }`
 * is set to `true` and executes outside the event-loop either after the component `unmount()` hook
 * has fired or if no lifecycle hook is defined within a component, it will fire when resetting
 * the `mounted` enum within the component scope reference.
 */
export function patchComponentSnap (scope: Scope, scopeKey: string) {

  onNextTick(() => {

    const snap = q.getSnapDom(scope.snap);
    const elem = snap.querySelector<HTMLElement>(`[${$.qs.$ref}="${scope.ref}"]`);
    // console.log(snap, elem);
    if (elem) {
      elem.innerHTML = scope.snapshot;
      q.setSnap(elem.ownerDocument.documentElement.outerHTML, scope.snap);
    } else {
      log(Log.WARN, `Component snapshot merge failed: ${scope.instanceOf} (${scopeKey})`);
    }

  });
}

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

    log(Log.VERBOSE, `Snapshot record was updated. Node ${operation} from <head>`, newNode);

  } else {
    log(Log.WARN, 'Node does not exist in the snapshot record, no mutation applied', newNode);
  }

}
