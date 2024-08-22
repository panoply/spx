/* -------------------------------------------- */
/* SETTERS                                      */
/* -------------------------------------------- */

import { Log } from '../shared/enums';
import { $ } from '../app/session';
import { m } from '../shared/native';
import { forNode, onNextTick } from '../shared/utils';
import { setSnap } from '../app/queries';
import { log } from '../shared/logs';

/**
 * Reference Marker
 *
 * Tracks component elements within the snapshot. This class
 * will mark snapshots with `data-spx="*"` identifier references.
 */
export const snap = new class {

  /**
   * Storage Model
   */
  cache: Array<[element: HTMLElement, Map<string, string[]>]> = [];

  /**
   * Storage Record
   *
   * This reference consists of a selector and `data-spx` reference value.
   * The Map **key** is a selector whereas the `string[]` **value** represents
   * each reference to be assigned.
   */
  record: Map<string, string[]>;

  /**
   * Set Record
   *
   * Create a cached record for the snapshot element. An parameter DOM element
   * is expected to be passed. A `Map` reference will be created for each `data-spx`
   * reference we need to align in the snapshot.
   */
  set (element: HTMLElement) {
    this.cache.push([ element, m() ]);
    this.record = this.cache[this.cache.length - 1][1];
    return element;
  };

  /**
   * Add Reference
   *
   * Creates a new record and pushes a `data-spx` reference into the list, or
   * if no selector record exists, it will be created.
   */
  add (selector: string, ref: string, incremental = false) {

    this.record.has(selector)
      ? this.record.get(selector).push(ref)
      : this.record.set(selector, [ ref ]);

  };

  /**
   * Sync Snapshot
   *
   * This is a final cycle call which will use the references we have
   * created to update the snapshot DOM. This operation executes outside
   * the event loop 250ms after its triggered.
   */
  sync (snapshot: HTMLElement) {

    onNextTick(() => {

      while (this.cache.length > 0) {

        const [ dom, marks ] = this.cache.shift();

        for (const [ selector, refs ] of marks) {
          forNode(
            dom.querySelectorAll<HTMLElement>(selector),
            node => node.setAttribute($.qs.$ref, node.hasAttribute($.qs.$ref)
              ? `${node.getAttribute($.qs.$ref)},${refs.shift()}`
              : refs.shift())
          );
        }

        marks.clear();
      }

      setSnap(snapshot.ownerDocument.documentElement.outerHTML);

      log(Log.VERBOSE, `Snapshot ${$.page.key} updated for: ${$.page.snap}`);

    }, 250);

  }

}();
