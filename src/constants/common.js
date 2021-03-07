/**
 * Array Slice Prototype
 */
export const ArraySlice = Array.prototype.slice

/**
 * Document Implentation
 */
export const Implementation = document.implementation

/**
 * Link Selector
 */
export const Link = 'a:not([data-pjax-disable]):not([href^="#"]):not([href^="javascript:"])'

/**
 * Link Prefetch Hover Selector
 */
export const LinkPrefetchHover = 'a[data-pjax-prefetch="hover"]'

/**
 * Link Prefetch Hover Selector
 */
export const LinkPrefetchIntersect = 'a[data-pjax-prefetch="intersect"]'

/**
 * Form Selector
 */
export const Form = 'form:not([data-pjax-disable]):not([action^="javascript:"])'

/**
 * DOM Parse
 */
export const DomParser = new DOMParser()

/**
 * Cache
 */
export const Cache = new Map()
