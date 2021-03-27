import hrefs from '../observers/hrefs'
import hover from '../observers/hover'
import intersect from '../observers/intersect'
import scroll from '../observers/scroll'
import history from '../observers/history'
import _history from 'history/browser'
import path from './path'
import store from './store'

export default (function (connected) {

  /**
   * Sets initial page state executing on intial load.
   * Caches page so a return navigation does not perform
   * an extrenous request.
   *
   * @returns {void}
   */
  const onload = () => {

    const page = store.create({
      url: path.url,
      location: path.parse(path.url),
      position: scroll.position
    }, document.documentElement.outerHTML)

    _history.replace(history.location, page)

    removeEventListener('load', onload)

  }

  /**
   * Initialize
   *
   * @exports
   * @returns {void}
   */
  const initialize = () => {

    if (!connected) {

      history.start()
      hrefs.start()
      scroll.start()
      hover.start()
      intersect.stop()

      addEventListener('load', onload)

      connected = true

      console.info('Pjax: Connection Established ⚡')
    }
  }

  /**
   * Destory Pjax instances
   *
   * @exports
   * @returns {void}
   */
  const destroy = () => {

    if (connected) {

      history.stop()
      hrefs.stop()
      scroll.stop()
      hover.stop()
      intersect.stop()
      store.clear()

      connected = false

      console.warn('Pjax: Instance has been disconnected! 😔')
    } else {
      console.warn('Pjax: No connection made, disconnection is void 🙃')
    }

  }

  return {
    initialize,
    destroy
  }

}(false))
