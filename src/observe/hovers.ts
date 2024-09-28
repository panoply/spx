import type { Hover } from 'types';
import { $ } from '../app/session';
import { XHR, pointer } from '../shared/native';
import { forEach } from '../shared/utils';
import { emit } from '../app/events';
import { getKey, getRoute } from '../app/location';
import { getLink, getTargets } from '../shared/links';
import { VisitType } from '../shared/enums';
import * as q from '../app/queries';
import * as request from '../app/fetch';

/**
 * Attempts to visit location, Handles bubbled mouseovers and
 * Dispatches to the fetcher. Once item is cached, the mouseover
 * event is removed.
 *
 * @param {MouseEvent} event
 */
const onEnter = (event: MouseEvent): void => {

  const target = getLink(event.target, $.qs.$hover);

  if (!target) return;

  const route = getRoute(target, VisitType.HOVER);

  if (q.has(route.key)) return;
  if (route.key in XHR.$timeout) return;

  target.addEventListener(`${pointer}leave`, onLeave, { once: true });

  const state = q.create(route);
  const delay = state.threshold || ($.config.hover as Hover).threshold;

  request.throttle(route.key, function () {

    if (!emit('prefetch', route, target)) return;

    request.fetch(state).then(function () {
      delete XHR.$timeout[route.key];
      removeListener(target);
    });

  }, delay);

};

/**
 * Cancels prefetch, if mouse leaves target before threshold
 * concludes. This prevents fetches being made for hovers that
 * do not exceeds threshold.
 */
const onLeave = (event: MouseEvent) => {

  const target = getLink(event.target, $.qs.$hover);

  if (target) {
    request.cleanup(getKey(target.href));
  }
};

/**
 * Add event to a target
 */
const addListener = (target: EventTarget): void => target.addEventListener(`${pointer}enter`, onEnter);

/**
 * Remove events from a target
 */
const removeListener = (target: EventTarget): void => {

  target.removeEventListener(`${pointer}enter`, onEnter);
  target.removeEventListener(`${pointer}leave`, onLeave);

};

/**
 * Starts mouseovers, will attach mouseover events
 * to all elements which contain a `spx-prefetch="hover"`
 * data attribute
 */
export const connect = () => {

  if (!$.config.hover || $.observe.hover) return;

  forEach(addListener, getTargets($.qs.$hover));

  $.observe.hover = true;

};

/**
 * Stops mouseovers, will remove all mouseover and mouseout
 * events on elements which contains a `spx-prefetch="hover"`
 * unless target href already exists in cache.
 */
export const disconnect = () => {

  if (!$.observe.hover) return;

  forEach(removeListener, getTargets($.qs.$hover));

  $.observe.hover = false;

};
