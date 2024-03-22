import spx from 'spx';
import { Hooks } from './hooks';

export class Counter extends spx.Component<typeof Counter.define> {

  public countNode: HTMLElement;

  static define = {
    state: {
      count: Number
    },
    nodes: <const>[
      'count'
    ]
  };

  get hook (): Hooks {
    return spx.component('hooks') as unknown as Hooks;
  }

  increment () {
    ++this.state.count;
  }

  decrement () {
    --this.state.count;
  }

  connect () {

    this.hook.insert('connect', 'counter component', 'fc-cyan');

  }

  onmount () {

    this.hook.insert('onmount', 'counter component', 'fc-green');

  }

  unmount ({ page }) {

    this.hook.insert('unmount', 'counter component', 'fc-purple');
  }

}
