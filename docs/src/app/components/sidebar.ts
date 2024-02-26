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
    console.log('onInit');
  }

  onstate () {

    //

  }

  onload ({ data, type }) {

    console.log('onLoad');

    if (data) {
      this.relapse.collapse(this.relapse.active);
      this.relapse.expand(data.group);
    }

  }

  onexit () {

    console.log('onLeave');

  }

  public relapse: Relapse;

}
