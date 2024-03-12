import type { Page } from 'types';
import { $ } from './session';
import { emit } from './events';
import { log } from '../shared/logs';
import { empty, uuid, hasProp, forEach, hasProps, targets, ts, selector, isEmpty } from '../shared/utils';
import { assign, o, isArray, defineProps } from '../shared/native';
import { LogType, VisitType } from '../shared/enums';
import { parse, getTitle } from '../shared/dom';
import * as history from '../observe/history';
import * as fragments from '../observe/fragment';
import { SPX } from '../../types/components';
import { hook } from '../observe/components';

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
export function create (page: Page): Page {

  const has = hasProps(page);

  page.ts = ts();
  page.target = targets(page);

  // assign the selector reference if it is undefined
  if (!has('selector')) {
    if (page.target[0] === 'body') {
      page.selector = 'body';
    } else {
      page.selector = selector(page.target);
    }
  }

  if ($.config.cache) {
    if (!has('cache')) page.cache = $.config.cache;
    if (!has('snap')) page.snap = uuid();
  }

  if (!has('scrollY')) page.scrollY = 0;
  if (!has('scrollX')) page.scrollX = 0;

  if ($.config.hover !== false && page.type === VisitType.HOVER) {
    if (!has('threshold')) {
      page.threshold = $.config.hover.threshold;
    }
  }

  if ($.config.proximity !== false && page.type === VisitType.PROXIMITY) {
    if (!has('proximity')) page.proximity = $.config.proximity.distance;
    if (!has('threshold')) page.threshold = $.config.proximity.threshold;
  }

  if ($.config.progress && !has('progress')) {
    page.progress = $.config.progress.threshold;
  }

  if (!has('fragments')) page.fragments = $.config.fragments;
  if (!has('history')) page.history = true;
  if (!has('visits')) page.visits = 0;
  if (!has('components')) page.components = [];

  $.pages[page.key] = page;

  return $.pages[page.key];

}

/**
 * New Page Session
 *
 * Clones a page but applies a reset on the provided keys, changing them to
 * the connection defaults.
 */
export function newPage (page: Page) {

  const state = assign<Page, Partial<Page>>(o(page), {
    target: [],
    selector: null,
    cache: $.config.cache,
    history: true,
    scrollX: 0,
    scrollY: 0,
    fragments: $.config.fragments
  });

  if ($.config.hover) {
    state.threshold = $.config.hover.threshold;
  }

  if ($.config.proximity) {
    state.proximity = $.config.proximity.distance;
    state.threshold = $.config.proximity.threshold;
  }

  if ($.config.progress) {
    state.progress = $.config.progress.threshold;
  }

  return state;

}

/**
 * Patch Session Page
 *
 * Updates a page record, applies an augmentation to the **current** page by default
 * looking up the key with the `history.state` reference.
 */
export function patchPage <T extends keyof Page> (
  prop: T,
  value: T extends 'components' ? string[] : Page[T],
  key = history.api.state.key
) {

  if (prop === 'location') {
    $.pages[key][prop] = assign($.pages[key][prop], value);
  } else if (prop === 'target') {
    $.pages[key].target = targets(value);
    $.pages[key].selector = selector($.pages[key].target);
  } else if (prop === 'components') {
    $.pages[key].components = value;
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
export function set (state: Page, snapshot: string): Page {

  const event = emit('before:cache', state, snapshot as any);
  const dom = typeof event === 'string' ? event : snapshot;

  // VisitTypes above 5 are prefetch/trigger kinds.
  // We need to augment the page store to align with the record we are handling.
  if (state.type > VisitType.POPSTATE) {

    // VisitTypes above 9 are prefetch kinds
    // we need to update the type reference
    if (state.type > VisitType.RELOAD) {
      state.type = VisitType.PREFETCH;
    }
  }

  // Update to document title
  state.title = getTitle(snapshot);

  // If cache is disabled or the lifecycle event
  // returned a boolean false values we will return the record
  if (!$.config.cache || event === false) return state;
  if (!('snap' in state)) return update(state, dom);

  // Lets assign this record to the session store
  $.pages[state.key] = state;
  $.snaps[state.snap] = dom;

  fragments.snapshots(state);

  emit('after:cache', state);
  hook('oncache', state);

  return state;

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
export function update (page: Page, snapshot?: string): Page {

  const state = page.key in $.pages ? $.pages[page.key] : create(page);

  if (typeof snapshot === 'string') {
    $.snaps[state.snap] = snapshot;
    page.title = getTitle(snapshot);
  }

  return assign(state, page);

}

export function setSnap (snapshot: string, key?: string) {

  const snap = key = key
    ? key.charCodeAt(0) === 47
      ? key in $.pages ? $.pages[key].snap : null
      : key
    : $.page.snap;

  if (snap) {
    $.snaps[snap] = snapshot;
  } else {
    log(LogType.WARN, 'Snapshot record does not exist, update failed');
  }

}

/**
 * Get Session
 *
 * Returns the in-memory (session) page store and a parsed document snapshot.
 * Optionally accepts a url `key` reference to retrieve a specific page. If `key` is
 * `undefined` (i.e, not provided), the current page is returned according to the
 * `history.state` reference. If no `key` exists an error is thrown.
 */
export function get (key?: string): { page: Page, dom: Document } {

  if (!key) {
    if (history.api.state === null) {
      log(LogType.WARN, 'Missing history state reference, page cannot be returned');
      return;
    }

    key = history.api.state.key;

  }

  if (key in $.pages) {

    return defineProps(o(), {
      page: {
        get: () => $.pages[key]
      },
      dom: {
        get: () => parse($.snaps[$.pages[key].snap])
      }
    });

  }

  log(LogType.ERROR, `No record exists: ${key}`);

}

/**
 * Get Snapshot DOM
 *
 * Returns a snapshot DOM. Optionally accepts a page `key` to return a specific
 * snapshot DOM record OR a `snap` UUID
 */
export function getSnapDom (key?: string): Document {

  // character code 47 is / which infers page key.
  const uuid = key = key ? key.charCodeAt(0) === 47 ? $.pages[key].snap : key : $.page.snap;

  return parse($.snaps[uuid]);

}

/**
 * Get Mounted Components
 *
 * Returns an array list of component intances which are currently
 * mounted (active) on the page.
 */
export function getMounted ({ mounted = null } = {}): { [instanceOf: string]: SPX.Class[] } {

  const mounts: { [instanceOf: string]: SPX.Class[] } = o();

  for (const instance of $.components.$instances.values()) {

    const { scope } = instance;

    if (!$.components.$connected.has(scope.key)) continue;

    if (mounted !== null && scope.mounted === mounted) continue;

    if (scope.alias !== null && !(scope.alias in mounts)) {

      mounts[scope.alias] = [ instance ];

    } else {
      if (!(scope.instanceOf in mounts)) {
        mounts[scope.instanceOf] = [ instance ];
      } else {
        mounts[scope.instanceOf].push(instance);
      }
    }

  }

  return isEmpty(mounts) ? null : mounts;
}

/**
 * Get Session
 *
 * Returns the in-memory (session) page. Optionally accepts a url `key` reference to
 * retrieve a specific page. If `key` is `undefined` (i.e, not provided), the current
 * page is returned according to the `history.state` reference.
 */
export function getPage (key?: string): Page {

  if (!key) {
    if (history.api.state === null) {
      log(LogType.WARN, 'Missing history state reference, page cannot be returned');
      return;
    }

    key = history.api.state.key;
  }

  if (key in $.pages) return $.pages[key];

  log(LogType.ERROR, `No page record exists for: ${key}`);

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
    hasProp($.pages[key], 'snap') &&
    hasProp($.snaps, $.pages[key].snap) &&
    typeof $.snaps[$.pages[key].snap] === 'string'
  );

}

/**
 * Purge Session
 *
 * Clears all records from store excluding the passed `keys[]`.
 * or `key` Returns a list of snapshots that remain.
 */
export function purge (key: string | string[]) {

  const keys = isArray(key) ? key : [ key ];

  for (const p in $.pages) {
    const index = keys.indexOf(p);
    if (index >= 0) {
      delete $.snaps[$.pages[p].snap];
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

    delete $.snaps[$.pages[key].snap];
    delete $.pages[key];

  } else if (isArray(key)) {

    forEach(url => {

      delete $.snaps[$.pages[url].snap];
      delete $.pages[url];

    }, key);
  }
}
