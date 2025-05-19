import spx from 'spx';
import m from 'mithril';

function createComponent () {

  const mounted = document.querySelector('#mounted');

  if (!mounted) return;

  m.mount(mounted, {
    view: () => [
      m('h1', 'Mounted'),
      m('.row', {
        'spx-component': 'mounted',
        'spx-mounted:added': 'added'
      }, [
        m('.col-6', [
          m('button[type="button"]', {
            'spx@click': 'mounted.onClick'
          }, 'Click Here')
        ]),
        m('.col-6', [
          m('code[spx-bind="mounted.count"]', '')
        ]),
        m('.col-12.mt-3[spx-node="mounted.insert"]', '')
      ])
    ]
  });

}

spx.on('load', ({ key }) => {
  if (key.indexOf('/components/observer') > -1) {
    setTimeout(() => createComponent(), 2000);
  }
});

spx.on('connect', ({ key }) => {
  console.log(key);
  if (key.indexOf('/components/observer') > -1) {
    setTimeout(() => createComponent(), 2000);
  }
});

export class Mounted extends spx.Component({
  state: {
    added: String,
    count: Number
  },
  nodes: <const>[ 'insert' ]
}) {

  onmount () {

    this.insertNode.innerText = this.state.added;

  }

  onClick () {

    ++this.state.count;

  }

}
