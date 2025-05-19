import spx from 'spx';

export class Async extends spx.Component({
  id: 'async',
  state: {
    syncTime: Number,
    connectDelay: Number,
    connectText: String,
    onmountDelay: Number,
    fetchExample: Boolean,
    fetchedData: Array,
    firstRun: true
  },
  nodes: <const>[
    'connect',
    'mounted'
  ]
}) {

  static delay (time: number) {

    return new Promise<void>((resolve) => setTimeout(() => resolve(), time));

  }

  async connect () {

    const begin = performance.now();

    if (this.state.fetchExample) {

      const response = await fetch('https://api.placeholderjson.dev/shipments');
      this.state.connectDelay = performance.now();
      const time = `${Math.abs(begin - this.state.connectDelay)}`.split('.')[0];

      this.state.fetchedData = await response.json();
      this.state.connectText = `Fetched in ${time}ms`;

    } else if (!this.state.hasConnectDelay && !this.state.hasConnectDelay) {

      const finish = performance.now();

      this.state.syncTime = begin;

      const time = `${Math.abs(this.state.syncTime - finish)}`.split('.')[0];

      this.state.connectText = `Connected in ${time}ms`;

    } else {

      await Async.delay(this.state.connectDelay);

      this.state.connectText = `Connected in ${this.state.connectDelay / 10}ms`;

    }

  }

  async onmount () {

    const begin = performance.now();

    if (this.state.fetchExample) {
      if (this.state.firstRun) {
        await Async.delay(this.state.onmountDelay);
      } else {
        console.log(this.state.fetchedData);
      }
    } else {
      await Async.delay(this.state.onmountDelay);
    }

    if (this.state.firstRun) {

      if (!this.state.hasConnectDelay && !this.state.hasOnmountDelay) {
        const finish = performance.now();
        const time = `${Math.abs(this.state.syncTime - finish)}`.split('.')[0];
        this.mountedNode.innerText = `Mounted in ${time}ms`;
      } else {
        const time = `${Math.abs((this.state.connectDelay + this.state.onmountDelay) / 10)}`.split('.')[0];
        this.mountedNode.innerText = `Mounted in ${time}ms`;
      }

      this.state.firstRun = false;

    } else {

      if (!this.state.hasConnectDelay && !this.state.hasOnmountDelay) {
        const finish = performance.now();
        const time = `${Math.abs(begin - finish)}`.split('.')[0];
        this.mountedNode.innerText = `Mounted in ${time}ms`;
      } else {
        const time = this.state.onmountDelay / 10;
        this.mountedNode.innerText = `Mounted in ${time}ms`;
      }
    }

  }

}
