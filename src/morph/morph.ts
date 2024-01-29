import { Nodes } from '../shared/enums';
import { compareNodeNames, moveChildren, createElementNS, getNodeKey } from './utils';
import { onInputElement, onOptionElement, onSelectElement, onTextareaElement } from './forms';
import { morphAttributes } from './attributes';
import { $ } from '../app/session';
import { m, o } from '../shared/native';
import { addComponent, removeComponent } from '../components/observe';

export interface MorphContext {
  /**
   * Component `onLoad` callbacks to be invoked after morph completes
   */
  onLoad: Set<(()=> void)>;
  /**
   * Component IDs to invoke onExit
   */
  onExit: string[];
  /**
   * Lookup Nodes
   */
  lookup: Map<string, any>;
  /**
   * Keyed Node removals
   */
  remove: string[]
}

/**
 * Morph Childrem
 *
 * Traversed and applies morphs to child nodes.
 */
function morphChildren (oldElement: Element, newElement: Element, context: MorphContext) {

  let newNode = newElement.firstChild;
  let newNodeKey: string;
  let newNextSibling: ChildNode;
  let oldNode = oldElement.firstChild;
  let oldNodeKey: string;
  let oldNodeType: number;
  let oldNextSibling: ChildNode;
  let oldNodeMatch: Element;

  // walk the children
  outer: while (newNode) {

    newNextSibling = newNode.nextSibling;
    newNodeKey = getNodeKey(newNode);

    // walk the fromNode children all the way through
    while (oldNode) {

      oldNextSibling = oldNode.nextSibling;

      if (newNode.isSameNode && newNode.isSameNode(oldNode)) {
        newNode = newNextSibling;
        oldNode = oldNextSibling;
        continue outer;
      }

      oldNodeKey = getNodeKey(oldNode);
      oldNodeType = oldNode.nodeType;

      // this means if the oldNode doesnt have a match with the newNode
      let isCompatible: boolean;

      if (oldNodeType === newNode.nodeType) {
        if (oldNodeType === Nodes.ELEMENT_NODE) {

          // Both nodes being compared are Element nodes
          if (newNodeKey) {

            // The target node has a key so we want to match it up with the correct element in the original DOM tree
            if (newNodeKey !== oldNodeKey) {

              // The current element in the original DOM tree does not have a matching key so
              // let's check our lookup to see if there is a matching element in the original DOM tree
              if ((oldNodeMatch = context.lookup.get(newNodeKey))) {

                if (oldNextSibling === oldNodeMatch) {

                  // Special case for single element removals. To avoid removing the original
                  // DOM node out of the tree (since that can break CSS transitions, etc.),
                  // we will instead discard the current node and wait until the next
                  // iteration to properly match up the keyed target element with its matching
                  // element in the original tree
                  isCompatible = false;

                } else {

                  // We found a matching keyed element somewhere in the original DOM tree.
                  // Let's move the original DOM node into the current position and morph it.

                  // NOTE
                  //
                  // We use insertBefore instead of replaceChild because we want to go
                  // through the `removeNode()` function for the node that is being
                  // discarded so that all lifecycle hooks are correctly invoked
                  oldElement.insertBefore(oldNodeMatch, oldNode);

                  // oldNextSibling = oldNode.nextSibling;

                  if (oldNodeKey) {

                    // Since the node is keyed it might be matched up later
                    // so we defer the actual removal to later
                    context.remove.push(oldNodeKey);

                  } else {

                    // NOTE
                    //
                    // we skip nested keyed nodes from being removed since
                    // there is still a chance they will be matched up later
                    removeNode(oldNode as Element, oldElement, true, context);

                  }

                  oldNode = oldNodeMatch;
                  oldNodeKey = getNodeKey(oldNode);

                }
              } else {

                // The nodes are not compatible since the "to" node has a key and there
                // is no matching keyed node in the source tree
                isCompatible = false;

              }
            }

          } else if (oldNodeKey) {

            // The original has a key
            isCompatible = false;

          }

          if (isCompatible !== false) isCompatible = compareNodeNames(oldNode, newNode);

          // SPX PATCH
          //
          // ChildNodes morph preservation of attributes. When child dom nodes
          // contain a `spx-morph="children"` annotation then attributes will be
          // preserved on the parent node. This helps preserve dom state in stimulus
          // controllers and alike.
          if (
            isCompatible === false &&
            context.lookup.has(oldNodeKey) &&
            context.lookup.get(oldNodeKey).getAttribute($.qs.$morph) === 'children') {

            isCompatible = true;

          }

          if (isCompatible) {

            // We found compatible DOM elements so transform
            // the current "from" node to match the current
            // target DOM node. MORPH
            morphElements(oldNode as Element, newNode as Element, context);

          }

        } else if (oldNodeType === Nodes.TEXT_NODE || oldNodeType === Nodes.COMMENT_NODE) {

          // Both nodes being compared are Text or Comment nodes
          isCompatible = true;

          // Simply update nodeValue on the original node to change the text value
          if (oldNode.nodeValue !== newNode.nodeValue) oldNode.nodeValue = newNode.nodeValue;

        }
      }

      if (isCompatible) {

        // Advance both the "to" child and the "from" child since we found a match
        // Nothing else to do as we already recursively called morphChildren above
        newNode = newNextSibling;
        oldNode = oldNextSibling;

        continue outer;

      }

      // No compatible match so remove the old node from the DOM and continue trying to find a
      // match in the original DOM. However, we only do this if the from node is not keyed
      // since it is possible that a keyed node might match up with a node somewhere else in the
      // target tree and we don't want to discard it just yet since it still might find a
      // home in the final DOM tree. After everything is done we will remove any keyed nodes
      // that didn't find a home
      if (oldNodeKey) {

        // Since the node is keyed it might be matched up later so we defer
        // the actual removal to later
        context.remove.push(oldNodeKey);

      } else {
        // NOTE: we skip nested keyed nodes from being removed since there is
        // still a chance they will be matched up later
        removeNode(oldNode as Element, oldElement, true, context);
      }

      oldNode = oldNextSibling;

    } // END: while(oldNode) {}

    // If we got this far then we did not find a candidate match for
    // our "to node" and we exhausted all of the children "from"
    // nodes. Therefore, we will just append the current "to" node to the end
    if (
      newNodeKey &&
      (oldNodeMatch = context.lookup.get(newNodeKey)) &&
      compareNodeNames(oldNodeMatch, newNode as Element)
    ) {

      // MORPH
      //
      // Original: addChild(oldElement, oldNodeMatch);
      //
      oldElement.appendChild(oldNodeMatch);
      morphElements(oldNodeMatch, newNode as Element, context);

    } else {

      // const onBeforeNodeAddedResult = onBeforeNodeAdded(newNode);
      // if (onBeforeNodeAddedResult !== false) {
      // if (onBeforeNodeAddedResult) newNode = onBeforeNodeAddedResult;

      // @ts-ignore
      if (newNode.actualize) newNode = newNode.actualize(oldElement.ownerDocument || document);

      // MORPH
      //
      // Original: addChild(oldElement, newNode as Element);
      //
      oldElement.appendChild(newNode);
      addedNode(newNode as Element, context);

    }

    newNode = newNextSibling;
    oldNode = oldNextSibling;
  }

  cleanNode(oldElement, oldNode, oldNodeKey, context);

  switch (oldElement.nodeName) {
    case 'INPUT':
      onInputElement(
        oldElement as HTMLInputElement,
        newElement as HTMLInputElement
      );
      break;
    case 'OPTION':
      onOptionElement(
        oldElement as HTMLInputElement,
        newElement as HTMLOptionElement
      );
      break;
    case 'SELECT':
      onSelectElement(
        oldElement as HTMLElement,
        newElement as HTMLElement
      );
      break;
    case 'TEXTAREA':
      onTextareaElement(
        oldElement as HTMLTextAreaElement,
        newElement as HTMLTextAreaElement
      );
      break;
  }

}

/**
 * Morph Elements
 *
 * Applies morph to elements. Comparison is done via `isEqualNode` to determain changes.
 */
function morphElements (oldNode: Element, newNode: Element, context: MorphContext) {

  const newNodeKey = getNodeKey(newNode);

  // If an element with an ID is being morphed then it will be in the final
  // DOM so clear it out of the saved elements collection
  if (newNodeKey) context.lookup.delete(newNodeKey);

  if (oldNode.isEqualNode(newNode)) return; // spec - https://dom.spec.whatwg.org/#concept-node-equals

  const morphAttr = oldNode.getAttribute($.qs.$morph);

  if (morphAttr === 'false') return;
  if (morphAttr !== 'children') morphAttributes(oldNode, newNode);

  // onElUpdated(oldNode); // optional
  // if (onBeforeElChildrenUpdated(oldNode, newNode) === false) return;

  if (oldNode.nodeName !== 'TEXTAREA') {
    morphChildren(oldNode, newNode, context);
  } else {
    onTextareaElement(oldNode as HTMLTextAreaElement, newNode as HTMLTextAreaElement);
  }

}

/**
 * Walk Nodes
 *
 * Recusively traverse through the node node list. We will check for component
 * existences in this cycle.
 */
function walkNodes (node: ChildNode, skipKeyedNodes: boolean, context: MorphContext) {

  if (node.nodeType !== Nodes.ELEMENT_NODE) return;

  let curChild = node.firstChild;

  while (curChild) {

    let key: string;

    if (skipKeyedNodes && (key = getNodeKey(curChild))) {

      // If we are skipping keyed nodes then we add the key
      // to a list so that it can be handled at the very end.
      context.remove.push(key);

    } else {

      // Only report the node as discarded if it is not keyed. We do this because
      // at the end we loop through all keyed elements that were unmatched
      // and then discard them in one final pass.
      removeComponent(curChild as HTMLElement); // onNodeDiscarded(curChild);

      if (curChild.firstChild) walkNodes(curChild as Element, skipKeyedNodes, context);

    }

    curChild = curChild.nextSibling;

  }

}

/**
 * Added Node
 *
 * A new node has been added to the DOM
 */
function addedNode (el: Element, context: MorphContext) {

  // Lets check our component observer to determine whether or
  // not this node is component related.
  if (el.nodeType === Nodes.ELEMENT_NODE) addComponent(el as HTMLElement); // onNodeAdded(el);

  let curChild = el.firstChild as Element;

  while (curChild) {

    const nextSibling = curChild.nextSibling;
    const key = getNodeKey(curChild);

    if (key) {

      const unmatchedFromEl = context.lookup.get(key);

      // If we find a duplicate #id node in cache, replace `el` with cache  value and morph it to the child node.
      if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
        curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
        morphElements(unmatchedFromEl, curChild, context);
      } else {
        addedNode(curChild, context);
      }

    } else {
      // Recursively call for curChild and it's children to see if we find something in fromNodesLookup
      addedNode(curChild, context);
    }

    curChild = nextSibling as Element;

  }
}

/**
 * Remove Node
 *
 * Discard a node from the DOM.
 */
function removeNode (node: Element, parentNode: Element, skipKeyedNodes: boolean, context: MorphContext): void {

  // if (onBeforeNodeDiscarded(node) === false) return;
  if (parentNode) parentNode.removeChild(node);
  removeComponent(node as HTMLElement);
  walkNodes(node, skipKeyedNodes, context);

}

/**
 * Clean Nodes
 *
 * We have processed all of the "to nodes". If `curFromNodeChild` is non-null
 * then we still have some from nodes left over that need to be removed.
 */
function cleanNode (oldNode: Element, curFromNodeChild: ChildNode, oldNodeKey: string, context: MorphContext) {

  // We have processed all of the "to nodes". If curFromNodeChild is
  // non-null then we still have some from nodes left over that need to be removed
  while (curFromNodeChild) {

    const oldNextSibling = curFromNodeChild.nextSibling;

    if ((oldNodeKey = getNodeKey(curFromNodeChild))) {

      // Since the node is keyed it might be matched up later so we defer the actual removal to later
      context.remove.push(oldNodeKey);

    } else {

      // NOTE: We skip nested keyed nodes from being removed since there is
      // still a chance they will be matched up later
      removeNode(curFromNodeChild as Element, oldNode, true, context);

    }

    curFromNodeChild = oldNextSibling;
    oldNodeKey = getNodeKey(curFromNodeChild);
  }
}

function indexNode (node: Element, context: MorphContext) {

  if (node.nodeType === Nodes.ELEMENT_NODE || node.nodeType === Nodes.FRAGMENT_NODE) {

    let curChild = node.firstChild;

    while (curChild) {

      const key = getNodeKey(curChild);

      if (key) context.lookup.set(key, curChild);

      // Walk recursively
      //
      indexNode(curChild as Element, context);

      curChild = curChild.nextSibling;

    }
  }

}

export function morph (oldNode: HTMLElement, newNode: HTMLElement) {

  if (newNode.nodeType === Nodes.FRAGMENT_NODE) newNode = newNode.firstElementChild as HTMLElement;

  const context: MorphContext = o({
    remove: [],
    lookup: m()
  });

  indexNode(oldNode, context);

  /**
   * Old Node references the last known `oldNode`
   */
  let morphedNode: Element = oldNode;

  /**
   * Old Node `NodeType` reference
   */
  const oldNodeType = morphedNode.nodeType;

  /**
   * New Node `NodeType` Reference
   */
  const newNodeType = newNode.nodeType;

  if (oldNodeType === Nodes.ELEMENT_NODE) {
    if (newNodeType === Nodes.ELEMENT_NODE) {
      if (!compareNodeNames(oldNode, newNode)) {
        removeComponent(oldNode);
        morphedNode = moveChildren(oldNode, createElementNS(newNode.nodeName, newNode.namespaceURI));
      }
    } else {
      morphedNode = newNode;
    }
  } else if (oldNodeType === Nodes.TEXT_NODE || oldNodeType === Nodes.COMMENT_NODE) {
    if (newNodeType === oldNodeType) {
      if (morphedNode.nodeValue !== newNode.nodeValue) morphedNode.nodeValue = newNode.nodeValue;
      return morphedNode;
    } else {
      morphedNode = newNode; // Text node to something else
    }
  }

  if (morphedNode === newNode) {

    // The "to node" was not compatible with the "from node" so we had to
    // toss out the "from node" and use the "to node"
    removeComponent(oldNode); // onNodeDiscarded(oldNode);

  } else {

    if (newNode.isSameNode && newNode.isSameNode(morphedNode)) return;

    morphElements(morphedNode, newNode, context);

    // We now need to loop over any keyed nodes that might need to be
    // removed. We only do the removal if we know that the keyed node
    // never found a match. When a keyed node is matched up we remove
    // it out of fromNodesLookup and we use fromNodesLookup to determine
    // if a keyed node has been matched up or not
    if (context.remove) {
      for (const key of context.remove) {
        const elRemove = context.lookup.get(key);
        if (elRemove) removeNode(elRemove, elRemove.parentNode, false, context);
      }
    }
  }

  if (morphedNode !== oldNode && oldNode.parentNode) {

    // @ts-ignore
    if (morphedNode.actualize) morphedNode = morphedNode.actualize(oldNode.ownerDocument || document);

    // If we had to swap out the from node with a new node because the old
    // node was not compatible with the target node then we need to
    // replace the old DOM node in the original DOM tree. This is only
    // possible if the original DOM node was part of a DOM tree which
    // we know is the case if it has a parent node.
    oldNode.parentNode.replaceChild(morphedNode, oldNode);

  }

  //  context.lookup.clear();

  return morphedNode;
}
