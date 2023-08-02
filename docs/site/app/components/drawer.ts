import { Controller } from '@hotwired/stimulus';
import spx from 'spx';
import qvp from 'qvp'

/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */

export class Drawer extends Controller<HTMLElement> {

  static backdrop: HTMLDivElement = null;

  /**
   * Stimulus: values
   */
  static values = {
    outsideClick: Boolean,
    height: String,
    width: String,
    offset: String,
    direction: String,
    shift: String,
    isOpen: {
      type: Boolean,
      default: false
    },
    bodyScroll: {
      type: Boolean,
      default: false
    },
    backdrop: {
      type: Boolean,
      default: true
    },
    mode: {
      type: String,
      default: 'overlay'
    }
  };

  /**
   * Stimulus: values
   */
  static targets = [
    'mount'
  ];

  /**
   * Stimulus: values
   */
  static classes = [
    'backdrop'
  ];

  /**
   * Returns the backdrop element
   */
  get backdrop() {
    return Drawer.backdrop;
  }

  /**
   * Returns the drawer direction class name
   */
  get directionClass() {
    return `drawer-${this.directionValue}`;
  }

  /**
   * Returns the drawer shift class name
   */
  get shiftClass() {
    return `drawer-${this.modeValue}`;
  }

  /**
   * Returns the shifts transition class name
   */
  get shifts() {
    return document.body.querySelectorAll<HTMLElement>(this.shiftValue);
  }

  /**
   * Returns all button toggles in the dom
   */
  get buttons() {
    return document.body.querySelectorAll(`[data-drawer="${this.element.id}"]`);
  }

  /**
   * Stimulus: Initialize
   */
  initialize() {

    if (Drawer.backdrop === null) {
      Drawer.backdrop = document.createElement('div');
      Drawer.backdrop.className = 'drawer-backdrop';
    }

    if (this.element.classList.contains('d-none')) {
      this.element.classList.remove('d-none');
    }

    if (this.modeValue !== 'overlay' && this.hasShiftValue === false) {
      console.error('Missing "data-drawer-shift-value" defintions on:', this.element);
    }

  }

  /**
   * Stimulus: Connect
   */
  connect() {

    this.buttons.forEach(button => button.addEventListener('click', this.toggle, false));

    if (document.body.contains(Drawer.backdrop) === false) {
      document.body.appendChild(Drawer.backdrop);
    }

    if (this.hasWidthValue) {
      this.element.style.setProperty('width', this.widthValue);
    }

    if (this.hasHeightValue) {
      this.element.style.setProperty('height', this.heightValue);
    }

    if (this.hasDirectionValue && this.element.classList.contains(this.directionClass) === false) {
      this.element.classList.add(this.directionClass);
    }

    if (this.modeValue === 'pull') {
      this.element.style.setProperty('transform', 'translateX(0)');
      this.element.style.setProperty('z-index', '0');
    }


    qvp.on('xs:onenter', function(this: Drawer) {

      this.element.classList.remove('drawer-active')

      spx.on('load', () => {
        if (this.isOpenValue) {
          this.backdrop.remove()
          this.close();
        }
      });

    }, this)

    qvp.on('xs:onexit', function(this: Drawer) {

      this.element.classList.add('drawer-active')

    }, this)



  }

  /**
   * Stimulus: Disconnect
   */
  disconnect() {



    this.buttons.forEach(button => button.removeEventListener('click', this.toggle, false));

  }

  /**
   * Open Drawer
   */
  open() {

    this.element.classList.add('drawer-active');

    if (this.hasBackdropClass && this.backdrop.classList.contains(this.backdropClass) === false) {
      this.backdrop.classList.add(this.backdropClass);
    }

    if (this.bodyScrollValue === false) document.body.style.setProperty('overflow', 'hidden');
    if (this.hasShiftValue) this.shiftNodes();

    if (this.hasWidthValue) {
      if (this.directionValue === 'top') {
        this.backdrop.style.setProperty('transform', `translateY(-${this.offsetValue})`);
      } else if (this.directionValue === 'left') {
        this.backdrop.style.setProperty('transform', `translateX(${this.widthValue})`);
      } else if (this.directionValue === 'right') {
        this.backdrop.style.setProperty('transform', `translateX(-${this.widthValue})`);
      }
    }

    document.documentElement.classList.add('drawer-open');
    this.backdrop.addEventListener('click', this.toggle);
    this.element.addEventListener('touchstart', this.touchStart, { passive: true });
    this.element.setAttribute('aria-hidden', 'false');

  }

  close() {

    if (this.isOpenValue) this.isOpenValue = false

    if (this.hasWidthValue) {
      this.backdrop.style.removeProperty('transform');
    }

    if (this.bodyScrollValue === false) {
      document.body.style.removeProperty('overflow');
    }

    if (this.hasShiftValue) {
      this.shiftNodes();
    } else {
      this.element.addEventListener('transitionend', this.transition);
    }

    document.documentElement.classList.remove('drawer-open');
    this.element.setAttribute('aria-hidden', 'true');
    this.element.removeEventListener('touchstart', this.touchStart);
    this.backdrop.removeEventListener('click', this.toggle);
    this.element.classList.remove('drawer-active');

  };

  transition = (event: TransitionEvent) => {

    if (event.propertyName !== 'transform') return;

    if (this.hasBackdropClass && this.backdrop.classList.contains(this.backdropClass)) {
      this.backdrop.classList.remove(this.backdropClass);
    }

    if (this.hasShiftValue) {
      this.shifts.forEach(node => {
        if (node.classList.contains(this.shiftClass)) {
          node.classList.remove(this.shiftClass);
          node.style.removeProperty('transform');
        }
      });
    }


    if (this.modeValue === 'pull') {
      this.shifts.item(0).removeEventListener(event.type, this.transition);
    } else {
      this.element.removeEventListener(event.type, this.transition);
    }
  };

  /**
   * Applies requirements for the elements which require shifting
   */
  shiftNodes() {

    if (this.modeValue === 'pull') {

      this.element.style.setProperty('transform', 'translateX(0)');
      this.element.style.setProperty('z-index', '0');

      if (this.isOpenValue === false) {
        this.shifts.item(0).addEventListener('transitionend', this.transition);
      }

    } else {
      if (this.isOpenValue === false) {
        this.element.addEventListener('transitionend', this.transition);
      }
    }

    this.shifts.forEach((node, index) => {

      if (this.isOpenValue) {

        if (!node.classList.contains(this.shiftClass)) node.classList.add(this.shiftClass);

        if (this.hasWidthValue) {
          if (this.directionValue === 'left') {
            node.style.setProperty('transform', `translateX(${this.widthValue})`);
          } else if (this.directionValue === 'right') {
            node.style.setProperty('transform', `translateX(-${this.widthValue})`);
          }
        } else if (this.hasHeightValue) {
          if (this.directionValue === 'top' || this.directionValue === 'bottom') {
            node.style.setProperty('transform', `translateY(-${this.heightValue})`);
          }
        }

      } else {

        if (this.hasWidthValue) {
          if (this.directionValue === 'left' || this.directionValue === 'right') {
            node.style.setProperty('transform', 'translateX(0)');
          }
        } else if (this.hasHeightValue) {
          if (this.directionValue === 'top' || this.directionValue === 'bottom') {
            node.style.setProperty('transform', 'translateY(0)');
          }
        }
      }

    });

  }

  /**
   * Touch Start scroll position
   */
  touchStart({ target }: TouchEvent) {

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

    if (event.target !== this.element) {
      this.close();
      document.body.removeEventListener('click', this.outsideClick, false);
    }

  };

  /**
   * Toggle Drawer
   */
  toggle = (event: MouseEvent) => {

    event.preventDefault();

    this.isOpenValue = !this.isOpenValue;

    return this.isOpenValue ? this.open() : this.close();

  };

  /**
   * Touch Move prevention event
   */
  touchMove = (event: TouchEvent) => {

    if (this.isOpenValue) {
      if (this.element.scrollHeight <= this.element.clientHeight) {
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
   * Stimulus: Whether or not the drawer is opened
   */
  isOpenValue: boolean;

  /**
   * Stimulus: The drawer effect
   */
  modeValue: 'pull' | 'push' | 'overlay';

  /**
   * Stimulus: The offset values, eg: top, right, bottom and left (in that order)
   */
  bodyScrollValue: boolean;

  /**
   * Stimulus: The offset values, eg: top, right, bottom and left (in that order)
   */
  offsetValue: string;

  /**
   * Stimulus: Whether or not an offset value was provided
   */
  hasOffsetValue: string;

  /**
   * Stimulus: The height of the drawer
   */
  heightValue: string;

  /**
   * Stimulus: Whether or not an height value was provided
   */
  hasHeightValue: string;

  /**
   * Stimulus: The width of the drawer
   */
  widthValue: string;

  /**
   * Stimulus: Whether or not a width value was provided
   */
  hasWidthValue: string;

  /**
   * Stimulus: The drawer direction
   */
  directionValue: 'left' | 'right' | 'top' | 'bottom';

  /**
   * Stimulus: Whether or not a direction value was provided
   */
  hasDirectionValue: string;

  /**
   * Stimulus: A list of selectors that will shift
   */
  shiftValue: string;

  /**
   * Stimulus: Whether or not a shift value was provided
   */
  hasShiftValue: boolean;

  /**
   * Stimulus: Whether or not a backdrop class was provided
   */
  hasBackdropClass: boolean;

  /**
   * Stimulus: The backdrop class value
   */
  backdropClass: string;

}
