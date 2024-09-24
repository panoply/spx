/* eslint-disable no-use-before-define */
import relapse, { Relapse } from 'relapse';
import spx from 'spx';

export class Sidebar extends spx.Component({
  nodes: [],
  state: {
    multiple: Boolean,
    open: {
      default: 0,
      typeof: Number
    }
  }
}) {

  onmount () {

    this.relapse ? this.relapse.reinit() : this.relapse = relapse(this.dom);

  }

  unmount () {

    this.relapse.destroy();

  }

  public relapse: Relapse;

}
