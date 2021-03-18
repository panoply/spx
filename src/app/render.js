import { isReplace } from '../constants/regexp'
import { eachSelector, dispatchEvent, forEach } from './utils'
import { store, snapshots, cache, tracked } from './store'
import { getURL } from './location'
import { nanoid } from 'nanoid'
import history from 'history/browser'
import * as progress from './progress'

/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */

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
 * @param {IPjax.IState} state
 * @returns {(DOM: Element) => void}}
 */
const replaceTarget = (target, { method }) => DOM => {

  if (!isReplace.test(method)) {

    dispatchEvent('pjax:render', { method, fragment: target }, true)

    DOM.innerHTML = target.innerHTML

  } else {

    let fragment = document.createElement('div')
    const nodes = [].slice.call(target.childNodes)

    forEach(nodes, node => fragment.appendChild(node))

    if (method === 'append') {

      dispatchEvent('pjax:render', { method, fragment }, true)
      DOM.appendChild(fragment)

      console.log(fragment)
      console.log('in append')

    } else {
      dispatchEvent('pjax:render', { method, fragment }, true)
      DOM.insertBefore(fragment, DOM.firstChild)
    }

    fragment = null

  }
}

function runActions () {

  Object.entries(state.action).forEach(([ action, targets ]) => {

    targets.forEach((node) => {

      if (action === 'replace') {

        const element = document.body.querySelector(`[data-pjax-target="${node}"]`)
        const replace = target.body.querySelector(`[data-pjax-target="${node}"]`)

        element.replaceWith(replace)
      }

      if (action === 'append') {

        const element = document.querySelector(`[data-pjax-target="${node[0]}"]`)

        state.targets[node[1]].forEach(newnode => {
          element.appendChild(newnode)
          dispatchEvent('pjax:render', { node: newnode }, true)
        })

      }

    })

  })

}

/**
 * Get targets
 *
 * @param {Document} element
 * @param {IPjax.IState} state
 */
export function getTargets ({ body }, state) {

  body.querySelectorAll(Targets).forEach(node => {

    const name = node.getAttribute('data-pjax-target')

    if (!state.targets[name]) state.targets[name] = []

    state.targets[name].push(node)
    // node.setAttribute('data-pjax-action', uuid)

  })

}

/**
 * Captures current document element and sets a
 * record to snapshot state
 *
 * @export
 * @param {Document} target
 * @returns {string}
 */
export function DOMSnapshot (target) {

  const uuid = nanoid(16)
  snapshots.set(uuid, target.documentElement.outerHTML)

  return uuid

}

/**
 * Updates cached DOM
 *
 * @export
 * @param {string} url
 * @param {object} options
 */
export function captureDOM (url, options) {

  url = getURL(url)

  if (store.config.cache && cache.has(url)) {

    const state = cache.get(url)
    const DOMString = snapshots.get(state.snapshot)
    const target = DOMParse(DOMString)

    console.log(url)
    target.body.innerHTML = document.documentElement.querySelector('body').innerHTML

    if (options.action === 'replace') {

      snapshots.set(state.snapshot, target.documentElement.outerHTML)
    } else if (options.action === 'capture') {

      state.captured = DOMSnapshot(target)
      history.replace(state.location.href, state)
      console.info('Pjax: DOM Captured at: ' + state.captured)
    }

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

  return new DOMParser().parseFromString(data, 'text/html')
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

  const uuid = (popstate && state?.captured) ? state.captured : state.snapshot
  const target = DOMParse(snapshots.get(uuid))

  state.title = document.title = target?.title || ''

  if (!popstate) {

    const { pathname, search } = history.location

    if ((pathname + search) === state.url) {
      history.replace(state.location.href, state)
    } else {
      history.push(state.location.href, state)
    }

  } else if (typeof state?.captured === 'string') {

    if (snapshots.delete(uuid)) {
      state.captured = null
      history.replace(state.location.href, state)
      console.info('Pjax: Captured snapshot removed at: ' + state.url)
    }

  }

  if (target?.head) DOMHead(target.head)

  // APPEND TRACKED NODES
  eachSelector(target, '[data-pjax-track]', appendTrackedNode)

  let fallback = 1

  forEach(state.target, element => {

    const node = target.body.querySelector(element)

    return node ? eachSelector(
      document,
      element,
      replaceTarget(node, state)
    ) : fallback++

  })

  if (fallback === state.target.length) {
    replaceTarget(target.body, state)(document.body)
  }

  window.scrollTo(state.position.x, state.position.y)

  progress.hide()

  dispatchEvent('pjax:load', state)

}
