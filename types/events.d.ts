/* eslint-disable no-unused-vars */

import { Page } from './page';

/**
 * SPX Events
 */
export type EventNames = (
 | 'connected'
 | 'popstate'
 | 'prefetch'
 | 'visit'
 | 'fetch'
 | 'before:cache'
 | 'after:cache'
 | 'before:resource'
 | 'after:resource'
 | 'hydrate'
 | 'render'
 | 'load'
);

/**
 * Emitter Arguments
 */
export type EmitterArguments<T extends EventNames> = (
  T extends 'connected' ? [] :
  T extends 'visit' ? [
    event: MouseEvent
  ] :
  T extends 'popstate' ? [
    {
      state: Page
    }
  ] :
  T extends 'prefetch' ? [
    target: Element,
    state: Page
  ] :
  T extends 'fetch' ? [
    state: Page
  ] :
  T extends 'before:cache' ? [
    state: Page,
    dom: Document
  ] : T extends 'after:cache' ? [
    state: Page
  ] :
  T extends 'before:render' ? [
    state: Page
  ] :
  T extends 'hydrate' ? [
    element: Element,
    newElement: Element
  ] :
  T extends 'render' ? [
    element: Element,
    newElement: Element
  ] :
  T extends 'before:resource' ? [
    node: Element
  ] :
  T extends 'load' ? [
    state: Page
  ] : never

)

/**
 * Lifecycle Events
 */
export type LifecycleEvent<T extends EventNames> = (

  T extends 'connected' ? () => void :

  T extends 'visit' ? (
    /**
     * The mouse event, access target via `event.target`
     */
    event?: MouseEvent

  ) => void | false :
  T extends 'popstate' ? (
    /**
     * Page state reference
     */
    state?: Page

  ) => string[] | void:

  T extends 'prefetch' ? (
    /**
     * The target element that will be replaced
     */
    element?: Element,
    /**
     * Page state reference
     */
    state?: Page,

  ) => void | false :
  T extends 'fetch' ? (
    /**
     * Page state reference
     */
     state?: Page,

  ) => void | false :

  T extends 'before:cache' ? (
    /**
     * Page state reference
     */
    state?: Page,
    /**
     * Parsed document snapshot. Augment the snapshot
     * by returning the document.
     */
    snapshot?: Document

  ) => void | false | Document :

  T extends 'after:cache' ? (
    /**
     * Page state reference
     */
    state?: Page

  ) => void :

  T extends 'hydrate' ? (
    /**
     * The target element that will be replaced
     */
    element?: Element,
    /**
     * The element replacing the current target
     */
    newElement?: Element

  ) => void | false :

  T extends 'render' ? (
    /**
     * The target element that will be replaced
     */
     element?: Element,
     /**
      * The element replacing the current target
      */
     newElement?: Element

  ) => void | false :

  T extends 'load' ? (
    /**
     * Page state reference
     */
    state?: Page

  ) => void : never
)
