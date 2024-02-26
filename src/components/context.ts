import { IComponentBinds, IComponentEvent, IComponentNodes, IScope, SPX } from '../types/components';
import { Errors, VisitType } from '../shared/enums';
import { d, defineProp, o } from '../shared/native';
import { addEvent } from './listeners';
import { markComponents, markSnap } from '../morph/snapshot';
import { log } from '../shared/logs';
import { getMounted } from '../app/queries';
import { $ } from '../app/session';
import * as u from '../shared/utils';
import * as fragment from '../observe/fragment';

/*
  SPX COMPONENT - ALGORITHM

  The components algorithm is a series of functions which execute top > down. There are 2 different traversal
  operations for components in SPX. The first one is the intialization traversal, this occurs at runtime and
  involves walking the DOM. The second operation is a incremental traversal which occurs during morphs. The
  initialization operation executes only once, whereas the incremental traversal occurs for each visit.

  DATASET REFERENCES

  Component elements (dom, events, binds and nodes) will be annotated with a data-spx="" value. The value is
  is mapped to instances. Each time we encounted an element of interest (component directive) we mark it with
  an UUID reference on the data-spx="" attribute. UUID marks use the following pattern:

  c.a1b2c3  - Components begin with "c"
  b.fw32dk  - Binds begin with "b"
  e.tudhj2  - Events begin with "e"
  n.xcnd34  - Nodes begins with "n"

  In situations where an element is annotated with multiple directive, the reference will be comma separated.
  When determine the element of interest in morph operations and acquire the related instance (see observe.ts).

  CONTEXT > INSTANCE > SCOPE

  The functions on this page are responsible for composing context. Context is represented as a simple data-model
  and it is exposed on a read-only property of components using the name "scope". The scope is what we refer to
  when manipulating components on a per-page basis. Consult the type JSDoc descriptions for more information there.

  SNAPSHOTS

  It's important to note that the algorithm updates snapshots in the cache. This ensure that subsequent visits
  can re-connect events and updates nodes in the most effecient manner possible, without having to walk the
  entire tree. We use data-spx attributes specifically because our snapshots are DOM strings which we active with
  DOM Parser when visiting new pages. The reference allow us to persist across visits in the session.
*/

export interface Context {
  /**
   * Alias Maps
   */
  $aliases: { [alias: string]: string; }
  /**
   * Component Scopes
   */
  $scopes: { [component: string]: IScope[]; }
  /**
   * Holds a temporary storage of HTML Elements that have been marked with
   * a reference dataset value. The entries will be used to align snapshots.
   *
   * @default []
   */
  $nodes: string[];
  /**
   * When we are applying incremental context generation (i.e: during morphs)
   * this value will be `true`, otherwise `false`.
   *
   * @default false
   */
  $morph: HTMLElement;
  /**
   * Holds a reference to the last known element identifier
   *
   * @default null
   */
  $element: string;
}

/* -------------------------------------------- */
/* DOM WALKS                                    */
/* -------------------------------------------- */

/**
 * Get InstanceOf
 *
 * Normalizes the `spx-component` attribute value and corrects possible malformed
 * identifiers. This `spx-component` attribute can accept multiple component references,
 * this function ensure we can read each entry.
 */
export function getComponentValues (input: string) {

  return input
    .trim()
    .replace(/\s+/, ' ')
    .split(/[|, ]/)
    .map(u.camelCase);

}

/**
 * Get Event Attrs
 *
 * Event parameter syntacticals provided on elements annotated with event directives.
 */
export function getEventParams (attributes: NamedNodeMap, event: IComponentEvent) {

  for (let i = 0, s = attributes.length; i < s; i++) {

    const { name, value } = attributes[i];

    if (!$.qs.$param.test(name)) continue;

    // Ensure we are not dealing with an "spx-data:" attribute
    if (!name.startsWith($.qs.$data) && value) {

      const prop = name.slice($.config.schema.length).split(':').pop();

      if (event.params === null) event.params = o();

      if (!(prop in event.params)) {
        event.params[prop] = u.attrValueFromType(value);
      } else {
        //  log(Errors.WARN, `Duplicated event attrs defined: ${name}="${value}"`);
      }

    }

  }

}

/**
 * Is Directive
 *
 * Similar to `isDirectiveLike` but instead validates to ensure the
 * passed in parameter value actuall contains a component directive.
 */
export function isDirective (attrs: string | NamedNodeMap) {

  if (typeof attrs === 'string') {

    return (
      attrs.indexOf('@') > -1 ||
      attrs === $.qs.$component ||
      attrs === $.qs.$node ||
      attrs === $.qs.$bind
    );

  }

  for (let i = attrs.length - 1; i >= 0; i--) {
    if (isDirective(attrs[i].name)) return true;
  }

  return false;

}

/**
 * Walk Elements
 *
 * Walks the component node and executes callback on all `Element` types (i.e, `4`).
 * We cannot `querySelector` attributes which SPX uses due to their syntactical patterns,
 * so we walk the DOM and cherry pick SPX Component specific directives.
 *
 * This function is will traverse the DOM and return Elements from which we analyze and
 * reason with to compose component scopes.
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

    if ((e.nodeName === 'svg' || e.nodeName === 'CODE') && e.childElementCount > 0) {
      i = 0;
      e = e.nextElementSibling;
    }

    if (e) walkElements(e, callback);

    e = node.children[++i];

  }

};

export function walkNode (node: HTMLElement, context: Context): false | Context | void {

  // Quick check before proceeding to help prevent unnecessary inspection
  // We don't care about nodes with no attributes or those with 1 or 2 that does
  // not match any of our component specific directives.
  //
  if (!isDirective(node.attributes)) return;

  // The node is not "spx-component" but may be component related.
  // We will pass this to setAttrs for futher analysis to determine if
  // the node itself is on interest to us, see the setAttrs logic.
  //
  if (node.hasAttribute($.qs.$component)) {
    setComponent(node, node.getAttribute($.qs.$component), context);
  } else {
    setAttrs(node, context, null, null);
  }

}

/* -------------------------------------------- */
/* GETTERS                                      */
/* -------------------------------------------- */

export function getContext ($morph: HTMLElement = null): Context {

  return o<Context>({
    $aliases: o(),
    $scopes: o(),
    $nodes: [],
    $element: null,
    $morph
  });

}

export function getScope (id: string, { $scopes, $aliases }: Context) {

  if (!(id in $scopes)) {
    if (id in $aliases) return u.last($scopes[$aliases[id]]);
    $scopes[id] = [ setScope(id) ];
    return $scopes[id][0];
  }

  return id in $aliases ? u.last($scopes[$aliases[id]]) : u.last($scopes[id]);

}

/* -------------------------------------------- */
/* SETTERS                                      */
/* -------------------------------------------- */

export function setRefs (node: HTMLElement, instance: string, ref: string) {

  $.components.reference[ref] = instance;

  const value = node.getAttribute($.qs.$ref);
  const suffix = value ? `${value},${ref}` : ref;

  node.setAttribute($.qs.$ref, suffix);

  return ref;

}

export function setScope (instanceOf: string, dom?: HTMLElement, context?: Context): IScope {

  const { registry } = $.components;
  const key = u.uuid();
  const scope: IScope = o<Partial<IScope>>({
    key,
    mounted: false,
    ref: `c.${key}`,
    state: o(),
    nodes: o(),
    events: o(),
    binds: o(),
    context: o({
      nodes: o(),
      binds: o()
    })
  });

  if (dom) {

    setRefs(dom, key, scope.ref);

    scope.el = context.$element;
    scope.mounted = true;
    scope.inFragment = fragment.contains(dom);

    if (dom.hasAttribute('id')) {
      scope.alias = u.camelCase(dom.id.trim());
    }

  }

  if (registry.has(instanceOf)) {

    scope.instanceOf = instanceOf;

    if (scope.alias) {
      if (!registry.has(scope.alias)) {
        context.$aliases[scope.alias] = instanceOf;
      } else {
        log(Errors.ERROR, [
          `Component alias "${scope.alias}" matches a component identifer in the registry.`,
          'An alias reference must be unique and cannot match component names.'
        ]);
      }
    } else {
      scope.alias = null;
    }

  } else {

    scope.alias = instanceOf || null;
    scope.instanceOf = null;

    if (scope.mounted) {

      // null value signals that while this instanceOf name
      // does not exist in the registry, it might be an alias
      // so we will create the reference.
      context.$aliases[scope.alias] = null;

    }
  }

  return scope;
}

export function setEvent (node: HTMLElement, name: string, value: string, context: Context) {

  const event: IComponentEvent = o();
  const hasOptions = value.indexOf('{');
  const eventName = name.slice($.config.schema.length);
  const listener = new AbortController();

  /* -------------------------------------------- */
  /* POPULATE MODEL                               */
  /* -------------------------------------------- */

  event.key = `e.${u.uuid()}`;
  event.el = `${context.$element}`;
  event.isWindow = eventName.startsWith('window:');
  event.eventName = event.isWindow ? eventName.slice(7) : eventName;
  event.attached = false;
  event.params = null;
  event.options = { signal: listener.signal };

  let attrVal: string = value;

  if (hasOptions > -1) {

    const args = value
      .slice(hasOptions, value.lastIndexOf('}', hasOptions))
      .match(/(passive|once)/g);

    if (args !== null) {
      if (args.indexOf('once') > -1) {
        event.options.once = true;
      }
      if (args.indexOf('passive') > -1) {
        event.options.passive = true;
      }
    }

    attrVal = value.slice(0, hasOptions);

  }

  /* -------------------------------------------- */
  /* EVENT METHOD                                 */
  /* -------------------------------------------- */

  const eventValue = u.attrValueNotation(attrVal);

  // We only allow one method to be passed per event
  // Let's warn if more than 1 sequence is passed.
  if (eventValue.length > 1) {
    log(Errors.WARN, `No more than 1 DOM Event listener method allowed in value: ${value}`);
  }

  // Deconstruct event value, we use dot . notation, thus we split.
  const [ instanceOf, method ] = eventValue[0].split('.');
  const scope: IScope = getScope(instanceOf, context);

  event.listener = listener;
  event.method = method.trim();

  scope.events[event.key] = event;

  setRefs(node, scope.key, event.key);

}

export function setNodes (node: HTMLElement, value: string, context: Context) {

  for (const nodeValue of u.attrValueNotation(value)) {

    const [ instanceOf, keyProp ] = nodeValue.split('.');
    const scope: IScope = getScope(instanceOf, context);
    const key = setRefs(node, scope.key, `n.${u.uuid()}`);

    if (!(keyProp in scope.context.nodes)) scope.context.nodes[keyProp] = [];

    scope.nodes[key] = o<IComponentNodes>({
      key,
      keyProp,
      el: context.$element,
      schema: `${keyProp}Node`,
      index: scope.context.nodes[keyProp].push(key) - 1,
      isChild: scope.mounted
    });

  }

}

export function setBinds (node: HTMLElement, value: string, context: Context) {

  for (const bindValue of u.attrValueNotation(value)) {

    const [ instanceOf, stateKey ] = bindValue.split('.');
    const scope: IScope = getScope(instanceOf, context);
    const key = setRefs(node, scope.key, `b.${u.uuid()}`);

    if (!(stateKey in scope.context.binds)) scope.context.binds[stateKey] = [];

    scope.binds[key] = o<IComponentBinds>({
      key,
      stateKey,
      index: scope.context.binds[stateKey].push(key) - 1,
      el: context.$element,
      stateAttr: `${$.config.schema}${instanceOf}:${stateKey}`,
      selector: `[${$.qs.$ref}*=${u.escSelector(key)}]`,
      schema: `${stateKey}Bind`,
      isChild: scope.mounted
    });

  }
}

export function setAttrs (node: HTMLElement, context: Context, instanceOf?: string, alias?: string) {

  if (instanceOf === null && alias === null) {
    context.$element = u.uuid();
    context.$nodes.push(context.$element);
    $.components.elements.set(context.$element, node);
  }

  for (let n = node.attributes.length - 1; n >= 0; n--) {

    const { name, value } = node.attributes[n];

    if (instanceOf) {

      let schema = `${$.config.schema}${instanceOf}:`;

      if (alias && !name.startsWith(schema)) {
        schema = `${$.config.schema}${alias}:`;
      }

      if (name.startsWith(schema)) {
        getScope(instanceOf, context).state[name.slice(schema.length)] = value;
      }
    }

    /* -------------------------------------------- */
    /* DIRECTIVES                                   */
    /* -------------------------------------------- */

    if (name.indexOf('@') > -1) {
      setEvent(node, name, value, context);
    } else if (name === $.qs.$bind) {
      setBinds(node, value, context);
    } else if (name === $.qs.$node) {
      setNodes(node, value, context);
    }

  }

}

export function setComponent (node: HTMLElement, value: string, context: Context) {

  const { registry, elements } = $.components;
  const { $scopes, $aliases } = context;
  const id = node.hasAttribute('id') ? node.id.trim() : null;

  context.$element = u.uuid();
  context.$nodes.push(context.$element);
  elements.set(context.$element, node);

  for (const instanceOf of getComponentValues(value)) {

    if (!registry.has(instanceOf)) {

      log(Errors.ERROR, `Component does not exist in registry: ${instanceOf}`);

    } else {

      let scope: IScope;

      if (instanceOf in $scopes) {

        scope = u.last($scopes[instanceOf]);

        if (scope.mounted === false) {

          setRefs(node, scope.key, scope.ref);

          scope.el = context.$element;
          scope.mounted = true;
          scope.inFragment = fragment.contains(node);

        } else {

          $scopes[instanceOf].push(
            setScope(
              instanceOf,
              node,
              context
            )
          );
        }

      } else {
        $scopes[instanceOf] = [
          setScope(
            instanceOf,
            node,
            context
          )
        ];
      }

      scope = u.last($scopes[instanceOf]);

      if (id && !(id in $aliases)) {
        $aliases[id] = instanceOf;
      }

      setAttrs(node, context, instanceOf, scope.alias);

    }

  };

}

function setNodeContext (instance: SPX.Class, scope: IScope) {

  for (const prop in scope.context.nodes) {

    const keys = scope.context.nodes[prop];

    if (keys.length === 1) {

      const node = scope.nodes[keys[0]];

      if (!(node.schema in instance)) {
        defineProp(instance, node.schema, {
          get (this: SPX.Class) {
            return $.components.elements.get(node.el);
          }
        });
      }

    } else {

      for (const key of keys) {

        const schema = `${key}s`;

        if (!(schema in instance)) {
          defineProp(instance, schema, {
            get (this: SPX.Class) {
              const { elements } = $.components;
              const { context, nodes } = this.scope;
              return context.nodes[prop].map(id => elements.get(nodes[id].el));
            }
          });
        }
      }
    }

  }
}

export function setInstances ({ $scopes, $aliases, $nodes, $morph }: Context) {

  // Mark Snapshot
  // Intial visits will apply adjustments to snapshot
  //
  if ($.page.type === VisitType.INITIAL && $nodes.length > 0) markSnap($nodes);

  const isReverse = $.page.type === VisitType.REVERSE;
  const snapMarks = [];
  const {
    elements,
    connected,
    instances,
    registry,
    reference
  } = $.components;

  for (const instanceOf in $scopes) {
    for (const scope of $scopes[instanceOf]) {

      if (scope.instanceOf === null) {
        if (instanceOf in $aliases) {
          scope.instanceOf = $aliases[instanceOf];
        } else {
          continue;
        }
      }

      let Component: any;
      let instance: SPX.Class;

      if (scope.mounted === false && ($morph !== null || isReverse)) {

        const mounted = getMounted();

        if (scope.alias !== null && scope.alias in mounted) {

          instance = mounted[scope.alias][0];
          Component = instance.static;

        } else {

          if (scope.instanceOf in mounted) {
            if (mounted[scope.instanceOf].length === 1) {

              instance = mounted[scope.instanceOf][0];
              Component = instance.static;

            } else {

              // ERROR - MORE THAN 1 INSTANCE

            }

          } else {

            // ERROR - NO COMPONENT INSTANCE EXISTS IN INCREMENTAL UPDATE
          }

        }

        scope.key = instance.scope.key;
        scope.ref = instance.scope.ref;

        snapMarks.push([
          `[${$.qs.$component}*=${u.escSelector(instance.scope.instanceOf)}]`,
          instance.scope.key
        ]);

      } else {

        Component = registry.get(scope.instanceOf);
        instance = new Component(scope, Component.connect);

      }

      setNodeContext(instance, scope);

      if ($morph === null && 'nodes' in Component && Component.nodes.length > 0) {
        for (const name of Component.nodes) {
          defineProp(instance, `has${u.upcase(name)}Node`, {
            get () {
              return `${name}Node` in instance;
            }
          });
        }
      }

      for (const key in scope.events) {

        let event: IComponentEvent;

        if ($morph !== null && scope.mounted === false) {
          event = instance.scope.events[key] = scope.events[key];
          reference[key] = instance.scope.key;
        } else {
          event = scope.events[key];
        }

        addEvent(instance, elements.get(event.el), event);

      }

      if ($morph === null || (($morph !== null || isReverse) && scope.mounted === true)) {

        connected.add(scope.key);
        instances.set(scope.key, instance);

        log(Errors.TRACE, `Mounted (init) component ${instance.static.id} (${scope.key})`, '#6dd093');

        if ('oninit' in instance) instance.oninit($.page);

      }

    };

  }

  u.onNextTick(() => markComponents(snapMarks));

}

/* -------------------------------------------- */
/* COMPONENTS                                   */
/* -------------------------------------------- */

export function getComponents (nodes?: Set<HTMLElement> | HTMLElement) {

  const context: Context = getContext();

  if (!nodes) {

    walkElements(d(), node => walkNode(node, context));

    if (u.isEmpty(context.$scopes)) return;

    setInstances(context);

  } else if (nodes instanceof Set) {

    for (const node of nodes) walkNode(node, context);

    nodes.clear();

    return context;

  } else {

    walkNode(nodes, context);

    return context;
  }

}
