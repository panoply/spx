import { store } from './store'
import { asyncTimeout, byteConvert, byteSize, dispatchEvent } from './utils'
import { xhrFailed, xhrPrevented, xhrSuccess, xhrEmpty, xhrExists } from '../constants/enums'

/**
 * Executes on request end. Removes the XHR recrod and update
 * the response DOMString cache size record.

 * @param {string} url
 * DOM string, equivelent to`document.documentElement.outerHTML`
 *
 * @param {string} DOMString
 * DOM string, equivelent to`document.documentElement.outerHTML`
 *
 * @returns {void}
 * Executes asynchronously, to prevent any delayed between requests
 */
function HttpRequestEnd (url, DOMString) {

  const { total } = store.request.cache

  store.request.xhr.delete(url)
  store.update.request({
    cache: {
      total: (total + byteSize(DOMString)),
      weight: byteConvert(total)
    }
  })

  // console.log('cache size: ', store.request.cache.weight)

}

/**
 * Fetch XHR Request wrapper function
 *
 * @param {IPjax.IState} state
 * The `location.href`request address
 *
 * @return {Promise<string>}
 * DOM string, equivelent to `document.documentElement.outerHTML`
 */
function HttpRequest ({
  url,
  prefetch,
  target,
  location: {
    href
  }
}) {

  const xhr = new XMLHttpRequest()

  return new Promise((resolve, reject) => {

    // OPEN
    //
    xhr.open('GET', href, true)

    // HEADERS
    //
    xhr.setRequestHeader('X-Pjax', 'true')
    xhr.setRequestHeader('X-Pjax-Prefetch', `${prefetch}`)
    xhr.setRequestHeader('X-Pjax-Target', JSON.stringify(target))
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

    // EVENTS
    //
    xhr.onloadstart = e => store.request.xhr.set(url, xhr)
    xhr.onload = e => xhr.status === 200 ? resolve(xhr.responseText) : null
    xhr.onloadend = e => HttpRequestEnd(url, xhr.responseText)
    xhr.onerror = reject

    // SEND
    //
    xhr.send(null)

  })

}

/**
 * Cancels the request in transit
 *
 * @param {string} url
 * The `cacheKey` url identifier
 *
 * @returns {void}
 * The request will either be aborted or warn in console if failed
 */
export function cancel (url) {

  if (store.request.xhr.has(url)) {

    // ABORT AND REMOVE
    //
    store.request.xhr.get(url).abort()
    store.request.xhr.delete(url)

    console.info(`XHR Request was cancelled for url: ${url}`)

  } else {
    console.warn(`No in-flight request in transit for url: ${url}`)
  }
}

/**
 * Prevents repeated requests from being executed.
 * When prefetching, if a request is in transit and a click
 * event dispatched this will prevent multiple requests and
 * instead wait for initial fetch to complete.
 *
 * @param {string} url
 * The `cacheKey` url identifier
 *
 * @param {number} [limit=0]
 * Number of recursive runs to make, set this to 85 to disable,
 * else just leave it to execute as is.
 *
 * @return {Promise<boolean>}
 * Returns `true` if request resolved in `850ms` else `false`
 */
export async function inFlight (url, limit = 0) {

  if (store.request.xhr.has(url) && limit <= 85) {
    console.log('waiting', url, limit)
    return asyncTimeout(() => inFlight(url, (limit + 1)), 25)
  }

  return !store.request.xhr.has(url)

}

/**
 * Fetches documents and guards from duplicated requests
 * from being dispatched if an indentical fetch is in flight.
 *
 * @param {IPjax.IState} state
 * The page state object acquired from link
 *
 * @return {Promise<number>}
 * A boolean response representing a successful or failed fetch
 */
export async function get (state) {

  if (store.request.xhr.has(state.url)) return xhrExists
  if (!dispatchEvent('pjax:request', state.location, true)) return xhrPrevented

  try {

    const snapshot = await HttpRequest(state)

    if (typeof snapshot === 'string' && snapshot.length > 0) {

      state.snapshot = snapshot

      if (store.config.cache && !store.cache.has(state.url)) {
        if (dispatchEvent('pjax:cache', state, true)) {
          store.cache.set(state.url, state)
        }
      }

      return xhrSuccess

    } else {
      console.info(`Pjax: Failed to receive response at: ${state.url}`)
      return xhrEmpty
    }

  } catch (error) {
    store.request.xhr.delete(state.url)
    console.error(error)
  }

  return xhrFailed

}
