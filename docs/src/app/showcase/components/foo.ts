import spx, { SPX } from 'spx'

export class Foo extends spx.Component {

  static attrs = {
    active: Boolean,
    change: String,
    message: {
      typeof: String,
      default: 'I am the initial value'
    }
  }

  onLoad() {
     console.log('Foo Controller:', this.state)
  }

  toggle (event: Event) {

    if(this.state.active === false) {
      event.stopPropagation()
      this.state.active = true
      this.textNode.innerHTML = this.state.change
      this.infoNode.innerHTML = 'This value of active changed so only 1 click is allowed, try clicking again';
    } else {
      this.infoNode.innerHTML = 'I told you, only 1 click is allowed. Value of "sissel" will not change';

    }
  }

  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */

  public state: SPX.Attrs<typeof Foo.attrs>

  /* -------------------------------------------- */
  /* NODES                                        */
  /* -------------------------------------------- */

  public infoNode: HTMLElement;
  public textNode: HTMLElement;


}