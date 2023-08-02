import * as history from './history';
import { observers, pages } from '../app/session';
import { object } from '../shared/native';

const positions: { [at: number]: string } = object(null);

export function mark (key: string) {

  positions[window.scrollY] = key;

}

/**
 * Scroll Watcher
 *
 * Tracks scroll positions and possible key marks. This function
 * is used to perform operations like infinite scrolling. The `mark()`
 * function is used to replace history push state.
 */
function watch (_event: Event) {

  if (scrollY in positions) history.replace(pages[positions[scrollY]]);

}

/**
 * Attached `scroll` listener
 *
 * @returns {void}
 */
export function connect (): void {

  if (observers.scroll) return;

  addEventListener('scroll', watch, { passive: true });

  observers.scroll = true;

}

/**
 * Removed `scroll` listener
 *
 * @returns {void}
 */
export function disconnect (): void {

  if (!observers.scroll) return;

  removeEventListener('scroll', watch);

  observers.scroll = false;
}
