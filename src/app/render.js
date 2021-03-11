import { DOMParseFallback, isReplace } from '../constants/regexp'
import { Implementation, ArraySlice, DomParser } from '../constants/common'
import { eachSelector, dispatchEvent, forEach } from './utils'
import { store } from './store'

/**
 * DOM Head Nodes
 *
 * @param {string[]} nodes
 * @param {HTMLHeadElement} head
 * @return {string}
 */
function DOMHeadNodes (nodes, { children }) {

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
function DOMHead ({ children }) {

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
function appendTrackedNode (node) {

  // tracked element must contain id
  if (!node.hasAttribute('id')) return

  if (!store.dom.tracked.has(node.id)) {
    document.body.appendChild(node)
    store.dom.tracked.add(node.id)
  }

}

/**
 * Apply actions to the documents target fragments
 * with the request response.
 *
 * @param {Element} target
 * @param {IPjax.IState} state
 * @returns {(DOM: Element) => void}}
 * @memberof Render
 */
const replaceTarget = (target, element, { method }) => DOM => {

  if (!isReplace.test(method)) {

    dispatchEvent('pjax:render', { method, element, fragment: target }, true)

    DOM.innerHTML = target.innerHTML

  } else {

    let fragment = document.createElement('div')
    const nodes = ArraySlice.call(target.childNodes)

    forEach(nodes, node => fragment.appendChild(node))

    if (method === 'append') {
      dispatchEvent('pjax:render', { method, element, fragment }, true)
      DOM.appendChild(fragment)

      console.log(fragment)
      console.log('in append')

    } else {
      dispatchEvent('pjax:render', { method, element, fragment }, true)
      DOM.insertBefore(fragment, DOM.firstChild)
    }

    fragment = null

  }
}

/**
 * Updates cached DOM
 *
 * @export
 * @param {string} url
 */
export function getActiveDOM (url) {

  if (store.config.cache && store.cache.has(url)) {

    // store.cache.get(url).snapshot = document.documentElement.outerHTML

    // console.log(store.cache.get(url).snapshot)

  }

}

/**
 * Parse HTML document string from request response
 * using `DomParser()` method. Cached pages will pass
 * the saved response here.
 *
 * @param {string} data
 * @return {Document}
 */
export function DOMParse (data) {

  if (DomParser) return DomParser.parseFromString(data, 'text/html')

  /**
     * FALLBACK - Browser Does not support DOMParser
     */
  let DOM = Implementation.createHTMLDocument('')

  if (DOMParseFallback.test(data)) {
    DOM.documentElement.innerHTML = data
    if (!DOM.body || !DOM.head) {
      DOM = Implementation.createHTMLDocument('')
      DOM.write(data)
    }
  } else {
    DOM.body.innerHTML = data
  }

  return DOM

}

/**
 * Update the DOM and execute page adjustments
 * to new navigation point
 *
 * @param {IPjax.IState} state
 * @param {boolean} [popstate=false]
 * @memberof Render
 */
export function update (state, popstate = false) {

  console.log(state)

  const target = DOMParse(state.snapshot)
  const title = document.title = target.title || ''

  if (!popstate) {
    history.pushState(state, title, state.location.href)
  }

  if (target.head) {
    DOMHead(target.head)
  }

  // APPEND TRACKED NODES
  //
  eachSelector(target, '[data-pjax-track]', appendTrackedNode)

  eachSelector(document, '[data-pjax-replace]', element => {

    element.replaceWith(target.getElementById(element.id))

  })

  Object.keys(state.action).forEach(prop => {

    if (state.action[prop]) {

      forEach(state.action[prop], ([ from, to ]) => {

        const nodes = target.body.querySelectorAll(from)
        const frag = document.body.querySelector(to)

        console.log(nodes)
        nodes.forEach(node => {
          frag.appendChild(node)
          dispatchEvent('pjax:render', { node }, true)
        })

      })
    }

  })

  const fallback = 1

  // REPLACE TARGETS
  //
  /* forEach(state.target, element => {

    const node = target.body.querySelector(element)

    // if (node && node.hasAttribute('data-pjax-class')) setTargetClass(node)

    return node ? eachSelector(
      document,
      element,
      replaceTarget(node, element, state)
    ) : fallback++

  })
*/
  // when no targets are found we will replace the
  // entire document body
  if (fallback === state.target.length) {
    // replaceTarget(target.body, state)(document.body)
  }

  // SET SCROLL POSITION
  //
  // window.scrollTo(state.position.x, state.position.y)

  console.log(store.dom)

  dispatchEvent('pjax:load', { state, target })

}
