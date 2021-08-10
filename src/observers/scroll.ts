import { IPosition } from '../types';

let connected: boolean = false;

/**
 * Returns to current scroll position, the `reset()`
 * function **MUST** be called after referencing this
 * to reset position.
 */
export let position: IPosition = { x: 0, y: 0 };

/**
 * onScroll event, asserts the current X and Y page
 * offset position of the document
 */
function onScroll (): void {

  position.x = window.screenX ?? window.pageXOffset;
  position.y = window.screenY ?? window.pageYOffset;

};

/**
 * Resets the scroll position`of the document, applying
 * a `x`and `y` positions to `0`
 */
export function reset (): IPosition {

  position.x = 0;
  position.y = 0;

  return position;

};

/**
 * Returns a faux scroll position. This prevents the
 * tracked scroll position from being overwritten and is
 * used within functions like `href.attrparse`
 */
export function y0x0 (): IPosition {

  return {
    x: 0,
    y: 0
  };
}

/**
 * Attached `scroll` event listener.
 */
export function start (): void {

  if (!connected) {
    addEventListener('scroll', onScroll, false);
    onScroll();
    connected = true;
  }

}

/**
 * Removed `scroll` event listener.
 */
export function stop (): void {

  if (connected) {
    removeEventListener('scroll', onScroll, false);
    position = y0x0();
    connected = false;
  }
};
