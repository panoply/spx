import type { ComponentEvent, Merge, Class } from 'types';
import { o } from '../shared/native';
import { Log } from '../shared/enums';
import { getEventParams } from './context';
import { log } from '../shared/logs';
import { defineGetter } from 'src/shared/utils';

/**
 * Is Valid Event
 *
 * Small hack to determine whether or not the event name provided
 * is valid and a listener can be added.
 */
export const isValidEvent = (eventName: string, node: Element | Window) => {

  if (`on${eventName}` in node) return true;

  log(Log.ERROR, [
    `Invalid event name "${eventName}" provided. No such event exists in the DOM API.`,
    'Only known event listeners can be attached.'
  ], node);

  return false;

};

/**
 * Add Event Attrs
 *
 * Assigns the `event.attrs` key to event method callbacks when DOM elements
 * contains attrs-state on containing element.
 */
export const eventAttrs = (instance: Class, event: ComponentEvent) => {

  /**
   * The component event method
   */
  const method: () => void = instance[event.method];

  return (e: Merge<Event, { attrs: object }>) => {

    if (event.params) {
      if (e && !('attrs' in e)) Object.defineProperty(e, 'attrs', { get: () => o() });
      Object.assign(e.attrs, event.params);
    }

    method.call(instance, e);

  };
};

/**
 * Remove Event Listener
 *
 * Removes an existing listener from a component instance method and updates the
 * the `$.components.elements` Map, removing the element attached.
 */
export const removeEvent = (instance: Class, event: ComponentEvent) => {

  if (!event.attached) return;

  event.listener.abort();
  event.listener = new AbortController();
  event.options.signal = event.listener.signal;
  event.attached = false;

  log(Log.VERBOSE, [
    `Detached ${event.key} ${event.eventName} event from ${event.method}() method in component`,
    `${instance.scope.define.id}: ${instance.scope.key}`
  ]);

};

/**
 * Add Event Listener
 *
 * Adds a listener to the instance method and binds any `attrs` the event _might_
 * have passed on the element.
 */
export const addEvent = (instance: Class, event: ComponentEvent, node?: HTMLElement) => {

  if (event.attached) return;

  if (!(event.method in instance)) {
    log(Log.WARN, `Undefined callback method: ${instance.scope.define.id}.${event.method}()`);
    return;
  }

  const dom = node ? defineGetter(event, 'dom', node).dom : event.dom;

  getEventParams(dom.attributes, event);

  if (event.isWindow) {
    if (isValidEvent(event.eventName, window)) {
      addEventListener(event.eventName, eventAttrs(instance, event));
    }
  } else {
    if (isValidEvent(event.eventName, dom)) {
      dom.addEventListener(event.eventName, eventAttrs(instance, event), event.options);
    }
  }

  event.attached = true;

  log(Log.VERBOSE, [
    `Attached ${event.key} ${event.eventName} event to ${event.method}() method in component`,
    `${instance.scope.define.id}: ${instance.scope.key}`
  ]);

};
