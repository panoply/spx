import { getComponents, setInstances } from '../components/context';
import { removeEvent } from '../components/listeners';
import { context, resetContext } from '../components/observe';
import { Errors, VisitType } from '../shared/enums';
import { log } from '../shared/logs';
import { $ } from '../app/session';
import { toArray } from '../shared/native';
import { patch } from '../app/queries';
import { onNextTick } from '../shared/utils';

export type Lifecycle = (
  | 'oninit'
  | 'onexit'
  | 'onload'
  | 'onvisit'
  | 'onstate'
  | 'onfetch'
  | 'oncache'
)

export function teardown () {

  for (const ref in $.components.reference) {
    delete $.components.reference[ref];
  }

  for (const instance of $.components.instances.values()) {
    for (const key in instance.scope.events) {
      removeEvent(instance, instance.scope.events[key]);
    }
  }

  $.components.elements.clear();
  $.components.instances.clear();
  $.components.connected.clear();

  log(Errors.INFO, 'Component instances were disconnected');

}

export function hook (event: Lifecycle, params: any) {

  if (event === 'onvisit') {
    return onNextTick(() => hook(null, params));
  } else if (event === null) {
    event = 'onvisit';
  }

  const { connected, instances } = $.components;

  if (event === 'onload') {
    patch('components', toArray(connected));
  }

  for (const uuid of connected) {
    const instance = instances.get(uuid);
    if (instance && event in instance) {
      instance[event].apply(instance, params);
    }
  }

}

export function connect () {

  if ($.observe.components) return;

  if ($.page.type === VisitType.INITIAL) {

    getComponents();

  } else {

    if (context) {
      setInstances(context);
      resetContext();
    }

    hook('onload', [ $.page ]);

  }

  $.observe.components = true;

}

export function disconnect () {

  if (!$.observe.components) return;

  hook('onexit', [ $.page ]);

  $.observe.components = false;

}
