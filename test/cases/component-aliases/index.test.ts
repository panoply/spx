import spx from 'spx';

export class Alias extends spx.Component<typeof Alias.define> {

  static define = {
    state: {
      min: Number,
      max: Number,
      qty: Number
    },
    nodes: <const>[
      'feedback',
      'counter'
    ]
  };

  increment () {

    console.log(this.state.qty, this.state.max);

    if (this.state.qty < this.state.max) {
      this.counterNode.innerHTML = `${++this.state.qty}`;
    } else {
      this.feedbackNode.innerText = `Maximum: ${this.state.max}`;
    }
  }

  decrement () {

    if (this.state.qty > this.state.min) {
      this.counterNode.innerHTML = `${--this.state.qty}`;
    } else {
      this.feedbackNode.innerText = `Minimum: ${this.state.min}`;
    }
  }

  /* -------------------------------------------- */
  /* NODES                                        */
  /* -------------------------------------------- */

  public feedbackNode: HTMLElement;
  public counterNode: HTMLElement;

}
