/* eslint-disable no-unused-vars */
import type { Config, IEval, IObserverOptions, Options, Selectors, LiteralUnion } from 'types';
import { $ } from './session';
import { patchSetAttribute } from '../shared/patch';
import { Attributes, CharCode, LogLevel, LogType } from '../shared/enums';
import { assign, defineProps, isArray, nil, o } from '../shared/native';
import { log } from '../shared/logs';
import { hasProp } from '../shared/utils';
import { progress } from './progress';
import { registerComponents } from '../components/register';
import { api } from '../observe/history';

/**
 * Observe Options
 *
 * Merges observer configuration with defaults.
 */
export function observers (options: Options) {

  for (const key of <Array<keyof IObserverOptions>>[
    'hover',
    'intersect',
    'proximity',
    'progress'
  ]) {

    if (hasProp(options, key)) {

      if (options[key] === false) {
        $.config[key] = false;
      } else if (typeof options[key] === 'object') {
        assign($.config[key], options[key]);
      }

      delete options[key];

    }
  }

  return options;

}

/**
 * Selector Exclusion
 *
 * Omits observer qs from the query and applies a `false` to element qs.
 */
function not (attr: string, name: 'hover' | 'intersect' | 'proximity') {

  const prefix = `:not([${attr}${name}=false]):not([${attr}link])`;

  switch (name.charCodeAt(0)) {
    case CharCode.LCH: return `${prefix}:not([${attr}proximity]):not([${attr}intersect])`;
    case CharCode.LCI: return `${prefix}:not([${attr}hover]):not([${attr}proximity])`;
    case CharCode.LCP: return `${prefix}:not([${attr}intersect]):not([${attr}hover])`;
  }

};

/**
 * Evaluators
 *
 * Constructs the query selectors used in resource evaluation. This
 * is a curried caller, first call merges `eval` options, second assigns qs.
 */
function evaluators (options: Options, attr: string, disable: string) {

  if ('eval' in options) {
    if (options.eval) {
      if (typeof options.eval === 'object') {
        const e = assign<IEval, IEval>($.config.eval as IEval, options.eval);
        $.eval = !(!e.link && !e.meta && !e.script && !e.style);
      }
    } else {
      $.eval = false;
    }
  }

  return (tag: LiteralUnion<'style' | 'script' | 'link' | 'meta', string>) => {

    if ($.eval === false || $.config.eval[tag] === false) {
      return `${tag}[${attr}eval]:${disable}`;
    }

    if ($.config.eval[tag] === true) {
      return `${tag}:${disable}`;
    }

    const defaults = tag === 'link'
      ? `${tag}[rel=stylesheet]:${disable}`
      : tag === 'script'
        ? `${tag}:${disable}:not([${attr}eval=hydrate])`
        : `${tag}:${disable}`;

    if ($.config.eval[tag] === null) return defaults;
    if (isArray($.config.eval[tag] as string[])) {
      if ($.config.eval[tag].length > 0) {
        return $.config.eval[tag].map<string>((s: string) => `${s}:${disable}`).join(',');
      } else {
        log(LogType.WARN, `Missing eval ${tag} value, SPX will use defaults`);
        return defaults;
      }
    }

    log(LogType.TYPE, `Invalid eval ${tag} value, expected boolean or array`);

  };
}

/**
 * Fragment Selectors
 *
 * Validates that fragment selectors are id values.
 */
function fragments (options: Options) {

  const elements: string[] = [];

  if ('fragments' in options && isArray(options.fragments) && options.fragments.length > 0) {
    for (const fragment of options.fragments) {

      const charCode = fragment.charCodeAt(0);

      // check for . or [ starting characters
      if (charCode === CharCode.DOT || charCode === CharCode.LSB) {

        log(LogType.WARN, [
          `Invalid fragment selector "${fragment}" provided. Fragments must be id annotated values.`,
          'Use spx-target attributes for additional fragment selections.'
        ]);

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

}

/**
 * Initialize
 *
 * Connects store and intialized the workable state management model. Connect MUST be called
 * upon SPX initialization. This function acts as a class `constructor` establishing an instance.
 */
export function configure (options: Options = o()) {

  if ('logLevel' in options) {
    $.logLevel = options.logLevel;
    if ($.logLevel === LogLevel.VERBOSE) {
      log(LogType.VERBOSE, 'Verbose Logging');
    }
  }

  patchSetAttribute();

  defineProps($, {
    history: {
      get: () => typeof api.state === 'object' && 'spx' in api.state ? api.state.spx : null
    },
    ready: {
      get: () => document.readyState === 'complete'
    },
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

  assign<Config, Options>($.config, observers(options));

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

  // qs
  // Registers all the attribute a selector entries SPX will use
  assign<Selectors, Selectors>($.qs, {
    $attrs: new RegExp(`^href|${attr}(${Attributes.NAMES})$`, 'i'),
    $find: new RegExp(`${attr}(?:node|bind|component)|@[a-z]|[a-z]:[a-z]`, 'i'),
    $param: new RegExp(`^${attr}[a-zA-Z0-9-]+:`, 'i'),
    $target: `${attr}target`,
    $fragment: `${attr}fragment`,
    $fragments: `[${attr}fragment]`,
    $targets: `[${attr}target]:not(a[spx-target]):not([${attr}target=false])`,
    $morph: `${attr}morph`,
    $eval: `${attr}eval`,
    $intersector: `[${attr}intersect]${not(attr, 'intersect')}`,
    $track: `[${attr}track]:not([${attr}track=false])`,
    $component: `${attr}component`,
    $node: `${attr}node`,
    $bind: `${attr}bind`,
    $ref: 'data-spx',
    $href: $.config.annotate ? `a[${attr}link]${href}` : `a${href}`,
    $script: evals('script'),
    $style: evals('style'),
    $link: evals('link'),
    $meta: evals('meta'),
    $hydrate: `script[${attr}eval=hydrate]:${disable}`,
    $resource: `link[rel=stylesheet][href*=\\.css]:${disable},script[src*=\\.js]:${disable}`,
    $data: `${attr}data:`,
    $proximity: `a[${attr}proximity]${href}${not(attr, 'proximity')}`,
    $intersect: `a${href}${not(attr, 'intersect')}`,
    $hover: $.config.hover !== false && $.config.hover.trigger === 'href'
      ? `a${href}${not(attr, 'hover')}`
      : `a[${attr}hover]${href}${not(attr, 'hover')}`
  });

  // PROGRESS BAR
  progress.style($.config.progress);

};
