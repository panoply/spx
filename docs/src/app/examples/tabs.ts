import spx, { SPX } from 'spx';

export class ExampleTabs extends spx.Component<typeof ExampleTabs.connect> {

  static connect = {
    state: {
      size: Number,
      open: {
        default: 0,
        typeof: Number
      }
    }
  };

  oninit () {
    this.state.size = this.tabNodes.length;
  }

  toggle ({ attrs }: SPX.Event<{ index: number }>) {

    if (this.state.open === attrs.index) return;

    for (let i = 0, s = this.state.size; i < s; i++) {
      if (i === attrs.index) {
        this.buttonNodes[i].classList.add('active');
        this.tabNodes[i].classList.remove('d-none');
      } else {
        this.buttonNodes[i].classList.remove('active');
        this.tabNodes[i].classList.toggle('d-none', true);
      }
    }

    this.state.open = attrs.index;

  }

  public tabNodes: HTMLElement[];
  public buttonNodes: HTMLElement[];

}
