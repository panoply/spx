/* eslint-disable no-unused-vars */
import { Page } from './page';
import { HistoryState } from 'types';

/**
 * SPX Events
 */
export type EventNames = (
 | 'connect'
 | 'popstate'
 | 'prefetch'
 | 'visit'
 | 'fetch'
 | 'cache'
 | 'resource'
 | 'render'
 | 'load'
 | 'disconnect'
);

/**
 * Emitter Arguments
 */
export type EmitterArguments<T extends EventNames> = (
  T extends 'connect' ? [ page: Page ] :
  T extends 'visit' ? [ page: Page, event: MouseEvent ] :
  T extends 'popstate' ? [ page: Page ] :
  T extends 'prefetch' ? [ page: Page, dom: HTMLElement ] :
  T extends 'fetch' ? [ page: Page ] :
  T extends 'cache' ? [ page: Page, dom: string ] :
  T extends 'render' ? [page: Page, curDom: HTMLElement, newDom: HTMLElement] :
  T extends 'resource' ? [ page: Page, node: Element ] :
  T extends 'load' ? [ page: Page] :
  T extends 'disconnect' ? [] :
  never
)

type Connect = (this: Page, page: Page) => void;
type Prefetch<T extends HTMLElement = HTMLElement> = (this: Page, dom: T) => string[] | void;
type Visit<T = MouseEvent> = (this: Page, event: T) => void | false;
type Popstate = (this: Page, page: Page) => void | false;
type Fetch = (this: Page, page: Page) => void | false;
type Resource = (this: Page, resource: HTMLElement) => void | false;
type Cache = (this: Page, dom: Document) => void | false | Document;
type Render = <T extends HTMLElement = HTMLElement>(this: Page, curDom: T, newDom: T) => void | false;
type Load = (this: Page, page: Page) => void;

/**
 * Lifecycle Events
 */
export type LifecycleEvent<T extends EventNames, S> = (
    T extends 'connect' ? Connect & S
  : T extends 'visit' ? Visit & S
  : T extends 'popstate' ? Popstate & S
  : T extends 'prefetch' ? Prefetch & S
  : T extends 'fetch' ? Fetch & S
  : T extends 'resource' ? Resource & S
  : T extends 'cache' ? Cache & S
  : T extends 'render' ? Render & S
  : T extends 'load' ? Load & S
  : T extends 'disconnect'
  ? () => void
  : never
)
