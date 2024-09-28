import spx, { SPX } from 'spx';

export class Cases extends spx.Component({
  sugar: true,
  nodes: <const>[ 'link' ]
}) {

  onClick ({ target }: SPX.Event<HTMLAnchorElement>) {

    this.link(link => {

      link.isEqualNode(target)
        ? link.addClass('fc-pink')
        : link.removeClass('fc-pink');

    });

  }

}
