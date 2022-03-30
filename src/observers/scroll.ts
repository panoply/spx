import { IPosition } from '../types/page';
import { connect } from '../app/state';
import { create, defineProps } from '../constants/native';

/**
 * Returns to current scroll position, the `reset()`
 * function **MUST** be called after referencing this
 * to reset position.
 */

let ticking: boolean = false;

const pos = create(null);

/**
 * Set the current scroll position offset
 * and update the X and Y page references.
 */
export function position (): IPosition {

  return pos;

}

/**
 * onScroll event, asserts the current X and Y page
 * offset position of the document
 */
export function onscroll (): void {

  pos.y = window.scrollY;
  pos.x = window.scrollX;

  if (!ticking) {
    window.requestAnimationFrame(position);
    ticking = true;
  }

}

/**
 * Resets the scroll position of the document, applying
 * a `x`and `y` positions to `0`
 */
export function reset (): IPosition {

  ticking = false;

  pos.x = 0;
  pos.y = 0;

  return pos;

}

/**
 * Returns a faux scroll position. This prevents the
 * tracked scroll position from being overwritten and is
 * used within functions like `href.attrparse`
 */
export function y0x0 (): IPosition {

  const position = create(null);

  defineProps(position, {
    y: { value: 0, configurable: true, writable: true },
    x: { value: 0, configurable: true, writable: true }
  });

  return position;
}

/**
 * Attached `scroll` event listener.
 */
export function start (): void {

  if (connect.has(6)) return;

  onscroll();
  addEventListener('scroll', onscroll, { passive: true });
  connect.add(6);

}

/**
 * Removed `scroll` event listener.
 */
export function stop (): void {

  if (!connect.has(6)) return;

  removeEventListener('scroll', onscroll, false);
  reset();
  connect.delete(6);

}
