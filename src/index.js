import { Protocol } from './constants/regexp'
import { nanoid } from 'nanoid'
import store from './app/store'
import render from './app/render'
import path from './app/path'
import hrefs from './observers/hrefs'
import controller from './app/controller'

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
 *
 * @param {string} [url]
 */
export const clear = (url) => store.clear(url)

/**
 * Capture DOM
 *
 * @param {string} url
 * @param {object} action
 */
export const capture = (url, action) => render.captureDOM(path.key(url), action)

/**
 * Visit
 *
 * @param {string|Element} link
 * @param {Store.IPage} state
 * @returns {Promise<Store.IPage|void>}
 */
export const visit = (link, state = {}) => {

  const { url, location } = path.get(link, { update: true })

  return hrefs.navigate(url, { ...state, url, location })
}

/**
 * Disconnect
 *
 * Disconnect Pjax
 */
export const disconnect = () => controller.destroy()
