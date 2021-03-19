import { store } from './store'

/* -------------------------------------------- */
/* LETTINGS                                     */
/* -------------------------------------------- */

/**
 * Timer Reference
 *
 * @type {any}
 */
let timer

/**
 * Progress Element
 *
 * @type {Element}
 */
let element

/**
 * Loading
 *
 * @type {boolean}
 */
export let loading = false

/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */

/**
 * Show Progress Bar
 *
 * @exports
 */
export function show () {

  if (store.config.progress) {

    if (timer) {
      clearTimeout(timer)
      timer = 0
      element.className = 'pjax-loader pjax-hide'
      setTimeout(show, 25)
      return
    }

    if (!element) {
      element = document.createElement('div')
      element.innerHTML = '<div class="pjax-progress"></div>'
      element.setAttribute('data-pjax-track', 'true')
      document.body.appendChild(element)
    }

    element.className = 'pjax-loader pjax-start'

    timer = setTimeout(() => {
      timer = 0
      loading = true
      element.classList.add('pjax-inload')
    }, 15)
  }
}

/**
 * Hide Progress Bar
 *
 * @exports
 */
export function hide () {

  if (store.config.progress) {
    if (timer) clearTimeout(timer)

    element.classList.add('pjax-end')

    timer = setTimeout(() => {
      timer = 0
      element.classList.add('pjax-hide')
    }, 800)

    loading = false
  }

}
