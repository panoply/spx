import history from 'history/browser'
import { parsePath, createPath } from 'history'
import * as regexp from './../constants/regexp'

/**
 * Location URL path handler
 *
 * @param {Window} window
 */
export default (function ({ location, location: { origin, hostname } }) {

  let next = createPath(location)
  let path = next

  /**
   * Returns the pathname cache key URL
   *
   * @param {string} link
   * @returns {string}
   */
  const key = link => {

    return link.charCodeAt(0) === 47 // 47 is unicode value for '/'
      ? link
      : (link.match(regexp.Pathname) || [])[1] || '/'
  }

  /**
   * Returns the absolute URL
   *
   * @param {string} link
   * @returns {string}
   */
  const absolute = link => {

    const location = document.createElement('a')
    location.href = link.toString()

    return location.href

  }

  /**
   * Parses link and returns an ILocation.
   * Accepts either a `href` target or `string`.
   * If no parameter value is passed, the
   * current location pathname (string) is used.
   *
   *
   * @export
   * @param {Element|string} link
   * @returns {Store.ILocation}
   */
  const parse = (link) => {

    const location = parsePath(
      link instanceof Element
        ? link.getAttribute('href')
        : link
    )

    return {
      lastpath: createPath(history.location)
      , search: ''
      , origin
      , hostname
      , ...location
    }
  }

  /**
   * Parses link and returns a location.
   *
   * **IMPORTANT**
   *
   * This function will modify the next url value
   *
   * @export
   * @param {Element|string} link
   * @param {{ update?: boolean, parse?: boolean }} options
   * @returns {({url: string, location: Store.ILocation})}
   */
  const get = (link, options = { update: false }) => {

    const url = key(link instanceof Element ? link.getAttribute('href') : link)

    if (options.update) {
      path = createPath(history.location)
      next = url
    }

    return { url, location: parse(url) }

  }

  return {

    /* EXPORTS ------------------------------------ */

    get
    , key
    , parse
    , absolute

    /* GETTERS ------------------------------------ */

    /**
     * Returns the last parsed url value.
     * Prev URL is the current URL. Calling this will
     * return the same value as it would `window.location.pathname`
     *
     * **BEWARE**
     *
     * Use this with caution, this value will change on new
     * navigations.
     *
     * @returns {string}
     */
    , get url () { return path },

    /**
     * Returns the next parsed url value.
     * Next URL is the new navigation URL key from
     * which a navigation will render. This is set
     * right before page replacements.
     *
     * **BEWARE**
     *
     * Use this with caution, this value will change only when
     * a new navigation has began. Otherwise it returns
     * the same value as `url`
     *
     * @returns {string}
     */
    get next () { return next }

  }

})(window)
