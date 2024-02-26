import { Nodes } from '../shared/enums';
import { nil } from '../shared/native';
import * as observe from '../components/observe';
import { $ } from '../app/session';
import { isDirective } from '../components/context';

/**
 * Set or Remove boolean attribute annotations, specifically used for Form elements
 */
export function setBooleanAttribute (curElement: Element, newElement: Element, name: string) {

  if (curElement[name] !== newElement[name]) {

    curElement[name] = newElement[name];

    if (curElement[name]) {
      curElement.setAttribute(name, nil);
    } else {
      curElement.removeAttribute(name);
    }
  }
}

export function morphAttributes (curNode: HTMLElement, newNode: HTMLElement) {

  // document-fragments dont have attributes so lets not do anything
  //
  // DOCUMENT_FRAGMENT_NODE
  //
  if (newNode.nodeType === Nodes.FRAGMENT_NODE || curNode.nodeType === Nodes.FRAGMENT_NODE) return;

  /** New node attributes */
  const newNodeAttrs = newNode.attributes;

  /** Component directives contained on current page */
  const cRef: string = curNode.getAttribute($.qs.$ref);

  /** Component directives contained on new page */
  const nRef: string = newNode.getAttribute($.qs.$ref);

  /** Component directives existing when nRef do not */
  let attrDirective: boolean = false;

  /** The Element Attribute */
  let attrNode: Attr;

  /** Attribute Name */
  let attrName: string;

  /** Namespace URI */
  let attrNamespaceURI: string;

  /** New Attribute Value */
  let attrValue: string;

  /** Old Attribute Value */
  let fromValue: string;

  // update attributes on original DOM element
  for (let n = newNodeAttrs.length - 1; n >= 0; n--) {

    attrNode = newNodeAttrs[n];
    attrName = attrNode.name;
    attrValue = attrNode.value;
    attrNamespaceURI = attrNode.namespaceURI;

    if (attrNamespaceURI) {

      attrName = attrNode.localName || attrName;
      fromValue = curNode.getAttributeNS(attrNamespaceURI, attrName);

      if (fromValue !== attrValue) {

        // It's not allowed to set an attribute with the XMLNS namespace without
        // specifying the `xmlns` prefix
        if (attrNode.prefix === 'xmlns') attrName = attrNode.name;

        curNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);

      }

    } else {

      fromValue = curNode.getAttribute(attrName);

      if (fromValue !== attrValue) {

        curNode.setAttribute(attrName, attrValue);

        if (!cRef && !nRef && !attrDirective) {
          attrDirective = isDirective(attrName);
        }

      }
    }
  }

  // Remove any extra attributes found on the original DOM element that weren't found on the target element.
  const curNodeAttrs = curNode.attributes;

  for (let o = curNodeAttrs.length - 1; o >= 0; o--) {

    attrNode = curNodeAttrs[o];
    attrName = attrNode.name;
    attrValue = attrNode.value;
    attrNamespaceURI = attrNode.namespaceURI;

    if (attrNamespaceURI) {

      attrName = attrNode.localName || attrName;

      if (!newNode.hasAttributeNS(attrNamespaceURI, attrName)) {
        curNode.removeAttributeNS(attrNamespaceURI, attrName);
      }

    } else {

      if (!newNode.hasAttribute(attrName)) {
        curNode.removeAttribute(attrName);
      }

    }
  }

  if (cRef || nRef || attrDirective) {

    observe.updateNode(
      curNode,
      newNode,
      cRef,
      nRef
    );

  }

}
