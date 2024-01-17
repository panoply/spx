/* eslint-disable no-unused-vars */

import { IConfig, IEval, IObserverOptions, IOptions } from 'types';
import { Attributes, Errors } from '../shared/enums';
import { assign, isArray, nil } from '../shared/native';
import { hasProp, log } from '../shared/utils';
import { $ } from './session';
import { progress } from './progress';
import { LiteralUnion } from 'type-fest';
import { registerOnConnect } from '../components/register';

export function observers (options: IOptions) {

  for (const key of <Array<keyof IObserverOptions>>[
    'hover',
    'intersect',
    'proximity',
    'progress'
  ]) {

    if (hasProp(options, key)) {
      if (options[key] === false) $.config[key] = false;
      else if (typeof options[key] === 'object') assign($.config[key], options[key]);
      delete options[key];
    }
  }

  return options;

}

/**
 * Initialize
 *
 * Connects store and intialized the workable state management model. Connect MUST be called
 * upon SPX initialization. This function acts as a class `constructor` establishing an instance.
 */
export function configure (options: IOptions = {}) {

  if (hasProp(options, 'components')) {
    registerOnConnect(options.components);
    delete options.components;
  }

  assign<IConfig, IOptions>($.config, observers(options));

  if (hasProp(options, 'eval')) {
    assign<IEval, IEval>($.config.eval, options.eval);
  }

  $.config.index = null;

  const schema = $.config.schema;
  const attr = $.config.schema = schema === 'spx'
    ? 'spx'
    : schema.endsWith('-')
      ? schema
      : schema === null ? nil : `${schema}-`;

  const href = `:not([${attr}disable]):not([href^="#"])`;
  const disable = `not([${attr}eval=false])`;

  // qs
  // Registers all the attribute a selector entries SPX will use

  $.qs.$target = `${attr}target`;
  $.qs.$morph = `${attr}morph`;
  $.qs.$render = `${attr}render`;
  $.qs.$component = `${attr}component`;
  $.qs.$node = `${attr}node`;
  $.qs.$componentAttrs = new RegExp(`${attr}(?:node|component)|@[a-z]|[a-z]:[a-z]`);
  $.qs.$componentBinds = new RegExp(`^${attr}[a-zA-Z0-9-]+:`);
  $.qs.$data = `${attr}data:`;
  $.qs.$hrefs = $.config.annotate ? `a[${attr}link]${href}` : `a${href}`;
  $.qs.$tracking = `[${attr}track]:not([${attr}track=false])`;
  $.qs.$scripts = evals('script');
  $.qs.$scriptsHydrate = `script[${attr}eval=hydrate]:not([${attr}eval=false])`;
  $.qs.$styles = evals('style');
  $.qs.$links = evals('link');
  $.qs.$metas = evals('meta');
  $.qs.$evals = `[${attr}eval]:not([${attr}eval=false]):not(script)`;
  $.qs.$attributes = new RegExp(`^href|${attr}(${Attributes.NAMES})$`, 'i');
  $.qs.$proximity = `a[${attr}proximity]${href}${not('proximity')}`;
  $.qs.$intersector = `[${attr}intersect]${not('intersect')}`;
  $.qs.$intersects = `a${href}${not('intersect')}`;
  $.qs.$hover = $.config.hover !== false && $.config.hover.trigger === 'href'
    ? `a${href}${not('hover')}`
    : `a[${attr}hover]${href}${not('hover')}`;

  // MEMORY
  $.memory.bytes = 0;
  $.memory.visits = 0;
  $.memory.limit = $.config.maxCache;

  // PROGRESS BAR
  progress.style($.config.progress);

  /**
   * Evaluators
   *
   * Constructs the qs for evaluation
   */
  function evals (tag: LiteralUnion<'style' | 'script' | 'link' | 'meta', string>) {

    const defaults = tag === 'link'
      ? `${tag}[rel=stylesheet]:${disable},${tag}[rel~=preload]:${disable}`
      : tag === 'script'
        ? `${tag}[${attr}eval]:${disable}:not([${attr}eval=hydrate])`
        : `${tag}:${disable}`;

    if ($.config.eval[tag] === false || $.config.eval[tag] === null) return defaults;
    if ($.config.eval[tag] === true) return `${tag}[${attr}eval]:${disable}`;
    if (isArray($.config.eval[tag] as string[])) {
      if ($.config.eval[tag].length > 0) {
        return $.config.eval[tag].map<string>((s: string) => `${s}:${disable}`).join(',');
      } else {
        log(Errors.WARN, `Missing eval ${tag} option, SPX will use defaults`);
        return defaults;
      }
    }

    log(Errors.TYPE, `Invalid eval ${tag} option, expected boolean or array`);

  }

  /**
   * Selector Exclusion
   *
   * Omits observer qs from the query and
   * applies a `false` to element qs.
   */
  function not (name: 'hover' | 'intersect' | 'proximity') {

    const s = `:not([${attr}${name}=false]):not([${attr}link])`;

    switch (name.charCodeAt(0)) {
      case 104: return `${s}:not([${attr}proximity]):not([${attr}intersect])`;
      case 105: return `${s}:not([${attr}hover]):not([${attr}proximity])`;
      case 112: return `${s}:not([${attr}intersect]):not([${attr}hover])`;
    }
  };
};
