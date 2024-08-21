/* eslint-disable no-unused-vars */
import { $ } from '../app/session';
import { getComponents } from '../components/context';
import { setInstances } from '../components/instances';
import { removeEvent } from '../components/listeners';
import { context, resetContext } from '../components/observe';
import { Hooks, Log, VisitType } from '../shared/enums';
import { log } from '../shared/logs';
import { o } from '../shared/native';
import { patchComponentSnap } from '../morph/snapshot';
import { onNextTick, promiseResolve } from '../shared/utils';
import { Class } from 'types';
import { SPX } from 'types/global';

export type Lifecycle = (
  | 'connect'
  | 'onmount'
  | 'unmount'
)

type LifecycleHooks = [
  ref: string,
  firsthook: string,
  finalhook?: string
][]

export const hargs = () => o({ page: o($.page) });

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

  log(Log.INFO, 'Component instances were disconnected');

}

export function mount (promises: LifecycleHooks) {

  const params = hargs();
  const promise: any[] = [];

  for (const [ ref, firsthook, finalhook ] of promises) {

    const instance = $.components.$instances.get(ref);
    const MOUNT = instance.scope.status === Hooks.UNMOUNT ? 'unmount' : 'onmount';

    if (!instance.scope.snap) instance.scope.snap = $.page.snap;

    const seq = async () => {

      try {

        if (!instance.scope.connected && finalhook && instance.scope.status === Hooks.CONNNECT) {

          await instance[firsthook](params);
          await instance[finalhook](params);

          instance.scope.connected = true; // updates scope.connect, ensures it triggers once

        } else {
          if (instance.scope.status === Hooks.UNMOUNT) {
            instance.scope.define.merge && patchComponentSnap(instance.scope, ref);
          } else {
            await instance[firsthook](params);
          }
        }

        instance.scope.status = instance.scope.status === Hooks.UNMOUNT
          ? Hooks.UNMOUNTED
          : Hooks.MOUNTED;

      } catch (error) {

        // Fall through and reject outside of catch

        log(Log.WARN, `Component to failed to ${MOUNT}: ${instance.scope.instanceOf} (${ref})`, error);

        return Promise.reject<string>(ref);

      }
    };

    promise.push(promiseResolve().then(seq));

  }

  return Promise.allSettled(promise);

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

  const { $connected, $instances, $registry, $elements } = $.components;

  if (
    $connected.size === 0 &&
    $instances.size === 0 &&
    $elements.size === 0 &&
    $registry.size > 0) return getComponents();

  const promises: LifecycleHooks = [];

  for (const ref of $connected) {

    if (!$instances.has(ref)) continue;

    const instance = $instances.get(ref);

    if (instance.scope.status !== Hooks.MOUNTED && instance.scope.status !== Hooks.UNMOUNTED) {

      const unmount = instance.scope.status === Hooks.UNMOUNT;
      const connect = unmount ? false : instance.scope.connected;
      const event = unmount ? 'unmount' : 'onmount';

      if (event in instance) {

        if (event === 'onmount' && 'connect' in instance && instance.scope.connected === false) {
          promises.push([ ref, 'connect', event ]);
        } else {
          promises.push([ ref, event ]);
        }

      } else if (unmount) {

        instance.scope.define.merge && patchComponentSnap(instance.scope, ref);
        instance.scope.status = Hooks.UNMOUNTED;

      }

    }

  }

  promises.length > 0 && mount(promises).catch(ref => {
    const instance = $instances.get(ref);
    instance.scope.status = Hooks.UNMOUNTED;
    $connected.delete(ref);
  });

}

export function connect () {

  if ($.components.$registry.size === 0 || $.observe.components) return;

  if ($.page.type === VisitType.INITIAL) {

    getComponents();

  } else {

    if (context) {

      setInstances(context).then(hook).then(resetContext);

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
