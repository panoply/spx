import { History } from 'types';
import { supportsPointerEvents } from 'detect-it';

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
export const pointer = supportsPointerEvents ? 'pointer' : 'mouse';

/**
 * History API `window.history`
 */
export const history = window.history as History;

/**
 * The location origin, eg: `https://brixtol.com`
 */
export const origin = window.location.origin;

/**
 * Cached `Object.getOwnPropertyNames`
 */
export const props = Object.getOwnPropertyNames;

/**
 * Cached `Object.assign`
 */
export const assign = Object.assign;

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
