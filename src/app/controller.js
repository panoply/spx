import * as hrefs from '../observers/hrefs'
import * as prefetch from '../observers/prefetch'
import * as render from './render'
import * as request from './request'
import { XHRSuccess } from '../constants/enums'
import { dispatchEvent } from './utils'
import { store } from './store'
import { expandURL, getCacheKey, getLocation } from './location'

/**
 * Popstate event handler
 *
 * @param {PopStateEvent} event
 */
function popstate (event) {

  if (store.config.prefetch) prefetch.stop()

  if (event?.state) {
    render.update(event.state, true)
  } else {

    // If get here default to regular back button
    history.back()
  }

  if (store.config.prefetch) prefetch.start()

}

/**
 * Sets initial page state on landing page and
 * caches it so return navigation don't perform an extrenous
 * request
 *
 * @param {Window} window
 */
function setInitialCache ({ location: { href } }) {

  const location = expandURL(href)
  const url = getCacheKey(location)
  const state = store.update.page({
    url,
    location: getLocation(location),
    snapshot: document.documentElement.outerHTML
  })

  store.cache.set(url, state)

}

/**
 * Initialize
 */
export const initialize = () => {

  if (!store.started) {

    setInitialCache(window)

    hrefs.start()
    prefetch.start()

    console.info('Pjax: Connection Established ⚡')

    addEventListener('popstate', popstate)
    dispatchEvent('pjax:load', store.page)

    store.started = true

  }

}

/**
 * Destory Pjax instances
 *
 * @exports
 */
export function destroy () {

  if (store.started) {

    removeEventListener('popstate', popstate)

    hrefs.stop()
    prefetch.stop()

    store.cache.clear()
    store.started = false

    console.info('Pjax: Instance has been disconnected! 😔')

  } else {
    console.info('Pjax: No connection made, disconnection is void 🙃')
  }

}

/**
 * Executes a visit by fetching the the cached response
 * from the session and passes it to the renderer.
 *
 * @param {string} url
 * @exports
 */
export const cacheVisit = url => {

  const state = store.cache.get(url)

  // console.log('cache', url)

  if (store.config.prefetch) prefetch.stop()

  // ensure we have state before updating
  if (state) render.update(state)

  if (store.config.prefetch) prefetch.start()

}

/**
 * Pjax link handler which dispatches a fetch request
 * when `href` tag is clicked. If clicked link is in transit
 * from prefetch it will pass to cache visit
 *
 * @param {IPjax.IState} state
 */
export async function pjaxVisit (state) {

  if (store.prefetch.transit.has(state.url)) {
    if ((await request.inFlight(state.url))) return cacheVisit(state.url)
    request.cancel(state.url)
  }

  if (store.config.prefetch) prefetch.stop()

  const response = await request.get(state)

  if (response === XHRSuccess) render.update(store.page)

  if (store.config.prefetch) prefetch.start()

}

/**
 * Executes a pjax navigation.
 *
 * @param {IPjax.IState} state
 */
export function navigate (state) {

  return store.cache.has(state.url) ? cacheVisit(state.url) : pjaxVisit(state)
}
