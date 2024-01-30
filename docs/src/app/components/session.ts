import { JSONTree, Tree } from '../modules/json-tree';
import spx from 'spx';
import relapse, { Relapse } from 'relapse';

export class Session extends spx.Component {

  relapse: Relapse;
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

  onInit (): void {

    this.relapse = relapse(this.relapseNode);

    if (this.historyNode) {
      this.history = JSONTree.create({}, this.historyNode);
      this.pages = JSONTree.create({}, this.pagesNode);
      this.snapshots = JSONTree.create({}, this.snapshotsNode);
      this.components = JSONTree.create({}, this.componentsNode);
    }

    this.update();

    this.pagesHeight = this.pagesNode.parentElement.parentElement;

    this.prefetchEvent = spx.on('prefetch', () => {
      this.actionNode.innerHTML = 'Prefetch Triggered';
    });

    this.cacheEvent = spx.on('after:cache', state => {
      this.actionNode.innerHTML = 'Rendered Fragments';
      this.update();
    });

    document.addEventListener('tree:toggle', this.height.bind(this));

    if (this.relapse.active !== 0) {

      setTimeout(() => {

        this.relapse.expand(0);

      }, 500);
    }

  }

  onExit (): void {

    // this.update();

  }

  onVisit (): void {

    // this.update();

  }

  /**
   * Stimulus Initialize
   */
  onLoad (): void {

    this.actionNode.innerHTML = 'Visit Triggered';
    this.update();
    // this.update()

  //  this.update();
  }

  height () {

    this.pagesHeight.style.maxHeight = this.pagesHeight.firstElementChild.clientHeight + 'px';

  }

  update () {

    const session = spx.session();

    const pages = Object.fromEntries(Object.entries(session.pages).sort((a, b) => a[1].ts < b[1].ts ? 1 : -1));
    const sort = <{ [k: string]: spx.IPage }>{};

    for (const page of Object.keys(pages)) {
      sort[page] = <spx.IPage>{};
      for (const key of Object.keys(pages[page]).sort()) {
        sort[page][key] = pages[page][key];
      }
    }

    this.memoryNode.innerText = session.memory.size;
    this.visitsNode.innerText = String(session.memory.visits);

    this.pages.loadData(sort);
    this.snapshots.loadData(Object.keys(session.snaps));

    // const components = {};

    // for (const [ k, v ] of session.components.scopes) {
    //   if (!Array.isArray(components[v.instanceOf])) components[v.instanceOf] = {};
    //   components[v.instanceOf][v.key] = {
    //     key: v.key,
    //     state: v.domState,
    //     nodes: v.nodes,
    //     events: v.events
    //   };
    // }

    // this.components.loadData(components);
    this.history.loadData(window.history.state);

  }

}
