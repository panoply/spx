/**
 * Create an element, optionally with a known namespace URI.
 *
 * @param {string} name
 * The element name, e.g. 'div' or 'svg'
 *
 * @param {string} [namespaceURI]
 * The element's namespace URI, i.e. the value of its `xmlns` attribute or
 * its inferred namespace.
 */
export function createElementNS (name: string, namespaceURI?: string): Element {

  return !namespaceURI || namespaceURI === 'http://www.w3.org/1999/xhtml'
    ? document.createElement(name)
    : document.createElementNS(namespaceURI, name);
}

/**
 * Appends the parent to the child
 */
// export function addChild (parent: Element, child: Element) { return parent.appendChild(child); };

/**
 * Get default node key
 */
export function getNodeKey (node: ChildNode) {

  return node ? ((
    (node as Element).getAttribute &&
    (node as Element).getAttribute('id')) || (node as Element).id) : undefined;

}

/**
 * Returns true if two node's names are the same.
 *
 * **NOTE**
 *
 * We don't bother checking `namespaceURI` because you will never find
 * two HTML elements with the same nodeName and different namespace URIs.
 */
export function compareNodeNames (oldElement: Element, newElement: Element): boolean {

  const oldNodeName = oldElement.nodeName;
  const newNodeName = newElement.nodeName;

  if (oldNodeName === newNodeName) return true;

  const oldCodeStart = oldNodeName.charCodeAt(0);
  const newCodeStart = newNodeName.charCodeAt(0);

  // If the target element is a virtual DOM node or SVG node then we may
  // need to normalize the tag name before comparing. Normal HTML elements that are
  // in the "http://www.w3.org/1999/xhtml" are converted to upper case
  if (oldCodeStart <= 90 && newCodeStart >= 97) return oldNodeName === newNodeName.toUpperCase();
  if (oldCodeStart <= 90 && newCodeStart >= 97) return oldNodeName === newNodeName.toUpperCase();

  return false;

}

/**
 * Copies the children of one DOM element to another DOM element
 */
export function moveChildren (oldElement: Element, newElement: Element) {

  let curChild = oldElement.firstChild;

  while (curChild) {
    const nextChild = curChild.nextSibling;
    newElement.appendChild(curChild);
    curChild = nextChild;
  }

  return newElement;
}
