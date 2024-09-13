/* eslint-disable no-use-before-define */
import spx from 'spx';

export class Hooks extends spx.Component<typeof Hooks.define> {

  static define = {
    nodes: <const>[
      'log'
    ],
    state: {
      data: Array,
      hook: Array<string>,
      count: Number
    }
  };

  async connect () {

    const response = await fetch('https://api.placeholderjson.dev/shipments');

    this.state.data = await response.json();
  }

  /**
   * Rolling logs which will print the hook messages
   */
  insert (hook: string, message: string, color: string) {

    const element = document.createElement('div');
    element.className = `d-block pb-1 message ${color}`;
    element.ariaLabel = `${++this.state.count}`;
    element.innerHTML = `<span class="ff-code ${color}">${hook}()</span> ${message}`;

    this.dom.logNode.appendChild(element);
    this.dom.logNode.scrollTop = this.dom.logNode.scrollHeight;

  }

}
