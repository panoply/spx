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
 * The location origin, eg: `https://brixtol.com`
 */
export const origin = window.location.origin;

/**
 * Cached `Object.create`
 */
export const object = Object.create;

/**
 * Empty string value
 */
export const nil = '';

/**
 * Cached console method
 */
export const { warn, info, error, debug } = console;

/* -------------------------------------------- */
/* EXTENDS                                      */
/* -------------------------------------------- */

/**
 * Document <body>
 *
 * Returns `document.body`
 */
export const d = () => document.body;

/**
 * Document <head>
 *
 * Returns `document.head`
 */
export const h = () => document.head;

/**
 * Object Create
 *
 * Creates a null prototype object
 */
export const o = <T> (value?: T) => value ? Object.assign(object(null), value) : object(null);

/**
 * Set Create
 *
 * Creates a new `Set` instance
 */
export const s = <K> (value?: K[]) => new Set<K>(value);

/**
 * Proxy Handler
 *
 * Creates a new `Proxy` instance
 */
export const p = <P extends object> (handler: ProxyHandler<P>) => new Proxy<P>(o(), handler);

/**
 * Map Create
 *
 * Creates a new `Map` instance
 */
export const m = <K, V> () => new Map<K, V>();

/**
 * Noop
 *
 * Empty function reference
 */
export const noop = () => {};

/**
 * Extends XMLHTTPRequest
 *
 * Extend the native XHR request class and add
 * a key value to the instance.
 */
export class XHR extends XMLHttpRequest {

  /**
   * Request Key
   *
   * The request URL key reference.
   */
  public key: string = null;

  /**
   * XHR Request Queue
   *
   * The promise-like queue reference which holds the
   * XHR requests for each fetch dispatched. This allows
   * for aborting in-transit requests.
   */
  static $request: Map<string, XMLHttpRequest> = m();

  /**
   * Request Transits
   *
   * This object holds the XHR requests in transit. The map
   * keys represent the the request URL and values hold the XML Request instance.
   */
  static $transit: Map<string, Promise<string>> = m();

  /**
   * Request Timeouts
   *
   * Transit timeout used to keep track of promises
   * and trigger operations like hover or proximity
   * prefetching.
   */
  static $timeout: { [key: string]: NodeJS.Timeout } = o();

}
