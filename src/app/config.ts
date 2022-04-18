/* eslint-disable no-unused-vars */

import { Attributes } from '../shared/enums';
import { assign } from '../shared/native';
import { config, selectors } from './session';
import { IConfig, IOptions } from 'types';

/**
 * Initialize
 *
 * Connects store and intialized the workable
 * state management model. Connect MUST be called
 * upon Pjax initialization. This function acts
 * as a class `constructor` establishing an instance.
 */
export function configure (options: IOptions = {}): IConfig {

  if (options.hover !== undefined) {
    if (typeof options.hover !== 'boolean') assign(config.hover, options.hover);
    else if (options.hover === false) config.hover = options.hover;
    delete options.hover;
  }

  if (options.intersect !== undefined) {
    if (typeof options.intersect !== 'boolean') assign(config.intersect, options.intersect);
    else if (options.intersect === false) config.intersect = options.intersect;
    delete options.intersect;
  }

  if (options.proximity !== undefined) {
    if (typeof options.proximity !== 'boolean') assign(config.proximity, options.proximity);
    else if (options.proximity === false) config.proximity = options.proximity;
    delete options.proximity;
  }

  if (options.progress !== undefined) {
    if (typeof options.progress !== 'boolean') assign(config.progress, options.progress);
    else if (options.progress === false) config.progress = options.progress;
    delete options.progress;
  }

  // Name of attribute selector
  const n = config.schema === null ? 'data' : `data-${config.schema}`;

  // Href Omitter
  const h = `:not([${n}-disable]):not([href^="#"])`;

  // Selectors
  selectors.attrs = new RegExp('^href|' + n + '-(' + Attributes.NAMES + ')$', 'i');
  selectors.hydrate = `[${n}-hydrate]`;
  selectors.track = `[${n}-track]:not([${n}-track=false])`;
  selectors.script = `script:not([${n}-eval=false])`;
  selectors.style = `style:not([${n}-eval=false])`;
  selectors.styleLink = `link[rel=stylesheet]:not([${n}-eval=false])`;
  selectors.href = `a${h}`;

  if (config.intersect !== false) {
    selectors.intersect = `[${n}-intersect]:not([${n}-intersect=false])`;
    selectors.interHref = `a${h}:not([${n}-intersect=false])`;
  }

  if (config.proximity !== false) {
    selectors.proximity = `a[${n}-proximity]${h}:not([${n}-proximity=false])`;
  }

  if (config.hover !== false) {
    selectors.hover = config.hover.trigger === 'href'
      ? `a${h}:not([${n}-hover=false]):not([${n}-intersect]):not([${n}-proximity])`
      : `a[${n}-hover]${h}:not([${n}-hover=false]):not([${n}-intersect]):not([${n}-proximity])`;
  }

  return assign<IConfig, IOptions>(config, options);

}
