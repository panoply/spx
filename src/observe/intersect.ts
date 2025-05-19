import { $ } from '../app/session';
import { forEach } from '../shared/utils';
import { VisitType } from '../shared/enums';
import { getNodeTargets } from '../shared/links';
import { emit } from '../app/events';
import { getRoute } from '../app/location';
import * as request from '../app/fetch';
import * as q from '../app/queries';
import * as log from '../shared/logs';

/**
 * @type IntersectionObserver
 */
let entries: IntersectionObserver;

/**
 * Intersection callback when entries are in viewport.
 */
const onIntersect = async (entry: IntersectionObserverEntry): Promise<void> => {

  if (entry.isIntersecting) {

    const route = getRoute(entry.target, VisitType.INTERSECT);

    if (!emit('prefetch', route, entry.target as HTMLElement)) return entries.unobserve(entry.target);

    const response = await request.fetch(q.create(route));

    if (response) {
      entries.unobserve(entry.target);
    } else {
      log.warn(`Prefetch will retry at next intersection for: ${route.key}`);
      entries.observe(entry.target);
    }
  }
};

/**
 * Starts prefetch, will initialize `IntersectionObserver` and
 * add event listeners and other logics.
 */
export const connect = () => {

  if (!$.config.intersect || $.observe.intersect) return;

  // @ts-expect-error
  if (!entries) entries = new IntersectionObserver(forEach(onIntersect), $.config.intersect);

  const observe = forEach<Element>(target => entries.observe(target));
  const targets = getNodeTargets($.qs.$intersector, $.qs.$intersect);

  observe(targets);

  $.observe.intersect = true;

};

/**
 * Stops prefetch, will disconnect `IntersectionObserver` and
 * remove any event listeners or transits.
 */
export const disconnect = () => {

  if (!$.observe.intersect) return;

  entries.disconnect();
  $.observe.intersect = false;

};
