import type { ComponentBinds, ComponentEvent, ComponentNodes, Scope } from 'types';
import { $ } from '../app/session';
import { CharCode, Hooks, HookStatus, Log } from '../shared/enums';
import { b, nil, o } from '../shared/native';
import { log } from '../shared/logs';
import { walkElements } from '../morph/walk';
import { setInstances } from './instances';
import { snap } from './snapshot';
import { isBoolean, isNumeric } from '../shared/regexp';
import { attrJSON, camelCase, defineGetter, equalizeWS, escSelector, isEmpty, last, uuid } from '../shared/utils';
import * as fragment from '../observe/fragment';

/*
  SPX COMPONENT - ALGORITHM

  The components algorithm is a series of functions which execute top > down. There are 2 different traversal
  operations for components in SPX. The first one is the intialization traversal, this occurs at runtime and
  involves walking the DOM. The second operation is an incremental traversal which occurs during morphs. The
  initialization operation executes only once, whereas the incremental traversal occurs for each visit.

  DATASET REFERENCES

  Component elements (root, events, binds and nodes) will be annotated with a data-spx="" value. The value is
  is mapped to instances. Each time we encounter an element of interest (component directive) we mark it with
  an UUID reference via the data-spx="" attribute. The UUID value within that attribute use the following pattern:

  c.a1b2c3  - Components begin with "c"
  b.fw32dk  - Binds begin with "b"
  e.tudhj2  - Events begin with "e"
  n.xcnd34  - Nodes begins with "n"

  In situations where an element is annotated with multiple directives, for example:

  BEFORE:
    <div
      spx@mouseover="ref.callback"
      spx-node="ref.id"
    ></div>

  AFTER:
    <div
      spx@mouseover="ref.callback"
      spx-node="ref.id"
      data-spx="e.tudhj2,n.xcnd34"  << Internal Reference
    ></div>

  Notice in the AFTER example, the data-spx="" value has comma separated UUID refs. The values UUIDs are important
  because these will determine elements of interest during morph operations and will be leveraged to acquire the related instances(see observe.ts).

  CONTEXT > INSTANCE > SCOPE

  The functions on this page are responsible for composing context. Context is represented as a simple data-model
  and it is exposed on a read-only property of components using the name "scope". The scope is what we refer to
  when manipulating components on a per-page basis. Consult the type JSDoc descriptions for more information there.

  SNAPSHOTS

  It's important to note that the algorithm updates snapshots in the cache. This ensures that subsequent visits
  can re-connect events and update nodes in the most effecient manner possible without having to walk the
  entire tree. We use data-spx attributes specifically because our snapshots are DOM strings which we active with
  DOM Parser when visiting new pages. The reference allow us to persist across visits in the session.

*/

export interface Context {
  /**
   * Alias Maps
   */
  $aliases: { [alias: string]: string; };
  /**
   * Component Scopes
   */
  $scopes: { [component: string]: Scope[]; };
  /**
   * When we are applying incremental context generation (i.e: during morphs)
   * this value will be `true`, otherwise `false`.
   *
   * @default false
   */
  $morph: HTMLElement;
  /**
   * Holds a reference to the snapshot, used for creating data-spx="" references
   *
   * @default false
   */
  $snapshot: HTMLElement;
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

export const walkNode = (node: HTMLElement, context: Context): false | Context | void => {

  // Quick check before proceeding to help prevent unnecessary inspection
  //
  if (!isDirective(node.attributes)) return;

  // The node is not "spx-component" but may be component related.
  // We will pass this to setAttrs for futher analysis to determine if
  // the node itself is of interest to us, see the setAttrs logic.
  //
  node.hasAttribute($.qs.$component)
    ? setComponent(node, node.getAttribute($.qs.$component), context)
    : setAttrs(node, context, null, null);

};

/**
 * Normalizes the `spx-component` attribute value and corrects possible malformed
 * identifiers. This `spx-component` attribute can accept multiple component references,
 * this function ensure we can read each entry.
 *
 * We will handle component aliases in this operation and split pass alias names in the
 * callback. The `instanceOf` represents component identifier, whereas `aliasName` represents
 * an alternative identifier passed as `indentifer as alias`
 */
export const getComponentValues = (input: string, cb: (instanceOf: string, aliasName?: string) => void) => {

  const names = input.trim().replace(/\s+/, ' ').split(/[|, ]/);

  for (let i = 0, n = 0, s = names.length; i < s; i++) {
    if (names[i] === nil) continue;
    if ((n = i + 2) < s && names[i + 1] === 'as') {
      cb(camelCase(names[i]), camelCase(names[n]));
      i = n;
    } else {
      cb(camelCase(names[i]), null);
    }
  }

};

/**
 * Event parameter syntacticals provided on elements annotated with
 * event directives. this function will obtain the parameter name and values.
 */
export const getEventParams = (attributes: NamedNodeMap, event: ComponentEvent) => {

  for (let i = 0, s = attributes.length; i < s; i++) {

    const { name, value } = attributes[i];

    // Ensure we are not dealing with an "spx-data:" attribute
    if (!$.qs.$param.test(name) || name.startsWith($.qs.$data) || !value) continue;

    const prop = name.slice($.config.schema.length).split(':').pop();

    if (event.params === null) event.params = o();

    if (!(prop in event.params)) event.params[prop] = getAttrValueType(value);

  }

};

/* -------------------------------------------- */
/* DETERMINATORS                                */
/* -------------------------------------------- */

/**
 * Similar to `isDirectiveLike` but instead validates to ensure the
 * passed in parameter value actually contains a component directive.
 */
export const isDirective = (attrs: string | NamedNodeMap) => {

  if (typeof attrs === 'string') {
    return (
      attrs.indexOf('@') > -1 ||
      attrs === $.qs.$component ||
      attrs === $.qs.$node ||
      attrs === $.qs.$bind
    );
  }

  let i = attrs.length - 1;
  for (; i >= 0; i--) if (isDirective(attrs[i].name)) return true;

  return false;

};

/**
 * Whether or not an element is a child of the root component node.
 * When {@link Scope.status} is set to `2` or `3` (MOUNT or MOUNTED)
 * then component root dom element has already been walked, so we check
 * whether or not the `node` is a decedent of it. If {@link Scope.status}
 * is set to another enum value than we know we are not within bounds.
 */
export const isChild = (scope: Scope, node: HTMLElement) => (
  scope.status === Hooks.MOUNT ||
  scope.status === Hooks.MOUNTED) ? scope.root.contains(node) : false;

/**
 * Whether or not DOM Nodes of {@link Scope.nodes}, {@link Scope.binds}
 * or {@link Scope.events} are live (i.e, mounted). Loops over all entries
 * in the scope records returning `false` if not currently live. This function
 * will negate the need for us having to query the DOM to check for nodes.
 *
 * Expects a `schema` parameters and {@link Scope} reference model for the
 * check to run.
 *
 * > **NOTE**
 * >
 * > This function will exist in the component instance.dom getter
 */
export const isLive = <T extends { [key: string]: any }>(schema: string, input: T) => {

  for (const k in input) {

    // Ensure that our schema matches, otherwise move ahead
    if (input[k].schema !== schema) continue;
    if (input[k].live) return true;

  }

  return false;

};
/**
 * Attribute Value Notation for normalizing and correcting possibly malformed
 * attribute values which use dot `.` notation formats. Returns a string list
 * and all entries contained.
 */
export const getAttrValueNotation = (input: string) => {

  return equalizeWS(input.replace(/\s \./g, '.'))
    .replace(/\s+/g, ' ')
    .trim()
    .split(/[ ,]/);

};

/**
 * Obtains the attribute value type and then converts the strings into
 * relative (real) types.
 */
export const getAttrValueType = (input: string) => {

  if (isNumeric.test(input)) return input === 'NaN' ? NaN : +input;
  if (isBoolean.test(input)) return input === 'true';

  const code = input.charCodeAt(0);

  return code === CharCode.LCB || code === CharCode.LSB ? attrJSON(input) : input; // string value

};

/* -------------------------------------------- */
/* GETTERS                                      */
/* -------------------------------------------- */

/**
 * Returns a context model. This object is used collect and gather information
 * about nodes contained within the DOM that are component related. We will used
 * this to establish instances.
 */
export const getContext = ($morph: HTMLElement = null, $snapshot: HTMLElement = null): Context => {

  return o<Context>({
    $aliases: o(),
    $scopes: o(),
    $element: null,
    $snaps: $morph ? o() : null,
    $morph,
    $snapshot
  });

};

/**
 * Get Selector
 *
 * Returns a valid selector string for querying snapshot elements.
 */
export const getSelector = (node: HTMLElement, attrName: string, attrValue?: string, contains?: boolean) => {

  attrValue ||= node.getAttribute(attrName);

  return `${node.nodeName.toLowerCase()}[${attrName}${contains ? '*=' : '='}"${attrValue}"]`;

};

/**
 * Get Scope
 *
 * Returns the last known component scope reference established.
 * This function will also check aliases but is responsible for
 * obtaining scopes from aliases which follow a component instance.
 */
export const getScope = (id: string, { $scopes, $aliases }: Context) => {

  return id in $aliases ? last($scopes[$aliases[id]]) : id in $scopes
    ? last($scopes[id])
    : ($scopes[id] = [ setScope([ id ]) ])[0];

};

/* -------------------------------------------- */
/* SETTERS                                      */
/* -------------------------------------------- */

/**
 * Define DOM Ref
 *
 * This function is used to set `data-spx` internal reference identifiers
 * on valid elements in the DOM. DOM Refs are imperative and probably the
 * most important aspect to the algorithm.
 *
 * **NOTE**
 *
 * Once an element is marked, we will also add hint to the queue for updating
 * and aligning the snapshot record in cache. See {@link snap} closure function
 * for the handling of that operation. The `selector` parameter MUST be passed
 * in order for the ref to be queued for snapshot alignment.
 */
export const defineDomRef = (node: HTMLElement, instance: string, ref: string, selector?: string) => {

  $.components.$reference[ref] = instance;

  const value = node.getAttribute($.qs.$ref);
  const suffix = value ? `${value},${ref}` : ref;

  node.setAttribute($.qs.$ref, suffix);

  if (selector) snap.add(selector, ref);

  return ref;

};

/**
 * Set Scope
 *
 * This function is responsible for creating a component {@link Scope}.
 * The `scope` of a component contains instance establishment instructions.
 * Triggering this function is how we generate the scope model and parameter
 * existence of `dom` infers that we have encountered an `spx-component` element.
 *
 * All component related elements which no existing scope in {@link Context} will
 * pass through this function and a reference will be established. This operation
 * allows us to have scopes available whenever we encounter component related element.
 */
export const setScope = ([ instanceOf, aliasOf = null ]: string[], root?: HTMLElement, context?: Context): Scope => {

  const key = uuid();
  const scope: Scope = o<Partial<Scope>>({
    key,
    instanceOf,
    ref: `c.${key}`,
    status: Hooks.UNMOUNTED,
    snap: null,
    snapshot: null,
    define: o(),
    state: o(),
    nodes: o(),
    events: o(),
    binds: o(),
    hooks: o()
  });

  scope.hooks.connect = HookStatus.UNDEFINED;
  scope.hooks.onmount = HookStatus.UNDEFINED;
  scope.hooks.unmount = HookStatus.UNDEFINED;
  scope.hooks.onmedia = HookStatus.UNDEFINED;

  // Whenever a dom parameter exists it infers an spx-component
  // annotated element was detected
  if (root) {

    scope.status = Hooks.MOUNT;
    scope.inFragment = fragment.contains(root);
    scope.alias = aliasOf || null;

    defineGetter(scope, 'root', root, true);
    defineDomRef(root, key, scope.ref, getSelector(root, $.qs.$component));

  }

  if ($.components.$registry.has(instanceOf)) {

    scope.instanceOf = instanceOf;

    if (scope.alias) {

      // Aliases cannot match components identifiers in register
      // When false, we can proceed with matching up any dormant aliases.
      if (!$.components.$registry.has(scope.alias)) {

        if (scope.alias in context.$scopes) {

          // This could be potentially expensive but in majority of cases will
          // have little imposed impact. If we reach this iteration cycle then
          // we have reference aliases existing in context which can be matched
          // with the instance of the current component. We need to transfer all
          // the related events, nodes or binds from the dormant context instance
          // to the instance we have currently scoped. The $reference proxy will
          // need to be aligned which is why we "for in" each property and re-assign.
          for (const {
            events,
            nodes,
            binds
          } of context.$scopes[scope.alias]) {

            for (const e in events) {
              scope.events[e] = events[e];
              $.components.$reference[e] = key;
            }

            for (const n in nodes) {
              scope.nodes[n] = nodes[n];
              $.components.$reference[n] = key;
            }

            for (const b in binds) {
              scope.binds[b] = binds[b];
              $.components.$reference[b] = key;
            }

          }

          // We can now dispose of the dormant aliases in scope as they
          // have be mapped and transferred to the current instance.
          delete context.$scopes[scope.alias];

        } else {

          // This storage reference is for dormant scopes which have
          // detected but no component instance is avaiable. An instance
          // could be mapped at another time, so for now we simply assign
          // a existing record in component store.
          context.$aliases[scope.alias] = instanceOf;

        }

      } else {

        log(Log.ERROR, [
          `The component alias ("${scope.alias}") matches a component identifer in the registry.`,
          'An alias reference must be unique and cannot match component names.'
        ]);

      }

    } else {

      scope.alias = null;

    }

  } else {

    instanceOf
      ? scope.alias = instanceOf // scope is a component
      : scope.instanceOf = null; // null when scope is not a component

    if (scope.status === Hooks.MOUNT) {

      // null value signals that while this instanceOf name
      // does not exist in the registry, it might be an alias
      // so we will create the reference.
      context.$aliases[scope.alias] = null;

    }
  }

  return scope;
};

export const setEvent = (node: HTMLElement, name: string, valueRef: string, context: Context) => {

  const eventName = name.slice($.config.schema.length);
  const isWindow = eventName.startsWith('window:');
  const hasOptions = valueRef.indexOf('{');
  const values = valueRef.trim().split(hasOptions > -1 ? /(?<=[$_\w}])\s+(?=[$_\w])/ : /\s+/);

  for (const value of values) {

    const event: ComponentEvent = o();
    const listener = new AbortController();

    /* -------------------------------------------- */
    /* POPULATE MODEL                               */
    /* -------------------------------------------- */

    event.key = `e.${uuid()}`;
    event.isWindow = isWindow;
    event.eventName = isWindow ? eventName.slice(7) : eventName;
    event.attached = false;
    event.selector = getSelector(node, escSelector(name), value, true);
    event.params = null;
    event.options = { signal: listener.signal };

    let attrVal: string = value;

    if (hasOptions > -1) {

      const args = value
        .slice(hasOptions, value.lastIndexOf('}', hasOptions))
        .match(/(passive|once|capture)/g);

      if (args !== null) {
        if (args.indexOf('once') > -1) event.options.once = true;
        if (args.indexOf('passive') > -1) event.options.passive = true;
        if (args.indexOf('capture') > -1) event.options.capture = true;
      }

      attrVal = value.slice(0, hasOptions);

    }

    /* -------------------------------------------- */
    /* EVENT METHOD                                 */
    /* -------------------------------------------- */

    const eventValue = getAttrValueNotation(attrVal);

    // We only allow one method to be passed per event
    // Let's warn if more than 1 sequence is passed.
    if (eventValue.length > 1) {

      log(Log.WARN, `No more than 1 DOM Event listener method allowed in value: ${value}`);

    }

    // Deconstruct event value, we use dot . notation, thus we split.
    const [ instanceOf, method ] = eventValue[0].split('.');
    const scope: Scope = getScope(instanceOf, context);

    event.listener = listener;
    event.method = method.trim();
    event.isChild = isChild(scope, node);

    defineGetter(event, 'dom', node, true);
    defineDomRef(node, scope.key, event.key, event.selector);

    scope.events[event.key] = event;

  }
};

export const setNodes = (node: HTMLElement, value: string, context: Context) => {

  const nodes = getAttrValueNotation(value);

  for (const nodeValue of nodes) {

    const [ instanceOf, keyProp ] = nodeValue.split('.');
    const scope: Scope = getScope(instanceOf, context);
    const selector = `[${$.qs.$node}*="${value}"]`;
    const key = defineDomRef(node, scope.key, `n.${uuid()}`, `${node.nodeName.toLowerCase()}${selector}`);
    scope.nodes[key] = o<ComponentNodes>({
      key,
      keyProp,
      selector,
      dom: context.$element,
      schema: `${keyProp}Nodes`,
      live: true,
      isChild: isChild(scope, node)
    });

  }

};

export const setBinds = (node: HTMLElement, value: string, context: Context) => {

  for (const bindValue of getAttrValueNotation(value)) {

    const [ instanceOf, stateKey ] = bindValue.split('.');
    const scope: Scope = getScope(instanceOf, context);
    const selector = `[${$.qs.$bind}="${value}"]`;
    const key = defineDomRef(node, scope.key, `b.${uuid()}`, `${node.nodeName.toLowerCase()}${selector}`);

    if (!(stateKey in scope.binds)) scope.binds[stateKey] = o();

    scope.binds[stateKey][key] = o<ComponentBinds>({
      key,
      stateKey,
      selector,
      value: node.innerText,
      dom: context.$element,
      live: true,
      stateAttr: `${$.config.schema}${instanceOf}:${stateKey}`,
      isChild: isChild(scope, node)
    });

  }
};

export const setAttrs = (node: HTMLElement, context: Context, instanceOf?: string, alias?: string) => {

  if (instanceOf === null && alias === null) {
    context.$element = uuid();
  }

  for (let n = node.attributes.length - 1; n >= 0; n--) {

    const { name, value } = node.attributes[n];

    if (instanceOf) {

      let schema = `${$.config.schema}${instanceOf}:`;

      // Using alias references, e.g: spx-alias:state=""
      //
      if (alias && !name.startsWith(schema)) schema = `${$.config.schema}${alias}:`;

      if (name.startsWith(schema)) {
        getScope(instanceOf, context).state[camelCase(name.slice(schema.length))] = value;
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

};

export const setComponent = (node: HTMLElement, value: string, context: Context) => {

  getComponentValues(value, (instanceOf, aliasOf) => {

    if (!$.components.$registry.has(instanceOf)) {

      log(Log.ERROR, `Component does not exist in registry: ${instanceOf}`);

    } else {

      let scope: Scope;

      if (instanceOf in context.$scopes) {

        scope = last(context.$scopes[instanceOf]);

        // Getting here means we have the component
        //
        // Status of UNMOUNTED signals that a scope exists and was already created
        // before reaching the component element. In this cases, we can proceed to
        // setting the DOM Reference identifier (i.e, data-spx) and we will also go
        // around and assign the root node getter.
        //
        if (scope.status === Hooks.UNMOUNTED) {

          scope.status = Hooks.MOUNT;
          scope.inFragment = fragment.contains(node);

          defineGetter(scope, 'root', node, true);
          defineDomRef(node, scope.key, scope.ref, getSelector(node, $.qs.$component));

        } else {

          // When the scope status does not equal to UNMOUNTED then we
          // we need to set a new scope, because one already exists. Because
          // our component identifier is present in $scope context, we can simply
          // push it onto the record as it signals another component occurence.
          //
          context.$scopes[instanceOf].push(setScope([ instanceOf, aliasOf ], node, context));

        }

      } else {

        // Getting here requires us to create a reference in our context.
        //
        // When the $scopes model is empty, we will generate a new scope list
        // for each occurance we may come accross in the dom.
        //
        context.$scopes[instanceOf] = [ setScope([ instanceOf, aliasOf ], node, context) ];

      }

      // Lets realign out scope variable to the last known record in the stack
      scope = last(context.$scopes[instanceOf]);

      // Lets handle component alias identifers occurances
      // We will first check for an "as" component identifer alias
      //
      if (aliasOf) {

        context.$aliases[aliasOf] = instanceOf;

      } else if (scope.alias && !(scope.alias in context.$aliases)) {

        if ($.components.$registry.has(scope.alias)) {
          log(Log.WARN, `Alias must not match a component identifier: ${scope.instanceOf} as ${scope.alias}`);
          scope.alias = null;
        } else {
          context.$aliases[scope.alias] = instanceOf;
        }

      }

      // Last process here is walking component directives (attributes)
      //
      setAttrs(node, context, instanceOf, scope.alias);

    }

  });
};

/* -------------------------------------------- */
/* COMPONENTS                                   */
/* -------------------------------------------- */

export const getComponents = (nodes?: Set<HTMLElement> | HTMLElement) => {

  const context: Context = getContext();

  if (!nodes) {

    const snapshot = snap.set($.snapDom.body);

    walkElements(b(), node => walkNode(node, context));

    if (isEmpty(context.$scopes)) return;

    setInstances(context, snapshot);

  } else if (nodes instanceof Set) {

    nodes.forEach(node => walkNode(node, context));
    nodes.clear();

    return context;

  } else {

    walkNode(nodes, context);

    return context;
  }

};
