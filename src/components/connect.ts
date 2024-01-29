import { IComponentInstance, IScope } from '../types/components';
import { $ } from '../app/session';
import { Errors } from '../shared/enums';
import { d, defineProps, m, o } from '../shared/native';
import * as u from '../shared/utils';
import { patch } from '../app/store';
import { addEventAttrs } from './listeners';

/**
 * DOM Elements
 *
 * A temporary Map of component elements obtained during DOM traversal.
 * The entries will be assigned to component instances in POST cycle.
 */
const elements: Map<string, HTMLElement> = m();

/**
 * Walk Elements
 *
 * Walks the component node and executes callback on all `Element` types (i.e, `4`).
 * We cannot `querySelector` attributes which SPX uses due to their syntactical patterns,
 * so we walk the DOM and cherry pick SPX Component specific directives.
 *
 * This function is will traverse the DOM and return Elements from which we analyze and
 * reason with to compose component scopes.
 *
 * **IMPORTANT**
 *
 * All `<svg>` childElements are skipped, SPX does not support reference to child SVG nodes.
 */
export function walkElements <T extends Element> (node: T, callback: (node: T) => void) {

  callback(node);

  let e: Element;
  let i: number;

  if (node.firstElementChild) {
    i = 0;
    e = node.children[i];
  }

  while (e) {

    walkElements(e, callback);

    if (node.nodeName === 'svg') {
      i = node.childElementCount;
      e = node.children[i];
    } else {
      e = node.children[++i];
    }
  }

};

/**
 * Set Attribute Reference
 *
 * Assigns `data-spx="<ref>"` identifer to element nodes
 * and creates record on `$.component.refs` mapping. When a reference
 * exists, a the value will append the identifer using comma separator
 */
export function setAttrRef (node: HTMLElement, nodeId: string, componentId: string) {

  $.components.refs[nodeId] = componentId;

  node.dataset.spx = node.dataset.spx
    ? `${node.dataset.spx},${nodeId}`
    : nodeId;

  elements.set(nodeId, node);

  return nodeId;

}

/**
 * Set Scope
 *
 * Generates Component Scope reference from which we will use when binding
 * to component instances.
 */
export function setScope (instanceOf: string, dom?: HTMLElement): IScope {

  const scope: IScope = o<IScope>();

  scope.instanceOf = instanceOf;
  scope.key = `c.${u.uuid()}`;
  scope.state = o();
  scope.events = o();
  scope.nodes = o();
  scope.binds = o();
  scope.dom = dom ? setAttrRef(dom, scope.key, scope.key) : null;

  return scope;
}

/**
 * Get Values
 *
 * We obtain the SPX attribute values which use object notation
 * syntactical structures. Values can accepts multiple references,
 * which are already handled in an earlier process. This function
 * is called during attribute traversal where a match has occurred.
 *
 * Component values for `nodes`, `events` and `binds` will contain
 * the component name reference and the identifier name reference,
 * this is dot `.` or `:` separated value, (e.g: `"ref.identifer"`).
 * We will split each value entry and return them in the callback.
 *
 * **NOTE**
 *
 * In some cases, no scope will exists because nodes and events can
 * exist outside the `spx-component` element. When no scope exists,
 * we create one, however when this occured the `dom` key will reflect
 * a `null` value. Scopes with a `dom` value of `null` infer that we
 * have encountered a component related element of interest but we have
 * not yet reached its `spx-component` node. Essentially, we create an
 * existing record to populate without needing component element occurance.
 */
export function getValues (
  scopes: Map<string, IScope[]>,
  attrValue: string,
  callback: (scope: IScope, method: string, value: string) => void
) {

  const attrValues = u.attrValueNotation(attrValue);

  for (let i = 0, s = attrValues.length; i < s; i++) {

    const value = attrValues[i];
    const [ instanceOf, method ] = value.split('.');

    if (!scopes.has(instanceOf)) {

      scopes.set(instanceOf, [ setScope(instanceOf) ]);

      callback(scopes.get(instanceOf)[0], method.trim(), value);

    } else {

      callback(u.last(scopes.get(instanceOf)), method.trim(), value);

    }
  }

}

/**
 * Get Component Scope
 *
 * Callback function called for every node in the DOM tree.
 * Attributes are inspected for occurances of `spx-component` or
 * component related directives. When matches are determined, a
 * scope is either generated or an existing scope is augmented.
 *
 * This is a rather expensive operation that will only apply upon
 * first time visits to different pages. Once we have obtained scope,
 * this operation will not apply again.
 */
export function getComponentScope (
  node: HTMLElement,
  scopes: Map<string, IScope[]>
): false | void {

  if ($.components.connected.has(node)) return;

  const { attributes } = node;
  const count = attributes.length;

  // Quick check before proceeding to help prevent unnecessary inspection
  // We don't care about nodes with no attributes or those with 1 or 2 that does
  // not match any of our component specific directives.
  if (count === 0 || (
    (
      count === 1 && (
        $.qs.component.$find.test(attributes[0].name) === false
      )
    ) || (
      count === 2 && (
        $.qs.component.$find.test(attributes[0].name) === false &&
        $.qs.component.$find.test(attributes[1].name) === false
      )
    )
  )) return;

  /**
   * The `spx-component` attribute value
   */
  const attr = node.getAttribute($.qs.component.$attr);

  /* -------------------------------------------- */
  /* NOT SPX COMPONENT ELEMENT                    */
  /* -------------------------------------------- */

  // The node is not "spx-component" but may be component related.
  // We will pass this to setAttrs for futher analysis to determine if
  // the node itself is on interest to us, see the setAttrs logic.
  if (!attr) return setAttrs(node);

  console.log(node);
  /* -------------------------------------------- */
  /* IS SPX COMPONENT ELEMENT                     */
  /* -------------------------------------------- */

  u.forEach(instanceOf => {

    if (!u.hasProp($.components.registry, instanceOf)) {

      u.log(Errors.WARN, `Component does not exist in registry: ${instanceOf}`);

    } else {

      if (scopes.has(instanceOf)) {

        const scope = u.last(scopes.get(instanceOf));

        if (scope.dom !== null) {
          scopes.get(instanceOf).push(setScope(instanceOf, node));
        } else {
          scope.dom = setAttrRef(node, scope.key, scope.key);
        }

      } else {
        scopes.set(instanceOf, [ setScope(instanceOf, node) ]);
      }

      setAttrs(node, instanceOf);

    }

  }, u.attrValueInstanceOf(attr));

  /* -------------------------------------------- */
  /* ATTRIBUTE ANALYSIS                           */
  /* -------------------------------------------- */

  /**
   * Set Attrs
   *
   * This function is responsible for parsing attributes of interest and composing
   * a scope reference which will later be used to extend custom components.
   *
   * The `instanceOf` parameter is optional here. This is important, because when
   * it is defined (type `string`) we are traversing the `spx-component` elements
   * attributes which is where dom define `state` may exists. When `instanceOf` is
   * `undefined` why are analysing all attributes to see is we have a match.
   */
  function setAttrs (node: HTMLElement, instanceOf?: string) {

    /**
     * Schema Prefix
     *
     * When `instanceOf` is passed, we are dealing with an `spx-component` element
     * which accepts `domState` references. This letting holds the attribute prefix
     * value which would be something like `spx-demo:` if controller is `demo`
     */
    let prefix: string = null;

    /**
     * Binding
     *
     * Event binding parameters to be assigned via `attrs` and passed
     * to the method callback on class instances.
     */
    let binding: object = null;

    /**
     * Connect
     *
     * Boolean indicating whether the processed node is related to
     * a component, when `true` we will add the element to the `connected`
     * Set. The connected set will keep track of elements we already have scope
     * of, these are _typically_ elements outside of fragments of persisted nature.
     */
    let connect: boolean = false;

    /* -------------------------------------------- */
    /* WALK ATTRIBUTES                              */
    /* -------------------------------------------- */

    for (let n = attributes.length - 1; n >= 0; n--) {

      const { name, value } = attributes[n];

      if (instanceOf) {

        /* -------------------------------------------- */
        /* SPX COMPONENT ELEMENT                        */
        /* -------------------------------------------- */

        prefix = `${$.config.schema}${instanceOf}:`;

        if (name.startsWith(prefix)) {
          const prop = name.slice(prefix.length);
          u.last(scopes.get(instanceOf)).state[prop] = value;
        }

      } else if ($.qs.component.$param.test(name)) {

        // Ensure we are not dealing with an "spx-data:" attribute
        if (!name.startsWith($.qs.href.$data) && value) {

          /* -------------------------------------------- */
          /* SPX EVENT PARAMS                             */
          /* -------------------------------------------- */

          const [ id, prop ] = name.slice($.config.schema.length).split(':');

          if (!binding) binding = o();
          if (!u.hasProp(binding, id)) binding[id] = o();
          if (!u.hasProp(binding[id], prop)) {
            binding[id][prop] = u.attrValueFromType(value);
            connect = true;
          } else {
            u.log(Errors.WARN, `Duplicated event parameter binding: ${name}="${value}"`);
          }

          continue; // Move to next attribute

        }
      }

      /**
       * Attributes which contain `@` characters are _likely_ events.
       */
      const attrEvent = name.indexOf('@');

      if (attrEvent > -1) {

        /* -------------------------------------------- */
        /* SPX COMPONENT EVENT                          */
        /* -------------------------------------------- */

        const eventName = name.slice(attrEvent + 1);
        const isWindow = eventName.startsWith('window:');

        getValues(scopes, value, ({ events, key }, method) => {
          const uuid = `e.${u.uuid()}`;
          events[uuid] = o();
          events[uuid].element = setAttrRef(node, uuid, key);
          events[uuid].isWindow = isWindow;
          events[uuid].eventName = isWindow ? eventName.slice(7) : eventName;
          events[uuid].attached = false;
          events[uuid].params = null;
          events[uuid].method = method;
          events[uuid].schema = `${method}EventNodes`;
        });

        connect = true;

      } else if (name === $.qs.component.$node) {

        /* -------------------------------------------- */
        /* SPX COMPONENT NODE                           */
        /* -------------------------------------------- */

        getValues(scopes, value, ({ nodes, key }, name) => {
          const uuid = `n.${u.uuid()}`;
          nodes[uuid] = o();
          nodes[uuid].element = setAttrRef(node, uuid, key);
          nodes[uuid].schema = `${name}Nodes`;
        });

        connect = true;

      } else if (name === $.qs.component.$bind) {

        /* -------------------------------------------- */
        /* SPX STATE BINDING                            */
        /* -------------------------------------------- */

        getValues(scopes, value, ({ binds, key }, name) => {
          const uuid = `b.${u.uuid()}`;
          binds[uuid] = o();
          binds[uuid].element = setAttrRef(node, uuid, key);
          binds[uuid].schema = `${name}StateNodes`;
          binds[uuid].persist = false;
          binds[uuid].stateKey = name;
        });

        connect = true;

      }
    }

    if (connect) {
      $.components.connected.add(node);
      connect = false;
    }

    if (binding) {

      for (const instanceOf in binding) {
        u.last(scopes.get(instanceOf)).events[node.dataset.spx].params = binding[instanceOf];
      }

      binding = null;
      connect = false;

    }

  }
}

/**
 * Set Listeners
 *
 * Sets event listeners to custom class component methods.
 */
export function setEvent (instance: IComponentInstance, scope: IScope) {

  const { instanceOf, events } = scope;

  for (const uuid in events) {

    const event = events[uuid];

    if (!u.hasProp(instance, event.method)) {
      u.log(Errors.WARN, `Event callback is undefined: ${instanceOf}.${event.method}()`);
      continue;
    }

    if (event.attached) {
      u.log(Errors.WARN, `Event listener already exists: ${instanceOf}.${event.method}()`);
      continue;
    }

    const node = elements.get(event.element);

    if (!u.hasProp(instance, event.schema)) {
      instance[event.schema] = [ node ];
      instance[event.schema.slice(0, -1)] = instance[event.schema][0];
      event.index = 0;
    } else {
      event.index = instance[event.schema].push(node) - 1;
    }

    if (event.isWindow) {
      addEventListener(event.eventName, addEventAttrs(instance, event));
    } else {
      node.addEventListener(event.eventName, addEventAttrs(instance, event));
    }

    event.attached = true;

    /* CLEANUP ------------------------------------ */

    elements.delete(event.element);
  }
}

export function setNodes (instance: IComponentInstance, scope: IScope) {

  for (const uuid in scope.nodes) {

    const node = scope.nodes[uuid];
    const element = elements.get(node.element);

    if (!u.hasProp(instance, node.schema)) {
      instance[node.schema] = [ element ];
      instance[node.schema.slice(0, -1)] = instance[node.schema][0];
      node.index = 0;
    } else {
      node.index = instance[node.schema].push(element) - 1;
    }

    /* CLEANUP ------------------------------------ */

    elements.delete(node.element);
  }

}

export function setBinds (instance: IComponentInstance, scope: IScope, state: any) {

  for (const uuid in scope.binds) {

    const bind = scope.binds[uuid];

    if (!u.hasProp(state, bind.stateKey)) {
      u.log(Errors.WARN, `Unknown state binding on key: ${scope.instanceOf}.${bind.stateKey}`);
      continue;
    }

    const element = elements.get(bind.element);

    if (!u.hasProp(instance, bind.schema)) {
      instance[bind.schema] = [ element ];
      instance[bind.schema.slice(0, -1)] = instance[bind.schema][0];
      bind.index = 0;
    } else {
      bind.index = instance[bind.schema].push(element) - 1;
    }

    if (u.hasProp(state[bind.stateKey], 'persist') && state[bind.stateKey] !== false) {
      bind.persist = true;
    }

    /* CLEANUP ------------------------------------ */

    elements.delete(bind.element);
  }

}

export function getComponents () {

  const scopes: Map<string, IScope[]> = m();
  const components: string[] = [];
  const unscoped: IScope[] = [];

  walkElements(d(), node => getComponentScope(node, scopes));

  if ($.page.visits === 1) {
    $.snaps[$.page.uuid] = document.documentElement.outerHTML;
  }

  for (const [ instanceOf, scoped ] of scopes) {

    const Component = $.components.registry[instanceOf];
    const { connect } = Component;

    for (const scope of scoped) {

      if (scope.dom !== null) {

        const element = elements.get(scope.dom);
        const instance = new Component(scope, element, connect);

        setEvent(instance, scope);
        setNodes(instance, scope);
        setBinds(instance, scope, connect.state);

        $.components.instances[scope.key] = defineProps(o(), {
          scope: {
            get () { return scope; }
          },
          instance: {
            get () { return instance; }
          }
        });

        if (u.hasProp(instance, 'onInit')) {
          instance.onInit();
        }

        if (!$.components.connected.has(element)) {
          $.components.connected.add(element);
        }

        components.push(scope.key);
        elements.delete(scope.dom);

      } else {

        unscoped.push(scope);

      }
    }

  }

  patch('components', components);

}
