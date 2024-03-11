/* eslint-disable no-use-before-define */

import spx, { SPX } from 'spx';

export class Tabs extends spx.Component<typeof Tabs.connect> {

  btn: any;
  static connect = {
    state: {
      size: Number,
      open: Number
    },
    nodes: [
      'buttons',
      'button'
    ]
  };

  oninit () {

    console.log(this);

    this.btn = this.buttonNodes || this.buttonsNode.children;

    console.log(this.btn);

  }

  toggle ({ attrs }: SPX.Event<{ index: number }>) {

    if (this.state.open === attrs.index) return;

    for (let i = 0, s = this.panelNodes.length; i < s; i++) {
      if (i === attrs.index) {
        this.btn[i].classList.add('active');
        this.panelNodes[i].classList.remove('d-none');
      } else {
        this.btn[i].classList.remove('active');
        this.panelNodes[i].classList.toggle('d-none', true);
      }
    }

    this.state.open = attrs.index;
  }

  public panelNodes: HTMLElement[];
  public buttonNodes: HTMLElement[];
  public buttonsNode: HTMLElement;

}
