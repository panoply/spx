import { props } from './native';
import { Errors } from './enums';

/**
 * Type Error
 *
 * Error wanrning handler
 */
export function log (error: Errors, message: string) {

  if (error === Errors.INFO) {

    console.info('SPX: ' + message);

  } else if (error === Errors.WARN) {

    console.warn('SPX: ' + message);

  } else {

    console.error('SPX: ' + message);

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
 * Creates a UUID string used for snapshot
 * record references.
 */
export function uuid () {

  return Math.random().toString(36).slice(2);
}

/**
 * Array Chunk function
 */
export function chunk (size: number = 2): (acc: any[], value: string) => any[] {

  return (acc, value) => {

    const length: number = acc.length;
    const chunks = (
      (
        length < 1
      ) || (
        acc[length - 1].length === size
      )
    ) ? acc.push([ value ]) : acc[length - 1].push(value);

    return chunks && acc;

  };
}

/**
 * Converts byte size to killobyte, megabyre,
 * gigabyte or terrabyte
 */
export function size (bytes: number): string {

  const kb = 1024;
  const mb = 1048576;
  const gb = 1073741824;

  if (bytes < kb) return bytes + ' B';
  else if (bytes < mb) return (bytes / kb).toFixed(1) + ' KB';
  else if (bytes < gb) return (bytes / mb).toFixed(1) + ' MB';
  else return (bytes / gb).toFixed(1) + ' GB';

};

/**
 * Each iterator helper function. Provides a util function
 * for loop iterations
 */
export function forEach (fn: (item: any, index?: number, array?: any) => any, array?: any) {

  if (arguments.length === 1) return (array: any) => forEach(fn, array);

  const len = array.length;

  if (len === 0) return;

  let i = 0;

  while (i < len) {
    fn(array[i], i, array);
    i++;
  }

}

/**
 * Returns a list of link elements to be prefetched. Filters out
 * any links which exist in cache to prevent extrenous transit.
 */
export function empty <T> (object: T): boolean {

  const items = props(object);

  return items.length === 0 ? true : items.every(prop => delete object[prop] === true);

};
