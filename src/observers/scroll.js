import { store } from '../app/store'

/**
 * Scroll position handler
 *
 * @param {boolean} connected
 */
export default (function (connected) {

  /**
   * @type {IPjax.IPosition}
   */
  let position = { x: 0, y: 0 }

  /**
   * Resets the scroll position`of the document, applying
   * a `x`and `y` positions to `0`
   *
   * @exports
   * @returns {IPjax.IPosition}
   */
  const reset = () => {

    position.x = 0
    position.y = 0

    return position

  }

  /**
   * onScroll event, asserts the current X and Y page
   * offset position of the document
   *
   * @returns {void}
   */
  const onScroll = () => {
    position.x = window.pageXOffset
    position.y = window.pageYOffset
  }

  return {

    reset,

    /**
     * Returns to current scroll position, the `reset()`
     * function **MUST** be called after referencing this
     * to reset position.
     *
     * @exports
     * @returns {IPjax.IPosition}
     */
    get position () {

      return position
    },

    /**
     * Sets scroll position to the cache reference and
     * returns a reset position.
     *
     * This function is called before a new page visit
     * navigation begins, as it will assert the current
     * position to the current page and return the reset
     * position, ie: `{x: 0, y: 0 }`) to new page visit.
     *
     *
     * @exports
     * @param {string} url
     * @returns {Store.IPosition}
     */
    set (url) {

      // We assert current position here

      if (store.has(url)) {
        store.cache(url).position = this.position
      }

      return reset()

    },

    /**
     * Attached `scroll` event listener.
     *
     * @returns {void}
     */
    start: () => {

      if (!connected) {
        addEventListener('scroll', onScroll, false)
        onScroll()
        connected = true
      }

    },

    /**
     * Removed `scroll` event listener.
     *
     * @returns {void}
     */
    stop: () => {
      if (connected) {
        removeEventListener('scroll', onScroll, false)
        position = { x: 0, y: 0 }
        connected = false
      }
    }
  }

})(false)
