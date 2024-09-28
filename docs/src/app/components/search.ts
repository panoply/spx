/* eslint-disable no-use-before-define */

import type { SearchContent, SearchHeading, SearchIndex, SearchPage } from '@e11ty/eleventy-plugin-search-index';
import spx, { SPX } from 'spx';
import { matchSorter } from 'match-sorter';

export class Search extends spx.Component({
  name: 'search',
  sugar: true,
  nodes: <const>[
    'list',
    'input'
  ],
  state: {
    active: Boolean,
    query: String,
    source: String,
    result: Number
  }
}) {

  /** Component connect lifecyle method */
  public async connect () {

    this.index = await this.getJSON();

  }

  /** Keypress event via `spx@window:keypress` */
  public onKeyboard (event: SPX.KeyboardEvent) {

    if (!this.state.active) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        this.input.focus();
        this.onFocus();
        this.show();
        this.getResults(this.index.content.map(item => this.getItem(item)));
      }
    } else {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.close();
      } else if (event.key === 'ArrowDown') {
        if (this.list.childElementCount - 1 === this.state.result) this.state.result = 0;
        this.selected.classList.remove('selected');
        this.list.children.item(++this.state.result).classList.add('selected');
        this.selected.scrollIntoView();
      } else if (event.key === 'ArrowUp') {
        if (this.state.result === 0) {
          this.selected.classList.remove('selected');
          this.state.result = this.list.childElementCount - 1;
          this.selected.scrollIntoView();
        } else if (this.list.childElementCount > 1) {
          this.selected.classList.remove('selected');
          this.list.children.item(--this.state.result).classList.add('selected');
          this.selected.scrollIntoView();
        }
      }
    }

  };

  /** Focus event via `spx@focus` */
  public onFocus () {

    this.input.addClass('is-active');
    this.input.addEventListener('transitionend', this.show.bind(this));
    this.open();

  }

  /** Input event via `spx@input` */
  public onInput (event: SPX.InputEvent<{}, HTMLInputElement>) {

    const input = this.state.query = event.target.value.trim();

    if (input.length > 2) {

      this.result = matchSorter(this.index.content, input, this.match);

      if (this.result.length === 0) {
        this.list.innerHTML = '';
        this.list.classList.add('no-results');
        this.list.appendChild(this.noResults);
      } else {
        this.getResults(this.result.sort((a, b) => a.sort - b.sort).map(item => this.getItem(item)));
      }

      this.show();

    } else if (input.length === 0) {
      this.input.removeClass('is-results');
      this.list.toggleClass('d-block', 'd-none');
    }

  }

  /** Retrive the search index JSON */
  private async getJSON () {

    return (await fetch(this.state.source)).json();

  }

  /** Close and contract the `<input>` element */
  private close () {

    this.root.removeEventListener('click', this.hide);
    this.list.toggleClass('d-block', 'd-none');
    this.input.removeClass('is-active', 'is-results');
    this.state.active = false;

  }

  /** Open and expand the of the `<input>` element */
  private open () {

    this.state.active = !this.state.active;
    this.state.active && this.root.addEventListener('click', this.hide.bind(this));

  }

  /** Show the search results list */
  private show () {

    if (this.state.active) {
      this.result.length > 0 && !this.list.classList.contains('d-block') &&
      this.list.toggleClass('d-none', 'd-block');
      this.input.addClass('is-results');
    }
  }

  /** Hide the search results list */
  private hide (event: Event) {

    this.list.toNode() !== event.target && this.input.toNode() !== event.target && this.close();

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
    const dot = before.lastIndexOf(' ', offset);
    const line = words.length >= R && dot !== -1 && dot >= before.length - R * words[words.length - 1].length
      ? text.slice(dot + 1)
      : text.slice(text.indexOf(' ', offset));

    return line.trim().replace(this.onMatch, '<strong>$1</strong>');

  }

  /** Renders the search results to the list */
  private getResults (result: { page: SearchPage; heading: SearchHeading; content: SearchContent; }[]) {

    this.list.classList.remove('no-results');
    this.list.innerHTML = '';

    const nodes = result.map((
      {
        content,
        page,
        heading
      },
      index
    ) => {

      return spx.dom`
      <li tabindex="-1" class="${index === 0 ? 'selected' : ''}">
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

    this.state.result = 0;
    this.list.append(...nodes);

  }

  get selected () {
    return this.list.children[this.state.result];
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
