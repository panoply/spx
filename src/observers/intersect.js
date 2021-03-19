import { LinkPrefetchIntersect } from '../constants/common'
import { getTargets } from '../app/utils'
import { transit, store } from '../app/store'
import { getPageState, getVisitConfig } from '../app/visit'
import * as request from '../app/request'

/**
 * @type IntersectionObserver
 */
let entries = null

/**
 * @type Boolean
 */
let started = false

/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */

/**
 * Starts prefetch, will initialize `IntersectionObserver` and
 * add event listeners and other logics.
 *
 * @exports
 * @returns {void}
 */
export function start () {

  if (store.config.prefetch) {
    if (!started) {
      entries = new IntersectionObserver(intersect)
      getTargets(LinkPrefetchIntersect).forEach(observe)
      started = true
    }
  }
}

/**
 * Stops prefetch, will disconnect `IntersectionObserver` and
 * remove any event listeners or transits.
 *
 * @exports
 * @returns {void}
 */
export function stop () {

  if (store.config.prefetch) {
    if (started) {
      transit.clear()
      entries.disconnect()
      started = false
    }
  }
}

/**
 * Begin Observing `href` links
 *
 * @param {Element} target
 * @returns {void}
 */
function observe (target) {

  return entries.observe(target)
}

/**
 * Start Intersection Observer and iterate over entries.
 *
 * @type {IntersectionObserverCallback}
 * @returns {void}
 */
function intersect (entries) {

  return entries.forEach(onIntersection)
}

/**
 * Intersection callback when entries are in viewport.
 *
 * @param {IntersectionObserverEntry} params
 * @returns {Promise<void>}
 */
async function onIntersection ({ isIntersecting, target }) {

  if (isIntersecting) {

    const state = getVisitConfig(getPageState(target), target)
    state.method = 'prefetch'

    const response = await request.get(state)

    if (response) {
      entries.unobserve(target)
    } else {
      console.warn(`Pjax: Prefetch will retry at next intersect for: ${state.url}`)
      entries.observe(target)
    }

  }
}
