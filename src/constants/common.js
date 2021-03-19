
/**
 * Link Selector
 *
 * @exports
 * @type {string}
 */
export const Link = 'a:not([data-pjax-disable]):not([href^="#"])'

/**
 * Link Prefetch Hover Selector
 *
 * @exports
 * @type {string}
 */
export const LinkPrefetchHover = 'a[data-pjax-prefetch="hover"]'

/**
 * Link Prefetch Hover Selector
 *
 * @exports
 * @type {string}
 */
export const LinkPrefetchIntersect = 'a[data-pjax-prefetch="intersect"]'

/**
 * Form Selector
 *
 * @exports
 * @type {string}
 */
export const Form = 'form:not([data-pjax-disable])'

/**
 * Units Array used for cache size
 *
 * @exports
 * @type {string[]}
 */
export const Units = [ 'B', 'KB', 'MB', 'GB', 'TB' ]
