import { EventType } from '../shared/enums';
import { hasProp } from '../shared/utils';
import { deviceType } from 'detect-it';
import { pointer } from '../shared/native';
import { emit } from '../app/events';
import { getLink } from '../shared/links';
import { IPage } from '../types/page';
import { config, observers, pages } from '../app/session';
import { getAttributes, getKey, getRoute } from '../app/location';
import * as hover from '../observers/hover';
import * as proximity from '../observers/proximity';
import * as intersect from '../observers/intersect';
import * as progress from '../app/progress';
import * as request from '../app/fetch';
import * as render from '../app/render';
import * as store from '../app/store';
import * as history from './history';

/**
 * Handles a clicked link, prevents special click types.
 */
function linkEvent (event: MouseEvent): boolean {

  return !(
    (
      // @ts-ignore
      (event.target && event.target.isContentEditable) ||
      event.defaultPrevented ||
      event.which > 1 ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    )
  );

}

/**
 * Triggers a page fetch
 *
 * Mousedown is interpretended as intent-to-visit, it works like this:
 *
 * 1. We will validate the mousedown event was placed on a valid `<a>` node.
 * 2. We will validate the `href` value, ie: the `key` (pathname + search params).
 * 3. We disconnect all observers to prevent futher requests from occuring.
 * 4. We fire off the `visit` event lifecycle method
 *
 * **Handling in-transit visits**
 *
 * At this point we need to determine the visit status. If the visit has already began,
 * which will have occured in a prefetch, then we do not need to trigger an addition
 * fetch, instead we will await on the initial fetch to complete before passing it to
 * the render cycle.
 *
 * **Handling Sub-sequent visits**
 *
 * If we are dealing with a sub-sequent visit, ie: we are visiting an already cached
 * page, then we simply re-parse attributes of the node and then pass to render.
 *
 * **Handling new visits**
 *
 * If we are dealing with a new-visit, which is a visit that is neither in-transit
 * or sub-sequent then we trigger a fetch and await its completion in the next phase.
 * This is typical for visits with no pre-fetch operation configured.
 *
 *
 * @param {MouseEvent} event
 * @returns {void}
 */
function handleTrigger (event: MouseEvent): void {

  if (!linkEvent(event)) return;

  const target = getLink(event.target, config.selectors.hrefs);

  // Skip id target is not a valid href element
  if (!target) return;

  const key = getKey(target.href);

  // Skip id href value is not a valid key
  if (key === null) return;

  // Event lifecycle, cancel if returned false
  if (!emit('visit', event)) return;

  // Prevent any observers from triggering
  hover.disconnect();
  proximity.disconnect();
  intersect.disconnect();

  const options = { once: true };

  if (store.has(key)) { // Sub-sequent visit

    const attrs = getAttributes(target, pages[key]);
    const page = store.update(attrs);

    target.addEventListener('click', function handle (event: MouseEvent) {
      event.preventDefault();
      history.push(page);
      render.update(page);
    }, options);

  } else if (hasProp(request.transit, key)) { // In-Transit visit

    const page = pages[key];

    request.cancel(key); // Cancel any other fetches in transit

    target.addEventListener('click', function handle (event: MouseEvent) {
      event.preventDefault();
      visit(page);
    }, options);

  } else { // New Visit

    // Cancel all in-transit requests
    request.cancel();

    // If throttle exist for this key, we will remove them
    // these are the setTimeouts set by pre-fetch timers
    request.cleanup(key);

    // We need to (re)parse the element and acquire
    // any attribute annotations
    const route = getRoute(target, EventType.VISIT);
    const page = store.create(route);

    // Lets trigger a fetch, we will await its
    // complete after click has concluded, we
    // have a head-start on the request.
    request.fetch(page);

    target.addEventListener('click', function handle (event: MouseEvent) {
      event.preventDefault();
      visit(page);
    }, options);

  }
}

export async function visit (state: IPage) {

  progress.start(state.progress as number);

  // We will await the fetch in transit
  const page = await request.wait(state);

  if (page) {

    // Push history into stack
    history.push(page);

    // Let's begin the rendering cylce
    render.update(page);

  } else {

    // Something failed, we will trigger a
    // traditional navigation
    return location.assign(state.key);

  }

}

/**
 * Executes a SPX navigation.
 *
 */
export async function navigate (key: string, state?: IPage): Promise<void> {

  if (state) {

    if (typeof state.cache === 'string') state.cache === 'clear' ? store.clear() : store.clear(state.key);

    // Trigger progress bar loading
    progress.start(state.progress as number);

    const page = await request.fetch(state);

    if (page) {
      history.push(page);
      render.update(page);
    } else {
      location.assign(state.key);
    }

  } else {

    return visit(pages[key]);

  }

}

/**
 * Attached `click` event listener.
 *
 * @returns {void}
 */
export function connect (): void {

  if (observers.hrefs) return;

  if (deviceType === 'mouseOnly') {
    addEventListener(`${pointer}down`, handleTrigger, false);
  } else if (deviceType === 'touchOnly') {
    addEventListener('touchstart', handleTrigger, false);
  } else {
    addEventListener(`${pointer}down`, handleTrigger, false);
    addEventListener('touchstart', handleTrigger, false);
  }

  observers.hrefs = true;

}

/**
 * Removed `click` event listener.
 */
export function disconnect (): void {

  if (!observers.hrefs) return;

  if (deviceType === 'mouseOnly') {
    removeEventListener(`${pointer}down`, handleTrigger, false);
  } else if (deviceType === 'touchOnly') {
    removeEventListener('touchstart', handleTrigger, false);
  } else {
    removeEventListener(`${pointer}down`, handleTrigger, false);
    removeEventListener('touchstart', handleTrigger, false);
  }

  observers.hrefs = false;

}
