import spx from 'spx';

export class Nesting extends spx.Component({
  name: 'nesting',
  nodes: <const>[ 'foo', 'bar', 'buttonBaz' ],
  state: {
    foo: '',
    count: 0
  }
}) {

  onClick () {

    ++this.state.count;

  }

}
