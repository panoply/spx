import spx, { SPX } from 'spx';

export class Indicator extends spx.Component({
  nodes: <const>[
    'marker'
  ]
}) {

  toggle ({ attrs: { list } }: SPX.Event<{ list: number }>) {

    console.log(this.markerNode);

    this.markerNode.style.setProperty(
      'transform',
      `translateY(${this.view.offsetTop}px)`
    );

  }

}
