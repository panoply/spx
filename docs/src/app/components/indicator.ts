import spx from 'spx';

export class Indicator extends spx.Component {

  toggle ({
    attrs: { list }
  }: {
    attrs: {
      list: number
    }
  }) {

    console.log(this.markerNodes)

    this.markerNode.style.setProperty(
      'transform',
      `translateY(${this.dom.offsetTop}px)`
    )

  }

  markerNode: HTMLElement

}

