import spx from 'spx';

export class Demo extends spx.Component<typeof Demo.connect> {

  static connect = {
    state: {
      clicks: {
        typeof: Number,
        default: 0,
        persist: true
      },
      color: String,
      min: Number,
      max: Number,
      qty: Number,
      foo: {
        typeof: Object,
        default: {
          test: 'sissel'
        }
      }
    },
    nodes: [
      'feedback',
      'output',
      'counter'
    ]
  };

  onLoad () {
    console.log('onLoad - Demo Controller:', this.state);
  }

  button () {
    console.log('CLICKED', this);
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
  /* TYPES                                        */
  /* -------------------------------------------- */

  //  public state: SPX.State<typeof Demo.connect>;

  /* -------------------------------------------- */
  /* NODES                                        */
  /* -------------------------------------------- */

  // public feedbackNode: HTMLElement;
  // public outputNode: HTMLElement;
  // public counterNode: HTMLElement;

}
