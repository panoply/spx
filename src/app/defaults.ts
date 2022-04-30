/* eslint-disable no-unused-vars */

import { object } from '../shared/native';
import { IConfig, IHover, IIntersect, IProgress, IProximity } from 'types';

/**
 * Default Configuration
 */
export function defaults () {

  const state: IConfig = object(null);

  state.targets = [ 'body' ];
  state.timeout = 30000;
  state.schema = 'spx';
  state.cache = true;
  state.limit = 100;
  state.preload = null;
  state.annotate = false;

  // HOVER
  state.hover = object(null) as IHover;
  state.hover.trigger = 'attribute';
  state.hover.threshold = 250;

  // INTERSECTION
  state.intersect = object(null) as IIntersect;
  state.intersect.rootMargin = '0px 0px 0px 0px';
  state.intersect.threshold = 0;

  // PROXIMITY
  state.proximity = object(null) as IProximity;
  state.proximity.distance = 75;
  state.proximity.threshold = 250;
  state.proximity.throttle = 500;

  // PROGRESS
  state.progress = object(null) as IProgress;
  state.progress.background = '#111';
  state.progress.height = '3px';
  state.progress.minimum = 0.09;
  state.progress.easing = 'linear';
  state.progress.speed = 300;
  state.progress.trickle = true;
  state.progress.threshold = 500;
  state.progress.trickleSpeed = 300;

  // SELECTORS
  state.selectors = object(null);

  return state;

}
