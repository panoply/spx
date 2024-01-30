/* eslint-disable no-use-before-define */
import relapse from 'relapse';
import spx, { SPX } from 'spx';

export class Sidebar extends spx.Component {

  public state: SPX.State<typeof Sidebar.connect>;

  static connect = {
    state: {
      open: {
        default: 0,
        typeof: Number
      }
    }
  };

  onInit () {

    relapse(this.dom);

  }

}
