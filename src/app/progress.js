import nprogress from 'nprogress'

/* -------------------------------------------- */
/* LETTINGS                                     */
/* -------------------------------------------- */

/**
 * @type {nprogress.NProgress}
 */
export let progress = null

/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */

/**
 * Setup nprogress
 *
 * @export
 * @param {IPjax.IProgress} options
 */
export function config (options) {

  progress = nprogress.configure(options)

}
