/**
 * Attribute Configuration
 *
 * Used to match Pjax data attribute names
 *
 * @exports
 * @type {RegExp}
 */
export const Attr = /^data-pjax-(append|prepend|replace|history|progress|threshold|position)$/i

/**
 * Form Inputs
 *
 * Used to match Form Input elements
 *
 * @exports
 * @type {RegExp}
 */
export const CacheValue = /^(reset|clear)$/i

/**
 * URL Pathname
 *
 * Used to match first pathname from a URL (group 1)
 *
 * @exports
 * @type {RegExp}
 */
export const Pathname = /\/\/[^/]*(\/[^;]*)/

/**
 * Form Inputs
 *
 * Used to match Form Input elements
 *
 * @exports
 * @type {RegExp}
 */
export const FormInputs = /^(input|textarea|select|datalist|button|output)$/i

/**
 * Ready State
 *
 * Ready State Match
 *
 * @exports
 * @type {RegExp}
 */
export const isReady = /^(interactive|complete)$/i

/**
 * Boolean Attribute value
 *
 * Used to Match 'true' or 'false' attribute
 *
 * @exports
 * @type {RegExp}
 */
export const isBoolean = /^(true|false)$/i

/**
 * Matches decimal number
 *
 * Used to Match number, respected negative numbers
 *
 * @exports
 * @type {RegExp}
 */
export const isNumber = /^[+-]?\d*\.?\d+$/

/**
 * Matches whitespaces (greedy)
 *
 * Used to Match whitspaces
 *
 * @exports
 * @type {RegExp}
 */
export const isWhitespace = /\s+/g

/**
 * Attribute Action Caller
 *
 * Used to match the event caller for attribute actions
 *
 * @exports
 * @type {RegExp}
 */
export const isAction = /\b(?:ap|pre)pend|replace/g

/**
 * Append or Prepend
 *
 * Used to match append or prepend insertion
 *
 * @exports
 * @type {RegExp}
 */
export const isReplace = /\b(?:append|prepend)\b/

/**
 * Cache Attribute
 *
 * Used to match and validate a cache attribute config
 *
 * @exports
 * @type {RegExp}
 */
export const isCache = /\b(?:false|true|reset|flush)\b/

/**
 * Threshold Attribute Value
 *
 * Used to match threshold JSON attributes
 *
 * @exports
 * @type {RegExp}
 */
export const isPrefetch = /\b(?:intersect|mouseover|hover)\b/

/**
 * Threshold Attribute Value
 *
 * Used to match threshold JSON attributes
 *
 * @exports
 * @type {RegExp}
 */
export const isThreshold = /\b(?:intersect|mouseover|progress)\b|(?<=[:])[^\s][0-9.]+/

/**
 * Attribute Parameter Value
 *
 * Used to match a class event caller target attributes
 *
 * @exports
 * @type {RegExp}
 */
export const ActionParams = /[^,'"[\]()\s]+/g

/**
 * Array Value
 *
 * Used to test value for a string array attribute value, like data-pjax-replace.
 *
 * @example
 * https://regex101.com/r/I77U9B/1
 *
 * @exports
 * @type {RegExp}
 */
export const isArray = /\(?\[['"].*?['"],?\]\)?/

/**
 * Append or Prepend attribute value
 *
 * Used to test value for append or prepend, array within array
 *
 * @example
 * https://regex101.com/r/QDSRBK/1
 *
 * @exports
 * @type {RegExp}
 */
export const isPenderValue = /\(?(\[(['"].*?['"],?){2}\],?)\1?\)?/

/**
 * Test Position Attributes
 *
 * Tests attribute values for a position config
 *
 * @example
 * https://regex101.com/r/DG2LI1/1
 *
 * @exports
 * @type {RegExp}
 */
export const isPosition = /[xy]:[0-9.]+/

/**
 * Mached Position Attributes
 *
 * Used to match `x:0` and `y:0` JSON space separated attributes
 *
 * @exports
 * @type {RegExp}
 */
export const inPosition = /[xy]|\d*\.?\d+/g

/**
 * Protocol
 *
 * Used to match Protocol
 *
 * @exports
 * @type {RegExp}
 */
export const Protocol = /^https?:$/

/**
 * XHR Headers
 *
 * Used for replacing headers in XHR Request util.
 *
 * @deprecated
 * NOT IN USE - MAY USE IN FUTURE
 *
 * @exports
 * @type {RegExp}
 */
export const XHRHeaders = /^(.*?):[^\S\n]*([\s\S]*?)$/gm

/**
 * Route Parameter
 *
 * Used for router
 *
 * @exports
 * @type {RegExp}
 */
export const OptionalParam = /\((.*?)\)/g

/**
 * Route Named Parameter
 *
 * Used for router
 *
 * @exports
 * @type {RegExp}
 */
export const NamedParam = /(\(\?)?:\w+/g

/**
 * Route Splat Parameter
 *
 * Used for router
 *
 * @exports
 * @type {RegExp}
 */
export const SplatParam = /\*/g

/**
 * Route Escape Expression
 *
 * Used for router
 *
 * @exports
 * @type {RegExp}
 */
export const EscapeExp = /[\-{}\[\]+?.,\\\^$|#\s]/g // eslint-disable-line
