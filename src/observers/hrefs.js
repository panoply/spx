import { navigate, visitClickState } from '../app/visit'
import { dispatchEvent, linkEvent, linkLocate } from '../app/utils'
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
 * @exports
 * @returns {void}
 */
export function start () {

  if (!started) {
    addEventListener('click', observe, true)
    started = true
  }

}

/**
 * Removed `click` event listener.
 *
 * @export
 * @returns {void}
 */
export function stop () {

  if (started) {
    removeEventListener('click', observe, true)
    started = false
  }

}

/**
 * Adds and/or Removes click events.
 *
 * @returns {void}
 */
function observe () {

  removeEventListener('click', onClick, false)
  addEventListener('click', onClick, false)

}

/**
 * Attempts to visit href location, Handles click bubbles and
 * Dispatches a `pjax:click` event respecting the cancelable
 * `preventDefault()` from user event
 *
 * @param {MouseEvent} event
 * @returns {Promise<void>}
 */
function onClick (event) {

  if (linkEvent(event)) {

    event.preventDefault()

    const target = linkLocate(event.target, Link)

    if (target && target.tagName === 'A') {

      const state = visitClickState(target)

      if (dispatchEvent('pjax:click', state, true)) {
        if (state.method === 'prefetch') onMouseleave(event)
        return navigate(state)
      }
    }
  }
}
