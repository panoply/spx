/* eslint-disable no-use-before-define */
import spx, { SPX } from 'spx';

export class Test extends spx.Component<typeof Test.connect> {

  static connect = {
    state: {
      id: String,
      count: Number
    }
  };

  onInit () {
    console.log('Test Controller:', this.state);
  }

  increment () {
    this.countNode.innerHTML = `${this.state.count++}`;
  }

  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */

  public state: SPX.State<typeof Test.connect>;

  /* -------------------------------------------- */
  /* NODES                                        */
  /* -------------------------------------------- */

  public countNode: HTMLElement;

}
