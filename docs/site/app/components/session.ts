import { Controller } from '@hotwired/stimulus';
import { JSONTree } from '../modules/json-tree';
import spx from 'spx';

export class Session extends Controller {

  static targets: string[] = [
    'pages',
    'memory',
    'snapshots',
    'observers'
  ];

  observersTarget: HTMLElement;
  pagesTarget: HTMLElement;
  memoryTarget: HTMLElement;
  snapshotsTarget: HTMLElement;

  initialize (): void {

  }

  /**
   * Stimulus Initialize
   */
  connect (): void {
    const p = JSONTree.create({}, this.pagesTarget);
    const m = JSONTree.create({}, this.memoryTarget);
    const s = JSONTree.create({}, this.snapshotsTarget);

    spx.on('prefetch', () => {
      this.observersTarget.innerHTML = 'Prefetch Triggered';
    });

    spx.on('visit', () => {
      this.observersTarget.innerHTML = 'Visit Triggered';
    });

    spx.on('render', () => {
      setTimeout(() => {
        this.observersTarget.innerHTML = 'Rendered Fragments';
      }, 1000);
    });

    spx.on('load', () => {

      const sn = spx.session().snapshots;

      p.loadData(spx.session().pages);
      m.loadData(spx.session().memory);
      s.loadData(Object.keys(sn));

      // c

      // render tree into dom element

    });

  }

}
