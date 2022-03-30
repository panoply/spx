import { selectors } from './state';
import * as regex from '../constants/regexp';
import { IPage } from '../types/page';
import { nil, create } from '../constants/native';
import { attrjson, chunk } from './utils';
import history from 'history/browser';
import { parsePath, createPath } from 'history';
import { ILocation } from '../types/location';

export const { origin, hostname } = window.location;

/**
 * Get Attributes
 *
 * Parses link `href` attributes and assigns them to
 * configuration options.
 */
export function getAttributes ({ attributes }: Element): IPage {

  const state: IPage = create(null);

  for (const { nodeName, nodeValue } of attributes) {

    if (!selectors.attrs.test(nodeName)) continue;

    const name = nodeName.slice(1 + nodeName.lastIndexOf('-'));
    const value = nodeValue.replace(/\s+/g, nil);

    if (regex.isArray.test(value)) {
      state[name] = regex.isPender.test(name)
        ? value.match(regex.ActionParams).reduce(chunk(2), [])
        : value.match(regex.ActionParams);
    } else if (regex.isPosition.test(value)) {
      state[name] = attrjson(value.match(regex.inPosition));
    } else if (regex.isBoolean.test(value)) {
      state[name] = value === 'true';
    } else if (regex.isNumber.test(value)) {
      state[name] = Number(value);
    } else {
      state[name] = value;
    }
  }

  return state;

}

/**
 * Get Key (pathname)
 *
 * Returns the pathname cache key URL
 * reference which is used as property id
 * in the cache store.
 */
export function getKey (link?: string | Element): string {

  const key = typeof link === 'undefined'
    ? createPath(history.location)
    : typeof link === 'string'
      ? link
      : link.getAttribute('href');

  // 47 is unicode value for '/'
  if (key.charCodeAt(0) === 47) return key;

  // 63 is unicode value for '?'
  if (key.charCodeAt(0) === 63) return history.location.pathname + key;

  const path = key.match(regex.Pathname);

  return path === null ? '/' : path[1];

};

/**
 * Get Location
 *
 * Parses link and returns an ILocation.
 */
export function getLocation (path: string): ILocation {

  const state: ILocation = create(null);
  const { hash, pathname, search } = parsePath(path);

  state.origin = origin;
  state.hostname = hostname;
  state.pathname = pathname;
  state.search = search;
  state.hash = hash;
  state.lastpath = createPath(history.location);

  return state;

};

/**
 * Get Route
 *
 * Parses link and returns page state. When `link`
 * is a HTML Element (ie: `<a href=""></a>`) then
 * we parse the node assign any attributes. This function
 * is triggered for every visit request.
 */
export function getRoute (link?: Element | string, type?: string): IPage {

  const path = typeof link === 'string' ? link : typeof link === 'undefined'
    ? createPath(history.location)
    : link.getAttribute('href');

  const state: IPage = link instanceof Element
    ? getAttributes(link)
    : create(null);

  state.key = getKey(path);
  state.location = getLocation(state.key);
  state.type = typeof type === 'undefined' ? path === state.location.lastpath ? 'initial' : type : 'visit';

  return state;

};
