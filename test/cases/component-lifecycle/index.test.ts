import spx from 'spx';

export class Lifecycle extends spx.Component({
  state: {
    connect: Number,
    onmount: Number,
    unmount: 0
  }
}) {

  connect (): void {

    ++this.state.connect;

  }

  onmount (): void {

    ++this.state.onmount;

  }

  unmount (): void {

    ++this.state.unmount;

  }

}
