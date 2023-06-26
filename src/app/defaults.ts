/* eslint-disable no-unused-vars */

import { assign, object } from 'src/shared/native';
import { IConfig } from 'types';

/**
 * Default Configuration
 */
export const defaults = (): IConfig => (assign(object(null), <IConfig>{
  selectors: object(null),
  targets: [ 'body' ],
  timeout: 30000,
  globalThis: true,
  schema: 'spx',
  manual: false,
  logs: true,
  cache: true,
  limit: 100,
  preload: null,
  async: true,
  annotate: false,
  eval: {
    script: null,
    style: null,
    link: null,
    meta: false
  },
  hover: {
    trigger: 'href',
    threshold: 250
  },
  intersect: {
    rootMargin: '0px 0px 0px 0px',
    threshold: 0
  },
  proximity: {
    distance: 75,
    threshold: 250,
    throttle: 500
  },
  progress: {
    background: '#111',
    height: '3px',
    minimum: 0.08,
    easing: 'linear',
    speed: 200,
    trickle: true,
    threshold: 500,
    trickleSpeed: 200
  }
}));
