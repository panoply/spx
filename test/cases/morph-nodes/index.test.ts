/* eslint-disable no-use-before-define */

import spx, { SPX } from 'spx';

export class MorphNodes extends spx.Component({
  nodes: <const>[
    'alpha',
    'omega'
  ]
}) {

  onmount (page: SPX.Page) {

    if (page.key.indexOf('/page-c') > -1) {

      this.alphaNode.style.backgroundColor = 'blue';

    } else if (page.key.indexOf('/page-b') > -1) {

      this.alphaNode.style.backgroundColor = 'red';

    } else if (page.key.indexOf('/page-a') > -1) {

      this.alphaNode.style.backgroundColor = 'green';

    }

  }

}
