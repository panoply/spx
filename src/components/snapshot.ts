/* -------------------------------------------- */
/* SETTERS                                      */
/* -------------------------------------------- */

import { LogType } from '../shared/enums';
import { $ } from '../app/session';
import { m } from '../shared/native';
import { forNode, onNextTick } from '../shared/utils';
import { setSnap } from '../app/queries';
import { log } from '../shared/logs';

function MarkSnapshots () {

  /**
   * Storage Model
   */
  const cache: Array<[element: HTMLElement, Map<string, string[]>]> = [];

  /**
   * Storage Record
   *
   * This reference consists of a selector and `data-spx` reference value.
   * The Map **key** is a selector whereas the `string[]` **value** represents
   * each reference to be assigned.
   */
  let record: Map<string, string[]>;

  /**
   * Set Record
   *
   * Create a cached record for the snapshot element. An parameter DOM element
   * is expected to be passed. A `Map` reference will be created for each `data-spx`
   * reference we need to align in the snapshot.
   */
  const set = (element: HTMLElement) => {

    cache.push([ element, m() ]);
    record = cache[cache.length - 1][1];

    return element;

  };

  /**
   * Add Reference
   *
   * Creates a new record and pushes a `data-spx` reference into the list, or
   * if no selector record exists, it will be created.
   */
  const add = (selector: string, ref: string, incremental = false) => {

    if (!record.has(selector)) record.set(selector, []);

    record.get(selector).push(ref);

  };

  /**
   * Sync Snapshot
   *
   * This is a final cycle call which will use the references we have
   * created to update the snapshot DOM. This operation executes outside
   * the event loop.
   */
  const sync = (snapshot: HTMLElement) => onNextTick(() => {

    while (cache.length > 0) {

      const [ dom, marks ] = cache.shift();

      for (const [ selector, refs ] of marks) {
        forNode(dom.querySelectorAll<HTMLElement>(selector), (node) => {
          const attrValue = node.getAttribute($.qs.$ref);
          if (attrValue) {
            node.setAttribute($.qs.$ref, `${attrValue},${refs.shift()}`);
          } else {
            node.setAttribute($.qs.$ref, refs.shift());
          }
        });
      }

      marks.clear();

    }

    setSnap(snapshot.ownerDocument.documentElement.outerHTML);

    log(LogType.VERBOSE, `Snapshot ${$.page.key} updated for: ${$.page.snap}`);

  });

  return {
    set,
    add,
    sync
  };
}

/**
 * Reference Marker
 *
 * Tracks component elements within the snapshot. This class
 * will mark snapshots with `data-spx="*"` identifier references.
 */
export const snap = MarkSnapshots();
