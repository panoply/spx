/**
 * Walk Elements
 *
 * Walks the DOM and executes callback on all `Element` types (i.e, `4`).
 * We cannot `querySelector` attributes which SPX uses due to their syntactical patterns,
 * so we walk the DOM and cherry pick SPX Component specific directives.
 *
 * This function is will traverse the DOM and return Elements from which we analyze and
 * reason with to compose component scopes.
 */
export const walkElements = <T extends Element> (node: T, callback: (node: T) => any) => {

  const cb = callback(node);

  if (cb === false) return;

  // @ts-expect-error
  if (cb === 1) node = node.nextSibling;

  let e: Element;
  let i: number;

  if (node.firstElementChild) {
    i = 0;
    e = node.children[i];
  }

  while (e) {
    if (e) walkElements(e, callback);
    e = node.children[++i];
  }

};
