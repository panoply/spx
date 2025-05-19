import spx from 'spx';

export class Alias extends spx.Component({
  nodes: <const>[
    'feedback',
    'counter',
    'bar'
  ],
  state: {
    min: Number,
    max: Number,
    qty: Number
  }
}) {

  increment () {

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

}
