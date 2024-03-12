/* eslint-disable no-unused-vars */
import type { SPX } from 'types';
import { $ } from '../app/session';
import { getComponents } from '../components/context';
import { setInstances } from '../components/instances';
import { removeEvent } from '../components/listeners';
import { context, resetContext } from '../components/observe';
import { LogType, VisitType } from '../shared/enums';
import { log } from '../shared/logs';
import { toArray } from '../shared/native';
import { patchPage } from '../app/queries';
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

const enum HookMethod {
  SYNC = 1,
  ONLOAD = 2,
  ONEXIT = 3
}

export function teardown () {

  for (const ref in $.components.$reference) {
    delete $.components.$reference[ref];
  }

  for (const instance of $.components.$instances.values()) {
    for (const key in instance.scope.events) {
      removeEvent(instance, instance.scope.events[key]);
    }
  }

  $.components.$elements.clear();
  $.components.$instances.clear();
  $.components.$connected.clear();

  log(LogType.INFO, 'Component instances were disconnected');

}

export function mount (promises: [instance: SPX.Class, method: string][]) {

  const promise = promises.map(([ instance, method ]) => (
    instance.scope.mounted
      ? instance[method]($.page)
      : Promise.reject<string>(instance.scope.instanceOf)
  ));

  return Promise.race(promise);

}

export function hook (event: Lifecycle, params: any, cb?: () => void) {

  if (event === 'onvisit') return onNextTick(() => hook(null, params));

  const { $connected, $instances } = $.components;

  let method: HookMethod = HookMethod.SYNC;
  let promises: [instance: SPX.Class, method: string][] = [];

  if (event === null) event = 'onvisit';
  else if (event === 'onload') {
    method = HookMethod.ONLOAD;
    promises = [];
    patchPage('components', toArray($connected));
  } else if (event === 'onexit') {
    method = HookMethod.ONEXIT;
    promises = [];
  }

  for (const uuid of $connected) {
    const instance = $instances.get(uuid);
    if (instance && event in instance) {
      if (method === HookMethod.SYNC) {
        instance[event](params);
      } else {
        promises.push([ instance, event ]);
      }
    }
  }

  if (promises.length > 0) {
    mount(promises).then(() => {
      for (const [ instance ] of promises) {
        instance.scope.mounted = method === HookMethod.ONLOAD;
      }
    }).catch(() => {
      for (const [ instance ] of promises) {
        instance.scope.mounted = false;
      }
    });
  }
}

export function connect () {

  if (!$.config.components) return;
  if ($.observe.components) return;

  if ($.page.type === VisitType.INITIAL) {

    getComponents();

  } else {

    if (context) {

      setInstances(context).then(() => {
        hook('onload', $.page);
        resetContext();
      });

    } else {

      hook('onload', $.page);

    }
  }

  $.observe.components = true;

}

export function disconnect () {

  if (!$.observe.components) return;

  hook('onexit', $.page);

  $.observe.components = false;

}
