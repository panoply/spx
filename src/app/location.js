import history from 'history/browser'

/**
 * Expands URL href location.
 *
 * @param {string} anchor
 * @returns {IPjax.ILocation}
 */
export function expandURL (anchor) {

  const lastUrl = history.createHref(window.location)
  const location = document.createElement('a')

  location.href = anchor.toString()

  const {
    origin,
    hostname,
    href,
    pathname,
    search,
    hash
  } = new URL(location.href)

  return {
    origin
    , hostname
    , href
    , pathname
    , search
    , hash
    , lastUrl
  }

}

/**
 * Returns the current URL
 *
 * @param {Element|string} target
 */
export function getURL (target) {

  const href = target instanceof Element ? target.getAttribute('href') : target

  return history.createHref(expandURL(href))

}

/**
 * Returns the pathname from `href` target used for cache key.
 *
 * @param {Element} target
 */
export const getCacheKeyFromTarget = target => getURL(target)

/**
 * Hash URL using DJB2A algorithm
 *
 * NOT IN USE - REMOVE IN NEXT RELEASE
 *
 * @export
 * @param {string} url
 * @return {string}
 */
export function getCacheKey (url) {

  let i = 0
  let hash = 5381

  for (; i < url.length; i++) hash = ((hash << 5) + hash) ^ url.charCodeAt(i)

  return (hash >>> 0).toString(16)

}
