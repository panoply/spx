/* eslint-disable no-use-before-define */
import spx from 'spx';
import qvp from 'qvp';

/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */

export class Drawer extends spx.Component<typeof Drawer.define> {

  static define = {
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
  connect () {

    if (!this.backdrop) {
      this.backdrop = document.createElement('div');
      this.backdrop.className = 'drawer-backdrop';
      this.backdrop.setAttribute('spx-morph', 'false');
    }

    if (this.root.classList.contains('d-none')) {
      this.root.classList.remove('d-none');
    }

    if (this.state.mode !== 'overlay' && this.dom.hasShiftNode === false) {
      console.error('Missing "data-drawer-shift-value" defintions on:', this.dom);
    }

    if (document.body.contains(this.backdrop) === false) {
      document.body.appendChild(this.backdrop);
    }

    if (this.state.hasWidth) {
      this.root.style.setProperty('width', this.state.width);
    }

    if (this.state.hasHeight) {
      this.root.style.setProperty('height', this.state.height);
    }

    if (this.state.hasDirection && this.root.classList.contains('backdrop') === false) {
      this.root.classList.add('backdrop');
    }

    if (this.state.mode === 'pull') {
      this.root.style.setProperty('transform', 'translateX(0)');
      this.root.style.setProperty('z-index', '0');
    }

    if (this.html.classList.contains('drawer-open')) {
      this.html.classList.remove('drawer-open');
    }

  }

  onmount () {

    spx.on('load', () => this.close(), this);

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

    if (!this.root.classList.contains('drawer-active')) {
      this.root.classList.add('drawer-active');
    }

    if (!this.backdrop.classList.contains('backdrop')) {
      this.backdrop.classList.add('backdrop');
    }

    if (this.state.bodyScroll === false) {
      this.html.style.setProperty('overflow', 'hidden');
    }

    if (this.dom.hasShiftNode) {
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
    this.root.ariaHidden = 'false';
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

    if (this.dom.hasShiftNode) {
      this.shiftElements();
    } else {
      this.root.addEventListener('transitionend', this.transition);
    }

    this.html.classList.remove('drawer-open');
    this.backdrop.removeEventListener('click', this.toggle);
    this.root.classList.remove('drawer-active');
    this.root.ariaHidden = 'true';

  };

  transition = (event: TransitionEvent) => {

    if (event.propertyName !== 'transform') return;

    if (this.dom.hasShiftNode) {
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
      this.root.removeEventListener(event.type, this.transition);
    }

  };

  shiftElements () {

    if (this.state.mode === 'pull') {

      this.root.style.setProperty('transform', 'translateX(0)');
      this.root.style.setProperty('z-index', '0');

      if (this.state.isOpen === false) {
        this.shiftNode.addEventListener('transitionend', this.transition);
      }

    } else {

      if (this.state.isOpen === false) {
        this.root.addEventListener('transitionend', this.transition);
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

    if (event.target !== this.root) {
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
      if (this.root.scrollHeight <= this.root.clientHeight) {
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
