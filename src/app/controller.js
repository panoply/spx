import { store, cache } from './store'
import { expandURL } from './location'
import * as hrefs from '../observers/hrefs'
import * as mouseover from '../observers/mouseover'
import * as intersect from '../observers/intersect'
import * as scroll from '../observers/scrolling'
import * as history from '../observers/history'
import * as render from './render'

/**
 * Sets initial page state on landing page and
 * caches it so return navigation don't perform
 * an extrenous request.
 *
 * @param {Event} event
 * @returns {Map<string, IPjax.IState>}
 */
function setInitialCache (event) {

  const location = expandURL(window.location.href)
  const state = store.update.page({
    url: location.lastUrl,
    snapshot: render.DOMSnapshot(document),
    title: document.title,
    location
  })

  return cache.set(state.url, state)

}

/**
 * Initialize
 *
 * @exports
 * @returns {void}
 */
export function initialize () {

  if (!store.started) {

    history.start()
    hrefs.start()
    scroll.start()
    mouseover.start()
    intersect.start()

    addEventListener('load', setInitialCache, false)

    store.started = true
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

  if (store.started) {

    history.stop()
    hrefs.stop()
    scroll.stop()
    mouseover.start()
    intersect.start()
    cache.clear()
    store.started = false

    console.warn('Pjax: Instance has been disconnected! 😔')
  } else {
    console.warn('Pjax: No connection made, disconnection is void 🙃')
  }

}
