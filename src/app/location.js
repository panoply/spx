/**
 * Expands URL href location.
 *
 * @param {string} location
 */
export const expandURL = location => {

  const anchor = document.createElement('a')
  anchor.href = location.toString()

  return new URL(anchor.href)

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
 * Returns an expanded URL from `href` target
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
 * @param {string} url
 */
export const getLocationFromURL = url => getLocation(expandURL(url))

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
