import { Protocol } from './constants/regexp';
import { nanoid } from 'nanoid';
import { store } from './app/store';
import * as path from './app/path';
import * as hrefs from './observers/hrefs';
import * as controller from './app/controller';
import { IPage, IOptions } from './types';

/**
 * Exported Types
 */
export * from './types';

/**
 * Supported
 */
export const supported = !!(
  window.history.pushState &&
  window.requestAnimationFrame &&
  window.addEventListener &&
  window.DOMParser
);

/**
 * Connect Pjax
 */
export const connect = (options: IOptions) => {

  store.connect(options);

  if (supported) {
    if (Protocol.test(window.location.protocol)) {
      addEventListener('DOMContentLoaded', controller.initialize);
    } else {
      console.error('Invalid protocol, pjax expects https or http protocol');
    }
  } else {
    console.error('Pjax is not supported by this browser');
  }

};

/**
 * Reload
 *
 * Reloads the current page
 */
export const reload = () => {};

/**
 * UUID Generator
 */
export const uuid = (size: number = 12) => nanoid(size);

/**
 * Flush Cache
 */
export const clear = (url: string) => store.clear(url);

/**
 * Visit
 */
export const visit = (
  link: string | Element,
  state: IPage = {}
): Promise<void> => {

  const { url, location } = path.get(link, true);

  return hrefs.navigate(url, { ...state, url, location });
};

/**
 * Disconnect
 */
export const disconnect = () => controller.destroy();
