/* eslint-disable no-use-before-define */
import spx, { SPX } from 'spx';
import qvp from 'qvp';

/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */

export class Drawer extends spx.Component {

  /**
   * The backdrop element
   */
  static backdrop: HTMLDivElement;

  /**
   * Stimulus: values
   */
  static connect = {
    state: {
      outsideClick: Boolean,
      height: String,
      width: String,
      offset: String,
      direction: String,
      shift: String,
      redraw: String,
      useParent: {
        typeof: Boolean,
        default: false
      },
      isOpen: {
        typeof: Boolean,
        default: false
      },
      bodyScroll: {
        typeof: Boolean,
        default: false
      },
      backdrop: {
        typeof: Boolean,
        default: true
      },
      mode: {
        typeof: String,
        default: 'overlay'
      }
    }
  };

  public state: SPX.State<typeof Drawer.connect>;

  /**
   * Returns the backdrop element
   */
  get backdrop () {
    return Drawer.backdrop;
  }

  /**
   * Returns the drawer direction class name
   */
  get directionClass () {
    return `drawer-${this.state.direction}`;
  }

  /**
   * Returns the drawer shift class name
   */
  get shiftClass () {
    return `drawer-${this.state.mode}`;
  }

  /**
   * Returns the shifts transition class name
   */
  get shifts () {
    return this.html.querySelectorAll<HTMLElement>(this.state.shift);
  }

  /**
   * Returns all button toggles in the dom
   */
  get buttons () {
    return this.html.querySelectorAll(`[data-drawer="${this.target.id}"]`);
  }

  /**
   * Stimulus: Initialize
   */
  onInit () {

    if (!Drawer.backdrop) {
      Drawer.backdrop = document.createElement('div');
      Drawer.backdrop.className = 'drawer-backdrop';
      Drawer.backdrop.setAttribute('spx-morph', 'false');
    }

    if (this.state.useParent) {
      this.target = this.dom.parentElement;
      this.target.ariaHidden = 'true';
    } else {
      this.target = this.dom;
    }

    if (this.target.classList.contains('d-none')) {
      this.target.classList.remove('d-none');
    }

    if (this.state.mode !== 'overlay' && this.state.hasShift === false) {
      console.error('Missing "data-drawer-shift-value" defintions on:', this.target);
    }

    spx.on('load', this.onLoad, this);

    for (const button of this.buttons) {
      button.addEventListener('click', this.toggle);
    }

    if (this.html.contains(Drawer.backdrop) === false) {
      this.html.appendChild(Drawer.backdrop);
    }

    if (this.state.hasWidth) {
      //   this.target.style.setProperty('width', this.state.width);
    }

    if (this.state.hasHeight) {
      this.target.style.setProperty('height', this.state.height);
    }

    if (this.state.hasDirection && this.target.classList.contains('backdrop') === false) {
      this.target.classList.add('backdrop');
    }

    if (this.state.mode === 'pull') {
      this.target.style.setProperty('transform', 'translateX(0)');
      this.target.style.setProperty('z-index', '0');
    }

    if (this.html.classList.contains('drawer-open')) {
      this.html.classList.remove('drawer-open');
    }

  }

  /**
   * Stimulus: Disconnect
   */
  disconnect () {

    //  this.buttons.forEach(button => button.removeEventListener('click', this.toggle, false));

  }

  onLoad () {

    if (this.state.isOpen) {
      if (qvp.test([ 'lg', 'xl', 'xxl' ])) {
        this.close();
      } else {
        setTimeout(this.close.bind(this), 250);
      }
    }
  }

  /**
   * Open Drawer
   */
  open () {

    if (!this.target.classList.contains('drawer-active')) {
      this.target.classList.add('drawer-active');
    }

    if (!this.backdrop.classList.contains('backdrop')) {
      this.backdrop.classList.add('backdrop');
    }

    if (this.state.bodyScroll === false) {
      this.html.style.setProperty('overflow', 'hidden');
    }

    if (this.state.hasShift) {
      this.shiftNodes();
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
    this.target.addEventListener('touchstart', this.touchStart, { passive: true });
    this.target.ariaHidden = 'false';
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

    if (this.state.hasShift) {
      this.shiftNodes();
    } else {
      this.target.addEventListener('transitionend', this.transition);
    }

    this.html.classList.remove('drawer-open');
    this.target.removeEventListener('touchstart', this.touchStart);
    this.backdrop.removeEventListener('click', this.toggle);
    this.target.classList.remove('drawer-active');
    this.target.ariaHidden = 'true';

  };

  transition = (event: TransitionEvent) => {

    if (event.propertyName !== 'transform') return;

    if (this.state.hasShift) {
      for (const shift of this.shifts) {
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
      this.shifts.item(0).removeEventListener(event.type, this.transition);
    } else {
      this.target.removeEventListener(event.type, this.transition);
    }

  };

  /**
   * Set attribute requirements for the elements which apply transform shifting
   */
  shiftNodes () {

    if (this.state.mode === 'pull') {

      this.target.style.setProperty('transform', 'translateX(0)');
      this.target.style.setProperty('z-index', '0');

      if (this.state.isOpen === false) {
        this.shifts.item(0).addEventListener('transitionend', this.transition);
      }

    } else {

      if (this.state.isOpen === false) {
        this.target.addEventListener('transitionend', this.transition);
      }
    }

    for (const shift of this.shifts) {

      if (this.state.isOpen) {

        if (!shift.classList.contains(this.shiftClass)) {
          shift.classList.add(this.shiftClass);
        }

        if (this.state.width && (this.state.direction === 'left' || this.state.direction === 'right')) {
          shift.style.setProperty('transform', `translateX(${this.state.width})`);
        } else if (this.state.hasHeight && (this.state.direction === 'top' || this.state.direction === 'bottom')) {
          shift.style.setProperty('transform', `translateY(${this.state.height})`);
        }

      } else {
        if (this.state.width && (this.state.direction === 'left' || this.state.direction === 'right')) {
          shift.style.setProperty('transform', 'translateX(0)');
        } else if (this.state.hasHeight && (this.state.direction === 'top' || this.state.direction === 'bottom')) {

          shift.style.setProperty('transform', 'translateY(0)');

        }
      }
    }
  }

  /**
   * Touch Start scroll position
   */
  touchStart ({ target }: TouchEvent) {

    if (target instanceof HTMLElement) {

      const { scrollTop, offsetHeight } = target;
      const position = scrollTop + offsetHeight;

      if (scrollTop === 0) {
        target.scrollTop = 1;
      } else if (position === scrollTop) {
        target.scrollTop = scrollTop - 1;
      }
    }
  }

  /**
   * Click detected outside, eg: document body
   */
  outsideClick = (event: Event) => {

    if (event.target !== this.target) {
      this.close();
      this.html.removeEventListener('click', this.outsideClick, false);
    }

  };

  /**
   * Toggle Drawer
   */
  toggle = (event?: MouseEvent) => {

    if (event) event.preventDefault();

    this.state.isOpen = !this.state.isOpen;

    if (this.state.isOpen) {
      this.open();
    } else {
      this.close();
    }

    return this.state.isOpen ? this.open() : this.close();

  };

  /**
   * Touch Move prevention event
   */
  touchMove = (event: TouchEvent) => {

    if (this.state.isOpen) {
      if (this.target.scrollHeight <= this.target.clientHeight) {
        event.preventDefault();
      }
    }

  };

  /**
   * Keyboard events
   */
  keyboard = (event: KeyboardEvent) => {

    switch (event.code) {
      case 'Esc':
      case 'Escape': this.close(); break;
    }

  };

  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */

  /**
   * The drawer target. This defaults to use `this.element` depending on whether or not
   * the use parent is set to `true` - In such cases the parent element will used instead.
   */
  target: HTMLElement;

}
