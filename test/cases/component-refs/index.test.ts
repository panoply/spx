import spx, { SPX } from 'spx';

export class Refs1 extends spx.Component<typeof Refs1.define> {

  static define = {
    nodes: <const>[
      'qux',
      'xxx'
    ]
  };

  onQuxPress ({ attrs }: SPX.Event<{ age: number, dob: string }>) {

    this.xxxNode.innerText = 'pressed';

  }

}

export class Refs2 extends spx.Component<typeof Refs2.define> {

  static define = {
    state: {
      fooClicks: {
        typeof: Number,
        default: 0
      },
      barClicks: {
        typeof: Number,
        default: 0
      },
      bazClicks: {
        typeof: Number,
        default: 0
      }
    },
    nodes: <const>[
      'foo',
      'bar',
      'baz'
    ]
  };

  onmount () {

    console.log(this.fooNode);

  }

  onFooPress ({ attrs }: SPX.Event<{ age: number, dob: string }>) {

    this.fooNode.innerText = `${++this.state.fooClicks}`;
    console.log(attrs);

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

  public fooNode: HTMLElement;
  public barNode: HTMLElement;
  public bazNode: HTMLElement;

}
