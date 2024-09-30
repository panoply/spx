/* eslint-disable no-use-before-define */
import spx from 'spx';

export class UsageHooks extends spx.Component({
  nodes: <const>[ 'log' ],
  state: { count: Number }
}) {

  connect () {
    this.log('connect', 'Demo Connect', 'fc-cyan');
  }

  onmount () {
    this.log('onmount', 'Demo Mounted', 'fc-green');
  }

  unmount () {
    this.log('unmount', 'Demo Unmount', 'fc-purple');
  }

  log (hook: string, message: string, color: string) {

    const element = document.createElement('div');
    element.className = `message ${color}`;
    element.ariaLabel = `${++this.state.count}`;
    element.innerHTML = `<span class="ff-code fs-sm ${color}">${hook}()</span> ${message}`;

    this.logNode.appendChild(element);
    this.logNode.scrollTop = this.logNode.scrollHeight;

  }

}
