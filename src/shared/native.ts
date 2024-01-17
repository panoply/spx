import { History } from 'types';
import { supportsTouchEvents } from 'detect-it';

/* -------------------------------------------- */
/* ENV RELATED                                  */
/* -------------------------------------------- */

export const isBrowser = typeof window !== 'undefined';

/* -------------------------------------------- */
/* MORPH RELATED                                */
/* -------------------------------------------- */

/**
 * Whether or not the document has `<template>` support
 */
export const hasTemplate = 'content' in document.createElement('template');

/**
 * Whether or not the document has `createRange` support
 */
export const hasRange = document.createRange && 'createContextualFragment' in document.createRange();

/* -------------------------------------------- */
/* CACHED REFERENCES                            */
/* -------------------------------------------- */

/**
 * Re-export of pointer events
 */
export const pointer = supportsTouchEvents ? 'pointer' : 'mouse';

/**
 * History API `window.history`
 */
export const history = window.history as History;

/**
 * The location origin, eg: `https://brixtol.com`
 */
export const origin = window.location.origin;

/**
 * Cached `Object.assign`
 */
export const assign = Object.assign;

/**
 * Cached `Object.defineProperty`
 */
export const defineProp = Object.defineProperty;

/**
  * Cached `Object.defineProperty`
  */
export const defineProps = Object.defineProperties;

/**
  * Cached `Object.create`
  */
export const object = Object.create;

/**
 * Cached `Array.isArray`
 */
export const isArray = Array.isArray;

/**
 * Cached `Array.from`
 */
export const toArray = Array.from;

/**
 * Empty string value
 */
export const nil = '';

/* -------------------------------------------- */
/* EXTENDS                                      */
/* -------------------------------------------- */

/**
 * Document Body
 *
 * Returns `document.body`
 */
export const d = () => document.body;

/**
 * Object Create
 *
 * Creates a null prototype object
 */
export const o = <T> (value?: T, o = object(null)) => value ? assign(o, value) : o;

/**
 * Set Create
 *
 * Creates a new `Set` instance
 */
export const s = <K> () => new Set<K>();

/**
 * Map Create
 *
 * Creates a new `Map` instance
 */
export const m = <K, V> () => new Map<K, V>();

/**
 * Query Selector
 *
 * Small hack for `querySelector` wherein `querySelectorAll` is used for faster retreival.
 */
export const q = <T extends HTMLElement>(selector: string) => d().querySelectorAll<T>(selector).item(0);

/**
 * Extends XMLHTTPRequest
 *
 * Extend the native XHR request class and add
 * a key value to the instance.
 */
export class XHR extends XMLHttpRequest {

  /**
   * XHR Request Queue
   *
   * The promise-like queue reference which holds the
   * XHR requests for each fetch dispatched. This allows
   * for aborting in-transit requests.
   */
  static request: Map<string, XMLHttpRequest> = m();

  /**
   * Request Transits
   *
   * This object holds the XHR requests in transit. The object
   * properties represent the the request URL and the
   * value is the XML Request instance.
   */
  static transit: Map<string, Promise<string>> = m();

  /**
   * Request Timeouts
   *
   * Transit timeout used to keep track of promises
   * and trigger operations like hover or proximity
   * prefetching.
   */
  static timeout: Map<string, NodeJS.Timeout> = m();

  /**
   * Request Key
   *
   * The request URL key reference.
   */
  public key: string = null;

}
