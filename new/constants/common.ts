/* eslint no-unused-vars: "off" */

export const enum Common {

  /**
   * Link Selector
   */
  Link = 'a:not([data-pjax-disable]):not([href^="#"])',

  /**
   * Link Prefetch Hover Selector
   */
  LinkPrefetchHover = 'a[data-pjax-prefetch="hover"]',

  /**
   * Link Prefetch Intersection
   */
  LinkPrefetchIntersect = 'a[data-pjax-prefetch="intersect"]',

  /**
   * Form Selector
   */
  Form = 'form:not([data-pjax-disable])',
}
