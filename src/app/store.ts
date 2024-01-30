import { IPage } from '../types/page';
import { emit } from './events';
import { empty, uuid, hasProp, log, forEach, hasProps, targets, ts } from '../shared/utils';
import { assign, o, isArray, defineProps } from '../shared/native';
import { $ } from './session';
import { Errors, EventType } from '../shared/enums';
import { parse, getTitle } from '../shared/dom';
import * as history from '../observers/history';
import { morph } from '../morph/morph';

/**
 * Create Session Page
 *
 * Generates a page state record which will be written to our `pages` store and history state.
 * This is called for all new SPX visits to locations that do not exist in the session.
 *
 * This function will typically be triggered following a call to `getRoute`. The `getRoute()`
 * will have assigned the location information and in addition any attribute annotations passed
 * on the intercepted `<a href="*"></a>` element.
 *
 * The function will assign options in accordance to the SPX connection if they did not exist in
 * the `page` state value that was passed.
 */
export function create (page: IPage): IPage {

  const has = hasProps(page);

  page.components = [];
  page.target = targets(page);
  page.ts = ts();

  if ($.config.cache) {
    if (!has('cache')) page.cache = $.config.cache;
    if (!has('uuid')) page.uuid = uuid();
  }

  if (!has('scrollY')) page.scrollY = 0;
  if (!has('scrollX')) page.scrollX = 0;

  if ($.config.hover !== false && page.type === EventType.HOVER) {
    if (!has('threshold')) {
      page.threshold = $.config.hover.threshold;
    }
  }

  if ($.config.proximity !== false && page.type === EventType.PROXIMITY) {
    if (!has('proximity')) page.proximity = $.config.proximity.distance;
    if (!has('threshold')) page.threshold = $.config.proximity.threshold;
  }

  if ($.config.progress && !has('progress')) {
    page.progress = $.config.progress.threshold;
  }

  if (!has('visits')) page.visits = 0;

  $.pages[page.key] = page;

  return $.pages[page.key];

}

/**
 * Patch Session Page
 *
 * Updates a page record, applies an augmentation to the **current** page by default
 * looking up the key with the `history.state` reference.
 */
export function patch <T extends keyof IPage> (prop: T, value: IPage[T], key = history.api.state.key) {

  if (prop === 'location') {
    $.pages[key][prop] = assign($.pages[key][prop], value);
  } else {
    $.pages[key][prop] = value;
  }

  return $.pages[key];

}

/**
 * Set Session Page and Snapshot
 *
 * Writes the page to memory. New visits are defined by an event dispatched from a `href` link.
 * Both a new page visit or subsequent visit will pass through this function. This will be called
 * after an XHR fetch completes or when state is to be added to the session memory.
 */
export function set (state: IPage, snapshot: string): IPage {

  const event = emit('before:cache', state, snapshot as any);
  const dom = typeof event === 'string' ? event : snapshot;

  // EventTypes above 5 are prefetch/trigger kinds.
  // We need to augment the page store to align with the record we are handling.
  if (state.type > EventType.POPSTATE) {

    // EventTypes above 9 are prefetch kinds
    // we need to update the type reference
    if (state.type > EventType.RELOAD) {

      state.type = EventType.PREFETCH;

    }
  }

  // Update to document title
  state.title = getTitle(snapshot);

  // If cache is disabled or the lifecycle event
  // returned a boolean false values we will return the record
  if (!$.config.cache || event === false) return state;
  if (!hasProp(state, 'uuid')) return update(state, dom);

  // Lets assign this record to the session store
  $.pages[state.key] = state;
  $.snaps[state.uuid] = dom;

  emit('after:cache', state);

  return state;

}

/**
 * Update Snapshot
 *
 * Updates DOM elements contained in snapshot cache.
 */
export function snapshot (key: string, selector: string, newNode: HTMLElement) {

  const { page, dom } = get(key);
  const oldNode = dom.body.querySelector<HTMLElement>(selector);

  if (oldNode) {
    morph(oldNode, newNode);
    $.snaps[page.uuid] = dom.documentElement.outerHTML;
  }

}

/**
 * Update Session Page/Snapshot
 *
 * Update the page state and (optionally) its snapshot. The passed in state value expects
 * **route** values, so the `page` parameter must contain the following references:
 *
 * - `key`
 * - `rev`
 * - `type`
 * - `location`
 *
 * Typicaly, this function is used to augment the in-memory store and as such an already
 * generated record should be provided. At the absolute very least, we need to pass a generated `route`
 * that was created via `getRoute()` location function.
 */
export function update (page: IPage, snapshot?: string): IPage {

  const state = hasProp($.pages, page.key) ? $.pages[page.key] : create(page);

  page.target = targets(page);
  page.visits = page.visits + 1;

  if (typeof snapshot === 'string') {
    $.snaps[state.uuid] = snapshot;
    page.title = getTitle(snapshot);
  }

  return assign(state, page);

}

/**
 * Returns a page snapshot parsed dom helper closure. By default, returns the current
 * in-memory dom. An option `targets` parameter will return specific
 * nodes.
 */
export function dom (page: IPage): {
  get dom(): Document;
  get page(): IPage
} {

  const snapshot = parse($.snaps[page.uuid]);

  return defineProps(o(), {
    page: { get: () => page },
    dom: { get: () => snapshot }
  });

}

/**
 * Get Session
 *
 * Returns the in-memory (session) page store and a parsed document snapshot.
 * Optionally accepts a url `key` reference to retrieve a specific page. If `key` is
 * `undefined` (i.e, not provided), the current page is returned according to the
 * `history.state` reference. If no `key` exists an error is thrown.
 */
export function get (key?: string): { page: IPage, dom: Document } {

  if (!key) {
    if (history.api.state === null) {
      log(Errors.WARN, 'Missing history state reference, page cannot be returned');
      return;
    }

    key = history.api.state.key;
  }

  if (hasProp($.pages, key)) return dom($.pages[key]);

  log(Errors.ERROR, `No record exists: ${key}`);

}

/**
 * Has Session
 *
 * Determines whether or not a `page` and `snapshot` exist for the passed in `key` reference.
 * This is used to inform SPX on what operations need to be carried out.
 */
export function has (key: string): boolean {

  return (
    hasProp($.pages, key) &&
    hasProp($.pages[key], 'uuid') &&
    hasProp($.snaps, $.pages[key].uuid) &&
    typeof $.snaps[$.pages[key].uuid] === 'string'
  );

}

/**
 * Purge Session
 *
 * Clears all records from store excluding the passed `keys[]`.
 * or `key` Returns a list of snapshots that remain.
 */
export function purge (key: string | string[] = []) {

  const keys = isArray(key) ? key : [ key ];

  for (const p in $.pages) {
    const index = keys.indexOf(p);
    if (index >= 0) {
      delete $.snaps[$.pages[p].uuid];
      delete $.pages[p];
      keys.splice(index, 1);
    }
  }

}

/**
 * Clear Session
 *
 * Removes pages and snapshots from the in-memory session
 * store. Optionally accepts a single `key` value or a `string[]`
 * list of `key` values and when provided will remove those
 * records passed.
 */
export function clear (key?: string[] | string): void {

  if (!key) {

    empty($.pages);
    empty($.snaps);

  } else if (typeof key === 'string') {

    delete $.snaps[$.pages[key].uuid];
    delete $.pages[key];

  } else if (isArray(key)) {

    forEach(url => {

      delete $.snaps[$.pages[url].uuid];
      delete $.pages[url];

    }, key);
  }
}
