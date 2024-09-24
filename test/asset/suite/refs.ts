import papyrus from 'papyrus';
import spx from 'spx';

export class Refs extends spx.Component<typeof Refs.define> {

  compare: { [key: string]: string[] } = {};

  static define = {
    nodes: <const>[
      'snap',
      'mark'
    ]
  };

  get page () {

    const { key } = spx.$.page;
    if (!(key in this.compare)) this.compare[key] = [];
    return this.compare[key];

  }

  set page (value: string[]) {
    const { key } = spx.$.page;
    if (!(key in this.compare)) this.compare[key] = value;
  }

  onmount () {

    setTimeout(() => {

      const { snapDom } = spx.$;
      const snaps = Array.from(snapDom.querySelectorAll<HTMLElement>('[data-spx]'));

      const { dom, marks } = this.get(snaps, []);

      if (this.page.length === 0) {

        this.page = marks.map(v => '<!-- ✅ MATCHED --> ' + v);

      } else {

        this.page = marks.map((v, i) => {
          const ok = '<!-- ✅ MATCHED --> ' + v;
          if (this.page[i] === ok) {
            return ok;
          } else {
            return '<!-- ❌ FAILED --> ' + v;
          }
        });
      }

      const valid = this.page.join('\n');
      const format = dom.join('\n');

      papyrus.render(valid, this.dom.mark, { language: 'html' });
      papyrus.render(format, this.dom.snap, { language: 'html' });

    }, 300);
  }

  get (nodes: HTMLElement[], marks: string[]) {

    const dom = nodes.map(node => {

      const name = node.nodeName.toLowerCase();
      const html = node.outerHTML;
      const ref = node.getAttribute('data-spx');
      const dom = html.slice(0, node.outerHTML.indexOf('>') + 1) + `</${name}>`;

      let type: string;

      if (ref[0] === 'c') {
        type = `spx-component="${node.getAttribute('spx-component')}"`;
      } else if (ref[0] === 'n') {
        type = `spx-node="${node.getAttribute('spx-node')}"`;
      } else if (ref[0] === 'b') {
        type = `spx-bind="${node.getAttribute('spx-bind')}"`;
      } else {
        type = `${dom.match(/(spx@[a-z]+=".*?")/)[1]}`;
      }

      marks.push(`<${name} data-spx="${node.getAttribute('data-spx')}" ${type}></${name}>`);

      return dom;

    });

    return { dom, marks };
  }

}
