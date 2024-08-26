import { getKey, validKey } from '../app/location';
import { has } from '../app/queries';
import { CanFetch } from './enums';
import { forNode, targets } from './utils';

/**
 * Locted the closest link when click bubbles.
 */
export const getLink = <T> (
  target: EventTarget | MouseEvent,
  selector: string
): T & HTMLAnchorElement | HTMLAnchorElement | false => {

  if (!(target instanceof Element)) return false;

  const element = target.closest<HTMLAnchorElement>(selector);

  return (element && element.tagName === 'A') ? element : false;

};

/**
 * Link is not cached and can be fetched
 */
export const canFetch = (target: HTMLAnchorElement): CanFetch => {

  if (target.nodeName !== 'A') return CanFetch.NO;

  const href = target.getAttribute('href');
  if (!href || !validKey(href)) return CanFetch.NO;

  const key = getKey(href);

  return key === null ? CanFetch.NO : has(key) ? CanFetch.NO : CanFetch.YES;

};

/**
 * Returns a list of link elements to be prefetched. Filters out
 * any links which exist in cache to prevent pointless transits.
 */
export const getNodeTargets = (selector: string, hrefs: string): HTMLAnchorElement[] => {

  const targets: HTMLAnchorElement[] = [];

  forNode<HTMLAnchorElement>(
    selector,
    targetNode => {

      if (targetNode.nodeName !== 'A') {
        forNode<HTMLAnchorElement>(
          hrefs,
          linkNode => canFetch(linkNode) === CanFetch.YES ? targets.push(linkNode) : null
        );
      } else {

        if (targetNode.hasAttribute('href') && validKey(targetNode.href)) {
          const key = getKey(targetNode.href);
          if (getKey(key) !== null && has(key) === false) targets.push(targetNode);
        }
      }
    }
  );

  return targets;

};

/**
 * Returns a list of link elements to be prefetched. Filters out
 * any links which exist in cache to prevent extrenous transit.
 */
export const getTargets = (selector: string): HTMLAnchorElement[] => {

  const targets: HTMLAnchorElement[] = [];

  forNode<HTMLAnchorElement>(
    selector,
    linkNode => canFetch(linkNode) === CanFetch.YES ? targets.push(linkNode) : null
  );

  return targets;

};
