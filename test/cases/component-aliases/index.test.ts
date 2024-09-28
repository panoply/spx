import spx from 'spx';

export class Alias extends spx.Component({
  sugar: true,
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
      this.counter.innerHTML = `${++this.state.qty}`;
    } else {
      this.feedback.innerText = `Maximum: ${this.state.max}`;
    }
  }

  decrement () {

    if (this.state.qty > this.state.min) {
      this.counter.innerHTML = `${--this.state.qty}`;
    } else {
      this.feedback.innerText = `Minimum: ${this.state.min}`;
    }
  }

}
