import { defineGetter } from '../shared/utils';
import { IComponentEvent, IComponentInstance } from '../types/components';

/**
 * Add Event Attrs
 *
 * Assigns the `event.attrs` key to event method callbacks when DOM elements
 * contains attrs-state on containing element.
 */
export function eventAttrs (instance: IComponentInstance, { method, params }: IComponentEvent) {

  /**
   * The component event method
   */
  const eventMethod: () => void = instance[method];

  return (event: Event) => {

    if (params) defineGetter(event, 'attrs', params);

    return eventMethod.call(instance, event);

  };
}

export function addEvent (instance: IComponentInstance, event: IComponentEvent) {

  if (event.isWindow) {
    addEventListener(event.eventName, eventAttrs(instance, event));
  } else {
    instance[event.schema][event.index].addEventListener(
      event.eventName,
      eventAttrs(instance, event),
      event.options
    );
  }

  return true;

}

export function removeEvent (instance: IComponentInstance, event: IComponentEvent) {

  if (event.isWindow) {
    removeEventListener(event.eventName, instance[event.method]);
  } else {
    instance[event.schema][event.index].removeEventListener(
      event.eventName,
      instance[event.method]
    );
  }

  return false;

}
