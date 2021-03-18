import { isNumber } from '../constants/regexp'
import { Units } from './../constants/common'

/**
 * Handles a clicked link, prevents special click types.
 *
 * @param {MouseEvent} event
 * @return {boolean}
 */
export function linkEventValidate (event) {

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
 * Locted the closest link when click bubbles.
 *
 * @param {EventTarget} target
 * The link `href` element target
 *
 * @param {string} selector
 * The selector query name, eg: `[data-pjax]`
 *
 * @return {Element|false}
 */
export function linkLocator (target, selector) {

  return target instanceof Element ? target.closest(selector) : false
}

/**
 * Constructs a JSON object from HTML `data-pjax-*` attributes.
 * Attributes are passed in as array items
 *
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
export function jsonAttrs (accumulator, current, index, source) {

  return (index % 2 ? ({
    ...accumulator
    , [source[(source.length - 1) >= index ? (
      index - 1
    ) : index]]: isNumber.test(current) ? Number(current) : current
  }) : accumulator)

}

/**
 * Array Chunk function
 *
 * @export
 * @param {number} [size=2]
 * @return {(acc: any[], value: string) => any[]}
 */
export function chunk (size = 2) {

  return (acc, value) => (!acc.length || acc[acc.length - 1].length === size ? (
    acc.push([ value ])
  ) : (
    acc[acc.length - 1].push(value)
  )) && acc

}

/**
 * Dispatches lifecycle events on the document.
 *
 * @export
 *
 * @param {IPjax.IEvents} eventName
 * The event name to be created
 *
 * @param {object} detail
 * Details to be passed to event dispatch
 *
 * @param {boolean} cancelable
 * Whether the event can be cancelled via `preventDefault()`
 *
 * @return {boolean}
 */
export function dispatchEvent (eventName, detail, cancelable = false) {

  // create and dispatch the event
  const newEvent = new CustomEvent(eventName, { detail, cancelable })

  return document.dispatchEvent(newEvent)

}

/**
 * Returns the byte size of a string value
 *
 * @param {string} string
 */
export function byteSize (string) {

  return new Blob([ string ]).size
}

/**
 * Converts byte size to killobyte, megabyre,
 * gigabyte or terrabyte
 *
 * @param {number} bytes
 */
export function byteConvert (bytes) {

  if (bytes === 0) return '0 B'

  const size = parseInt(`${Math.floor(Math.log(bytes) / Math.log(1024))}`, 10)

  return size === 0 ? (
    `${bytes} ${Units[size]}`
  ) : (
    `${(bytes / (1024 ** size)).toFixed(1)} ${Units[size]}`
  )
}

/**
 * Async Timeout
 *
 * @param {function} callback
 * @param {number} ms
 */
export function asyncTimeout (callback, ms = 0) {

  return new Promise(
    resolve => setTimeout(() => {
      const response = callback()
      return resolve(response)
    }, ms)
  )
}

/**
 * Each iterator helper function. Provides a util function
 * for loop iterations
 *
 *
 * @param {any} list
 * An array list of items to iterate over
 *
 * @param {(item: Element | any, index?: number) => any} fn
 * Callback function to be executed for each iteration
 *
 * @param {{index?: boolean  }} [index=flase]
 *
 * @return {void}
 */
export function forEach (list, fn, { index = false } = {}) {

  let i = list.length - 1
  for (; i >= 0; i--) index ? fn(list[i], i) : fn(list[i])
}

/**
 * Get Element attributes
 *
 * @param {Element} element
 * The element to parse for attributes
 *
 * @param {string[]} exclude
 * List of attributes to be excluded
 *
 */
export function getElementAttrs ({ attributes }, exclude = []) {

  return Array.from(attributes).reduce((
    accumulator
    , {
      name = null
      , value = null
    }
  ) => ((name && value && !exclude.includes(name))) ? (
    [
      ...accumulator,
      [ name, value ]
    ]
  ) : accumulator, [])
}

/**
 * Each Selector
 *
 * @param {Document} document
 * The document Element
 *
 * @param {string} query
 * The element selector
 *
 * @param {(element: Element) => void} callback
 * The callback function
 */
export function eachSelector ({ body }, query, callback) {

  return [].slice.call(body.querySelectorAll(query)).forEach(callback)

}
