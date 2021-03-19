import { store, snapshots, requests, cache } from './store'
import { asyncTimeout, byteConvert, byteSize, dispatchEvent } from './utils'
import { nanoid } from 'nanoid'
import * as progress from './progress'

/* -------------------------------------------- */
/* LETTINGS                                     */
/* -------------------------------------------- */

let storage = 0

/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */

/**
 * Executes on request end. Removes the XHR recrod and update
 * the response DOMString cache size record.
 *
 * @exports
 * @param {string} url
 * @param {string} DOMString
 * @returns {boolean}
 */
function HttpRequestEnd (url, DOMString) {

  storage = storage + byteSize(DOMString)

  return requests.delete(url)

}

/**
 * Fetch XHR Request wrapper function
 *
 * @exports
 * @param {IPjax.IState} state
 * @param {boolean} [async=false]
 * @returns {Promise<string>}
 */
async function HttpRequest ({
  url,
  prefetch,
  target,
  location: {
    href
  }
}, async) {

  const xhr = new XMLHttpRequest()

  return new Promise((resolve, reject) => {

    // OPEN
    //
    xhr.open('GET', href, async)

    // HEADERS
    //
    xhr.setRequestHeader('X-Pjax', 'true')
    xhr.setRequestHeader('X-Pjax-Prefetch', `${prefetch}`)
    xhr.setRequestHeader('X-Pjax-Target', JSON.stringify(target))
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

    // EVENTS
    //
    xhr.onloadstart = e => requests.set(url, xhr)
    xhr.onload = e => xhr.status === 200 ? resolve(xhr.responseText) : null
    xhr.onloadend = e => HttpRequestEnd(url, xhr.responseText)
    xhr.onerror = reject

    // SEND
    //
    xhr.send(null)

  })

}

/**
 * Returns request cache metrics
 *
 * @exports
 * @returns {IPjax.ICacheSize}
 */
export function cacheSize () {

  return {
    requests: snapshots.size,
    total: storage,
    weight: byteConvert(storage)
  }

}

/**
 * Cancels the request in transit
 *
 * @exports
 * @param {string} url
 * @returns {void}
 */
export function cancel (url) {

  if (requests.has(url)) {

    requests.get(url).abort()
    requests.delete(url)

    console.warn(`Pjax: XHR Request was cancelled for url: ${url}`)

  }
}

/**
 * Prevents repeated requests from being executed.
 * When prefetching, if a request is in transit and a click
 * event dispatched this will prevent multiple requests and
 * instead wait for initial fetch to complete.
 *
 * Number of recursive runs to make, set this to 85 to disable,
 * else just leave it to execute as is.
 *
 * Returns `true` if request resolved in `850ms` else `false`
 *
 * @exports
 * @param {string} url
 * @param {number} [limit=0]
 * @return {Promise<boolean>}
 */
export async function inFlight (url, limit = 0) {

  if (requests.has(url) && limit <= 85) {
    if (store.config.progress && !progress.loading) {
      if (limit === store.config.threshold.progress) progress.show()
    }

    return asyncTimeout(() => inFlight(url, (limit + 1)), 25)

  }

  return !requests.has(url)

}

/**
 * Fetches documents and guards from duplicated requests
 * from being dispatched if an indentical fetch is in flight.
 *
 * @exports
 * @param {IPjax.IState} state
 * @param {boolean} [async=false]
 * @return {Promise<IPjax.IState|false>}
 */
export async function get (state, async = true) {

  if (requests.has(state.url)) {
    console.warn(`Pjax: XHR Request is already in transit for: ${state.url}`)
    return false
  }

  if (!dispatchEvent('pjax:request', state.location, true)) {
    console.warn(`Pjax: Request cancelled via dispatched event for: ${state.url}`)
    return false
  }

  if (state.method !== 'prefetch') {
    if (store.config.progress && !progress.loading) progress.show()
  }

  try {

    const response = await HttpRequest(state, async)

    if (typeof response === 'string' && response.length > 0) {

      if (!state.snapshot) state.snapshot = nanoid(16)

      snapshots.set(state.snapshot, response)

      if (store.config.cache && !cache.has(state.url)) {
        if (dispatchEvent('pjax:cache', state, true)) {
          cache.set(state.url, state)
        }
      }

      if (store.config.progress && progress.loading) progress.hide()

      return Promise.resolve(state)

    } else {
      console.warn(`Pjax: Failed to receive response at: ${state.url}`)
    }

  } catch (error) {

    requests.delete(state.url)
    console.error(error)

  }

  return false

}
