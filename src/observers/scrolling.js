
/**
 * @type {boolean}
 */
let started = false

/**
 * @type {IPjax.IPosition}
 */
const position = { x: 0, y: 0 }

/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */

/**
 * Attached `scroll` event listener.
 *
 * @export
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
 * @export
 */
export function stop () {
  if (started) {
    removeEventListener('scroll', onScroll, false)
    started = false
  }
}

/**
 * Returns to current scroll position
 *
 * @export
 */
export function getPosition () {

  return position
}

/**
 * Resets scroll position
 *
 * @export
 */
export function reset () {

  position.x = 0
  position.y = 0

  return position

}

/**
 * onScroll event
 *
 * @export
 */
export function onScroll () {

  position.x = window.pageXOffset
  position.y = window.pageYOffset

}
