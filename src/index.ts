import { LiteralUnion } from 'type-fest';
import { IConfig, IPage } from 'types';
import { defineGetter, forNode, hasProp, log, size } from './shared/utils';
import { $ } from './app/session';
import { configure } from './app/config';
import { getRoute, getKey } from './app/location';
import { Errors, EventType } from './shared/enums';
import { assign, d, isArray, isBrowser, o, origin } from './shared/native';
import { initialize, disconnect, observe } from './app/controller';
import { clear } from './app/store';
import * as store from './app/store';
import * as hrefs from './observers/hrefs';
import * as request from './app/fetch';
import * as renderer from './app/render';
import * as history from './observers/history';
import { on, off } from './app/events';
import { morph } from './morph/morph';
import { Component } from './components/extends';
import { register } from './components/register';

export function Decorator () {

}

/**
 * Supported
 */
const supported = !!(
  isBrowser &&
  window.history.pushState &&
  window.requestAnimationFrame &&
  window.addEventListener &&
  window.DOMParser &&
  window.Proxy
);

const spx = o({
  Component,
  supported,
  on,
  off,
  observe,
  connect,
  capture,
  form,
  render,
  session,
  state,
  reload,
  fetch,
  clear,
  hydrate,
  prefetch,
  visit,
  disconnect,
  register,
  history: o({
    get state () { return history.api.state; },
    api: history.api,
    push: history.push,
    replace: history.replace,
    has: history.has,
    reverse: history.reverse
  }),
  get config () {
    return $.config;
  }
});

/**
 * Connect SPX
 */
function connect (options: IConfig = {}, ...components: any[]) {

  if (isBrowser === false) {
    return log(Errors.ERROR, 'Invalid runtime environment: window is undefined.');
  }

  if (!supported) {
    return log(Errors.ERROR, 'Browser does not support SPX');
  }

  if (!window.location.protocol.startsWith('http')) {
    return log(Errors.ERROR, 'Invalid protocol, SPX expects HTTPS or HTTP protocol');
  }

  configure(options);

  if ($.config.globalThis && hasProp(window, 'spx') === false) {
    defineGetter(window, 'spx', spx);
  }

  const promise = initialize();

  return async function (callback: any) {

    const state = (await promise);

    if (callback.constructor.name === 'AsyncFunction') {
      try {
        await callback(state);
      } catch (e) {
        log(Errors.WARN, 'Connection Error', e);
      }
    } else {
      callback(state);
    }

    log(Errors.INFO, 'Connection Established ⚡');

  };

};

/**
 * Session
 *
 * Returns the current SPX session
 */
function session (key?: string, update?: object) {

  if (key) {
    if (update) {
      if (key === 'config') configure(update);
      if (key === 'observe') assign($.observe, update);
    } else {
      if (key === 'config') return $.config;
      if (key === 'observe') return $.observe;
      if (key === 'components') return $.components;
      if (key === 'pages') return $.pages;
      if (key === 'snaps') return $.snaps;
      if (key === 'memory') return size($.memory.bytes);
    }
  }

  return {
    config: $.config,
    snaps: $.snaps,
    pages: $.pages,
    observers: $.observe,
    components: $.components,
    get memory () {
      const memory = $.memory;
      memory.size = size(memory.bytes);
      return memory;
    }
  };

}

/**
 * State Record
 *
 * Returns page state
 */
function state (key?: string | object, update?: object) {

  if (key === undefined) return store.get();

  if (typeof key === 'string') {

    const k = getKey(key);

    if (!store.has(k)) log(Errors.ERROR, `No store exists at: ${k}`);

    const record = store.get(k);

    return update !== undefined
      ? store.update(assign(record.page, update))
      : record;
  }

  if (typeof key === 'object') return store.update(key as IPage);

};

/**
 * Reload
 *
 * Reloads the current page
 */
async function reload () {

  const state = $.pages[history.api.state.key];
  state.type = EventType.RELOAD;
  const page = await request.fetch(state);

  if (page) {
    log(Errors.INFO, 'Triggered reload, page was re-cached');
    return renderer.update(page);
  }

  log(Errors.WARN, 'Reload failed, triggering refresh (cache will purge)');

  return location.assign(state.key);

};

/**
 * Fetch
 */
async function fetch (url: string) {

  const link = getRoute(url, EventType.FETCH);

  if (link.location.origin !== origin) {
    log(Errors.ERROR, 'Cross origin fetches are not allowed');
  }

  const dom = await request.request<Document>(link.key);

  if (dom) return dom;

}

async function render (url: string, pushState: 'intersect' | 'replace' | 'push', fn: (
  this: IPage,
  dom: Document,
) => Document) {

  const page = $.page;
  const route = getRoute(url);

  if (route.location.origin !== origin) log(Errors.ERROR, 'Cross origin fetches are not allowed');

  const dom = await request.request<Document>(route.key, { type: 'document' });

  if (!dom) log(Errors.ERROR, `Fetch failed for: ${route.key}`, dom);

  await fn.call(page, dom) as Document;

  if (pushState === 'replace') {

    page.title = dom.title;
    const state = store.update(assign(page, route), dom.documentElement.outerHTML);

    history.replace(state);

    return state;

  } else {

    return renderer.update(store.set(route, dom.documentElement.outerHTML));

  }

}

function capture (targets?: string[]) {

  const state = store.get();

  if (!state) return;

  const { page, dom } = state;

  targets = isArray(targets) ? targets : page.target;

  if (targets.length === 1 && targets[0] === 'body') {
    dom.body.replaceChildren(document.body);
    store.update(page, dom.documentElement.innerHTML);
    return;
  }

  const selector = targets.join(',');
  const current = d().querySelectorAll<HTMLElement>(selector);
  const nodes = dom.body.querySelectorAll<HTMLElement>(selector);

  forNode(nodes, (node, i) => {
    morph(node, current[i]);
  });

  store.update(page, dom.documentElement.innerHTML);

}

/**
 * Prefetch
 */
async function prefetch (link: string): Promise<void|IPage> {

  const path = getRoute(link, EventType.PREFETCH);

  if (store.has(path.key)) {
    log(Errors.WARN, `Cache already exists for ${path.key}, prefetch skipped`);
    return;
  }

  const prefetch = await request.fetch(store.create(path));
  if (prefetch) return prefetch;

  log(Errors.ERROR, `Prefetch failed for ${path.key}`);

};

async function form (action: string, options: {
  method: LiteralUnion<'POST' | 'PUT' | 'DELETE' | 'GET', string>,
  data: { [key: string]: string };
  hydrate?: string[]
}) {

  const body = new FormData();

  for (const key in options.data) {
    body.append(key, options.data[key]);
  }

  const submit = await request.request(action, {
    method: options.method,
    body
  });

  return submit;

}

/**
 * Hydrate the current document
 */
async function hydrate (link: string, nodes?: string[]): Promise<Document> {

  const route = getRoute(link, EventType.HYDRATE);

  request.fetch(route);

  if (isArray(nodes)) {

    route.hydrate = [];
    route.preserve = [];

    for (const node of nodes) {
      if (node.charCodeAt(0) === 33) {
        route.preserve.push(node.slice(1));
      } else {
        route.hydrate.push(node);
      }
    }

  } else {
    route.hydrate = $.config.fragments;
  }

  const page = await request.wait(route);

  if (page) {

    const { key } = history.api.state;

    history.replace(page);
    renderer.update(page);

    if (route.key !== key) {
      if ($.index === key) $.index = route.key;
      for (const p in $.pages) if ($.pages[p].rev === key) $.pages[p].rev = route.key;
      store.clear(key);
    }

  }

  return store.get(page.key).dom;

};

/**
 * Visit
 */
async function visit (link: string, options?: IPage): Promise<void|IPage> {

  const route = getRoute(link);
  const merge = typeof options === 'object' ? assign(route, options) : route;

  return store.has(route.key)
    ? hrefs.navigate(route.key, store.update(merge))
    : hrefs.navigate(route.key, store.create(merge));

};

export default spx;
