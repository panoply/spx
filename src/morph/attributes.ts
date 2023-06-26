import { Nodes } from '../shared/enums';

export function morphAttrs (oldNode: Element, newNode: Element) {

  // document-fragments dont have attributes so lets not do anything
  //
  // DOCUMENT_FRAGMENT_NODE
  //
  if (
    newNode.nodeType === Nodes.DOCUMENT_FRAGMENT_NODE ||
    oldNode.nodeType === Nodes.DOCUMENT_FRAGMENT_NODE) return;

  const newNodeAttrs = newNode.attributes;

  /** The Element Attribute */
  let attr: Attr;

  /** Attribute Name */
  let attrName: string;

  /** Namespace URI */
  let attrNamespaceURI: string;

  /** New Attribute Value */
  let attrValue: string;

  /** Old Attribute Value */
  let fromValue: string;

  // update attributes on original DOM element
  for (let i = newNodeAttrs.length - 1; i >= 0; i--) {

    attr = newNodeAttrs[i];
    attrName = attr.name;
    attrValue = attr.value;
    attrNamespaceURI = attr.namespaceURI;

    if (attrNamespaceURI) {

      attrName = attr.localName || attrName;
      fromValue = oldNode.getAttributeNS(attrNamespaceURI, attrName);

      if (fromValue !== attrValue) {

        // It's not allowed to set an attribute with the XMLNS namespace without specifying the `xmlns` prefix
        if (attr.prefix === 'xmlns') attrName = attr.name;

        oldNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);

      }

    } else {

      fromValue = oldNode.getAttribute(attrName);

      if (fromValue !== attrValue) oldNode.setAttribute(attrName, attrValue);

    }
  }

  // Remove any extra attributes found on the original DOM element that
  // weren't found on the target element.
  const oldNodeAttrs = oldNode.attributes;

  for (let d = oldNodeAttrs.length - 1; d >= 0; d--) {

    attr = oldNodeAttrs[d];
    attrName = attr.name;
    attrValue = attr.value;

    attrNamespaceURI = attr.namespaceURI;

    if (attrNamespaceURI) {

      attrName = attr.localName || attrName;

      if (!newNode.hasAttributeNS(attrNamespaceURI, attrName)) {
        oldNode.removeAttributeNS(attrNamespaceURI, attrName);
      }

    } else {

      if (!newNode.hasAttribute(attrName)) oldNode.removeAttribute(attrName);

    }
  }
}
