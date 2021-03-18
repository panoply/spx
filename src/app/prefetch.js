import { store } from './store'
import * as mouseover from '../observers/mouseover'
import * as intersect from '../observers/intersect'

/**
 * Starts prefetch, will initialize `IntersectionObserver` and
 * add event listeners and other logics.
 *
 * @export
 */
export function start () {

  if (store.config.prefetch) {
    mouseover.start()
    intersect.start()
  }
}

/**
 * Stops prefetch, will disconnect `IntersectionObserver` and
 * remove any event listeners or transits.
 *
 * @export
 */
export function stop () {

  if (store.config.prefetch) {
    mouseover.stop()
    intersect.stop()
  }
}
