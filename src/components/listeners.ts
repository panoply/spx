import { defineGetter } from '../shared/utils';
import { IComponentEvent } from '../types/components';

/**
 * Add Event Attrs
 *
 * Assigns the `event.attrs` key to event method callbacks when DOM elements
 * contains attrs-state on containing element.
 */
export function addEventAttrs (instance: any, { method, params }: IComponentEvent) {

  /**
   * The component event method
   */
  const eventMethod: () => void = instance[method];

  return (event: Event) => {

    if (params) defineGetter(event, 'attrs', params);

    return eventMethod.call(instance, event);

  };
}
