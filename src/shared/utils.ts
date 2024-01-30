import { Errors } from './enums';
import { $ } from '../app/session';
import { IPage } from '../types/page';
import { assign, defineProp, d, nil, isArray, s } from './native';
import * as regex from './regexp';

/**
 * Whether DOM has loaded
 */
export async function load () {

  await onNextResolveTick();

  $.loaded = true;
  console.log('loaded');

  return $.loaded || document.readyState === 'complete';

}

/**
 * Get SPX Selector
 *
 * Returns an element selector for SPX Component node morphs
 */
export function getSelector (nodeName: string, uuid: string) {

  return `${nodeName.toLowerCase()}[data-spx="${uuid}"]`;

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
      .replace(/([{,])\s*(.+?)\s*:/g, '$1 "$2":');

    return JSON.parse(json);

  } catch (err) {

    log(
      Errors.ERROR,
      'Invalid JSON expression in attribute value:\n\n' +
      JSON.stringify(attr || string, null, 2) +
      '\n\n',
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
 * Attribute Value InstanceOf
 *
 * Normalizes the `spx-component` attribute value and corrects possible malformed
 * identifiers. This `spx-component` attribute can accept multiple component references,
 * this function ensure we can read each entry.
 */
export function attrValueInstanceOf (input: string) {

  return input
    .trim()
    .replace(/\s+/, ' ')
    .split(/[|, ]/)
    .map(camelCase);
}

/**
 * Attribute Value Notation
 *
 * Normalizes and corrects possibly malformed attribute values which use dot `.`
 * notation entries. Returns a string list and all entries contained.
 */
export function attrValueNotation (input: string) {

  return input
    .replace(/[\s .]+/g, '.')
    .replace(/\s+/g, ' ')
    .trim()
    .split(/[ ,]/);

}

export function attrValueFromType (input: string) {

  if (regex.isNumeric.test(input)) return input === 'NaN' ? NaN : +input;
  if (regex.isBoolean.test(input)) return input === 'true';
  if (input.charCodeAt(0) === 123 || input.charCodeAt(0) === 91) return attrJSON(input); // { or [

  return input; // string value

}

export function onNextAnimationFrame () {

  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

/**
 * On Next Tick Resolve
 *
 * Resolves a promise outside the of the event loop.
 */
export function onNextTickResolve () {

  return new Promise<void>((resolve) => setTimeout(() => resolve(), 0));

}

/**
 * On Next Tick
 *
 * Executes the provided `callback()` parameter outside of the event loop.
 */
export function onNextTick (callback: () => void) {

  setTimeout(() => callback(), 1);

}

/**
 * Delay
 *
 * Resolves a Promise after the provided `timeout` has finished.
 */
export function delay (timeout: number) {

  return new Promise<void>((resolve) => setTimeout(() => resolve(), timeout));

}

export function onNextResolveTick () {

  return Promise.resolve();

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
 * Type Error
 *
 * Error handler for console logging operations. The function allows for
 * throws, warnings and other SPX related logs.
 */
export function log (error: Errors, message: string, context?: any) {

  const { logLevel } = $.config;

  if ((
    error === Errors.TRACE && logLevel === 1
  ) || (
    error === Errors.INFO && (logLevel === 1 || logLevel === 2)
  )) {

    console.info('SPX: ' + message);

  } else if (error === Errors.WARN && logLevel < 4) {

    console.warn('SPX: ' + message);

  } else if (error === Errors.ERROR || error === Errors.TYPE) {

    if (context) {
      console.error('SPX: ' + message, context);
    } else {
      console.error('SPX: ' + message);
    }

    try {
      if (error === Errors.TYPE) {
        throw new TypeError(message);
      } else {
        throw new Error(message);
      }
    } catch (e) {}
  }
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
export function defineGetter <T> (object: T, name?: string, value?: any) {

  if (arguments.length > 1) {

    defineProp(object, name, { get: () => value });

  } else {

    return (name: string, value: any, options?: Omit<PropertyDescriptor, 'get'>) => {

      if (hasProp<any>(object, name)) return;

      const get = () => value;

      return defineProp(object, name, options
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
export function targets (page: IPage) {

  if (hasProp(page, 'target')) {

    if (page.target.length === 1 && page.target[0] === 'body') return page.target;

    return [].concat($.config.fragments, page.target).filter((v, i, a) => (
      v !== 'body' &&
      v !== nil &&
      v.indexOf(',') === -1 ? a.indexOf(v) === i : false
    ));

  } else if ($.config.fragments.length === 1 && $.config.fragments[0] === 'body') {

    return [ 'body' ];

  }

  return [ ...$.config.fragments ];

}

/**
 * is Empty
 *
 * Checks whether an `object` or `array` is empty.
 */
export function isEmpty (input: any) {

  if (typeof input === 'object') return Object.keys(input).length > 0;
  if (isArray(input)) return input.length > 0;

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
export function camelCase (input: string) {

  return /[_-]/.test(input)
    ? input.replace(/([_-]+).{1}/g, (x, k) => x[k.length].toUpperCase())
    : input;
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
