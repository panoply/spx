/* eslint-disable no-unused-vars */
import { $, ctx } from '../app/session';
import { getComponents } from '../components/context';
import { setInstances } from '../components/instance';
import { removeEvent } from '../components/listeners';
import { resetContext } from '../components/observe';
import { Hooks, HookStatus, VisitType } from '../shared/enums';
import { o } from '../shared/native';
import { patchComponentSnap } from '../morph/snapshot';
import { onNextTick, promiseResolve } from '../shared/utils';
import * as log from '../shared/logs';

export type Lifecycle = (
  | 'connect'
  | 'onmount'
  | 'unmount'
)

export type LifecycleHooks = [
  ref: string,
  firsthook: string,
  finalhook?: string
][]

export const hargs = () => o(o($.page));

export const teardown = () => {

  for (const ref in $.maps) {
    delete $.maps[ref];
  }

  for (const instance of $.instances.values()) {
    for (const key in instance.scope.events) {
      removeEvent(instance, instance.scope.events[key]);
    }
  }

  $.instances.clear();
  $.mounted.clear();

  log.info('Component instances were disconnected');

};

export const mount = (promises: LifecycleHooks) => {

  const params = hargs();
  const promise: any[] = [];

  for (const [ ref, firsthook, finalhook ] of promises) {

    const instance = $.instances.get(ref);
    const MOUNT = instance.scope.status === Hooks.UNMOUNT ? 'unmount' : 'onmount';

    if (!instance.scope.snap) instance.scope.snap = $.page.snap;

    const seq = async () => {

      try {

        if (finalhook && instance.scope.status === Hooks.CONNNECT) {
          await instance[firsthook](params);
          await instance[finalhook](params);
        } else {
          if (instance.scope.status === Hooks.UNMOUNT) {
            instance.scope.define.merge && patchComponentSnap(instance.scope, ref);
          } else {
            await instance[firsthook](params);
          }
        }

        instance.scope.status = instance.scope.status === Hooks.UNMOUNT ? Hooks.UNMOUNTED : Hooks.MOUNTED;

        if (instance.scope.hooks.connect === HookStatus.DEFINED) {
          instance.scope.hooks.connect = HookStatus.EXECUTED;
        }

      } catch (error) {
        // Fall through and reject outside of catch
        log.warn(`Component to failed to ${MOUNT}: ${instance.scope.instanceOf} (${ref})`, error);
        return Promise.reject<string>(ref);
      }
    };

    promise.push(promiseResolve().then(seq));

  }

  return Promise.allSettled(promise);

};

/**
 * Component Hooks
 *
 * This function will fire off component lifecycle hooks. The component `scope.status`
 * key is imperative to hook execution and will be used to determine which hooks trigger.
 *
 * @todo
 * There is no logic (currently) for handling components without hooks. Some consideration
 * needs to be had here, in situations where a component has declared `merge` but does not
 * apply hooks. In addition, handling cases where `connect()` hook has not been defined but
 * `onmount()` has been, leaving the `scope.connected` reference as `false` and this might be
 * problematic at some point, depending on how i wrote the code.
 */
export const hook = () => {

  if ($.mounted.size === 0 && $.instances.size === 0 && $.registry.size > 0) return getComponents();

  const promises: LifecycleHooks = [];

  for (const ref of $.mounted) {

    if (!$.instances.has(ref)) continue;

    const instance = $.instances.get(ref);

    if (instance.scope.status !== Hooks.MOUNTED && instance.scope.status !== Hooks.UNMOUNTED) {

      const unmount = instance.scope.status === Hooks.UNMOUNT;
      const trigger = unmount ? 'unmount' : 'onmount';

      if (trigger in instance) {

        trigger === 'onmount' && 'connect' in instance && instance.scope.hooks.connect === HookStatus.DEFINED
          ? promises.push([ ref, 'connect', trigger ])
          : promises.push([ ref, trigger ]);

      } else if (unmount) {

        instance.scope.define.merge && patchComponentSnap(instance.scope, ref);
        instance.scope.status = Hooks.UNMOUNTED;

      }

    }

  }

  promises.length > 0 && mount(promises).catch(ref => {
    const instance = $.instances.get(ref);
    instance.scope.status = Hooks.UNMOUNTED;
    $.mounted.delete(ref);
  });

};

export const connect = () => {

  if ($.registry.size === 0 || $.observe.components) return;

  if ($.page.type === VisitType.INITIAL) {
    getComponents();
  } else {

    if (ctx.store) {
      setInstances(ctx.store).then(hook).then(resetContext);
    } else {
      hook();
    }
  }

  $.observe.components = true;

};

export const disconnect = () => {

  if (!$.observe.components) return;

  hook();

  $.observe.components = false;

};
