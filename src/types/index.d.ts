/* eslint-disable no-unused-vars */
import SPX from './methods';
export * from './events';
export * from './methods';
export * from './options';
export * from './config';
export * from './page';
export * as default from './methods';

declare global {

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
