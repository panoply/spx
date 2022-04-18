import { forEach } from '../shared/utils';
import { getNodeTargets } from '../shared/links';
import { config, observers, selectors } from '../app/session';
import { emit } from '../app/events';
import { getRoute } from '../app/route';
import * as request from '../app/fetch';
import * as store from '../app/store';
import { EventType } from '../shared/enums';

/**
 * @type IntersectionObserver
 */
let entries: IntersectionObserver;

/**
 * Intersection callback when entries are in viewport.
 */
async function onIntersect (entry: IntersectionObserverEntry): Promise<void> {

  if (entry.isIntersecting) {

    const route = getRoute(entry.target, EventType.INTERSECT);

    if (!emit('prefetch', entry.target, route)) return entries.unobserve(entry.target);

    const response = await request.get(store.create(route));

    if (response) {
      entries.unobserve(entry.target);
    } else {
      console.warn(`@brixtol/pjax: Prefetch will retry at next intersect for: ${route.key}`);
      entries.observe(entry.target);
    }
  }
};

/**
 * Starts prefetch, will initialize `IntersectionObserver` and
 * add event listeners and other logics.
 */
export function connect (): void {

  if (!config.intersect || observers.intersect) return;

  entries = new IntersectionObserver(forEach(onIntersect), config.intersect);

  forEach(entries.observe, getNodeTargets(selectors.intersect, selectors.interHref));

  observers.intersect = true;

}

/**
 * Stops prefetch, will disconnect `IntersectionObserver` and
 * remove any event listeners or transits.
 */
export function disconnect (): void {

  if (!observers.intersect) return;

  entries.disconnect();

  observers.intersect = false;

};
