import spx, { SPX } from 'spx';

export class Tabs extends spx.Component {

  static targets: string[] = [
    'tab',
    'btn'
  ];

  public state: SPX.Attrs<typeof Tabs.attrs>;
  static attrs = {
    open: {
      default: 0,
      typeof: Number
    }
  };

  toggle ({ target }: { target: HTMLElement }) {

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
