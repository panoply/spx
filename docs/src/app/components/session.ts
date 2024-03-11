import { JSONTree, Tree } from '../modules/json-tree';
import spx from 'spx';
import relapse, { Relapse } from 'relapse';

export class Session extends spx.Component<typeof Session.connect> {

  static connect = {
    state: {
      action: String
    }
  };

  pages: Tree;
  history: Tree;
  snapshots: Tree;
  components: Tree;

  prefetchEvent: number;
  visitEvent: number;
  cacheEvent: number;
  loadEvent: number;
  pagesHeight: HTMLElement;
  relapseNode: HTMLElement;
  historyNode: HTMLElement;
  visitsNode: HTMLElement;
  actionNode: HTMLElement;
  componentsNode: HTMLElement;
  pagesNode: HTMLElement;
  memoryNode: HTMLElement;
  snapshotsNode: HTMLElement;

  oninit (): void {

    this.history = JSONTree.create({}, this.historyNode);
    this.pages = JSONTree.create({}, this.pagesNode);
    this.snapshots = JSONTree.create({}, this.snapshotsNode);
    this.components = JSONTree.create({}, this.componentsNode);

    addEventListener('tree:toggle', this.height.bind(this));

  }

  onexit () {

    // this.update();

  }

  onvisit () {

    this.state.action = 'Clicked Link';
    this.update();

  }

  oncache () {

    this.state.action = 'Cached Page';
    this.update();

  }

  /**
   * Stimulus Initialize
   */
  onload () {

    this.update();

  }

  height () {

    this.pagesHeight.style.maxHeight = this.pagesHeight.firstElementChild.clientHeight + 'px';

  }

  update () {

    this.pagesHeight = this.pagesNode.parentElement.parentElement;

    const session = spx.$;
    const pages = Object.fromEntries(Object.entries(session.pages).sort((a, b) => a[1].ts < b[1].ts ? 1 : -1));
    const sort = <{ [k: string]: spx.Page }>{};

    for (const page of Object.keys(pages)) {
      if (page === 'components') continue;
      sort[page] = <spx.Page>{};
      for (const key of Object.keys(pages[page]).sort()) {
        if (page === 'components') continue;
        sort[page][key] = pages[page][key];
      }
    }

    // this.memoryNode.innerHTML = session.memory.size;
    // this.visitsNode.innerHTML = String(session.memory.visits);

    this.pages.loadData(sort);
    this.snapshots.loadData(Object.keys(session.snaps));

    // const components = {};

    // for (const k in this.scope) {
    //   components[this.scope.instanceOf][v.key] = {
    //     key: v.key,
    //     state: v.domState,
    //     nodes: v.nodes,
    //     events: v.events
    //   };
    // }

    // this.components.loadData(components);
    // this.history.loadData(window.history.state);

  }

}
