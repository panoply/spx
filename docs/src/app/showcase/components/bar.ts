import spx from 'spx';

export class Bar extends spx.Component<typeof Bar.connect> {

  static connect = {
    state: {
      size: Number,
      custom: Number,
      foo: {
        typeof: String,
        persist: true,
        default: 'hello'
      }
    }
  };

  onInit () {
    console.log('Bar Controller:', this);
    this.widthNode.innerText = `${this.state.size}px`;
  }

  onLoad () {
    console.log('Bar Controller:', this.state);
    this.widthNode.innerText = `${this.state.size}px`;
  }

  onExit () {
    console.log('Bar Controller:', this.state);
    this.widthNode.innerText = `${this.state.size}px`;
  }

  toggle ({ target }: { target: Window }) {
    this.state.size = target.innerWidth;
    this.widthNode.innerText = `${this.state.size}px`;
  }

  /* -------------------------------------------- */
  /* NODES                                        */
  /* -------------------------------------------- */

  public widthNode: HTMLElement;

}
