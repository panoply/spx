import { Controller } from '@hotwired/stimulus';
import spx from 'spx';

export class Examples extends Controller {

  /**
   * Stimulus: values
   */
  static values = {
    type: String
  };

  /**
   * Stimulus targets
   */
  static targets = [ 'tab' ];

  connect (): void {

    const element = document.querySelector('#load-more');

    spx.on('intersect', ({ dom, node, observer, page }) => {

      if (node) {

        const load = dom.querySelector('#load') as HTMLElement;
        node.replaceWith(load);
        const { children } = dom.querySelector('#load-more');
        element.append(...children);
        observer.observe(load);

        return document;

      }

      return false;

    });
  }

}
