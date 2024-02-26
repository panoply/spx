/* eslint-disable no-unused-vars */
import { HistoryAPI } from './config';
import SPX from './methods';
export * from './events';
export * from './methods';
export * from './options';
export * from './config';
export * from './page';
export * as default from './methods';

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
