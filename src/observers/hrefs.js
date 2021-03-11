import { store } from '../app/store'
import { expandURL } from '../app/location'
import { navigate } from '../app/controller'
import { getActiveDOM } from '../app/render'
import { forEach, dispatchEvent, jsonAttrs, actionAttrs } from '../app/utils'
import { Link } from '../constants/common'
import * as regexp from '../constants/regexp'

/**
 * @type {boolean}
 */
let started = false

/**
 * @type {string[]}
 */
const attrs = [
  'target',
  'method',
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
 * Define state location navigation
 *
 * @export
 *
 * @param {Element} target
 * The link `href` element target
 */
function getLocation (target) {

  const location = expandURL(target.getAttribute('href'))

  return {
    location,
    url: location.pathname + location.search
  }
}

/**
 * Get State Page
 *
 *
 * @param {Element} target
 * The link `href` element target
 *
 * @return {IPjax.IState}
 * Returns an updated page state object
 */
function getPageState (target) {

  const href = getLocation(target)
  const url = href.location.pathname + href.location.search

  return store.cache.has(url) ? store.cache.get(url) : store.update.page(href)

}

/**
 * Parses link `href` attributes and assigns them to
 * configuration options. Each link target can define
 * navigation options.
 *
 * @param {Element} target
 * The link `href` element target
 *
 * @param {boolean} isPrefetch
 * Boolean condition to determine is visit is a prefetch
 *
 * @return {IPjax.IState}
 * Returns an updated page state object
 */
export function visitState (target, isPrefetch = false) {

  if (isPrefetch === false) getActiveDOM(store.page.url)

  const state = getPageState(target)

  forEach(attrs, prop => {

    const value = target.getAttribute(`data-pjax-${prop}`)

    if (value === null) {

      if (
        prop === 'prefetch' &&
        value !== 'hover' &&
        value !== 'intersect') state[prop] = false

    } else {

      state[prop] = prop === 'target' ? (

        value.split(regexp.isWhitespace)

      ) : (prop === 'position' || prop === 'threshold') ? (

        value.match(regexp.inPosition).reduce(jsonAttrs, {})

      ) : regexp.isBoolean.test(value.trim()) ? (

        value === 'true'

      ) : prop === 'action' ? (

        actionAttrs(value)

      ) : regexp.isNumber.test(value.trim()) ? (

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
      if (target.tagName === 'A') {
        const state = visitState(target, false)
        if (dispatchEvent('pjax:click', state, true)) return navigate(state)
      }
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
