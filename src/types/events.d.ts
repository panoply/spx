/* eslint-disable no-unused-vars */

import { IPage } from './page';

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
    event: MouseEvent
  ] :
  T extends 'popstate' ? [
    {
      get dom(): Document;
      get page(): IPage
    }
  ] :
  T extends 'prefetch' ? [
    target: Element,
    state: IPage
  ] :
  T extends 'fetch' ? [
    state: IPage
  ] :
  T extends 'before:cache' ? [
    state: IPage,
    dom: Document
  ] : T extends 'after:cache' ? [
    state: IPage
  ] :
  T extends 'before:render' ? [
    state: IPage
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

  T extends 'visit' ? (
    /**
     * The mouse event, access target via `event.target`
     */
    event?: MouseEvent

  ) => void | false :
  T extends 'popstate' ? (
    /**
     * The document reference
     */
    params?: {
      get dom(): Document;
      get page(): IPage
    }

  ) => HTMLElement | Document | void :

  T extends 'prefetch' ? (
    /**
     * The target element that will be replaced
     */
    element?: Element,
    /**
     * Page state reference
     */
    state?: IPage,

  ) => void | false :
  T extends 'fetch' ? (
    /**
     * Page state reference
     */
     state?: IPage,

  ) => void | false :

  T extends 'before:cache' ? (
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

  T extends 'after:cache' ? (
    /**
     * Page state reference
     */
    state?: IPage

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
    state?: IPage

  ) => void : never
)
