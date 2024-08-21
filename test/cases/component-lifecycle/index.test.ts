import spx from 'spx';

export class Lifecycle extends spx.Component<typeof Lifecycle.define> {

  static define = {
    state: {
      connect: Number,
      onmount: Number,
      unmount: Number
    },
    nodes: [
      'foo',
      'bar',
      'baz',
      'qux'
    ]
  };

  connect (): void {

    ++this.state.connect;

    this.dom.fooNode.style.backgroundColor = '#ccc';
    this.dom.barNode.style.backgroundColor = '#999';
    this.dom.bazNode.style.backgroundColor = '#111';
    this.dom.quxNode.style.backgroundColor = '#fff';

    console.log('Lifecycle Testing: connect');

  }

  onmount (): void {

    ++this.state.onmount;

    if (this.state.onmount % 2 === 0) {

      this.dom.fooNode.style.backgroundColor = 'green';
      this.dom.barNode.style.backgroundColor = 'blue';
      this.dom.bazNode.style.backgroundColor = 'pink';
      this.dom.quxNode.style.backgroundColor = 'hotpink';

    } else {

      this.dom.fooNode.style.backgroundColor = 'purple';
      this.dom.barNode.style.backgroundColor = 'orange';
      this.dom.bazNode.style.backgroundColor = 'yellow';
      this.dom.quxNode.style.backgroundColor = 'cyan';

    }

    console.log('Lifecycle Testing: onmount');

  }

  unmount (): void {

    ++this.state.unmount;

    // console.log('Lifecycle Testing: onLeave Node', this.dom.fooNode);
    // console.log('Lifecycle Testing: onLeave Node', this.dom.barNode);
    // console.log('Lifecycle Testing: onLeave Node', this.dom.bazNode);
    // console.log('Lifecycle Testing: onLeave Node', this.dom.quxNode);
    console.log('Lifecycle Testing: unmount');

  }

}
