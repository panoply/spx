import type { ComponentEvent, Scope, ComponentSession, ComponentNodes, Class } from 'types';
import type { Context } from './context';
import { $ } from '../app/session';
import { Colors, Hooks, LogType, VisitType } from '../shared/enums';
import { defineProp, defineProps, o, toArray } from '../shared/native';
import { addEvent } from './listeners';
import { Component as Extended } from './extends';
import { morphSnap } from '../morph/snapshot';
import { log } from '../shared/logs';
import { getMounted, patchPage } from '../app/queries';
import { mount } from '../observe/components';
import * as u from '../shared/utils';

/**
 * Define Nodes
 *
 * Assigns the getter/setter node references to component instances.
 * Iterates over nodes in instance {@link Scope} and queries the
 * {@link ComponentSession} (`$elements`) Map which contains the HTMLElements.
 *
 * Each entry in the {@link ComponentNodes} scope model contains a UUID reference
 * named `dom` and the value of `dom` will be the `key` property within `$elements`.
 */
function defineNodes (instance: Class, nodes: { [key: string]: ComponentNodes }) {

  const model: { [schema: string]: string[] } = o();
  const { $elements } = $.components;

  // First, we compose a workable model from the nodes entries,
  // we will use this model to assign the getter/setters on the instance
  for (const key in nodes) {
    if (!(nodes[key].schema in model)) model[nodes[key].schema] = [];
    model[nodes[key].schema].push(nodes[key].dom);
  }

  for (const prop in model) {

    // TODO: Handle multiple nodes
    if (`${prop}s` in instance) continue;

    // Let's re-assign (set) any existing node references
    // with an already defined property key
    if (prop in instance) {
      instance[prop] = model[prop];
      continue;
    }

    let entires = model[prop];

    if (entires.length > 1) {
      defineProps(instance, {
        [prop]: {
          get: () => $elements.get(entires[0]),
          set (id: string[]) { entires = id; }
        },
        [`${prop}s`]: {
          get: () => entires.map(id => $elements.get(id))
        }
      });
    } else {
      defineProp(instance, prop, {
        get: () => $elements.get(entires[0]),
        set (id) { entires = id; }
      });
    }
  }
}

/**
 * Set Instances
 *
 * This function is a final cycle operation that will either establish an
 * instance of a component or update an existing instance. We determine instance
 * upates based on the {@link Context} (`mounted`) value, when `mounted` is `true`
 * there was an `spx-component` defined element during context operations, when
 * `spx-component` is `false` it infers an incremental context operations, wherein
 * either an element `event`, `bind` or `node` was detected.
 *
 * The function will return a Promise resolver, to ensure that asynchronous methods
 * `connect` and/or `onmount` of component classes are gracefully handled. The components
 * observer applies a `thenable` call from which this function has resolved.
 */
export function setInstances ({ $scopes, $aliases, $nodes, $morph }: Context) {

  const isReverse = $.page.type === VisitType.REVERSE;
  const isInitial = !isReverse || $.page.type === VisitType.INITIAL;
  const promises: [
    scopeKey: string,
    firstHook: string,
    nextHook?: string
  ][] = [];

  const { $elements, $connected, $instances, $registry, $reference } = <ComponentSession>$.components;

  for (const instanceOf in $scopes) {
    for (const scope of $scopes[instanceOf]) {

      if (scope.instanceOf === null) {
        if (instanceOf in $aliases) {
          scope.instanceOf = $aliases[instanceOf];
        } else {
          continue;
        }
      }

      /* -------------------------------------------- */
      /* INSTANCE                                     */
      /* -------------------------------------------- */

      let Component: any;
      let instance: Class;

      if (scope.mounted === Hooks.UNMOUNTED && ($morph !== null || isReverse)) {

        const mounted = getMounted();

        if (scope.alias !== null && scope.alias in mounted) {

          instance = mounted[scope.alias][0];
          Component = instance.scope.define;

        } else {

          if (scope.instanceOf in mounted) {
            if (mounted[scope.instanceOf].length === 1) {

              instance = mounted[scope.instanceOf][0];
              Component = instance.scope.define;

            } else {

              // TODO: ERROR - MORE THAN 1 INSTANCE

            }

          } else {

            // TODO: ERROR - NO COMPONENT INSTANCE EXISTS IN INCREMENTAL UPDATE

          }

        }

        if (!instance) {
          log(LogType.WARN, 'Increment component instance failed as instance was undefined', scope);
          continue;
        }

        scope.key = instance.scope.key;
        scope.ref = instance.scope.ref;
        scope.connected = instance.scope.connected;
        scope.mounted = instance.scope.mounted = Hooks.MOUNTED;

      } else {

        Component = $registry.get(scope.instanceOf);
        Extended.scopes.set(scope.key, u.defineGetter(scope, 'define', Component.define) as Scope);
        instance = new Component(scope.key);

      }

      /* -------------------------------------------- */
      /* NODES                                        */
      /* -------------------------------------------- */

      // Only process nodes if they are not open
      if (!u.isEmpty(scope.nodes)) {
        defineNodes(instance, scope.nodes);
      }

      if ($morph === null && 'nodes' in Component && Component.nodes.length > 0) {
        for (const name of Component.nodes) {
          u.defineGetter(instance, `has${u.upcase(name)}Node`, `${name}Node` in instance);
        }
      }

      /* -------------------------------------------- */
      /* EVENTS                                       */
      /* -------------------------------------------- */

      for (const key in scope.events) {

        let event: ComponentEvent;

        if ($morph !== null && scope.mounted === Hooks.MOUNTED) {
          event = instance.scope.events[key] = scope.events[key];
          $reference[key] = scope.key;
        } else {
          event = scope.events[key];
        }

        addEvent(instance, $elements.get(event.dom), event);

      }

      if ($morph === null || (($morph !== null || isReverse) && scope.mounted === Hooks.MOUNT)) {

        $connected.add(scope.key);
        $instances.set(scope.key, instance);

        if ($.logLevel === LogType.VERBOSE) {
          log(LogType.VERBOSE, `Component ${scope.define.name} (connect) mounted: ${scope.key}`, Colors.GREEN);
        }

        // This reference is used for onmount hook sequence
        // When initial run, onmount hook will run AFTER connect hook
        // We will hold the index in place to inject when such occurance
        // happens. The ensures execution order of hooks resolve correctly
        // when the connect hook is async and onmount is syn
        let idx: number = -1;

        if ('connect' in instance) {

          promises.push([ scope.key, 'connect' ]);

          if (isInitial) {
            instance.scope.mounted = Hooks.CONNNECT;
            idx = promises.length - 1;
          }
        }

        if ('onmount' in instance) {
          if (idx > -1) {
            promises[idx].push('onmount');
          } else {
            promises.push([ scope.key, 'onmount' ]);
          }
        }

      }
    };
  }

  // Mark Snapshot
  // Intial visits will apply adjustments to snapshot
  //
  if (isInitial && $nodes.length > 0) {
    patchPage('components', toArray($connected));
    u.onNextTick(() => morphSnap($.snapDom.body, $nodes));
  }

  // Mount the instance, when promises is populated with entries
  // we will pass the mount() otherwise we simply resolve.
  return promises.length > 0
    ? mount(promises)
    : Promise.resolve();

}
