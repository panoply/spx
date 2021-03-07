import { asyncTimeout, bytesToSize } from './utils'
import { store } from './store'

/**
 * Updated the response DOMString cache size records
 *
 * @param {string} DOMString
 * DOM string, equivelent to`document.documentElement.outerHTML`
 *
 * @returns {Promise<void>}
 * Executes asynchronously, to prevent any delayed between requests
 */
const HttpResponseSize = async DOMString => {

  store.update.request({
    cache: {
      total: (store.request.cache.total + encodeURI(DOMString).split(/%..|./).length - 1),
      weight: bytesToSize(store.request.cache.total)
    }
  })

  console.log('cache size: ', store.request.cache.weight)

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
const HttpRequest = ({
  url,
  prefetch,
  target,
  location: {
    href
  }
}) => {

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
    xhr.onloadend = e => store.request.xhr.delete(url)
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
export const cancel = url => {

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
export const inFlight = async (url, limit = 0) => {

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
 * @return {Promise<string>}
 * DOM string, equivelent to `document.documentElement.outerHTML`
 */
export const get = async (state) => {

  if (!store.request.xhr.has(state.url)) {

    try {

      const DOMString = await HttpRequest(state)

      HttpResponseSize(DOMString)

      return DOMString

    } catch (error) {

      console.error(error)

      store.request.xhr.delete(state.url)

    }

  }

}
