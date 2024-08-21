/* eslint-disable no-use-before-define */
import relapse, { Relapse } from 'relapse';
import spx from 'spx';

export class Sidebar extends spx.Component<typeof Sidebar.define> {

  static define = {
    state: {
      multiple: Boolean,
      open: {
        default: 0,
        typeof: Number
      }
    }
  };

  connect () {
    this.relapse = relapse(this.root);
  }

  onmount () {
    this.relapse.reinit();
  }

  unmount () {

  }

  public relapse: Relapse;

}
