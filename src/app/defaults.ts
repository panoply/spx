/* eslint-disable no-unused-vars */

import { IConfig } from 'types';

/**
 * Default Configuration
 */
export const defaults = (): IConfig => ({
  selectors: {},
  targets: [ 'body' ],
  timeout: 30000,
  schema: 'spx',
  manual: false,
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
    trigger: 'attribute',
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
    minimum: 0.09,
    easing: 'linear',
    speed: 300,
    trickle: true,
    threshold: 500,
    trickleSpeed: 300
  }
});
