import spx from 'spx';

export class Example extends spx.Component<typeof Example.connect> {

  static connect = {
    state: {
      price: Number,
      color: String
    },
    nodes: [
      'feedback',
      'output',
      'counter'
    ]
  };

  onInit () {

    this.state.hasColor; // exists
    this.state.color; // value

    this.listNode; // element
    this.sizeNodes; // element[]

  }

  onLoad () {} // Lifecycle method
  onExit () {} // Lifecycle method
  onCache () {} // Lifecycle method

  toggle (event: Event) {
    this.listNode.classList.toggle('open');
  }

}
