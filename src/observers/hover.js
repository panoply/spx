import { supportsPointerEvents } from 'detect-it'
import { eventFrom } from 'event-from'
import { LinkPrefetchHover } from '../constants/common'
import { getLink, getTargets, dispatchEvent } from '../app/utils'
import hrefs from './hrefs'
import request from '../app/request'
import path from '../app/path'
import store from '../app/store'
/**
 * Link (href) handler
 *
 * @typedef {string|Store.IPage} clickState
 * @param {boolean} connected
 */
export default (function (connected) {

  /**
   * @exports
   * @type {Map<string, number>}
   */
  const transit = new Map()

  /**
   * @type {Store.IPosition}
   */
  const position = { x: 0, y: 0 }

  /**
   * Cleanup throttlers
   *
   * @param {string} url
   * @returns {boolean}
   */
  const cleanup = (url) => {

    clearTimeout(transit.get(url))
    return transit.delete(url)
  }

  /**
   * Cancels prefetch, if mouse leaves target before threshold
   * concludes. This prevents fetches being made for hovers that
   * do not exceeds threshold.
   *
   * @exports
   * @param {MouseEvent} event
   */
  const onMouseleave = (event) => {

    const target = getLink(event.target, LinkPrefetchHover)

    if (target) {

      cleanup(path.get(target).url)
      handleLeave(target)
    }

  }

  /**
   * Fetch Throttle
   *
   * @param {string} url
   * @param {function} fn
   * @param {number} delay
   * @returns {void}
   */
  const throttle = (url, fn, delay) => {
    if (!store.has(url) && !transit.has(url)) {
      transit.set(url, setTimeout(fn, delay))
    }
  }

  /**
   * Fetch document and add the response to session cache.
   * Lifecycle event `pjax:cache` will fire upon completion.
   *
   * @param {Store.IPage} state
   * @returns{Promise<boolean>}
   */
  const prefetch = async state => {

    if (!(await request.get(state))) {
      console.warn(`Pjax: Prefetch will retry on next mouseover for: ${state.url}`)
    }

    return cleanup(state.url)
  }

  /**
   * Attempts to visit location, Handles bubbled mousovers and
   * Dispatches to the fetcher. Once item is cached, the mouseover
   * event is removed.
   *
   * @param {MouseEvent} event
   */
  const onMouseover = (event) => {

    const target = getLink(event.target, LinkPrefetchHover)

    if (!target) return undefined

    const { url, location } = path.get(target)

    if (!dispatchEvent('pjax:prefetch', {
      target,
      url,
      location
    }, true)) return disconnect(target)

    if (store.has(url, { snapshot: true })) return disconnect(target)

    handleLeave(target)

    const state = hrefs.attrparse(target, {
      url,
      location,
      position: { x: 0, y: 0 }
    })

    throttle(url, async () => {

      if ((await prefetch(state))) handleLeave(target)

    }, state?.threshold || store.config.prefetch.mouseover.threshold)
  }

  /**
   * Attempts to visit location, Handles bubbled mousovers and
   * Dispatches to the fetcher. Once item is cached, the mouseover
   * event is removed.
   *
   * @param {MouseEvent} event
   */
  const onMouseMove = event => {

    position.x = event.pageX
    position.y = event.pageY

  }

  /**
   *
   * @param {Element} target
   * @param {number} index
   */
  const proximity = (target, index) => {

    const { top, left } = target.getBoundingClientRect()
    const { scrollTop, scrollLeft } = document.body

    // @ts-ignore
    target.proximity = Math.floor(
      Math.sqrt(
        Math.pow(position.x - ((left + scrollLeft) + (target.clientWidth / 2)), 2) +
        Math.pow(position.y - ((top + scrollTop) + (target.clientHeight / 2)), 2)
      )
    )

    // @ts-ignore
    console.log(target.proximity)

    // @ts-ignore
    if (target.proximity < 100) {
      console.log(index, target)
      // elements.splice(index, 1)
    }

  }

  /**
   * Attach mouseover events to all defined element targets
   *
   * @param {EventTarget} target
   * @param {number} index
   * @param {Element[]} items
   * @returns {void}
   */
  const handleHover = (target, index, items) => {

    // if (target instanceof Element) proximity(target, index)

    if (supportsPointerEvents) {
      target.addEventListener('pointerover', onMouseover, false)
    } else {
      target.addEventListener('mouseover', onMouseover, false)
    }

  }

  /**
   * Cancels prefetch, if mouse leaves target before threshold
   * concludes. This prevents fetches being made for hovers that
   * do not exceeds threshold.
   *
   * @param {Element} target
   */
  function handleLeave (target) {

    if (supportsPointerEvents) {
      target.removeEventListener('pointerout', onMouseleave, false)
    } else {
      target.removeEventListener('mouseleave', onMouseleave, false)
    }
  }

  /**
   * Adds and/or Removes click events.
   *
   * @param {EventTarget} target
   * @returns {void}
   */
  function disconnect (target) {

    if (supportsPointerEvents) {
      target.removeEventListener('pointerover', onMouseleave, false)
      target.removeEventListener('pointerout', onMouseleave, false)
    } else {
      target.removeEventListener('mouseleave', onMouseleave, false)
      target.removeEventListener('mouseover', onMouseover, false)
    }

  }

  return {

    /**
     * Starts mouseovers, will attach mouseover events
     * to all elements which contain a `data-pjax-prefetch="hover"`
     * data attribute
     *
     * @export
     * @returns {void}
     */
    start: () => {

      if (!connected) {
        getTargets(LinkPrefetchHover).forEach(handleHover)
        // addEventListener('mousemove', onMouseMove, false)
        connected = true
      }
    },

    /**
     * Stops mouseovers, will remove all mouseover and mouseout
     * events on elements which contains a `data-pjax-prefetch="hover"`
     * unless target href already exists in cache.
     *
     * @export
     * @returns {void}
     */
    stop: () => {

      if (connected) {
        transit.clear()
        getTargets(LinkPrefetchHover).forEach(disconnect)
        // removeEventListener('mousemove', onMouseMove, false)
        connected = false
      }
    }

  }

})(false)
