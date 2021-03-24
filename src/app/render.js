import { eachSelector, dispatchEvent, forEach } from './utils'
import { store, snapshots } from './store'
import { progress } from './progress'
import history from 'history/browser'
import { createPath } from 'history'
import { nanoid } from 'nanoid'
import * as prefetch from './prefetch'

/**
 * Renderer
 *
 * @param {boolean} connected
 */
export default (function () {

  /**
   * Tracked Elements
   *
   * @type {Set<string>}
   */
  const tracked = new Set()

  /**
   * Parse HTML document string from request response
   * using `DomParser()` method. Cached pages will pass
   * the saved response here.
   *
   * @param {string} data
   * @return {Document}
   */
  const DOMParse = data => new DOMParser().parseFromString(data, 'text/html')

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
  const DOMHead = ({ children }) => {

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

    dispatchEvent('pjax:render', { target }, true)

    if (!state?.replace && !state?.prepend && !state?.append) {

      DOM.innerHTML = target.innerHTML

    } else {

      const fragment = document.createElement('div')
      const nodes = [].slice.call(target.childNodes)

      forEach(nodes, node => fragment.appendChild(node))

      state.replace ? DOM.replaceWith(fragment) : state.append
        ? DOM.appendChild(fragment)
        : DOM.insertBefore(fragment, DOM.firstChild)

    }

  }

  /**
   * Captures current document element and sets a
   * record to snapshot state
   *
   * @param {Document} target
   * @returns {string}
   */
  const DOMSnapshot = (target) => {
    const uuid = nanoid(16)
    snapshots.set(uuid, target.documentElement.outerHTML)
    return uuid
  }

  /**
   * Updates cached DOM
   *
   * @param {string} url
   * @param {{ action: 'replace' | 'capture'}} options
   */
  const captureDOM = (url, options) => {

    if (store.config.cache && store.has(url, { snapshot: true })) {

      const state = store.cache(url)
      const DOMString = store.snapshot(state.snapshot)
      const target = DOMParse(DOMString)

      target.body.innerHTML = document.documentElement.querySelector('body').innerHTML

      if (options.action === 'replace') {
        snapshots.set(state.snapshot, target.documentElement.outerHTML)
      } else if (options.action === 'capture') {
        state.captured = DOMSnapshot(target)

        console.log(store.cache(url))
        history.replace(state.location, store.update(state))
        console.info('Pjax: DOM Captured at: ' + state.captured)
      }

      return target.documentElement.outerHTML

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

    prefetch.stop()

    console.log(state)

    const uuid = (popstate && typeof state.captured === 'string')
      ? state.captured
      : state.snapshot

    const target = DOMParse(store.snapshot(uuid))

    state.title = document.title = target?.title || ''

    if (!popstate) {

      if (createPath(history.location) === state.url) {
        history.replace(state.location, state)
      } else {
        history.push(state.location, state)
      }

    } else if (state?.captured) {

      if (snapshots.delete(uuid)) {
        state.captured = false
        // history.replace(state.location, store.update(state))
        console.info('Pjax: Captured snapshot removed at: ' + state.url)
      }

    }

    if (target?.head) DOMHead(target.head)

    let fallback = 1

    forEach(state.targets, element => {

      const node = target.body.querySelector(element)

      return node
        ? eachSelector(document, element, replaceTarget(node, state))
        : fallback++

    })

    if (fallback === state.targets.length) {
      replaceTarget(target.body, state)(document.body)
    }

    // APPEND TRACKED NODES
    eachSelector(target, '[data-pjax-track]', appendTrackedNode)

    window.scrollTo(state.position.x, state.position.y)

    dispatchEvent('pjax:load', state)

    progress.done()
    prefetch.start()

    // console.log(window.performance.measure('Render Time', 'render'))
    // console.log(window.performance.measure('Total', 'started'))

  }

  return {
    update,
    captureDOM
  }

})()
