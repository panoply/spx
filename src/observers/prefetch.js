import { xhrSuccess } from '../constants/enums'
import { LinkPrefetchHover, LinkPrefetchIntersect } from '../constants/common'
import { getCacheKeyFromTarget } from '../app/location'
import { store } from '../app/store'
import * as hrefs from './hrefs'
import * as request from '../app/request'

/**
 * @exports
 * @type {Map<string, number>}
 */
export const transit = new Map()

/**
 * @type IntersectionObserver
 */
let nodes

/**
 * @type Boolean
 */
let started = false

/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */

/**
 * Cleanup throttlers
 *
 * @param {string} url
 * @memberof PrefetchObserver
 */
function cleanup (url) {

  clearTimeout(transit.get(url))

  // remove request reference
  transit.delete(url)

}

/**
 * Fetch Throttle
 *
 * @param {string} url
 * @param {function} fn
 * @param {number} delay
 */
function fetchThrottle (url, fn, delay) {

  if (!store.cache.has(url) && !transit.has(url)) {
    transit.set(url, setTimeout(fn, delay))
  }
}

/**
 * Fetch document and add the response to session cache.
 * Lifecycle event `pjax:cache` will fire upon completion.
 *
 * @param {IPjax.IState} state
 * The navigation configuration state for the requestd page
 *
 * @param {(status: number) => void} callback
 * The `href` link target the prefetch was issued for
 */
async function prefetchRequest (state, callback) {

  // console.log('prefetch', state.url)
  try {

    const response = await request.get(state)

    callback(response)

  } catch (error) {
    console.error(error)
    console.info(`Endpoint "${state.url}" failed, will retry prefetch again`)
  }

  cleanup(state.url)

}

/**
 * Attempts to visit location, Handles bubbled mousovers and
 * Dispatches to the fetcher. Once item is cached, the mouseover
 * event is removed.
 *
 * @param {MouseEvent} event
 */
function fetchOnHover (event) {

  if (hrefs.linkEventValidate(event)) {

    const target = hrefs.linkLocator(event.target, LinkPrefetchHover)

    if (target) {

      const state = hrefs.visitState(target, true)

      fetchThrottle(state.url, () => {

        prefetchRequest(state, status => {
          if (status === xhrSuccess) {
            target.removeEventListener('mouseover', fetchOnHover, true)
          }
        })

      }, state.threshold.hover)
    }
  }
}

/**
 * Intersection callback when entries are in viewport.
 *
 * @param {IntersectionObserverEntry} params
 */
function OnIntersection ({ isIntersecting, target }) {

  if (isIntersecting) {

    const state = hrefs.visitState(target, true)

    fetchThrottle(state.url, () => {

      nodes.unobserve(target)

      prefetchRequest(state, status => {
        if (status !== xhrSuccess) nodes.observe(target)
      })

    }, state.threshold.intersect)
  }
}

/**
 * Begin Observing `href` links
 *
 * @param {Element} target
 * @memberof PrefetchObserver
 */
function observeLinks (target) {

  return nodes.observe(target)
}

/**
 * Link is not cached and can be fetched
 *
 * @param {Element} target
 * @returns {boolean}
 */
function canFetch (target) {

  return !store.cache.has(getCacheKeyFromTarget(target))
}

/**
 * Returns a list of link elements to be prefetched. Filters out
 * any links which exist in cache to prevent extrenous transit.
 *
 * @param {string} selector
 */
function getTargets (selector) {

  return Array.from(document.body.querySelectorAll(selector)).filter(canFetch)
}

/**
 * Adds and/or Removes click events.
 *
 * @param {EventTarget} target
 */
function disconnectHover (target) {

  return target.removeEventListener('mouseover', fetchOnHover, false)
}

/**
 * Adds and/or Removes click events.
 *
 * @param {EventTarget} target
 */
function observeHovers (target) {

  return target.addEventListener('mouseover', fetchOnHover, true)
}

/**
 * Start Intersection Observer and iterate over entries.
 *
 * @type {IntersectionObserverCallback}
 */
function observeIntersects (entries) {

  return entries.forEach(OnIntersection)
}

/**
 * Starts prefetch, will initialize `IntersectionObserver` and
 * add event listeners and other logics.
 *
 * @export
 */
export function start () {

  if (!started) {

    nodes = new IntersectionObserver(observeIntersects)
    getTargets(LinkPrefetchIntersect).forEach(observeLinks)
    getTargets(LinkPrefetchHover).forEach(observeHovers)
    started = true
  }
}

/**
 * Stops prefetch, will disconnect `IntersectionObserver` and
 * remove any event listeners or transits.
 *
 * @export
 */
export function stop () {

  if (started) {

    transit.clear()
    nodes.disconnect()
    getTargets(LinkPrefetchHover).forEach(disconnectHover)
    started = false
  }
}
