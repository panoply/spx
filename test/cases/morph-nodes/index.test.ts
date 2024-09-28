/* eslint-disable no-use-before-define */

import spx, { SPX } from 'spx';

export class MorphNodes extends spx.Component({
  sugar: true,
  nodes: <const>[
    'alpha',
    'omega'
  ]
}) {

  onmount (page: SPX.Page) {

    console.log(this.alpha);

    if (page.key.indexOf('/page-c') > -1) {

      this.alpha.style.backgroundColor = 'blue';

    } else if (page.key.indexOf('/page-b') > -1) {

      this.alpha.style.backgroundColor = 'red';

    } else if (page.key.indexOf('/page-a') > -1) {

      this.alpha.style.backgroundColor = 'green';

    }

  }

}
