import { Scope } from 'types';

interface Tabs {
  [instanceOf: string]: {
    reference: boolean,
    state: boolean,
    binds: boolean,
    events: boolean,
    nodes: boolean
  }
}

export interface DataScope {
  reference: {
    status: any
    alias:any
    instanceOf:any
    key:any
    ref:any
    dom:any
    selector:any
    snap:any
    inFragment:any
    connected: any
  },
  state: Scope['state']
  binds: Scope['binds']
  events: Scope['events']
  nodes: Scope['nodes']
}

export interface Data {
  [instanceOf: string]: {
    [ref: string]: DataScope
  }
}

export const state = new class {

  tabs: Tabs = {};
  data: Data = {};
  define: { [instanceOf: string]: Scope['define'] } = {};

  get spx () {
    return spx.$;
  }

  get document () {
    return document;
  }

  get snapshot () {
    return this.spx.snapDom;
  }

  get () {

    for (const { scope } of this.spx.components.$instances.values()) {

      if (scope.instanceOf === 'explorer') continue;

      if (!(scope.instanceOf in this.data)) {
        this.data[scope.instanceOf] = {};
        this.define[scope.instanceOf] = scope.define;
      }

      if (!(scope.ref in this.tabs)) {
        this.tabs[scope.ref] = {
          reference: true,
          state: false,
          binds: false,
          events: false,
          nodes: false
        };
      }

      this.data[scope.instanceOf][scope.ref] = {
        reference: {
          status: scope.status,
          alias: scope.alias,
          instanceOf: scope.instanceOf,
          key: scope.key,
          ref: scope.ref,
          dom: scope.dom,
          selector: scope.selector,
          snap: scope.snap,
          inFragment: scope.inFragment,
          connected: scope.connected
        },
        binds: scope.binds,
        events: scope.events,
        nodes: scope.nodes,
        state: scope.state
      };
    }

  }

}();
