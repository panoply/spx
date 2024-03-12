import type { ComponentEvent, Scope, SPX, ComponentSession, ComponentNodes } from 'types';
import type { Context } from './context';
import { $ } from '../app/session';
import { Colors, LogType, VisitType } from '../shared/enums';
import { defineProp, defineProps, o } from '../shared/native';
import { addEvent } from './listeners';
import { Component as Extended } from './extends';
import { morphSnap } from '../morph/snapshot';
import { log } from '../shared/logs';
import { getMounted } from '../app/queries';
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
function defineNodes (instance: SPX.Class, nodes: { [key: string]: ComponentNodes }) {

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
 * `oninit` and/or `onload` of component classes are gracefully handled. The components
 * observer applies a `thenable` call from which this function has resolved.
 */
export function setInstances ({ $scopes, $aliases, $nodes, $morph }: Context) {

  const isReverse = $.page.type === VisitType.REVERSE;
  const promises: [instance: SPX.Class, method: string][] = [];
  const {
    $elements,
    $connected,
    $instances,
    $registry,
    $reference
  } = <ComponentSession>$.components;

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
      let instance: SPX.Class;

      if (scope.mounted === false && ($morph !== null || isReverse)) {

        const mounted = getMounted();

        if (scope.alias !== null && scope.alias in mounted) {

          instance = mounted[scope.alias][0];
          Component = instance.scope.static;

        } else {

          if (scope.instanceOf in mounted) {
            if (mounted[scope.instanceOf].length === 1) {

              instance = mounted[scope.instanceOf][0];
              Component = instance.scope.static;

            } else {

              // TODO: ERROR - MORE THAN 1 INSTANCE

            }

          } else {

            // TODO: ERROR - NO COMPONENT INSTANCE EXISTS IN INCREMENTAL UPDATE
          }

        }

        scope.key = instance.scope.key;
        scope.ref = instance.scope.ref;

      } else {

        Component = $registry.get(scope.instanceOf);
        Extended.scopes.set(scope.key, u.defineGetter(scope, 'static', Component.connect) as Scope);
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

        if ($morph !== null && scope.mounted === false) {
          event = instance.scope.events[key] = scope.events[key];
          $reference[key] = instance.scope.key;
        } else {
          event = scope.events[key];
        }

        addEvent(instance, $elements.get(event.dom), event);

      }

      if ($morph === null || (($morph !== null || isReverse) && scope.mounted === true)) {

        $connected.add(scope.key);
        $instances.set(scope.key, instance);

        log(LogType.VERBOSE, `Component ${scope.static.id} (oninit) mounted: ${scope.key}`, Colors.GREEN);

        if ('oninit' in instance) promises.push([ instance, 'oninit' ]);
        if ('onload' in instance) promises.push([ instance, 'onload' ]);

      }
    };
  }

  // Mark Snapshot
  // Intial visits will apply adjustments to snapshot
  //
  if ($.page.type === VisitType.INITIAL && $nodes.length > 0) {
    u.onNextTick(() => morphSnap($.snapDom.body, $nodes));
  }

  // Mount the instance, when promises is populated with entries
  // we will pass the mount() otherwise we simply resolve.
  return promises.length > 0
    ? mount(promises)
    : Promise.resolve();

}
