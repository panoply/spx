import { getTargets, forEach, attrparse } from '../app/utils';
import { connect } from '../app/connects';
import * as path from '../app/path';
import * as request from '../app/request';

/**
 * @type IntersectionObserver
 */
let entries: IntersectionObserver;

/**
 * Intersection callback when entries are in viewport.
 */
async function onIntersect (entry: IntersectionObserverEntry): Promise<void> {

  if (entry.isIntersecting) {

    const state = attrparse(entry.target, path.get(entry.target));
    const response = await request.get(state);

    if (response) {
      entries.unobserve(entry.target);
    } else {
      console.warn(`Pjax: Prefetch will retry at next intersect for: ${state.url}`);
      entries.observe(entry.target);
    }

  }
};

/**
 * Starts prefetch, will initialize `IntersectionObserver` and
 * add event listeners and other logics.
 */
export function start (): void {

  if (!connect.intersect) {
    entries = new IntersectionObserver(forEach(onIntersect));
    forEach(entries.observe)(getTargets('a[data-pjax-prefetch="intersect"]'));
    connect.intersect = true;
  }

}

/**
 * Stops prefetch, will disconnect `IntersectionObserver` and
 * remove any event listeners or transits.
 */
export function stop (): void {

  if (connect.intersect) {
    entries.disconnect();
    connect.intersect = false;
  }

};
