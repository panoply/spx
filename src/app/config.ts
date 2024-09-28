/* eslint-disable no-unused-vars */
import type { Config, IEval, IObserverOptions, Options, Selectors, LiteralUnion } from 'types';
import { $ } from './session';
import { patchSetAttribute } from '../shared/patch';
import { Attributes, CharCode, LogLevel, Log } from '../shared/enums';
import { nil, o } from '../shared/native';
import { hasProp } from '../shared/utils';
import { progress } from './progress';
import { registerComponents } from '../components/register';
import { api } from '../observe/history';
import * as log from '../shared/logs';

/**
 * Observe Options
 *
 * Merges observer configuration with defaults.
 */
export const observers = (options: Options) => {

  for (const key of <Array<keyof IObserverOptions>>[ 'hover', 'intersect', 'proximity', 'progress' ]) {

    if (hasProp(options, key)) {

      if (options[key] === false) {
        $.config[key] = false;
      } else if (typeof options[key] === 'object') {
        Object.assign($.config[key], options[key]);
      }

      delete options[key];

    }
  }

  return options;

};

/**
 * Selector Exclusion
 *
 * Omits observer qs from the query and applies a `false` to element qs.
 */
const not = (attr: string, name: 'hover' | 'intersect' | 'proximity') => {

  const prefix = `:not([${attr}${name}=false]):not([${attr}link]):not`;

  switch (name.charCodeAt(0)) {
    case CharCode.LCH: return `${prefix}([${attr}proximity]):not([${attr}intersect])`;
    case CharCode.LCI: return `${prefix}([${attr}hover]):not([${attr}proximity])`;
    case CharCode.LCP: return `${prefix}([${attr}intersect]):not([${attr}hover])`;
  }

};

/**
 * Evaluators
 *
 * Constructs the query selectors used in resource evaluation. This
 * is a curried caller, first call merges `eval` options, second assigns qs.
 */
const evaluators = (options: Options, attr: string, disable: string) => {

  if ('eval' in options) {
    if (options.eval) {
      if (typeof options.eval === 'object') {
        const e = Object.assign<IEval, IEval>($.config.eval as IEval, options.eval);
        $.eval = !(e.link === false && e.meta === false && e.script === false && e.style === false);
      }
    } else {
      $.eval = false;
    }
  }

  return (tag: LiteralUnion<'style' | 'script' | 'link' | 'meta', string>) => {

    if ($.eval === false || $.config.eval[tag] === false) return `${tag}[${attr}eval]:${disable}`;
    if ($.config.eval[tag] === true) return `${tag}:${disable}`;

    const defaults = tag === 'link'
      ? `${tag}[rel=stylesheet]:${disable}`
      : `${tag}:${disable}${tag === 'script' ? `:not([${attr}eval=hydrate])` : ''}`;

    if ($.config.eval[tag] === null) return defaults;
    if (Array.isArray($.config.eval[tag] as string[])) {
      if ($.config.eval[tag].length > 0) {
        return $.config.eval[tag].map<string>((s: string) => `${s}:${disable}`).join(',');
      } else {
        log.warn(`Missing eval ${tag} value, default will be used`);
        return defaults;
      }
    }

    log.error(`Invalid "eval" ${tag} value, expected boolean or array type`);

  };
};

/**
 * Fragment Selectors
 *
 * Validates that fragment selectors are id values.
 */
const fragments = (options: Options) => {

  const elements: string[] = [];

  if ('fragments' in options && Array.isArray(options.fragments) && options.fragments.length > 0) {
    for (const fragment of options.fragments) {

      const charCode = fragment.charCodeAt(0);

      // check for . or [ starting characters
      if (charCode === CharCode.DOT || charCode === CharCode.LSB) {
        log.warn(`Invalid fragment, only element id values allowed: "${fragment}"`);
        continue;
      } else if (charCode === CharCode.HSH) { // hash selectors will augment, eg: #foo > foo
        elements.push(fragment.trim());
      } else {
        elements.push(`#${fragment.trim()}`);
      }
    }
  } else {

    return [ 'body' ];

  }

  return elements;

};

/**
 * Initialize
 *
 * Connects store and intialized the workable state management model. Connect MUST be called
 * upon SPX initialization. This function acts as a class `constructor` establishing an instance.
 */
export const configure = (options: Options = o()) => {

  if ('logLevel' in options) {
    $.logLevel = options.logLevel;
    $.logLevel === LogLevel.DEBUG && log.debug('DEBUG MODE');
  }

  patchSetAttribute();

  Object.defineProperties($, {
    history: { get: () => typeof api.state === 'object' && 'spx' in api.state ? api.state.spx : null },
    ready: { get: () => document.readyState === 'complete' },
    types: {
      get: () => o({
        INITIAL: 0,
        PREFETCH: 1,
        FETCH: 2,
        PRELOAD: 3,
        REVERSE: 4,
        POPSTATE: 5,
        VISIT: 6,
        HYDRATE: 7,
        CAPTURE: 8,
        RELOAD: 9,
        HOVER: 10,
        INTERSECT: 11,
        PROXIMITY: 12
      })
    }
  });

  if ('components' in options) {

    registerComponents(options.components);

    // We can dispose of the components passed on options
    // as we assign them to the registry.
    delete options.components;

  }

  Object.assign<Config, Options>($.config, observers(options));

  const schema = $.config.schema;
  const attr = schema === 'spx' ? 'spx' : schema.endsWith('-') ? schema : schema === null ? nil : `${schema}-`;
  const href = `:not([${attr}disable]):not([href^=\\#])`;
  const disable = `not([${attr}eval=false])`;
  const evals = evaluators(options, attr, disable);

  $.config.fragments = fragments(options);
  $.config.schema = attr;
  $.config.index = null;
  $.memory.bytes = 0;
  $.memory.visits = 0;
  $.memory.limit = $.config.maxCache;

  $.qs.$attrs = new RegExp(`^href|${attr}(${Attributes.NAMES})$`, 'i');
  $.qs.$find = new RegExp(`${attr}(?:node|bind|component)|@[a-z]|[a-z]:[a-z]`, 'i');
  $.qs.$param = new RegExp(`^${attr}[a-zA-Z0-9-]+:`, 'i');
  $.qs.$target = `${attr}target`;
  $.qs.$fragment = `${attr}fragment`;
  $.qs.$fragments = `[${$.qs.$fragment}]`;
  $.qs.$targets = `[${attr}target]:not(a[spx-target]):not([${attr}target=false])`;
  $.qs.$morph = `${attr}morph`;
  $.qs.$eval = `${attr}eval`;
  $.qs.$intersector = `[${attr}intersect]${not(attr, 'intersect')}`;
  $.qs.$track = `[${attr}track]:not([${attr}track=false])`;
  $.qs.$component = `${attr}component`;
  $.qs.$node = `${attr}node`;
  $.qs.$bind = `${attr}bind`;
  $.qs.$ref = 'data-spx';
  $.qs.$href = `a${$.config.annotate ? `[${attr}link]` : ''}${href}`;
  $.qs.$script = evals('script');
  $.qs.$style = evals('style');
  $.qs.$link = evals('link');
  $.qs.$meta = evals('meta');
  $.qs.$hydrate = `script[${attr}eval=hydrate]:${disable}`;
  $.qs.$resource = `link[rel=stylesheet][href*=\\.css]:${disable},script[src*=\\.js]:${disable}`;
  $.qs.$data = `${attr}data:`;
  $.qs.$proximity = `a[${attr}proximity]${href}${not(attr, 'proximity')}`;
  $.qs.$intersect = `a${href}${not(attr, 'intersect')}`;
  $.qs.$hover = $.config.hover !== false && $.config.hover.trigger === 'href'
    ? `a${href}${not(attr, 'hover')}`
    : `a[${attr}hover]${href}${not(attr, 'hover')}`;

  // PROGRESS BAR
  progress.style($.config.progress);

};
