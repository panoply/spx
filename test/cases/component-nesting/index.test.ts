import spx from 'spx';

export class Nesting extends spx.Component({
  name: 'nesting',
  sugar: true,
  nodes: <const>[ 'foo', 'bar', 'buttonBaz' ],
  state: {
    foo: '',
    count: 0
  }
}) {

  method () {

    this.bar();

  }

  onClick () {

    ++this.state.count;

  }

}
