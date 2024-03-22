import spx, { SPX } from 'spx';

export class Tabs extends spx.Component<typeof Tabs.define> {

  public buttonNode: HTMLElement;
  public panelNodes: HTMLElement[];

  static define = {

    state: {
      init: Number,
      open: Number
    },
    nodes: <const>[
      'button',
      'panel'
    ]
  };

  connect () {
    this.state.hasInit && this.toggle({ attrs: { idx: this.state.init } } as any);
    console.log(this.state.hasInit);
  }

  open (idx: number) {
    this.buttonNode.children[idx].classList.add('active');
    this.panelNodes[idx].classList.remove('d-none');
  }

  close (idx: number) {
    this.buttonNode.children[idx].classList.remove('active');
    this.panelNodes[idx].classList.toggle('d-none', true);
  }

  toggle ({ attrs }: SPX.Event<{ idx: number }>) {
    if (this.state.open !== attrs.idx) {
      this.state.open = attrs.idx;
      for (let idx = 0, len = this.panelNodes.length; idx < len; idx++) {
        idx === attrs.idx ? this.open(idx) : this.close(idx);
      }
    }
  }

}
