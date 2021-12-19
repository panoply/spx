import { IPosition } from '../types/page';
import { connect } from '../app/connects';

/**
 * Returns to current scroll position, the `reset()`
 * function **MUST** be called after referencing this
 * to reset position.
 */
export const position: IPosition = { x: 0, y: 0 };

/**
 * onScroll event, asserts the current X and Y page
 * offset position of the document
 */
export function onScroll (): IPosition {

  position.x = window.scrollX || window.pageXOffset;
  position.y = window.scrollY || window.pageYOffset;

  return position;
}

/**
 * Resets the scroll position`of the document, applying
 * a `x`and `y` positions to `0`
 */
export function reset (): IPosition {

  position.x = 0;
  position.y = 0;

  return position;
}

/**
 * Returns a faux scroll position. This prevents the
 * tracked scroll position from being overwritten and is
 * used within functions like `href.attrparse`
 */
export function y0x0 (): IPosition {

  return { x: 0, y: 0 };

}

/**
 * Attached `scroll` event listener.
 */
export function start (): void {

  if (!connect.scroll) {
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    connect.scroll = true;
  }

}

/**
 * Removed `scroll` event listener.
 */
export function stop (): void {

  if (connect.scroll) {
    removeEventListener('scroll', onScroll, false);
    reset();
    connect.scroll = false;
  }

}
