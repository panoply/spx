import { DOMParseFallback, isReplace } from '../constants/regexp'
import { Implementation, ArraySlice, DomParser } from '../constants/common'
import { Selectors, Dispatch, ForEach } from './utils'
import { store } from './store'

/**
 * DOM Head Nodes
 *
 * @param {string[]} nodes
 * @param {HTMLHeadElement} head
 * @return {string}
 */
const DOMHeadNodes = (nodes, { children }) => {

  ForEach(children, DOMNode => {
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

  ForEach(fragment.children, DOMNode => {
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
const ReplaceTarget = (target, { action }) => DOM => {

  if (!isReplace.test(action)) {

    DOM.innerHTML = target.innerHTML

  } else {

    let fragment = document.createDocumentFragment()

    ForEach(ArraySlice.call(target.childNodes), fragment.appendChild)

    if (action === 'append') {
      DOM.appendChild(fragment)
    } else {
      DOM.insertBefore(fragment, DOM.firstChild)
    }

    fragment = null

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
const DOMParse = data => {

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
export const update = (state, popstate = false) => {

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
  Selectors(target, '[data-pjax-track]', appendTrackedNode)

  let fallback = 1

  // REPLACE TARGETS
  //
  ForEach(state.target, element => {

    const node = target.body.querySelector(element)

    return node ? Selectors(
      document,
      element,
      ReplaceTarget(node, state)
    ) : fallback++

  })

  // when no targets are found we will replace the
  // entire document body
  if (fallback === state.target.length) {
    ReplaceTarget(target.body, state)(document.body)
  }

  // SET SCROLL POSITION
  //
  // window.scrollTo(state.position.x, state.position.y)

  console.log(store.dom)

  // @ts-ignore
  Dispatch('pjax:load', { state })

}
