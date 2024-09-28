import type { Class, ComponentNodes, Scope, Context } from 'types';
import { $ } from '../app/session';
import { Colors, Hooks, HookStatus, VisitType } from '../shared/enums';
import { addEvent } from './listeners';
import { Component } from './class';
import { LifecycleHooks, mount } from '../observe/components';
import { element, elements, forEach, onNextTick, upcase } from '../shared/utils';
import * as q from '../app/queries';
import * as log from '../shared/logs';
import * as snap from '../app/snapshot';
import { b, o } from '../shared/native';
import { sugarProxy } from './proxies';

const setLifecyles = (scope: Scope, instance: Class) => {

  scope.hooks = o();

  forEach(hook => {
    scope.hooks[hook] = hook in instance
      ? HookStatus.DEFINED
      : HookStatus.UNDEFINED;
  }, [
    'connect',
    'onmount',
    'unmount',
    'onmedia'
  ]);

};

const setTriggers = (hooks: LifecycleHooks, isMorph: boolean, isMount: boolean) => (instance: Class, scope: Scope) => {

  if (isMorph === false || (isMount && scope.status === Hooks.MOUNT)) {

    $.mounted.add(scope.key);
    $.instances.set(scope.key, instance);

    log.debug(`Component "${scope.instanceOf}" connected: ${scope.key}`, Colors.PINK);

    // This reference is used for onmount hook sequence
    // When initial run, onmount hook will run AFTER connect hook
    // We will hold the index in place to inject when such occurance
    // happens. The ensures execution order of hooks resolve correctly
    // when the connect hook is async and onmount is sync
    let promise: number = -1;

    if (scope.hooks.connect === HookStatus.DEFINED) {

      promise = hooks.push([ scope.key, 'connect' ]) - 1;

      scope.status = Hooks.CONNNECT;

    }

    if (scope.hooks.onmount === HookStatus.DEFINED) {

      promise = (promise > -1
        ? hooks[promise].push('onmount')
        : hooks.push([ scope.key, 'onmount' ])) - 1;

    }

    // if no lifecycle hooks
    if (promise < 0) {

      scope.status = Hooks.MOUNTED;

    }
  }

};

const setEvents = (scope: Scope, $instance: Class, isMorph: boolean) => {

  // Step 6 (New Visit)
  // Step 3 (Old Visit)
  //
  // We now obtain and define event listener scopes to the component
  //
  for (const key in scope.events) {

    const event = scope.events[key];

    // Update the scope when key if non-existent.
    // This will generally mean we apply incremental association
    if (!(key in $instance.scope.events)) {
      $.maps[key] = $instance.ref;
      $instance.scope.events[key] = event;
    }

    if (isMorph !== null && scope.status === Hooks.MOUNTED) {
      $.maps[key] = scope.key;
      $instance.scope.events[key] = scope.events[key];
    }

    addEvent($instance, scope.events[key]);

  }

};

const setNodes = (nodes: Record<string, ComponentNodes>, $instance: Class) => {

  for (const key in nodes) {

    const node = nodes[key];
    const hasNodeKey = `has${upcase(key)}`;

    // Update the scope when key is non-existent.
    // This will generally mean we apply incremental association
    if (!(key in $instance.scope.nodes)) {
      $.maps[key] = $instance.ref;
      $instance.scope.nodes[key] = node;
    }

    if (hasNodeKey in $instance) {
      key in $instance.scope.nodes && ++$instance.scope.nodes[key].live;
      return;
    }

    const hasNode = () => node.live > 0;
    const getNode = () => element(node.selector, node.isChild ? $instance.dom : b());
    const getNodes = () => elements(node.selector, node.isChild ? $instance.dom : b());

    Object.defineProperty($instance, hasNodeKey, { get: hasNode });

    if ($instance.scope.define.sugar) {

      Object.defineProperties(node.dom, {
        node: { get: getNode },
        nodes: { get: getNodes }
      });

      $instance[key] = sugarProxy(node);

    } else {

      Object.defineProperties($instance, {
        [`${key}Node`]: { get: getNode },
        [`${key}Nodes`]: { get: getNodes }
      });

    }
  }

};

// const mergeScope = (scope: Scope, instance: Class) => {

//   for (const prop of [ 'nodes', 'events', 'binds' ]) {
//     prop in scope && Object.assign(
//       instance.scope[prop],
//       scope[prop]
//     );
//   }

// };

const defineInstances = (promises: LifecycleHooks, mounted: q.Mounted, isMorph: boolean) => {

  const isMount = isMorph || $.page.type === VisitType.REVERSE;
  const setHook = setTriggers(promises, isMorph, isMount);

  return (scope: Scope, instance?: Class) => {

    if (instance) {

      setNodes(scope.nodes, instance);
      setEvents(scope, instance, isMorph);

    } else {

      scope.define = o();

      const Register = $.registry.get(scope.instanceOf);
      const Defined = Object.defineProperty(scope, 'define', { get: () => Register.define });

      Component.scopes.set(scope.key, Defined);

      const Instance = new Register(scope.key);

      setLifecyles(scope, Instance);
      setNodes(scope.nodes, Instance);
      setEvents(scope, Instance, isMorph);
      setHook(Instance, scope);

    }
  };
};

/**
 * Set Instances
 *
 * This function is a final cycle operation that will either establish an
 * instance of a component or update an existing instance. We determine instance
 * upates based on the {@link Context} (`mounted`) value, when `mounted` is `true`
 * there was an `spx-component` defined element during context operations, when
 * `spx-component` is `false` it signals an incremental context operation, wherein
 * either an element `event`, `bind` or `node` was detected, but no associated `spx-component`.
 *
 * The function will return a Promise resolver, to ensure that asynchronous methods
 * `connect` and/or `onmount` of component classes are gracefully handled. The components
 * observer applies a `thenable` call from which this function has resolved.
 */
export const setInstances = (context: Context, snapshot?: Document) => {

  const { $scopes, $aliases, $morph } = context;
  const promises: LifecycleHooks = [];
  const mounted = q.mounted();
  const define = defineInstances(promises, mounted, $morph !== null);

  for (const instanceOf in $scopes) {

    if (!$.registry.has(instanceOf) && !mounted.has(instanceOf)) {
      log.warn(`Component does not exist in registry: ${instanceOf}`, $scopes[instanceOf]);
      continue;
    }

    for (const scope of $scopes[instanceOf]) {

      if (scope.instanceOf == null) {
        if (instanceOf in $aliases) {
          scope.instanceOf = $aliases[instanceOf];
        } else {
          continue;
        }
      }

      if (mounted.has(instanceOf)) {
        for (const instance of mounted.get(instanceOf)) {
          if (instance.scope.instanceOf === instanceOf) {

            define(scope, instance);

          }
        }
      } else {
        define(scope);
      }

    };

  }

  onNextTick(() => [ mounted.clear() ]);

  // Mark Snapshot
  //
  // Intial visits require snapshot sync to apply. All visits thereafter
  // will augment and align snapshots during morph/render operations.
  //
  if (($.page.type === VisitType.INITIAL && snapshot) || snapshot) {

    snap.update(snapshot, $.page.snap);

  }

  // Mount Components
  //
  // Our final operation is to mount the component. The promises[] array
  // will be populated with entries which we will iterate over and initialize.
  //
  // We can resolve id promises[] is empty.
  //
  return promises.length > 0 ? mount(promises) : Promise.resolve();

};
