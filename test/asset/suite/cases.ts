import spx, { SPX } from 'spx';

export class Cases extends spx.Component({
  nodes: <const>[ 'link' ]
}) {

  onClick ({ target }: SPX.Event<HTMLAnchorElement>) {

    this.linkNodes.forEach(link => {

      link.isEqualNode(target) ? link.classList.add('fc-pink') : link.classList.remove('fc-pink');

    });

  }

}
