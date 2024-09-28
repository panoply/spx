/* -------------------------------------------- */
/* SETTERS                                      */
/* -------------------------------------------- */

import { $, ctx } from './session';
import { m } from '../shared/native';
import { enqueue } from '../shared/utils';
import * as log from '../shared/logs';
import { Colors } from 'src/shared/enums';

/**
 * Set Attribute
 *
 * Applies the `data-spx` ref attribute to the snapshot record.
 * If ref already exists it will be concatenated.
 */
const attr = (dom: HTMLElement, refs: string[]) => dom.setAttribute($.qs.$ref,
  dom.hasAttribute($.qs.$ref)
    ? `${dom.getAttribute($.qs.$ref)},${refs.shift()}`
    : refs.shift());

export const replace = (key: number, snapshot: string) => {
  if (Reflect.set($.snaps, key, snapshot)) {
    log.debug(`Snapshot ${$.page.key} updated for: ${$.page.snap}`, Colors.GREEN);
  } else {
    log.warn(`Snapshot ${$.page.key} could not be updated for: ${$.page.snap}`);
  }
};
/**
 * Set Record
 *
 * Create a snap record for the snapshot element. An parameter DOM element
 * is expected to be passed. A `Map` reference will be created for each `data-spx`
 * reference we need to align in the snapshot.
 */
export const add = (element: HTMLElement) => {
  ctx.snaps.push([ element, m() ]);
  return element;
};

/**
 * Add Reference
 *
 * Creates a new record and pushes a `data-spx` reference into the list, or
 * if no selector record exists, it will be created.
 */
export const ref = (selector: string, reference: string) =>

  ctx.refs.has(selector)
    ? ctx.refs.get(selector).push(reference)
    : ctx.refs.set(selector, [ reference ]);

/**
 * Sync Snapshot
 *
 * This is a final cycle call which will use the references we have
 * created to update the snapshot DOM. This operation executes outside
 * the event loop 250ms after its triggered.
 */
export const update = (snapshot: Document, key: number) => enqueue(() => {

  while (ctx.snaps.length > 0) {

    const [ dom, marks ] = ctx.snaps.shift();

    for (const [ selector, dataspx ] of marks) {
      dom.matches(selector) && attr(dom, dataspx);
      dom.querySelectorAll<HTMLElement>(selector).forEach(child => attr(child, dataspx));
    }

    marks.clear();

  }

  replace(key, snapshot.documentElement.outerHTML);

});
