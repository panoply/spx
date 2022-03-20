import { IPosition } from '../types/page';
import { connect } from '../app/connects';

/**
 * Returns to current scroll position, the `reset()`
 * function **MUST** be called after referencing this
 * to reset position.
 */
let y: number = 0;
let x: number = 0;
let ticking: boolean = false;

/**
 * Set the current scroll position offset
 * and update the X and Y page references.
 */
export function position () {

  return { x, y };

}

/**
 * onScroll event, asserts the current X and Y page
 * offset position of the document
 */
export function scroll (): void {

  y = window.scrollY;
  x = window.scrollX;

  if (!ticking) {
    window.requestAnimationFrame(position);
    ticking = true;
  }

}

/**
 * Resets the scroll position`of the document, applying
 * a `x`and `y` positions to `0`
 */
export function reset (): IPosition {

  ticking = false;

  x = 0;
  y = 0;

  return { x, y };

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
    scroll();
    addEventListener('scroll', scroll, { passive: true });
    connect.scroll = true;
  }

}

/**
 * Removed `scroll` event listener.
 */
export function stop (): void {

  if (connect.scroll) {
    removeEventListener('scroll', scroll, false);
    reset();
    connect.scroll = false;
  }

}
