import spx from 'spx';

export class Async extends spx.Component<typeof Async.define> {

  static delay (time: number) {
    return new Promise<void>((resolve) => setTimeout(() => resolve(), time));
  }

  static define = {
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

  async connect () {

    await Async.delay(this.state.initDelay);
    this.initNode.innerText = `Initialized after ${this.state.initDelay}ms`;

  }

  async onmount () {

    await Async.delay(this.state.loadDelay);
    this.loadNode.innerText = `Loaded after ${this.state.initDelay + this.state.loadDelay}ms`;

  }

  /* -------------------------------------------- */
  /* NODES                                        */
  /* -------------------------------------------- */

  public initNode: HTMLElement;
  public loadNode: HTMLElement;

}

export class Async2 extends spx.Component<typeof Async.define> {

  static delay (time: number) {
    return new Promise<void>((resolve) => setTimeout(() => resolve(), time));
  }

  static define = {
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

  async connect () {

    await Async.delay(this.state.initDelay);
    this.initNode.innerText = `Initialized after ${this.state.initDelay}ms`;

  }

  onmount () {

    this.loadNode.innerText = `Loaded after ${this.state.loadDelay}ms`;

  }

  /* -------------------------------------------- */
  /* NODES                                        */
  /* -------------------------------------------- */

  public initNode: HTMLElement;
  public loadNode: HTMLElement;

}

export class AsyncFetch extends spx.Component<typeof AsyncFetch.define> {

  static define = {
    state: {
      data: Array
    }
  };

  async connect () {
    // Fake Request
    const response = await fetch('https://api.placeholderjson.dev/shipments');
    // Store in state
    this.state.data = await response.json();

  }

  onmount () {

    // The connect hook will trigger before onmount so state
    // will be available in this hook.
    console.log(this.state.data);

  }

  unmount (page) {

    // Fired when the component has been removed from the DOM
    console.log(page);

  }

}
