import spx, { SPX } from 'spx'

export class Bar extends spx.Component {

  static attrs = {
    size: Number,
    custom: Number
  }

  onInit() {
    console.log('Bar Controller:', this.state);
    this.widthNode.innerText = `${this.state.size}px`
  }

  onLoad() {
    console.log('Bar Controller:', this.state);
    this.widthNode.innerText = `${this.state.size}px`
  }

  onExit() {
    console.log('Bar Controller:', this.state);
    this.widthNode.innerText = `${this.state.size}px`
  }

  toggle ({ target }: { target: Window }) {
    this.state.size = target.innerWidth
    this.widthNode.innerText = `${ this.state.size}px`
  }

  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */

  public state: SPX.Attrs<typeof Bar.attrs>

  /* -------------------------------------------- */
  /* NODES                                        */
  /* -------------------------------------------- */

  public widthNode: HTMLElement;

}