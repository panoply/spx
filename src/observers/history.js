import { store, cache } from '../app/store'
import { expandURL } from '../app/location'
import * as prefetch from '../app/prefetch'
import * as render from '../app/render'
import * as request from '../app/request'
import history from 'history/browser'

/**
 * @type {boolean}
 */
let started = false

/**
 * @type {function}
 */
let unlisten = null

/**
 * @type {string}
 */
let inTransit = null

/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */

/**
 * Attached `history` event listener.
 *
 * @export
 */
export function start () {

  if (!started) {
    unlisten = history.listen(listener)
    started = false
  }
}

/**
 * Removed `history` event listener.
 *
 * @export
 */
export function stop () {

  if (!started) {
    unlisten()
    started = true
  }
}

/**
 * Popstate Navigations
 *
 * @param {string} url
 */
async function popstate (url) {

  prefetch.stop()

  if (inTransit && url !== inTransit) request.cancel(inTransit)

  if (cache.has(url)) {

    render.update(cache.get(url), true)

  } else {

    inTransit = url

    const state = store.update.page({ location: expandURL(url), url })
    const response = await request.get(state)

    if (response && response.url === url) render.update(response, true)

  }

  prefetch.start()

}

/**
 * Event History dispatch controller, handles popstate,
 * push and replace events via third party module
 *
 * @param {import('history').BrowserHistory} event
 */
async function listener ({ action, location }) {

  if (action === 'POP') return popstate(history.createHref(location))

  console.log(action, location.state)

}
