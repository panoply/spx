import { getKey, validKey } from '../app/location';
import { has } from '../app/store';
import { forNode } from './utils';

/**
 * Locted the closest link when click bubbles.
 */
export function getLink <T> (
  target: EventTarget | MouseEvent,
  selector: string
): T & HTMLLinkElement | HTMLLinkElement | false {

  if (!(target instanceof Element)) return false;

  const element = target.closest<HTMLLinkElement>(selector);

  return (element && element.tagName === 'A') ? element : false;

};

/**
 * Link is not cached and can be fetched
 */
export function canFetch (target: HTMLLinkElement): boolean {

  if (target.nodeName !== 'A') return false;

  const href = target.getAttribute('href');

  if (!href) return false;
  if (!validKey(href)) return false;

  return has(getKey(href)) === false;

};

/**
 * Returns a list of link elements to be prefetched. Filters out
 * any links which exist in cache to prevent pointless transits.
 */
export function getNodeTargets (selector: string, hrefs: string): HTMLLinkElement[] {

  const targets: HTMLLinkElement[] = [];

  forNode<HTMLLinkElement>(selector, (targetNode) => {

    if (targetNode.nodeName !== 'A') {

      const nodes = targetNode.querySelectorAll<HTMLLinkElement>(hrefs);

      forNode<HTMLLinkElement>(nodes, linkNode => {
        if (canFetch(linkNode)) {
          targets.push(linkNode);
        }
      });

    } else {
      if (targetNode.hasAttribute('href')) {
        const { href } = targetNode;
        if (validKey(href) && has(getKey(href))) targets.push(targetNode);
      }
    }
  });

  return targets;

};

/**
 * Returns a list of link elements to be prefetched. Filters out
 * any links which exist in cache to prevent extrenous transit.
 */
export const getTargets = (selector: string): HTMLLinkElement[] => {

  const targets: HTMLLinkElement[] = [];

  forNode<HTMLLinkElement>(selector, linkNode => {
    if (canFetch(linkNode)) {
      targets.push(linkNode);
    }
  });

  return targets;

};
