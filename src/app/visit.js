import { cache, store, transit } from './store'
import { expandURL } from '../app/location'
import { forEach, jsonattrs, chunk } from '../app/utils'
import * as regexp from '../constants/regexp'
import * as scroll from '../observers/scrolling'
import * as prefetch from './prefetch'
import * as render from './render'
import * as request from './request'
import history from 'history/browser'

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
 * @export
 * @param {Element} target
 * @return {IPjax.IState}
 */
export function getPageState (target) {

  const location = expandURL(target.getAttribute('href'))
  const url = history.createHref(location)

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
 * @export
 * @param {Element} target
 * @return {IPjax.IState}
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
 * @export
 * @param {IPjax.IState} state
 * @param {Element} target
 * @return {IPjax.IState}
 */
export function getVisitConfig (state, target) {

  forEach(attrs, prop => {

    const value = target.getAttribute(`data-pjax-${prop}`)

    value === null ? (

    // MONKEY PATCH
    // Assert prefetch value to `false` if no prefetch attribute is defined
      prop === 'prefetch' && value !== 'hover' && value !== 'intersect') || (

      state[prop] = false

    // data-pjax-prefetch="false"

    ) : regexp.isAction.test(prop) ? (

      state.action[prop] = prop === 'replace' ? (

        value.match(regexp.ActionParams)

      // data-pjax-replace="(['.foo'])"
      // data-pjax-replace="(['.foo','.bar'])"

      ) : (

        value.match(regexp.ActionParams).reduce(chunk(2), [])

      // data-pjax-append="(['.foo', '.bar'])"
      // data-pjax-append="(['.foo', '.bar'],['.baz','.faz'])"

      // ---------- OR ---------------

      // data-pjax-prepend="(['.foo', '.bar'])"
      // data-pjax-prepend="(['.foo', '.bar'],['.baz','.faz'])"

      )
    ) : (

      // DEPRECATE IN FAVOR OF REPLACE, APPEND OR PREPEND ACTIONS
      //
      state[prop] = prop === 'target' ? (

        value.split(regexp.isWhitespace)

      // data-pjax-target=".foo"
      // data-pjax-target=".foo .bar #baz"

      ) : prop === 'progress' ? (

        (value === 'false' || value === '0' || Number(value) > 85)
          ? false
          : (Number(value) < 85 || Number(value) > 1) ? Number(value) : state.progress

      // data-pjax-progress="50"
      // data-pjax-progress="true"
      // data-pjax-progress="false"

      ) : prop === 'cache' ? (

        value === 'false'
          ? false
          : value === 'true'
            ? true
            : value.trim()

      // data-pjax-cache="true"
      // data-pjax-cache="false"
      // data-pjax-cache="flush"
      // data-pjax-cache="reset"

      ) : prop === 'position' ? (

        value.match(regexp.isPosition).reduce(jsonattrs, {})

      // data-pjax-position="x:200"
      // data-pjax-position="x:1000 y:0"

      ) : regexp.isBoolean.test(value.trim()) ? (

        value === 'true'

      // data-pjax-*="true"
      // data-pjax-*="false"

      ) : regexp.isNumber.test(value.trim()) ? (

        Number(value)

      // data-pjax-*="1000"
      // data-pjax-*="10.00"

      ) : (

        value.trim()

      // data-pjax-*="string"

      )
    )

  })

  // THRESHOLD CONFIGURATION
  // SET THE THRESHOLD STATE RELATING TO THE PREFETCH
  if (target.hasAttribute('data-pjax-threshold')) {
    if (regexp.isPrefetch.test(state.prefetch)) {
      const threshold = target.getAttribute('data-pjax-threshold')
      state.threshold[state.prefetch] = Number(threshold)
    }
  }

  return state

}

/**
 * Executes a pjax navigation.
 *
 * @export
 * @param {IPjax.IState} state
 */
export function navigate (state) {

  state.position = scroll.setPosition(state)

  return cache.has(state.url)
    ? cacheVisit(state)
    : pjaxVisit(state)

}

/**
 * Executes a visit by fetching the the cached response
 * from the session and passes it to the renderer.
 *
 * @export
 * @param {IPjax.IState} state
 * @returns {void}
 */
export function cacheVisit (state) {

  prefetch.stop()

  const page = cache
    .set(state.url, state)
    .get(state.url)

  return render.update(page)

}

/**
 * Pjax link handler which dispatches a fetch request
 * when `href` tag is clicked. If clicked link is in transit
 * from prefetch it will pass to cache visit
 *
 * @export
 * @param {IPjax.IState} state
 * @param {boolean} [async=false]
 * @returns {Promise<void>}
 */
export async function pjaxVisit (state, async = false) {

  if (transit.has(state.url)) {
    if ((await request.inFlight(state.url))) {
      return cacheVisit(state)
    } else {
      request.cancel(state.url)
    }
  }

  prefetch.stop()

  const page = await request.get(state)

  return page
    ? render.update(page, async)
    : window.location.replace(state.location.href)

}
