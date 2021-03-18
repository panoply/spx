import { LinkPrefetchIntersect } from '../constants/common'
import { getURL } from '../app/location'
import { transit, cache, store } from '../app/store'
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
 * @export
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
 * @export
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
 * @memberof PrefetchObserver
 */
function observe (target) {

  return entries.observe(target)
}

/**
 * Start Intersection Observer and iterate over entries.
 *
 * @type {IntersectionObserverCallback}
 */
function intersect (entries) {

  return entries.forEach(onIntersection)
}

/**
 * Intersection callback when entries are in viewport.
 *
 * @param {IntersectionObserverEntry} params
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

/**
 * Link is not cached and can be fetched
 *
 * @param {Element} target
 * @returns {boolean}
 */
function canFetch (target) {

  return !cache.has(getURL(target))
}

/**
 * Returns a list of link elements to be prefetched. Filters out
 * any links which exist in cache to prevent extrenous transit.
 *
 * @param {string} selector
 */
function getTargets (selector) {

  return [ ...document.body.querySelectorAll(selector) ].filter(canFetch)
}
