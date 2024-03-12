import type { ComponentEvent, SPX, Merge } from 'types';
import { assign, o } from '../shared/native';
import { defineGetter, hasProp } from '../shared/utils';
import { LogType } from '../shared/enums';
import { getEventParams } from './context';
import { log } from '../shared/logs';
import { $ } from '../app/session';

/**
 * Is Valid Event
 *
 * Small hack to determine whether or not the event name provided
 * is valid and a listener can be added.
 */
export function isValidEvent (eventName: string, node: Element | Window) {

  if (`on${eventName}` in node) return true;

  log(LogType.ERROR, [
    `Invalid event name "${eventName}" provided. No such event exists in the DOM API.`,
    'Only known event listeners can be attached.'
  ], node);

  return false;

}

/**
 * Add Event Attrs
 *
 * Assigns the `event.attrs` key to event method callbacks when DOM elements
 * contains attrs-state on containing element.
 */
export function eventAttrs (instance: SPX.Class, event: ComponentEvent, node?: HTMLElement) {

  /**
   * The component event method
   */
  const method: () => void = instance[event.method];

  return function handle (e: Merge<Event, { attrs: object }>) {

    if (event.params) {
      if (!hasProp(e, 'attrs')) defineGetter(e, 'attrs', o());
      assign(e.attrs, event.params);
    }

    method.call(instance, e);

  };
}

/**
 * Remove Event Listener
 *
 * Removes an existing listener from a component instance method and updates the
 * the `$.components.elements` Map, removing the element attached.
 */
export function removeEvent (instance: SPX.Class, event: ComponentEvent) {

  if (!event.attached) return;

  event.listener.abort();
  event.listener = new AbortController();
  event.options.signal = event.listener.signal;
  event.attached = false;

  $.components.$elements.delete(event.dom);

  log(LogType.VERBOSE, [
    `Detached ${event.key} ${event.eventName} event from ${event.method}() method in component`,
    `${instance.scope.static.id}: ${instance.scope.key}`
  ]);

}

/**
 * Add Event Listener
 *
 * Adds a listener to the instance method and binds any `attrs` the event _might_
 * have passed on the element.
 */
export function addEvent (instance: SPX.Class, node: HTMLElement, event: ComponentEvent) {

  if (event.attached) return;

  if (!(event.method in instance)) {
    log(LogType.WARN, `Undefined callback method: ${instance.scope.static.id}.${event.method}()`);
    return;
  }

  getEventParams(node.attributes, event);

  if (event.isWindow) {
    if (isValidEvent(event.eventName, window)) {
      addEventListener(event.eventName, eventAttrs(instance, event));
    }
  } else {

    if (isValidEvent(event.eventName, node)) {
      node.addEventListener(event.eventName, eventAttrs(instance, event), event.options);
      $.components.$elements.set(event.dom, node);
    }

  }

  log(LogType.VERBOSE, [
    `Attached ${event.key} ${event.eventName} event to ${event.method}() method in component`,
    `${instance.scope.static.id}: ${instance.scope.key}`
  ]);

  event.attached = true;

}
