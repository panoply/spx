/**
 * Expands URL href location.
 *
 * @param {string} url
 */
export function expandURL (url) {

  const anchor = document.createElement('a')

  anchor.href = url.toString()

  const {
    protocol
    , origin
    , hostname
    , href
    , pathname
    , search
  } = new URL(anchor.href)

  return {
    protocol
    , origin
    , hostname
    , href
    , pathname
    , search
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
 * @param {Element} target
 */
export const getURL = target => expandURL(target.getAttribute('href'))

/**
 * Returns the pathname from `href` target used for cache key.
 *
 * @param {IPjax.ILocation} location
 */
export const getCacheKey = ({ pathname, search }) => (pathname + search)

/**
 * Returns the pathname from `href` target used for cache key.
 *
 * @param {Element} target
 */
export const getCacheKeyFromTarget = target => getCacheKey(getURL(target))

/**
 * Returns the protocol and host
 *
 * @param {URL} location
 */
export const getProtocol = ({ protocol, host }) => protocol.replace(/:/g, `://${host}`)
