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
 * @param {Store.IProgress} options
 */
export const config = options => {

  progress = nprogress.configure(options)

}
