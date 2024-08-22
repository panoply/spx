import { b, nil } from './native';
import { decodeEntities } from './utils';

/**
 * Parse HTML document string from request response
 * using `parser()` method. Cached pages will pass
 * the saved response here.
 */
export function parse (HTMLString: string): Document {

  return new DOMParser().parseFromString(HTMLString, 'text/html');

}

/**
 * Returns a snapshot of the current document, including `<!DOCTYPE html>`
 * reference. Optionally accepts a `dom` Document, if none provided uses `document`
 */
export function takeSnapshot (dom?: Document) {

  return (dom || document).documentElement.outerHTML;

}

/**
 * Extract the document title text from the
 * `<title>` tag of a dom string.
 */
export function getTitle (dom: string) {

  const title = dom.indexOf('<title');

  if (title === -1) return nil;

  // Ensure we are not within an SVG
  if (dom.slice(0, title).indexOf('<svg') > -1) return nil;

  const start = dom.indexOf('>', title) + 1;
  const end = dom.indexOf('</title', start);

  return decodeEntities(dom.slice(start, end).trim());
}

/**
 * Element
 *
 * Returns a single element
 */
export function element <T extends HTMLElement = HTMLElement> (selector: string): T {

  return b().querySelector<T>(selector);

}

/**
 * Elements Array
 *
 * Returns an array list of elements from a selector
 */
export function elements <T extends HTMLElement = HTMLElement> (selector: string): T[] {

  return [].slice.call(b().querySelectorAll<T>(selector));

}
