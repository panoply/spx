import spx, { SPX } from 'spx';

export class Basic extends spx.Component<typeof Basic.define> {

  static define = {
    state: {
      clicks: {
        typeof: Number,
        persist: true
      },
      color: String,
      min: Number,
      max: Number,
      qty: Number,
      name: String,
      foo: {
        typeof: Object,
        default: {
          test: 'sissel'
        }
      }
    },
    nodes: <const>[
      'feedback',
      'output',
      'counter'
    ]
  };

  onmount () {

    console.log('onLoad - Demo Controller:', this.state);

  }

  button (event: SPX.Event) {

    console.log('Native Event Params', event);
    console.log('Instance', this);

    this.state.clicks = this.state.clicks + 1;
    // this.feedbackNode.innerHTML = `Clicked: ${this.state.clicks}`;
  }

  increment () {

    if (this.state.qty < this.state.max) {
      this.counterNode.innerHTML = `Increment: ${++this.state.qty}`;
    } else {
      this.feedbackNode.innerText = `You've reached the maximum: ${this.state.max}`;
    }
  }

  decrement () {

    if (this.state.qty > this.state.min) {
      this.counterNode.innerHTML = `Decrement: ${--this.state.qty}`;
    } else {
      this.feedbackNode.innerText = `You've reached the minimum: ${this.state.min}`;
    }
  }

  /* -------------------------------------------- */
  /* NODES                                        */
  /* -------------------------------------------- */

  // public feedbackNode: HTMLElement;
  // public outputNode: HTMLElement;
  // public counterNode: HTMLElement;

}
