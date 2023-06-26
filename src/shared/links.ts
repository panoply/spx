import { getKey, validKey } from '../app/location';
import { has } from '../app/store';

/**
 * Locted the closest link when click bubbles.
 */
export function getLink (target: EventTarget | MouseEvent, selector: string): HTMLLinkElement | false {

  if (!(target instanceof Element)) return false;

  const element = target.closest(selector);

  return (element && element.tagName === 'A')
    ? element as HTMLLinkElement
    : false;

};

/**
 * Link is not cached and can be fetched
 */
export function canFetch (target: Element): boolean {

  if (target.nodeName !== 'A') return false;

  const href = (target as HTMLLinkElement).href;

  if (!validKey(href)) return false;

  return !has(getKey(href));

};

/**
 * Returns a list of link elements to be prefetched. Filters out
 * any links which exist in cache to prevent pointless transits.
 */
export function getNodeTargets (selector: string, hrefs: string): Element[] {

  const targets: Element[] = [];

  document.body.querySelectorAll(selector).forEach(node => {

    // console.log(node);

    if (node.nodeName !== 'A') {
      node.querySelectorAll(hrefs).forEach(href => {
        if (canFetch(node)) targets.push(href);
      });
    } else if (canFetch(node)) {
      targets.push(node);
    }
  });

  return targets;

};

/**
 * Returns a list of link elements to be prefetched. Filters out
 * any links which exist in cache to prevent extrenous transit.
 */
export const getTargets = (selector: string): Element[] => {

  const targets: Element[] = [];

  document.body.querySelectorAll(selector).forEach(target => {
    if (canFetch(target)) targets.push(target);
  });

  return targets;

};
