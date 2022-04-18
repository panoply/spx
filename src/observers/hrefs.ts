import { supportsPointerEvents } from 'detect-it';
import { emit } from '../app/events';
import { getLink } from '../shared/links';
import { IPage } from '../types/page';
import { observers, pages, selectors } from '../app/session';
import { getRoute } from '../app/route';
import * as request from '../app/fetch';
import * as render from '../app/render';
import * as store from '../app/store';
import * as history from './history';
import { EventType } from '../shared/enums';

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
 * Triggers click events
 *
 * @param {Element} target
 */
function onClick (target: Element, state: string | IPage) {

  return function handle (event: MouseEvent): void | IPage | Promise<void | IPage> {

    event.preventDefault();
    target.removeEventListener('click', handle, false);

    if (typeof state === 'object') {
      history.push(state);
      return render.update(state);
    }

    if (typeof state === 'string') {
      return navigate(state);
    }

    return location.assign(state);

  };
}

/**
 * Triggers a page fetch
 *
 * @param {MouseEvent} event
 * @returns {void}
 */
function handleTrigger (event: MouseEvent): void {

  if (!linkEvent(event)) return;

  const target = getLink(event.target, selectors.href);

  if (!target) return;

  const route = getRoute(target, EventType.VISIT);

  if (!emit('visit', event, route)) return;

  // CACHED VISIT
  if (store.has(route.key)) {

    // UPDATE ANY REFERENCES ON ATTRIBUTE
    target.addEventListener('click', onClick(target, store.update(route)), false);

  } else {

    // CANCEL PENDING REQUESTS
    request.cancel(route.key);

    // TRIGGERS FETCH
    request.get(store.create(route));

    // WAIT FOR CLICK
    target.addEventListener('click', onClick(target, route.key), false);

  }
}

/**
 * Executes a pjax navigation.
 */
export async function navigate (key: string, state: IPage | false = false): Promise<void|IPage> {

  if (state) {

    if (typeof state.cache === 'string' && !('hydrate' in state)) {
      state.cache === 'clear' ? store.clear() : store.clear(state.key);
    }

    const page = await request.get(state);

    if (page) return render.update(page);

  } else {

    const wait = await request.inFlight(key);

    if (wait) {

      const page = pages[key];

      history.push(page);

      return render.update(page);

    } else {
      request.abort(key);
    }

  }

  return location.assign(key);

}

/**
 * Attached `click` event listener.
 *
 * @returns {void}
 */
export function connect (): void {

  if (observers.hrefs) return;

  if (supportsPointerEvents) {
    addEventListener('pointerdown', handleTrigger, false);
  } else {
    addEventListener('mousedown', handleTrigger, false);
    addEventListener('touchstart', handleTrigger, false);
  }

  observers.hrefs = true;

}

/**
 * Removed `click` event listener.
 */
export function disconnect (): void {

  if (!observers.hrefs) return;

  if (supportsPointerEvents) {
    removeEventListener('pointerdown', handleTrigger, false);
  } else {
    removeEventListener('mousedown', handleTrigger, false);
    removeEventListener('touchstart', handleTrigger, false);
  }

  observers.hrefs = false;

}
