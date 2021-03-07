import { Protocol, isReady } from './constants/regexp'
import { store } from './app/store'
import * as controller from './app/controller'

/**
 * @export
 * @class Pjax
 */
export const supported = !!(
  window.history.pushState &&
  window.requestAnimationFrame &&
  window.addEventListener
)

/**
 * Connect Pjax
 *
 * @param {IPjax.IConfigPresets} options
 */
export const connect = options => {

  const initialize = controller.initialize(undefined)

  store.connect(options)

  if (supported) {
    if (Protocol.test(window.location.protocol)) {
      if (isReady.test(document.readyState)) {
        initialize()
      } else {
        addEventListener('DOMContentLoaded', initialize, false)
      }
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
export const reload = () => {

}

/**
 * Visit
 *
 * @param {IPjax.IState} state
 */
export const visit = state => controller.navigate(state)

/**
 * Disconnect
 *
 * Disconnect Pjax
 */
export const disconnect = () => {

}
