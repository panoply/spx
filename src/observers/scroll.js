/**
 * Scroll position handler
 *
 * @param {boolean} connected
 */
export default (function (connected) {

  /**
   * @type {Store.IPosition}
   */
  let position = { x: 0, y: 0 }

  /**
   * Resets the scroll position`of the document, applying
   * a `x`and `y` positions to `0`
   *
   * @exports
   * @returns {Store.IPosition}
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

    /* EXPORTS ------------------------------------ */

    reset,

    /* GETTERS ------------------------------------ */

    /**
     * Returns to current scroll position, the `reset()`
     * function **MUST** be called after referencing this
     * to reset position.
     *
     * @exports
     * @returns {Store.IPosition}
     */
    get position () { return position },

    /**
     * Returns a faux scroll position. This prevents the
     * tracked scroll position from being overwritten and is
     * used within functions like `href.attrparse`
     *
     * @returns {Store.IPosition}
     */
    get y0x0 () { return { x: 0, y: 0 } },

    /* CONTROLS ----------------------------------- */

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
