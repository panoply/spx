import hrefs from '../observers/hrefs'
import hover from '../observers/hover'
import intersect from '../observers/intersect'
import scroll from '../observers/scroll'
import history from '../observers/history'
import { store } from './store'

let started = false

/**
 * Initialize
 *
 * @exports
 * @returns {void}
 */
export function initialize () {

  if (!started) {

    history.start()
    hrefs.start()
    scroll.start()
    hover.start()
    intersect.stop()

    addEventListener('load', store.initialize)
    started = true

    console.info('Pjax: Connection Established ⚡')
  }
}

/**
 * Destory Pjax instances
 *
 * @exports
 * @returns {void}
 */
export function destroy () {

  if (started) {

    history.stop()
    hrefs.stop()
    scroll.stop()
    hover.stop()
    intersect.stop()
    store.clear()

    started = false

    console.warn('Pjax: Instance has been disconnected! 😔')
  } else {
    console.warn('Pjax: No connection made, disconnection is void 🙃')
  }

}
