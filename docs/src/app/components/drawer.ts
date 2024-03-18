/* eslint-disable no-use-before-define */
import spx from 'spx';
import qvp from 'qvp';

/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */

export class Drawer extends spx.Component<typeof Drawer.connect> {

  static connect = {
    state: {
      outsideClick: Boolean,
      height: String,
      width: String,
      offset: String,
      direction: String,
      shift: String,
      redraw: String,
      isOpen: Boolean,
      bodyScroll: Boolean,
      backdrop: {
        typeof: Boolean,
        default: true
      },
      mode: {
        typeof: String,
        default: 'overlay'
      }
    },
    nodes: <const>[
      'button',
      'shift'
    ]
  };

  get directionClass () {
    return `drawer-${this.state.direction}`;
  }

  get shiftClass () {
    return `drawer-${this.state.mode}`;
  }

  /**
   * Stimulus: Initialize
   */
  oninit () {

    if (!this.backdrop) {
      this.backdrop = document.createElement('div');
      this.backdrop.className = 'drawer-backdrop';
      this.backdrop.setAttribute('spx-morph', 'false');
    }

    if (this.dom.classList.contains('d-none')) {
      this.dom.classList.remove('d-none');
    }

    if (this.state.mode !== 'overlay' && this.hasShiftNode === false) {
      console.error('Missing "data-drawer-shift-value" defintions on:', this.dom);
    }

    if (document.body.contains(this.backdrop) === false) {
      document.body.appendChild(this.backdrop);
    }

    if (this.state.hasWidth) {
      this.dom.style.setProperty('width', this.state.width);
    }

    if (this.state.hasHeight) {
      this.dom.style.setProperty('height', this.state.height);
    }

    if (this.state.hasDirection && this.dom.classList.contains('backdrop') === false) {
      this.dom.classList.add('backdrop');
    }

    if (this.state.mode === 'pull') {
      this.dom.style.setProperty('transform', 'translateX(0)');
      this.dom.style.setProperty('z-index', '0');
    }

    if (this.html.classList.contains('drawer-open')) {
      this.html.classList.remove('drawer-open');
    }

  }

  onload () {

    if (this.state.isOpen) {
      if (qvp.test([ 'lg', 'xl', 'xxl' ])) {
        this.close();
      } else {
        setTimeout(this.close.bind(this), 50);
      }
    }
  }

  /**
   * Open Drawer
   */
  open () {

    if (!this.dom.classList.contains('drawer-active')) {
      this.dom.classList.add('drawer-active');
    }

    if (!this.backdrop.classList.contains('backdrop')) {
      this.backdrop.classList.add('backdrop');
    }

    if (this.state.bodyScroll === false) {
      this.html.style.setProperty('overflow', 'hidden');
    }

    if (this.hasShiftNode) {
      this.shiftElements();
    }

    if (this.state.width) {
      if (this.state.direction === 'top') {
        this.backdrop.style.setProperty('transform', `translateY(-${this.state.offset})`);
      } else {
        this.backdrop.style.setProperty('transform', `translateX(${this.state.width})`);
      }
    }

    this.html.classList.add('drawer-open');
    this.backdrop.addEventListener('click', this.toggle, { once: true });
    this.dom.ariaHidden = 'false';
  }

  close () {

    if (this.state.isOpen) {
      this.state.isOpen = false;
    }

    if (this.state.width) {
      this.backdrop.style.removeProperty('transform');
    }

    if (this.state.bodyScroll === false) {
      this.html.style.removeProperty('overflow');
    }

    if (this.hasShiftNode) {
      this.shiftElements();
    } else {
      this.dom.addEventListener('transitionend', this.transition);
    }

    this.html.classList.remove('drawer-open');
    this.backdrop.removeEventListener('click', this.toggle);
    this.dom.classList.remove('drawer-active');
    this.dom.ariaHidden = 'true';

  };

  transition = (event: TransitionEvent) => {

    if (event.propertyName !== 'transform') return;

    if (this.hasShiftNode) {
      for (const shift of this.shiftNodes) {
        if (shift.classList.contains(this.shiftClass)) {
          shift.classList.remove(this.shiftClass);
          shift.style.removeProperty('transform');
        }
      }
    }

    if (this.backdrop.classList.contains('backdrop')) {
      this.backdrop.classList.remove('backdrop');
    }

    if (this.state.mode === 'pull') {
      this.shiftNode.removeEventListener(event.type, this.transition);
    } else {
      this.dom.removeEventListener(event.type, this.transition);
    }

  };

  shiftElements () {

    if (this.state.mode === 'pull') {

      this.dom.style.setProperty('transform', 'translateX(0)');
      this.dom.style.setProperty('z-index', '0');

      if (this.state.isOpen === false) {
        this.shiftNode.addEventListener('transitionend', this.transition);
      }

    } else {

      if (this.state.isOpen === false) {
        this.dom.addEventListener('transitionend', this.transition);
      }
    }

    for (const shift of this.shiftNodes) {
      if (this.state.isOpen) {

        if (!shift.classList.contains(this.shiftClass)) {
          shift.classList.add(this.shiftClass);
          console.log(shift);
        }

        if (this.state.hasWidth && (this.state.direction === 'left' || this.state.direction === 'right')) {
          shift.style.setProperty('transform', `translateX(${this.state.width})`);
        } else if (this.state.hasHeight && (this.state.direction === 'top' || this.state.direction === 'bottom')) {
          shift.style.setProperty('transform', `translateY(${this.state.height})`);
        }

      } else {

        if (this.state.hasWidth && (this.state.direction === 'left' || this.state.direction === 'right')) {
          shift.style.setProperty('transform', 'translateX(0)');
        } else if (this.state.hasHeight && (this.state.direction === 'top' || this.state.direction === 'bottom')) {
          shift.style.setProperty('transform', 'translateY(0)');
        }
      }
    }
  }

  outsideClick = (event: Event) => {

    if (event.target !== this.dom) {
      this.close();
      this.html.removeEventListener('click', this.outsideClick, false);
    }

  };

  toggle = (event?: MouseEvent) => {

    if (event) event.preventDefault();

    this.state.isOpen = !this.state.isOpen;

    if (this.state.isOpen) {
      this.open();
    } else {
      this.close();
    }

    return false;

  };

  touchMove = (event: TouchEvent) => {

    if (this.state.isOpen) {
      if (this.dom.scrollHeight <= this.dom.clientHeight) {
        event.preventDefault();
      }
    }

  };

  keyboard = (event: KeyboardEvent) => {

    switch (event.code) {
      case 'Esc':
      case 'Escape': this.close(); break;
    }

  };

  public backdrop: HTMLElement;
  public shiftNode: HTMLElement;
  public shiftNodes: HTMLElement[];
  public buttonNode: HTMLElement;
  public buttonNodes: HTMLElement[];

}
