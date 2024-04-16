/* eslint-disable no-use-before-define */

import spx, { SPX } from 'spx';
import Fuse from 'fuse.js';

interface Results {
  title: string;
  anchor: string;
  content: string;
  heading: string;
  url: string;
}

export class Search extends spx.Component<typeof Search.define> {

  static define = {
    id: 'search',
    state: {
      active: Boolean,
      query: String,
      source: String
    },
    nodes: <const>[
      'list',
      'input'
    ]
  };

  async connect () {

    const list = await fetch(this.state.source);

    this.list = await list.json();
    this.fuse = new Fuse(this.list, {
      keys: [ 'title', 'content' ],
      threshold: 0,
      includeMatches: false
    });
  }

  hide () {

    removeEventListener('click', this.outsideClick);
    this.listNode.classList.replace('d-block', 'd-none');
    this.inputNode.classList.remove('is-active', 'is-results');
    this.state.active = false;
  }

  outsideClick (event: Event) {

    if (this.listNode !== event.target && this.inputNode !== event.target) {
      this.hide();
    }

  }

  onFocus () {

    this.inputNode.classList.add('is-active');

    if (this.result.length > 0 && !this.listNode.classList.contains('d-block')) {
      setTimeout(() => this.listNode.classList.replace('d-none', 'd-block'), 80);
      this.inputNode.classList.add('is-results');
    }

    if (this.state.query.length <= 2) {
      this.inputNode.classList.remove('is-results');
    } else {
      this.inputNode.classList.add('is-results');
    }

  }

  onInput ({ target }: SPX.InputEvent<{}, HTMLInputElement>) {

    this.state.query = target.value;
    this.result = [];
    this.result = this.fuse.search(this.state.query, {
      limit: 10
    });

    if (!this.state.active) {
      this.listNode.classList.replace('d-none', 'd-block');
      this.state.active = true;
      addEventListener('click', this.outsideClick.bind(this));
    }

    if (this.state.query.length === 0) {
      this.inputNode.classList.remove('is-results');
      this.listNode.classList.replace('d-block', 'd-none');
    } else if (!this.listNode.classList.contains('d-block')) {
      this.listNode.classList.replace('d-none', 'd-block');
    }

    this.showList();

  }

  showList () {

    if (this.state.query.length < 1) {
      this.inputNode.classList.remove('is-results');
    } else {
      this.inputNode.classList.add('is-results');
    }

    const result: { [heading: string]: { url: string; items: string[] } } = {};
    const match = new RegExp(`(${this.state.query})`, 'gi');

    this.listNode.classList.remove('no-results');
    this.listNode.innerHTML = '';
    this.result.forEach(({ item }) => {

      const offset = item.content.search(match);
      const slice = item.content.slice(offset);

      if (slice.trim().length > 0) {

        const value = slice.trim().slice(0, 100);

        if (value.length > 2) {

          if (!(item.title in result)) {
            result[item.title] = {
              url: item.url,
              items: []
            };
          }

          result[item.title].items.push(
            '<div class="result">',
            '<span>',
            value.replace(match, '<strong class="fc-blue">$1</strong>'),
            '...',
            '</span>',
            '</div>'
          );
        }
      }
    });

    const items = Object.keys(result);

    if (items.length === 0) {
      const element = document.createElement('li');
      element.innerHTML = '<h4 class="mb-0">No Results</h4>';
      this.listNode.classList.add('no-results');
      this.listNode.appendChild(element);
    } else {
      items.forEach(group => {
        const record = result[group];
        const element = document.createElement('li');
        element.innerHTML = `<a href="${record.url}"><h5>${group}</h5>${record.items.join('')}</a>`;
        this.listNode.appendChild(element);
      });
    }
  }

  public listNode: HTMLElement;
  public inputNode: HTMLElement;
  public fuse: Fuse<Results>;
  public list: Results[] = [];
  public result: Array<{ item: Results; refIndex: number; }> = [];

}
