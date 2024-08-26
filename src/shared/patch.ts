import { $ } from '../app/session';

/**
 * Monkey Patch `setAttribute`
 *
 * **Lifted from the alpine.js morph algorithm.**
 *
 * Ensures the native `setAttribute` wont throw when applying event attribute morphs
 * and attribute name is event type containing `@` symbols. The standard Element.setAttribute
 * method does not support this, thus this patch makes it possible by executing a dummy
 * clone of sorts.
 *
 * @see https://t.ly/u4U8W
 */
export const patchSetAttribute = () => {

  if ($.patched) return;

  $.patched = true;

  const n = Element.prototype.setAttribute;
  const e = document.createElement('i');

  Element.prototype.setAttribute = function setAttribute (name, value) {

    if (name.indexOf('@') < 0) return n.call(this, name, value);

    e.innerHTML = `<i ${name}="${value}"></i>`;

    const attr = e.firstElementChild.getAttributeNode(name);

    e.firstElementChild.removeAttributeNode(attr);

    this.setAttributeNode(attr);

  };

};
