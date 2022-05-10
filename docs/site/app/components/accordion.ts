import { Controller } from '@hotwired/stimulus';
import relapse  from 'relapse';
import spx from 'spx';

/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */

export class Accordion extends Controller {

  accordion: typeof relapse.accordion;
  buttonValue: boolean;
  multiselectValue: boolean;
  collapsibleValue: boolean;
  keyboardValue: boolean;
  initialOpenValue: boolean;
  initialDelayValue: number;

  static values = {
    button: {
      type: Boolean,
      default: true
    },
    multiselect: {
      type: Boolean,
      default: false
    },
    collapsible: {
      type: Boolean,
      default: true
    },
    initialOpen: {
      type: Boolean,
      default: false
    },
    initialDelay: {
      type: Number,
      default: 100
    },
    keyboard: {
      type: Boolean,
      default: true
    }

  };

  /**
   * Stimulus Initialize
   */
  connect (): void {

    this.accordion = relapse.accordion(this.element, {
      multiple: this.multiselectValue,
      transition: 250,
      fade:false,
      persist: false
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
  goto ({ target }: { target: HTMLButtonElement }) {

    spx.visit('/' + target.dataset.href);

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
