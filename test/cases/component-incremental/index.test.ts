import spx, { SPX } from 'spx';

export class Incremental extends spx.Component({
  name: 'incremental',
  state: {
    label: String,
    color: String,
    count: Number
  },
  sugar: true,
  nodes: <const>[
    'color',
    'count',
    'label'
  ]
}) {

  labelValue ({ attrs }: SPX.Event<{
    text: string;
  }>) {

    this.label.innerText = attrs.text;

  }

  labelInput (event: SPX.InputEvent) {
    if (event.target instanceof HTMLInputElement) {

      this.label.innerText = event.target.value;

    }
  }

  changeColor (event: SPX.InputEvent<{}, HTMLInputElement>) {

    this.state.color = event.target.value;
    this.color.style.backgroundColor = this.state.color;

  }

  reset () {

    this.state.count = 0;

  }

  increment () {

    console.log('increment', this);

    ++this.state.count;

  }

  decrement () {

    console.log('decrement', this);

    --this.state.count;

  }

}
