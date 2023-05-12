import { Controller } from '@hotwired/stimulus';
import { JSONTree, Tree } from '../modules/json-tree';
import spx from 'spx';

export class Session extends Controller {

  static targets: string[] = [
    'pages',
    'memory',
    'visits',
    'snapshots',
    'action',
    'history'
  ];

  pages: Tree;
  history: Tree;
  snapshots: Tree;

  hasHistoryTarget: boolean;
  historyTarget: HTMLElement;
  visitsTarget: HTMLElement;
  actionTarget: HTMLElement;
  pagesTarget: HTMLElement;
  memoryTarget: HTMLElement;
  snapshotsTarget: HTMLElement;

  initialize (): void {
    if (this.hasHistoryTarget) {
      this.history = JSONTree.create({}, this.historyTarget);
      this.pages = JSONTree.create({}, this.pagesTarget);
      this.snapshots = JSONTree.create({}, this.snapshotsTarget);
    }
  }

  /**
   * Stimulus Initialize
   */
  connect (): void {

    spx.on('prefetch', () => {
      this.actionTarget.innerHTML = 'Prefetch Triggered';
    });

    spx.on('visit', () => {
      this.actionTarget.innerHTML = 'Visit Triggered';
    });

    spx.on('visit', () => {
      this.actionTarget.innerHTML = 'Visit Triggered';
    });

    spx.on('cached', state => {
      this.actionTarget.innerHTML = 'Rendered Fragments';
      this.update();
    });


    this.update();
  }

  async update () {

    const session = spx.session();

    this.memoryTarget.innerText = session.memory.size;
    this.visitsTarget.innerText = String(session.memory.visits);
    this.pages.loadData(session.pages);
    this.snapshots.loadData(Object.keys(session.snapshots));
    this.history.loadData(window.history.state);
  }

}
