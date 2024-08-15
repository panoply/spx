/* eslint-disable no-use-before-define */
import spx from 'spx';

export class IFrame extends spx.Component<typeof IFrame.define> {

  static define = {
    id: 'iframe',
    nodes: <const>[
      'log'
    ],
    state: {
      count: Number
    }
  };

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
