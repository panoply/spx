import spx from 'spx';

export class Literal extends spx.Component({
  state: {
    syncTime: Number,
    connectDelay: Number,
    connectText: String,
    onmountDelay: Number,
    fetchExample: Boolean,
    fetchedData: Array,
    firstRun: {
      typeof: Boolean,
      default: true
    }
  },
  sugar: true,
  nodes: <const>[
    'div',
    'pre'
  ]
}) {

  get buttonDom () {

    return spx.dom`
      <button type="button">
        Inserted
      </button>
    `;

  }

  get preDom () {

    return spx.dom`
      <div>
        <h1>
          This is a pre element and will be preserved
        </h1>


        <pre>

          const xxx = 'newlines preserved'

          function whitespace () {           return      'preserved'           }

        </pre>
      </div>
    `;

  }

  onmount () {

    this.divNode.appendChild(this.buttonDom);
    this.preNode.appendChild(this.preDom);

  }

}
