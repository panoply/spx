import { dispatchEvent, getLink, chunk } from '../app/utils'
import { Link } from '../constants/common'
import { store } from '../app/store'
import path from '../app/path'
import scroll from './scroll'
import request from '../app/request'
import render from '../app/render'
import * as regexp from '../constants/regexp'

/**
 * Link (href) handler
 *
 * @typedef {string|Store.IPage} clickState
 * @param {boolean} connected
 */
export default (function (connected) {

  /**
   * Constructs a JSON object from HTML `data-pjax-*` attributes.
   * Attributes are passed in as array items
   *
   * @exports
   * @param {object} accumulator
   * @param {string} current
   * @param {number} index
   * @param {object} source
   *
   * @example
   *
   * // Attribute values are seperated by whitespace
   * // For example, a HTML attribute would look like:
   * <data-pjax-prop="string:foo number:200">
   *
   * // Attribute values are split into an Array
   * // The array is passed to this reducer function
   * ["string", "foo", "number", "200"]
   *
   * // This reducer function will return:
   * { string: 'foo', number: 200 }
   *
   */
  const jsonattrs = (accumulator, current, index, source) => {

    return (index % 2 ? ({
      ...accumulator
      , [source[(source.length - 1) >= index ? (
        index - 1
      ) : index]]: regexp.isNumber.test(current) ? Number(current) : current
    }) : accumulator)

  }

  /**
   * Handles a clicked link, prevents special click types.
   *
   * @exports
   * @param {MouseEvent} event
   * @return {boolean}
   */
  const linkEvent = (event) => {

    // @ts-ignore
    return !((event.target && event.target.isContentEditable) ||
      event.defaultPrevented ||
      event.which > 1 ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey)

  }

  /**
   * Executes a pjax navigation.
   *
   * @param {string} url
   * @param {Store.IPage|false} [state=false]
   * @export
   */
  const navigate = async (url, state = false) => {

    if (state) {

      console.log(state)
      if (store.has(url, { snapshot: true })) return render.update(state)

      const page = await request.get(state)
      if (page) return render.update(page)

    } else {
      if ((await request.inFlight(url))) {
        return render.update(store.cache(url))
      } else {
        request.cancel(url)
      }
    }

    return window.location.replace(url)

  }

  /**
   * Parses link `href` attributes and assigns them to
   * configuration options.
   *
   * @export
   * @param {Element} target
   * @param {Store.IPage} [state]
   * @returns {Store.IPage}
   */
  const attrparse = (
    { attributes }
    , state = {}
  ) => ([ ...attributes ].reduce((
    config
    , {
      nodeName,
      nodeValue
    }
  ) => {

    if (!regexp.Attr.test(nodeName)) return config

    const value = nodeValue.replace(/\s+/g, '')

    config[nodeName.substring(10)] = regexp.isArray.test(value) ? (
      value.match(regexp.ActionParams)
    ) : regexp.isPenderValue.test(value) ? (
      value.match(regexp.ActionParams).reduce(chunk(2), [])
    ) : regexp.isPosition.test(value) ? (
      value.match(regexp.inPosition).reduce(jsonattrs, {})
    ) : regexp.isBoolean.test(value) ? (
      value === 'true'
    ) : regexp.isNumber.test(value) ? (
      Number(value)
    ) : (
      value
    )

    return config

  }, state))

  /**
   * Triggers click event
   *
   * @param {Element} target
   * @returns {(state: clickState) => (event: MouseEvent) => void}
   */
  const handleClick = target => state => function click (event) {

    event.preventDefault()
    event.stopPropagation()
    target.removeEventListener('click', click, false)

    if (!dispatchEvent('pjax:click', {}, true)) return undefined

    return typeof state === 'object'
      ? render.update(state)
      : typeof state === 'string'
        ? navigate(state)
        : window.location.replace(path.absolute(path.url))

  }

  /**
   * Triggers a page fetch
   *
   * @param {MouseEvent} event
   */
  const onMousedown = event => {

    // window.performance.mark('started')

    if (!linkEvent(event)) return undefined

    const target = getLink(event.target, Link)

    if (!target) return undefined

    store.history(path.url)

    const url = path.get(target, true)
    const click = handleClick(target)

    if (request.transit.has(url)) {
      target.addEventListener('click', click(url), false)
    } else {

      const state = attrparse(target, {
        url,
        location: path.parse(url),
        position: scroll.set(path.url)
      })

      if (store.has(url, { snapshot: true })) {
        target.addEventListener('click', click(store.update(state)), false)
      } else {
        request.get(state) // TRIGGER FETCH
        target.addEventListener('click', click(url), false)
      }
    }

  }

  return {

    attrparse,
    navigate,

    /**
     * Attached `click` event listener.
     *
     * @returns {void}
     */
    start: () => {

      if (!connected) {
        addEventListener('mousedown', onMousedown, true)
        connected = true
      }
    },

    /**
     * Removed `click` event listener.
     *
     * @returns {void}
     */
    stop: () => {

      if (connected) {
        removeEventListener('mousedown', onMousedown, true)
        connected = false
      }
    }

  }

})(false)
