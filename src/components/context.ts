import type { ComponentBinds, ComponentEvent, ComponentNodes, Scope } from 'types';
import { $ } from '../app/session';
import { Hooks, LogType } from '../shared/enums';
import { d, o } from '../shared/native';
import { log } from '../shared/logs';
import { walkElements } from '../morph/walk';
import { setInstances } from './instances';
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
  $scopes: { [component: string]: Scope[]; }
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
  /**
   * Holds a reference to the last known element identifier
   *
   * @default null
   */
  $snaps: string;
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
export function getEventParams (attributes: NamedNodeMap, event: ComponentEvent) {

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
        //  log(LogType.WARN, `Duplicated event attrs defined: ${name}="${value}"`);
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
    $element: null,
    $nodes: [],
    $morph,
    $snaps: $morph ? o() : null
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

  $.components.$reference[ref] = instance;

  const value = node.getAttribute($.qs.$ref);
  const suffix = value ? `${value},${ref}` : ref;

  node.setAttribute($.qs.$ref, suffix);

  return ref;

}

export function setScope (instanceOf: string, dom?: HTMLElement, context?: Context): Scope {

  const { $registry } = $.components;
  const key = u.uuid();
  const scope: Scope = o<Partial<Scope>>({
    key,
    mounted: Hooks.UNMOUNTED,
    connect: false,
    ref: `c.${key}`,
    state: o(),
    nodes: o(),
    events: o(),
    binds: o()
  });

  if (dom) {

    setRefs(dom, key, scope.ref);

    scope.dom = context.$element;
    scope.mounted = Hooks.MOUNT;
    scope.inFragment = fragment.contains(dom);

    if (dom.hasAttribute('id')) {
      scope.alias = u.camelCase(dom.id.trim());
    }

  }

  if ($registry.has(instanceOf)) {

    scope.instanceOf = instanceOf;

    if (scope.alias) {
      if (!$registry.has(scope.alias)) {
        context.$aliases[scope.alias] = instanceOf;
      } else {
        log(LogType.ERROR, [
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

    if (scope.mounted === Hooks.MOUNT) {

      // null value signals that while this instanceOf name
      // does not exist in the registry, it might be an alias
      // so we will create the reference.
      context.$aliases[scope.alias] = null;

    }
  }

  return scope;
}

export function setEvent (node: HTMLElement, name: string, value: string, context: Context) {

  const event: ComponentEvent = o();
  const hasOptions = value.indexOf('{');
  const eventName = name.slice($.config.schema.length);
  const listener = new AbortController();

  /* -------------------------------------------- */
  /* POPULATE MODEL                               */
  /* -------------------------------------------- */

  event.key = `e.${u.uuid()}`;
  event.dom = `${context.$element}`;
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
    log(LogType.WARN, `No more than 1 DOM Event listener method allowed in value: ${value}`);
  }

  // Deconstruct event value, we use dot . notation, thus we split.
  const [ instanceOf, method ] = eventValue[0].split('.');
  const scope: Scope = getScope(instanceOf, context);

  event.listener = listener;
  event.method = method.trim();

  scope.events[event.key] = event;

  setRefs(node, scope.key, event.key);

}

export function setNodes (node: HTMLElement, value: string, context: Context) {

  for (const nodeValue of u.attrValueNotation(value)) {

    const [ instanceOf, keyProp ] = nodeValue.split('.');
    const scope: Scope = getScope(instanceOf, context);
    const key = setRefs(node, scope.key, `n.${u.uuid()}`);

    scope.nodes[key] = o<ComponentNodes>({
      key,
      keyProp,
      dom: context.$element,
      schema: `${keyProp}Node`,
      isChild: scope.mounted === Hooks.MOUNT
    });

  }

}

export function setBinds (node: HTMLElement, value: string, context: Context) {

  for (const bindValue of u.attrValueNotation(value)) {

    const [ instanceOf, stateKey ] = bindValue.split('.');
    const scope: Scope = getScope(instanceOf, context);
    const key = setRefs(node, scope.key, `b.${u.uuid()}`);

    if (!(stateKey in scope.binds)) {
      scope.binds[stateKey] = o();
    }

    scope.binds[stateKey][key] = o<ComponentBinds>({
      key,
      stateKey,
      value: node.innerText,
      dom: context.$element,
      stateAttr: `${$.config.schema}${instanceOf}:${stateKey}`,
      selector: `[${$.qs.$ref}*=${u.escSelector(key)}]`,
      isChild: scope.mounted === Hooks.MOUNT
    });

  }
}

export function setAttrs (node: HTMLElement, context: Context, instanceOf?: string, alias?: string) {

  if (instanceOf === null && alias === null) {
    context.$element = u.uuid();
    context.$nodes.push(context.$element);
    $.components.$elements.set(context.$element, node);
  }

  for (let n = node.attributes.length - 1; n >= 0; n--) {

    const { name, value } = node.attributes[n];

    if (instanceOf) {

      let schema = `${$.config.schema}${instanceOf}:`;

      if (alias && !name.startsWith(schema)) {
        schema = `${$.config.schema}${alias}:`;
      }

      if (name.startsWith(schema)) {
        getScope(instanceOf, context).state[u.camelCase(name.slice(schema.length))] = value;
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

  const { $registry, $elements } = $.components;
  const { $scopes, $aliases } = context;
  const id = node.hasAttribute('id') ? node.id.trim() : null;

  context.$element = u.uuid();
  context.$nodes.push(context.$element);

  $elements.set(context.$element, node);

  for (const instanceOf of getComponentValues(value)) {

    if (!$registry.has(instanceOf)) {

      log(LogType.ERROR, `Component does not exist in registry: ${instanceOf}`);

    } else {

      let scope: Scope;

      if (instanceOf in $scopes) {

        scope = u.last($scopes[instanceOf]);

        if (scope.mounted === Hooks.UNMOUNTED) {

          setRefs(node, scope.key, scope.ref);

          scope.dom = context.$element;
          scope.mounted = Hooks.MOUNT;
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
