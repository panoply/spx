import { LinkPrefetchHover } from '../constants/common'
import { getCacheKeyFromTarget, getURL } from '../app/location'
import { transit, cache, store } from '../app/store'
import { linkEventValidate, linkLocator } from '../app/utils'
import { getPageState, getVisitConfig } from '../app/visit'
import * as request from '../app/request'

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
      getTargets(LinkPrefetchHover).forEach(observe)
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
      getTargets(LinkPrefetchHover).forEach(disconnect)
      started = false
    }
  }
}

/**
 * Cancels prefetch, if mouse leaves target before threshold
 * concludes. This prevents fetches being made for hovers that
 * do not exceeds threshold.
 *
 * @param {MouseEvent} event
 */
export function onMouseleave (event) {

  if (linkEventValidate(event)) {

    const target = linkLocator(event.target, LinkPrefetchHover)

    if (target) {
      cleanup(getURL(target))
      target.removeEventListener('mouseleave', onMouseleave, true)
      // console.log('pjax: Prefetch cancelled, hover length too short')
    }
  }
}

/**
 * Attempts to visit location, Handles bubbled mousovers and
 * Dispatches to the fetcher. Once item is cached, the mouseover
 * event is removed.
 *
 * @param {MouseEvent} event
 */
function onMouseover (event) {

  if (linkEventValidate(event)) {

    const target = linkLocator(event.target, LinkPrefetchHover)

    if (target) {

      const state = getPageState(target)

      if (cache.has(state.url)) return disconnect(target)

      target.addEventListener('mouseleave', onMouseleave, true)

      throttle(state.url, () => {

        state.method = 'prefetch'
        target.removeEventListener('mouseleave', onMouseleave, true)

        prefetch(getVisitConfig(state, target), newState => {
          console.log('prefetch')
          target.removeEventListener('mouseover', onMouseover, true)
        })

      }, store.config.threshold.hover)

    }
  }
}

/**
 * Attach mouseover events to all defined element targets
 *
 * @param {EventTarget} target
 */
function observe (target) {

  target.addEventListener('mouseover', onMouseover, true)

}

/**
 * Cleanup throttlers
 *
 * @param {string} url
 * @memberof PrefetchObserver
 */
function cleanup (url) {

  clearTimeout(transit.get(url))
  transit.delete(url)

}

/**
 * Fetch Throttle
 *
 * @param {string} url
 * @param {function} fn
 * @param {number} delay
 */
function throttle (url, fn, delay) {

  if (!cache.has(url) && !transit.has(url)) {
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
 * @param {(status: IPjax.IState) => void} callback
 * The `href` link target the prefetch was issued for
 */
async function prefetch (state, callback) {

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
 * Link is not cached and can be fetched
 *
 * @param {Element} target
 * @returns {boolean}
 */
function canFetch (target) {

  return !cache.has(getCacheKeyFromTarget(target))
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

/**
 * Adds and/or Removes click events.
 *
 * @param {EventTarget} target
 */
function disconnect (target) {

  target.removeEventListener('mouseleave', onMouseleave, false)
  target.removeEventListener('mouseover', onMouseover, false)

}
