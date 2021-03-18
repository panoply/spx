import history from 'history/browser'

/**
 * Expands URL href location.
 *
 * @param {string} url
 * @returns {IPjax.ILocation}
 */
export function expandURL (url) {

  const lastPath = history.createHref(window.location)
  const location = document.createElement('a')
  location.href = url.toString()

  const {
    protocol
    , origin
    , hostname
    , href
    , pathname
    , search
  } = new URL(location.href)

  return {
    protocol
    , origin
    , hostname
    , href
    , pathname
    , search
    , lastPath
  }

}

/**
 * Hash URL using DJB2A algorithm
 *
 * @export
 * @param {string} url
 * @return {string}
 */
export function getUID (url) {

  let i = 0
  let hash = 5381

  for (; i < url.length; i++) hash = ((hash << 5) + hash) ^ url.charCodeAt(i)

  return (hash >>> 0).toString(16)

}

/**
 * Returns last pathname value
 *
 * @param {URL} url
 */
export const getLocation = (
  {
    href,
    pathname,
    search,
    origin,
    hostname,
    protocol
  }
) => (
  {
    protocol
    , origin
    , hostname
    , href
    , pathname
    , search
  }
)

/**
 * Returns the current URL
 *
 * @param {Element|string} target
 */
export function getURL (target) {

  const href = target instanceof Element ? target.getAttribute('href') : target
  const { pathname, search } = expandURL(href)
  return pathname + search
}

/**
 * Returns the pathname from `href` target used for cache key.
 *
 * @param {Element} target
 */
export const getCacheKeyFromTarget = target => getURL(target)

/**
 * Returns the protocol and host
 *
 * @param {URL} location
 */
export const getProtocol = ({ protocol, host }) => protocol.replace(/:/g, `://${host}`)
