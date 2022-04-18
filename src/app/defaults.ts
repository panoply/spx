/* eslint-disable no-unused-vars */

import { object } from '../shared/native';
/**
 * Default Configuration
 */
export function defaults (o: object) {

  const state = object(o);

  state.targets = [ 'body' ];
  state.timeout = 30000;
  state.poll = 15;
  state.schema = 'spx';
  state.async = true;
  state.cache = true;
  state.reverse = true;
  state.limit = 50;
  state.preload = null;
  state.persist = false;

  // HOVER
  state.hover = object(null);
  state.hover.trigger = 'attribute';
  state.hover.threshold = 250;

  // INTERSECTION
  state.intersect = object(null);
  state.intersect.rootMargin = '0px 0px 0px 0px';
  state.intersect.threshold = 0;

  // PROXIMITY
  state.proximity = object(null);
  state.proximity.distance = 75;
  state.proximity.threshold = 250;
  state.proximity.throttle = 500;

  // PROGRESS
  state.progress = object(null);
  state.progress.background = '#111';
  state.progress.height = '3px';
  state.progress.minimum = 0.8;
  state.progress.easing = 'linear';
  state.progress.speed = 300;
  state.progress.trickle = true;
  state.progress.threshold = 350;
  state.progress.trickleSpeed = 300;

  return state;

}
