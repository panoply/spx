import spx, { SPX } from 'spx';

export class Incremental extends spx.Component({
  name: 'incremental',
  state: {
    label: String,
    color: String,
    count: Number,
    click: Number,
    connect: Number,
    onmount: Number,
    unmount: 0
  },
  nodes: <const>[
    'color',
    'count',
    'label'
  ]
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

  labelValue ({ attrs }: SPX.Event<{ text: string; }>) {

    this.labelNode.innerText = attrs.text;

  }

  labelInput (event: SPX.InputEvent) {
    if (event.target instanceof HTMLInputElement) {

      this.labelNode.innerText = event.target.value;

    }
  }

  changeColor (event: SPX.InputEvent<{}, HTMLInputElement>) {

    this.state.color = event.target.value;
    this.colorNodes.forEach(color => {
      color.style.backgroundColor = this.state.color;
    });

  }

  reset () {

    this.state.count = 0;

  }

  onClick () {

    ++this.state.click;
  }

  increment () {

    ++this.state.count;

  }

  decrement () {

    --this.state.count;

  }

}
