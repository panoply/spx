/**
 * Form Inputs
 *
 * Used to match Form Input elements
 */
export const FormInputs = /^(input|textarea|select|datalist|button|output)$/i

/**
 * Ready State
 *
 * Ready State Match
 */
export const isReady = /^(interactive|complete)$/

/**
 * Boolean Attribute value
 *
 * Used to Match 'true' or 'false' attribute
 */
export const isBoolean = /\b(true|false)\b/

/**
 * Matches decimal number
 *
 * Used to Match number, respected negative numbers
 */
export const isNumber = /^[+-]?\d*\.?\d+$/

/**
 * Matches whitespaces (greedy)
 *
 * Used to Match whitspaces
 */
export const isWhitespace = /\s+/g

/**
 * Append or Prepend
 *
 * Used to match append or prepend insertion
 */
export const isReplace = /\b(ap|pre)pend\b/

/**
 * Mached Position Attributes
 *
 * Used to match `x:0` and `y:0` JSON space separated attributes
 */
export const inPosition = /[xy]|[0-9]+/g

/**
 * Protocol
 *
 * Used to match Protocol
 */
export const Protocol = /^https?:$/

/**
 * DOM Parse Fallback
 *
 * Used as a fallback to parse response text string
 */
export const DOMParseFallback = /^\s*<(!doctype|html)[^>]*>/i

/**
 * XHR Headers
 *
 * Used for replacing headers in XHR Request util.
 */
export const XHRHeaders = /^(.*?):[^\S\n]*([\s\S]*?)$/gm
