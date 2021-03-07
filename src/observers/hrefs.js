import { ForEach, Dispatch, jsonAttrs } from '../app/utils'
import { Link } from '../constants/common'
import { isNumber, isBoolean, isWhitespace, inPosition } from '../constants/regexp'
import { getCacheKeyFromTarget, getLocationFromURL } from '../app/location'
import { navigate } from '../app/controller'
import { store } from '../app/store'

/**
 * Handles a clicked link, prevents special click types.
 *
 * @param {MouseEvent} event
 * @return {boolean}
 */
export const linkEventValidate = event => (

  // @ts-ignore
  !((event.target && event.target.isContentEditable) ||
    event.defaultPrevented ||
    event.which > 1 ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey)

)

/**
 * Locted the closest link when click bubbles.
 *
 * @param {EventTarget} target
 * @return {Element|false}
 */
const linkLocator = target => (target instanceof Element) ? target.closest(Link) : false

/**
 * Sets the page state configuration object from which
 * attribute options will be applied.
 *
 * @param {Element} target
 * @return {IPjax.IState}
 */
const setState = target => {

  const url = getCacheKeyFromTarget(target)

  return store.cache.has(url) ? store.cache.get(url) : store.update.page(
    {
      url,
      location: getLocationFromURL(url)
    }
  )

}

/**
 * Parses link `href` attributes and assigns them to
 * configuration options. Each link target can define
 * navigation options.
 *
 * @param {Element} target
 * @return {IPjax.IState}
 */
export const getState = target => {

  const state = setState(target)

  ForEach(store.hrefs.attrs, prop => {

    const value = target.getAttribute(`data-pjax-${prop}`)

    if (value === null) return

    state[prop] = (prop === 'target') ? (

      value.split(isWhitespace)

    ) : (prop === 'position' || prop === 'chunks') ? (

      value.match(inPosition).reduce(jsonAttrs, {})

    ) : isBoolean.test(value.trim()) ? (

      value === 'true'

    ) : isNumber.test(value.trim()) ? (

      Number(value)

    ) : (

      value.trim()

    )

  })

  return state

}

/**
 * Attempted to visit location, Handles bubbled click events and
 * Dispatches a `pjax:click` event respecting the cancelable
 * `preventDefault()` from user event
 *
 * @param {MouseEvent} event
 */
const visitOnClick = (event) => {

  if (linkEventValidate(event)) {

    const target = linkLocator(event.target)

    if (target) {

      event.preventDefault()

      const newState = getState(target)

      if (Dispatch('pjax:click', { state: newState, target }, true)) {
        return navigate(newState)
      }

    }
  }
}

/**
 * Adds and/or Removes click events.
 *
 * @private
 */
const captureClick = () => {

  removeEventListener('click', visitOnClick, false)
  addEventListener('click', visitOnClick, false)

}

/**
 * Attached `click` event listener.
 *
 * @memberof LinksObserver
 */
export const start = () => {

  if (!store.hrefs.started) {
    addEventListener('click', captureClick, true)
    store.hrefs.started = true
  }

}

/**
 * Removed `click` event listener.
 *
 * @memberof LinksObserver
 */
export const stop = () => {

  if (store.hrefs.started) {
    removeEventListener('click', captureClick, true)
    store.hrefs.started = false
  }

}
