import spx, { SPX } from 'spx';

export class Refs1 extends spx.Component({
  sugar: true,
  nodes: <const>[
    'qux',
    'xxx'
  ]
}) {

  onQuxPress ({ attrs }: SPX.Event<{ age: number, dob: string }>) {
    this.xxxNode.innerText = 'pressed';
  }

}

export class Refs2 extends spx.Component({
  state: {
    fooClicks: Number,
    barClicks: Number,
    bazClicks: Number
  },
  nodes: <const>[
    'foo',
    'bar',
    'baz'
  ]
}) {

  onmount () {

    // console.log({ ...this });

  }

  onFooPress ({ attrs }: SPX.Event<{ age: number, dob: string }>) {

    this.fooNode.innerText = `name ${++this.state.fooClicks}`;
    console.log(this.fooNodes, this.fooNode.nodeName, this.fooNode.innerText);

    this.barNode.append(this.fooNode);

  }

  onBarPress ({ attrs }: SPX.Event<{ age: number, dob: string }>) {

    this.barNode.innerText = `${++this.state.barClicks}`;
    console.log(attrs);

  }

  onBazPress ({ attrs }: SPX.Event<{ age: number, dob: string }>) {

    this.bazNode.innerText = `${++this.state.bazClicks}`;
    console.log(attrs);

  }
  /* -------------------------------------------- */
  /* NODES                                        */
  /* -------------------------------------------- */

}
