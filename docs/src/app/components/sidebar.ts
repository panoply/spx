/* eslint-disable no-use-before-define */
import relapse, { Relapse } from 'relapse';
import spx from 'spx';

export class Sidebar extends spx.Component<typeof Sidebar.connect> {

  static connect = {
    state: {
      multiple: Boolean,
      open: {
        default: 0,
        typeof: Number
      }
    }
  };

  connect () {
    this.relapse = relapse(this.dom);
  }

  onmount () {
    this.relapse.reinit();
  }

  unmount () {

  }

  public relapse: Relapse;

}
