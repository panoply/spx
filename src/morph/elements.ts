function booleanAttrProp (oldElement: Element, newElement: Element, name: string) {

  if (oldElement[name] !== newElement[name]) {
    oldElement[name] = newElement[name];
    if (oldElement[name]) {
      oldElement.setAttribute(name, '');
    } else {
      oldElement.removeAttribute(name);
    }
  }

}

/**
 * Handling of `<option>` element morphs
 */
export function OPTION (oldElement: Element, newElement: HTMLOptionElement) {

  let parentNode = oldElement.parentNode;

  if (parentNode) {

    let parentName = parentNode.nodeName.toUpperCase();

    if (parentName === 'OPTGROUP') {
      parentNode = parentNode.parentNode;
      parentName = parentNode && parentNode.nodeName.toUpperCase();
    }

    if (parentName === 'SELECT' && !(parentNode as Element).hasAttribute('multiple')) {

      if (oldElement.hasAttribute('selected') && !newElement.selected) {

        // Workaround for MS Edge bug where the 'selected' attribute can only be
        // removed if set to a non-empty value:
        // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12087679/

        oldElement.setAttribute('selected', 'selected');
        oldElement.removeAttribute('selected');

      }

      // We have to reset select element's selectedIndex to -1, otherwise setting
      // fromEl.selected using the booleanAttrProp below has no effect.
      // The correct selectedIndex will be set in the SELECT special handler below.
      (parentNode as HTMLSelectElement).selectedIndex = -1;

    }
  }

  booleanAttrProp(oldElement, newElement, 'selected');

}

/**
 * The "value" attribute is special for the `<input>` element since it sets
 * the initial value. Changing the "value" attribute without changing the
 * "value" property will have no effect since it is only used to the set the
 * initial value.
 *
 * Similar for the "checked" attribute, and "disabled".
 */
export function INPUT (oldElement: HTMLInputElement, newElement: HTMLInputElement) {

  booleanAttrProp(oldElement, newElement, 'checked');
  booleanAttrProp(oldElement, newElement, 'disabled');

  if (oldElement.value !== newElement.value) oldElement.value = newElement.value;
  if (!newElement.hasAttribute('value')) oldElement.removeAttribute('value');

}

/**
 * Handling of `<textarea>` element morphs
 */
export function TEXTAREA (oldElement: HTMLTextAreaElement, newElement: HTMLTextAreaElement) {

  const newValue = newElement.value;

  if (oldElement.value !== newValue) oldElement.value = newValue;

  const firstChild = oldElement.firstChild;

  if (firstChild) {
    // Needed for IE. Apparently IE sets the placeholder as the
    // node value and vise versa. This ignores an empty update.
    const oldValue = firstChild.nodeValue;

    if (oldValue === newValue || (!newValue && oldValue === oldElement.placeholder)) return;

    firstChild.nodeValue = newValue;

  }
}

/**
 * We have to loop through children of oldElement, not newElement since nodes can be moved
 * from newElement to oldElement directly when morphing.
 *
 * At the time this special handler is invoked, all children have already been morphed
 * and appended to / removed from oldElement, so using oldElement here is safe and correct.
 */
export function SELECT (oldElement: HTMLElement, newElement: HTMLElement) {

  if (!newElement.hasAttribute('multiple')) {

    let selectedIndex: number = -1;
    let i: number = 0;
    let curChild = oldElement.firstChild;
    let optgroup: HTMLOptGroupElement;
    let nodeName: string;

    while (curChild) {

      nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();

      if (nodeName === 'OPTGROUP') {

        optgroup = curChild as HTMLOptGroupElement;
        curChild = optgroup.firstChild;

      } else {

        if (nodeName === 'OPTION') {

          if ((curChild as Element).hasAttribute('selected')) {
            selectedIndex = i;
            break;
          }

          i++;

        }

        curChild = curChild.nextSibling;

        if (!curChild && optgroup) {
          curChild = optgroup.nextSibling;
          optgroup = null;
        }
      }
    }

    (oldElement as HTMLSelectElement).selectedIndex = selectedIndex;
  }
}
