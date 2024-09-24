import spx, { SPX } from 'spx';

export class Refs1 extends spx.Component({
  sugar: true,
  nodes: <const>[
    'qux',
    'xxx'
  ]
}) {

  onQuxPress ({ attrs }: SPX.Event<{ age: number, dob: string }>) {

    this.xxx.innerText = 'pressed';

  }

}

export class Refs2 extends spx.Component({
  state: {
    fooClicks: Number,
    barClicks: Number,
    bazClicks: Number
  },
  sugar: true,
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

    this.foo.innerText = `name ${++this.state.fooClicks}`;
    console.log(this.foo(), this.foo.nodeName, this.foo.innerText);

    this.bar.append(this.foo);

  }

  onBarPress ({ attrs }: SPX.Event<{ age: number, dob: string }>) {

    this.bar.innerText = `${++this.state.barClicks}`;
    console.log(attrs);

  }

  onBazPress ({ attrs }: SPX.Event<{ age: number, dob: string }>) {

    this.baz.innerText = `${++this.state.bazClicks}`;
    console.log(attrs);

  }
  /* -------------------------------------------- */
  /* NODES                                        */
  /* -------------------------------------------- */

}
