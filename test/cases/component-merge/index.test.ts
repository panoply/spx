/* eslint-disable no-use-before-define */

import spx from 'spx';
import relapse, { Relapse } from 'relapse';

export class Merge extends spx.Component<typeof Merge.define> {

  static define = {
    merge: true,
    nodes: [],
    state: {
      fade: Number,
      mounted: Boolean,
      multiple: {
        typeof: Boolean,
        default: false
      },
      open: {
        default: 120,
        typeof: Number
      }
    }
  };

  onmount () {

    this.relapse = relapse(this.root);

  }

  unmount () {

    this.relapse.destroy();

  }

  public relapse: Relapse;

}
