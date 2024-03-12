import spx from 'spx';

export class Modal extends spx.Component<typeof Modal.connect> {

  static connect = {
    state: {
      isOpen: Boolean
    }
  };

  open () {

    if (this.state.isOpen) return;
    this.dom.classList.add('is-open');
    this.state.isOpen = true;
  }

  close () {
    if (!this.state.isOpen) return;
    this.dom.classList.remove('is-open');
    this.state.isOpen = false;
  }

}
