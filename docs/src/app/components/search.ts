/* eslint-disable no-use-before-define */

import type { SearchContent, SearchHeading, SearchIndex, SearchPage } from '@e11ty/eleventy-plugin-search-index';
import spx, { SPX } from 'spx';
import { matchSorter } from 'match-sorter';

export class Search extends spx.Component<typeof Search.define> {

  /** Component definition */
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

  /** Component connect lifecyle method */
  public async connect () {

    this.index = await this.getJSON();

  }

  /** Keypress event via `spx@window:keypress` */
  public onKeyboard (event: SPX.KeyboardEvent) {

    if (!this.state.active) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        this.dom.inputNode.focus();
        this.onFocus();
        this.getResults(this.index.content.map(item => this.getItem(item)));
        this.show();
      }
    } else {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.close();
      }
    }

  };

  /** Focus event via `spx@focus` */
  public onFocus () {

    this.dom.inputNode.classList.add('is-active');
    this.dom.inputNode.addEventListener('transitionend', this.show.bind(this));
    this.open();

  }

  /** Input event via `spx@input` */
  public onInput (event: SPX.InputEvent<{}, HTMLInputElement>) {

    const input = this.state.query = event.target.value.trim();

    if (input.length > 1) {

      this.result = matchSorter(this.index.content, input, this.match);

      if (this.result.length === 0) {
        this.dom.listNode.innerHTML = '';
        this.dom.listNode.classList.add('no-results');
        this.dom.listNode.appendChild(this.noResults);
      } else {
        this.getResults(this.result.sort((a, b) => a.sort - b.sort).map(item => this.getItem(item)));
      }

      this.show();

    } else if (input.length === 0) {
      this.dom.inputNode.classList.remove('is-results');
      this.dom.listNode.classList.replace('d-block', 'd-none');
    }

  }

  /** Retrive the search index JSON */
  private async getJSON () {

    return (await fetch(this.state.source)).json();

  }

  /** Close and contract the `<input>` element */
  private close () {

    this.html.removeEventListener('click', this.hide);
    this.dom.listNode.classList.replace('d-block', 'd-none');
    this.dom.inputNode.classList.remove('is-active', 'is-results');
    this.state.active = false;

  }

  /** Open and expand the of the `<input>` element */
  private open () {

    this.state.active = !this.state.active;
    this.state.active && this.html.addEventListener('click', this.hide.bind(this));

  }

  /** Show the search results list */
  private show () {

    if (this.state.active) {
      this.result.length > 0 && !this.dom.listNode.classList.contains('d-block') &&
      this.dom.listNode.classList.replace('d-none', 'd-block');
      this.dom.inputNode.classList.add('is-results');
    }
  }

  /** Hide the search results list */
  private hide (event: Event) {

    this.dom.listNode !== event.target && this.dom.inputNode !== event.target && this.close();

  }

  /** Generate workable search item reference */
  private getItem (content: SearchContent) {

    const { pidx, hidx } = content;

    return { page: this.index.pages[pidx], heading: this.index.heading[hidx], content };

  }

  /** Extract match location in the search index */
  private getMatch (text: string) {

    const R = 7;
    const offset = text.search(this.onMatch);

    if (offset === 0) return text.replace(this.onMatch, '<strong>$1</strong>');

    const before = text.slice(0, offset);
    const words = before.trim().split(/\s+/);
    const dot = before.lastIndexOf('.', offset);
    const line = words.length >= R && dot !== -1 && dot >= before.length - R * words[words.length - 1].length
      ? text.slice(dot + 1)
      : text.slice(offset);

    return line.trim().replace(this.onMatch, '<strong>$1</strong>');

  }

  /** Renders the search results to the list */
  private getResults (result: { page: SearchPage; heading: SearchHeading; content: SearchContent; }[]) {

    this.dom.listNode.classList.remove('no-results');
    this.dom.listNode.innerHTML = '';

    const nodes = result.map((
      {
        content,
        page,
        heading
      }
    ) => {

      return spx.dom`
      <li>
        <a href="${heading.anchor}" class="d-flex ai-center">
          <div class="w-icon">
            <svg class="icon">
              <use xlink:href="#svg-search-${content.type}" />
            </svg>
          </div>
        <div class="px-3">
          <div class="result">
            ${this.getMatch(content.text)}
          </div>
          <div class="d-block upper ff-heading fw-bold fc-dark-gray fs-xs">
            ${
              content.type === 'heading'
                ? page.title
                : `${page.title} → ${this.index.content[heading.cidx[0]].text.replace(/\.$/, '')}`
            }
          </div>
          </div>
          <div class="w-icon">
            <svg class="icon icon-goto">
              <use xlink:href="#svg-search-goto" />
            </svg>
          </div>
        </a>
      </li>
    `;
    });

    this.dom.listNode.append(...nodes);

  }

  /** Regular expression match of current `<input>` value */
  get onMatch () {
    return new RegExp(`(${this.state.query})`, 'gi');
  }

  /** No results list item if search query has no results */
  get noResults () {
    return spx.dom`
      <li>
        <div class="row jc-center">
          <h4 class="col-12 tc mb-3">
            "<span class="fc-gray normal">${this.state.query}</span>"
          </h4>
          <h6 class="col-12 fs-xs tc mb-3 fc-white">
            Nothing Found
          </h6>
          <div class="col-auto">
            <svg class="icon icon-clown mx-auto"><use xlink:href="#svg-clown" /></svg>
          </div>
        </div>
      </li>
    `;
  }

  /** Cache reference of search index */
  public index: SearchIndex;

  /** The filtered search result */
  public result: SearchContent[] = [];

  /** The {@link matchSorter} ioptions */
  public match = { keys: [ { threshold: matchSorter.rankings.CONTAINS, key: 'text' } ] };

}
