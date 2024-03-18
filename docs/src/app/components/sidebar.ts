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

  oninit () {
    this.relapse = relapse(this.dom);
  }

  onload () {
    this.relapse.reinit();
  }

  public relapse: Relapse;

}
