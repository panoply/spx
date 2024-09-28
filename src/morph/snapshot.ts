import type { ComponentBinds, Scope } from 'types';
import { $ } from '../app/session';
import * as log from '../shared/logs';
import { onNextTick } from '../shared/utils';
import * as q from '../app/queries';
import { Colors } from 'src/shared/enums';
import { replace } from '../app/snapshot';

/**
 * Morph Bindings
 *
 * Updates `spx-bind` elements in snapshot references.
 */
export function morphBinds (cRef: string, bind: ComponentBinds, value: string) {

  const { page, dom } = q.get();
  const curDom = dom.body.querySelector<HTMLElement>(bind.selector);

  if (curDom) {
    curDom.innerText = value;
    replace(page.snap, curDom.ownerDocument.documentElement.outerHTML);
    log.debug(`Components binded node in snapshot was updated: ${value}`, Colors.GREEN);
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
export const patchComponentSnap = (scope: Scope, scopeKey: string) => onNextTick(() => {

  const snap = q.getSnapDom(scope.snap);
  const dom = snap.querySelector<HTMLElement>(`[${$.qs.$ref}="${scope.ref}"]`);

  if (dom) {
    dom.innerHTML = scope.snapshot;
    replace(scope.snap, dom.ownerDocument.documentElement.outerHTML);
  } else {
    log.warn(`Component snapshot merge failed: ${scope.instanceOf} (${scopeKey})`);
  }

});

/**
 * Insert Node Snapshot
 *
 * Updates DOM elements contained in snapshot cache.
 */
export const morphHead = (method: 'removeChild' | 'appendChild', newNode: HTMLElement | Node) => {

  const { page, dom } = q.get($.page.key);
  const operation = method.charCodeAt(0) === 114 ? 'removed' : 'appended';

  if (dom.head.contains(newNode)) {

    dom.head[method](newNode);

    replace(page.snap, dom.documentElement.outerHTML);
    log.debug(`Snapshot record was updated, ${operation} ${newNode.nodeName.toLowerCase()} from <head>`);

  } else {
    log.warn('Node does not exist in the snapshot record, snapshot morph skipped', newNode);
  }

};
