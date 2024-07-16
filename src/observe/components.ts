/* eslint-disable no-unused-vars */
import type { Class, Scope, SPX } from 'types';
import { $ } from '../app/session';
import { getComponents } from '../components/context';
import { setInstances } from '../components/instances';
import { removeEvent } from '../components/listeners';
import { context, resetContext } from '../components/observe';
import { Hooks, LogType, VisitType } from '../shared/enums';
import { log } from '../shared/logs';
import { assign, o, toArray } from '../shared/native';
import { patchComponentSnap } from '../morph/snapshot';
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
    let MOUNT: string;

    if (scope.status === Hooks.UNMOUNT) {
      MOUNT = 'unmount';
    } else {
      MOUNT = 'mount';
      if (!scope.snap) scope.snap = $.page.snap;
    }

    const seq = async () => {

      let e: any;

      try {

        if (!scope.connected && nextHook && scope.status === Hooks.CONNNECT) {

          await instance[firstHook](params);
          await instance[nextHook](params);

          scope.connected = true; // updates scope.connect, ensures it triggers once

        } else {

          await instance[firstHook](params);

          if (scope.status === Hooks.UNMOUNT && scope.define.merge) {
            patchComponentSnap(scope, scopeKey);
          }

        }

        scope.status = scope.status === Hooks.UNMOUNT
          ? Hooks.UNMOUNTED
          : Hooks.MOUNTED;

      } catch (error) {

        /* Fall through and reject outside of catch */

        log(
          LogType.WARN,
          `Component to failed to ${MOUNT}: ${scope.instanceOf} (${scopeKey})`,
          e
        );

        return Promise.reject<string>(scopeKey);

      }

    };

    promise.push(promiseResolve().then(seq));

  }

  return Promise.race(promise);

}

/**
 * Component Hooks
 *
 * This function willfire off component lifecycle hooks. The component `scope.status`
 * key is imperative to hook execution and will be used to determine which hooks trigger.
 *
 * @todo
 * There is no logic (currently) for handling components without hooks. Some consideration
 * needs to be had here, in situations where a component has declared `merge` but does not
 * apply hooks. In addition, handling cases where `connect()` hook has not been defined but
 * `onmount()` has been, leaving the `scope.connected` reference as `false` and this might be
 * problematic at some point, depending on how i wrote the code.
 */
export function hook () {

  const { $connected, $instances } = $.components;
  const promises: LifecycleHooks = [];

  for (const scopeKey of $connected) {

    if (!$instances.has(scopeKey)) continue;

    const instance = $instances.get(scopeKey);
    const { scope } = instance;

    if (scope.status !== Hooks.MOUNTED && scope.status !== Hooks.UNMOUNTED) {

      const unmount = scope.status === Hooks.UNMOUNT;
      const connect = unmount ? false : scope.connected;
      const event = unmount ? 'unmount' : 'onmount';

      if (event in instance) {

        if (event === 'onmount' && 'connect' in instance && scope.connected === false) {
          promises.push([ scopeKey, 'connect', event ]);
        } else {
          promises.push([ scopeKey, event ]);
        }

      } else if (unmount) {

        if (scope.define.merge) {

          patchComponentSnap(scope, scopeKey);

          scope.status = Hooks.UNMOUNTED;

        }

      }

    }

  }

  if (promises.length > 0) {
    mount(promises).catch((scopeKey) => {
      const instance = $instances.get(scopeKey);
      instance.scope.status = Hooks.UNMOUNTED;
      $connected.delete(scopeKey);
    });
  }
}

export function connect () {

  if (!$.config.components || $.observe.components) return;

  if ($.page.type === VisitType.INITIAL) {

    getComponents();

  } else {

    if (context) {

      console.log(context);

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
