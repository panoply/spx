import spx from 'spx';

export class Nesting extends spx.Component<typeof Nesting.define> {

  static define = {
    state: {
      name: Number,
      count: Number
    },
    nodes: <const>[
      'demo'
    ]
  };

  onClick () {

    console.log(this.state.count);
    ++this.state.count;

  }

  /* -------------------------------------------- */
  /* NODES                                        */
  /* -------------------------------------------- */

  public demoNode: HTMLElement;
  public counterNode: HTMLElement;

}
