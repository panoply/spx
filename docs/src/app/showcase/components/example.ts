

  import spx, { SPX } from 'spx'

  export class Example extends spx.Component {

    public state?: SPX.Attrs<typeof Example.attrs>

    static attrs = {
      price: Number,
      color: String
    }

    onInit() {

      this.state.hasColor // exists
      this.state.color    // value

      this.listNode      // element
      this.sizeNodes     // element[]

    }

    onLoad() {}  // Lifecycle method
    onExit() {}  // Lifecycle method
    onCache() {} // Lifecycle method

    toggle(event: Event) {
      this.listNode.classList.toggle('open')
    }

  }


