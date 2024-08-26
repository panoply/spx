import { setBooleanAttribute } from './attributes';

/**
 * Handling of `<option>` element morphs
 */
export const option = (curElement: Element, newElement: HTMLOptionElement) => {

  let parentNode = curElement.parentNode;

  if (parentNode) {

    let parentName = parentNode.nodeName.toUpperCase();

    if (parentName === 'OPTGROUP') {
      parentNode = parentNode.parentNode;
      parentName = parentNode && parentNode.nodeName.toUpperCase();
    }

    if (parentName === 'SELECT' && !(parentNode as Element).hasAttribute('multiple')) {

      if (curElement.hasAttribute('selected') && !newElement.selected) {

        // Workaround for MS Edge bug where the 'selected' attribute can only be
        // removed if set to a non-empty value:
        // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12087679/
        //
        curElement.setAttribute('selected', 'selected');
        curElement.removeAttribute('selected');

      }

      // We have to reset select element's selectedIndex to -1, otherwise setting
      // fromEl.selected using the setBooleanAttribute below has no effect.
      // The correct selectedIndex will be set in the SELECT special handler below.
      (parentNode as HTMLSelectElement).selectedIndex = -1;

    }
  }

  setBooleanAttribute(curElement, newElement, 'selected');

};

/**
 * The "value" attribute is special for the `<input>` element since it sets
 * the initial value. Changing the "value" attribute without changing the "value"
 * property will have no effect since it is only used to the set the initial value.
 *
 * Similar for the "checked" attribute, and "disabled".
 */
export const input = (curElement: HTMLInputElement, newElement: HTMLInputElement) => {

  setBooleanAttribute(curElement, newElement, 'checked');
  setBooleanAttribute(curElement, newElement, 'disabled');

  if (curElement.value !== newElement.value) curElement.value = newElement.value;
  if (!newElement.hasAttribute('value')) curElement.removeAttribute('value');

};

/**
 * Handling of `<textarea>` element morphs
 */
export const textarea = (curElement: HTMLTextAreaElement, newElement: HTMLTextAreaElement) => {

  const { value } = newElement;

  if (curElement.value !== value) curElement.value = value;

  const { firstChild } = curElement;

  if (firstChild) {

    // Needed for IE. Apparently IE sets the placeholder as the
    // node value and vise versa. This ignores an empty update.
    const { nodeValue } = firstChild;

    if (nodeValue === value || (!value && nodeValue === curElement.placeholder)) return;

    firstChild.nodeValue = value;

  }
};

/**
 * We have to loop through children of curElement, not newElement since nodes can be moved
 * from newElement to curElement directly when morphing.
 *
 * At the time this special handler is invoked, all children have already been morphed
 * and appended to / removed from curElement, so using curElement here is safe and correct.
 */
export const select = (curElement: HTMLElement, newElement: HTMLElement) => {

  if (!newElement.hasAttribute('multiple')) {

    let i: number = 0;
    let selectedIndex: number = -1;
    let curChild = curElement.firstElementChild;
    let optgroup: HTMLOptGroupElement;
    let nodeName: string;

    while (curChild) {

      nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();

      if (nodeName === 'OPTGROUP') {

        optgroup = curChild as HTMLOptGroupElement;
        curChild = optgroup.firstElementChild;

      } else {

        if (nodeName === 'OPTION') {

          if (curChild.hasAttribute('selected')) {
            selectedIndex = i;
            break;
          }

          i++;

        }

        curChild = curChild.nextElementSibling;

        if (!curChild && optgroup) {
          curChild = optgroup.nextElementSibling;
          optgroup = null;
        }
      }
    }

    (curElement as HTMLSelectElement).selectedIndex = selectedIndex;

  }
};
