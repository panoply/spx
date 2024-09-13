import spx, { SPX } from 'spx';

export class Tabs extends spx.Component<typeof Tabs.define> {

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
    this.dom.buttonNode.children[idx].classList.add('active');
    this.dom.panelNodes[idx].classList.remove('d-none');
  }

  close (idx: number) {
    this.dom.buttonNode.children[idx].classList.remove('active');
    this.dom.panelNodes[idx].classList.toggle('d-none', true);
  }

  toggle ({ attrs }: SPX.Event<{ idx: number }>) {
    if (this.state.open !== attrs.idx) {
      this.state.open = attrs.idx;
      this.dom.panelNodes.forEach((_, i) => i === attrs.idx ? this.open(i) : this.close(i));
    }
  }

}
