import { isNumber } from '../constants/regexp'

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
export const jsonAttrs = (accumulator, current, index, source) => (index % 2 ? ({
  ...accumulator
  , [source[(source.length - 1) >= index ? (
    index - 1
  ) : index]]: isNumber.test(current) ? Number(current) : current
}) : accumulator)

/**
 * UUID
 *
 * Unqiue Identifier code for cached state
 *
 * @returns {string}
 */
export const uuid = () => Array.apply(
  null
  , { length: 36 }
).map((
  _
  , index
) => (
  (index === 8 || index === 13 || index === 18 || index === 23) ? (
    '-'
  ) : index === 14 ? (
    '4'
  ) : index === 19 ? (
    (Math.floor(Math.random() * 4) + 8).toString(16)
  ) : (
    Math.floor(Math.random() * 15).toString(16)
  )
)).join('')

/**
 * Dispatches lifecycle events on the document.
 *
 * @export
 *
 * @param {IPjax.IEvents} eventName
 * The event name to be created
 *
 * @param {IPjax.IEventDetails} detail
 * Details to be passed to event dispatch
 *
 * @param {boolean} cancelable
 * Whether the event can be cancelled via `preventDefault()`
 *
 * @return {boolean}
 */
export const Dispatch = (
  eventName
  , { target, state, url }
  , cancelable = false
) => {

  // create and dispatch the event
  const event = new CustomEvent(eventName, {
    detail: { state, target, url },
    cancelable
  })

  return (document || target).dispatchEvent(event)

}

/**
 * Convert bytes
 *
 * @param {number} bytes
 */
export const bytesToSize = bytes => {

  if (bytes === 0) return 'n/a'

  const unit = [ 'B', 'KB', 'MB', 'GB', 'TB' ]
  const size = parseInt(`${Math.floor(Math.log(bytes) / Math.log(1024))}`, 10)

  return size === 0 ? (
    `${bytes} ${unit[size]}`
  ) : (
    `${(bytes / (1024 ** size)).toFixed(1)} ${unit[size]}`
  )

}

/**
 * Async Timeout
 *
 * @param {function} callback
 * @param {number} ms
 */
export const asyncTimeout = (callback, ms = 0) => (

  new Promise(
    resolve => setTimeout(() => {

      const response = callback()

      return resolve(response)

    }, ms)
  )

)

/**
 * Each iterator helper function. Provides a util function
 * for loop iterations
 *
 * @export
 * @param {any} list
 * @param {function} fn
 * @param {{index?: boolean, isMap?: boolean }} options
 * @return {(array|void)}
 */
export const ForEach = (list, fn, options = { index: false, isMap: false }) => {

  let i = list.length - 1
  const item = Array(list.length)

  for (; i >= 0; i--) item[i] = options.index ? fn(list[i], i) : fn(list[i])

  if (options.isMap) return item

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
export const getElementAttrs = (
  { attributes }
  , exclude = []
) => Array.from(attributes).reduce((
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
export const Selectors = ({ body }, query, callback) => (

  [].slice.call(body.querySelectorAll(query)).forEach(callback)

)
