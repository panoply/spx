import { forEach } from '../shared/utils';
import { log } from '../shared/logs';
import { Errors, VisitType } from '../shared/enums';
import { getNodeTargets } from '../shared/links';
import { $ } from '../app/session';
import { emit } from '../app/events';
import { getRoute } from '../app/location';
import * as request from '../app/fetch';
import * as q from '../app/queries';

/**
 * @type IntersectionObserver
 */
let entries: IntersectionObserver;

/**
 * Intersection callback when entries are in viewport.
 */
async function onIntersect (entry: IntersectionObserverEntry): Promise<void> {

  if (entry.isIntersecting) {

    const route = getRoute(entry.target, VisitType.INTERSECT);

    if (!emit('prefetch', entry.target, route)) return entries.unobserve(entry.target);

    const response = await request.fetch(q.create(route));

    if (response) {

      entries.unobserve(entry.target);

    } else {
      log(Errors.WARN, `Prefetch will retry at next intersect for: ${route.key}`);
      entries.observe(entry.target);
    }
  }
};

/**
 * Starts prefetch, will initialize `IntersectionObserver` and
 * add event listeners and other logics.
 */
export function connect (): void {

  if (!$.config.intersect || $.observe.intersect) return;
  if (!entries) entries = new IntersectionObserver(forEach(onIntersect), $.config.intersect);

  const observe = forEach<Element>(target => entries.observe(target));
  const targets = getNodeTargets($.qs.$intersector, $.qs.$intersect);

  observe(targets);

  $.observe.intersect = true;

}

/**
 * Stops prefetch, will disconnect `IntersectionObserver` and
 * remove any event listeners or transits.
 */
export function disconnect (): void {

  if (!$.observe.intersect) return;

  entries.disconnect();
  $.observe.intersect = false;

};
