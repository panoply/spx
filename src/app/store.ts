import { IPage } from '../types/page';
import { emit } from './events';
import { empty, forEach, uuid } from '../shared/utils';
import { assign, object, isArray, history } from '../shared/native';
import { pages, snapshots, config } from './session';
import { EventType } from '../shared/enums';
import { IHover, IProximity } from 'types';
import { parse, getTitle } from '../shared/dom';

/**
 * Clear
 *
 * Removes cached records. Optionally pass in URL
 * to remove specific record.
 */
export function clear (key?: string[] | string): void {

  if (key === undefined) {

    empty(pages);
    empty(snapshots);

  } else if (typeof key === 'string') {

    delete snapshots[pages[key].uuid];
    delete pages[key];

  } else if (isArray(key)) {

    purge(key);

  }
}

/**
 * Defaults
 *
 * Page state defaults applied to `pages` and written
 * to history push state. This is used on each pjax
 * visit and will be overwritten by attribute configs
 * or by any programmatic triggers.
 */
export function create (state: IPage): IPage {

  if (state.replace === undefined) {
    state.replace = config.targets;
  } else {
    forEach(target => state.replace.push(target), config.targets);
  }

  if (config.cache) {
    if (state.cache === undefined) state.cache = config.cache;
    if (state.uuid === undefined) state.uuid = uuid();
  }

  if (state.position === undefined) {
    state.position = object(null);
    state.position.y = 0;
    state.position.x = 0;
  }

  if (config.hover !== false) {
    if (state.type === EventType.HOVER) {
      if (state.threshold === undefined) state.threshold = (config.hover as IHover).threshold;
    }
  }

  if (config.proximity !== false) {
    if (state.type === EventType.PROXIMITY) {
      if (state.proximity === undefined) state.proximity = (config.proximity as IProximity).distance;
      if (state.threshold === undefined) state.threshold = (config.hover as IHover).threshold;
    }
  }

  if (config.progress !== false) {
    if (state.progress === undefined) state.progress = config.progress.threshold;
  }

  return state;

}

/**
 * Handles a new page visit or a return page visit. New visits
 * are defined by an event dispatched from a `href` link. Both a new
 * new page visit or subsequent visit will call this function.
 *
 * **Breakdown**
 *
 * Subsequent visits calling this function will have their per-page
 * specific state like the config set via attributes reset and merged
 * into its existing records (if it has any), otherwise a new page
 * instance will be generated with the default preset configuration.
 */
export function set (state: IPage, snapshot: string): IPage {

  const event = emit('store', state, snapshot);

  if (event === false) return;

  switch (state.type) {
    case EventType.HOVER:
    case EventType.PROXIMITY:
    case EventType.INTERSECT: state.type = EventType.PREFETCH; break;
  }

  const dom = typeof event === 'string' ? event : snapshot;
  state.title = getTitle(dom);

  if (!config.cache) return state;

  pages[state.key] = state;
  snapshots[state.uuid] = dom;

  return state;

}

/**
 * Update the page state and snapshots
 */
export function update (state: IPage, snapshot?: string): IPage {

  const page = state.key in pages ? pages[state.key] : create(state);

  if (typeof snapshot === 'string') {
    state.title = getTitle(snapshot);
    snapshots[page.uuid] = snapshot;
    return assign(page, state);
  }

  return assign(page, state);

}

/**
 * Get Store
 *
 * Returns the in-memory page store and
 * parsed document snapshot. Optionally accepts
 * a url `key` reference. If none provided then
 * loads the current store.
 */
export function get (url?: string): { page: IPage, dom: Document } {

  const o = object(null);

  url = url || history.state.key;

  o.page = pages[url];
  o.dom = parse(snapshots[o.page.uuid]);

  return o;

}

/**
 * Check if cache record exists with snapshot
 */
export function has (url: string): boolean {

  return ((url in pages) && ('uuid' in pages[url]))
    ? (pages[url].uuid in snapshots)
    : false;

}

/**
 * Purge
 *
 * Clears all records from store. Optionally provide a list
 * of targets to be cleared. Returns a list of snapshots
 * that remain.
 */
export function purge (targets: string[] = []) {

  return Object.getOwnPropertyNames(pages).forEach((url) => {
    if (!targets.includes(url)) delete pages[url];
    else delete snapshots[pages[url].uuid];
  });

}
