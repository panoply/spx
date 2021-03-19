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
export const isReady = /^(?:interactive|complete)$/

/**
 * Boolean Attribute value
 *
 * Used to Match 'true' or 'false' attribute
 *
 * @exports
 * @type {RegExp}
 */
export const isBoolean = /\b(true|false)\b/

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
 * Mached Position Attributes
 *
 * Used to match `x:0` and `y:0` JSON space separated attributes
 *
 * @exports
 * @type {RegExp}
 */
export const isPosition = /[xy]|(?<=[:])[0-9]+/g

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
