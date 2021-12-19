import { IEvents } from '../types/page';

/**
 * Dispatches lifecycle events on target elements
 */
export function targetedEvent (eventName: IEvents, target: Element): boolean {

  // create and dispatch the event
  const newEvent = new CustomEvent(eventName, { cancelable: true });

  return target.dispatchEvent(newEvent);

}

/**
 * Dispatches lifecycle events on the document.
 */
export function dispatchEvent (
  eventName: IEvents,
  detail: object,
  cancelable: boolean = false
): boolean {

  // create and dispatch the event
  const newEvent = new CustomEvent(eventName, { detail, cancelable });

  return document.dispatchEvent(newEvent);

}
