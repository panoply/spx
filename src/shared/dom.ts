import { nil } from './native';
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
 * Extract the document title text from the
 * `<title>` tag of a dom string.
 */
export function getTitle (dom: string) {

  const title = dom.indexOf('<title');

  if (title === -1) return nil;

  const start = dom.indexOf('>', title) + 1;
  const end = dom.indexOf('</title', start);

  return decodeEntities(dom.slice(start, end).trim());
}
