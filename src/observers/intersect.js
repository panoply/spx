import { LinkPrefetchIntersect } from '../constants/common'
import { getTargets } from '../app/utils'
import hrefs from './hrefs'
import path from '../app/path'
import request from '../app/request'

/**
 * @param {boolean} connect
 */
export default (function (connect) {

  /**
   * @type IntersectionObserver
   */
  let entries = null

  /**
   * Intersection callback when entries are in viewport.
   *
   * @param {IntersectionObserverEntry} params
   * @returns {Promise<void>}
   */
  const onIntersect = async ({ isIntersecting, target }) => {

    if (isIntersecting) {

      const state = hrefs.attrparse(target, path.get(target))
      const response = await request.get(state)

      if (response) {
        entries.unobserve(target)
      } else {
        console.warn(`Pjax: Prefetch will retry at next intersect for: ${state.url}`)
        entries.observe(target)
      }

    }
  }

  /**
   * Begin Observing `href` links
   *
   * @param {Element} target
   * @returns {void}
   */
  const observe = target => entries.observe(target)

  /**
   * Start Intersection Observer and iterate over entries.
   *
   * @type {IntersectionObserverCallback}
   * @returns {void}
   */
  const intersect = entries => entries.forEach(onIntersect)

  return {

    /* CONTROLS ----------------------------------- */

    /**
     * Starts prefetch, will initialize `IntersectionObserver` and
     * add event listeners and other logics.
     *
     * @exports
     * @returns {void}
     */
    start: () => {

      if (!connect) {
        entries = new IntersectionObserver(intersect)
        getTargets(LinkPrefetchIntersect).forEach(observe)
        connect = true
      }

    },

    /**
     * Stops prefetch, will disconnect `IntersectionObserver` and
     * remove any event listeners or transits.
     *
     * @exports
     * @returns {void}
     */
    stop: () => {

      if (connect) {
        entries.disconnect()
        connect = false
      }

    }

  }

})(false)
