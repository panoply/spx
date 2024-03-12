/* eslint-disable no-use-before-define */

import spx, { SPX } from 'spx';
import Fuse from 'fuse.js';

interface Results {
  title: string;
  anchor: string;
  text: string;
  url: string;
}

export class Search extends spx.Component<typeof Search.connect> {

  public fuse: Fuse<Results>;
  public list: Results[] = [];

  static connect = {
    id: 'search',
    state: {
      active: Boolean,
      query: String,
      source: String,
      result: Array<{
        item: Results; refIndex: number
      }>
    },
    nodes: <const>[
      'list',
      'input'
    ]
  };

  async oninit () {

    const list = await fetch(this.state.source);

    this.list = await list.json();
    this.fuse = new Fuse(this.list, {
      keys: [
        'title',
        'text'
      ]
    });
  }

  hide () {

    removeEventListener('click', this.outsideClick);
    this.listNode.classList.replace('d-block', 'd-none');
    this.inputNode.classList.remove('is-active');
    this.state.active = false;
  }

  outsideClick (event: Event) {

    if (this.listNode !== event.target && this.inputNode !== event.target) {
      this.hide();
    }

  }

  onFocus () {

    this.inputNode.classList.add('is-active');

    if (this.state.result.length > 0) {
      if (!this.listNode.classList.contains('d-block')) {
        setTimeout(() => {
          this.listNode.classList.replace('d-none', 'd-block');
        }, 100);
      }
    }

  }

  onInput ({ target }: SPX.InputEvent<{}, HTMLInputElement>) {

    this.state.query = target.value;
    this.state.result = this.fuse.search(this.state.query);

    if (!this.state.active) {
      this.listNode.classList.replace('d-none', 'd-block');
      this.state.active = true;
      addEventListener('click', this.outsideClick.bind(this));
    }

    if (this.state.result.length === 0) {
      this.listNode.classList.replace('d-block', 'd-none');
    } else if (!this.listNode.classList.contains('d-block')) {
      this.listNode.classList.replace('d-none', 'd-block');
    }

    this.showList();

  }

  showList () {

    this.listNode.innerHTML = '';

    this.state.result.forEach(({ item }) => {
      const element = document.createElement('li');
      element.innerHTML = `<h6>${item.title}</h6><span>${item.text.slice(0, 80)}</span>`;
      this.listNode.appendChild(element);
    });

  }

  listNode: HTMLElement;
  inputNode: HTMLElement;

}
