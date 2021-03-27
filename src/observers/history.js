import history from 'history/browser'
import { createPath } from 'history'
import render from '../app/render'
import request from '../app/request'
import store from '../app/store'

/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */
/**
 * Link (href) handler
 *
 * @typedef {Store.IPage|string|boolean} click
 * @param {boolean} connected
 */
export default (function (connected) {

  /**
 * @type {function}
 */
  let unlisten = null

  /**
   * @type {string}
   */
  let inTransit = null

  /**
   * Popstate Navigation
   *
   * @param {string} url
   * @param {Store.IPage} state
   * @returns {Promise<void|Store.IPage>}
   */
  const popstate = async (url, state) => {

    // console.log(state)

    if (url !== inTransit) request.cancel(inTransit)

    if (store.has(url, { snapshot: true })) {
      return render.update(store.get(url).page, true)
    }

    inTransit = url

    const page = await request.get(state)

    return page
      ? render.update(page, true)
      : window.location.replace(url)

  }

  /**
   * Event History dispatch controller, handles popstate,
   * push and replace events via third party module
   *
   * @param {import('history').BrowserHistory} event
   */
  const listener = ({ action, location }) => {

    // console.log(action, location)

    if (action === 'POP') {
      return popstate(createPath(location), location.state)
    }

  }

  return {

    /* CONTROLS ----------------------------------- */

    /**
     * Attached `history` event listener.
     *
     * @returns {void}
     */
    start: () => {

      if (!connected) {
        unlisten = history.listen(listener)
        connected = false
      }
    },

    /**
     * Removed `history` event listener.
     *
     * @returns {void}
     */
    stop: () => {

      if (!connected) {
        unlisten()
        connected = true
      }
    }

  }

})(false)
