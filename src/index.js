import { Protocol } from './constants/regexp'
import { store } from './app/store'
import { nanoid } from 'nanoid'
import render from './app/render'
import path from './app/path'
import hrefs from './observers/hrefs'
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
 * @param {Store.IPresets} options
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
export const flush = () => store.clear()

/**
 * Capture DOM
 *
 * @param {string} url
 * @param {object} action
 */
export const capture = (url, action) => render.captureDOM(path.get(url), action)

/**
 * Visit
 *
 * @param {string} url
 * @param {Store.IPage} state
 */
export const visit = (url, state) => {

  url = path.get(url, true)

  return hrefs.navigate(url, { ...state, url, location: path.parse(url) })

}

/**
 * Disconnect
 *
 * Disconnect Pjax
 */
export const disconnect = () => controller.destroy()
