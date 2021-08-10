import nprogress from 'nprogress';
import { IProgress } from '../types/store';

export let progress: nprogress.NProgress;

/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */

/**
 * Setup nprogress
 *
 * @export
 * @param {Store.IProgress} options
 */
export function config ({ options }: IProgress): void {

  progress = nprogress.configure({
    ...options,
    template: '<div class="bar" role="bar"><div class="peg"></div></div>'
  });

};
