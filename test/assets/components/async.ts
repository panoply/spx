import spx from 'spx';

export class Async extends spx.Component<typeof Async.connect> {

  static delay (time: number) {
    return new Promise<void>((resolve) => setTimeout(() => resolve(), time));
  }

  static connect = {
    id: 'async',
    state: {
      noDelay: Boolean,
      initDelay: Number,
      loadDelay: Number
    },
    nodes: <const>[
      'init',
      'load'
    ]
  };

  async oninit () {

    await Async.delay(this.state.initDelay);
    this.initNode.innerText = `Initialized after ${this.state.initDelay}ms`;

  }

  async onload () {

    await Async.delay(this.state.loadDelay);
    this.loadNode.innerText = `Loaded after ${this.state.loadDelay}ms`;

  }

  /* -------------------------------------------- */
  /* NODES                                        */
  /* -------------------------------------------- */

  public initNode: HTMLElement;
  public loadNode: HTMLElement;

}

export class Async2 extends spx.Component<typeof Async.connect> {

  static delay (time: number) {
    return new Promise<void>((resolve) => setTimeout(() => resolve(), time));
  }

  static connect = {
    id: 'async2',
    state: {
      noDelay: Boolean,
      initDelay: Number,
      loadDelay: Number
    },
    nodes: <const>[
      'init',
      'load'
    ]
  };

  async oninit () {

    await Async.delay(this.state.initDelay);
    this.initNode.innerText = `Initialized after ${this.state.initDelay}ms`;

  }

  onload () {

    this.loadNode.innerText = `Loaded after ${this.state.loadDelay}ms`;

  }

  /* -------------------------------------------- */
  /* NODES                                        */
  /* -------------------------------------------- */

  public initNode: HTMLElement;
  public loadNode: HTMLElement;

}
