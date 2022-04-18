/* eslint-disable no-unused-vars */

import { IPage } from './page';

/**
 * Pjax Events
 */
export type EventNames = (
 | 'connected'
 | 'prefetch'
 | 'visit'
 | 'fetch'
 | 'store'
 | 'hydrate'
 | 'render'
 | 'load'
);

/**
 * Emitter Arguments
 */
export type EmitterArguments<T extends EventNames> = (
  T extends 'connected' ? [
    state: IPage
  ] :
  T extends 'visit' ? [
    event: MouseEvent,
    state: IPage
  ] :
  T extends 'prefetch' ? [
    target: Element,
    state: IPage
  ] :
  T extends 'fetch' ? [
    state: IPage
  ] :
  T extends 'store' ? [
    state: IPage,
    snapshot: string
  ] :
  T extends 'hydrate' ? [
    element: Element,
    newElement: Element
  ] :
  T extends 'render' ? [
    element: Element,
    newElement: Element
  ] :
  T extends 'load' ? [
    state: IPage
  ] : never
)

/**
 * Lifecycle Events
 */
export type LifecycleEvent<T extends EventNames> = (

  T extends 'connected' ? (
    /**
     * Page state reference
     */
    state?: IPage

  ) => void :

  T extends 'trigger' ? (
    /**
     * The mouse event, access target via `event.target`
     */
    event?: MouseEvent,
    /**
     * Page state reference
     */
    route?: IPage

  ) => void | false :

  T extends 'prefetch' ? (
    /**
     * Page state reference
     */
    state?: IPage,

  ) => void | false :

  T extends 'request' ? (
    /**
     * Page state reference
     */
     state?: IPage,

  ) => void | false :

  T extends 'cache' ? (
    /**
     * Page state reference
     */
    state?: IPage,
    /**
     * Parsed document snapshot. Augment the snapshot
     * by returning the document.
     */
    snapshot?: Document

  ) => void | false | Document :

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
    state?: IPage

  ) => void : never
)
