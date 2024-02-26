/**
 * HTTP or HTTPS or //
 *
 * The Protocol portion of a url.
 */
export const HTTP = /^(?:https?:)?\/\//;

/**
 * Cache Value
 *
 * Used to cahce values
 */
export const CacheValue: RegExp = /^(reset|clear|update)$/i;

/**
 * URL Pathname
 *
 * Used to match first pathname from a URL.
 *
 * Capture Group Indexes
 *
 * 1. Hostname, eg: brixtol.com
 * 2. Pathname, eg: /collections/product?variant=xxx
 * 3. Hash, eg: #some-hash
 *
 * @see
 * https://regex101.com/r/57UCeF/1
 */
export const Pathname: RegExp = /(?:https?:)?\/\/(?:www\.)?([^/]*?)?([/?][^;]*?)?(#[^#]*?)?$/i;

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
 * @see
 * https://regex101.com/r/8d7Swb/1
 *
 */
export const isPender: RegExp = /\b(?:append|prepend)/;

/**
 * Matches whitespaces (greedy)
 *
 * Used to Match whitspaces
 */
export const Whitespace: RegExp = /\s+/g;

/**
 * Boolean Attribute value
 *
 * Used to Match 'true' or 'false' attribute
 *
 * @see
 * https://regex101.com/r/gIgDWL/1
 */
export const isBoolean: RegExp = /^\b(?:true|false)$/i;

/**
 * Matches decimal number
 *
 * Used to Match number, supports the following patterns:
 *
 * - `100` (Number)
 * - `1.10` (Floats)
 * - `.20` (Starting zero points)
 *
 * @see
 * https://regex101.com/r/gsU6Gm/1
 */
export const isNumber: RegExp = /^\d*\.?\d+$/;

/**
 * Matches decimal number
 *
 * Used to Match numerics, supports the following patterns:
 *
 * - `100` (Number)
 * - `-100` (Negatives)
 * - `1.10` (Floats)
 * - `.20` (Starting zero points)
 * - `NaN` (NaN)
 *
 * @see
 * https://regex101.com/r/tOv8Br/1
 */
export const isNumeric: RegExp = /^(?:[.-]?\d*\.?\d+|NaN)$/;

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
export const isCache: RegExp = /\b(?:capture|false|true|reset|restore)\b/;

/**
 * Threshold Attribute Value
 *
 * Used to match threshold JSON attributes
 */
export const isPrefetch: RegExp = /\b(?:intersect|hover|proximity)\b/;

/**
 * Number or Boolean
 *
 * Used to match progress or proximity attribute values
 *
 */
export const isNumberOrBoolean: RegExp = /\b(?:progress|proximity)/;

/**
 * Attribute Parameter Value
 *
 * Used to match a class event caller target attributes
 */
export const ArrayParams: RegExp = /\[(['"]?.*['"]?,?)\]/g;

/**
 * Resource Tag Name
 *
 * Used to match resources in mutations
 */
export const isResourceTag: RegExp = /\b(?:SCRIPT|STYLE|LINK)\b/;

/**
 * Array Value
 *
 * Used to test value for a string array attribute value, like spx-replace.
 *
 * @see
 * https://regex101.com/r/bIQefA/1
 *
 */
export const isArray: RegExp = /\[(['"]?.*['"]?,?)\]/;

/**
 * Mached Position Attributes
 *
 * Used to match `x:0` and `y:0` JSON space separated attributes
 */
export const inPosition: RegExp = /[xy]\s*|\d*\.?\d+/gi;

/**
 * Mached Position Attributes
 *
 * Used to match `x:0` and `y:0` JSON space separated attributes
 */
export const inObject: RegExp = /[a-zA-Z0-9]+:[a-zA-Z0-9]+/g;
