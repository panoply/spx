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
 * caches it so return navigation don't perform an extrenous
 * request
 *
 * @param {Event} event
 */
function setInitialCache (event) {

  const location = expandURL(window.location.href)
  const state = store.update.page({
    title: document.title,
    url: location.pathname + location.search,
    snapshot: render.DOMSnapshot(document),
    location
  })

  cache.set(state.url, state)

}

/**
 * Initialize
 */
export function initialize () {

  if (!store.started) {

    history.start()
    hrefs.start()
    scroll.start()
    mouseover.start()
    intersect.start()

    addEventListener('load', setInitialCache, false)

    console.info('Pjax: Connection Established ⚡')

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
