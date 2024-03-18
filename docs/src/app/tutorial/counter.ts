import spx from 'spx';

export class Counter extends spx.Component<typeof Counter.connect> {

  public countNode: HTMLElement;

  static connect = {
    state: {
      count: Number
    },
    nodes: <const>[
      'count'
    ]
  };

  increment () {
    this.countNode.innerText = `${++this.state.count}`;
  }

  decrement () {
    this.countNode.innerText = `${--this.state.count}`;
  }

}
