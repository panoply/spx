import type { Page, LiteralUnion } from 'types';
import { $ } from '../app/session';
import { LogType } from './enums';
import { assign, defineProp, d, nil, isArray, s } from './native';
import * as regex from './regexp';
import { log } from '../shared/logs';

/**
 * Get Fragment Selector
 *
 * Returns the query selector reference
 */
export function qsTarget (targets: string[]) {

  return targets.length === 0
    ? `${$.config.fragments.join(',')},[${$.qs.$target}]`
    : `${targets.join(',')},[${$.qs.$target}]`;
}

/**
 * Get SPX Selector
 *
 * Returns an element selector for SPX Component node morphs
 */
export function qsNode (node: HTMLElement, key: string, value: string) {

  return `${node.nodeName.toLowerCase()}[${key}*=${escSelector(value)}]`;

}

/**
 * Split Attribute Array Value
 *
 * Some SPX attribute value accept array pattern structures. This function
 * will remove characters the following characters if detected:
 *
 * - `[`
 * - `]`
 * - `'`
 * - `"`
 *
 * From here, the refined string will be split and return an array list of
 * strings that can be understood.
 */
export function splitAttrArrayValue (input: string) {

  let value: string = input
    .replace(/\s+,/g, ',')
    .replace(/,\s+/g, ',')
    .replace(/['"]/g, nil);

  if (value.charCodeAt(0) === 91) {

    // Value might be an attribute selector within an array
    // let's quickly determine, pattern would be: spx-target="[[data-foo]]"
    //
    // If the pattern does not match, we will look for a comma separator
    // contained within the value, if one is found, it infers that the
    // value is an data attribute selector.
    //
    if (/^\[\s*\[/.test(value) || (/,/.test(value) && /\]$/.test(value))) {
      value = value
        .replace(/^\[/, nil)
        .replace(/\]$/, nil);
    }
  }

  return value.split(/,|\|/);

}

/**
 * Attribute JSON
 *
 * Parses Attribute values as JSON. Supports both Array or Object types
 * and does not require quotations be applied.
 */
export function attrJSON (attr: string, string?: string) {

  try {

    const json = (string || attr)
      .replace(/\\'|'/g, (m) => m[0] === '\\' ? m : '"')
      .replace(/\[|[^\s[\]]*|\]/g, match => /[[\]]/.test(match)
        ? match : match.split(',').map(
          value => value
            .replace(/^(\w+)$/, '"$1"')
            .replace(/^"([\d.]+)"$/g, '$1')
        ).join(','))
      .replace(/([a-zA-Z0-9_-]+)\s*:/g, '"$1":')
      .replace(/:\s*([$a-zA-Z_-]+)\s*([,\]}])/g, ':"$1"$2')
      .replace(/,([\]}])/g, '$1')
      .replace(/([a-zA-Z_-]+)\s*,/g, '"$1",')
      .replace(/([\]},\s]+)?"(true|false)"([\s,{}\]]+)/g, '$1$2$3');

    return JSON.parse(json);

  } catch (err) {

    log(
      LogType.ERROR,
      'Invalid JSON expression in attribute value: ' + JSON.stringify(attr || string, null, 2),
      err
    );

    return string;

  }

}

/**
 * Last Index
 *
 * Returns the last entry of an array list
 */
export function last<T extends any[]> (input: T): T[number] {
  return input[input.length - 1];
}

/**
 * Equalizes Whitespace in a string
 *
 * Strips out extraneous whitespaces and newlines from a string, and returns
 * an single whitespace seprated result. Used to ensure structures adhere to
 * a common pattern.
 */
export function equalizeWS (input: string) {

  return input.replace(/\s+/g, ' ').trim();

}

/**
 * Get SPX Selector
 *
 * Returns an element selector for SPX Component node morphs
 */
export function escSelector (input: string) {

  return input
    .replace(/\./g, '\\.')
    .replace(/@/g, '\\@')
    .replace(/:/g, '\\:');

}

/**
 * Attribute Value Notation
 *
 * Normalizes and corrects possibly malformed attribute values which use dot `.`
 * notation entries. Returns a string list and all entries contained.
 */
export function attrValueNotation (input: string) {

  return equalizeWS(input.replace(/\s \./g, '.'))
    .replace(/\s+/g, ' ')
    .trim()
    .split(/[ ,]/);

}

/**
 * Attribute Value from Type
 *
 * Converts attribute value strings into relative types.
 */
export function attrValueFromType (input: string) {

  if (regex.isNumeric.test(input)) return input === 'NaN' ? NaN : +input;
  if (regex.isBoolean.test(input)) return input === 'true';

  const code = input.charCodeAt(0);

  if (code === 123 || code === 91) return attrJSON(input); // { or [

  return input; // string value

}

/**
 * On Next Tick Resolve
 *
 * Resolves a promise outside the of the event loop.
 */
export function onNextTickResolve () {

  return new Promise<void>((resolve) => setTimeout(() => resolve(), 1));

}

/**
 * On Next Tick
 *
 * Executes the provided `callback()` parameter outside of the event loop.
 */
export function onNextTick (callback: () => void, timeout = 1, bind?: any) {

  return setTimeout(() => bind ? callback.bind(bind)() : callback(), timeout);

}

/**
 * Promise Resolver
 *
 * Returns `Promise.resolve()` and used to ensure async actions conclude
 * before next operation begins.
 */
export function promiseResolve () {

  return Promise.resolve();

}

/**
 * Delay
 *
 * Resolves a Promise after the provided `timeout` has finished.
 */
export function delay (timeout: number) {

  return new Promise<void>((resolve) => setTimeout(() => resolve(), timeout));

}

/**
 * Decode Entities
 *
 * Used to ensure entries are correctly handled
 */
export function decodeEntities (string: string) {

  const textarea = document.createElement('textarea');

  textarea.innerHTML = string;

  return textarea.value;

}

/**
 * Timestamp
 *
 * Returns the current time value in milliseconds
 */
export function ts () {

  return new Date().getTime();

}

/**
 * Has Properties
 *
 * Same as `hasProp` but accepts an array list of properties.
 * Used to validate the null prototype objects used in the module.
 */
export function hasProps<T extends object> (object: T) {

  return <
    S extends keyof T,
    A extends Array<S>,
    P extends S | A
  >(property: P) => {

    if (!property) return false;
    if (typeof property === 'string') return property in object;

    return (property as A).every(prop => prop in object);

  };

}

/**
 * Has Property
 *
 * Used to validate the `null` prototype objects used in the module.
 */
export function hasProp<T extends object> (object: T, property: keyof T | string) {

  return object ? property in object : false;

}

/**
 * Define Getter
 *
 * Creates a getter on an object. Accepts curried callback.
 */
export function defineGetter <T> (
  object: T,
  name?: undefined | LiteralUnion<keyof T, string>,
  value?: any
) {

  if (name !== undefined) {

    if (!hasProp<any>(object, name)) {

      defineProp(object, name, { get: () => value });

    }

    return object;

  } else {

    return (name: string, value: any, options?: Omit<PropertyDescriptor, 'get'>): T => {

      if (hasProp<any>(object, name)) return;

      const get = () => value; ;

      return defineProp<T>(object, name, options
        ? assign(options, { get })
        : <PropertyDescriptor>{ get });
    };

  }
}

/**
 * Returns a concated string list of `target` selectors.
 *
 * Always the last known target to be applied is the `spx-target` selector
 * this is because when executing the render() cycle, we will first querySelect
 * all targets and keep a record of them, then when we come accross the spx-target
 * node, we check to see if it is a decendent of an already morphed target and exclude
 */
export function targets (page: Page) {

  if (hasProp(page, 'target')) {

    if (page.target.length === 1 && page.target[0] === 'body') return page.target;

    if (page.target.includes('body')) {
      log(LogType.WARN, `The body selector passed via ${$.qs.$target} will override`);
      return [ 'body' ];
    }

    return page.target.filter((v, i, a) => (
      v !== nil &&
      v.indexOf(',') === -1 ? a.indexOf(v) === i : false
    ));

  } else if ($.config.fragments.length === 1 && $.config.fragments[0] === 'body') {

    return [ 'body' ];

  }

  return [];

}

export function selector (target: string[]) {

  // assign the selector reference if it is undefined

  if (target.length === 1 && target[0] === 'body') return 'body';

  //  `${(target.length === 0 ? $.config.fragments : target).join(',')},${$.qs.$targets}`;

  return target.length === 0 ? null : target.join(',');

}

/**
 * is Empty
 *
 * Checks whether an `object`, `string` or `array` is empty.
 */
export function isEmpty (input: any) {

  const T = typeof input;

  if (T === 'object') {

    // eslint-disable-next-line no-unreachable-loop
    for (const _ in input) return false; return true;

  } else if (T === 'string') {

    return input[0] === undefined;

  } else if (isArray(input)) {

    return input.length > 0;

  }

  return false;
}

/**
 * Glue
 *
 * Joins an array list together
 */
export function glue (...input: string[]) {

  return input.join(nil);

}

/**
 * UUID
 *
 * Creates a UUID string. Ensure unique generation be referencing Set cache
 */
export const uuid: {
  (size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10): string;
  $cache: Set<string>;
} = function uuid (length = 5) {

  const k = Math.random().toString(36).slice(-length);

  if (uuid.$cache.has(k)) return uuid(length);

  uuid.$cache.add(k);

  return k;

};

uuid.$cache = s();

/**
 * Hash
 *
 * Creates a hash from string.
 */
export function hash (key: string) {

  let h = 0;

  for (let i = 0, s = key.length; i < s; i++) {
    h = ((h << 3) - h + key.charCodeAt(i)) | 0;
  }

  return (h >>> 0).toString(36);

}

/**
 * Array Chunk function
 *
 * Augments an array into smaller subsets (i.e: "chunks").
 */
export function chunk (size: number = 2): (acc: any[], value: string) => any[] {

  return (acc, value) => {

    const length: number = acc.length;
    const chunks = length < 1 || acc[length - 1].length === size
      ? acc.push([ value ])
      : acc[length - 1].push(value);

    return chunks && acc;

  };
}

/**
 * Memory Size
 *
 * Converts bytes to `B`, `KB`, `MB` or `GB` readable strings.
 */
export function size (bytes: number): string {

  const kb = 1024;
  const mb = 1048576;
  const gb = 1073741824;

  if (bytes < kb) return bytes + ' B';
  else if (bytes < mb) return (bytes / kb).toFixed(1) + ' KB';
  else if (bytes < gb) return (bytes / mb).toFixed(1) + ' MB';
  else return (bytes / gb).toFixed(1) + ' GB';
}

/**
 * Lowercase First
 *
 * Converts the first letter to lowercase
 */
export function downcase (input: string) {

  return input[0].toLowerCase() + input.slice(1);
}

/**
 * Upcase
 *
 * Converts the first letter to Uppercase
 */
export function upcase (input: string) {

  return input[0].toUpperCase() + input.slice(1);
}

/**
 * Camel Case
 *
 * Converts a string from kebab-case or snake_case to camelCase.
 */
export function kebabCase (input: string) {

  return /[A-Z]/.test(input)
    ? input.replace(/(.{1})([A-Z])/g, '$1-$2').toLowerCase()
    : input;
}

/**
 * Camel Case
 *
 * Converts a string from kebab-case or snake_case to camelCase.
 */
export function camelCase (input: string) {

  return /[_-]/.test(downcase(input))
    ? input.replace(/([_-]+).{1}/g, (x, k) => x[k.length].toUpperCase())
    : input;
}

export function nodeSet <T extends HTMLElement> (nodes: NodeListOf<T>): Set<T> {

  return s([].slice.call(nodes));

}

/**
 * For Node
 *
 * Wrapper around `querySelectorAll` which will loop though nodes.
 * Returning a boolean `false` will stop iteration.
 */
export function forNode <T extends HTMLElement> (
  selector: string | NodeListOf<T>,
  callback: (node: T, index?: number) => any | false
) {

  const nodes = typeof selector === 'string'
    ? d().querySelectorAll<T>(selector)
    : selector;

  const count = nodes.length;

  // Ensure we can iterate the list
  if (count === 0) return;

  // Loop over the items in the array
  for (let i = 0; i < count; i++) if (callback(nodes[i], i) === false) break;

}

/**
 * For Each
 *
 * Synchronous forEach iterator wrapper. Provides curried support.
 * It's using the `for` iterator which is best for records under
 * 1000 (which is the standard for this library).
 */
export function forEach<T> (
  callback: (item: T, index?: number, array?: Array<T>) => void,
  array?: Array<T>
) {
  // curried expression
  if (arguments.length === 1) return (array: Array<T>) => forEach(callback, array);

  const len = array.length;

  // Ensure we can iterate the list
  if (len === 0) return;

  // Loop over the items in the array
  for (let i = 0; i < len; i++) callback(array[i], i, array);
}

/**
 * Empty Object
 *
 * Returns a list of link elements to be prefetched. Filters out
 * any links which exist in cache to prevent extrenous transit.
 */
export function empty<T> (object: T) {

  for (const prop in object) delete object[prop];

}
