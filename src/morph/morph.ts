import { $ } from '../app/session';
import { m, o, s } from '../shared/native';
import { Nodes } from '../shared/enums';
import { morphAttributes } from './attributes';
import * as forms from './forms';
import * as observe from '../components/observe';

/*
  SPX MORPH ALGORITHM

  The morphing algorithm of SPX is a hard-forked version of morph-dom. While the majority of the
  algo remains intact, various improvements and changes have been made for its implementation
  into SPX. If you are seeking to re-implement this code, you're going to have a bad time. Some
  of the main changes applied help improve the morphing process with minor performance gains.

  The storage models differ from morph-dom. Lifecycles are omitted and handling of the the tree,
  ensures that snapshots are updated. The main modifications are designed for usage with SPX
  components.

  WHAT PERF GAINS?

  Tradeoff gains mostly. For one, SPX requires additional analysis for components, so the gains made
  are leveled during incremental analysis for components. One of the main differences in this hard-fork
  is that SPX uses `isEqualNode` opposed to `isSameNode` and carries out fragment specific morphs when means
  there are less steps required. Additional operations pertaining to snapshot manipulation is done outside
  the event loop.

  WHY NOT IDIOMORPH?

  Idiomorph is great, but it is noticably slower and cannot perform complex analysis with certainty. The
  morph-dom algorithm is how I wouldn've gone about writting out a diffing implementation if it didn't exist.
  Above all else, this algo is VERY VERY fast and can be more easily reasoned about with.

*/

export type MorphContext = {
  /**
   * Lookup Nodes
   */
  $lookup: Map<string, Element | ChildNode>;
  /**
   * Keyed Node removals
   */
  $remove: Set<string>;
}

/**
 * Create an element, optionally with a known namespace URI.
 *
 * @param {string} nodeName
 * The element name, e.g. 'div' or 'svg'
 *
 * @param {string} [namespaceURI]
 * The element's namespace URI, i.e. the value of its `xmlns` attribute or
 * its inferred namespace.
 */
const createElementNS = (nodeName: string, namespaceURI?: string): Element =>

  !namespaceURI || namespaceURI === 'http://www.w3.org/1999/xhtml'
    ? document.createElement(nodeName)
    : document.createElementNS(namespaceURI, nodeName);

/**
 * Returns true if two node's names are the same.
 *
 * **NOTE**
 *
 * We don't bother checking `namespaceURI` because you will never find
 * two HTML elements with the same nodeName and different namespace URIs.
 */
const matchName = (curNodeName: string, newNodeName: string): boolean => {

  if (curNodeName === newNodeName) return true;

  const curCodeStart = curNodeName.charCodeAt(0);
  const newCodeStart = newNodeName.charCodeAt(0);

  // If the target element is a virtual DOM node or SVG node then we may
  // need to normalize the tag name before comparing. Normal HTML elements that are
  // in the "http://www.w3.org/1999/xhtml" are converted to upper case
  return curCodeStart <= 90 && newCodeStart >= 97
    ? curNodeName === newNodeName.toUpperCase()
    : newCodeStart <= 90 && curCodeStart >= 97 ? newNodeName === curNodeName.toUpperCase() : false;

};

/**
 * Form element handling
 */
const formNodes = (curElement: Element, newElement: Element) => {

  switch (curElement.nodeName) {
    case 'INPUT':
      forms.input(
        curElement as HTMLInputElement,
        newElement as HTMLInputElement
      );
      break;
    case 'OPTION':
      forms.option(
        curElement as HTMLInputElement,
        newElement as HTMLOptionElement
      );
      break;
    case 'SELECT':
      forms.select(
        curElement as HTMLElement,
        newElement as HTMLElement
      );
      break;
    case 'TEXTAREA':
      forms.textarea(
        curElement as HTMLTextAreaElement,
        newElement as HTMLTextAreaElement
      );
      break;
  }

};

/**
 * Get default node key
 */
const getKey = (node: Element | ChildNode) =>

  node ? 'getAttribute' in node ? node.getAttribute('id') : undefined : undefined;

/**
 * Move Children
 *
 * Copies the children of one DOM element to another DOM element
 */
const moveChildren = (curElement: Element, newElement: Element) => {

  let firstChild: ChildNode = curElement.firstChild;
  let nextChild: ChildNode;

  while (firstChild) {
    nextChild = firstChild.nextSibling;
    newElement.appendChild(firstChild);
    firstChild = nextChild;
  }

  return newElement;

};

/**
 * Remove Node
 *
 * Discard a node from the DOM.
 */
const removeNode = (curNode: any, parentNode: Node, ctx: MorphContext, skipKeys = true): void => {

  // if (onBeforeNodeDiscarded(node) === false) return;

  observe.removeNode(curNode);

  parentNode && parentNode.removeChild(curNode);

  walkNodes(curNode, skipKeys, ctx);

};

const morphEqual = (curElement: Element) => {

  if (curElement.nodeType === Nodes.ELEMENT_NODE) {
    if (curElement.hasAttribute($.qs.$node)) {
      observe.readNode(curElement as HTMLElement);
    }
  }
};

/**
 * Morph Childrem
 *
 * Traversed and applies morphs to child nodes.
 */
const morphChildren = (curElement: Element, newElement: Element, ctx: MorphContext) => {

  let newNode = newElement.firstChild;
  let newKey: string;
  let newNextSibling: ChildNode;
  let curNode = curElement.firstChild;
  let curKey: string;
  let curNodeType: number;
  let curNextSibling: ChildNode;
  let curMatch: Element;

  // walk the newNode children
  outer: while (newNode) {

    newKey = getKey(newNode);
    newNextSibling = newNode.nextSibling;

    // walk the curNode children all the way through
    while (curNode) {

      curNextSibling = curNode.nextSibling;

      if (newNode.isEqualNode(curNode)) {
        // handle spx node occurence matches
        morphEqual(curNode as Element);
        newNode = newNextSibling;
        curNode = curNextSibling;
        continue outer;
      }

      curKey = getKey(curNode);
      curNodeType = curNode.nodeType;

      // this means if the curNode doesnt have a match with the newNode
      let isCompatible: boolean;

      if (curNodeType === newNode.nodeType) {
        if (curNodeType === Nodes.ELEMENT_NODE) {

          if (newKey) {

            // The target node has a key so we want to match it up with the correct
            // element in the original DOM tree.
            //
            if (newKey !== curKey) {

              // The current element in the original DOM tree does not have a matching key so
              // let's check our lookup to see if there is a matching element in the original DOM tree
              //
              if ((curMatch = ctx.$lookup.get(newKey) as Element)) {

                if (curNextSibling && curNextSibling.isEqualNode(curMatch)) {

                  // Special case for single element removals. To avoid removing the original
                  // DOM node out of the tree (since that can break CSS transitions, etc.),
                  // we will instead discard the current node and wait until the next
                  // iteration to properly match up the keyed target element with its matching
                  // element in the original tree
                  //
                  isCompatible = false;

                } else {

                  // We found a matching keyed element somewhere in the original DOM tree.
                  // Let's move the original DOM node into the current position and morph it.

                  // NOTE
                  //
                  // We use insertBefore instead of replaceChild because we want to go
                  // through the `removeNode()` function for the node that is being
                  // discarded so that all lifecycle hooks are correctly invoked
                  //
                  curElement.insertBefore(
                    curMatch,
                    curNode
                  );

                  // curNextSibling = curNode.nextSibling;

                  if (curKey) {

                    // Since the node is keyed it might be matched up later
                    // so we defer the actual removal to later
                    ctx.$remove.add(curKey);

                  } else {

                    // NOTE
                    //
                    // we skip nested keyed nodes from being removed since
                    // there is still a chance they will be matched up later
                    removeNode(
                      curNode,
                      curElement,
                      ctx
                    );

                  }

                  curNode = curMatch;
                  curKey = getKey(curNode);

                }
              } else {

                // The nodes are not compatible since the "to" node has a key and there
                // is no matching keyed node in the source tree
                isCompatible = false;

              }
            }

          } else if (curKey) {

            // The original node has a key
            isCompatible = false;

          }

          isCompatible = isCompatible !== false && matchName(
            curNode.nodeName,
            newNode.nodeName
          );

          if (isCompatible) {

            // We found compatible DOM elements so transform
            // the current "from" node to match the current target DOM node.
            morphElement(
              curNode as Element,
              newNode as Element,
              ctx
            );

          }

        } else if (curNodeType === Nodes.TEXT_NODE || curNodeType === Nodes.COMMENT_NODE) {

          // Both nodes being compared are Text or Comment nodes
          //
          isCompatible = true;

          // Simply update nodeValue on the original node to change the text value
          //
          if (curNode.nodeValue !== newNode.nodeValue) curNode.nodeValue = newNode.nodeValue;

        }
      }

      if (isCompatible) {

        // Advance both the "to" child and the "from" child since we found a match
        // Nothing else to do as we already recursively called morphChildren above
        newNode = newNextSibling;
        curNode = curNextSibling;

        continue outer;

      }

      // No compatible match so remove the old node from the DOM and continue trying to find a
      // match in the original DOM. However, we only do this if the from node is not keyed
      // since it is possible that a keyed node might match up with a node somewhere else in the
      // target tree and we don't want to discard it just yet since it still might find a
      // home in the final DOM tree. After everything is done we will remove any keyed nodes
      // that didn't find a home
      if (curKey) {

        // Since the node is keyed it might be matched up later so we defer
        // the actual removal to later
        ctx.$remove.add(curKey);

      } else {

        // NOTE: we skip nested keyed nodes from being removed since there is
        // still a chance they will be matched up later
        removeNode(
          curNode,
          curElement,
          ctx
        );

      }

      curNode = curNextSibling;

    } // END: while(curNode) {}

    // If we got this far then we did not find a candidate match for
    // our "to node" and we exhausted all of the children "from"
    // nodes. Therefore, we will just append the current "to" node to the end
    //
    if (
      newKey &&
      (curMatch = ctx.$lookup.get(newKey) as Element) && matchName(curMatch.nodeName, newNode.nodeName)) {

      curElement.appendChild(curMatch);
      morphElement(curMatch, newNode as Element, ctx);

    } else {

      // const onBeforeNodeAddedResult = onBeforeNodeAdded(newNode);
      // if (onBeforeNodeAddedResult !== false) {
      // if (onBeforeNodeAddedResult) newNode = onBeforeNodeAddedResult;

      // @ts-ignore
      if (newNode.actualize) newNode = newNode.actualize(curElement.ownerDocument || document);

      // APPEND CHILD
      //
      curElement.appendChild(newNode);

      // MORPH
      //
      // Original:  handleNodeAdded(curToNodeChild)
      //
      addedNode(newNode, ctx);

    }

    newNode = newNextSibling;
    curNode = curNextSibling;
  }

  cleanNode(
    curElement,
    curNode,
    curKey,
    ctx
  );

  formNodes(
    curElement,
    newElement
  );
};

/**
 * Morph Elements
 *
 * Applies morph to elements. Comparison is done via `isEqualNode` to determain changes.
 */
const morphElement = (curElement: any, newElement: Element, ctx: MorphContext) => {

  const newKey = getKey(newElement);

  // If an element with an ID is being morphed then it will be in the final
  // DOM so clear it out of the saved elements collection
  //
  newKey && ctx.$lookup.delete(newKey);

  if (curElement.isEqualNode(newElement)) return; // spec - https://dom.spec.whatwg.org/#concept-node-equals

  const morphAttr = curElement.getAttribute($.qs.$morph);

  // SPX Morph attribute handling
  //
  if (morphAttr === 'false') return;

  morphAttr !== 'children' && morphAttributes(curElement as HTMLElement, newElement as HTMLElement);

  // onElUpdated(curElement); // optional
  // if (onBeforeElChildrenUpdated(curElement, newElement) === false) return;

  curElement.nodeName === 'TEXTAREA'
    ? forms.textarea(curElement as HTMLTextAreaElement, newElement as HTMLTextAreaElement)
    : morphChildren(curElement, newElement, ctx);

};

/**
 * Walk Nodes
 *
 * Recusively traverse through the node node list.
 */
const walkNodes = (curNode: ChildNode, skipKeys: boolean, ctx: MorphContext) => {

  if (curNode.nodeType !== Nodes.ELEMENT_NODE) return;

  let curChild = curNode.firstChild as Element;

  while (curChild) {

    let key: string;

    if (skipKeys && (key = getKey(curChild))) {

      // If we are skipping keyed nodes then we add the key
      // to a list so that it can be handled at the very end.
      ctx.$remove.add(key);

    } else {

      // Only report the node as discarded if it is not keyed. We do this because
      // at the end we loop through all keyed elements that were unmatched
      // and then discard them in one final pass.

      observe.removeNode(curChild as HTMLElement); // onNodeDiscarded(curChild);
      curChild.firstChild && walkNodes(curChild, skipKeys, ctx);

    }

    curChild = curChild.nextSibling as Element;

  }

};

/**
 * Added Node
 *
 * A new node has been added to the DOM
 */
const addedNode = (curElement: Node, ctx: MorphContext) => {

  // Lets check our component observer to determine whether or
  // not this node is component related.
  (
    curElement.nodeType === Nodes.ELEMENT_NODE ||
    curElement.nodeType === Nodes.FRAGMENT_NODE
  ) && (
    observe.addedNode(curElement as HTMLElement)
  );

  let curChild = curElement.firstChild as Element;

  while (curChild) {

    const nextSibling = curChild.nextSibling;
    const curKey = getKey(curChild);

    if (curKey) {

      const unmatchElement = ctx.$lookup.get(curKey);

      // If we find a duplicate #id node in cache, replace `el` with cache value and morph it to the child node.
      if (unmatchElement && matchName(curChild.nodeName, unmatchElement.nodeName)) {

        curChild.parentNode.replaceChild(unmatchElement, curChild);
        morphElement(unmatchElement, curChild, ctx);

      } else {

        addedNode(curChild, ctx);

      }

    } else {

      // Recursively call for curChild and it's children to see if we find something
      //
      addedNode(curChild, ctx);

    }

    curChild = <Element>nextSibling;

  }
};

/**
 * Clean Nodes
 *
 * We have processed all of the "to nodes". If `curFromNodeChild` is non-null
 * then we still have some from nodes left over that need to be removed.
 */
const cleanNode = (curElement: Element, curNode: ChildNode, curKey: string, ctx: MorphContext) => {

  // We have processed all of the "to nodes". If curNode is
  // non-null then we still have some from nodes left over that need to be removed
  while (curNode) {

    const curNextSibling = curNode.nextSibling;

    if ((curKey = getKey(curNode))) {

      // Since the node is keyed it might be matched up later so we defer the actual removal to later
      ctx.$remove.add(curKey);

    } else {

      // NOTE: We skip nested keyed nodes from being removed since there is
      // still a chance they will be matched up later
      removeNode(curNode, curElement, ctx);

    }

    curNode = curNextSibling;

  }
};

const indexNode = (fromNode: Element | ChildNode, ctx: MorphContext) => {

  if (fromNode.nodeType === Nodes.ELEMENT_NODE || fromNode.nodeType === Nodes.FRAGMENT_NODE) {

    let childNode: Element | ChildNode = fromNode.firstChild;

    while (childNode) {

      const key = getKey(childNode);

      key && ctx.$lookup.set(key, childNode);

      // Walk recursively
      //
      indexNode(childNode, ctx);

      childNode = childNode.nextSibling;

    }

  }
};

export const morph = (curNode: HTMLElement, snapNode: HTMLElement) => {

  /**
   * New Node
   *
   * Clone the snapshot node, we will traverse a copy and update
   * the cache reference in final cycle
   */
  let newNode: HTMLElement = <HTMLElement>snapNode.cloneNode(true);

  /**
   * Morph Context
   *
   * Models used for the id (keyed) operations in post-cycle.
   */
  const ctx: MorphContext = o();

  ctx.$remove = s();
  ctx.$lookup = m();

  newNode.nodeType === Nodes.FRAGMENT_NODE && (newNode = newNode.firstElementChild as HTMLElement);

  indexNode(curNode, ctx);

  /**
   * Old Node references the last known `curNode`
   */
  let morphedNode: Element = curNode;

  /**
   * Old Node `NodeType` reference
   */
  const curNodeType = morphedNode.nodeType;

  /**
   * New Node `NodeType` Reference
   */
  const newNodeType = newNode.nodeType;

  if (curNodeType === Nodes.ELEMENT_NODE) {
    if (newNodeType === Nodes.ELEMENT_NODE) {

      if (!matchName(curNode.nodeName, newNode.nodeName)) {

        observe.removeNode(curNode); // onNodeDiscarded(curNode);

        morphedNode = moveChildren(
          curNode,
          createElementNS(newNode.nodeName, newNode.namespaceURI)
        );
      }

    } else {

      morphedNode = newNode;

    }

  } else if (curNodeType === Nodes.TEXT_NODE || curNodeType === Nodes.COMMENT_NODE) {

    if (newNodeType === curNodeType) {

      if (morphedNode.nodeValue !== newNode.nodeValue) {
        morphedNode.nodeValue = newNode.nodeValue;
      }

      return morphedNode;

    } else {

      morphedNode = newNode; // Text node to something else

    }
  }

  if (morphedNode.isEqualNode(newNode)) {

    // The "to node" was not compatible with the "from node" so we had to
    // toss out the "from node" and use the "to node"
    observe.removeNode(curNode); // onNodeDiscarded(curNode);

  } else {

    // We use isEqualNode instead of isSameNode because
    // no fucks are given in SPX about "this" scope of nodes
    //
    if (newNode.isEqualNode(morphedNode)) return morphedNode;

    morphElement(morphedNode, newNode, ctx);

    // We now need to loop over any keyed nodes that might need to be
    // removed. We only do the removal if we know that the keyed node
    // never found a match. When a keyed node is matched up we remove
    // it out of curNodesLookup and we use curNodesLookup to determine
    // if a keyed node has been matched up or not
    if (ctx.$remove.size > 0) {
      for (const key of ctx.$remove) {
        if (ctx.$lookup.has(key)) {
          const node = ctx.$lookup.get(key);
          removeNode(node, node.parentNode, ctx, false);
        }
      }
    }
  }

  if (morphedNode !== curNode && curNode.parentNode) {

    if (morphedNode.actualize) morphedNode = morphedNode.actualize(curNode.ownerDocument || document);

    // If we had to swap out the from node with a new node because the old
    // node was not compatible with the target node then we need to
    // replace the old DOM node in the original DOM tree. This is only
    // possible if the original DOM node was part of a DOM tree which
    // we know is the case if it has a parent node.
    curNode.parentNode.replaceChild(morphedNode, curNode);

  }

  ctx.$lookup.clear();
  ctx.$remove.clear();

  return morphedNode;
};
