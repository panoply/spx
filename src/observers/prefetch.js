import * as hrefs from './hrefs'
import * as request from '../app/request'
import { Dispatch } from '../app/utils'
import { LinkPrefetchHover, LinkPrefetchIntersect } from '../constants/common'
import { getCacheKeyFromTarget } from '../app/location'
import { store } from '../app/store'

/**
 * Begin Observing `href` links
 *
 * @param {Element} target
 * @memberof PrefetchObserver
 */
const observeLinks = target => store.prefetch.nodes.observe(target)

/**
 * Cleanup throttlers
 *
 * @param {string} url
 * @memberof PrefetchObserver
 */
const cleanup = url => {

  clearTimeout(store.prefetch.transit.get(url))

  // remove request reference
  store.prefetch.transit.delete(url)
}

/**
 * Fetch Throttle
 *
 * @param {string} url
 * @param {function} fn
 * @param {number} delay
 */
const fetchThrottle = (url, fn, delay) => {

  if (!store.cache.has(url) && !store.prefetch.transit.has(url)) {
    store.prefetch.transit.set(url, setTimeout(fn, delay))
  }
}

/**
 * Fetch document and add the response to session cache.
 * Lifecycle event `pjax:cache` will fire upon completion.
 *
 * @param {IPjax.IState} state
 * The navigation configuration state for the requestd page
 *
 * @param {Element} target
 * The `href` link target the prefetch was issued for
 */
const prefetchRequest = async (state, target) => {

  console.log('prefetch', state.url)

  try {

    state.snapshot = await request.get(state)

    if (state.snapshot.length > 0) {
      if (Dispatch('pjax:cache', { state, target }, true)) {
        store.cache.set(state.url, state)
        console.log(store.cache)
      }
    } else {
      store.prefetch.nodes.observe(target)
      console.info(`Prefetch will retry on url: ${state.url}`)
    }
  } catch (error) {

    store.prefetch.nodes.observe(target)

    console.error(error)
    console.info(`Endpoint "${state.url}" failed, will retry prefetch again`)
  }

  cleanup(state.url)

}

/**
 * Attempted to visit location, Handles bubbled click events and
 * Dispatches a `pjax:click` event respecting the cancelable
 * `preventDefault()` from user event
 *
 *
 * @param {MouseEvent} event
 */
const fetchOnHover = (event) => {

  if (hrefs.linkEventValidate(event) && event.target instanceof Element) {

    const state = hrefs.getState(event.target)

    fetchThrottle(state.url, () => {

      event.target.removeEventListener('mouseover', fetchOnHover)

      // @ts-ignore
      prefetchRequest(state, event.target)

    }, store.prefetch.threshold.hover)

  }
}

/**
 * Intersection callback when entries are in viewport.
 *
 * @param {IntersectionObserverEntry} params
 */
const OnIntersection = ({ isIntersecting, target }) => {

  if (isIntersecting) {

    const state = hrefs.getState(target)

    fetchThrottle(state.url, () => {

      store.prefetch.nodes.unobserve(target)

      prefetchRequest(state, target)

    }, store.prefetch.threshold.intersect)

  }
}

/**
 * Link is not cached and can be fetched
 *
 * @param {Element} target
 * @returns {boolean}
 */
const canFetch = target => !store.cache.has(getCacheKeyFromTarget(target))

/**
 * Returns a list of link elements to be prefetched. Filters out
 * any links which exist in cache to prevent extrenous transit.
 *
 * @param {string} el
 */
const getTargets = el => Array.from(document.body.querySelectorAll(el)).filter(canFetch)

/**
 * Adds and/or Removes click events.
 *
 * @param {EventTarget} target
 */
const disconnectHover = target => target.removeEventListener('mouseover', fetchOnHover)

/**
 * Adds and/or Removes click events.
 *
 * @param {EventTarget} target
 */
const observeHovers = target => target.addEventListener('mouseover', fetchOnHover)

/**
 * Start Intersection Observer and iterate over entries.
 *
 * @type {IntersectionObserverCallback}
 */
const observeIntersects = entries => entries.forEach(OnIntersection)

/**
 * Checks if prefetch for the passed in url is currently in flight.
 *
 * @param {string} url
 * The `cacheKey` url identifier
 *
 * @returns {boolean}
 * Returns `true` when url is being pre-fetched, else `false`
 */
export const inFlight = url => store.prefetch.transit.has(url)

/**
 * Starts prefetch, will initialize `IntersectionObserver` and
 * add event listeners and other logics.
 */
export const start = () => {
  if (!store.prefetch.started) {
    store.prefetch.nodes = new IntersectionObserver(observeIntersects)
    getTargets(LinkPrefetchIntersect).forEach(observeLinks)
    getTargets(LinkPrefetchHover).forEach(observeHovers)
    store.prefetch.started = true
  }
}

/**
 * Stops prefetch, will disconnect `IntersectionObserver` and
 * remove any event listeners or transits.
 */
export const stop = () => {
  if (store.prefetch.started) {
    store.prefetch.transit.clear()
    store.prefetch.nodes.disconnect()
    getTargets(LinkPrefetchHover).forEach(disconnectHover)
    store.prefetch.started = false
  }
}
