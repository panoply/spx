/* eslint-disable no-unused-vars */

import type { HistoryAPI } from './config';
import type * as SPX from './spx';
export * from './components';
export * from './session';
export * from './events';
export * from './spx';
export * from './options';
export * from './config';
export * from './page';
export * as default from './spx';

declare global {

  interface Element {
    /**
     * Morph Related (Virtual DOM)
     */
    actualize?:(element: Node) => Element
  }

  interface HTMLElement {
    /**
     * SPX Specific Element
     */
    spx?: Set<string>
  }

  interface History extends HistoryAPI {}

  interface Window {
    /**
     * **_SPX_**
     */
    spx: typeof SPX
  }

  /**
   * **_SPX_**
   */
 export const spx: typeof SPX;

}
