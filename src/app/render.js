import { dispatchEvent, forEach } from './utils'
import { progress } from './progress'
import history from 'history/browser'
import * as prefetch from './prefetch'
import store from './store'

/**
 * Renderer
 *
 * @param {boolean} connected
 */
export default (function () {

  /**
   * @type{DOMParser} data
   */
  const DOMParse = new DOMParser()

  /**
   * Tracked Elements
   *
   * @type {Set<string>}
   */
  const tracked = new Set()

  /**
   * Parse HTML document string from request response
   * using `parser()` method. Cached pages will pass
   * the saved response here.
   *
   * @param {string} HTMLString
   * @return {Document}
   */
  const parse = HTMLString => DOMParse.parseFromString(HTMLString, 'text/html')

  /**
   * DOM Head Nodes
   *
   * @param {string[]} nodes
   * @param {HTMLHeadElement} head
   * @return {string}
   */
  const DOMHeadNodes = (nodes, { children }) => {

    forEach(children, DOMNode => {
      if (DOMNode.tagName === 'TITLE') return null
      if (DOMNode.getAttribute('data-pjax-eval') !== 'false') {
        const index = nodes.indexOf(DOMNode.outerHTML)
        index === -1 ? DOMNode.parentNode.removeChild(DOMNode) : nodes.splice(index, 1)
      }
    })

    return nodes.join('')

  }

  /**
   * DOM Head
   *
   * @param {HTMLHeadElement} head
   */
  const DOMHead = async ({ children }) => {

    const targetNodes = Array.from(children).reduce((arr, node) => (
      node.tagName !== 'TITLE' ? (
        [ ...arr, node.outerHTML ]
      ) : arr
    ), [])

    const fragment = document.createElement('div')
    fragment.innerHTML = DOMHeadNodes(targetNodes, document.head)

    forEach(fragment.children, DOMNode => {
      if (!DOMNode.hasAttribute('data-pjax-eval')) {
        document.head.appendChild(DOMNode)
      }
    })

  }

  /**
   * Append Tracked Node
   *
   * @param {Element} node
   */
  const appendTrackedNode = (node) => {

    // tracked element must contain id
    if (!node.hasAttribute('id')) return

    if (!tracked.has(node.id)) {
      document.body.appendChild(node)
      tracked.add(node.id)
    }

  }

  /**
   * Apply actions to the documents target fragments
   * with the request response.
   *
   * @param {Element} target
   * @param {Store.IPage} state
   * @returns {(DOM: Element) => void}}
   */
  const replaceTarget = (target, state) => DOM => {

    if (dispatchEvent('pjax:render', { target }, true)) {

      DOM.innerHTML = target.innerHTML

      if (state?.append || state?.prepend) {

        const fragment = document.createElement('div')

        forEach([ ...target.childNodes ], node => fragment.appendChild(node))

        state.append
          ? DOM.appendChild(fragment)
          : DOM.insertBefore(fragment, DOM.firstChild)

      }
    }
  }

  /**
   * Captures current document element and sets a
   * record to snapshot state
   *
   * @param {Store.IPage} state
   */
  const capture = async ({ url, snapshot }) => {

    if (store.has(url, { snapshot: true })) {
      const target = parse(store.snapshot(snapshot))
      target.body.innerHTML = document.body.innerHTML
      store.set.snapshots(snapshot, target.documentElement.outerHTML)
    }

  }

  /**
   * Update the DOM and execute page adjustments
   * to new navigation point
   *
   * @param {Store.IPage} state
   * @param {boolean} [popstate=false]
   */
  const update = (state, popstate = false) => {

    // window.performance.mark('render')
    // console.log(window.performance.measure('time', 'start'))

    const target = parse(store.snapshot(state.snapshot))

    state.title = document.title = target?.title || ''

    if (!popstate && state.history) {
      if (state.url === state.location.lastpath) {
        history.replace(state.location, state)
      } else {
        history.push(state.location, state)
      }
    }

    if (target?.head) DOMHead(target.head)

    let fallback = 1

    forEach(state?.replace
      ? [ ...state.targets, ...state.replace ]
      : state.targets, element => {

      const node = target.body.querySelector(element)

      return node ? document.body
        .querySelectorAll(element)
        .forEach(replaceTarget(node, state)) : fallback++
    })

    if (fallback === state.targets.length) {
      replaceTarget(target.body, state)(document.body)
    }

    // APPEND TRACKED NODES
    target.body
      .querySelectorAll('[data-pjax-track]')
      .forEach(appendTrackedNode)

    window.scrollTo(state.position.x, state.position.y)

    progress.done()
    prefetch.start()

    dispatchEvent('pjax:load', state)

    // console.log(window.performance.measure('Render Time', 'render'))
    // console.log(window.performance.measure('Total', 'started'))

  }

  return {

    /* EXPORTS ------------------------------------ */

    update
    , parse
    , capture

  }

})()
