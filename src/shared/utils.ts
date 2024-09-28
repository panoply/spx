import type { Page, LiteralUnion } from 'types';
import { $ } from '../app/session';
import { CharCode } from './enums';
import { b, nil, s } from './native';
import * as log from '../shared/logs';
import { CharEntities } from './regexp';
import { Entities, Identifiers } from './const';

/**
 * Synchronous forEach iterator wrapper. Provides curried support.
 * It's using the `for` iterator which is best for records under
 * 1000 (which is the standard for this library).
 *
 * **Features**
 *
 * 1. Cancel the loop by returning `false` in the callback
 * 2. Returns the last known return value from the callback
 * 3. Can be curried
 */
export function forEach <T, R = any> (
  cb: (item: T, index?: number, array?: T[]) => R,
  array?: Array<T>
): R | ((array: T[]) => R) {

  // curried expression
  if (arguments.length === 1) return (a: Array<T>) => forEach(cb, a) as any;

  const s = array.length;

  // Ensure we can iterate the list
  if (s === 0) return;

  // Loop over the items in the array

  // eslint-disable-next-line one-var
  let r: R, i = -1;

  while (++i < s) {
    r = cb(array[i], i, array);
    if (r === false) break;
  }

  return r;

}

/**
 * Get the fragment Selector and teturns the query selector reference
 */
export const qsTarget = (targets: string[], suffix = `,[${$.qs.$target}]`) =>
  targets.length === 0
    ? $.config.fragments.join(',') + suffix
    : targets.join() + suffix;

/**
 * Get SPX Selector and teturns an element selector for SPX Component node morphs
 */
export const qsNode = (node: HTMLElement, key: string, value: string) =>
  `${node.nodeName.toLowerCase()}[${key}*=${escSelector(value)}]`;

/**
 * Split Attribute Array Value. Some SPX attribute value accept array pattern
 * structures. This function will remove characters the following characters if detected:
 *
 * - `[`
 * - `]`
 * - `'`
 * - `"`
 *
 * The provided `input` string will be split and return an array list of strings.
 */
export const splitAttrArrayValue = (input: string) => {

  /** v = value */
  let v: string = input
    .replace(/\s+,/g, ',')
    .replace(/,\s+/g, ',')
    .replace(/['"]/g, '');

  // Value might be an attribute selector within an array
  // let's quickly determine, pattern would be: spx-target="[[data-foo]]"
  //
  // If the pattern does not match, we will look for a comma separator
  // contained within the value, if one is found, it infers that the
  // value is an data attribute selector.
  //
  if (v.charCodeAt(0) === CharCode.LSB && (/^\[\s*\[/.test(v) || (/,/.test(v) && /\]$/.test(v)))) {
    v = v.replace(/^\[/, '').replace(/\]$/, '');
  }

  return v.split(/,|\|/);

};

/**
 * Parses attribute values as JSON. Supports both Array or Object types
 * and does not require quotations to be applied. Fixes newlines in strings
 * and ensure the structure can be parsed.
 */
export const attrJSON = (attr: string, string?: string) => {

  try {

    const json = (string || attr)
      .replace(/\\'|'/g, m => m[0] === '\\' ? m : '"')
      .replace(/"(?:\\.|[^"])*"/g, m => m.replace(/\n/g, '\\n'))
      .replace(/\[|[^[\]]*|\]/g
        , m => /[[\]]/.test(m) ? m : m.split(',').map(value => value
          .replace(/^(\w+)$/, '"$1"')
          .replace(/^"([\d.]+)"$/g, '$1')).join(','))
      .replace(/([a-zA-Z0-9_-]+)\s*:/g, '"$1":')
      .replace(/:\s*([$\w-]+)\s*([,\]}])/g, ':"$1"$2')
      .replace(/,(\s*[\]}])/g, '$1')
      .replace(/([a-zA-Z_-]+)\s*,/g, '"$1",')
      .replace(/([\]},\s]+)?"(true|false)"([\s,{}\]]+)/g, '$1$2$3');

    return JSON.parse(json);

  } catch (e) {

    log.error('Invalid JSON in attribute value: ' + JSON.stringify(attr || string, null, 2), e);

    return string;

  }

};

/**
 * Last Index
 *
 * Returns the last entry of an array list
 */
export const last = < T extends any[]> (input: T): T[number] => input[input.length - 1];

/**
 * Equalizes Whitespace in a string. Strips out extraneous whitespaces
 * and newlines, returns a single whitespace seprated result.
 */
export const equalizeWS = (input: string) => input.replace(/\s+/g, ' ').trim();

/**
 * Get SPX Selector and returns an element selector for SPX Component node morphs
 */
export const escSelector = (input: string) => input.replace(/\./g, '\\.').replace(/@/g, '\\@').replace(/:/g, '\\:');

/**
 *Resolves a promise outside the of the event loop.
 */
export const onNextTickResolve = () => new Promise<void>(resolve => setTimeout(() => resolve(), 1));

/**
 * Executes the provided `callback()` parameter outside of the event loop.
 */
export const onNextTick = (cb: () => void, timeout = 1, bind?: any) => setTimeout(() => bind
  ? cb.bind(bind)()
  : cb(), timeout);

/**
 * Returns `Promise.resolve()` and used to ensure async actions conclude
 * before next operation begins.
 */
export const promiseResolve = () => Promise.resolve();

/**
 * Slices a HTML tag opening region, e.g: `<script>`
 */
export const tagOpener = (script: string) => script.slice(0, script.indexOf('>', 1) + 1);

/**
 * Checks whether or not the element can be evaluated. This is used during head
 * morphs and consults the {@link $.qs} selectors as per configuration options.
 */
export const canEval = (element: Element) => {

  switch (element.nodeName) {
    case 'SCRIPT': return element.matches($.qs.$script);
    case 'STYLE': return element.matches($.qs.$script);
    case 'META': return element.matches($.qs.$meta);
    case 'LINK': return element.matches($.qs.$link);
    default: return element.getAttribute($.qs.$eval) !== 'false';
  }

};

/**
 * Resolves a Promise after the provided `timeout` has finished.
 */
export const delay = (timeout: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), timeout));

/**
 * Used to ensure entries are correctly handled
 */
export const decodeEntities = (input: string): string => input.replace(CharEntities, m => Entities[m] || m);

/**
 * Returns the current time value in milliseconds
 */
export const ts = () => new Date().getTime();

/**
 * Performs a strict analysis for the existence of properties contained
 * on an object. Returns a function which accepts either an array or string
 * property reference.
 */
export const hasProps = <T extends object> (object: T) => {

  const typeOf = typeof object === 'object';

  return <S extends keyof T, A extends Array<S>, P extends S | A> (property: P) =>
    typeOf ? !property ? false : typeof property === 'string'
      ? property in object
      : (<string[]>property).every(p => p ? p in object : false) : false;

};

/**
 * Used to validate the `null` prototype objects used in the module.
 */
export const hasProp = <T extends object> (object: T, property: keyof T | string | number) =>
  typeof object === 'object'
    ? property in object
    : false;

/**
 * Converts Type Constructor values to default types. This is used to setup
 * component state references
 */
export const setStateDefaults = (value: any) => {

  switch (value) {
    case String: return '';
    case Boolean: return false;
    case Number: return 0;
    case Object: return {};
    case Array: return [];
    default: return value;
  }

};

/**
 * Creates a getter on an object and be used to redefine a getter.
 * The `configurable` parameter when undefined signals a refine operation,
 * wherein the function resets the getter.
 *
 * Redefine can only apply when the property was set to `configurable` otherwise it will fail.
 */
export const defineGetter = <T extends object> (
  object: T,
  name: undefined | LiteralUnion<keyof T, string>,
  value: any,
  configurable: boolean = null
) => configurable !== null ? name in object
    ? object
    : Object.defineProperty(object, name, { get: () => value, configurable })
    : Object.defineProperty(object, name, { get: () => value });

/**
 * Sugar helper for defining getter properties on an object.
 */
export const defineGetterProps = <T>(
  object: T,
  props: Array<[
    name: string,
    get: () => any
  ]>) => forEach(([ name, get ]) => Object.defineProperty(object, name, { get }), props);

/**
 * Returns a concated string list of `target` selectors.
 *
 * Always the last known target to be applied is the `spx-target` selector
 * this is because when executing the render() cycle, we will first querySelect
 * all targets and keep a record of them, then when we come accross the spx-target
 * node, we check to see if it is a decendent of an already morphed target and exclude
 */
export const targets = (page: Page) => {

  if ('target' in page) {

    if (page.target.length === 1 && page.target[0] === 'body') return page.target;

    if (page.target.includes('body')) {
      log.warn(`The body selector passed via ${$.qs.$target} will override`);
      return [ 'body' ];
    }

    return page.target.filter((v, i, a) =>
      v !== '' && v.indexOf(',') === -1
        ? a.indexOf(v) === i
        : false);

  } else if ($.config.fragments.length === 1 && $.config.fragments[0] === 'body') {

    return [ 'body' ];

  }

  return [];

};

/**
 * Returns a query selector string from an element
 */
export const getSelectorFromElement = (node: HTMLElement) => {

  let selector = node.tagName.toLowerCase();

  if (node.id) return selector + '#' + node.id;

  if (node.hasAttribute('class')) {
    const className = node.className.trim().replace(/\s+/g, '.');
    if (className) selector += '.' + className;
  }

  return `${selector}:nth-child(${Array.prototype.indexOf.call(node.parentNode.children, node) + 1})`;

};

export const selector = (target: string[]) => target.length === 1 && target[0] === 'body'
  ? 'body'
  : target.length === 0 ? null : target.join(',');

/**
 * Checks whether an `object`, `string` or `array` is empty.
 *
 * > **NOTE**
 * >
 * > If `input` parameter type cannot de determined, `null` will be returned.
 */
export const isEmpty = (input: any) => {

  const T = typeof input;

  if (T === 'object') {
    // eslint-disable-next-line no-unreachable-loop
    for (const _ in input) return false;
    return true;
  }

  return T === 'string'
    ? input[0] === undefined
    : Array.isArray(input) ? input.length > 0 : null;

};

/**
 * Joins an array list together with an empty string (`''`) separator
 */
export const glue = (...input: string[]) => input.join(nil);

/**
 * Creates a random integer. Ensure unique generation be referencing Set cache
 */
export const uid = (k = Math.floor(Math.random() * 89999 + 10000)) => {

  if (Identifiers.has(k)) return uid();

  Identifiers.add(k);

  return k;
};

/**
 * Creates a UUID string. Ensure unique generation be referencing Set cache
 */
export const uuid: { (size?: 1 | 2 | 3 | 4 | 5): string; } = function uuid (s = 5) {

  const k = Math.random().toString(36).slice(-s);

  if (Identifiers.has(k)) return uuid(s);

  Identifiers.add(k);

  return k;

};

/**
 * Creates a hash from string.
 */
export const hash = (key: string) => {

  let h = 0;

  for (let i = 0, s = key.length; i < s; i++) h = ((h << 3) - h + key.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
};

/**
 * Augments an array into smaller subsets (i.e: "chunks").
 */
export const chunk = (size: number = 2): (acc: any[], value: string) => any[] => (acc, value) => {

  const length: number = acc.length;
  const chunks = length < 1 || acc[length - 1].length === size
    ? acc.push([ value ])
    : acc[length - 1].push(value);

  return chunks && acc;

};

/**
 * Converts bytes to `B`, `KB`, `MB` or `GB` readable strings.
 */
export const size = (bytes: number): string =>
  bytes < 1024 ? bytes + ' B' : bytes < 1048576
    ? (bytes / 1024).toFixed(1) + ' KB'
    : bytes < 1073741824 ? (bytes / 1048576).toFixed(1) + ' MB' : (bytes / 1073741824).toFixed(1) + ' GB';

/**
 * Converts the first letter to lowercase
 */
export const downcase = (input: string) => input[0].toLowerCase() + input.slice(1);

/**
 * Converts the first letter to Uppercase
 */
export const upcase = (input: string) => input[0].toUpperCase() + input.slice(1);

/**
 * Converts a string from kebab-case or snake_case to camelCase.
 */
export const kebabCase = (input: string) =>
  /[A-Z]/.test(input)
    ? input.replace(/(.{1})([A-Z])/g, '$1-$2').toLowerCase()
    : input;

/**
 * Converts a string from kebab-case or snake_case to camelCase.
 */
export const camelCase = (input: string) =>
  /[_-]/.test(downcase(input))
    ? input.replace(/([_-]+).{1}/g, (x, k) => x[k.length].toUpperCase())
    : input;

/**
 * Generates `Set<HTMLElement>` store model
 */
export const nodeSet = <T extends HTMLElement> (nodes: NodeListOf<T>): Set<T> => s([].slice.call(nodes));

/**
 * Wrapper around `querySelectorAll` which will loop though nodes.
 * Returning a boolean `false` will stop iteration.
 */
export const forNode = <T extends HTMLElement> (
  selector: string | NodeListOf<T>,
  cb: (node: T, index?: number) => any | false
) => {

  const nodes = typeof selector === 'string' ? b().querySelectorAll<T>(selector) : selector;
  const size = nodes.length;

  // Ensure we can iterate the list
  if (size === 0) return;

  let i = -1;

  // Loop over the items in the array
  while (++i < size) if (cb(nodes[i], i) === false) break;

};

/**
 * Clears an object of all its properties and values
 */
export const empty = <T> (object: T) => {

  for (const prop in object) delete object[prop];

};

/**
 * Parse HTML document string from request response
 * using `parser()` method. Cached pages will pass
 * the saved response here.
 */
export const parse = (HTMLString: string): Document => new DOMParser().parseFromString(HTMLString, 'text/html');

/**
 * Returns a snapshot of the current document, including `<!DOCTYPE html>`
 * reference. Optionally accepts a `dom` Document, if none provided uses `document`
 */
export const takeSnapshot = (dom?: Document) => (dom || document).documentElement.outerHTML;

/**
 * Extract the document title text from the `<title>` tag of a dom string.
 */
export const getTitle = (dom: string) => {

  const title = dom.indexOf('<title');

  if (title === -1 || dom.slice(0, title).indexOf('<svg') > -1) return nil;

  const begin = dom.indexOf('>', title) + 1;
  const ender = dom.indexOf('</title', begin);

  if (ender === -1) return nil;

  return decodeEntities(dom.slice(begin, ender).trim());

};

/**
 * Element
 *
 * Returns a single element
 */
export const element = <T extends HTMLElement = HTMLElement> (selector: string, el: HTMLElement): T =>
  el.querySelector<T>(selector);

/**
 * Elements Array
 *
 * Returns an array list of elements from a selector
 */
export const elements = <T extends HTMLElement = HTMLElement> (selector: string, el: HTMLElement): T[] =>
  [].slice.call(el.querySelectorAll<T>(selector)) || [];

/**
 * Queue utility for executing tasks in a non-blocking manner
 */
export const enqueue = ((queue) => {

  const promise = <T extends Function>(fn: T) => new Promise(resolve => resolve(fn()));

  // Function to process the main queue in small batches asynchronously
  const process = async (batch = 2, delay = 200) => {
    while (queue.length > 0) {
      for (const fn of queue.splice(0, batch)) await promise(fn);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  };

  return <T = any>(...fn: T[]) => {
    fn.forEach(cb => queue.push(cb));
    onNextTick(() => process(), 50);
  };

})([]);
