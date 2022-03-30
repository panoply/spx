/**
 * Cache Value
 *
 * Used to cahce values
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
 * Append or Prepend attribute value
 *
 * Used to test value for append or prepend, array within array
 *
 * @example
 * https://regex101.com/r/8d7Swb/1
 *
 */
export const isPender: RegExp = /\b(?:append|prepend)/;

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
export const isAction: RegExp = /\b(?:append|prepend|hydrate|ignore)/g;

/**
 * Cache Attribute
 *
 * Used to match and validate a cache attribute config
 */
export const isCache: RegExp = /\b(?:false|true|reset|restore)\b/;

/**
 * Threshold Attribute Value
 *
 * Used to match threshold JSON attributes
 */
export const isPrefetch: RegExp = /\b(?:intersect|mouseover)\b/;

/**
 * Threshold Attribute Value
 *
 * Used to match threshold JSON attributes
 *
 * @example
 * https://regex101.com/r/yCi0Do/1
 */
export const isThreshold: RegExp = /\b(?:intersect|mouseover|progress)\b|(?<=[:])[^\s][0-9.]+/;

/**
 * Attribute Parameter Value
 *
 * Used to match a class event caller target attributes
 */
export const ActionParams: RegExp = /\[?[^,'"[\]()\s]+\]?/g;

/**
 * Array Value
 *
 * Used to test value for a string array attribute value, like data-pjax-replace.
 *
 * @example
 * https://regex101.com/r/bIQefA/1
 *
 */
export const isArray: RegExp = /\(?\[(['"]?.*['"]?,?)\]\)?/;

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
export const Protocol: RegExp = /^https?:/;
