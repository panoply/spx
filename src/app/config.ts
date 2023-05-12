/* eslint-disable no-unused-vars */

import { Attributes, Errors } from '../shared/enums';
import { assign, isArray } from '../shared/native';
import { config, memory } from './session';
import { IConfig, IEval, IHover, IOptions } from 'types';
import { hasProp, log } from '../shared/utils';

export function observers (options: IOptions) {

  if (hasProp(options, 'hover')) {
    if (options.hover === false) config.hover = false;
    else if (typeof options.hover === 'object') assign(config.hover, options.hover);
    delete options.hover;
  }

  if (hasProp(options, 'intersect')) {
    if (options.intersect === false) config.intersect = false;
    else if (typeof options.intersect === 'object') assign(config.intersect, options.intersect);
    delete options.intersect;
  }

  if (hasProp(options, 'proximity')) {
    if (options.proximity === false) config.proximity = false;
    else if (typeof options.proximity === 'object') assign(config.proximity, options.proximity);
    delete options.proximity;
  }

  if (hasProp(options, 'progress')) {
    if (options.progress === false) config.progress = false;
    else if (typeof options.progress === 'object') assign(config.progress, options.progress);
    delete options.progress;
  }

  return options;

}

/**
 * Initialize
 *
 * Connects store and intialized the workable
 * state management model. Connect MUST be called
 * upon SPX initialization. This function acts
 * as a class `constructor` establishing an instance.
 */
export function configure (options: IOptions = {}) {

  assign<IConfig, IOptions>(config, observers(options));

  if (hasProp(options, 'eval')) assign<IEval, IEval>(config.eval, options.eval);

  config.index = null;

  const schema = config.schema === null;
  const attr = schema ? 'data' : `data-${config.schema}`;
  const href = `:not([${attr}-disable]):not([href^="#"])`;

  config.selectors.hrefs = config.annotate ? schema ? `a[data-spx]${href}` : `a[${attr}]${href}` : `a${href}`;
  config.selectors.tracking = `[${attr}-track]:not([${attr}-track=false])`;
  config.selectors.scripts = evals('script');
  config.selectors.styles = evals('style');
  config.selectors.links = evals('link');
  config.selectors.metas = evals('meta');
  config.selectors.evals = `[${attr}-eval]:not([${attr}-eval=false]):not(script)`;
  config.selectors.attributes = new RegExp('^href|' + attr + '-(' + Attributes.NAMES + ')$', 'i');
  config.selectors.proximity = `a[${attr}-proximity]${href}${not('proximity')}`;
  config.selectors.intersector = `[${attr}-intersect]${not('intersect')}`;
  config.selectors.intersects = `a${href}${not('intersect')}`;
  config.selectors.hover = (config.hover as IHover).trigger === 'href'
    ? `a${href}${not('hover')}`
    : `a[${attr}-hover]${href}${not('hover')}`;

  // MEMORY
  memory.bytes = 0;
  memory.visits = 0;
  memory.limit = config.limit;

  /**
   * Evaluators
   *
   * Constructs the selectors for evaluation
   */
  function evals (tag: 'style' | 'script' | 'link' | 'meta') {

    const disable = `not([${attr}-eval=false])`;
    const defaults = tag === 'link'
      ? `${tag}[rel=stylesheet]:${disable},${tag}[rel~=preload]:${disable}`
      : tag === 'script'
        ? `${tag}[${attr}-eval]:${disable}`
        : `${tag}:${disable}`;

    if (config.eval[tag] === false || config.eval[tag] === null) return defaults;
    if (config.eval[tag] === true) return `${tag}[${attr}-eval]:${disable}`;
    if (isArray(config.eval[tag] as string[])) {
      if ((config.eval[tag] as string[]).length > 0) {
        return (config.eval[tag] as string[]).map(s => `${s}:${disable}`).join(',');
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
   * Omits observer selectors from the query and
   * applies a `false` to element selectors.
   */
  function not (name: 'hover' | 'intersect' | 'proximity') {
    const s = `:not([${attr}-${name}=false])`;
    if (name.charCodeAt(0) === 104) return `${s}:not([${attr}-proximity]):not([${attr}-intersect])`;
    if (name.charCodeAt(0) === 105) return `${s}:not([${attr}-hover]):not([${attr}-proximity])`;
    if (name.charCodeAt(0) === 112) return `${s}:not([${attr}-intersect]):not([${attr}-hover])`;
  };
};
