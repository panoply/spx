import spx from 'spx';

export class Events extends spx.Component({
  nodes: <const>[ 'logger', 'someButton' ],
  state: {
    connect: 1,
    visit: Number,
    prefetch: Number,
    fetch: Number,
    cache: Number,
    render: Number,
    load: Number,
    count: Number,
    store: Array<HTMLDivElement>
  }
}) {

  connect () {

    spx.on('visit', (event) => {
      ++this.state.visit;
      console.log(event);
      this.insert('visit', 'green');
    });
    spx.on('fetch', (page) => {
      ++this.state.fetch;
      this.insert(`fetch ${page.key}`, 'blue');
    });
    spx.on('prefetch', (event: any) => {
      ++this.state.prefetch;
      this.insert(`prefetch ${event.getAttribute('href')}`, 'pink');
    });
    spx.on('cache', (event) => {
      ++this.state.cache;
      this.insert(`cache ${event.querySelector('title').outerHTML.replace(/\s+/g, ' ')}`, 'yellow');
    });
    spx.on('render', (curDom, newDom) => {
      ++this.state.render;
      this.insert(`render ${spx.$.page.key}`, 'gray');
    });
    spx.on('load', (event) => {
      ++this.state.load;
      this.insert('load', 'red');
    });

  }

  unmount () {

    this.insert('------------------------------------------', 'white');
  }

  onmount () {

    this.loggerNode.append(...this.state.store);
  }

  insert (message: string, color: string) {

    const element = document.createElement('div');
    element.className = `d-block pb-1 message fc-${color}`;
    element.ariaLabel = `${++this.state.count}`;
    element.innerText = message;

    if (this.loggerExists) {
      this.loggerNode.appendChild(element);
      this.loggerNode.scrollTop = this.loggerNode.scrollHeight;
    } else {
      this.state.store.push(element);
    }
  }

}
