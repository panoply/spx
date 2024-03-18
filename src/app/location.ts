import type { Page, Location } from 'types';
import { $ } from './session';
import { nil, o, origin } from '../shared/native';
import { log } from '../shared/logs';
import { chunk, hasProp, attrJSON, camelCase, splitAttrArrayValue, selector } from '../shared/utils';
import { CharCode, LogType, Origins, VisitType } from '../shared/enums';
import { newPage } from './queries';
import * as regex from '../shared/regexp';

/**
 * Location hostname eg: brixtol.com
 *
 * @see
 * https://regex101.com/r/fCK0sH/1
 */
export const hostname = origin.replace(/(?:https?:)?(?:\/\/(?:www\.)?|(?:www\.))/, nil);

/**
 * Get Attributes
 *
 * Parses `href` or `form` attributes and assigns them to  configuration options.
 * This function contructs the initial page state model.
 */
export function getAttributes (element: Element, page?: Page): Page {

  const state: Page = page ? newPage(page) : o();
  const attrs: string[] = element.getAttributeNames();

  for (let i = 0, s = attrs.length; i < s; i++) {

    const nodeName = attrs[i];

    if (nodeName.startsWith($.qs.$data)) {

      // Create reference in page state if it does not exist
      if (!hasProp(state, 'data')) state.data = o();

      // Obtain the data key property value, e.g: spx-data:foo
      // will be used on the object, resulting in { data: { foo: <type> } }
      const name = camelCase(nodeName.slice($.qs.$data.length));
      const value = element.getAttribute(nodeName).trim();

      if (regex.isNumeric.test(value)) {
        state.data[name] = value === 'NaN' ? NaN : +value;
      } else if (regex.isBoolean.test(value)) {
        state.data[name] = value === 'true';
      } else if (value.charCodeAt(0) === 123 || value.charCodeAt(0) === 91) { // { or [
        state.data[name] = attrJSON(nodeName, value);
      } else {
        state.data[name] = value; // string value
      }

    } else {

      if (!$.qs.$attrs.test(nodeName)) continue;

      const nodeValue = element.getAttribute(nodeName).trim();

      // KEY REFERENCE
      if (nodeName === 'href') {

        state.rev = location.pathname + location.search;

        if (!page) {
          state.location = getLocation(nodeValue);
          state.key = state.location.pathname + state.location.search;
        }

      } else {

        const name = nodeName.slice(nodeName.lastIndexOf('-') + 1);
        const value = nodeValue.replace(regex.Whitespace, nil).trim();

        if (name === 'target') {

          // edge cases wherein href element is annotated with "spx-target"
          // but has empty attribute value, which means user wants to morph/replace
          state[name] = value === 'true' ? [] : value !== nil ? splitAttrArrayValue(value) : [];
          state.selector = selector(state[name]);

        } else if (regex.isArray.test(value)) {

          // Attribute Parameter Value - Matches class event caller target attributes
          const match = value.match(/\[?[^,'"[\]()\s]+\]?/g);
          state[name] = regex.isPender.test(name) ? match.reduce(chunk(2), []) : match;

        } else if (name === 'position') {

          if (regex.inPosition.test(value)) {

            const XY = value.match(regex.inPosition);

            state[`scroll${XY[0].toUpperCase()}`] = +XY[1];

            if (XY.length === 4) {
              state[`scroll${XY[2].toUpperCase()}`] = +XY[3];
            }

          } else {
            log(
              LogType.WARN,
              `Invalid attribute value on <${nodeName}>, expected: y:number or x:number`,
              element
            );
          }

        } else if (name === 'scroll') {

          if (regex.isNumber.test(value)) {
            state.scrollY = +value;
          } else {
            log(
              LogType.WARN,
              `Invalid attribute value on <${nodeName}>, expected: number`,
              element
            );
          }

        } else if (regex.isBoolean.test(value) && !regex.isPrefetch.test(nodeName)) {

          state[name] = value === 'true';

        } else if (regex.isNumeric.test(value)) {

          state[name] = +value;

        } else {

          if (name === 'history') {
            if (value !== 'push' && value !== 'replace') {
              log(
                LogType.ERROR,
                `Invalid attribute value on <${nodeName}>, expected: false, push or replace`,
                element
              );
            }
          }

          state[name] = value;

        }
      }
    }
  }

  return state;

}

/**
 * Parse Path
 *
 * Builds an object model of the provided path string.
 */
function parsePath (path: string) {

  const state: Location = o();
  const size = path.length;

  if (size === 1 && path.charCodeAt(0) === CharCode.FWD) {
    state.pathname = path;
    state.hash = nil;
    state.search = nil;
    return state;
  }

  const hash = path.indexOf('#');

  if (hash >= 0) {
    state.hash = path.slice(hash);
    path = path.slice(0, hash);
  } else {
    state.hash = nil;
  }

  const params = path.indexOf('?');

  if (params >= 0) {
    state.search = path.slice(params);
    path = path.slice(0, params);
  } else {
    state.search = nil;
  }

  state.pathname = path;

  return state;
}

/**
 * Get Path
 *
 * Returns the pathname from `url` which is then used as the `key`
 * reference in SPX sessions.
 */
function getPath (url: string, protocol: number) {

  const path = url.indexOf('/', protocol);

  if (path > protocol) {

    const hash = url.indexOf('#', path);

    return hash < 0 ? url.slice(path) : url.slice(path, hash);
  }

  const param = url.indexOf('?', protocol);

  if (param > protocol) {
    const hash = url.indexOf('#', param);
    return hash < 0 ? url.slice(param) : url.slice(param, hash);
  }

  return url.length - protocol === hostname.length ? '/' : null;

}

/**
 * Parse Origin
 *
 * Despite the name, this function will behave identical to `parsePath`
 * with the exception that the `origin` value is validated against. This
 * is used when a URL was supplied.
 */
function parseOrigin (url: string) {

  const path = url.startsWith('www.') ? url.slice(4) : url;
  const name = path.indexOf('/');

  if (name >= 0) {

    const key = path.slice(name);
    if (path.slice(0, name) === hostname) return key.length > 0 ? parsePath(key) : parsePath('/');
  } else {

    const char = path.search(/[?#]/);

    if (char >= 0) {
      if (path.slice(0, char) === hostname) return parsePath('/' + path.slice(char));
    } else {
      if (path === hostname) return parsePath('/');
    }
  }

  return null;

}

/**
 * Has Origin
 *
 * Checks to see if the URL contains an origin. We use integer return
 * values to inform the origin type. If a value of `0` returned there
 * is no origin in the URL.
 */
function hasOrigin (url: string): Origins {

  if (url.startsWith('http')) return Origins.HTTP;
  if (url.startsWith('//')) return Origins.SLASH;
  if (url.startsWith('www.')) return Origins.WWW;

  return Origins.NONE;

}

/**
 * Valid Key
 *
 * Validates URL's contained in a document and returns
 * a boolean informing if the the path is valid or not.
 */
export function validKey (url: string) {

  if (typeof url !== 'string' || url.length === 0) return false;

  if (url.charCodeAt(0) === CharCode.FWD) { // 47 is unicode for '/'

    if (url.charCodeAt(1) !== CharCode.FWD) return true;
    if (url.startsWith('www.', 2)) return url.startsWith(hostname, 6);

    return url.startsWith(hostname, 2);

  }

  if (url.charCodeAt(0) === CharCode.QWS) return true;
  if (url.startsWith('www.')) return url.startsWith(hostname, 4);
  if (url.startsWith('http')) {

    const start = url.indexOf('/', 4) + 2;

    return url.startsWith('www.', start)
      ? url.startsWith(hostname, start + 4)
      : url.startsWith(hostname, start);
  }

}

/**
 * Parse Key
 *
 * Builds an object reference from a string path
 * value and returns a parsed record of the value.
 */
export function parseKey (url: string): Location {

  // eg: /
  if (url.charCodeAt(0) === CharCode.FWD) {

    // eg: // or /path
    return url.charCodeAt(1) !== CharCode.FWD
      ? parsePath(url) // Character is not '/' we have a pathname
      : parseOrigin(url.slice(2)); // Strips the double slash //

  }

  // eg: ?foo=bar
  if (url.charCodeAt(0) === CharCode.QWS) {
    return parsePath((location.pathname + url));
  }

  // Path starts with protocol
  if (url.startsWith('https:') || url.startsWith('http:')) {
    return parseOrigin(url.slice(url.indexOf('/', 4) + 2)); // Strips the protocol
  }

  if (url.startsWith('www.')) return parseOrigin(url);

  return null;

}

/**
 * Get Key (pathname)
 *
 * Returns the pathname cache key URL reference which is used as property id in the cache store.
 */
export function getKey (link: string | Location): string {

  if (typeof link === 'object') {
    return link.pathname + link.search;
  }

  if (link === nil || link === '/') return '/';

  const has = hasOrigin(link);

  if (has === 1) {

    const protocol = link.charCodeAt(4) === 115 ? 8 : 7;
    const www = link.startsWith('www.', protocol) ? (protocol + 4) : protocol;

    return link.startsWith(hostname, www)
      ? getPath(link, www)
      : null;
  }

  if (has === 2) {

    const www = link.startsWith('www.', 2) ? 6 : 2;

    return link.startsWith(hostname, www)
      ? getPath(link, www)
      : null;
  }

  if (has === 3) {
    return link.startsWith(hostname, 4)
      ? getPath(link, 4)
      : null;
  }

  return link.startsWith(hostname, 0)
    ? getPath(link, 0)
    : null;

};

/**
 * Fallback
 *
 * Obtains the SPX Page session `location` model as fallback by extracting
 * the `window.location` data.
 */
export function fallback (): Location {

  const { pathname, search, hash } = location;

  return o({
    hostname,
    origin,
    pathname,
    search,
    hash
  });
}

/**
 * Get Location
 *
 * Parses link and returns an Location.
 */
export function getLocation (path: string): Location {

  if (path === nil) return fallback();

  const state = parseKey(path);

  if (state === null) {
    log(LogType.ERROR, `Invalid pathname: ${path}`);
  }

  state.origin = origin;
  state.hostname = hostname;

  return state;

};

/**
 * Get Route
 *
 * Parses link and returns page state. When `link` is a HTML Element
 * (i.e, `<a href=""></a>`) then we parse the node and assign any attributes.
 *
 * This function is triggered for every visit request or action which infers
 * navigations (i.e, mouseover).
 */
export function getRoute <
  Type extends VisitType | Element | string,
  Link extends Type extends VisitType.HYDRATE
  ? string
  : Type extends VisitType.INITIAL
  ? Type
  : Element
> (link: Link, type: VisitType = VisitType.VISIT): Page {

  // PASSED IN ELEMENT
  // Route state will be generated using node attributes
  if (link instanceof Element) {
    const state = getAttributes(link);
    state.type = type || VisitType.VISIT;
    return state;
  }

  const state: Page = o();

  if (link === VisitType.INITIAL) {

    state.location = fallback();
    state.key = state.rev = getKey(state.location);
    state.type = link;
    state.visits = 1;

    $.index = state.key;

  } else if (type === VisitType.HYDRATE) {

    state.location = getLocation(link);
    state.key = state.rev = getKey(state.location);
    state.type = type;

  } else {

    state.rev = location.pathname + location.search;
    state.location = getLocation(typeof link === 'string' ? link : state.rev);
    state.key = getKey(state.location);
    state.type = type;

  }

  return state;

};
