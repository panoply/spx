import { cache } from '../app/store'

/* -------------------------------------------- */
/* LETTINGS                                     */
/* -------------------------------------------- */

/**
 * @type {boolean}
 */
let started = false

/**
 * @type {IPjax.IPosition}
 */
let position = { x: 0, y: 0 }

/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */

/**
 * Attached `scroll` event listener.
 *
 * @exports
 * @returns {void}
 */
export function start () {

  if (!started) {
    addEventListener('scroll', onScroll, false)
    onScroll()
    started = true
  }

}

/**
 * Removed `scroll` event listener.
 *
 * @exports
 * @returns {void}
 */
export function stop () {
  if (started) {
    removeEventListener('scroll', onScroll, false)
    position = { x: 0, y: 0 }
    started = false
  }
}

/**
 * Sets scroll position to the cache reference and
 * returns a reset position.
 *
 * This function is called before a new page visit
 * navigation begins, as it will assert the current
 * position to the current page and return the reset
 * position, ie: `{x: 0, y: 0 }`) to new page visit.
 *
 * If the passed in page state object position was modified
 * via attributes, eg: `data-pjax-position="x:number y:number"`
 * then position will be adjusted to match attribute config and
 * additionally returned.
 *
 *
 * @exports
 * @param {IPjax.IState} state
 * @returns {IPjax.IPosition}
 */
export function setPosition ({
  location: { lastUrl },
  position: { x, y }
}) {

  // We assert current position here
  cache.get(lastUrl).position = getPosition()

  if ((x === 0 && y === 0)) return reset()

  position.x = x === 0 ? 0 : x
  position.y = y === 0 ? 0 : x

  return position

}

/**
 * Returns to current scroll position, the `reset()`
 * function **MUST** be called after referencing this
 * to reset position.
 *
 * @exports
 * @returns {IPjax.IPosition}
 */
export function getPosition () {

  return position
}

/**
 * Resets the scroll position`of the document, applying
 * a `x`and `y` positions to `0`
 *
 * @exports
 * @returns {IPjax.IPosition}
 */
export function reset () {

  position.x = 0
  position.y = 0

  return position

}

/**
 * onScroll event, asserts the current X and Y page
 * offset position of the document
 *
 * @exports
 * @returns {void}
 */
export function onScroll () {

  position.x = window.pageXOffset
  position.y = window.pageYOffset

}
