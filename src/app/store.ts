import { IPage } from '../types/page';
import { emit } from './events';
import { empty, uuid, hasProp, log, forEach, hasProps, targets, ts } from '../shared/utils';
import { assign, o, isArray, history } from '../shared/native';
import { $ } from './session';
import { Errors, EventType } from '../shared/enums';
import { parse, getTitle } from '../shared/dom';

/**
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

/**
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
    if (!has('threshold')) page.threshold = $.config.hover.threshold;
  }

  if ($.config.proximity !== false && page.type === EventType.PROXIMITY) {
    if (!has('proximity')) page.proximity = $.config.proximity.distance;
    if (!has('threshold')) page.threshold = $.config.proximity.threshold;
  }

  if ($.config.progress && !has('progress')) {
    page.progress = $.config.progress.threshold;
  }

  if (!has('render')) page.render = $.config.method;
  if (!has('visits')) page.visits = 0;

  $.pages[page.key] = page;

  return $.pages[page.key];

}

export function patch <T extends keyof IPage> (prop: T, value: IPage[T], key = history.state.key) {

  if (prop === 'location') {
    $.pages[key][prop] = assign($.pages[key][prop], value);
  } else {
    $.pages[key][prop] = value;
  }

  return $.pages[key];

}

/**
 * Writes the page to memory. New visits are defined by an event
 * dispatched from a `href` link. Both a new page visit or
 * subsequent visit will pass through this function. This will
 * be called after an XHR fetch completes or when state is to be
 * added to the session memory.
 */
export function set (state: IPage, snapshot: string): IPage {

  const event = emit('before:cache', state, snapshot as any);
  const dom = typeof event === 'string' ? event : snapshot;

  // EventTypes above 5 are prefetch/trigger kinds.
  // We need to augment the page store to align with
  // the record we are handling.
  if (state.type > EventType.POPSTATE) {

    // EventTypes above 9 are prefetch kinds
    // we need to update the type reference
    if (state.type > EventType.RELOAD) {

      state.type = EventType.PREFETCH;

    } else {

      // EventTypes are 6 to 10 ~ these are trigger
      // kinds, we need to update the current pages scroll position.
      // if (hasProp($.pages, state.rev)) {

      //   console.log('SCROLL IS UPDATING HERE');
      //   $.pages[state.rev].scrollX = window.scrollX;
      //   $.pages[state.rev].scrollY = window.scrollY;
      // }

    }
  }

  // Update to document title and timestamp reference
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
 * Update the page state and (optionally) its snapshot.
 * The passed in state value expects route values, ie:
 * the `page` must contain the following:
 *
 * - `key`
 * - `rev`
 * - `type`
 * - `location`
 *
 * Typicaly, this function augments the in-memory store
 * and as such an already generated record should be
 * provided and at the very least pass a generated `route`
 * that was created with `getRoute()`.
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

export function current () {

  const key = history.state.key;

  if (hasProp($.pages, key)) return $.pages[key];

  log(Errors.ERROR, `No record exists: ${key}`);

}

/**
 * Returns a page snapshot parsed dom helper closure. By default, returns the current
 * in-memory dom. An option `targets` parameter will return specific
 * nodes.
 */
export function dom (page: IPage):{
  get dom(): Document;
  get page(): IPage
} {

  const snapshot = parse($.snaps[page.uuid]);

  return {
    get page () {
      return page;
    },
    get dom () {
      return snapshot;
    }
  };

}

/**
 * Returns the in-memory (session) page store and a
 * parsed document snapshot.
 *
 * Optionally accepts a url `key` reference to retrieve
 * a specific page. If `key` is undefined (not passed)
 * then the current page is returned according to the
 * history API state record.
 *
 * If no `key` exists an error is thrown.
 */
export function get (key?: string): { page: IPage, dom: Document } {

  if (!key) {
    if (history.state === null) return;
    key = history.state.key;
  }

  if (hasProp($.pages, key)) {
    const state = o();
    state.page = $.pages[key];
    state.dom = parse($.snaps[state.page.uuid]);
    return o();
  }

  log(Errors.ERROR, `No record exists: ${key}`);

}

/**
 * Determines whether or not a `page` and `snapshot` exist for
 * the passed in `key` reference. This is used to inform SPX
 * on what operations need to be carried out.
 */
export function has (key: string): boolean {

  return (
    hasProp($.pages, key) &&
    hasProp($.pages[key], 'uuid') &&
    hasProp($.snaps, $.pages[key].uuid) &&
    typeof $.snaps[$.pages[key].uuid] === 'string'
  );

}
