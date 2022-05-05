import { IHover, IPage } from 'types';
import { pointer } from '../shared/native';
import { forEach, hasProp } from '../shared/utils';
import { emit } from '../app/events';
import { config, observers } from '../app/session';
import * as store from '../app/store';
import * as request from '../app/fetch';
import { getKey, getRoute } from '../app/location';
import { getLink, getTargets } from '../shared/links';
import { EventType } from '../shared/enums';

/**
 * Attempts to visit location, Handles bubbled mouseovers and
 * Dispatches to the fetcher. Once item is cached, the mouseover
 * event is removed.
 *
 * @param {MouseEvent} event
 */
function onEnter (event: MouseEvent): void {

  const target = getLink(event.target, config.selectors.hover);

  if (!target) return;

  const route = getRoute(target, EventType.HOVER);

  if (hasProp(request.timers, route.key)) return;

  target.addEventListener(`${pointer}leave`, onLeave, { once: true });

  const state = store.create(route);
  const delay = state.threshold || (config.hover as IHover).threshold;

  request.throttle(route.key, async function () {

    if (!emit('prefetch', target, route)) return;

    const fetched = await request.fetch(state);

    if (fetched) removeListener(target);

  }, delay);

};

/**
 * Cancels prefetch, if mouse leaves target before threshold
 * concludes. This prevents fetches being made for hovers that
 * do not exceeds threshold.
 */
function onLeave (this: IPage, event: MouseEvent) {

  const target = getLink(event.target, config.selectors.hover);

  if (target) request.cleanup(getKey(target.href));

};

/**
 * Add event to a target
 */
function addListener (target: EventTarget): void {

  target.addEventListener(`${pointer}enter`, onEnter);

};

/**
 * Remove events from a target
 */
function removeListener (target: EventTarget): void {

  target.removeEventListener(`${pointer}enter`, onEnter);
  target.removeEventListener(`${pointer}leave`, onLeave);

}

/**
 * Starts mouseovers, will attach mouseover events
 * to all elements which contain a `data-spx-prefetch="hover"`
 * data attribute
 */
export function connect (): void {

  if (!config.hover || observers.hover) return;

  forEach(addListener, getTargets(config.selectors.hover));

  observers.hover = true;

}

/**
 * Stops mouseovers, will remove all mouseover and mouseout
 * events on elements which contains a `data-spx-prefetch="hover"`
 * unless target href already exists in cache.
 */
export function disconnect (): boolean {

  if (!observers.hover) return;

  forEach(removeListener, getTargets(config.selectors.hover));

  observers.hover = false;

};
