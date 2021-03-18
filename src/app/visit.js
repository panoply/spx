import { cache, store, transit } from './store'
import { expandURL } from '../app/location'
import { forEach, jsonAttrs, chunk } from '../app/utils'
import * as regexp from '../constants/regexp'
import * as scroll from '../observers/scrolling'
import * as prefetch from './prefetch'
import * as render from './render'
import * as request from './request'

/**
 * @type {string[]}
 */
const attrs = [
  'target',
  'method',
  'action',
  'prepend',
  'append',
  'replace',
  'prefetch',
  'cache',
  'progress',
  'throttle',
  'position',
  'reload'
]

/**
 * Get State Page
 *
 *
 * @param {Element} target
 * The link `href` element target
 *
 * @return {IPjax.IState}
 * Returns an updated page state object
 */
export function getPageState (target) {

  const location = expandURL(target.getAttribute('href'))
  const url = location.pathname + location.search

  return cache.has(url) ? cache.get(url) : store.update.page({
    url,
    location
  })

}

/**
 * Parses link `href` attributes and assigns them to
 * configuration options. Each link target can define
 * navigation options.
 *
 * @param {Element} target
 * The link `href` element target
 *
 * @return {IPjax.IState}
 * Returns an updated page state object
 */
export function visitClickState (target) {

  const state = getPageState(target)

  state.method = 'click'

  return getVisitConfig(state, target)

}

/**
 * Parses link `href` attributes and assigns them to
 * configuration options.
 *
 * @param {IPjax.IState} state
 * Current state configuration
 *
 * @param {Element} target
 * The link `href` element target
 *
 * @return {IPjax.IState}
 * Returns an updated page state object
 */
export function getVisitConfig (state, target) {

  forEach(attrs, prop => {

    const value = target.getAttribute(`data-pjax-${prop}`)

    if (value === null) {

      if (
        prop === 'prefetch' &&
        value !== 'hover' &&
        value !== 'intersect') state[prop] = false

    } else {

      if (/\b(append|prepend|replace)\b/.test(prop)) {

        state.action[prop] = prop === 'replace' ? (
          value.match(regexp.ActionParams)
        ) : (
          value.match(regexp.ActionParams).reduce(chunk(2), [])
        )
      } else {

        state[prop] = prop === 'target' ? (
          value.split(regexp.isWhitespace)
        ) : (prop === 'position' || prop === 'threshold') ? (
          value.match(regexp.inPosition).reduce(jsonAttrs, {})
        ) : regexp.isBoolean.test(value.trim()) ? (
          value === 'true'
        ) : regexp.isNumber.test(value.trim()) ? (
          Number(value)
        ) : (
          value.trim()
        )
      }
    }
  })

  return state

}

/**
 * Executes a pjax navigation.
 *
 * @param {IPjax.IState} state
 */
export function navigate (state) {

  // console.log(state, cache.has(state.url))
  cache.get(state.location.lastPath).position = scroll.getPosition()
  state.position = scroll.reset()

  if (cache.has(state.url)) {
    cache.set(state.url, state)
    return cacheVisit(state.url)
  }

  return pjaxVisit(state)
}

/**
 * Executes a visit by fetching the the cached response
 * from the session and passes it to the renderer.
 *
 * @param {string} url
 * @exports
 */
export async function cacheVisit (url) {

  const state = cache.get(url)

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
export async function pjaxVisit (state, async = false) {

  if (transit.has(state.url)) {
    if ((await request.inFlight(state.url))) {
      return cacheVisit(state.url)
    } else {
      request.cancel(state.url)
    }
  }

  if (store.config.prefetch) prefetch.stop()

  const cacheState = await request.get(state)

  if (cacheState) render.update(cacheState, async)

  if (store.config.prefetch) prefetch.start()

}
