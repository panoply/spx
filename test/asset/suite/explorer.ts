/* eslint-disable no-redeclare */
/* eslint-disable no-unused-expressions */
import spx, { SPX } from 'spx';
// import papyrus, { Papyrus } from 'papyrus';
import m from 'mithril';
import esthetic from 'esthetic';
// import { state } from './explorer/state';
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

export class Explorer extends spx.Component({
  nodes: <const>[
    'content',
    'components',
    'snapshot',
    'document',
    'logger',
    'tab'

  ],
  state: {
    count: Number,
    mounted: Boolean
  }
}) {

  // public papyrusDoc: Papyrus.Model;
  // public papyrusSnap: Papyrus.Model;

  connect () {

    console.log(this);
    // this.papyrusDoc = papyrus.mount(this.documentNode, { language: 'html' });
    // this.papyrusSnap = papyrus.mount(this.snapshotNode, { language: 'html' });
    this.setComponents();

  }

  onmount () {

    m.redraw();
    // this.setComponents();

    // this.setDocument();
    // this.setSnapshot();

  }

  setDocument () {

    // const input = this.format(state.document.getElementById('main').outerHTML);

    // this.papyrusDoc.update(input);

  }

  setLogger (event: SPX.Event) {

    this.componentsNode.classList.add('d-none');
    this.loggerNode.classList.remove('d-none');
    // this.dom.tab(tab => tab.removeClass('active'));
    event.target.classList.add('active');

  }

  session (event: SPX.Event) {

    this.loggerNode.classList.add('d-none');
    this.componentsNode.classList.remove('d-none');
    this.tabNodes.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
  }

  setSnapshot () {

    // setTimeout(() => {
    //   const input = this.format(state.snapshot.getElementById('main').outerHTML);
    //   this.papyrusSnap.update(input);
    //   this.papyrusDoc.onscroll((position) => {
    //     this.papyrusSnap.scroll(position);
    //   });
    // }, 500);
  }

  format (code: string) {
    const first = esthetic.format(code);
    return esthetic.format(first);
  }

  setComponents () {

    m.mount(this.componentsNode, Components);

  }

  /**
   * Rolling logs which will print the hook messages
   */
  log (message: string) {

    const element = document.createElement('div');
    element.className = 'd-block pb-1 message';
    element.ariaLabel = `${++this.state.count}`;
    element.innerHTML = `${message}`;

    this.loggerNode.appendChild(element);
    this.loggerNode.scrollTop = this.loggerNode.parentElement.scrollHeight;

  }

}
