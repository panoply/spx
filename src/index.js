import { Protocol } from './constants/regexp'
import { store, cache } from './app/store'
import { navigate } from './app/visit'
import { nanoid } from 'nanoid'
import { captureDOM } from './app/render'
import * as controller from './app/controller'

/**
 * @export
 * @class Pjax
 */
export const supported = !!(
  window.history.pushState &&
  window.requestAnimationFrame &&
  window.addEventListener &&
  window.DOMParser
)

/**
 * Connect Pjax
 *
 * @param {IPjax.IConfigPresets} options
 */
export const connect = options => {

  store.connect(options)

  if (supported) {
    if (Protocol.test(window.location.protocol)) {
      addEventListener('DOMContentLoaded', controller.initialize)
    } else {
      console.error('Invalid protocol, pjax expects https or http protocol')
    }
  } else {
    console.error('Pjax is not supported by this browser')
  }

}

/**
 * Reload
 *
 * Reloads the current page
 */
export const reload = () => {}

/**
 * UUID Generator
 */
export const uuid = (size = 12) => nanoid(size)

/**
 * Flush Cache
 */
export const flush = () => cache.clear()

/**
 * Capture DOM
 *
 * @param {string} url
 * @param {object} action
 */
export const capture = (url, action) => captureDOM(url, action)

/**
 * Visit
 *
 * @param {string} url
 * @param {IPjax.IState} state
 */
export const visit = (url, state = store.page) => navigate({ ...state, url })

/**
 * Disconnect
 *
 * Disconnect Pjax
 */
export const disconnect = () => controller.destroy()
