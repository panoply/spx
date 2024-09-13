import spx from 'spx';
import { IFrame } from './iframe';

export class Counter extends spx.Component<typeof Counter.define> {

  static define = {
    state: {
      count: Number
    },
    nodes: <const>[
      'count'
    ]
  };

  get iframe () {
    return spx.component<IFrame>('iframe');
  }

  increment () {
    ++this.state.count;
  }

  decrement () {
    --this.state.count;
  }

  connect () {

    this.iframe.log('connect', 'counter component', 'fc-cyan');

  }

  onmount () {

    this.iframe.log('onmount', 'counter component', 'fc-green');

  }

  unmount ({ page }) {

    this.iframe.log('unmount', 'counter component', 'fc-purple');
  }

}
