/**
 * Attribute Configuration
 *
 * Used to match Pjax data attribute names
 */
export const Attr: RegExp = /^data-pjax-(append|prepend|replace|history|progress|threshold|position)$/i;

/**
 * Form Inputs
 *
 * Used to match Form Input elements
 */
export const CacheValue: RegExp = /^(reset|clear)$/i;

/**
 * URL Pathname
 *
 * Used to match first pathname from a URL (group 1)

 */
export const Pathname: RegExp = /\/\/[^/]*(\/[^;]*)/;

/**
 * Form Inputs
 *
 * Used to match Form Input elements
 */
export const FormInputs: RegExp = /^(input|textarea|select|datalist|button|output)$/i;

/**
 * Ready State
 *
 * Ready State Match
 */
export const isReady: RegExp = /^(interactive|complete)$/i;

/**
 * Boolean Attribute value
 *
 * Used to Match 'true' or 'false' attribute
 */
export const isBoolean: RegExp = /^(true|false)$/i;

/**
 * Matches decimal number
 *
 * Used to Match number, respected negative numbers
 */
export const isNumber: RegExp = /^[+-]?\d*\.?\d+$/;

/**
 * Matches whitespaces (greedy)
 *
 * Used to Match whitspaces
 */
export const isWhitespace: RegExp = /\s+/g;

/**
 * Attribute Action Caller
 *
 * Used to match the event caller for attribute actions
 */
export const isAction: RegExp = /\b(?:ap|pre)pend|replace/g;

/**
 * Append or Prepend
 *
 * Used to match append or prepend insertion
 */
export const isReplace: RegExp = /\b(?:append|prepend)\b/;

/**
 * Cache Attribute
 *
 * Used to match and validate a cache attribute config
 */
export const isCache: RegExp = /\b(?:false|true|reset|flush)\b/;

/**
 * Threshold Attribute Value
 *
 * Used to match threshold JSON attributes
 */
export const isPrefetch: RegExp = /\b(?:intersect|mouseover|hover)\b/;

/**
 * Threshold Attribute Value
 *
 * Used to match threshold JSON attributes
 */
export const isThreshold: RegExp = /\b(?:intersect|mouseover|progress)\b|(?<=[:])[^\s][0-9.]+/;

/**
 * Attribute Parameter Value
 *
 * Used to match a class event caller target attributes
 */
export const ActionParams: RegExp = /[^,'"[\]()\s]+/g;

/**
 * Array Value
 *
 * Used to test value for a string array attribute value, like data-pjax-replace.
 *
 * @example
 * https://regex101.com/r/I77U9B/1
 *
 */
export const isArray: RegExp = /\(?\[['"].*?['"],?\]\)?/;

/**
 * Append or Prepend attribute value
 *
 * Used to test value for append or prepend, array within array
 *
 * @example
 * https://regex101.com/r/QDSRBK/1
 *
 */
export const isPenderValue: RegExp = /\(?(\[(['"].*?['"],?){2}\],?)\1?\)?/;

/**
 * Test Position Attributes
 *
 * Tests attribute values for a position config
 *
 * @example
 * https://regex101.com/r/DG2LI1/1
 *
 */
export const isPosition: RegExp = /[xy]:[0-9.]+/;

/**
 * Mached Position Attributes
 *
 * Used to match `x:0` and `y:0` JSON space separated attributes
 */
export const inPosition: RegExp = /[xy]|\d*\.?\d+/g;

/**
 * Protocol
 *
 * Used to match Protocol
 */
export const Protocol: RegExp = /^https?:$/;

/**
 * Route Parameter
 *
 * Used for router
 */
export const OptionalParam: RegExp = /\((.*?)\)/g;

/**
 * Route Named Parameter
 *
 * Used for router
 */
export const NamedParam: RegExp = /(\(\?)?:\w+/g;

/**
 * Route Splat Parameter
 *
 * Used for router
 */
export const SplatParam: RegExp = /\*/g;

/**
 * Route Escape Expression
 *
 * Used for router
 */
export const EscapeExp: RegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g // eslint-disable-line
