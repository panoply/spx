import { Nodes } from '../src/shared/enums';
import { compareNodeNames, moveChildren, createElementNS, getNodeKey } from '../src/morph/utils';
import { onInputElement, onOptionElement, onSelectElement, onTextareaElement } from '../src/morph/forms';
import { morphAttributes } from '../src/morph/attributes';
import { $ } from '../src/app/session';
import { forEach } from '../src/shared/utils';

export function morph (oldNode: Element, newNode: Element, components: { added: any[], removed: any[] }) {

  if (newNode.nodeType === Nodes.FRAGMENT_NODE) newNode = newNode.firstElementChild;

  // const onNodeAdded = noop;
  // const onBeforeNodeDiscarded = noop;
  // const onNodeDiscarded = noop;
  // const onBeforeElChildrenUpdated = noop;

  // This object is used as a lookup to quickly find all keyed elements in the original DOM tree.
  //
  const fromNodesLookup: Map<string, any> = new Map(); // { [key: string]: any } = object(null);
  const keyedRemovalList: string[] = [];

  /* -------------------------------------------- */
  /* MORPHS                                       */
  /* -------------------------------------------- */

  function onComponentRemoved (node: Element) {

    if (node.nodeType !== Nodes.ELEMENT_NODE) return;
    if (node.hasAttribute($.qs.$component) && $.components.connected.has(node as HTMLElement)) {
      components.removed.push(...$.components.connected.get(node as HTMLElement));
    }

  }

  function onComponentAdded (node: Element) {

    if (node.nodeType === Nodes.ELEMENT_NODE) {
      if (node.hasAttribute($.qs.$component)) {
        components.added.push(node);
      }
    }
  }

  function doElementClean (oldElement: Element, curFromNodeChild: ChildNode, curFromNodeKey: string) {

    // We have processed all of the "to nodes". If curFromNodeChild is
    // non-null then we still have some from nodes left over that need to be removed
    while (curFromNodeChild) {

      const fromNextSibling = curFromNodeChild.nextSibling;

      if ((curFromNodeKey = getNodeKey(curFromNodeChild))) {

        // Since the node is keyed it might be matched up later so we defer the actual removal to later
        keyedRemovalList.push(curFromNodeKey);

      } else {

        // NOTE: We skip nested keyed nodes from being removed since there is
        // still a chance they will be matched up later
        removeNode(curFromNodeChild as Element, oldElement, true /* skip keyed nodes */);

      }

      curFromNodeChild = fromNextSibling;
      curFromNodeKey = getNodeKey(curFromNodeChild);
    }
  }

  function doElementMorph (oldElement: Element, newElement: Element) {

    const toElKey = getNodeKey(newElement);

    // If an element with an ID is being morphed then it will be in the final
    // DOM so clear it out of the saved elements collection
    if (toElKey) fromNodesLookup.delete(toElKey);

    // spec - https://dom.spec.whatwg.org/#concept-node-equals
    if (oldElement.isEqualNode(newElement)) return;
    if (oldElement.getAttribute($.qs.$morph) === 'false') return;

    // update attributes on original DOM element first
    // TODO: Rename this attribute to something more fitting
    if (oldElement.getAttribute($.qs.$morph) !== 'children') {
      morphAttributes(oldElement, newElement);
    }

    // onElUpdated(oldElement); // optional
    // if (onBeforeElChildrenUpdated(oldElement, newElement) === false) return;

    if (oldElement.nodeName !== 'TEXTAREA') {
      doChildrenMorph(oldElement, newElement);
    } else {
      onTextareaElement(oldElement as HTMLTextAreaElement, newElement as HTMLTextAreaElement);
    }

  }

  function doChildrenMorph (oldElement: Element, newElement: Element) {

    let curToNodeChild = newElement.firstChild;
    let curFromNodeChild = oldElement.firstChild;
    let curToNodeKey: string;
    let curFromNodeKey: string;
    let curFromNodeType: number;
    let fromNextSibling: ChildNode;
    let toNextSibling: ChildNode;
    let matchingFromEl: Element;

    // walk the children
    outer: while (curToNodeChild) {

      toNextSibling = curToNodeChild.nextSibling;
      curToNodeKey = getNodeKey(curToNodeChild);

      // walk the fromNode children all the way through
      while (curFromNodeChild) {

        fromNextSibling = curFromNodeChild.nextSibling;

        if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
          curToNodeChild = toNextSibling;
          curFromNodeChild = fromNextSibling;
          continue outer;
        }

        curFromNodeKey = getNodeKey(curFromNodeChild);
        curFromNodeType = curFromNodeChild.nodeType;

        // this means if the curFromNodeChild doesnt have a match with the curToNodeChild
        let isCompatible: boolean;

        if (curFromNodeType === curToNodeChild.nodeType) {
          if (curFromNodeType === Nodes.ELEMENT_NODE) {

            // Both nodes being compared are Element nodes
            if (curToNodeKey) {

              // The target node has a key so we want to match it up with the correct element
              // in the original DOM tree
              if (curToNodeKey !== curFromNodeKey) {

                // The current element in the original DOM tree does not have a matching key so
                // let's check our lookup to see if there is a matching element in the original DOM tree
                if ((matchingFromEl = fromNodesLookup.get(curToNodeKey))) {

                  if (fromNextSibling === matchingFromEl) {

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
                    oldElement.insertBefore(matchingFromEl, curFromNodeChild);

                    // fromNextSibling = curFromNodeChild.nextSibling;

                    if (curFromNodeKey) {

                      // Since the node is keyed it might be matched up later
                      // so we defer the actual removal to later
                      keyedRemovalList.push(curFromNodeKey);

                    } else {

                      // NOTE
                      //
                      // we skip nested keyed nodes from being removed since
                      // there is still a chance they will be matched up later
                      removeNode(curFromNodeChild as Element, oldElement, true);

                    }

                    curFromNodeChild = matchingFromEl;
                    curFromNodeKey = getNodeKey(curFromNodeChild);

                  }
                } else {

                  // The nodes are not compatible since the "to" node has a key and there
                  // is no matching keyed node in the source tree
                  isCompatible = false;

                }
              }

            } else if (curFromNodeKey) {

              // The original has a key
              isCompatible = false;
            }

            if (isCompatible !== false) {
              isCompatible = compareNodeNames(curFromNodeChild as Element, curToNodeChild as Element);
            };

            // SPX PATCH
            //
            // ChildNodes morph preservation of attributes. When child dom nodes
            // contain a `spx-morph="children"` annotation then attributes will be
            // preserved on the parent node. This helps preserve dom state in stimulus
            // controllers and alike.
            if (
              isCompatible === false &&
              fromNodesLookup.has(curFromNodeKey) &&
              fromNodesLookup.get(curFromNodeKey).getAttribute($.qs.$morph) === 'children') {

              isCompatible = true;

            }

            if (isCompatible) {

              // We found compatible DOM elements so transform
              // the current "from" node to match the current
              // target DOM node. MORPH
              doElementMorph(curFromNodeChild as Element, curToNodeChild as Element);

            }

          } else if (curFromNodeType === Nodes.TEXT_NODE || curFromNodeType === Nodes.COMMENT_NODE) {

            // Both nodes being compared are Text or Comment nodes
            isCompatible = true;

            // Simply update nodeValue on the original node to
            // change the text value
            if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
              curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
            }

          }
        }

        if (isCompatible) {

          // Advance both the "to" child and the "from" child since we found a match
          // Nothing else to do as we already recursively called doChildrenMorph above
          curToNodeChild = toNextSibling;
          curFromNodeChild = fromNextSibling;

          continue outer;

        }

        // No compatible match so remove the old node from the DOM and continue trying to find a
        // match in the original DOM. However, we only do this if the from node is not keyed
        // since it is possible that a keyed node might match up with a node somewhere else in the
        // target tree and we don't want to discard it just yet since it still might find a
        // home in the final DOM tree. After everything is done we will remove any keyed nodes
        // that didn't find a home
        if (curFromNodeKey) {

          // Since the node is keyed it might be matched up later so we defer
          // the actual removal to later
          keyedRemovalList.push(curFromNodeKey);

        } else {
          // NOTE: we skip nested keyed nodes from being removed since there is
          // still a chance they will be matched up later
          removeNode(curFromNodeChild as Element, oldElement, true /* skip keyed nodes */);
        }

        curFromNodeChild = fromNextSibling;

      } // END: while(curFromNodeChild) {}

      // If we got this far then we did not find a candidate match for
      // our "to node" and we exhausted all of the children "from"
      // nodes. Therefore, we will just append the current "to" node to the end
      if (
        curToNodeKey &&
        (matchingFromEl = fromNodesLookup.get(curToNodeKey)) &&
        compareNodeNames(matchingFromEl, curToNodeChild as Element)
      ) {

        // MORPH
        //
        // Original: addChild(oldElement, matchingFromEl);
        //
        oldElement.appendChild(matchingFromEl);
        doElementMorph(matchingFromEl, curToNodeChild as Element);

      } else {

        // const onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
        // if (onBeforeNodeAddedResult !== false) {
        // if (onBeforeNodeAddedResult) curToNodeChild = onBeforeNodeAddedResult;

        // @ts-ignore
        if (curToNodeChild.actualize) curToNodeChild = curToNodeChild.actualize(oldElement.ownerDocument || document);

        // MORPH
        //
        // Original: addChild(oldElement, curToNodeChild as Element);
        //
        oldElement.appendChild(curToNodeChild);
        addedNode(curToNodeChild as Element);

      }

      curToNodeChild = toNextSibling;
      curFromNodeChild = fromNextSibling;
    }

    doElementClean(oldElement, curFromNodeChild, curFromNodeKey);

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

  /* -------------------------------------------- */
  /* NODE ACTIONS                                 */
  /* -------------------------------------------- */

  /**
   * Removes a DOM node out of the original DOM
   *
   * @param {Node} node
   * The node to remove
   *
   * @param {Node} parentNode
   * The nodes parent
   *
   * @param {Boolean} skipKeyedNodes
   * If true then elements with keys will be skipped and not discarded.
   */
  function removeNode (node: Element, parentNode: Element, skipKeyedNodes: boolean): void {

    // if (onBeforeNodeDiscarded(node) === false) return;
    if (parentNode) parentNode.removeChild(node);

    //  onNodeDiscarded(node);

    onComponentRemoved(node);

    walkNodes(node, skipKeyedNodes);

  }

  function walkNodes (node: ChildNode, skipKeyedNodes: boolean) {

    if (node.nodeType !== Nodes.ELEMENT_NODE) return;

    let curChild = node.firstChild;

    while (curChild) {

      let key: string;

      if (skipKeyedNodes && (key = getNodeKey(curChild))) {

        // If we are skipping keyed nodes then we add the key
        // to a list so that it can be handled at the very end.
        keyedRemovalList.push(key);

      } else {

        // Only report the node as discarded if it is not keyed. We do this because
        // at the end we loop through all keyed elements that were unmatched
        // and then discard them in one final pass.
        // onNodeDiscarded(curChild);
        onComponentRemoved(curChild as Element);

        if (curChild.firstChild) walkNodes(curChild as Element, skipKeyedNodes);

      }

      curChild = curChild.nextSibling;

    }

  }

  function addedNode (el: Element) {

    // onNodeAdded(el);
    onComponentAdded(el);

    let curChild = el.firstChild as Element;

    while (curChild) {

      const nextSibling = curChild.nextSibling;
      const key = getNodeKey(curChild);

      if (key) {

        const unmatchedFromEl = fromNodesLookup.get(key);

        // if we find a duplicate #id node in cache, replace `el` with cache
        // value and morph it to the child node.
        if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {

          curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
          doElementMorph(unmatchedFromEl, curChild);

        } else {
          addedNode(curChild);
        }

      } else {

        // recursively call for curChild and it's children to see if we
        // find something in fromNodesLookup
        addedNode(curChild);
      }

      curChild = nextSibling as Element;

    }
  }

  (function indexNode (node: Element) {

    if (node.nodeType === Nodes.ELEMENT_NODE || node.nodeType === Nodes.FRAGMENT_NODE) {

      let curChild = node.firstChild;

      while (curChild) {

        const key = getNodeKey(curChild);

        if (key) fromNodesLookup.set(key, curChild);

        // Walk recursively
        //
        indexNode(curChild as Element);

        curChild = curChild.nextSibling;

      }
    }

  }(oldNode));

  /* -------------------------------------------- */
  /* BEGIN                                        */
  /* -------------------------------------------- */

  /**
   * Old Node references the last known `oldNode`
   */
  let morphedNode = oldNode;

  /**
   * Old Node `NodeType` reference
   */
  const morphedNodeType = morphedNode.nodeType;

  /**
   * New Node `NodeType` Reference
   */
  const toNodeType = newNode.nodeType;

  if (morphedNodeType === Nodes.ELEMENT_NODE) {

    if (toNodeType === Nodes.ELEMENT_NODE) {

      if (!compareNodeNames(oldNode, newNode)) {
        onComponentRemoved(oldNode);
        morphedNode = moveChildren(oldNode, createElementNS(newNode.nodeName, newNode.namespaceURI));
      }

    } else {

      morphedNode = newNode;

    }

  } else if (morphedNodeType === Nodes.TEXT_NODE || morphedNodeType === Nodes.COMMENT_NODE) {

    // Text or comment node
    if (toNodeType === morphedNodeType) {

      if (morphedNode.nodeValue !== newNode.nodeValue) morphedNode.nodeValue = newNode.nodeValue;

      return morphedNode;

    } else {

      morphedNode = newNode; // Text node to something else

    }
  }

  if (morphedNode === newNode) {

    // The "to node" was not compatible with the "from node" so we had to
    // toss out the "from node" and use the "to node"
    // onNodeDiscarded(oldNode);
    onComponentRemoved(oldNode);

  } else {

    if (newNode.isSameNode && newNode.isSameNode(morphedNode)) return;

    doElementMorph(morphedNode, newNode);

    // We now need to loop over any keyed nodes that might need to be
    // removed. We only do the removal if we know that the keyed node
    // never found a match. When a keyed node is matched up we remove
    // it out of fromNodesLookup and we use fromNodesLookup to determine
    // if a keyed node has been matched up or not
    if (keyedRemovalList) {
      forEach((key) => {
        const elRemove = fromNodesLookup.get(key);
        if (elRemove) removeNode(elRemove, elRemove.parentNode, false);
      }, keyedRemovalList);
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

  return morphedNode;

};