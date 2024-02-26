import type { Merge } from 'type-fest';
import type { IComponentEvent, SPX } from '../types/components';
import { assign, o } from '../shared/native';
import { defineGetter, hasProp } from '../shared/utils';
import { Errors } from '../shared/enums';
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

  log(Errors.ERROR, [
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
export function eventAttrs (instance: SPX.Class, event: IComponentEvent, node?: HTMLElement) {

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
export function removeEvent (instance: SPX.Class, event: IComponentEvent) {

  if (!event.attached) return;

  event.listener.abort();
  event.listener = new AbortController();
  event.options.signal = event.listener.signal;
  event.attached = false;

  $.components.elements.delete(event.el);

  log(Errors.TRACE, [
    `Detached ${event.key} ${event.eventName} event from the ${event.method} method on`,
    `${instance.static.id} component (${instance.scope.key})`
  ]);

}

/**
 * Add Event Listener
 *
 * Adds a listener to the instance method and binds any `attrs` the event _might_
 * have passed on the element.
 */
export function addEvent (instance: SPX.Class, node: HTMLElement, event: IComponentEvent) {

  if (event.attached) return;

  if (!(event.method in instance)) {
    log(Errors.WARN, `Undefined callback method: ${instance.static.id}.${event.method}()`);
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
      $.components.elements.set(event.el, node);
    }

  }

  log(Errors.TRACE, [
    `Attached ${event.key} ${event.eventName} event to the ${event.method} method on`,
    `${instance.static.id} component (${instance.scope.key})`
  ]);

  event.attached = true;

}
