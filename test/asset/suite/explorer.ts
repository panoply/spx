/* eslint-disable no-redeclare */
/* eslint-disable no-unused-expressions */
import spx from 'spx';
import papyrus from 'papyrus';
import relapse from 'relapse';
import m from 'mithril';
import esthetic from 'esthetic';
import { state } from './explorer/state';
import { Components } from './explorer/components';

esthetic.rules({
  language: 'html',
  wrap: 80,
  correct: true,
  preserveLine: 0,
  indentSize: 1,
  markup: {
    forceIndent: true,
    preserveText: false,
    forceAttribute: true
  }
});

export class Explorer extends spx.Component<typeof Explorer.define> {

  static define = {
    nodes: <const>[
      'inputFoo',
      'aBar',
      'areaBaz',
      'content',
      'components',
      'snapshot',
      'document'
    ],
    state: {
      count: Number,
      bar: Object<{ foo: string }>,
      foo: String<'foo'>,
      baz: Array<{ bar: string }>
    }
  };

  connect () {

    this.setComponents();
    this.setSnapshot();
    this.setDocument();
  }

  setDocument () {

    const format = this.format(state.document.getElementById('main').outerHTML);

    papyrus.render(format, this.dom.documentNode, {
      language: 'html',
      showSpace: true
    });

  }

  setSnapshot () {

    const format = this.format(state.snapshot.getElementById('main').outerHTML);

    papyrus.render(format, this.dom.snapshotNode, {
      language: 'html',
      showSpace: true
    });

  }

  format (code: string) {
    const first = esthetic.format(code);
    return esthetic.format(first);
  }

  setComponents () {

    m.mount(this.dom.componentsNode, Components);

    spx.on('load', () => {
      setTimeout(() => {

        state.get();
        m.redraw();
        relapse.reinit();

      }, 100);
    });
  }

  /**
   * Rolling logs which will print the hook messages
   */
  log (log: HTMLElement, hook: string, message: string, color: string) {

    const element = document.createElement('div');
    element.className = `d-block pb-1 message ${color}`;
    element.ariaLabel = `${++this.state.count}`;
    element.innerHTML = `<span class="ff-code ${color}">${hook}</span> ${message}`;

    log.appendChild(element);
    log.scrollTop = log.parentElement.scrollHeight;

  }

}
