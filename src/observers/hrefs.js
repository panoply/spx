import { forEach, dispatchEvent, jsonAttrs } from '../app/utils'
import { Link } from '../constants/common'
import { isNumber, isBoolean, isWhitespace, inPosition } from '../constants/regexp'
import { getCacheKeyFromTarget, getLocationFromURL } from '../app/location'
import { navigate } from '../app/controller'
import { store } from '../app/store'

/**
 * @type {boolean}
 */
let started = false

/**
 * @type {string[]}
 */
const attrs = [
  'target',
  'action',
  'prefetch',
  'cache',
  'progress',
  'throttle',
  'position',
  'reload'
]

/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */

/**
 * Handles a clicked link, prevents special click types.
 *
 * @param {MouseEvent} event
 * @return {boolean}
 */
export function linkEventValidate (event) {

  // @ts-ignore
  return !((event.target && event.target.isContentEditable) ||
    event.defaultPrevented ||
    event.which > 1 ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey)

}

/**
 * Locted the closest link when click bubbles.
 *
 * @param {EventTarget} target
 * The link `href` element target
 *
 * @param {string} selector
 * The selector query name, eg: `[data-pjax]`
 *
 * @return {Element|false}
 */
export function linkLocator (target, selector) {

  return target instanceof Element ? target.closest(selector) : false
}

/**
 * Parses link `href` attributes and assigns them to
 * configuration options. Each link target can define
 * navigation options.
 *
 * @param {Element} target
 * The link `href` element target

 * @return {IPjax.IState}
 * Returns an updated page state object
 */
export function getState (target) {

  const url = getCacheKeyFromTarget(target)
  const state = store.cache.has(url) ? (
    store.cache.get(url)
  ) : store.update.page({
    url,
    location: getLocationFromURL(url)
  })

  forEach(attrs, prop => {

    const value = target.getAttribute(`data-pjax-${prop}`)

    if (value === null) {
      if (
        prop === 'prefetch' &&
        value !== 'hover' &&
        value !== 'intersect') state[prop] = false
    } else {

      state[prop] = prop === 'target' ? (

        value.split(isWhitespace)

      ) : (prop === 'position' || prop === 'threshold' || prop === 'chunks') ? (

        value.match(inPosition).reduce(jsonAttrs, {})

      ) : isBoolean.test(value.trim()) ? (

        value === 'true'

      ) : isNumber.test(value.trim()) ? (

        Number(value)

      ) : (

        value.trim()

      )
    }
  })

  return state

}

/**
 * Attempts to visit href location, Handles click bubbles and
 * Dispatches a `pjax:click` event respecting the cancelable
 * `preventDefault()` from user event
 *
 * @param {MouseEvent} event
 */
function visitOnClick (event) {

  if (linkEventValidate(event)) {
    event.preventDefault()

    const target = linkLocator(event.target, Link)

    if (target) {
      const state = getState(target)
      if (dispatchEvent('pjax:click', state, true)) return navigate(state)
    }
  }
}

/**
 * Adds and/or Removes click events.
 *
 * @private
 */
function captureClick () {

  removeEventListener('click', visitOnClick, false)
  addEventListener('click', visitOnClick, false)

}

/**
 * Attached `click` event listener.
 *
 * @export
 */
export function start () {

  if (!started) {
    addEventListener('click', captureClick, true)
    started = true
  }

}

/**
 * Removed `click` event listener.
 *
 * @export
 */
export function stop () {

  if (started) {
    removeEventListener('click', captureClick, true)
    started = false
  }

}
