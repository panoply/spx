/* -------------------------------------------- */
/* SETTERS                                      */
/* -------------------------------------------- */

import { Log } from '../shared/enums';
import { $ } from '../app/session';
import { m } from '../shared/native';
import { enqueue } from '../shared/utils';
import { setSnap } from '../app/queries';
import { log } from '../shared/logs';

export const snap = ((cache: Array<[element: HTMLElement, Map<string, string[]>]>) => {

  /**
   * Storage Record
   *
   * This reference consists of a selector and `data-spx` reference value.
   * The Map **key** is a selector whereas the `string[]` **value** represents
   * each reference to be assigned.
   */
  let record: Map<string, string[]> = m();

  /**
   * Set Attribute
   *
   * Applies the `data-spx` ref attribute to the snapshot record.
   * If ref already exists it will be concatenated.
   */
  const attr = (dom: HTMLElement, refs: string[]) =>

    dom.setAttribute($.qs.$ref, dom.hasAttribute($.qs.$ref)
      ? `${dom.getAttribute($.qs.$ref)},${refs.shift()}`
      : refs.shift());

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
  const add = (selector: string, ref: string, incremental = false) =>

    record.has(selector)
      ? record.get(selector).push(ref)
      : record.set(selector, [ ref ]);

  /**
   * Sync Snapshot
   *
   * This is a final cycle call which will use the references we have
   * created to update the snapshot DOM. This operation executes outside
   * the event loop 250ms after its triggered.
   */
  const sync = (snapshot: Document, key: string) => enqueue(() => {

    while (cache.length > 0) {

      const [ dom, marks ] = cache.shift();

      for (const [ selector, refs ] of marks) {
        dom.matches(selector) && attr(dom, refs);
        dom.querySelectorAll<HTMLElement>(selector).forEach(child => attr(child, refs));
      }

      marks.clear();

    }

    setSnap(snapshot.documentElement.outerHTML, key);

    log(Log.VERBOSE, `Snapshot ${$.page.key} updated for: ${$.page.snap}`);

  });

  return { set, add, sync };

})([]);
