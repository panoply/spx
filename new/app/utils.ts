import * as path from './path';
import { store } from './store';
import * as regexp from '../constants/regexp';
import { IPage } from '../types/store';

/**
 * Array Chunk function
 */
function chunk (size: number = 2): (acc: any[], value: string) => any[] {

  return (acc, value) => {

    const length: number = acc.length;

    return (
      !length || Object.is(acc[length - 1].length, size)
        ? acc.push([ value ])
        : acc[length - 1].push(value)
    ) && acc;

  };
}

/**
 * Constructs a JSON object from HTML `data-pjax-*` attributes.
 * Attributes are passed in as array items
 *
 * @example
 *
 * // Attribute values are seperated by whitespace
 * // For example, a HTML attribute would look like:
 * <data-pjax-prop="string:foo number:200">
 *
 * // Attribute values are split into an Array
 * // The array is passed to this reducer function
 * ["string", "foo", "number", "200"]
 *
 * // This reducer function will return:
 * { string: 'foo', number: 200 }
 *
 */
function jsonattrs (
  accumulator: { [key: string]: string | number },
  current: string,
  index:number,
  source: string[]
): {
  [key: string]: string | number
} {

  const prop = (source.length - 1) >= index ? (index - 1) : index;

  return (
    index % 2 ? (
      {
        ...accumulator,
        [source[prop]]: regexp.isNumber.test(current)
          ? Number(current)
          : current
      }
    ) : accumulator
  );

};

/**
 * Parses link `href` attributes and assigns them to
 * configuration options.
 */
export function attrparse ({ attributes }: Element, state: IPage = {}): IPage {

  return ([ ...attributes ].reduce((config, { nodeName, nodeValue }) => {

    if (!regexp.Attr.test(nodeName)) return config;

    const value = nodeValue.replace(/\s+/g, '');

    config[nodeName.slice(10)] = regexp.isArray.test(value) ? (
      value.match(regexp.ActionParams)
    ) : regexp.isPenderValue.test(value) ? (
      value.match(regexp.ActionParams).reduce(chunk(2), [])
    ) : regexp.isPosition.test(value) ? (
      value.match(regexp.inPosition).reduce(jsonattrs, {})
    ) : regexp.isBoolean.test(value) ? (
      value === 'true'
    ) : regexp.isNumber.test(value) ? (
      Number(value)
    ) : (
      value
    );

    return config;

  }, state));

}

/**
 * Locted the closest link when click bubbles.
 */
export function getLink (target: EventTarget | MouseEvent, selector: string): Element | false {

  if (target instanceof Element) {
    const element = target.closest(selector);
    if (element && element.tagName === 'A') return element;
  }

  return false;

}

/**
 * Returns the byte size of a string value
 */
export function byteSize (string: string): number {

  return new Blob([ string ]).size;

}

/**
 * Link is not cached and can be fetched
 */
export function canFetch (target: Element): boolean {

  return !store.has(path.get(target).url, { snapshot: true });
}

/**
 * Returns a list of link elements to be prefetched. Filters out
 * any links which exist in cache to prevent extrenous transit.
 */
export function getTargets (selector: string): Element[] {

  const targets = document.body.querySelectorAll(selector);

  return Array.from(targets).filter(canFetch);

}

/**
 * Converts byte size to killobyte, megabyre,
 * gigabyte or terrabyte
 */
export function byteConvert (bytes: number): string {

  if (bytes === 0) return '0 B';

  const size = parseInt(`${Math.floor(Math.log(bytes) / Math.log(1024))}`, 10);
  const unit = [ 'B', 'KB', 'MB', 'GB', 'TB' ];

  return size === 0
    ? `${bytes} ${unit[size]}`
    : `${(bytes / 1024 ** size).toFixed(1)} ${unit[size]}`;
}

/**
 * Each iterator helper function. Provides a util function
 * for loop iterations
 */
export function forEach (
  fn: (item: Element | any, index?: number, array?: any) => any,
  list?: any
): (arr: any) => any {

  if (arguments.length === 1) return (_list: any) => forEach(fn, _list);

  let i = 0;

  const len = list.length;

  while (i < len) {
    fn(list[i], i, list);
    i++;
  }

}

/**
 * Get Element attributes
 */
export function getElementAttrs (
  { attributes }: Element,
  {
    exclude = [],
    include = []
  }: {
    exclude?: string[],
    include?: Array<[
      name: string,
      value: string
    ]>
  }
): Array<[
  name: string,
  value: string
]> {

  return Array.from(attributes).reduce((
    accumulator,
    {
      name = null,
      value = null
    }
  ) => name && value && !exclude.includes(name) ? [
    ...accumulator,
    [
      name,
      value
    ]
  ] : accumulator, include);
}
