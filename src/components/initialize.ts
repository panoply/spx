import { IComponentEvent, IScope } from '../types/components';
import { $ } from '../app/session';
import { Errors } from '../shared/enums';
import { d, nil, o } from '../shared/native';
import * as u from '../shared/utils';
import { getScope, setScope } from './scopes';
import { patch, current } from '../app/store';
import { on } from '../app/events';

/**
 * Walk Nodes
 *
 * Walks the component node and executes callback on all `Element` types (i.e: `1`).
 * We cannot querySelector attributes SPX requires, this function allows us to
 * walk the DOM and cherry pick SPX Component events, nodes and nested components.
 */
export function walkNodes (node: HTMLElement, callback: (node: HTMLElement) => false | void) {

  if (callback(node) === false) return false;

  let childNode: ChildNode;
  let i: number;

  if (node.childNodes) {
    i = 0;
    childNode = node.childNodes[i];
  }

  while (childNode) {
    if (childNode.nodeType === 1 && walkNodes(childNode as HTMLElement, callback) === false) return false;
    childNode = node.childNodes[++i];
  }

};

/**
 * Get Values
 *
 * We obtain the SPX attribute values which use object notation syntactical structures.
 * This function is used to split each value entry and return them in the callback
 */
function getValues (attrValues: string[], callback: (id: string, ref: string) => void) {

  for (const attrValue of attrValues) {
    const [ id, method ] = attrValue.split('.');
    callback(id, method.trim());
  }

}

export function getComponentState (
  node: HTMLElement,
  scopes: { [id: string]: IScope[] }
): false | void {

  const { attributes } = node;
  const count = attributes.length;

  if (count === 0) return;
  if (count === 1 && !$.qs.$componentAttrs.test(attributes[0].name)) return;

  const attrs = node.getAttributeNames();

  if (!node.hasAttribute($.qs.$component)) return setAttrs(node, attrs);

  const instanceOf = u.attrValueInstanceOf(node.getAttribute($.qs.$component));

  u.forEach(id => {

    if (!u.hasProp($.components.registar, id)) {
      u.log(Errors.WARN, `Component does not exist in the register: ${id}`);
      return;
    }

    if (current().components.includes(id)) return;

    if (u.hasProp(scopes, id)) {

      const scope = getScope(scopes[id]);

      if (scope.domNode !== null) {
        scopes[id].push(setScope(id, node));
      } else {
        scope.domNode = node;
        scope.key = node.id || u.uuid();
      }

    } else {

      scopes[id] = [ setScope(id, node) ];

    }

    setAttrs(node, attrs, id);

  }, instanceOf);

  function setAttrs (node: HTMLElement, attrs: string[], instanceOf?: string) {

    let eventBinding: object = null;

    u.forEach(nodeAttr => {

      if (instanceOf) {

        const prefix = `${$.config.schema}${instanceOf}:`;

        if (nodeAttr.startsWith(prefix)) {
          const prop = nodeAttr.slice(prefix.length);
          getScope(scopes[instanceOf]).domState[prop] = node.getAttribute(nodeAttr);
        }

      } else {

        if ($.qs.$componentBinds.test(nodeAttr)) {

          const [ id, prop ] = nodeAttr.slice($.config.schema.length).split(':');
          const nodeValue = node.getAttribute(nodeAttr) || nil;

          if (!eventBinding) eventBinding = o();
          if (!u.hasProp(eventBinding, id)) eventBinding[id] = o();
          if (!u.hasProp(eventBinding[id], prop)) {
            eventBinding[id][prop] = u.attrValueFromType(nodeValue);
          } else {
            u.log(Errors.WARN, `Duplicated event data binding: ${nodeAttr}="${nodeValue}"`);
          }

          return;

        }

      }

      const attrEvent = nodeAttr.indexOf('@');
      const attrValue = u.attrValueNotation(node.getAttribute(nodeAttr));

      if (attrEvent > -1) {

        const event: IComponentEvent = o();
        const eventName = nodeAttr.slice(attrEvent + 1);

        event.isWindow = eventName.startsWith('window:');
        event.eventName = event.isWindow ? eventName.slice(7) : eventName;
        event.attached = false;
        event.binding = null;

        getValues(attrValue, (id, method) => {

          if (!u.hasProp(scopes, id)) scopes[id] = [ setScope(id) ];
          if (instanceOf && id !== instanceOf) return;

          event.method = method;

          const { listeners } = getScope(scopes[id]);

          listeners.has(node)
            ? listeners.get(node).push(event)
            : listeners.set(node, [ event ]);

        });

      } else if (nodeAttr === $.qs.$node) {

        getValues(attrValue, (id, name) => {

          if (!u.hasProp(scopes, id)) scopes[id] = [ setScope(id) ];
          if (instanceOf && id !== instanceOf) return;

          const { nodes } = getScope(scopes[id]);
          nodes.has(name)
            ? nodes.get(name).push(node)
            : nodes.set(name, [ node ]);

        });

      }

    }, attrs);

    if (eventBinding) {

      for (const id in eventBinding) {
        const { listeners } = getScope(scopes[id]);
        const events = listeners.get(node);
        events[events.length - 1].binding = eventBinding[id];
      }

      eventBinding = null;

    }

  }

}

function addEventBinding (instance: any, { method, binding }: IComponentEvent) {

  const eventMethod: ()=> void = instance[method];

  return (event: Event) => {
    if (binding) u.defineGetter(event, 'attrs', binding);
    return eventMethod.call(instance, event);
  };
}

export function connect () {

  // if ($.observe.components) return;

  const scopes: { [instanceOf: string]: IScope[] } = o();

  walkNodes(d(), (node) => getComponentState(node, scopes));

  const hasInstance = u.hasProps($.components.instances);
  const setInstance = u.defineGetter($.components.instances);
  const components: string[] = [];

  for (const id in scopes) {

    const Instance = $.components.registar[id];

    u.forEach(scope => {

      if ($.components.scopes.has(scope.key)) return;

      if (!$.components.scopes.has(scope.key)) {
        $.components.scopes.set(scope.key, scope);
      }

      const instance = new Instance(scope.key);
      const has = u.hasProps(instance);

      for (const [ target, listeners ] of scope.listeners) {

        u.forEach((event) => {

          if (!has(event.method)) {
            return u.log(Errors.WARN, `Event callback is undefined: ${id}.${event.method}()`);
          }

          if (event.attached) {
            return u.log(Errors.WARN, `Event listener already exists: ${id}.${event.method}()`);
          }

          if (event.isWindow) {
            addEventListener(event.eventName, addEventBinding(instance, event));
          } else {
            target.addEventListener(event.eventName, addEventBinding(instance, event));
          }

          event.attached = true;

        }, listeners);
      }

      if (!hasInstance(scope.key)) {

        setInstance(scope.key, instance);

        if (has('onInit')) instance.onInit();
        if (has('onLoad')) on('load', instance.onLoad, instance);

      }

      components.push(scope.key);

    }, scopes[id]);

  }

  patch('components', components);

  $.observe.components = true;

}

export function disconnect () {

  if (!$.observe.components) return false;

  for (const [ uuid, scope ] of $.components.scopes) {

    const instance = $.components.instances[uuid];

    for (const [ target, listeners ] of scope.listeners) {

      u.forEach((ev) => {

        if (!ev.attached) return;

        if (ev.isWindow) {
          removeEventListener(ev.eventName, instance[ev.method]);
        } else {
          target.removeEventListener(ev.eventName, instance[ev.method]);
        }

        ev.attached = false;

      }, listeners);

      if (u.hasProp(instance, 'onExit')) instance.onExit();

    }

  }

  // $.observe.components = false;

}
