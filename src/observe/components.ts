/* eslint-disable no-unused-vars */
import type { Class, SPX } from 'types';
import { $ } from '../app/session';
import { getComponents } from '../components/context';
import { setInstances } from '../components/instances';
import { removeEvent } from '../components/listeners';
import { context, resetContext } from '../components/observe';
import { Hooks, LogType, VisitType } from '../shared/enums';
import { log } from '../shared/logs';
import { assign, o, toArray } from '../shared/native';
import { getSnapDom, patchPage, setSnap } from '../app/queries';
import { onNextTick, promiseResolve } from '../shared/utils';

export type Lifecycle = (
  | 'connect'
  | 'onmount'
  | 'unmount'
)

type LifecycleHooks = [
  scopeKey: string,
  firstHook: string,
  nextHook?: string
][]

export function hookArguments () {

  return assign(o(), { page: assign(o(), $.page) });

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

export function mount (promises: LifecycleHooks) {

  const { $instances } = $.components;
  const params = hookArguments();
  const promise: any[] = [];

  for (const [ scopeKey, firstHook, nextHook ] of promises) {

    const instance = $instances.get(scopeKey);
    const { scope } = instance;
    const MOUNT: string = scope.mounted === Hooks.UNMOUNT ? 'unmount' : 'mount';

    const seq = async () => {

      try {

        if (!scope.connected && nextHook && scope.mounted === Hooks.CONNNECT) {

          await instance[firstHook](params);
          await instance[nextHook](params);

          scope.connected = true; // updates scope.connect, ensures it triggers once

        } else {

          await instance[firstHook](params);

          if (scope.mounted === Hooks.UNMOUNT) {
            if (scope.define.merge) {
              const snap = getSnapDom($.page.rev);
              snap.querySelector(`[${$.qs.$ref}="${scope.ref}"]`).outerHTML = scope.snapshot;
              setSnap(snap.documentElement.outerHTML, $.page.rev);
            }
          }

        }

        instance.scope.mounted = scope.mounted === Hooks.UNMOUNT
          ? Hooks.UNMOUNTED
          : Hooks.MOUNTED;

        return;

      } catch (_) { /* Fall through and reject outside of catch */ }

      log(LogType.WARN, `Component to failed to ${MOUNT}: ${scope.instanceOf} (${scopeKey})`);

      return Promise.reject<string>(scopeKey);

    };

    promise.push(promiseResolve().then(seq));

  }

  return Promise.race(promise);

}

export function hook () {

  const { $connected, $instances } = $.components;
  const promises: LifecycleHooks = [];

  // patchPage('components', toArray($connected));

  for (const scopeKey of $connected) {

    const instance = $instances.get(scopeKey);
    const { scope } = instance;
    const event = scope.mounted === Hooks.UNMOUNT ? 'unmount' : 'onmount';

    if (instance && event in instance) {
      if (event === 'onmount' && 'connect' in instance && scope.connected === false) {
        promises.push([
          scopeKey,
          'connect',
          event
        ]);
      } else {
        if (scope.mounted !== Hooks.MOUNTED && scope.mounted !== Hooks.UNMOUNTED) {
          promises.push([
            scopeKey,
            event
          ]);
        }
      }
    }
  }

  if (promises.length > 0) {
    mount(promises).catch((scopeKey) => {
      const instance = $instances.get(scopeKey);
      instance.scope.mounted = Hooks.UNMOUNTED;
      $connected.delete(scopeKey);
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

      setInstances(context)
        .then(hook)
        .then(resetContext);

    } else {

      hook();

    }
  }

  $.observe.components = true;

}

export function disconnect () {

  if (!$.observe.components) return;

  hook();

  $.observe.components = false;

}
