/* eslint-disable no-use-before-define */
import { MergeExclusive } from 'type-fest';

class Folds {

  static instances = Object.create(null);
  private options: Accordion['options'];

  public accordion: MergeExclusive<Accordion, Element>;
  public id: string;
  public button: MergeExclusive<{ fold?: Folds }, HTMLButtonElement>;
  public content: MergeExclusive<{ fold?: Folds }, HTMLElement>;
  public focused: boolean;
  public expanded: boolean;
  public disabled: boolean;
  public aria = {
    button: {
      'aria-controls': () => `c${this.id}`,
      'aria-expanded': () => this.expanded ? 'true' : 'false',
      'aria-disabled': () => this.disabled ? 'true' : 'false'
    },
    content: {
      role: () => 'region',
      'aria-labelledby': () => `b${this.id}`
    }
  };

  constructor (accordion: Accordion, button: Folds['button'], content: Folds['content']) {

    if (button.fold) return;

    this.accordion = accordion;
    this.options = this.accordion.options;

    if (!Folds.instances[this.accordion.id]) Folds.instances[this.accordion.id] = 0;

    this.button = this.options.button ? button : button.firstElementChild as HTMLButtonElement;
    this.content = content;
    this.button.fold = this;
    this.content.fold = this;

    if (!Folds.instances[this.accordion.id]) Folds.instances[this.accordion.id] = 0;

    this.id = `${this.accordion.id}f${++Folds.instances[this.accordion.id]}`;
    this.button.id = `${this.id}b`;
    this.content.id = `${this.id}c`;
    this.focused = false;
    this.expanded = false;
    this.disabled = false;

    this.bind();
    this.init();
    this.initOpen();
    this.initFocus();

    return this;
  }

  open (transition = true) {

    if (this.expanded) return;

    this.accordion.emit('open', this);
    this.expanded = true;

    if (!this.options.collapsible) this.disable();

    this.updateAria('button', 'aria-expanded');

    this.button.classList.add('open');
    this.content.classList.add('open');

    if (!transition) {
      this.opened();
    } else {
      this.content.style.height = `${(this.content.firstElementChild as any).offsetHeight}px`; ;
    }
  }

  close (transition = true) {

    if (!this.expanded) return;

    this.accordion.emit('close', this);
    this.expanded = false;

    if (!this.options.collapsible) this.enable();

    this.updateAria('button', 'aria-expanded');
    this.button.classList.remove('opened');
    this.content.classList.remove('opened');

    if (!transition) {
      this.closed();
    } else {
      this.content.style.height = `${(this.content.firstElementChild as any).offsetHeight}px`;
      requestAnimationFrame(() => { this.content.style.height = '0px'; });
    }
  }

  disable () {
    this.disabled = true;
    this.updateAria('button', 'aria-disabled');
    this.button.classList.add('disabled');
    this.content.classList.add('disabled');
  }

  enable () {
    this.disabled = false;
    this.updateAria('button', 'aria-disabled');
    this.button.classList.remove('disabled');
    this.content.classList.remove('disabled');
  }

  focus () {
    this.button.focus();
  }

  blur () {
    this.button.blur();
  }

  toggle (transition = true) {
    this.expanded ? this.close(transition) : this.open(transition);
  }

  destroy () {

    this.unbind();
    this.clean();
    this.button.classList.remove('open', 'opened', 'focus');
    this.content.classList.remove('open', 'opened', 'focus');
    this.content.classList.remove('focus');
    this.content.style.height = '0px'; // hide content
    this.button.fold = null;
    this.content.fold = null;
    this.button.removeAttribute('id');
    this.content.removeAttribute('id');
    this.accordion = null;
  }

  private opened () {
    this.content.style.height = 'auto';
    this.button.classList.add('opened');
    this.content.classList.add('opened');
    this.accordion.emit('opened', this);
  }

  private closed () {
    this.button.classList.remove('open');
    this.content.classList.remove('open');
    this.accordion.emit('closed', this);
  }

  private initOpen () {

    const button = this.button.getAttribute(this.options.initialOpenAttr);
    const content = this.content.getAttribute(this.options.initialOpenAttr);

    if (button !== null || content !== null) {
      this.options.initialOpen
        ? setTimeout(() => this.open(), this.options.initialOpenDelay)
        : this.open(false);
    }
  }

  private initFocus () {
    if (this.button.getAttribute('autofocus') === null) return;
    this.onFocus();
  }

  private init () {
    this.updateAria('button');
    this.updateAria('content');
  }

  private clean () {
    this.updateAria('button', null, true);
    this.updateAria('content', null, true);
  }

  private updateAria (element: string, property = null, remove = false) {

    if (!this.options.ariaEnabled) return;

    if (property) {
      this[element].setAttribute(property, this.aria[element][property]());
    } else {
      for (const property in this.aria[element]) {
        if (!this.aria?.[property]) continue;
        if (remove) {
          this[element].removeAttribute(property);
        } else {
          this[element].setAttribute(property, this.aria[element][property]());
        }
      }
    }
  }

  private transition = (event: TransitionEvent) => {
    if (event.target === event.currentTarget && event.propertyName === 'height') {
      this.expanded ? this.opened() : this.closed();
    }
  };

  private onFocus = () => {
    this.focused = true;
    this.button.classList.add('focus');
    this.content.classList.add('focus');
    this.accordion.emit('focus', this);
  };

  private onBlur = () => {
    this.focused = false;
    this.button.classList.remove('focus');
    this.content.classList.remove('focus');
    this.accordion.emit('blur', this);
  };

  private onClick = (event: Event) => {
    this.focus();
    if (this.disabled) return;
    this.toggle();
  };

  private onKeydown = (e: KeyboardEvent) => {

    if (!this.options.keyboard) return;

    let action = null;

    switch (e.which) {
      case 40: action = 'next'; break; // Arrow Down
      case 38: action = 'prev'; break; // Arrow Up
      case 36: action = 'first'; break; // Home
      case 35: action = 'last'; break; // End
      case 34: if (e.ctrlKey) action = 'next'; break; // Page down
      case 33: if (e.ctrlKey) action = 'prev'; break; // Page Up
    }

    if (action) {
      e.preventDefault();
      this.accordion.focus(action);
    }

  };

  private onContentKey = (event: KeyboardEvent) => {

    if (!this.options.keyboard || !event.ctrlKey) return;

    const action = event.which === 34
      ? 'next'
      : event.which === 33
        ? 'prev'
        : null;

    if (action) {
      event.preventDefault();
      this.accordion.focus(action);
    }
  };

  private bind () {
    this.button.addEventListener('focus', this.onFocus);
    this.button.addEventListener('blur', this.onBlur);
    this.button.addEventListener('click', this.onClick);
    this.button.addEventListener('keydown', this.onKeydown);
    this.content.addEventListener('keydown', this.onContentKey);
    this.content.addEventListener('transitionend', this.transition);
  }

  private unbind () {
    this.button.removeEventListener('focus', this.onFocus);
    this.button.removeEventListener('blur', this.onBlur);
    this.button.removeEventListener('click', this.onClick);
    this.button.removeEventListener('keydown', this.onKeydown);
    this.content.removeEventListener('keydown', this.onContentKey);
    this.content.removeEventListener('transitionend', this.transition);
  }

};

class Listener {

  public events: { [name: string]: Array<() => void> } = {};

  emit (name: string, scope: Folds | Accordion) {

    const event = this.events[name] || [];
    const length = event.length;

    for (let i = 0; i < length; i++) event[i].apply(scope);

  }

  on (name: string, callback: (folds?: Folds) => void) {

    if (!this.events[name]) this.events[name] = [];

    this.events[name].push(callback);

  }

  off (name: string, callback: () => void) {

    const event = this.events[name];
    const live = [];

    if (event && callback) {
      let i = 0;
      const len = event.length;
      for (; i < len; i++) if (event[i] !== callback) live.push(event[i]);
    }

    if (live.length) event[name] = live;
    else delete event[name];

  }

}

/**
 * Accordion
 *
 * Uses the following id combinator
 *
 * a = 'accordion'
 * f = 'fold number'
 * b = 'button'
 * c = 'content'
 *
 * eg: a1b1c is accordion with id 1, fold number 1, button number and content target
 */
export class Accordion extends Listener {

  static instances = 0;

  options: {
    /**
     * Whether W3C keyboard shortcuts are enabled
     */
    keyboard: boolean,

    button: boolean,
    /**
     * Whether multiple folds can be opened at once
     */
    multiselect: boolean,
    /**
     * Whether ARIA attributes are enabled
     */
    ariaEnabled: boolean,
    /**
     * Whether the folds are collapsible
     */
    collapsible: boolean,
    /**
     * Whether to loop header focus. Sets focus back to
     * first/last header when end/start reached.
     */
    carouselFocus: boolean,
    /**
     * Attribute for the header or content to open
     * folds at initialization
     */
    initialOpenAttr: string,
    /**
     * Whether to use transition at initial open
     */
    initialOpen: boolean,
    /**
     * Delay used to show initial transition
     */
    initialOpenDelay: number,
  } = {
      keyboard: true,
      button: false,
      multiselect: true,
      ariaEnabled: true,
      collapsible: true,
      carouselFocus: true,
      initialOpen: true,
      initialOpenDelay: 200,
      initialOpenAttr: 'data-open'
    };

  id: string;
  folds: Folds[] = [];
  element: MergeExclusive<{ fold?: Folds; accordion?: Accordion; }, HTMLElement>;
  active: Function;

  constructor (element: Element, options: Partial<Accordion['options']> = {}) {

    super();

    this.element = element as Accordion['element'];
    this.element.accordion = this;
    this.id = `a${++Accordion.instances}`;
    this.element.setAttribute('id', this.id);
    this.options = Object.assign(this.options, options);
    this.active = this.openFold;
    this.on('open', this.openFold);
    this.emit('open', this);
    this.init();
    this.setup();

  }

  setup () {

    const children = this.element.children;
    const length = children.length;

    for (let i = 0; i < length; i = i + 2) {

      const button = children[i] as Folds['button'];
      const content = children[i + 1] as Folds['content'];
      const fold: Folds = (!button.fold && button && content)
        ? new Folds(this, button, content)
        : button.fold;

      if (fold) this.folds.push(fold);
    }
  }

  focus (target: string) {

    let focused = null;

    const folds = this.folds.length;

    for (let i = 0; i < folds && focused === null; i++) {
      if (this.folds[i].focused) focused = i;
    }

    if ((target === 'prev' || target === 'next') && focused === null) {
      target = target === 'prev' ? 'last' : 'first';
    }

    if (target === 'prev' && focused === 0) {
      if (!this.options.carouselFocus) return;
      target = 'last';
    }

    if (target === 'next' && focused === folds - 1) {
      if (!this.options.carouselFocus) return;
      target = 'first';
    }

    switch (target) {
      case 'prev': this.folds[--focused].focus(); break;
      case 'next': this.folds[++focused].focus(); break;
      case 'last': this.folds[folds - 1].focus(); break;
      case 'first': default: this.folds[0].focus();
    }

  }

  destroy () {

    this.element.removeAttribute('id');

    for (const fold of this.folds) fold.destroy();

    this.clean();
    this.element.accordion = null;
    this.emit('destroy', this);

  }

  private openFold = (openFold: Folds) => {

    if (this.options.multiselect) return;
    for (const fold of this.folds) if (openFold !== fold) fold.close();

  };

  private init () {

    if (!this.options.ariaEnabled) return;
    if (this.options.multiselect) {
      this.element.setAttribute('aria-multiselectable', 'true');
    }

  }

  private clean () {

    this.element.removeAttribute('aria-multiselectable');

  }

}

export function accordion (element: Element, options: Partial<Accordion['options']> = {}) {

  return new Accordion(element, options);

}
