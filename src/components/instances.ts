import type { ComponentEvent, ComponentSession, Class } from 'types';
import { isLive, type Context } from './context';
import { $ } from '../app/session';
import { Colors, Hooks, HookStatus, Log, VisitType } from '../shared/enums';
import { addEvent } from './listeners';
import { Component as Extended } from './extends';
import { log } from '../shared/logs';
import { mount } from '../observe/components';
import { snap } from './snapshot';
import { element, elements } from '../shared/dom';
import { defineGetter, hasProps, upcase } from '../shared/utils';
import * as q from '../app/queries';

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
export const setInstances = ({ $scopes, $aliases, $morph }: Context, snapshot?: HTMLElement) => {

  const mounted = q.mounted();
  const isMounted = hasProps(mounted);
  const isReverse = $.page.type === VisitType.REVERSE;
  const promises: [ scopeKey: string, firstHook: string, nextHook?: string][] = [];
  const { $mounted, $instances, $registry, $reference } = <ComponentSession>$.components;

  for (const instanceOf in $scopes) {

    for (const scope of $scopes[instanceOf]) {

      if (scope.instanceOf === null) {
        if (instanceOf in $aliases) {
          scope.instanceOf = $aliases[instanceOf];
        } else if (isMounted(instanceOf)) {
          scope.instanceOf = mounted[instanceOf][0].scope.instanceOf;
        } else {
          continue;
        }
      }

      /* -------------------------------------------- */
      /* INSTANCE                                     */
      /* -------------------------------------------- */

      let Component: any;
      let instance: Class;

      if (scope.status === Hooks.UNMOUNTED && ($morph !== null || isReverse)) {

        if (scope.alias !== null) {

          if (isMounted(scope.alias)) {

            instance = mounted[scope.alias][0];
            Component = instance.scope.define;

          }

        } else {

          if (isMounted(scope.instanceOf)) {

            if (mounted[scope.instanceOf].length === 1) {

              instance = mounted[scope.instanceOf][0];
              Component = scope.define;

              // log(Log.WARN, [
              //   'Extending a mounted component without an alias id="" value is not recommended.',
              //   `Consider using an id attribute value: ${scope.instanceOf}`
              // ]);

            } else {

              log(Log.ERROR, [
                'Incremental component update failed because more than 1 instance exists.',
                `Provide an an alias "id" identifer on component: ${scope.instanceOf} (alias: ${scope.alias})`
              ]);

            }

          } else {

            // TODO: ERROR - NO COMPONENT INSTANCE EXISTS IN INCREMENTAL UPDATE

          }

        }

        if (!instance) {
          log(Log.ERROR, 'Incremental component update failed as instance was undefined', scope);
          continue;
        }

        scope.key = instance.scope.key;
        scope.ref = instance.scope.ref;
        scope.status = instance.scope.status = Hooks.MOUNTED;

      } else {

        // Step 1 (New Visit)
        // Obtain the component from te registry
        //
        Component = $registry.get(scope.instanceOf);

        // Step 2 (New Visit)
        // Add the component scope to the static define Map of Extended
        //
        Extended.scopes.set(scope.key, defineGetter(scope, 'define', Component.define));

        // Step 3 (New Visit)
        // Create the component instance
        //
        instance = new Component(scope.key);

        // Step 4 (New Visit)
        // Lets inspect our component for hook existences
        //
        for (const hook in scope.hooks) {

          // Set the component hook status
          //
          scope.hooks[hook] = hook in instance
            ? HookStatus.DEFINED
            : HookStatus.UNDEFINED;

        }

      }

      /* -------------------------------------------- */
      /* NODES                                        */
      /* -------------------------------------------- */

      // Step 5 (New Visit)
      // Step 2 (Old Visit)
      //
      // We now obtain and define dom node scopes to the component.
      //
      for (const key in scope.nodes) {

        const { schema, isChild, selector } = scope.nodes[key];

        if (schema in instance.dom) continue;

        const domNode = schema.slice(0, -1);

        Object.defineProperties(instance.dom, {
          [domNode]: { get: () => isChild ? instance.root.querySelector(selector) : element(selector) },
          [schema]: { get: () => elements(selector) },
          [`has${upcase(domNode)}`]: { get: () => isLive(schema, scope.nodes) }
        });

      }

      /* -------------------------------------------- */
      /* EVENTS                                       */
      /* -------------------------------------------- */

      // Step 6 (New Visit)
      // Step 3 (Old Visit)
      //
      // We now obtain and define event listener scopes to the component
      //
      for (const key in scope.events) {

        let event: ComponentEvent;

        if ($morph !== null && scope.status === Hooks.MOUNTED) {
          event = instance.scope.events[key] = scope.events[key];
          $reference[key] = scope.key;
        } else {
          event = scope.events[key];
        }

        addEvent(instance, event);

      }

      // Step 7 (New Visit)
      // Step 4 (Old Visit)
      //
      // We will now determine hook triggers and set the session references for the
      // components. The $mounted and $instances stores are populated in this step
      //
      if ($morph === null || (($morph !== null || isReverse) && scope.status === Hooks.MOUNT)) {

        $mounted.add(scope.key);
        $instances.set(scope.key, instance);

        log(Log.VERBOSE, `Component ${scope.define.id} (connect) mounted: ${scope.key}`, Colors.GREEN);

        // This reference is used for onmount hook sequence
        // When initial run, onmount hook will run AFTER connect hook
        // We will hold the index in place to inject when such occurance
        // happens. The ensures execution order of hooks resolve correctly
        // when the connect hook is async and onmount is sync
        let i: number = -1;

        if (scope.hooks.connect === HookStatus.DEFINED) {

          promises.push([ scope.key, 'connect' ]);
          instance.scope.status = Hooks.CONNNECT;

          i = promises.length - 1;

        }

        if (scope.hooks.onmount === HookStatus.DEFINED) {

          i > -1 ? promises[i].push('onmount') : promises.push([ scope.key, 'onmount' ]);

        }

      }
    };
  }

  // Mark Snapshot
  //
  // Intial visits require snapshot sync to apply. All visits thereafter
  // will augment and align snapshots during morph/render operations.
  //
  $.page.type === VisitType.INITIAL && snap.sync(snapshot);

  // Mount Components
  //
  // Our final operation is to mount the component. The promises[] array
  // will be populated with entries which we will iterate over and initialize.
  //
  // We can resolve id promises[] is empty.
  //
  return promises.length > 0 ? mount(promises) : Promise.resolve();

};
