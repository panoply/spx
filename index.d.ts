import { SPX } from './types/global';
import type { HistoryAPI } from './types/config';
export type { SPX } from './types/global';

// export type { SPX } from './types/namespace';

declare global {

  export interface Element {
    /**
     * Morph Related (Virtual DOM)
     */
    actualize?:(element: Node) => Element
  }

  export interface HTMLElement {
    /**
     * SPX Specific Element
     */
    spx?: Set<string>
  }

  export interface History extends HistoryAPI {}

  export interface Window {
    /**
     * **_SPX_**
     */
    spx: SPX.API
  }

}

declare const spx: SPX.API & typeof SPX.Methods;

// @ts-ignore
export default spx;
