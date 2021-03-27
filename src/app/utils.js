import { isNumber } from '../constants/regexp'
import { Units } from './../constants/common'
import path from './path'
import store from './store'

/**
 * Locted the closest link when click bubbles.
 *
 * @exports
 * @param {EventTarget|MouseEvent} target
 * @param {string} selector
 * @return {Element|false}
 */
export function getLink (target, selector) {

  if (target instanceof Element) {
    const element = target.closest(selector)
    if (element && element.tagName === 'A') return element
  }

  return false

}

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
export function jsonattrs (accumulator, current, index, source) {

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
 * @exports
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
 * @exports
 * @param {Store.IEvents} eventName
 * @param {Element} target
 * @return {boolean}
 */
export function targetedEvent (eventName, target) {

  // create and dispatch the event
  const newEvent = new CustomEvent(eventName, { cancelable: true })

  return target.dispatchEvent(newEvent)

}

/**
 * Dispatches lifecycle events on the document.
 *
 * @exports
 * @param {Store.IEvents} eventName
 * @param {object} detail
 * @param {boolean} cancelable
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
 * @exports
 * @param {string} string
 * @returns {number}
 */
export function byteSize (string) {

  return new Blob([ string ]).size
}

/**
 * Link is not cached and can be fetched
 *
 * @exports
 * @param {Element} target
 * @returns {boolean}
 */
export function canFetch (target) {

  return !store.has(path.get(target).url, { snapshot: true })
}

/**
 * Returns a list of link elements to be prefetched. Filters out
 * any links which exist in cache to prevent extrenous transit.
 *
 * @exports
 * @param {string} selector
 * @returns {Element[]}
 */
export function getTargets (selector) {

  return [ ...document.body.querySelectorAll(selector) ].filter(canFetch)
}

/**
 * Converts byte size to killobyte, megabyre,
 * gigabyte or terrabyte
 *
 * @exports
 * @param {number} bytes
 * @returns {string}
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
 * @exports
 * @param {function} callback
 * @param {number} ms
 * @returns {Promise<boolean>}
 */
export function asyncTimeout (callback, ms = 0) {

  return new Promise(resolve => setTimeout(() => {
    const fn = callback()
    resolve(fn)
  }, ms))
}

/**
 * Each iterator helper function. Provides a util function
 * for loop iterations
 *
 * @exports
 * @param {any} list
 * @param {(item: Element | any, index?: number) => any} fn *
 * @param {{index?: boolean  }} [index=flase]
 * @return {void}
 */
export function forEach (list, fn, { index = false } = {}) {

  let i = list.length - 1
  for (; i >= 0; i--) index ? fn(list[i], i) : fn(list[i])
}

/**
 * Get Element attributes
 *
 * @exports
 * @param {Element} element
 * @param {string[]} exclude
 * @returns {[name:string, value: string][]}
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
 * @exports
 * @param {Document} document
 * @param {string} query *
 * @param {(element: Element) => void} callback
 * @returns {void}
 */
export function eachSelector ({ body }, query, callback) {

  return [ ...body.querySelectorAll(query) ].forEach(callback)

}
