import spx, { SPX } from 'spx'

export class Demo extends spx.Component {

  static attrs = {
    clicks: Number,
    color: String,
    min: Number,
    max: Number,
    qty: Number
  }

  onLoad() {
    console.log('Demo Controller:', this.state)
  }

  button() {
    this.state.clicks = this.state.clicks + 1
    this.feedbackNode.innerHTML = `Clicked: ${this.state.clicks}`
  }

  increment() {
    if(this.state.qty < this.state.max) {
      this.counterNode.innerHTML = `Increment: ${++this.state.qty}`
    } else {
      this.feedbackNode.innerText = `You've reached the maximum: ${this.state.max}`
    }
  }

  decrement() {
    if(this.state.qty > this.state.min) {
      this.counterNode.innerHTML = `Decrement: ${--this.state.qty}`
    } else {
      this.feedbackNode.innerText = `You've reached the minimum: ${this.state.min}`
    }
  }


  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */

  public state: SPX.Attrs<typeof Demo.attrs>

  /* -------------------------------------------- */
  /* NODES                                        */
  /* -------------------------------------------- */

  public feedbackNode: HTMLElement;
  public outputNode: HTMLElement;
  public counterNode: HTMLElement;
}


