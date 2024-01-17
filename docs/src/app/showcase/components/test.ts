import spx, { SPX } from "spx"

export class Test extends spx.Component {

  static attrs = {
    id: String,
    count: Number
  }

  onInit() {
    console.log('Test Controller:', this.state)
  }

  increment () {
    this.countNode.innerHTML = `${this.state.count++}`
  }


  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */

  public state: SPX.Attrs<typeof Test.attrs>

  /* -------------------------------------------- */
  /* NODES                                        */
  /* -------------------------------------------- */

  public countNode: HTMLElement
}