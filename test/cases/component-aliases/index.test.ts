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
      this.dom.counterNode.innerHTML = `${++this.state.qty}`;
    } else {
      this.dom.feedbackNode.innerText = `Maximum: ${this.state.max}`;
    }
  }

  decrement () {

    if (this.state.qty > this.state.min) {
      this.dom.counterNode.innerHTML = `${--this.state.qty}`;
    } else {
      this.dom.feedbackNode.innerText = `Minimum: ${this.state.min}`;
    }
  }

  /* -------------------------------------------- */
  /* NODES                                        */
  /* -------------------------------------------- */

}
