import type { Page } from 'types';
import { deviceType } from 'detect-it';
import { $ } from '../app/session';
import { Log, VisitType } from '../shared/enums';
import { ts } from '../shared/utils';
import { log } from '../shared/logs';
import { XHR, pointer } from '../shared/native';
import { emit } from '../app/events';
import { getLink } from '../shared/links';
import { getAttributes, getKey, getRoute } from '../app/location';
import { progress } from '../app/progress';
import * as hover from './hovers';
import * as proximity from './proximity';
import * as intersect from './intersect';
import * as request from '../app/fetch';
import * as render from '../app/render';
import * as history from './history';
import * as q from '../app/queries';

/**
 * Handles a clicked link, prevents special click types.
 */
const linkEvent = (event: MouseEvent): boolean => !(
  (
    // @ts-ignore
    (event.target && event.target.isContentEditable) ||
    event.defaultPrevented ||
    event.button > 1 ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  )
);

/**
 * Triggers a page fetch
 *
 * Mousedown is interpreted as intent-to-visit, it works like this:
 *
 * 1. We will validate the mousedown event was placed on a valid `<a>` node.
 * 2. We will validate the `href` value, ie: the `key` (pathname + search params).
 * 3. We disconnect all observers to prevent futher requests from occuring.
 * 4. We fire off the `visit` event lifecycle method
 *
 * **Handling in-transit visits**
 *
 * At this point we need to determine the visit status. If the visit has already began,
 * which will have occured in a prefetch, then we do not need to trigger an additional
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
 * **NOTE**
 *
 * The final event of `click` is applied via `onclick` and not event listener. This ensures
 * that attachments are only ever added a single time.
 *
 */
const handle: { (event: MouseEvent): void; drag?: boolean; } = function (event: MouseEvent): void {

  if (!linkEvent(event)) return;

  const target = getLink(event.target, $.qs.$href);

  // Skip id target is not a valid href element
  if (!target) return;

  const key = getKey(target.href);

  // Skip id href value is not a valid key
  if (key === null) return;

  const isRoute = key === $.page.key;

  /**
   * Pointer Move/Drag
   *
   * Capture drag occurances on links, we will cancel
   * visits when this occurs to prevent history push~state
   * from not behaving correctly.
   *
   * Credit to the brother mansedan for catching this.
   */
  const move = () => {
    log(Log.WARN, `Drag occurance, visit cancelled: ${key}`);
    handle.drag = true;
    target.removeEventListener(`${pointer}move`, move);
  };

  target.addEventListener(`${pointer}move`, move, { once: true });

  if (handle.drag === true) {
    handle.drag = false;
    return handle(event);
  }

  target.removeEventListener(`${pointer}move`, move);

  // Event lifecycle, cancel if returned false
  if (!emit('visit', event)) return;

  /**
   * Handle the click event on links. This function will update
   * page state and history state. The subsequent parameter is
   * used to determine whether we a visting an fetched page or not
   */
  const click = (state: Page, subsequent = true) => {

    $.pages[state.key].ts = ts();
    $.pages[state.key].visits = state.visits + 1;
    $.pages[state.key].target = $.pages[state.rev].target = state.target;
    $.pages[state.key].selector = $.pages[state.rev].selector = state.selector;
    $.pages[state.rev].scrollX = window.scrollX;
    $.pages[state.rev].scrollY = window.scrollY;

    // console.log(state.selector);

    if (isRoute) {

      log(Log.INFO, `Identical pathname, page visit skipped: ${key}`);

    } else {

      history.replace($.pages[state.rev]);

      if (subsequent) {
        history.push(state);
        render.update(state);
      } else {
        visit(state);
      }
    }
  };

  // Prevent any observers from triggering
  hover.disconnect();
  proximity.disconnect();
  intersect.disconnect();

  if (q.has(key)) { // Sub-sequent visit

    const attrs = getAttributes(target, $.pages[key]);
    const page = q.update(attrs);

    target.onclick = (event: MouseEvent) => {
      event.preventDefault();
      click(page);
    };

  } else if (XHR.$transit.has(key)) { // In-Transit visit

    // linkPreload(page.location.hostname + page.key);

    request.cancel(key); // Cancel any other fetches in transit

    log(Log.INFO, `Request in transit: ${key}`);

    // console.log(request.timers, request.transit, request.xhr);

    const page = $.pages[key];

    target.onclick = (event: MouseEvent) => {
      event.preventDefault();
      click(page, false);
    };

  } else { // New Visit

    // Cancel all in-transit requests
    request.cancel();

    // If throttle exist for this key, we will remove them
    // these are the setTimeouts set by pre-fetch timers
    request.cleanup(key);

    // We need to (re)parse the element and acquire
    // any attribute annotations
    const page = q.create(getRoute(target, VisitType.VISIT));

    // Lets trigger a fetch, we will await its
    // completion after click has concluded, so we
    // have a head-start on the request.
    request.fetch(page);

    target.onclick = (event: MouseEvent) => {
      event.preventDefault();
      click(page, false);
    };

  }
};

export async function visit (state: Page) {

  // Trigger progress bar loading
  if (state.progress) progress.start(state.progress as number);

  try {

    // We will await the fetch in transit
    const page = await request.wait(state);

    if (page) {

      if (page.history === 'replace') {

        // Replace history into stack
        history.replace(page);

      } else {
        // Push history into stack
        history.push(page);
      }

      // Let's begin the rendering cylce
      render.update(page);

    } else {

      location.assign(state.key);

    }

  } catch {

    location.assign(state.key);

  }

}

/**
 * Executes a SPX navigation.
 *
 */
export const navigate = async (key: string, state?: Page): Promise<void> => {

  if (state) {

    if (typeof state.cache === 'string') state.cache === 'clear' ? q.clear() : q.clear(state.key);

    // Trigger progress bar loading
    if (state.progress) progress.start(state.progress as number);

    const page = await request.fetch(state);

    if (page) {
      history.push(page);
      render.update(page);
    } else {
      location.assign(state.key);
    }

  } else {

    return visit($.pages[key]);

  }

};

/**
 * Attached `click` event listener.
 */
export const connect = (): void => {

  if ($.observe.hrefs) return;

  handle.drag = false;

  if (deviceType === 'mouseOnly') {
    addEventListener(`${pointer}down`, handle, false);
  } else if (deviceType === 'touchOnly') {
    addEventListener('touchstart', handle, false);
  } else {
    addEventListener(`${pointer}down`, handle, false);
    addEventListener('touchstart', handle, false);
  }

  $.observe.hrefs = true;

};

/**
 * Removed `click` event listener.
 */
export const disconnect = (): void => {

  if (!$.observe.hrefs) return;

  if (deviceType === 'mouseOnly') {
    removeEventListener(`${pointer}down`, handle, false);
  } else if (deviceType === 'touchOnly') {
    removeEventListener('touchstart', handle, false);
  } else {
    removeEventListener(`${pointer}down`, handle, false);
    removeEventListener('touchstart', handle, false);
  }

  $.observe.hrefs = false;

};
