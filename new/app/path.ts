import history from 'history/browser';
import { parsePath, createPath } from 'history';
import * as regexp from '../constants/regexp';
import { ILocation } from '../types/store';

const { origin, hostname } = window.location;

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
 */
export let next: string = createPath(window.location);

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
export let url: string = next;

/**
 * Returns the pathname cache key URL
 */
export function key (link: string): string {

  return link.charCodeAt(0) === 47 // 47 is unicode value for '/'
    ? link
    : (link.match(regexp.Pathname) ?? [])[1] || '/';
};

/**
 * Returns the absolute URL
 */
export function absolute (link: string): string {

  const location = document.createElement('a');
  location.href = link.toString();

  return location.href;

};

/**
 * Parses link and returns an ILocation.
 * Accepts either a `href` target or `string`.
 * If no parameter value is passed, the
 * current location pathname (string) is used.
 */
export function parse (link: Element | string): ILocation {

  const location = parsePath(link instanceof Element ? link.getAttribute('href') : link);

  return {
    lastpath: createPath(history.location),
    search: '',
    origin,
    hostname,
    ...location
  };

};

/**
 * Parses link and returns a location.
 *
 * **IMPORTANT**
 *
 * This function will modify the next url value
 */
export function get (link: Element | string, update?: boolean): {
  url: string,
  location: ILocation
} {

  const path = key(link instanceof Element ? link.getAttribute('href') : link);

  if (update) {
    url = createPath(history.location);
    next = path;
  }

  return { url: path, location: parse(path) };
};
