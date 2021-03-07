import * as hrefs from '../observers/hrefs'
import * as prefetch from '../observers/prefetch'
import * as render from './render'
import * as request from './request'
import { store } from './store'

/**
 * Popstate event handler
 *
 * @param {PopStateEvent} event
 */
const popstate = event => {

  if (store.config.prefetch) prefetch.stop()
  if (event?.state) render.update(event.state, true)
  if (store.config.prefetch) prefetch.start()

}

/**
 * Initialize
 *
 * @param {boolean} started
 */
export const initialize = started => () => {

  if (typeof started !== 'undefined' && !started) {

    hrefs.start()
    prefetch.start()

    addEventListener('popstate', popstate)

    started = true

  } else {

    started = false

  }

}

/**
 * Executes a visit by fetching the the cached response
 * from the session and passes it to the renderer.
 *
 * @param {string} url
 */
export const cacheVisit = url => {

  const state = store.cache.get(url)

  console.log('cache', url)

  if (store.config.prefetch) prefetch.stop()

  render.update(state)

  if (store.config.prefetch) prefetch.start()

}

/**
 * Pjax link handler which dispatches a fetch request
 * when `href` tag is clicked. If clicked link is in transit
 * from prefetch it will pass to cache visit
 *
 * @param {IPjax.IState} state
 */
export const pjaxVisit = async state => {

  if (prefetch.inFlight(state.url)) {
    if ((await request.inFlight(state.url))) return cacheVisit(state.url)
    request.cancel(state.url)
  }

  if (store.config.prefetch) prefetch.stop()

  state.snapshot = await request.get(state)

  if (!store.cache.has(state.url)) store.cache.set(state.url, state)

  render.update(state)

  if (store.config.prefetch) prefetch.start()

}

/**
 * Executes a pjax navigation.
 *
 * @param {IPjax.IState} state
 */
export const navigate = state => (
  store.cache.has(state.url) ? cacheVisit(state.url) : pjaxVisit(state)
)
