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

  onInit () {}

  onLoad () {
    console.log(this);
  } // Lifecycle method

  onExit () {} // Lifecycle method
  onCache () {} // Lifecycle method

  toggle (event: Event) {
    this.listNode.classList.toggle('open');
  }

  public listNode: HTMLElement;

}
