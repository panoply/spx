/* eslint-disable no-use-before-define */

import spx, { SPX } from 'spx';

export class Tabs extends spx.Component<typeof Tabs.connect> {

  static connect = {
    state: {
      open: {
        default: 0,
        typeof: Number
      }
    }
  };

  toggle ({ target }: SPX.Event<{}, HTMLElement>) {

    this.state.open = +target.getAttribute('data-index');

    for (const btn of this.btnNodes) {
      btn.classList.remove('active');
    }

    for (const tab of this.tabNodes) {
      tab.classList.remove('d-block');
      tab.classList.add('d-none');
    }

    this.btnNodes[this.state.open].classList.add('active');
    this.tabNodes[this.state.open].classList.remove('d-none');
    this.tabNodes[this.state.open].classList.add('d-block');

  }

  tabNodes: HTMLElement[];
  btnNodes: HTMLElement[];

}
