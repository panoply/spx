import spx, { SPX } from 'spx';
import m from 'mithril';

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
    dom: any
    status: any
    alias:any
    instanceOf:any
    key:any
    ref:any
    snap:any
    inFragment:any
  },
  state: SPX.Scope['state']
  binds: SPX.Scope['binds']
  events: SPX.Scope['events']
  nodes: SPX.Scope['nodes']
}

export interface Data {
  [instanceOf: string]: {
    [ref: string]: DataScope
  }
}

export const state = new class {

  tabs: Tabs = {};
  data: Data = {};
  define: { [instanceOf: string]: SPX.Scope['define'] } = {};

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

    for (const { scope } of this.spx.instances.values()) {

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
          snap: scope.snap,
          inFragment: scope.inFragment,
          dom: `${scope.dom}`
        },
        binds: scope.binds,
        events: scope.events,
        nodes: scope.nodes,
        state: scope.state
      };
    }

    m.redraw();
  }

}();
