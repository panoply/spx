import { supportsPointerEvents } from 'detect-it';
import { getLink, getTargets, forEach, emptyObject } from '../app/utils';
import { dispatch } from '../app/events';
import { connect, config, selectors } from '../app/state';
import * as store from '../app/store';
import * as request from '../app/request';
import { getKey, getRoute } from '../app/route';

/**
 * Cancels prefetch, if mouse leaves target before threshold
 * concludes. This prevents fetches being made for hovers that
 * do not exceeds threshold.
 */
function onMouseleave (event: MouseEvent) {

  const target = getLink(event.target, selectors.mouseover);

  if (target) {
    request.cleanup(getKey(target));
    handleLeave(target);
  }

};

/**
 * Attempts to visit location, Handles bubbled mouseovers and
 * Dispatches to the fetcher. Once item is cached, the mouseover
 * event is removed.
 *
 * @param {MouseEvent} event
 */
function onMouseover (event: MouseEvent): void {

  const target = getLink(event.target, selectors.mouseover);

  if (!target) return undefined;

  const route = getRoute(target, 'mouseover');

  if (!dispatch('pjax:prefetch', { target, route }, true)) return disconnect(target);

  if (store.has(route.key)) return disconnect(target);

  handleLeave(target);

  const state = store.create(route);

  request.throttle(route.key, async () => {

    const prefetch = await request.prefetch(state);

    if (prefetch) handleLeave(target);

  }, state.threshold || config.mouseover.threshold);

};

/**
 * Attach mouseover events to all defined element targets
 */
function handleHover (target: EventTarget): void {

  if (supportsPointerEvents) {
    target.addEventListener('pointerover', onMouseover, false);
  } else {
    target.addEventListener('mouseover', onMouseover, false);
  }
};

/**
 * Cancels prefetch, if mouse leaves target before threshold
 * concludes. This prevents fetches being made for hovers that
 * do not exceeds threshold.
 */
function handleLeave (target: Element): void {

  if (supportsPointerEvents) {
    target.removeEventListener('pointerout', onMouseleave, false);
  } else {
    target.removeEventListener('mouseleave', onMouseleave, false);
  }
}

/**
 * Adds and/or Removes click events.
 */
function disconnect (target: EventTarget): void {

  if (supportsPointerEvents) {
    target.removeEventListener('pointerover', onMouseleave, false);
    target.removeEventListener('pointerout', onMouseleave, false);
  } else {
    target.removeEventListener('mouseleave', onMouseleave, false);
    target.removeEventListener('mouseover', onMouseover, false);
  }
}

/**
 * Starts mouseovers, will attach mouseover events
 * to all elements which contain a `data-pjax-prefetch="hover"`
 * data attribute
 */
export function start (): void {

  if (!config.mouseover) return;
  if (!connect.has(4)) {
    forEach(handleHover, getTargets(selectors.mouseover));
    connect.add(4);
  }

}

/**
 * Stops mouseovers, will remove all mouseover and mouseout
 * events on elements which contains a `data-pjax-prefetch="hover"`
 * unless target href already exists in cache.
 */
export function stop (): void {

  if (connect.has(4)) {
    emptyObject(request.timeout);
    forEach(disconnect, getTargets(selectors.mouseover));
    connect.delete(4);
  }

};
