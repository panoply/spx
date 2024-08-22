import type { ComponentEvent, Scope, ComponentSession, Class } from 'types';
import { type Context } from './context';
import { $ } from '../app/session';
import { Colors, Hooks, Log, VisitType } from '../shared/enums';
import { addEvent } from './listeners';
import { Component as Extended } from './extends';
import { log } from '../shared/logs';
import { mount } from '../observe/components';
import { snap } from './snapshot';
import { element, elements } from '../shared/dom';
import * as u from '../shared/utils';
import * as q from '../app/queries';

/**
 * Define Nodes
 *
 * Assigns the getter/setter node references to component instances.
 * Iterates over nodes in instance {@link Scope} and queries the
 * {@link ComponentSession} (`$elements`) Map which contains the HTMLElements.
 *
 * Each entry in the {@link ComponentNodes} scope model contains a UUID reference
 * named `dom` and the value of `dom` will be the `key` property within `$elements`
 * storage Map.
 */
function defineNodes (instance: Class, { nodes }: Scope) {

  // First, we compose a workable model from the nodes entries,
  // we will use this model to assign the getter/setters on the instance
  // for (const key in nodes) {
  //   const { schema, selector } = nodes[key];
  //   u.hasProp(nodeMap, schema) ? nodeMap[schema].push(selector) : nodeMap[schema] = [ selector ];
  // }

  for (const key in nodes) {

    const { schema, isChild, selector } = nodes[key];

    if (u.hasProp(instance.dom, schema)) continue;

    const domNode = schema.slice(0, -1);
    const hasNode = `has${u.upcase(domNode)}`;

    Object.defineProperties(instance.dom, {
      [domNode]: { get: () => isChild ? instance.root.querySelector(selector) : element(selector) },
      [hasNode]: { get: () => instance.dom[domNode] !== null },
      [schema]: { get: () => elements(selector) }
    });

  }

}

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
export function setInstances ({ $scopes, $aliases, $morph }: Context, snapshot?: HTMLElement) {

  const mounted = q.mounted();
  const isReverse = $.page.type === VisitType.REVERSE;
  const promises: [ scopeKey: string, firstHook: string, nextHook?: string][] = [];
  const { $mounted, $instances, $registry, $reference } = <ComponentSession>$.components;
  const isMounted = u.hasProps(mounted);

  for (const instanceOf in $scopes) {

    for (const scope of $scopes[instanceOf]) {

      if (scope.instanceOf === null) {
        if (u.hasProp($aliases, instanceOf)) {
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
        scope.selector = instance.scope.selector;
        scope.connected = instance.scope.connected;
        scope.status = instance.scope.status = Hooks.MOUNTED;

      } else {

        Component = $registry.get(scope.instanceOf);

        Extended.scopes.set(scope.key, Object.defineProperties(scope, {
          define: { get: () => Component.define }
        }));

        instance = new Component(scope.key);

        scope.hooks.connect = 'connect' in instance;
        scope.hooks.onmount = 'onmount' in instance;
        scope.hooks.unmount = 'unmount' in instance;
        scope.hooks.onmedia = 'onmedia' in instance;

      }

      /* -------------------------------------------- */
      /* NODES                                        */
      /* -------------------------------------------- */

      defineNodes(instance, scope);

      /* -------------------------------------------- */
      /* EVENTS                                       */
      /* -------------------------------------------- */

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

      if ($morph === null || (($morph !== null || isReverse) && scope.status === Hooks.MOUNT)) {

        $mounted.add(scope.key);
        $instances.set(scope.key, instance);

        log(Log.VERBOSE, `Component ${scope.define.id} (connect) mounted: ${scope.key}`, Colors.GREEN);

        // This reference is used for onmount hook sequence
        // When initial run, onmount hook will run AFTER connect hook
        // We will hold the index in place to inject when such occurance
        // happens. The ensures execution order of hooks resolve correctly
        // when the connect hook is async and onmount is sync
        let idx: number = -1;

        if (!scope.connected && scope.hooks.connect) {
          promises.push([ scope.key, 'connect' ]);
          instance.scope.status = Hooks.CONNNECT;
          idx = promises.length - 1;
        }

        if (scope.hooks.onmount) {
          idx > -1 ? promises[idx].push('onmount') : promises.push([ scope.key, 'onmount' ]);
        }

      }
    };
  }

  // Mark Snapshot
  // Intial visits will apply adjustments to snapshot
  //
  $.page.type === VisitType.INITIAL && snap.sync(snapshot);

  // Mount the instance, when promises is populated with entries
  // we will pass the mount() otherwise we simply resolve.
  return promises.length > 0 ? mount(promises) : Promise.resolve();

}
