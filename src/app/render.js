import { eachSelector, dispatchEvent, forEach } from './utils'
import { progress } from './progress'
import history from 'history/browser'
import { createPath } from 'history'
import { nanoid } from 'nanoid'
import * as prefetch from './prefetch'
import scroll from '../observers/scroll'
import store from './store'

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

    DOM.innerHTML = target.innerHTML

    if (state?.append || state?.prepend) {

      const fragment = document.createElement('div')
      const nodes = [].slice.call(target.childNodes)

      forEach(nodes, node => fragment.appendChild(node))

      state.append
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
  const DOMSnapshot = target => {
    const uuid = nanoid(16)
    store.set.snapshots(uuid, target.documentElement.outerHTML)
    return uuid
  }

  /**
   * Updates cached DOM
   *
   * @param {string} url
   * @param {{ action: 'replace' | 'capture'}} options
   * @returns {string}
   */
  const captureDOM = (url, options = { action: 'capture' }) => {

    if (!store.has(url, { snapshot: true })) return undefined

    const { snapshot, page } = store.get(url)
    const target = DOMParse(snapshot)
    target.body.innerHTML = document.documentElement.querySelector('body').innerHTML

    if (options.action === 'capture') {

      page.captured = DOMSnapshot(target)
      page.position = scroll.position

      history.replace(page.location, store.update(page))
      console.info('Pjax: DOM Captured at: ' + page.captured)

    } else if (options.action === 'replace') {
      store.snapshots.set(page.snapshot, target.documentElement.outerHTML)
    }

    return target.documentElement.outerHTML

  }

  /**
   * Update the DOM and execute page adjustments
   * to new navigation point
   *
   * @param {Store.IPage} state
   * @param {boolean} [popstate=false]
   * @returns {Store.IPage}
   */
  const update = (state, popstate = false) => {

    // window.performance.mark('render')

    prefetch.stop()

    const uuid = (popstate && state.captured) ? state.captured : state.snapshot
    const target = DOMParse(store.snapshot(uuid))

    state.title = document.title = target?.title || ''

    if (!popstate && state.history) {

      if (createPath(history.location) === state.url) {
        history.replace(state.location, state)
      } else {
        history.push(state.location, state)
      }

    } else if (state?.captured) {

      if (store.delete.snapshots(uuid)) {
        state.captured = null
        // history.replace(state.location, store.update(state))
        console.info('Pjax: Captured snapshot removed at: ' + state.url)
      }

    }

    if (target?.head) DOMHead(target.head)

    let fallback = 1

    console.log(state.replace ? [
      ...state.targets,
      ...state.replace
    ] : state.targets)

    forEach(state.replace ? [
      ...state.targets,
      ...state.replace
    ] : state.targets, element => {

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

    return state
    // console.log(window.performance.measure('Render Time', 'render'))
    // console.log(window.performance.measure('Total', 'started'))

  }

  return {
    update,
    captureDOM
  }

})()
