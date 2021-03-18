import { navigate, visitClickState } from '../app/visit'
import { dispatchEvent, linkEventValidate, linkLocator } from '../app/utils'
import { Link } from '../constants/common'
import { onMouseleave } from './mouseover'

/**
 * @type {boolean}
 */
let started = false

/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */

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

/**
 * Attempts to visit href location, Handles click bubbles and
 * Dispatches a `pjax:click` event respecting the cancelable
 * `preventDefault()` from user event
 *
 * @param {MouseEvent} event
 */
function onClick (event) {

  if (linkEventValidate(event)) {

    event.preventDefault()

    const target = linkLocator(event.target, Link)

    if (target && target.tagName === 'A') {

      const state = visitClickState(target)

      if (dispatchEvent('pjax:click', state, true)) {
        if (state.method === 'prefetch') onMouseleave(event)
        return navigate(state)
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

  removeEventListener('click', onClick, false)
  addEventListener('click', onClick, false)

}
