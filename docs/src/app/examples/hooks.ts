/* eslint-disable no-use-before-define */
import spx from 'spx';

export class Hooks extends spx.Component({
  nodes: <const>[ 'log' ],
  state: { count: Number }
}) {

  connect () {
    this.log('connect', 'fired once, when view is in dom', 'fc-cyan');
  }

  onmount () {
    this.log('onmount', 'fired each time view is in dom', 'fc-green');
  }

  unmount () {
    this.log('unmount', 'fired each time view leaves dom', 'fc-purple');
  }

  /**
   * Rolling logs which will print the hook messages
   */
  log (hook: string, message: string, color: string) {

    const element = document.createElement('div');
    element.className = `d-block pb-1 message ${color}`;
    element.ariaLabel = `${++this.state.count}`;
    element.innerHTML = `<span class="ff-code ${color}">${hook}()</span> ${message}`;

    this.logNode.appendChild(element);
    this.logNode.scrollTop = this.logNode.scrollHeight;

  }

}
