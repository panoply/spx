import { LinkPrefetchHover } from '../constants/common'
import { getURL } from '../app/location'
import { transit, cache, store } from '../app/store'
import { linkEvent, linkLocate, getTargets } from '../app/utils'
import * as visit from '../app/visit'
import * as request from '../app/request'

/**
 * @type Boolean
 */
let started = false

/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */

/**
 * Starts mouseovers, will attach mouseover events
 * to all elements which contain a `data-pjax-prefetch="hover"`
 * data attribute
 *
 * @export
 * @returns {void}
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
 * Stops mouseovers, will remove all mouseover and mouseout
 * events on elements which contains a `data-pjax-prefetch="hover"`
 * unless target href already exists in cache.
 *
 * @export
 * @returns {void}
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
 * @exports
 * @param {MouseEvent} event
 */
export function onMouseleave (event) {

  if (linkEvent(event)) {

    const target = linkLocate(event.target, LinkPrefetchHover)

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

  if (linkEvent(event)) {

    const target = linkLocate(event.target, LinkPrefetchHover)

    if (target) {

      const state = visit.getPageState(target)

      if (cache.has(state.url)) return disconnect(target)

      target.addEventListener('mouseleave', onMouseleave, true)

      throttle(state.url, () => {

        state.method = 'prefetch'

        prefetch(visit.getVisitConfig(state, target), target)

      }, store.config.threshold.hover)

    }
  }
}

/**
 * Attach mouseover events to all defined element targets
 *
 * @param {EventTarget} target
 * @returns {void}
 */
function observe (target) {

  target.addEventListener('mouseover', onMouseover, true)

}

/**
 * Cleanup throttlers
 *
 * @param {string} url
 * @returns {boolean}
 */
function cleanup (url) {

  clearTimeout(transit.get(url))

  return transit.delete(url)

}

/**
 * Fetch Throttle
 *
 * @param {string} url
 * @param {function} fn
 * @param {number} delay
 * @returns {Map<string, number>}
 */
function throttle (url, fn, delay) {

  if (!cache.has(url) && !transit.has(url)) {
    return transit.set(url, setTimeout(fn, delay))
  }
}

/**
 * Fetch document and add the response to session cache.
 * Lifecycle event `pjax:cache` will fire upon completion.
 *
 * @param {IPjax.IState} state
 * @param {Element} target
 * @returns{Promise<void>}
 */
async function prefetch (state, target) {

  const response = await request.get(state)

  if (response) {
    disconnect(target)
  } else {
    console.warn(`Pjax: Prefetch will retry on next mouseover for: ${state.url}`)
  }

  cleanup(state.url)

}

/**
 * Adds and/or Removes click events.
 *
 * @param {EventTarget} target
 * @returns {void}
 */
function disconnect (target) {

  target.removeEventListener('mouseleave', onMouseleave, false)
  target.removeEventListener('mouseover', onMouseover, false)
}
