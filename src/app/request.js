import { store, snapshots } from './store'
import { asyncTimeout, byteConvert, byteSize, dispatchEvent } from './utils'
import { progress } from './progress'

/**
 * Requests Handler
 *
 * @param {boolean} connected
 */
export default (function () {

  /**
   * @type {number}
   */
  let ratelimit = 0

  /**
   * @type {number}
   */
  let storage = 0

  /**
   * XHR Requests
   *
   * @type {Map<string, XMLHttpRequest>}
   */
  const transit = new Map()

  /**
   * Executes on request end. Removes the XHR recrod and update
   * the response DOMString cache size record.
   *
   * @exports
   * @param {string} url
   * @param {string} DOMString
   * @returns {boolean}
   */
  const HttpRequestEnd = (url, DOMString) => {

    storage = storage + byteSize(DOMString)

    return transit.delete(url)

  }

  /**
   * Fetch XHR Request wrapper function
   *
   * @exports
   * @param {string} url
   * @param {boolean} [async=true]
   * @returns {Promise<string>}
   */
  const HttpRequest = async (url, async = true) => {

    const xhr = new XMLHttpRequest()

    return new Promise((resolve, reject) => {

      // OPEN
      //
      xhr.open('GET', url, async)

      // HEADERS
      //
      xhr.setRequestHeader('X-Pjax', 'true')
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

      // EVENTS
      //
      xhr.onloadstart = e => transit.set(url, xhr)
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
   * @exports
   * @param {string} url
   * @returns {void}
   */
  const cancel = (url) => {

    if (transit.has(url)) {

      transit.get(url).abort()
      transit.delete(url)

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
   * @return {Promise<boolean>}
   */
  const inFlight = async (url) => {

    if (transit.has(url) && ratelimit <= store.config.request.throttle) {
      // console.log('Request in flight', ratelimit * 25)

      if ((ratelimit * 10) >= store.config.progress.threshold) progress.start()

      return asyncTimeout(() => {
        ratelimit++
        return inFlight(url)
      }, 10)
    }

    ratelimit = 0

    return !transit.has(url)

  }

  /**
   * Fetches documents and guards from duplicated requests
   * from being dispatched if an indentical fetch is in flight.
   * Requests will always save responses and snapshots.
   *
   * @exports
   * @param {object} state
   * @return {Promise<Store.IPage|false>}
   */
  const get = async (state) => {

    if (transit.has(state.url)) {
      console.warn(`Pjax: XHR Request is already in transit for: ${state.url}`)
      return false
    }

    if (!dispatchEvent('pjax:request', state.url, true)) {
      console.warn(`Pjax: Request cancelled via dispatched event for: ${state.url}`)
      return false
    }

    try {

      const response = await HttpRequest(state.url)

      if (typeof response === 'string') {
        return store.create(state, response)
      }

      console.warn(`Pjax: Failed to receive response at: ${state.url}`)

    } catch (error) {

      transit.delete(state.url)
      console.error(error)

    }

    return false

  }

  return {
    get,
    inFlight,
    cancel,
    transit,

    /**
     * Returns request cache metrics
     *
     * @exports
     * @returns {IPjax.ICacheSize}
     */
    get cacheSize () {

      return {
        requests: snapshots.size,
        total: storage,
        weight: byteConvert(storage)
      }

    }

  }

})()
