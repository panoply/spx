import { Controller } from '@hotwired/stimulus';
import relapse, { Relapse } from 'relapse';
import spx from 'spx';

/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */

export class Accordion extends Controller<HTMLElement> {

  accordion: Relapse;
  multipleValue: boolean;
  persistValue: boolean;

  static values = {
    multiple: {
      type: Boolean,
      default: false
    },
    persist: {
      type: Boolean,
      default: true
    }
  };

  /**
   * Stimulus Initialize
   */
  connect (): void {

    this.accordion = relapse(this.element, {
      multiple: this.multipleValue,
      persist: this.persistValue
    });

  }

  /**
   * Stimulus Disconnect
   */
  disconnect () {

    this.accordion.destroy();

  }

  /**
   * Programmatic Visit
   *
   * Executes a programmatic visit
   */
  goto ({ target }: { target: HTMLLinkElement }) {

    spx.visit(target.id);

  }

  /**
   * Open Fold
   *
   * Event target should be the the fold index to open
   */
  open ({ target: { dataset: { index } } }) {

    return this.accordion.folds[parseInt(index)].open();

  }

  /**
   * Close Fold
   *
   * Event target should be the the fold index to close
   */
  close ({ target: { dataset: { index } } }) {

    return this.accordion.folds[parseInt(index)].close();

  }

}
