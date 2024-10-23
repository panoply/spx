/* eslint-disable no-use-before-define */

import spx from 'spx';
import relapse, { Relapse } from 'relapse';

export class Merge extends spx.Component() {

  onmount () {

    this.relapse = relapse(this.view);

  }

  unmount () {

    this.relapse.destroy();

  }

  public relapse: Relapse;

}
