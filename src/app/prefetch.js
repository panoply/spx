import store from './store'
import mouseover from '../observers/hover'
import intersect from '../observers/intersect'

/**
 * Starts prefetch, will initialize `IntersectionObserver` and
 * add event listeners and other logics.
 *
 * @exports
 * @returns {void}
 */
export function start () {

  if (store.config.prefetch.mouseover.enable) mouseover.start()
  if (store.config.prefetch.intersect.enable) intersect.start()

}

/**
 * Stops prefetch, will disconnect `IntersectionObserver` and
 * remove any event listeners or transits.
 *
 * @exports
 * @returns {void}
 */
export function stop () {

  if (store.config.prefetch.mouseover.enable) mouseover.stop()
  if (store.config.prefetch.intersect.enable) intersect.stop()
}
